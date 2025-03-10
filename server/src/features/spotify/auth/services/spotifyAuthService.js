import axios from 'axios';
import config from '../../../../config/env.js';
import { SpotifyAuthRepository } from '../repositories/spotifyAuthRepository.js';
import { AppError } from '../../../../utils/AppError.js';

export const SpotifyAuthService = {
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
      const userTokens = await SpotifyAuthRepository.getUserTokens(userId);
      
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

      await SpotifyAuthRepository.saveUserTokens(userId, {
        ...response.data,
        refresh_token: userTokens.spotifyRefreshToken // Keep existing refresh token if not provided
      });

      return response.data;
    } catch (error) {
      throw new AppError('Failed to refresh token', 500);
    }
  },

};
