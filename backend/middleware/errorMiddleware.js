const logger = require('../utils/logger');
const multer = require('multer');

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  // Multer file size error
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Wrong file type error
  if (err.message === 'Only PDF, DOC, and DOCX files are allowed') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // MongoDB duplicate key — smart messages per field
  if (err.code === 11000) {
    const key = Object.keys(err.keyPattern || {}).join('_');

    const messages = {
      'candidate_1_job_1': 'You have already applied for this job',
      'user_1_job_1':      'You have already saved this job',
      'slug':              'A job with this title already exists',
      'email':             'An account with this email already exists',
    };

    return res.status(400).json({
      success: false,
      message: messages[key] || 'Duplicate entry detected',
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

  // Zod validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: err.issues.map(e => e.message).join(', ')
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

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};