const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  // MongoDB duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists'
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)
        .map(e => e.message)
        .join(', ')
    });
  }

  // Zod validation error (from validateMiddleware)
if (err.name === 'ZodError') {
  return res.status(400).json({
    success: false,
    message: err.issues.map(e => e.message).join(', ')  // ✅ CORRECT
  });
}

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};