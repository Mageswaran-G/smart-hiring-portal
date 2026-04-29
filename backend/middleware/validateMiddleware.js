const { ZodError } = require('zod');

exports.validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map(err => ({
        field: err.path[0],
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors
      });
    }
    next(error);
  }
};