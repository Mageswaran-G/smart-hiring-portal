// jobRoutes

const express = require('express');
const router  = express.Router();

const { verifyToken } = require('../../middleware/authMiddleware');
const { authorize }   = require('../../middleware/roleMiddleware');
const { validateJobInput } = require('../../validators/jobValidator');

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  getMyJobs,
  getCompanyDashboardStats,  
} = require('../../controllers/v1/jobController');

// Dashboard stats — must be before /:id route
router.get(
  '/company/dashboard-stats',
  verifyToken,
  authorize('company'),         
  getCompanyDashboardStats      
);

// My jobs — must be before /:id route
router.get('/company/my-jobs', verifyToken, authorize('company'), getMyJobs);

// PUBLIC
router.get('/',    getAllJobs);
router.get('/:id', getJobById);

// COMPANY ONLY
router.post('/',          verifyToken, authorize('company'), validateJobInput, createJob);
router.put('/:id',        verifyToken, authorize('company'), validateJobInput, updateJob);
router.delete('/:id',     verifyToken, authorize('company'), deleteJob);
router.patch('/:id/status', verifyToken, authorize('company'), updateJobStatus);

module.exports = router;