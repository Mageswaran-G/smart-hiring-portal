/**
 * @swagger
 * /api/v1/ai/match/{jobId}:
 *   get:
 *     tags: [AI]
 *     summary: Get AI match score for candidate vs job (Candidate only)
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
 * /api/v1/ai/ats-score:
 *   get:
 *     tags: [AI]
 *     summary: Get ATS resume quality score for candidate (0-100) (Candidate only)
 *     responses:
 *       200: { description: ATS score with breakdown and improvement suggestions }
 *
 * /api/v1/ai/job-ats/{jobId}:
 *   get:
 *     tags: [AI]
 *     summary: Get ATS score for candidate resume vs specific job (Candidate only)
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job-specific ATS match score }
 *
 * /api/v1/ai/recommendations:
 *   get:
 *     tags: [AI]
 *     summary: Get personalized job recommendations based on candidate skills (Candidate only)
 *     responses:
 *       200: { description: List of recommended jobs with match scores }
 *
 * /api/v1/ai/rank/{jobId}:
 *   get:
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
 * /api/v1/ai/cover-letter:
 *   post:
 *     tags: [AI]
 *     summary: Generate AI cover letter for a job (Candidate only)
 *     responses:
 *       200: { description: Generated cover letter text }
 *
 * /api/v1/ai/resume-feedback:
 *   post:
 *     tags: [AI]
 *     summary: Get AI feedback on candidate resume (Candidate only)
 *     responses:
 *       200: { description: Actionable resume improvement feedback }
 *
 * /api/v1/ai/interview-questions:
 *   post:
 *     tags: [AI]
 *     summary: Generate role-specific interview questions (Company only)
 *     responses:
 *       200: { description: List of interview questions }
 *
 * /api/v1/ai/analyze-jd:
 *   post:
 *     tags: [AI]
 *     summary: Analyze job description and extract required and preferred skills (Company only)
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