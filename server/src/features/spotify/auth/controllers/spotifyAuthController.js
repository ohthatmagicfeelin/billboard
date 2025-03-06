import { catchAsync } from '../../../../utils/catchAsync.js';
import { AppError } from '../../../../utils/AppError.js';
import { SpotifyAuthService } from '../services/spotifyAuthService.js';
import { SpotifyAuthRepository } from '../repositories/spotifyAuthRepository.js';

export const SpotifyAuthController = {
  getAuthUrl: catchAsync(async (req, res) => {
    const authUrl = SpotifyAuthService.generateAuthUrl();
    res.json({ url: authUrl });
  }),

  handleCallback: catchAsync(async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
      throw new AppError('Authorization code is required', 400);
    }

    if (!req.user) {
      throw new AppError('User must be authenticated', 401);
    }

    const tokens = await SpotifyAuthService.exchangeCode(code);
    await SpotifyAuthRepository.saveUserTokens(req.user.id, tokens);

    res.json({ success: true });
  }),

  refreshToken: catchAsync(async (req, res) => {
    if (!req.user) {
      throw new AppError('User must be authenticated', 401);
    }

    const tokens = await SpotifyAuthService.refreshToken(req.user.id);
    res.json({ success: true, accessToken: tokens.access_token });
  }),

  checkConnection: catchAsync(async (req, res) => {
    if (!req.user) {
      return res.json({ isConnected: false });
    }

    const tokens = await SpotifyAuthRepository.getUserTokens(req.user.id);
    
    if (!tokens?.spotifyAccessToken) {
      return res.json({ isConnected: false });
    }

    // Check if token is expired
    const isExpired = tokens.spotifyTokenExpiry < new Date();
    
    if (isExpired) {
      const newTokens = await SpotifyAuthService.refreshToken(req.user.id);
      return res.json({ 
        isConnected: true, 
        accessToken: newTokens.access_token 
      });
    }

    return res.json({ 
      isConnected: true, 
      accessToken: tokens.spotifyAccessToken 
    });
  }),

}; 
