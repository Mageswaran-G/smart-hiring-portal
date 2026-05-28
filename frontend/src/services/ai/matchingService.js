import { API } from '../authService';
import { normalizeAIError } from './aiUtils';

export const getMatchScore = async (jobId) => {
  try {
    const res = await API.get(`/ai/match/${jobId}`);
    return res.data.data;
  } catch (err) { throw normalizeAIError(err); }
};

export const getMatchScoreBatch = async (jobIds) => {
  try {
    const res = await API.post('/ai/match-batch', { jobIds });
    return res.data.data?.scores || {};
  } catch (err) {
    console.warn('[AI] Batch scoring unavailable:', err?.message);
    return {};
  }
};

export const getJobATSMatch = async (jobId) => {
  try {
    const res = await API.get(`/ai/job-ats/${jobId}`, { timeout: 10000 });
    return res.data.data;
  } catch (err) { throw normalizeAIError(err); }
};