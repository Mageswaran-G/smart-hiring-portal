/**
 * @swagger
 * /api/v1/chat/message:
 *   post:
 *     tags: [Chat]
 *     summary: Send message to HireBot AI — role-aware response with real platform context
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string, example: How can I improve my resume? }
 *               history: { type: array, items: { type: object } }
 *     responses:
 *       200: { description: AI reply from HireBot }
 *
 * /api/v1/chat/history:
 *   get:
 *     tags: [Chat]
 *     summary: Get chat history for current user
 *     responses:
 *       200: { description: Previous chat messages }
 *
 * /api/v1/chat/history/clear:
 *   delete:
 *     tags: [Chat]
 *     summary: Clear chat history for current user
 *     responses:
 *       200: { description: Chat history cleared }
 */
const express = require('express');
const router  = express.Router();
const chatController = require('../../controllers/v1/chatController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');
const { chatLimiter } = require('../../middleware/rateLimiters');

const allowedRoles = ['candidate', 'company', 'admin'];

// POST /api/v1/chat/message
router.post(
  '/message',
  verifyToken,
  chatLimiter,
  authorizeRole(...allowedRoles),
  chatController.sendMessage
);

// GET /api/v1/chat/history
router.get(
  '/history',
  verifyToken,
  authorizeRole(...allowedRoles),
  chatController.getHistory
);

// DELETE /api/v1/chat/history
router.delete(
  '/history',
  verifyToken,
  authorizeRole(...allowedRoles),
  chatController.clearHistory
);

module.exports = router;
