import express from 'express';
import { requireAuth } from '../../middleware/auth/auth.js';
import { sessionController } from '../controllers/sessionController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/active', sessionController.getActiveSessions);
router.post('/invalidate-all', sessionController.invalidateAllSessions);
router.delete('/:sessionId', sessionController.invalidateSession);

export default router;
