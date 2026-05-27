const express    = require('express');
const router     = express.Router();
const rateLimit  = require('express-rate-limit');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');
const { getMatchScore, getMatchScoreBatch }  = require('../../controllers/ai/matchController');
const { getRecommendations, rankCandidates } = require('../../controllers/ai/recommendationController');
const { generateCoverLetter, generateInterviewQuestions, generateResumeFeedback } = require('../../controllers/ai/generationController');

// Heavy limiter — expensive generation endpoints only
const heavyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many generation requests. Please wait 15 minutes.' }
});

// All AI routes require login
router.use(verifyToken);

// Candidate only — lightweight
router.get('/recommendations',      authorizeRole('candidate'), getRecommendations);
router.get('/match/:jobId',         authorizeRole('candidate'), getMatchScore);
router.post('/match-batch',         authorizeRole('candidate'), getMatchScoreBatch);

// Candidate only — heavy generation
router.post('/cover-letter',        authorizeRole('candidate'), heavyLimiter, generateCoverLetter);
router.post('/resume-feedback',     authorizeRole('candidate'), heavyLimiter, generateResumeFeedback);

// Company only — heavy generation
router.get('/rank/:jobId',          authorizeRole('company'),   rankCandidates);
router.post('/interview-questions', authorizeRole('company'),   heavyLimiter, generateInterviewQuestions);

module.exports = router;