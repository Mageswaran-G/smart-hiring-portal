// aiRoutes.js — All AI feature routes

const express = require('express');
const router  = express.Router();

const { verifyToken, authorizeRole }  = require('../../middleware/authMiddleware');
const { getMatchScore, getMatchScoreBatch }  = require('../../controllers/ai/matchController');
const { getRecommendations, rankCandidates } = require('../../controllers/ai/recommendationController');
const { generateCoverLetter, generateInterviewQuestions, generateResumeFeedback } = require('../../controllers/ai/generationController');

// All AI routes require login
router.use(verifyToken);

// Candidate only
router.get('/recommendations',      authorizeRole('candidate'), getRecommendations);
router.get('/match/:jobId',         authorizeRole('candidate'), getMatchScore);
router.post('/cover-letter',        authorizeRole('candidate'), generateCoverLetter);
router.post('/match-batch',         authorizeRole('candidate'), getMatchScoreBatch);
router.post('/resume-feedback',     authorizeRole('candidate'), generateResumeFeedback);

// Company only
router.get('/rank/:jobId',          authorizeRole('company'),   rankCandidates);
router.post('/interview-questions', authorizeRole('company'),   generateInterviewQuestions);

module.exports = router;