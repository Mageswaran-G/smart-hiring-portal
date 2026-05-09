const express    = require('express');
const router     = express.Router();
const rateLimit  = require('express-rate-limit');

// TWO levels up now — routes/v1/ → routes/ → backend/
const userController = require('../../controllers/v1/userController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');
const validateMiddleware = require('../../middleware/validateMiddleware');
const { updateProfileSchema } = require('../../utils/validators');
const { upload } = require('../../middleware/uploadMiddleware');

// Upload rate limiter — max 20 per 15 minutes
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many upload attempts. Try again later.' }
});

router.get('/',           userController.getUsers);
router.get('/profile',    verifyToken, userController.getMyProfile);
router.put('/profile',    verifyToken, validateMiddleware(updateProfileSchema), userController.updateMyProfile);
router.post('/upload-resume',
  uploadLimiter,
  verifyToken,
  authorizeRole('candidate'),
  upload.single('resume'),
  userController.uploadResume
);
// POST upload profile photo — all logged-in users can upload
// Only image files allowed (JPG, PNG, WEBP)
// Max size: 2MB
router.post(
  '/upload-photo',
  verifyToken,                          // must be logged in
  upload.single('photo'),               // 'photo' = field name
  userController.uploadProfilePhoto     // controller function
);

// POST upload company cover banner — company only
router.post(
  '/upload-banner',
  uploadLimiter,
  verifyToken,
  authorizeRole('company'),
  upload.single('banner'),
  userController.uploadCoverBanner
);

module.exports = router;