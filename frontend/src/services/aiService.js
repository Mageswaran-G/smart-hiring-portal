// AI Service — Match Score, Recommendations

import { API } from './authService';

export const getMatchScore = async (jobId) => {
  try {
    const res = await API.get(`/ai/match/${jobId}`);
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getRecommendations = async () => {
  try {
    const res = await API.get('/ai/recommendations');
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get ranked candidates for a job (company only)
export const getRankedCandidates = async (jobId) => {
  try {
    const res = await API.get(`/ai/rank/${jobId}`);
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Generate cover letter using AI
export const generateCoverLetter = async (jobId) => {
  try {
    const res = await API.post('/ai/cover-letter', { jobId });
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
