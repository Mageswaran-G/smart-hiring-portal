import { API } from '../authService';
import { normalizeAIError } from './aiUtils';

export const getRankedCandidates = async (jobId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.minScore)       params.append('minScore', filters.minScore);
    if (filters.recommendation) params.append('recommendation', filters.recommendation);
    if (filters.confidence)     params.append('confidence', filters.confidence);
    if (filters.sortBy)         params.append('sortBy', filters.sortBy);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await API.get(`/ai/rank/${jobId}${query}`, { timeout: 15000 });
    return res.data.data;
  } catch (err) { throw normalizeAIError(err); }
};