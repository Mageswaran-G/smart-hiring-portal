// adminRoutes.js
const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middleware/authMiddleware');
const { authorize }   = require('../../middleware/roleMiddleware');
const {
  getPlatformStats,
  getAllCompanies,
  verifyCompany,
  suspendCompany,
  getAllUsers,
  deleteUser,
  suspendUser,
} = require('../../controllers/v1/adminController');

// Every admin route needs token + admin role check
router.use(verifyToken, authorize('admin'));

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

module.exports = router;