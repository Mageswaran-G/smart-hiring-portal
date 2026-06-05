import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';

export const fetchNotifications = async () => {
  const res = await API.get(API_ENDPOINTS.NOTIFICATIONS);
  return res.data.data.notifications;
};

export const fetchUnreadCount = async () => {
  const res = await API.get(API_ENDPOINTS.NOTIFICATIONS_UNREAD);
  return res.data.data.count;
};

export const markAllNotificationsRead = async () => {
  await API.patch(API_ENDPOINTS.NOTIFICATIONS_READ_ALL);
};

export const markNotificationRead = async (id) => {
  await API.patch(`${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`);
};

export const clearAllNotifications = async () => {
  await API.delete(API_ENDPOINTS.NOTIFICATIONS);
};
