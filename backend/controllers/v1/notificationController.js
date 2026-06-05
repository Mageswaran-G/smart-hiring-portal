const { getNotifications, getUnreadCount, markAllRead, markOneRead, clearAll } = require('../../services/notificationService');

exports.getAll = async (req, res) => {
  try {
    const notifications = await getNotifications(req.user.id);
    return res.status(200).json({ success: true, data: { notifications } });
  } catch (error) {
    console.error('[notificationController] getAll error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await getUnreadCount(req.user.id);
    return res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    console.error('[notificationController] getUnreadCount error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await markAllRead(req.user.id);
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('[notificationController] markAllRead error:', error);
    return res.status(500).json({ success: false, message: 'Failed to mark notifications as read' });
  }
};

exports.markOneRead = async (req, res) => {
  try {
    await markOneRead(req.params.id, req.user.id);
    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('[notificationController] markOneRead error:', error);
    return res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

exports.clearAll = async (req, res) => {
  try {
    await clearAll(req.user.id);
    return res.status(200).json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    console.error('[notificationController] clearAll error:', error);
    return res.status(500).json({ success: false, message: 'Failed to clear notifications' });
  }
};
