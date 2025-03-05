import axios from 'axios';
import { SpotifyAuthRepository } from '../../auth/repositories/spotifyAuthRepository.js';
import { AppError } from '../../../../utils/AppError.js';

export const SpotifyPlaybackService = {
  
  async searchTrack(song, artist, userId) {
    try {
      const tokens = await SpotifyAuthRepository.getUserTokens(userId);
      if (!tokens?.spotifyAccessToken) {
        throw new AppError('Not connected to Spotify', 401);
      }

      // First search for top 3 artists
      const artistQuery = encodeURIComponent(artist);
      console.log("searching for artist:", artist);
      console.log("artist query:", artistQuery);


      const artistResponse = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: artistQuery,
          type: 'artist',
          limit: 10,
          market: 'AU'
        },
        headers: {
          'Authorization': `Bearer ${tokens.spotifyAccessToken}`
        }
      });

      // Sort artists by popularity
      const artists = artistResponse.data.artists.items
        .sort((a, b) => b.popularity - a.popularity);
      
      console.log("top 10 artists:", artists.map(a => `${a.name} (popularity: ${a.popularity})`));

      // Check each artist's top tracks
      for (const artist of artists) {
        console.log(`checking top tracks for ${artist.name}`);
        const topTracksResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artist.id}/top-tracks`,
          {
            params: { market: 'AU' },
            headers: {
              'Authorization': `Bearer ${tokens.spotifyAccessToken}`
            }
          }
        );

        const topTracks = topTracksResponse.data.tracks;
        console.log(`${artist.name}'s top tracks:`, topTracks.map(track => track.name));

        // Look for exact match in top tracks
        const exactMatch = topTracks.find(
          track => track.name.toLowerCase() === song.toLowerCase()
        );

        if (exactMatch) {
          console.log(`found exact match in ${artist.name}'s top tracks:`, exactMatch.name);
          return exactMatch;
        }
      }

      // If no match found in top tracks, try both search strategies
      console.log("no match in top tracks, trying track searches");

      // Strategy 1: Search just the track name
      const trackOnlyQuery = encodeURIComponent(song);
      const trackOnlyResponse = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: trackOnlyQuery,
          type: 'track',
          limit: 50,
          market: 'AU',
          include_external: 'audio'
        },
        headers: {
          'Authorization': `Bearer ${tokens.spotifyAccessToken}`
        }
      });

      // Strategy 2: Search track name with artist
      const trackArtistQuery = encodeURIComponent(`track:"${song}" artist:"${artist}"`);
      const trackArtistResponse = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: trackArtistQuery,
          type: 'track',
          limit: 50,
          market: 'AU',
          include_external: 'audio'
        },
        headers: {
          'Authorization': `Bearer ${tokens.spotifyAccessToken}`
        }
      });

      // list artist track for debug
      console.log("artist track:", trackArtistResponse.data.tracks.items.map(item => `${item.name} - ${item.artists[0].name}`));

      // Combine and deduplicate results
      const allTracks = [
        ...trackOnlyResponse.data.tracks.items,
        ...trackArtistResponse.data.tracks.items
      ];
      
      // Remove duplicates by URI
      const uniqueTracks = [...new Map(allTracks.map(track => [track.uri, track])).values()];

      console.log("Combined search results:", uniqueTracks.map(item => `${item.name} - ${item.artists[0].name}`));

      if (!uniqueTracks.length) {
        throw new AppError('Track not found on Spotify', 404);
      }

      // Score and sort all tracks
      const scoredTracks = uniqueTracks
        .map(track => ({
          track,
          score: calculateSimpleScore(song, artist, track.name, track.artists[0].name)
        }))
        .sort((a, b) => b.score - a.score);

      // Log top 3 matches with scores
      console.log("Top 3 matches:");
      scoredTracks.slice(0, 3).forEach(({ track, score }) => {
        console.log(`Score ${score}: ${track.name} - ${track.artists[0].name}`);
      });

      return scoredTracks[0].track;
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

      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        { uris: [trackUri] },
        {
          headers: {
            'Authorization': `Bearer ${tokens.spotifyAccessToken}`
          }
        }
      );
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

function calculateSimpleScore(searchSong, searchArtist, trackName, artistName) {
  const song1 = searchSong.toLowerCase();
  const song2 = trackName.toLowerCase();
  const artist1 = searchArtist.toLowerCase();
  const artist2 = artistName.toLowerCase();

  let score = 0;
  
  // Exact matches get highest score
  if (song1 === song2) score += 100;
  if (artist1 === artist2) score += 100;
  
  // Partial matches
  if (song2.includes(song1)) score += 50;
  if (artist2.includes(artist1)) score += 50;
  
  return score;
} 