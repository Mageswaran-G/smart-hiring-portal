// adminRoutes
const express = require('express');
const router  = express.Router();

const { verifyToken } = require('../../middleware/authMiddleware');
const { authorize }   = require('../../middleware/roleMiddleware');
const {
  getPlatformStats,
  getAllCompanies,
  verifyCompany,
} = require('../../controllers/v1/adminController');

// Every admin route needs:
// 1. verifyToken  — check JWT is valid (user is logged in)
// 2. authorize    — check user role is 'admin'
// Both run on every request to /api/v1/admin/*
router.use(verifyToken, authorize('admin'));

// GET  /api/v1/admin/stats            — platform analytics numbers
router.get('/stats', getPlatformStats);

// GET  /api/v1/admin/companies        — all company accounts
router.get('/companies', getAllCompanies);

// PATCH /api/v1/admin/companies/:id/verify  — toggle isVerified
router.patch('/companies/:id/verify', verifyCompany);



module.exports = router;