// rateLimiters.js — ALL rate limiters in one place

const rateLimit = require('express-rate-limit');

// Skip rate limiting in test environment
const isTest = process.env.NODE_ENV === 'test';

const skipInTest = () => isTest;

const authLimiter = rateLimit({
  skip: skipInTest,
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many auth attempts. Please wait 15 minutes.' }
});

const refreshLimiter = rateLimit({
  skip: skipInTest,
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many refresh attempts. Please wait 15 minutes.' }
});

const apiLimiter = rateLimit({
  skip: skipInTest,
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many requests. Please wait 15 minutes.' }
});

const writeLimiter = rateLimit({
  skip: (req) => isTest || req.method === 'GET',
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many write requests. Please wait 15 minutes.' }
});

const aiLimiter = rateLimit({
  skip: skipInTest,
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many AI requests. Please wait 15 minutes.' }
});

const aiHeavyLimiter = rateLimit({
  skip: skipInTest,
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many generation requests. Please wait 15 minutes.' }
});

const chatLimiter = rateLimit({
  skip: skipInTest,
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  keyGenerator: (req) => { const key = req.user?.id || req.ip || 'unknown'; return key.replace(/:/g, '_'); },
  message: { success: false, message: 'Too many chat messages. Please wait a minute.' }
});

module.exports = { authLimiter, refreshLimiter, apiLimiter, writeLimiter, aiLimiter, aiHeavyLimiter, chatLimiter };