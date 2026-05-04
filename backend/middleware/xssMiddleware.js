// xssMiddleware.js
// Purpose: Clean all user input to prevent XSS attacks
// Fix: Handle arrays correctly — arrays are also objects in JS
//      Must check Array.isArray BEFORE typeof object check

const xss = require('xss');

// Recursively sanitize any value
const sanitizeValue = (value) => {

  // If string — clean it with xss library
  if (typeof value === 'string') {
    return xss(value);
  }

  // If array — sanitize each item inside array
  // IMPORTANT: Check array BEFORE object (arrays are objects too!)
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  // If object — sanitize each key's value
  if (typeof value === 'object' && value !== null) {
    const sanitized = {};
    Object.keys(value).forEach((key) => {
      sanitized[key] = sanitizeValue(value[key]);
    });
    return sanitized;
  }

  // Numbers, booleans, null — return as is
  return value;
};

// Middleware function — runs on every request
const xssMiddleware = (req, res, next) => {
  if (req.body)  req.body  = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  next();
};

module.exports = xssMiddleware;