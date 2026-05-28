// AI Service — Match Score, Recommendations

import { API } from './authService';

// Normalize AI errors into consistent shape
const normalizeAIError = (err) => {
  const data = err.response?.data;
  return {
    message: data?.message || err.message || 'AI service unavailable',
    status: err.response?.status || 500,
    retryable: !err.response || err.response.status >= 500,
  };
};

export const getMatchScore = async (jobId) => {
  try {
    const res = await API.get(`/ai/match/${jobId}`);
    return res.data.data;
  } catch (err) {
    throw normalizeAIError(err);
  }
};

export const getRecommendations = async () => {
  try {
    const res = await API.get('/ai/recommendations');
    return res.data.data;
  } catch (err) {
    throw normalizeAIError(err);
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
    const res = await API.get(`/ai/rank/${jobId}${query}`, { timeout: 15000 });
    return res.data.data;
  } catch (err) {
    throw normalizeAIError(err);
  }
};

// Generate cover letter using AI
export const generateCoverLetter = async (jobId) => {
  try {
    const res = await API.post('/ai/cover-letter', { jobId });
    return res.data.data;
  } catch (err) {
    throw normalizeAIError(err);
  }
};

// Get match scores for multiple jobs at once
export const getMatchScoreBatch = async (jobIds) => {
  try {
    const res = await API.post('/ai/match-batch', { jobIds });
    return res.data.data.scores;
  } catch (err) {
    console.warn('[AI] Batch scoring unavailable:', err?.message);
    return {}; // graceful degradation — scores are optional UI enhancement
  }
};

// Generate interview questions for a job
export const generateInterviewQuestions = async (jobId) => {
  try {
    const res = await API.post('/ai/interview-questions', { jobId });
    return res.data.data;
  } catch (err) {
    throw normalizeAIError(err);
  }
};

export const generateResumeFeedback = async () => {
  try {
    const res = await API.post('/ai/resume-feedback');
    return res.data.data;
  } catch (err) {
    throw normalizeAIError(err);
  }
};

export const getATSScore = async () => {
  try {
    const res = await API.get('/ai/ats-score', { timeout: 10000 });
    return res.data.data;
  } catch (err) {
    throw normalizeAIError(err);
  }
};

export const getJobATSMatch = async (jobId) => {
  try {
    const res = await API.get(`/ai/job-ats/${jobId}`, { timeout: 10000 });
    return res.data.data;
  } catch (err) {
    throw normalizeAIError(err);
  }
};