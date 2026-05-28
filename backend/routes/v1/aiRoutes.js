const express    = require('express');
const router     = express.Router();
const { verifyToken, authorizeRole }             = require('../../middleware/authMiddleware');
const { aiHeavyLimiter }                         = require('../../middleware/rateLimiters');
const { getMatchScore, getMatchScoreBatch }       = require('../../controllers/ai/matchController');
const { getRecommendations, rankCandidates }      = require('../../controllers/ai/recommendationController');
const { generateCoverLetter, generateInterviewQuestions, generateResumeFeedback, getATSScore } = require('../../controllers/ai/generationController');

// All AI routes require login
router.use(verifyToken);

// Candidate only — lightweight
router.get('/recommendations',      authorizeRole('candidate'), getRecommendations);
router.get('/match/:jobId',         authorizeRole('candidate'), getMatchScore);
router.post('/match-batch',         authorizeRole('candidate'), getMatchScoreBatch);
router.get('/ats-score', authorizeRole('candidate'), getATSScore);

// Candidate only — heavy generation
router.post('/cover-letter',        authorizeRole('candidate'), aiHeavyLimiter, generateCoverLetter);
router.post('/resume-feedback',     authorizeRole('candidate'), aiHeavyLimiter, generateResumeFeedback);
router.get('/ats-score', authorizeRole('candidate'), getATSScore);

// Company only
router.get('/rank/:jobId',          authorizeRole('company'),   rankCandidates);
router.post('/interview-questions', authorizeRole('company'),   aiHeavyLimiter, generateInterviewQuestions);

module.exports = router;