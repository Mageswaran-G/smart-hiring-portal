const express    = require('express');
const router     = express.Router();

// TWO levels up now — routes/v1/ → routes/ → backend/
const { signup, login, refresh, logout } = require('../../controllers/v1/authController');
const validateMiddleware = require('../../middleware/validateMiddleware');
const { signupSchema, loginSchema } = require('../../utils/validators');
const { verifyToken } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:     { type: string, example: Mageswaran G }
 *               email:    { type: string, example: candidate@test.com }
 *               password: { type: string, example: Test1234 }
 *               role:     { type: string, enum: [candidate, company] }
 *     responses:
 *       201: { description: User registered successfully }
 *       409: { description: Email already registered }
 */
router.post('/signup',  validateMiddleware(signupSchema), signup);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get access token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: candidate@test.com }
 *               password: { type: string, example: Test1234 }
 *     responses:
 *       200: { description: Login successful — returns accessToken and user }
 *       401: { description: Invalid credentials }
 */
router.post('/login',   validateMiddleware(loginSchema),  login);
/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using refresh token cookie
 *     security: []
 *     responses:
 *       200: { description: New access token issued }
 *       401: { description: Invalid or expired refresh token }
 */
router.post('/refresh', refresh);
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and invalidate refresh token
 *     responses:
 *       200: { description: Logged out successfully }
 */
router.post('/logout',  verifyToken, logout);



module.exports = router;