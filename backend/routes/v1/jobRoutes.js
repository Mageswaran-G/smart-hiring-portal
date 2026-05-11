// jobRoutes.js
const express = require('express');
const router = express.Router();

// ✅ Import verifyToken from authMiddleware
const { verifyToken } = require('../../middleware/authMiddleware');

// ✅ Import authorize from roleMiddleware
const { authorize } = require('../../middleware/roleMiddleware');

// Validator
const { validateJobInput } = require('../../validators/jobValidator');

// Controller
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  getMyJobs,
} = require('../../controllers/v1/jobController');

// ⚠️ MUST be before /:id — otherwise Express thinks "my-jobs" is an ID
router.get('/company/my-jobs', verifyToken, authorize('company'), getMyJobs);

// PUBLIC — no token needed
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// COMPANY ONLY — token required
router.post('/', verifyToken, authorize('company'), validateJobInput, createJob);
router.put('/:id', verifyToken, authorize('company'), validateJobInput, updateJob);
router.delete('/:id', verifyToken, authorize('company'), deleteJob);
router.patch('/:id/status', verifyToken, authorize('company'), updateJobStatus);

module.exports = router;