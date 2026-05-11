// roleMiddleware.js
// Checks if the logged-in user has the correct role
// Must be used AFTER protect middleware
// protect adds req.user — authorize reads req.user.role

const authorize = (...roles) => {
  // roles = ['company'] or ['admin'] or ['company', 'admin']
  return (req, res, next) => {

    // If protect didn't run first, req.user won't exist
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please login.',
      });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        // 403 = Forbidden — you are logged in but not allowed
        success: false,
        message: `Access denied. This action requires role: ${roles.join(' or ')}`,
      });
    }

    // Role is correct — go to next (controller)
    next();
  };
};

module.exports = { authorize };