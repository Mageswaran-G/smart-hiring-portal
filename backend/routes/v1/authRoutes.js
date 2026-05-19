const express    = require('express');
const router     = express.Router();

// TWO levels up now — routes/v1/ → routes/ → backend/
const { signup, login, refresh, logout } = require('../../controllers/v1/authController');
const validateMiddleware = require('../../middleware/validateMiddleware');
const { signupSchema, loginSchema } = require('../../utils/validators');
const { verifyToken } = require('../../middleware/authMiddleware');

router.post('/signup',  validateMiddleware(signupSchema), signup);
router.post('/login',   validateMiddleware(loginSchema),  login);
router.post('/refresh', refresh);
router.post('/logout',  verifyToken, logout);

// Test email route — only for development
// DELETE THIS in production!
router.post('/test-email', async (req, res) => {
  const { sendStatusEmail } = require('../../utils/emailService');
  try {
    await sendStatusEmail({
      to:            req.body.to || 'mageswaran.gmw@gmail.com',
      candidateName: req.body.name || 'Test Candidate',
      jobTitle:      'Full Stack Developer',
      companyName:   'HirePortal Test Co',
      status:        req.body.status || 'shortlisted',
    });
    res.json({ success: true, message: 'Email sent — check inbox' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;