const express = require('express');
const router = express.Router();

// ← Import controller as full object
// Change all '../' to '../../' for controllers and middleware
const userController  = require('../../controllers/v1/userController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');
const { upload }      = require('../../middleware/uploadMiddleware');

// Import validateMiddleware correctly
const validateMiddleware = require('../middleware/validateMiddleware');

const rateLimit = require('express-rate-limit');

// Max 20 uploads per 15 minutes per IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many upload attempts. Try again later.' }
});


// GET all users
router.get('/', userController.getUsers);

// GET my profile — protected
router.get('/profile', verifyToken, userController.getMyProfile);

// PUT update profile — protected + validation
router.put(
  '/profile',
  verifyToken,
  validateMiddleware(updateProfileSchema),
  userController.updateMyProfile
);

// POST upload resume — candidates only
router.post(
  '/upload-resume',
  uploadLimiter, 
  verifyToken,
  authorizeRole('candidate'),    // ← only candidates can upload resume
  upload.single('resume'),
  userController.uploadResume
);

// Admin only route
router.get(
  '/admin-only',
  verifyToken,
  authorizeRole('admin'),
  (req, res) => {
    res.json({ message: 'Welcome Admin!' });
  }
);

module.exports = router;