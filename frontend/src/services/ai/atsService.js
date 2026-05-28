import { API } from '../authService';
import { normalizeAIError } from './aiUtils';

export const getATSScore = async () => {
  try {
    const res = await API.get('/ai/ats-score', { timeout: 10000 });
    return res.data.data;
  } catch (err) { throw normalizeAIError(err); }
};