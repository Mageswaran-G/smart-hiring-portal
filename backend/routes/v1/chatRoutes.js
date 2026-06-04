const express = require('express');
const router  = express.Router();
const chatController = require('../../controllers/v1/chatController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');

// POST /api/v1/chat/message
// All logged-in roles can use chat
router.post(
  '/message',
  verifyToken,
  authorizeRole('candidate', 'company', 'admin'),
  chatController.sendMessage
);

module.exports = router;
