const jwt = require('jsonwebtoken');

// Verify JWT token
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check token exists
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    // Check correct format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Invalid token format' 
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ 
      error: 'Invalid or expired token' 
    });
  }
};

// Check user role
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Only ${roles.join(', ')} allowed.`
      });
    }
    next();
  };
};