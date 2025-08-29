const logger = require('../utils/logger');

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.path}`);
  error.status = 404;
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `${req.method} ${req.path} does not exist`,
    timestamp: new Date().toISOString()
  });
};

/**
 * Global error handler
 */
const errorHandler = (error, req, res, next) => {
  let { status = 500, message } = error;

  // Log the error
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
  } else if (error.code === 'SQLITE_CONSTRAINT') {
    status = 409;
    message = 'Database constraint violation';
  } else if (error.code === 'ENOENT') {
    status = 404;
    message = 'File or directory not found';
  }

  // Don't leak error details in production
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
    response.details = error;
  }

  res.status(status).json(response);
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  notFoundHandler,
  errorHandler,
  asyncHandler
};