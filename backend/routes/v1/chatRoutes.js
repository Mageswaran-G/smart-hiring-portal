const express = require('express');
const router  = express.Router();
const chatController = require('../../controllers/v1/chatController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');
const { chatLimiter } = require('../../middleware/rateLimiters');

// POST /api/v1/chat/message
// All logged-in roles can use chat
router.post(
  '/message',
  verifyToken,
  chatLimiter,
  authorizeRole('candidate', 'company', 'admin'),
  chatController.sendMessage
);

module.exports = router;
