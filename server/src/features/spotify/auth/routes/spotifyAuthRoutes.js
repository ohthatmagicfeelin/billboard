import { Router } from 'express';
import { SpotifyAuthController } from '../controllers/spotifyAuthController.js';
import { requireAuth } from '../../../../middleware/auth/auth.js';

const router = Router();

router.get('/auth-url', requireAuth, SpotifyAuthController.getAuthUrl);
router.get('/callback', requireAuth, SpotifyAuthController.handleCallback);
router.post('/refresh-token', requireAuth, SpotifyAuthController.refreshToken);
router.get('/check-connection', requireAuth, SpotifyAuthController.checkConnection);


export default router; 