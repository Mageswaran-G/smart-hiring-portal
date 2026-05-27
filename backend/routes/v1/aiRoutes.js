const express = require('express');
const router = express.Router();

const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');
const { getMatchScore, getRecommendations, rankCandidates, generateCoverLetter, getMatchScoreBatch, generateInterviewQuestions, generateResumeFeedback } = require('../../controllers/aiController');

// All AI routes require login
router.use(verifyToken);


// Company only
router.get('/rank/:jobId', authorizeRole('company'), rankCandidates);

router.get('/recommendations', authorizeRole('candidate'), getRecommendations);
router.get('/match/:jobId', authorizeRole('candidate'), getMatchScore);
router.post('/cover-letter', authorizeRole('candidate'), generateCoverLetter);
router.post('/interview-questions', authorizeRole('company'), generateInterviewQuestions);
router.post('/match-batch', authorizeRole('candidate'), getMatchScoreBatch);
router.post('/resume-feedback', authorizeRole('candidate'), generateResumeFeedback);

module.exports = router;
