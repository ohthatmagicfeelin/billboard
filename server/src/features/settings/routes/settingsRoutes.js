import express from 'express';
import { requireAuth } from '../../../middleware/auth/auth.js';
import { settingsController } from '../controllers/settingsController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', settingsController.getSettings);
router.patch('/', settingsController.updateSettings);

export default router; 