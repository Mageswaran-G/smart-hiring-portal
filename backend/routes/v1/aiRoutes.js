const express = require('express');
const router = express.Router();
const { getMatchScore, getRecommendations, rankCandidates, generateCoverLetter, getMatchScoreBatch } = require('../../controllers/aiController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');

// All AI routes require login
router.use(verifyToken);

// Candidate only
router.get('/rank/:jobId', authorizeRole('company'), rankCandidates);
router.get('/recommendations', authorizeRole('candidate'), getRecommendations);
router.get('/match/:jobId', authorizeRole('candidate'), getMatchScore);
router.post('/cover-letter', authorizeRole('candidate'), generateCoverLetter);
router.post('/match-batch', authorizeRole('candidate'), getMatchScoreBatch);

module.exports = router;
