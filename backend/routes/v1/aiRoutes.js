/**
 * @swagger
 * /api/v1/ai/match/{jobId}:
 *   get:
 *     tags: [AI]
 *     summary: Get AI match score for candidate vs job
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Match score with skill breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:         { type: number, example: 82 }
 *                 matchedSkills: { type: array, items: { type: string } }
 *                 missingSkills: { type: array, items: { type: string } }
 *                 confidence:    { type: string, enum: [High, Medium, Low] }
 *
 * /api/v1/ai/ats:
 *   get:
 *     tags: [AI]
 *     summary: Get ATS resume quality score for candidate (0-100)
 *     responses:
 *       200: { description: ATS score with breakdown and improvement suggestions }
 *
 * /api/v1/ai/recommendations:
 *   get:
 *     tags: [AI]
 *     summary: Get personalized job recommendations based on candidate skills
 *     responses:
 *       200: { description: List of recommended jobs with match scores }
 *
 * /api/v1/ai/rank/{jobId}:
 *   post:
 *     tags: [AI]
 *     summary: Rank all applicants for a job by composite AI score (Company only)
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Ranked candidate list with hiring recommendations }
 *
 * /api/v1/ai/generate/cover-letter:
 *   post:
 *     tags: [AI]
 *     summary: Generate AI cover letter for a job
 *     responses:
 *       200: { description: Generated cover letter text }
 *
 * /api/v1/ai/generate/resume-feedback:
 *   post:
 *     tags: [AI]
 *     summary: Get AI feedback on candidate resume
 *     responses:
 *       200: { description: Actionable resume improvement feedback }
 *
 * /api/v1/ai/generate/interview-questions:
 *   post:
 *     tags: [AI]
 *     summary: Generate role-specific interview questions
 *     responses:
 *       200: { description: List of interview questions }
 *
 * /api/v1/ai/generate/analyze-jd:
 *   post:
 *     tags: [AI]
 *     summary: Analyze job description and extract required and preferred skills
 *     responses:
 *       200: { description: Extracted skills categorized as required and preferred }
 */
const express    = require('express');
const router     = express.Router();
const { verifyToken, authorizeRole }             = require('../../middleware/authMiddleware');
const { aiHeavyLimiter }                         = require('../../middleware/rateLimiters');
const { getMatchScore, getMatchScoreBatch, getJobATSMatch } = require('../../controllers/ai/matchController');
const { getRecommendations, rankCandidates }      = require('../../controllers/ai/recommendationController');
const { generateCoverLetter, generateInterviewQuestions, generateResumeFeedback, getATSScore, analyzeJobDescription } = require('../../controllers/ai/generationController');

// All AI routes require login
router.use(verifyToken);

// Candidate only — lightweight
router.get('/recommendations',      authorizeRole('candidate'), getRecommendations);
router.get('/match/:jobId',         authorizeRole('candidate'), getMatchScore);
router.post('/match-batch',         authorizeRole('candidate'), getMatchScoreBatch);
router.get('/job-ats/:jobId', authorizeRole('candidate'), getJobATSMatch);
router.get('/ats-score', authorizeRole('candidate'), getATSScore);

// Candidate only — heavy generation
router.post('/cover-letter',        authorizeRole('candidate'), aiHeavyLimiter, generateCoverLetter);
router.post('/resume-feedback',     authorizeRole('candidate'), aiHeavyLimiter, generateResumeFeedback);


// Company only
router.get('/rank/:jobId',          authorizeRole('company'),   rankCandidates);
router.post('/interview-questions', authorizeRole('company'),   aiHeavyLimiter, generateInterviewQuestions);
router.post('/analyze-jd',          authorizeRole('company'),   aiHeavyLimiter, analyzeJobDescription);
module.exports = router;