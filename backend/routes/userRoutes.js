const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Public route
router.get('/', getUsers);

// Protected - any logged in user
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
});

// Protected - admin only
router.get('/admin-only', verifyToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

module.exports = router;