import { API } from '../authService';
import { normalizeAIError } from './aiUtils';

export const getRecommendations = async () => {
  try {
    const res = await API.get('/ai/recommendations');
    return res.data.data;
  } catch (err) { throw normalizeAIError(err); }
};