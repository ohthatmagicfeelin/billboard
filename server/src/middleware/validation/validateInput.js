import { AppError } from '../../utils/AppError.js';

const validateEmail = (email) => {
  if (!email) {
    throw new AppError('Email is required', 400);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }
  if (email.length > 255) {
    throw new AppError('Email is too long', 400);
  }
};

const validatePassword = (password) => {
  if (!password) {
    throw new AppError('Password is required', 400);
  }
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }
  if (password.length > 128) {
    throw new AppError('Password is too long', 400);
  }
  if (!/[A-Z]/.test(password)) {
    throw new AppError('Password must contain at least one uppercase letter', 400);
  }
  if (!/[a-z]/.test(password)) {
    throw new AppError('Password must contain at least one lowercase letter', 400);
  }
  if (!/\d/.test(password)) {
    throw new AppError('Password must contain at least one number', 400);
  }
  if (!/[!@#$%^&*]/.test(password)) {
    throw new AppError('Password must contain at least one special character (!@#$%^&*)', 400);
  }
};

const validateToken = (token) => {
  if (!token) {
    throw new AppError('Token is required', 400);
  }
  if (typeof token !== 'string') {
    throw new AppError('Invalid token format', 400);
  }
  if (token.length > 1000) {
    throw new AppError('Token is too long', 400);
  }
};

export const validateSignup = (req, res, next) => {
  try {
    const { email, password } = req.body;
    validateEmail(email);
    validatePassword(password);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;
    validateEmail(email);
    if (!password) {
      throw new AppError('Password is required', 400);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePasswordReset = (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    validateToken(token);
    validatePassword(newPassword);
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePasswordResetRequest = (req, res, next) => {
  try {
    const { email } = req.body;
    validateEmail(email);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateEmailVerification = (req, res, next) => {
  try {
    const { token } = req.body;
    validateToken(token);
    next();
  } catch (error) {
    next(error);
  }
};

const validateFeedbackContent = (message) => {
  if (!message || typeof message !== 'string') {
    throw new AppError('Feedback message is required and must be a string', 400);
  }
  if (message.trim().length < 10) {
    throw new AppError('Feedback message must be at least 10 characters long', 400);
  }
  if (message.length > 1000) {
    throw new AppError('Feedback message cannot exceed 1000 characters', 400);
  }
};

const validateFeedbackRating = (rating) => {
  if (!rating || typeof rating !== 'number') {
    throw new AppError('Rating is required and must be a number', 400);
  }
  if (rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }
};

const validateFeedbackName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new AppError('Name is required and must be a string', 400);
  }
  if (name.trim().length < 2) {
    throw new AppError('Name must be at least 2 characters long', 400);
  }
  if (name.length > 50) {
    throw new AppError('Name cannot exceed 50 characters', 400);
  }
};

export const validateFeedback = (req, res, next) => {
  try {
    const { message, rating, email, name } = req.body;
    
    validateFeedbackContent(message);
    validateFeedbackRating(Number(rating));
    
    // Only validate email if user is not authenticated
    if (!req.user) {
      if (!email) {
        throw new AppError('Email is required for anonymous feedback', 400);
      }
      validateEmail(email);
    }
    
    if (name) {
      validateFeedbackName(name);
    }
    
    next();
  } catch (error) {
    next(error);
  }
}; 