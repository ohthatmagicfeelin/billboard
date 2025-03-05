import axios from 'axios';
import config from '../../../config/env.js';
import { SpotifyRepository } from '../repositories/spotifyRepository.js';
import { AppError } from '../../../utils/AppError.js';

export const SpotifyService = {
  generateAuthUrl: () => {
    const scope = [
      'user-read-private',
      'user-read-email',
      'user-library-read',
      'user-library-modify',
      'streaming'
    ].join(' ');

    const params = new URLSearchParams({
      client_id: config.SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: config.SPOTIFY_REDIRECT_URI,
      scope: scope,
      show_dialog: true
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  },

  exchangeCode: async (code) => {
    try {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: config.SPOTIFY_REDIRECT_URI
      });

      const auth = Buffer.from(
        `${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64');

      const response = await axios.post('https://accounts.spotify.com/api/token', params, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error) {
      throw new AppError('Failed to exchange code for tokens', 500);
    }
  },

  refreshToken: async (userId) => {
    try {
      const userTokens = await SpotifyRepository.getUserTokens(userId);
      
      if (!userTokens?.spotifyRefreshToken) {
        throw new AppError('No refresh token found', 404);
      }

      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: userTokens.spotifyRefreshToken
      });

      const auth = Buffer.from(
        `${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64');

      const response = await axios.post('https://accounts.spotify.com/api/token', params, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      await SpotifyRepository.saveUserTokens(userId, {
        ...response.data,
        refresh_token: userTokens.spotifyRefreshToken // Keep existing refresh token if not provided
      });

      return response.data;
    } catch (error) {
      throw new AppError('Failed to refresh token', 500);
    }
  },

  async searchTrack(song, artist, userId) {
    try {
      const tokens = await SpotifyRepository.getUserTokens(userId);
      if (!tokens?.spotifyAccessToken) {
        throw new AppError('Not connected to Spotify', 401);
      }

      // Clean and encode the search terms
      const query = encodeURIComponent(`track:"${song}" artist:"${artist}"`);
      
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'track',
          limit: 1
        },
        headers: {
          'Authorization': `Bearer ${tokens.spotifyAccessToken}`
        }
      });

      const tracks = response.data.tracks.items;
      if (!tracks.length) {
        throw new AppError('Track not found on Spotify', 404);
      }

      return tracks[0];
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
      const tokens = await SpotifyRepository.getUserTokens(userId);
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