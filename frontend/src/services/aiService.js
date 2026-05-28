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

export const getRankedCandidates = async (jobId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.minScore)      params.append('minScore', filters.minScore);
    if (filters.recommendation) params.append('recommendation', filters.recommendation);
    if (filters.confidence)    params.append('confidence', filters.confidence);
    if (filters.sortBy)        params.append('sortBy', filters.sortBy);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await API.get(`/ai/rank/${jobId}${query}`);
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

// Get match scores for multiple jobs at once
export const getMatchScoreBatch = async (jobIds) => {
  try {
    const res = await API.post('/ai/match-batch', { jobIds });
    return res.data.data.scores;
  } catch (err) {
    return {}; // silently fail — scores are optional
  }
};

// Generate interview questions for a job
export const generateInterviewQuestions = async (jobId) => {
  try {
    const res = await API.post('/ai/interview-questions', { jobId });
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const generateResumeFeedback = async () => {
  try {
    const res = await API.post('/ai/resume-feedback');
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getATSScore = async () => {
  try {
    const res = await API.get('/ai/ats-score');
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getJobATSMatch = async (jobId) => {
  try {
    const res = await API.get(`/ai/job-ats/${jobId}`);
    return res.data.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};