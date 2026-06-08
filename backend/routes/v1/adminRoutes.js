/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get platform-wide stats — users, jobs, applications, hire rate
 *     responses:
 *       200: { description: Complete platform statistics }
 *
 * /api/v1/admin/companies:
 *   get:
 *     tags: [Admin]
 *     summary: Get all company accounts with search and filter
 *     responses:
 *       200: { description: Paginated company list }
 *
 * /api/v1/admin/companies/{id}/verify:
 *   patch:
 *     tags: [Admin]
 *     summary: Toggle company verification status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Company verification toggled }
 *
 * /api/v1/admin/companies/{id}/suspend:
 *   patch:
 *     tags: [Admin]
 *     summary: Toggle company suspension
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Company suspension toggled }
 *
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users with search, role filter, status filter
 *     responses:
 *       200: { description: Paginated user list }
 *
 * /api/v1/admin/users/{id}/suspend:
 *   patch:
 *     tags: [Admin]
 *     summary: Toggle user suspension — clears all sessions if suspending
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User suspension toggled }
 *
 * /api/v1/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Soft delete a user — sets isDeleted true, clears sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User soft deleted }
 *
 * /api/v1/admin/users/{id}/restore:
 *   patch:
 *     tags: [Admin]
 *     summary: Restore a soft-deleted user account
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User restored }
 *
 * /api/v1/admin/jobs:
 *   get:
 *     tags: [Admin]
 *     summary: Get all platform jobs with admin-level filters
 *     responses:
 *       200: { description: All jobs including closed and expired }
 *
 * /api/v1/admin/jobs/{id}/close:
 *   patch:
 *     tags: [Admin]
 *     summary: Close an active job posting
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job closed }
 *
 * /api/v1/admin/analytics:
 *   get:
 *     tags: [Admin]
 *     summary: Get full platform analytics — funnel, trends, conversion
 *     responses:
 *       200: { description: Analytics data for charts }
 *
 * /api/v1/admin/audit-logs:
 *   get:
 *     tags: [Admin]
 *     summary: Get paginated audit logs — filterable by action and targetType
 *     parameters:
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *       - in: query
 *         name: targetType
 *         schema: { type: string, enum: [User, Company, Job] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paginated audit log entries }
 */

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
