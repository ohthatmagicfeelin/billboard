import { Router } from 'express';
import { SpotifyPlaybackController } from '../controllers/spotifyPlaybackController.js';
import { requireAuth } from '../../../../middleware/auth/auth.js';

const router = Router();

router.get('/search', requireAuth, SpotifyPlaybackController.search);
router.put('/play', requireAuth, SpotifyPlaybackController.play);

export default router; 