const express = require('express');
const router = express.Router();


const { verifyToken } = require('../middleware/authMiddleware');

const { signupSchema, loginSchema } = require('../utils/validators');

const { signup, login, refresh, logout } = require('../../controllers/v1/authController');
const validateMiddleware = require('../../middleware/validateMiddleware');

router.post('/signup', validateMiddleware(signupSchema), signup);
router.post('/login',  validateMiddleware(loginSchema),  login);
router.post('/refresh', refresh);
router.post('/logout', verifyToken, logout);

module.exports = router;