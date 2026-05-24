// AI Service — Match Score, Recommendations

import { API } from './authService';

// Get match score for a specific job
export const getMatchScore = async (jobId) => {
  const res = await API.post(`/ai/match/${jobId}`);
  return res.data.data;
};

// Get AI job recommendations for candidate
export const getRecommendations = async () => {
  const res = await API.get('/ai/recommendations');
  return res.data.data;
};
