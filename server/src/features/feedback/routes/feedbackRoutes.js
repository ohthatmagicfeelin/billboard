import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController.js';
import { validateFeedback } from '../../../middleware/validation/validateInput.js';
import { sanitizeFeedback } from '../../../middleware/validation/sanitizeInput.js';
import { feedbackLimiter } from '../../../middleware/security/rateLimiter.js';

const router = Router();

const middleware = [feedbackLimiter, sanitizeFeedback, validateFeedback];

router.post('/', ...middleware, FeedbackController.create);

export default router; 
