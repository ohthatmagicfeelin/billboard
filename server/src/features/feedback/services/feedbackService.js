import { AppError } from '../../../utils/AppError.js';
import { FeedbackRepository } from '../repositories/feedbackRepository.js';
import { TelegramApi } from '../../../api/telegramApi.js';

export const FeedbackService = {
  createFeedback: async (feedbackData, user = null) => {
    try {
      const data = {
        message: feedbackData.message,
        rating: feedbackData.rating
      };

      if (user) {
        data.userId = user.id;
      } else {
        // Validate email format if provided
        if (feedbackData.email && !feedbackData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          throw new AppError('Invalid email format', 400);
        }
        data.userEmail = feedbackData.email;
        data.userName = feedbackData.name;
      }

      const feedback = await FeedbackRepository.create(data);
      
      // Send Telegram notification
      const notificationMessage = `
<b>New Feedback Received!</b>
Rating: ${'⭐'.repeat(feedback.rating)}
${user 
? `From: ${user.email}` 
: feedback.userEmail 
    ? `From: ${feedback.userName || 'Anonymous'} (${feedback.userEmail})` 
    : 'Anonymous feedback'}
Message: ${feedback.message}`;
      
      await TelegramApi.sendMessage(notificationMessage);
      
      return feedback;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating feedback', 500);
    }
  },

  getAllFeedback: async () => {
    try {
      const feedback = await FeedbackRepository.findAll();
      return feedback;
    } catch (error) {
      throw new AppError('Error fetching feedback', 500);
    }
  },

  getUserFeedback: async (userId) => {
    try {
      const feedback = await FeedbackRepository.findByUser(userId);
      return feedback;
    } catch (error) {
      throw new AppError('Error fetching user feedback', 500);
    }
  }
}; 