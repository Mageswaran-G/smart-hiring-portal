// validateMiddleware.js
// Purpose: Validate request body using Zod schema
// IMPORTANT: Must call next(err) so errorMiddleware catches it

const validateMiddleware = (schema) => (req, res, next) => {
  try {
    // parse() validates AND returns cleaned data
    // Assign back to req.body — now it's clean and validated
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    // Pass error to centralized errorMiddleware
    // errorMiddleware handles ZodError and returns 400
    next(err);
  }
};

module.exports = validateMiddleware;