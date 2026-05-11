// asyncHandler.js
// Wraps async functions to catch errors automatically
// No need to write try/catch in every controller

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;