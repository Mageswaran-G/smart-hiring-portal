// AI Service — Match Score, Recommendations

import api from './api';

// Get match score for a specific job
export const getMatchScore = async (jobId) => {
  const res = await api.post(`/ai/match/${jobId}`);
  return res.data.data;
};

// Get AI job recommendations for candidate
export const getRecommendations = async () => {
  const res = await api.get('/ai/recommendations');
  return res.data.data;
};
