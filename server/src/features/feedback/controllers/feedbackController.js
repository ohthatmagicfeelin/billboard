import { catchAsync } from '../../../utils/catchAsync.js';
import { AppError } from '../../../utils/AppError.js';
import { FeedbackService } from '../services/feedbackService.js';

export const FeedbackController = {
  create: catchAsync(async (req, res) => {
    if (!req.body.message) {
      throw new AppError('Feedback message is required', 400);
    }

    if (!req.body.rating || req.body.rating < 1 || req.body.rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const feedback = await FeedbackService.createFeedback(
      req.body,
      req.user // Will be undefined for non-authenticated requests
    );

    res.status(201).json({ 
      feedback,
      message: 'Feedback submitted successfully'
    });
  }),

  getAll: catchAsync(async (req, res) => {
    const feedback = await FeedbackService.getAllFeedback();
    res.json({ feedback });
  }),

  getUserFeedback: catchAsync(async (req, res) => {
    if (!req.params.userId) {
      throw new AppError('User ID is required', 400);
    }

    const feedback = await FeedbackService.getUserFeedback(req.params.userId);
    
    if (!feedback.length) {
      throw new AppError('No feedback found for this user', 404);
    }

    res.json({ feedback });
  })
}; 