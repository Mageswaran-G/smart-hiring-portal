// rateLimiters.js — Centralized rate limit configuration

const rateLimit = require('express-rate-limit');

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please wait 15 minutes.' }
});

// Light AI limiter — cheap operations
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  
  message: { success: false, message: 'Too many AI requests. Please wait 15 minutes.' }
});

// Heavy AI limiter — expensive generation
const aiHeavyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  
  message: { success: false, message: 'Too many generation requests. Please wait 15 minutes.' }
});

// Auth limiter — login/signup
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Please wait 15 minutes.' }
});

module.exports = { apiLimiter, aiLimiter, aiHeavyLimiter, authLimiter };
