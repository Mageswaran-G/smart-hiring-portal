const express = require('express');
const router = express.Router();
const { getMatchScore, getRecommendations } = require('../../controllers/aiController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');

// All AI routes require login
router.use(verifyToken);

// Candidate only
router.get('/recommendations', authorizeRole('candidate'), getRecommendations);
router.get('/match/:jobId', authorizeRole('candidate'), getMatchScore);

module.exports = router;
