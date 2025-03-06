import { SpotifyPlaybackApi } from '../api/spotifyPlaybackApi.js';
import { SpotifyAuthRepository } from '../../auth/repositories/spotifyAuthRepository.js';
import { AppError } from '../../../../utils/AppError.js';

export const SpotifyPlaybackService = {
  
  async searchTrack(song, artist, userId) {
    try {
      const tokens = await SpotifyAuthRepository.getUserTokens(userId);
      if (!tokens?.spotifyAccessToken) {
        throw new AppError('Not connected to Spotify', 401);
      }

      // First try with both song and artist
      let track = await searchWithQuery(`${song} ${artist}`, song, artist, tokens.spotifyAccessToken);
      if (track) return track;

      // If no match found, try with just the song
      console.log("No match found, trying song name only:", song);
      track = await searchWithQuery(song, song, artist, tokens.spotifyAccessToken);
      if (track) return track;

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

    console.log(`Checking results ${offset + 1} to ${offset + tracks.length}`);
    
    for (const track of tracks) {
      const score = calculateTrackScore(song, artist, track);
      console.log(`Score ${score.total}: ${track.name} - ${track.artists[0].name} (${score.reason})`);

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
    console.log("Best match found:", bestMatch.name, "-", bestMatch.artists[0].name);
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