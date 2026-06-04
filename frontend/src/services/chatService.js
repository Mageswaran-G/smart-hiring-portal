import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';

export const sendChatMessage = async (message, history = []) => {
  const res = await API.post(API_ENDPOINTS.CHAT_MESSAGE, { message, history });
  return res.data.data;
};
