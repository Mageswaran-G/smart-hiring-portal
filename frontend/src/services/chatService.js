import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';

export const sendChatMessage = async (message) => {
  const res = await API.post(API_ENDPOINTS.CHAT_MESSAGE, { message });
  return res.data.data;
};

export const getChatHistory = async () => {
  const res = await API.get(API_ENDPOINTS.CHAT_HISTORY);
  return res.data.data.messages;
};

export const clearChatHistory = async () => {
  const res = await API.delete(API_ENDPOINTS.CHAT_HISTORY);
  return res.data;
};
