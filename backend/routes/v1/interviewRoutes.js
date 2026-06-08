/**
 * @swagger
 * /api/v1/interviews:
 *   post:
 *     tags: [Interviews]
 *     summary: Schedule an interview for a shortlisted candidate (Company only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [applicationId, scheduledAt]
 *             properties:
 *               applicationId: { type: string }
 *               scheduledAt:   { type: string, format: date-time }
 *               mode:          { type: string, enum: [online, in-person, phone] }
 *               meetingLink:   { type: string }
 *               notes:         { type: string }
 *     responses:
 *       201: { description: Interview scheduled and candidate notified }
 *       400: { description: Candidate not shortlisted or interview already exists }
 *
 * /api/v1/interviews/my:
 *   get:
 *     tags: [Interviews]
 *     summary: Get all interviews for logged-in candidate
 *     responses:
 *       200: { description: List of scheduled interviews }
 *
 * /api/v1/interviews/company:
 *   get:
 *     tags: [Interviews]
 *     summary: Get all interviews scheduled by the company
 *     responses:
 *       200: { description: List of interviews with candidate details }
 *
 * /api/v1/interviews/{id}/reschedule:
 *   patch:
 *     tags: [Interviews]
 *     summary: Reschedule an interview (Company only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Interview rescheduled }
 *
 * /api/v1/interviews/{id}/status:
 *   patch:
 *     tags: [Interviews]
 *     summary: Update interview status — candidate accepts/rejects, company completes/cancels
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
 *               status: { type: string, enum: [accepted, rejected, completed, cancelled] }
 *     responses:
 *       200: { description: Status updated }
 */
const express = require('express');
const router  = express.Router();
const ctrl    = require('../../controllers/v1/interviewController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');
const validateObjectId = require('../../middleware/validateObjectId');

// POST /api/v1/interviews — company schedules interview
router.post('/',
  verifyToken,
  authorizeRole('company'),
  ctrl.schedule
);

// GET /api/v1/interviews/my — candidate views interviews
router.get('/my',
  verifyToken,
  authorizeRole('candidate'),
  ctrl.getMyInterviews
);

// GET /api/v1/interviews/company — company views interviews
router.get('/company',
  verifyToken,
  authorizeRole('company'),
  ctrl.getCompanyInterviews
);

// PATCH /api/v1/interviews/:id/reschedule — company reschedules
router.patch('/:id/reschedule',
  validateObjectId('id'),
  verifyToken,
  authorizeRole('company'),
  ctrl.reschedule
);

// PATCH /api/v1/interviews/:id/status — candidate or company updates status
router.patch('/:id/status',
  validateObjectId('id'),
  verifyToken,
  authorizeRole('candidate', 'company'),
  ctrl.updateStatus
);

module.exports = router;
