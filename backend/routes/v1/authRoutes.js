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

module.exports = router;