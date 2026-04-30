// userRoutes.js
// Purpose: Defines all user-related API routes
// Pattern: Route → Controller → Service → Model

const express = require('express');
const router = express.Router();
const { getUsers, getProfile } = require('../controllers/userController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// GET all users — public for now
// Later: add verifyToken, authorizeRole('admin')
router.get('/', getUsers);

// GET logged in user's profile — protected
// verifyToken checks JWT and sets req.user
router.get('/profile', verifyToken, getProfile);

// GET admin only route — protected + role check
// authorizeRole checks if user role is 'admin'
router.get('/admin-only', verifyToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

module.exports = router;