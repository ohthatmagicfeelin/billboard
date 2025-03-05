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
  }),

  checkConnection: catchAsync(async (req, res) => {
    if (!req.user) {
      return res.json({ isConnected: false });
    }

    const tokens = await SpotifyRepository.getUserTokens(req.user.id);
    
    if (!tokens?.spotifyAccessToken) {
      return res.json({ isConnected: false });
    }

    // Check if token is expired
    const isExpired = tokens.spotifyTokenExpiry < new Date();
    
    if (isExpired) {
      const newTokens = await SpotifyService.refreshToken(req.user.id);
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

  search: catchAsync(async (req, res) => {
    const { song, artist } = req.query;
    
    if (!song || !artist) {
      throw new AppError('Song and artist are required', 400);
    }

    const track = await SpotifyService.searchTrack(song, artist, req.user.id);
    res.json(track);
  }),

  play: catchAsync(async (req, res) => {
    const { uri } = req.body;
    
    if (!uri) {
      throw new AppError('Track URI is required', 400);
    }

    await SpotifyService.playTrack(uri, req.user.id);
    res.json({ success: true });
  })
}; 
