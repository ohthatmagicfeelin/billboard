import { SpotifyPlaybackApi } from '../api/spotifyPlaybackApi.js';
import { SpotifyAuthRepository } from '../../auth/repositories/spotifyAuthRepository.js';
import { SpotifyMatchService } from '../../matching/services/spotifyMatchService.js';
import { AppError } from '../../../../utils/AppError.js';

export const SpotifyPlaybackService = {
  
  async searchTrack(song, artist, userId) {
    try {
      const tokens = await SpotifyAuthRepository.getUserTokens(userId);
      if (!tokens?.spotifyAccessToken) {
        throw new AppError('Not connected to Spotify', 401);
      }

      // Search for tracks with pagination
      console.log("\nSearching for track:", song);
      
      const artistMap = new Map();
      const searchArtist = artist.toLowerCase();
      let offset = 0;
      let hasMore = true;

      while (hasMore && offset < 1000) { // Limit to 20 pages of results
        console.log(`\nChecking page ${(offset/50) + 1}...`);
        
        const trackResponse = await SpotifyPlaybackApi.searchTracksWithPagination(
          tokens.spotifyAccessToken,
          `${song} ${artist}`,
          offset
        );

        const tracks = trackResponse.data.tracks.items;
        if (!tracks.length) {
          hasMore = false;
          break;
        }

        // Process artists from this page
        tracks.forEach(track => {
          track.artists.forEach(trackArtist => {
            if (!artistMap.has(trackArtist.id)) {
              const similarity = calculateArtistSimilarity(searchArtist, trackArtist.name.toLowerCase());
              if (similarity >= 0.7) {
                artistMap.set(trackArtist.id, {
                  id: trackArtist.id,
                  name: trackArtist.name,
                  similarity: similarity,
                  popularity: track.popularity
                });
              }
            }
          });
        });

        // If we found some good matches, no need to keep searching
        const goodMatches = Array.from(artistMap.values()).filter(a => a.similarity > 0.9);
        if (goodMatches.length > 0) {
          console.log("Found high-similarity matches, stopping search");
          break;
        }

        offset += 50;
      }

      // Convert to array and sort by similarity, then popularity
      const matchedArtists = Array.from(artistMap.values())
        .sort((a, b) => {
          if (Math.abs(b.similarity - a.similarity) < 0.1) {
            return b.popularity - a.popularity;
          }
          return b.similarity - a.similarity;
        });

      // Log results
      if (matchedArtists.length > 0) {
        console.log("\nPotential artist matches (similarity threshold: 0.7):");
        matchedArtists.forEach(artist => {
          console.log(`${artist.name} (similarity: ${artist.similarity.toFixed(2)}, popularity: ${artist.popularity})`);
        });
      } else {
        console.log("\nNo matching artists found");
      }
      console.log("\n");

      // For each matched artist above threshold, first check their top tracks
      for (const artistMatch of matchedArtists) {
        console.log(`\nSearching top tracks for ${artistMatch.name}...`);
        
        try {
          const topTracksResponse = await SpotifyPlaybackApi.getArtistTopTracks(
            tokens.spotifyAccessToken,
            artistMatch.id
          );

          const topTracks = topTracksResponse.data.tracks;
          const matches = topTracks
            .map(track => ({
              track,
              score: calculateTrackNameScore(song, track.name),
              popularity: track.popularity
            }))
            .filter(result => result.score.total >= 150)
            .sort((a, b) => {
              // If scores are close (within 25 points), prefer the more popular track
              if (Math.abs(b.score.total - a.score.total) <= 25) {
                return b.track.popularity - a.track.popularity;
              }
              return b.score.total - a.score.total;
            });

          if (matches.length > 0) {
            console.log('\nFound matches in top tracks:');
            matches.forEach(match => {
              console.log(`Score ${match.score.total}: ${match.track.name} (${match.score.reason})`);
            });

            // If we found an exact match or a "Single Version", use it
            const exactMatch = matches.find(m => 
              m.score.total >= 200 || 
              (m.score.total >= 150 && m.track.name.toLowerCase().includes('single version'))
            );
            
            if (exactMatch) {
              console.log("Found high-quality match in top tracks, attempting to play");
              try {
                await SpotifyPlaybackApi.playTrack(tokens.spotifyAccessToken, exactMatch.track.uri);
                console.log("Track playback started successfully");

                // Save the match to database
                await SpotifyMatchService.saveSpotifyMatch({
                  billboardArtistName: artist,
                  billboardTrackName: song,
                  spotifyArtistData: artistMatch,
                  spotifyTrackData: exactMatch.track
                });
              } catch (error) {
                console.log("Failed to start playback:", error.message);
              }
              return {
                uri: exactMatch.track.uri,
                name: exactMatch.track.name,
                album: exactMatch.track.album.name,
                score: exactMatch.score
              };
            }
          }

          // If no good match in top tracks, proceed with catalog search
          console.log('\nNo ideal match in top tracks, searching full catalog...');
          
          // Order of searching: singles -> albums -> compilations -> appears_on
          const includeGroups = ['single', 'album', 'compilation', 'appears_on'];
          
          for (const group of includeGroups) {
            console.log(`\nChecking ${group}s...`);
            let offset = 0;
            let hasMore = true;

            while (hasMore) {
              const albumsResponse = await SpotifyPlaybackApi.getArtistAlbums(
                tokens.spotifyAccessToken,
                artistMatch.id,
                {
                  include_groups: group,
                  limit: 50,
                  offset: offset
                }
              );

              if (!albumsResponse.data.items.length) {
                hasMore = false;
                break;
              }

              // Get tracks for each album
              for (const album of albumsResponse.data.items) {
                const tracksResponse = await SpotifyPlaybackApi.getAlbumTracks(
                  tokens.spotifyAccessToken,
                  album.id
                );

                const tracks = tracksResponse.data.items;
                const matches = tracks
                  .map(track => ({
                    track,
                    score: calculateTrackNameScore(song, track.name)
                  }))
                  .filter(result => result.score.total >= 150)
                  .sort((a, b) => b.score.total - a.score.total);

                if (matches.length > 0) {
                  console.log(`\nFound matches in ${album.name}:`);
                  matches.forEach(match => {
                    console.log(`Score ${match.score.total}: ${match.track.name} (${match.score.reason})`);
                  });

                  // If we found an exact match (score >= 200), try to play it and return the track info
                  const exactMatch = matches.find(m => m.score.total >= 200);
                  if (exactMatch) {
                    console.log("Found exact match, attempting to play track");
                    try {
                      await SpotifyPlaybackApi.playTrack(tokens.spotifyAccessToken, exactMatch.track.uri);
                      console.log("Track playback started successfully");

                      // Save the match to database
                      await SpotifyMatchService.saveSpotifyMatch({
                        billboardArtistName: artist,
                        billboardTrackName: song,
                        spotifyArtistData: artistMatch,
                        spotifyTrackData: exactMatch.track
                      });
                    } catch (error) {
                      console.log("Failed to start playback:", error.message);
                      // Don't throw here - we still want to return the track info
                    }
                    // Return the matched track info even if playback failed
                    return {
                      uri: exactMatch.track.uri,
                      name: exactMatch.track.name,
                      album: album.name,
                      score: exactMatch.score
                    };
                  }
                }
              }

              offset += 50;
            }
          }
        } catch (error) {
          console.log("Error searching top tracks:", error.message);
          // If top tracks search fails, proceed with catalog search
        }
      }

      throw new AppError('Track not found on Spotify', 404);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.response?.status === 401) {
        throw new AppError('Spotify authorization expired', 401);
      }
      throw new AppError('Failed to search Spotify', 500);
    }
  },

  async playTrack(trackUri, userId) {
    try {
      const tokens = await SpotifyAuthRepository.getUserTokens(userId);
      if (!tokens?.spotifyAccessToken) {
        throw new AppError('Not connected to Spotify', 401);
      }

      await SpotifyPlaybackApi.playTrack(tokens.spotifyAccessToken, trackUri);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new AppError('Spotify authorization expired', 401);
      }
      if (error.response?.status === 404) {
        throw new AppError('No active Spotify device found', 404);
      }
      throw new AppError('Failed to play track', 500);
    }
  }
};

async function searchWithQuery(query, song, artist, accessToken) {
  let offset = 0;
  let bestMatch = null;
  
  while (offset < 800) {
    const response = await SpotifyPlaybackApi.searchTracksWithPagination(
      accessToken,
      query,
      offset
    );

    const tracks = response.data.tracks.items;
    if (!tracks.length) break;

    // console.log(`Checking results ${offset + 1} to ${offset + tracks.length}`);
    
    for (const track of tracks) {
      const score = calculateTrackScore(song, artist, track);
      // console.log(`Score ${score.total}: ${track.name} - ${track.artists[0].name} (${score.reason})`);

      if (score.total >= 200) { // Exact match
        return track;
      } else if (score.total >= 150 && !bestMatch) { // Very good match
        bestMatch = track;
      }
    }

    if (bestMatch) break;
    offset += 50;
  }

  if (bestMatch) {
    // console.log("Best match found:", bestMatch.name, "-", bestMatch.artists[0].name);
    return bestMatch;
  }

  return null;
}

function calculateTrackScore(searchSong, searchArtist, track) {
  const song1 = searchSong.toLowerCase();
  const song2 = track.name.toLowerCase();
  const artist1 = searchArtist.toLowerCase();
  const artist2 = track.artists[0].name.toLowerCase();

  let score = 0;
  let reason = [];
  
  // Artist match is required for high scores
  const isCorrectArtist = artist2 === artist1;
  if (!isCorrectArtist) {
    score -= 1000;
    reason.push("wrong artist penalty");
  } else {
    score += 100;
    reason.push("exact artist match");
  }

  // Exact song match
  if (song1 === song2) {
    score += 100;
    reason.push("exact song match");
  }

  // Clean versions (remove special versions and check again)
  const cleanSearchSong = song1.replace(/\([^)]*\)/g, '').trim();
  const cleanTrackSong = song2
    .replace(/\([^)]*\)/g, '')
    .replace(/ - .*$/, '')
    .replace(/(remastered|single version|album version|original)/gi, '')
    .trim();

  if (cleanSearchSong === cleanTrackSong) {
    score += 75;
    reason.push("clean name match");
  }

  // Partial matches - only if words appear in the same order
  const searchWords = song1.split(' ');
  const trackWords = song2.split(' ');
  let foundInOrder = true;
  let lastIndex = -1;

  for (const word of searchWords) {
    const index = trackWords.findIndex((w, i) => i > lastIndex && w === word);
    if (index === -1) {
      foundInOrder = false;
      break;
    }
    lastIndex = index;
  }

  if (foundInOrder) {
    score += 50;
    reason.push("song words match in order");
  }

  // Version bonuses/penalties
  if (song2.includes('remastered')) {
    score += 10;
    reason.push("remastered version");
  }
  if (song2.includes('single version')) {
    score += 15;
    reason.push("single version");
  }
  if (song2.includes('mono')) {
    score += 15;
    reason.push("mono version");
  }
  if (song2.includes('stereo')) {
    score += 15;
    reason.push("stereo version");
  }
  if (song2.includes('live')) {
    score -= 50;
    reason.push("live version penalty");
  }
  if (song2.includes('remix')) {
    score -= 40;
    reason.push("remix penalty");
  }
  if (song2.includes('karaoke')) {
    score -= 50;
    reason.push("karaoke penalty");
  }
  if (song2.includes('cover')) {
    score -= 50;
    reason.push("cover penalty");
  }

  // Popularity bonus (0-100)
  const popularityBonus = Math.floor(track.popularity / 2);
  score += popularityBonus;
  reason.push(`popularity bonus: ${popularityBonus}`);

  return {
    total: score,
    reason: reason.join(", ")
  };
}

function calculateArtistSimilarity(artist1, artist2) {
  // Exact match
  if (artist1 === artist2) return 1;
  
  // Check if one contains the other
  if (artist1.includes(artist2) || artist2.includes(artist1)) {
    return 0.9;
  }

  // Calculate Levenshtein distance
  const distance = levenshteinDistance(artist1, artist2);
  const maxLength = Math.max(artist1.length, artist2.length);
  
  // Convert distance to similarity score (0-1)
  let similarity = 1 - (distance / maxLength);

  // Boost score for partial word matches
  const words1 = artist1.split(' ');
  const words2 = artist2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  if (commonWords.length > 0) {
    similarity += 0.1 * (commonWords.length / Math.max(words1.length, words2.length));
    similarity = Math.min(similarity, 1); // Cap at 1
  }

  return similarity;
}

function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

function calculateTrackNameScore(searchName, trackName) {
  const name1 = searchName.toLowerCase();
  const name2 = trackName.toLowerCase();

  let score = 0;
  let reason = [];

  // Exact match (including "Single Version")
  if (name1 === name2 || 
      (name2.includes(name1) && name2.includes('single version'))) {
    score += 200;
    reason.push("exact match");
    return { total: score, reason: reason.join(", ") };
  }

  // Clean versions and check again
  const cleanSearchName = name1.replace(/\([^)]*\)/g, '').trim();
  const cleanTrackName = name2
    .replace(/\([^)]*\)/g, '')
    .replace(/ - .*$/, '')
    .replace(/(remastered|single version|album version|original)/gi, '')
    .trim();

  if (cleanSearchName === cleanTrackName) {
    score += 175;
    reason.push("clean name match");
  }

  // Version bonuses (increased "single version" bonus significantly)
  if (name2.includes('single version')) {
    score += 50; // Increased from 15 to 50
    reason.push("single version");
  }
  if (name2.includes('remastered')) {
    score += 10;
    reason.push("remastered");
  }
  if (name2.includes('mono')) {
    score += 15;
    reason.push("mono version");
  }
  if (name2.includes('stereo')) {
    score += 15;
    reason.push("stereo version");
  }

  // Penalties
  if (name2.includes('live')) {
    score -= 50;
    reason.push("live version penalty");
  }
  if (name2.includes('remix')) {
    score -= 40;
    reason.push("remix penalty");
  }
  if (name2.includes('karaoke')) {
    score -= 50;
    reason.push("karaoke penalty");
  }
  if (name2.includes('cover')) {
    score -= 50;
    reason.push("cover penalty");
  }

  return {
    total: score,
    reason: reason.join(", ")
  };
} 