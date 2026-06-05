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
