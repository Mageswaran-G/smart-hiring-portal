// jobRoutes

const express = require('express');
const router  = express.Router();

const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');
const { validateJobInput } = require('../../validators/jobValidator');

const {
  createJob,
  getAllJobs,
  getJobById,
  getJobBySlug,
  updateJob,
  deleteJob,
  updateJobStatus,
  getMyJobs,
  getCompanyDashboardStats,
} = require('../../controllers/v1/jobController');

router.get('/slug/:slug', getJobBySlug);

// Dashboard stats 
router.get(
  '/company/dashboard-stats',
  verifyToken,
  authorizeRole('company'),       
  getCompanyDashboardStats
);

// My jobs 
/**
 * @swagger
 * /api/v1/jobs/company/my-jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Get all jobs posted by the logged-in company
 *     responses:
 *       200: { description: Company job listings }
 */
router.get('/company/my-jobs', verifyToken, authorizeRole('company'), getMyJobs);

// PUBLIC
/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Get all published jobs
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: jobType
 *         schema: { type: string, enum: [full-time, part-time, internship, contract] }
 *       - in: query
 *         name: workMode
 *         schema: { type: string, enum: [remote, hybrid, onsite] }
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: List of published jobs with pagination }
 */
router.get('/',    getAllJobs);
router.get('/:id', getJobById);

// COMPANY ONLY
/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Create a new job posting (Company only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, location, jobType, workMode]
 *             properties:
 *               title:       { type: string, example: Senior React Developer }
 *               description: { type: string }
 *               location:    { type: string, example: Chennai }
 *               jobType:     { type: string, enum: [full-time, part-time, internship, contract] }
 *               workMode:    { type: string, enum: [remote, hybrid, onsite] }
 *               skillsRequired:  { type: array, items: { type: string } }
 *               preferredSkills: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Job created successfully }
 *       403: { description: Only companies can post jobs }
 */
router.post('/',             verifyToken, authorizeRole('company'), validateJobInput, createJob);
router.put('/:id',           verifyToken, authorizeRole('company'), validateJobInput, updateJob);
router.delete('/:id',        verifyToken, authorizeRole('company'), deleteJob);
router.patch('/:id/status',  verifyToken, authorizeRole('company'), updateJobStatus);

module.exports = router;