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
router.get('/company/my-jobs', verifyToken, authorizeRole('company'), getMyJobs);

// PUBLIC
router.get('/',    getAllJobs);
router.get('/:id', getJobById);

// COMPANY ONLY
router.post('/',             verifyToken, authorizeRole('company'), validateJobInput, createJob);
router.put('/:id',           verifyToken, authorizeRole('company'), validateJobInput, updateJob);
router.delete('/:id',        verifyToken, authorizeRole('company'), deleteJob);
router.patch('/:id/status',  verifyToken, authorizeRole('company'), updateJobStatus);

module.exports = router;