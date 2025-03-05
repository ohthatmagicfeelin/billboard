import rateLimit from 'express-rate-limit';
import { AppError } from '../../utils/AppError.js';
import config from '../../config/env.js';

const isDevelopment = config.NODE_ENV === 'development';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 20 : 5, // Higher limit in development
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many login attempts, please try again after 15 minutes', 429));
  }
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 500 : 100, // Higher limit in development
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many requests from this IP, please try again after 15 minutes', 429));
  }
});

export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: isDevelopment ? 15 : 3, // Higher limit in development
  message: 'Too many feedback submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many feedback submissions from this IP, please try again after an hour', 429));
  }
}); 