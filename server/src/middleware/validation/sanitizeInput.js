import validator from 'validator';
import xss from 'xss';
import { AppError } from '../../utils/AppError.js';

const sanitizeString = (str) => {
  if (!str) return str;
  // Trim whitespace
  let cleaned = validator.trim(str);
  // Remove any HTML/script tags
  cleaned = xss(cleaned);
  // Normalize email to lowercase if it's an email
  if (validator.isEmail(cleaned)) {
    cleaned = validator.normalizeEmail(cleaned, {
      gmail_remove_dots: false,
      gmail_remove_subaddress: false
    });
  }
  return cleaned;
};

const sanitizeObject = (obj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      cleaned[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = sanitizeObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

export const sanitizeInputs = (req, res, next) => {
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  next();
};

// Specific sanitizers for different routes
export const sanitizeAuth = (req, res, next) => {
  if (req.body.email) {
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
      gmail_remove_subaddress: false
    });
  }
  if (req.body.password) {
    // Don't modify password but ensure it's a string
    req.body.password = String(req.body.password);
  }
  next();
};

export const sanitizeProfile = (req, res, next) => {
  if (req.body.name) {
    req.body.name = validator.escape(validator.trim(req.body.name));
  }
  if (req.body.bio) {
    req.body.bio = validator.escape(validator.trim(req.body.bio));
  }
  next();
};

export const sanitizeFeedback = (req, res, next) => {
  try {
    if (req.body.message) {
      req.body.message = sanitizeString(req.body.message).substring(0, 1000);
    }
    
    if (req.body.rating) {
      const rating = Number(req.body.rating);
      if (isNaN(rating)) {
        throw new AppError('Rating must be a valid number', 400);
      }
      req.body.rating = rating;
    }

    if (req.body.email) {
      req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false,
        gmail_remove_subaddress: false
      });
    }

    if (req.body.name) {
      req.body.name = sanitizeString(req.body.name).substring(0, 50);
    }
    
    next();
  } catch (error) {
    next(error);
  }
}; 