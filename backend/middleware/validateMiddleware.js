// validateMiddleware.js
// Purpose: Apply Zod schema validation to request body
// Usage: validateMiddleware(schema) → returns middleware function

const validateMiddleware = (schema) => (req, res, next) => {
  try {
    // parse() throws error if validation fails
    schema.parse(req.body);

    // Validation passed — go to next middleware
    next();
  } catch (err) {
    // Zod v4 uses .issues not .errors
    return res.status(400).json({
      success: false,
      message: err.errors?.[0]?.message || 'Validation error'
    });
  }
};

// Export as function directly — not as object
module.exports = validateMiddleware;