// authMiddleware.js
// Purpose: Verify JWT token and check user role
// All errors use standard { success: false, message } format

const jwt = require('jsonwebtoken');

// Verify JWT token — protects routes
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token at all
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Wrong format — must start with "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Extract token after "Bearer "
    const token = authHeader.split(' ')[1];

    // Verify with secret — throws if invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user to request
    // Now controllers can use req.user.id, req.user.role
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Check user role — used after verifyToken
// Usage: authorizeRole('admin') or authorizeRole('admin', 'company')
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {

    // verifyToken must run first
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Check if user role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${roles.join(', ')} allowed.`
      });
    }

    next();
  };
};