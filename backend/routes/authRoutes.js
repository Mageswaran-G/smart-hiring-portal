const express = require('express');
const router = express.Router();
const { signup, login, refresh, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { signupSchema, loginSchema } = require('../utils/validators');

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', verifyToken, logout);

module.exports = router;