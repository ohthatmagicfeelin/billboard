import { Router } from 'express';
import { SpotifyController } from '../controllers/spotifyController.js';
import { requireAuth } from '../../../middleware/auth/auth.js';

const router = Router();

router.get('/auth-url', requireAuth, SpotifyController.getAuthUrl);
router.get('/callback', requireAuth, SpotifyController.handleCallback);
router.post('/refresh-token', requireAuth, SpotifyController.refreshToken);
router.get('/check-connection', requireAuth, SpotifyController.checkConnection);
router.get('/search', requireAuth, SpotifyController.search);
router.put('/play', requireAuth, SpotifyController.play);

export default router; 