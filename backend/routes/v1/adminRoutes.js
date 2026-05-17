// adminRoutes
const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../../middleware/authMiddleware');
const { authorize }   = require('../../middleware/roleMiddleware');
const { getPlatformStats } = require('../../controllers/v1/adminController');

// All admin routes require auth + admin role
router.use(verifyToken, authorize('admin'));

router.get('/stats', getPlatformStats);

module.exports = router;