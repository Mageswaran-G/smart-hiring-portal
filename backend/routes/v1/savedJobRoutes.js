const express    = require('express');
const router     = express.Router();
const savedJobController = require('../../controllers/v1/savedJobController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');

// All routes — candidate only
router.use(verifyToken, authorizeRole('candidate'));

// GET  /api/v1/saved          → full saved jobs with details
router.get('/',           savedJobController.getSavedJobs);

// GET  /api/v1/saved/ids      → only job IDs (lightweight)
router.get('/ids',        savedJobController.getSavedJobIds);

// POST /api/v1/saved/:jobId   → save a job
router.post('/:jobId',    savedJobController.saveJob);

// DELETE /api/v1/saved/:jobId → unsave a job
router.delete('/:jobId',  savedJobController.unsaveJob);

module.exports = router;