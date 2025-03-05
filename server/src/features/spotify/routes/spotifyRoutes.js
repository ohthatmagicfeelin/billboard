import { Router } from 'express';
import { SpotifyController } from '../controllers/spotifyController.js';
import { isAuthenticated } from '../../../middleware/auth.js';

const router = Router();

router.get('/auth-url', isAuthenticated, SpotifyController.getAuthUrl);
router.get('/callback', isAuthenticated, SpotifyController.handleCallback);
router.post('/refresh-token', isAuthenticated, SpotifyController.refreshToken);

export default router; 