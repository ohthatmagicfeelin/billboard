import prisma from '../../../../db/client.js';
import { AppError } from '../../../../utils/AppError.js';

export const SpotifyAuthRepository = {
  saveUserTokens: async (userId, tokens) => {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          spotifyAccessToken: tokens.access_token,
          spotifyRefreshToken: tokens.refresh_token,
          spotifyTokenExpiry: new Date(Date.now() + tokens.expires_in * 1000)
        }
      });
    } catch (error) {
      throw new AppError('Failed to save Spotify tokens', 500);
    }
  },

  getUserTokens: async (userId) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          spotifyAccessToken: true,
          spotifyRefreshToken: true,
          spotifyTokenExpiry: true
        }
      });
      return user;
    } catch (error) {
      throw new AppError('Failed to get Spotify tokens', 500);
    }
  }
}; 