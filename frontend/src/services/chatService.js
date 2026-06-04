import { API } from './authService';

export const sendChatMessage = async (message, history = []) => {
  const res = await API.post('/chat/message', { message, history });
  return res.data;
};
