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

      // Try with track: and artist: qualifiers
      const query = encodeURIComponent(`${song}`);
      console.log("searching for", `${artist} ${song}`);
      
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'track',
          limit: 50,
          market: 'AU',
          include_external: 'audio'
        },
        headers: {
          'Authorization': `Bearer ${tokens.spotifyAccessToken}`
        }
      });

      const tracks = response.data.tracks.items;
      console.log("results:", tracks.map(item => `${item.name} - ${item.artists[0].name}`));

      if (!tracks.length) {
        throw new AppError('Track not found on Spotify', 404);
      }

      // Simple scoring: exact matches first, then partial matches
      const bestMatch = tracks
        .map(track => ({
          track,
          score: calculateSimpleScore(song, artist, track.name, track.artists[0].name)
        }))
        .sort((a, b) => b.score - a.score)[0].track;

      console.log("best match: track -", bestMatch.name, " |  artist -", bestMatch.artists[0].name);
      return bestMatch;
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