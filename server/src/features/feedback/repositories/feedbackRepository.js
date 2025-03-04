import prisma from '../../../db/client.js'
import { AppError } from '../../../utils/AppError.js';

export const FeedbackRepository = {
  create: async (feedbackData) => {
    try {
      return await prisma.feedback.create({
        data: feedbackData
      });
    } catch (error) {
      throw new AppError('Database error while creating feedback', 500);
    }
  },

  findAll: async () => {
    try {
      return await prisma.feedback.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
    } catch (error) {
      throw new AppError('Database error while fetching feedback', 500);
    }
  },

  findByUser: async (userId) => {
    try {
      return await prisma.feedback.findMany({
        where: {
          userId: userId
        }
      });
    } catch (error) {
      throw new AppError('Database error while fetching user feedback', 500);
    }
  }
}; 