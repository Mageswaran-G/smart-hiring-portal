const express = require('express');
const router = express.Router();

// ← Import controller as full object
const userController = require('../controllers/userController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const { updateProfileSchema } = require('../utils/validators');
const upload = require('../middleware/uploadMiddleware');

// Import validateMiddleware correctly
const validateMiddleware = require('../middleware/validateMiddleware');

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