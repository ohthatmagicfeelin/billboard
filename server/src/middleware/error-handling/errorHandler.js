// server/src/middleware/errorHandler.js
import config from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

const handleStripeError = (err) => {
  return new AppError(`Payment error: ${err.message}`, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handleDuplicateFieldsError = (err) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : '';
  return new AppError(`Duplicate field value: ${value}. Please use another value.`, 400);
};

const handleJWTError = () => 
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () => 
  new AppError('Your token has expired. Please log in again.', 401);

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.NODE_ENV === 'development' || config.DEBUG) {
    console.log('💥 ERROR 💥');
    console.log('Status:', err.statusCode);
    console.log('Name:', err.name);
    console.log('Message:', err.message);
    console.log('Stack:', err.stack);
    
    if (err.errors) {
      console.log('Validation Errors:', err.errors);
    }

    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === 'ValidationError') error = handleValidationError(err);
    if (err.code === 11000) error = handleDuplicateFieldsError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err.type === 'StripeError') error = handleStripeError(err);

    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    } else {
      // Programming or unknown errors: don't leak error details
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
}; 