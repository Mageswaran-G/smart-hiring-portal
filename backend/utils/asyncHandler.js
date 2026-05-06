// ─────────────────────────────────────────────────────
// asyncHandler.js
// Purpose: Wraps async controller functions
// Removes need for try/catch in every controller
// Usage: router.get('/profile', asyncHandler(getProfile))
// ─────────────────────────────────────────────────────

// fn = async controller function
// Returns a new function that catches any error automatically
// and passes it to Express error handler (next)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;