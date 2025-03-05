import { catchAsync } from '../../../utils/catchAsync.js';
import { AppError } from '../../../utils/AppError.js';
import { SpotifyService } from '../services/spotifyService.js';
import { SpotifyRepository } from '../repositories/spotifyRepository.js';

export const SpotifyController = {
  getAuthUrl: catchAsync(async (req, res) => {
    const authUrl = SpotifyService.generateAuthUrl();
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

    const tokens = await SpotifyService.exchangeCode(code);
    await SpotifyRepository.saveUserTokens(req.user.id, tokens);

    res.json({ success: true });
  }),

  refreshToken: catchAsync(async (req, res) => {
    if (!req.user) {
      throw new AppError('User must be authenticated', 401);
    }

    const tokens = await SpotifyService.refreshToken(req.user.id);
    res.json({ success: true, accessToken: tokens.access_token });
  })
}; 
