const Notification = require('../models/Notification');

const createNotification = async (userId, type, title, message, metadata = {}) => {
  try {
    await Notification.create({ user: userId, type, title, message, metadata });
  } catch (error) {
    console.error('[notificationService] createNotification error:', error);
  }
};

const getNotifications = async (userId, limit = 20) => {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user: userId, isRead: false });
};

const markAllRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });
};

const markOneRead = async (notificationId, userId) => {
  await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { isRead: true } }
  );
};

const clearAll = async (userId) => {
  await Notification.deleteMany({ user: userId });
};

module.exports = { createNotification, getNotifications, getUnreadCount, markAllRead, markOneRead, clearAll };
