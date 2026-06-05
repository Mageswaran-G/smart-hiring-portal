// CSRF Protection — Double Submit Cookie Pattern
// No external package needed — works with Express 5
// How it works:
//   1. GET /api/v1/auth/csrf-token → server sets csrfToken cookie
//   2. Frontend reads cookie, sends as X-CSRF-Token header on every POST/PUT/DELETE
//   3. This middleware checks header matches cookie

const crypto = require('crypto');

// Generate CSRF token endpoint
const generateCsrfToken = (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');

  res.cookie('csrfToken', token, {
    httpOnly: false,       // Frontend JS must read this cookie
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  });

  return res.json({ success: true, data: { csrfToken: token } });
};

// CSRF validation middleware
// Skip GET, HEAD, OPTIONS — only protect state-changing requests
const validateCsrf = (req, res, next) => {
  // Skip CSRF in test environment
  if (process.env.NODE_ENV === 'test') return next();
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();

  const tokenFromCookie = req.cookies?.csrfToken;
  const tokenFromHeader = req.headers['x-csrf-token'];

  if (!tokenFromCookie || !tokenFromHeader) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token missing',
    });
  }

  // Timing-safe comparison — prevents timing attacks
  const cookieBuf = Buffer.from(tokenFromCookie);
  const headerBuf = Buffer.from(tokenFromHeader);

  if (cookieBuf.length !== headerBuf.length ||
      !crypto.timingSafeEqual(cookieBuf, headerBuf)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
    });
  }

  next();
};

module.exports = { generateCsrfToken, validateCsrf };