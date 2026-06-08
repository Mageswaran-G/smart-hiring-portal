/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get all notifications for logged-in user
 *     responses:
 *       200: { description: List of notifications }
 *   delete:
 *     tags: [Notifications]
 *     summary: Clear all notifications
 *     responses:
 *       200: { description: All notifications cleared }
 *
 * /api/v1/notifications/unread-count:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notification count for bell badge
 *     responses:
 *       200: { description: Unread count }
 *
 * /api/v1/notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     responses:
 *       200: { description: All marked as read }
 *
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a single notification as read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Notification marked as read }
 */
const express    = require('express');
const router     = express.Router();
const ctrl       = require('../../controllers/v1/notificationController');
const { verifyToken, authorizeRole } = require('../../middleware/authMiddleware');
const validateObjectId = require('../../middleware/validateObjectId');

const allRoles = ['candidate', 'company', 'admin'];

router.get('/',              verifyToken, authorizeRole(...allRoles), ctrl.getAll);
router.get('/unread-count',  verifyToken, authorizeRole(...allRoles), ctrl.getUnreadCount);
router.patch('/read-all',    verifyToken, authorizeRole(...allRoles), ctrl.markAllRead);
router.patch('/:id/read',    validateObjectId('id'), verifyToken, authorizeRole(...allRoles), ctrl.markOneRead);
router.delete('/',           verifyToken, authorizeRole(...allRoles), ctrl.clearAll);

module.exports = router;
