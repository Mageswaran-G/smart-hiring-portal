const express    = require('express');
const router     = express.Router();
const ctrl       = require('../../controllers/v1/notificationController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');

const allRoles = ['candidate', 'company', 'admin'];

router.get('/',              verifyToken, authorizeRole(...allRoles), ctrl.getAll);
router.get('/unread-count',  verifyToken, authorizeRole(...allRoles), ctrl.getUnreadCount);
router.patch('/read-all',    verifyToken, authorizeRole(...allRoles), ctrl.markAllRead);
router.patch('/:id/read',    verifyToken, authorizeRole(...allRoles), ctrl.markOneRead);
router.delete('/',           verifyToken, authorizeRole(...allRoles), ctrl.clearAll);

module.exports = router;
