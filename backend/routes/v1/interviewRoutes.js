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

// PATCH /api/v1/interviews/:id/status — candidate or company updates status
router.patch('/:id/status',
  validateObjectId('id'),
  verifyToken,
  authorizeRole('candidate', 'company'),
  ctrl.updateStatus
);

module.exports = router;
