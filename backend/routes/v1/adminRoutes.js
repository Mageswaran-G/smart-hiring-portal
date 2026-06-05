
const express = require('express');
const router = express.Router();

const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');

const {
  getPlatformStats,
  getAllCompanies,
  verifyCompany,
  suspendCompany,
  getAllUsers,
  deleteUser,
  suspendUser,
  restoreUser,
  getAllJobs,
  closeJob,
  deleteJob,
  getAdminAnalytics,
  getActionCenter,
  getAIHealthMetrics,
  getSystemHealth,
  getAuditLogs,
} = require('../../controllers/v1/adminController');

// Every admin route needs token + admin role check
router.use(verifyToken, authorizeRole('admin'));

// GET  /api/v1/admin/stats
router.get('/stats', getPlatformStats);

// GET  /api/v1/admin/companies
router.get('/companies', getAllCompanies);

// PATCH /api/v1/admin/companies/:id/verify
router.patch('/companies/:id/verify', verifyCompany);

// PATCH /api/v1/admin/companies/:id/suspend
router.patch('/companies/:id/suspend', suspendCompany);

// GET  /api/v1/admin/users
router.get('/users', getAllUsers);

// DELETE /api/v1/admin/users/:id
router.delete('/users/:id', deleteUser);

// PATCH /api/v1/admin/users/:id/suspend
router.patch('/users/:id/suspend', suspendUser);


router.patch('/users/:id/restore', restoreUser);

// GET /api/v1/admin/jobs
router.get('/jobs', getAllJobs);

// PATCH /api/v1/admin/jobs/:id/close
router.patch('/jobs/:id/close', closeJob);

router.delete('/jobs/:id', deleteJob);

router.get('/analytics', getAdminAnalytics);

router.get("/action-center", getActionCenter);

router.get('/ai-health', getAIHealthMetrics);
router.get("/system-health", getSystemHealth);

// GET /api/v1/admin/audit-logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;
