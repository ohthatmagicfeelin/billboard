/**
 * Wraps an async function to handle promise rejections and pass them to Express error handler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
export const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}; 