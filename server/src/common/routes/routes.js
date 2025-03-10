import express from 'express';
import config from '../../config/env.js';
import deployRoutes from './deployRoutes.js'
import paymentRoutes from '../../features/payments/routes/paymentRoutes.js';
import authRoutes from '../../features/auth/routes/authRoutes.js';
import feedbackRoutes from '../../features/feedback/routes/feedbackRoutes.js';
import { apiLimiter } from '../../middleware/security/rateLimiter.js';
import settingsRoutes from '../../features/settings/routes/settingsRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import billboardRoutes from '../../features/billboard/routes/billboardRoutes.js';
import spotifyAuthRoutes from '../../features/spotify/auth/routes/spotifyAuthRoutes.js';
import spotifyPlaybackRoutes from '../../features/spotify/playback/routes/spotifyPlaybackRoutes.js';

const router = express.Router();

// Determine whether to use base path based on environment
const isProduction = config.NODE_ENV === 'production';
const basePath = isProduction ? config.APP_ROUTE : '';


router.use(`${basePath}/api`, apiLimiter);
router.use(`${basePath}/api`, paymentRoutes)
router.use(`${basePath}/api`, authRoutes)
router.use(`/api/health`, deployRoutes);
router.use(`${basePath}/api/feedback`, feedbackRoutes);
router.use(`${basePath}/api/settings`, settingsRoutes);
router.use(`${basePath}/api/sessions`, sessionRoutes);
router.use(`${basePath}/api/billboard`, billboardRoutes);
router.use(`${basePath}/api/spotify/auth`, spotifyAuthRoutes);
router.use(`${basePath}/api/spotify/playback`, spotifyPlaybackRoutes);

export default router;