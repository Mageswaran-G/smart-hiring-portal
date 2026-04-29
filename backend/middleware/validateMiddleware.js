const AppError = require('../utils/AppError');

// Validate request body against Zod schema
exports.validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.errors
        .map(e => e.message)
        .join(', ');
      return next(new AppError(message, 400));
    }

    req.body = result.data;
    next();
  };
};