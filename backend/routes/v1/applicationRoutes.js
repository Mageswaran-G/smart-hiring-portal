/**
 * @swagger
 * /api/v1/applications/{jobId}/apply:
 *   post:
 *     tags: [Applications]
 *     summary: Apply to a job (Candidate only)
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverLetter: { type: string }
 *     responses:
 *       201: { description: Application submitted }
 *       400: { description: Already applied or deadline passed }
 *
 * /api/v1/applications/my:
 *   get:
 *     tags: [Applications]
 *     summary: Get all my applications (Candidate only)
 *     responses:
 *       200: { description: List of applications with status history }
 *
 * /api/v1/applications/my/trend:
 *   get:
 *     tags: [Applications]
 *     summary: Get 7-day application trend data for sparkline chart
 *     responses:
 *       200: { description: Array of 7 daily counts }
 *
 * /api/v1/applications/company:
 *   get:
 *     tags: [Applications]
 *     summary: Get all applications for company jobs (Company only)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [applied, reviewing, shortlisted, rejected, hired, withdrawn] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated list of applications }
 *
 * /api/v1/applications/{id}/status:
 *   patch:
 *     tags: [Applications]
 *     summary: Update application status (Company only) — triggers email notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [reviewing, shortlisted, rejected, hired] }
 *     responses:
 *       200: { description: Status updated and email sent to candidate }
 *
 * /api/v1/applications/{id}/withdraw:
 *   delete:
 *     tags: [Applications]
 *     summary: Withdraw an application (Candidate only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Application withdrawn successfully }
 */
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

// GET  /api/v1/applications/my/trend
router.get(
  '/my/trend',
  verifyToken,
  authorizeRole('candidate'),
  applicationController.getMyApplicationTrend
);

// POST /api/v1/applications/:jobId/apply
router.post(
  '/:jobId/apply',
  verifyToken,
  authorizeRole('candidate'),
  applicationController.applyToJob
);

// DELETE /api/v1/applications/:applicationId/withdraw
router.delete(
  '/:applicationId/withdraw',
  verifyToken,
  authorizeRole('candidate'),
  applicationController.withdrawApplication
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