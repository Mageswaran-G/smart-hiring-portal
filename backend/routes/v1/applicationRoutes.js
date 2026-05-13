const express = require('express');
const router = express.Router();

const applicationController = require('../../controllers/v1/applicationController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');

// ─── Candidate routes ────────────────────────────────────────

// GET  /api/v1/applications/my
router.get(
  '/my',
  verifyToken,
  authorizeRole('candidate'),
  applicationController.getMyApplications
);

// POST /api/v1/applications/:jobId/apply
router.post(
  '/:jobId/apply',
  verifyToken,
  authorizeRole('candidate'),
  applicationController.applyToJob
);

// ─── Company routes ──────────────────────────────────────────

// GET  /api/v1/applications/company
router.get(
  '/company',
  verifyToken,
  authorizeRole('company'),
  applicationController.getCompanyApplications
);

// PATCH /api/v1/applications/:applicationId/status
router.patch(
  '/:applicationId/status',
  verifyToken,
  authorizeRole('company'),
  applicationController.updateApplicationStatus
);

module.exports = router;