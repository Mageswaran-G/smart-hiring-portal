import { API } from '../authService';
import { normalizeAIError } from './aiUtils';

export const generateCoverLetter = async (jobId) => {
  try {
    const res = await API.post('/ai/cover-letter', { jobId });
    return res.data.data;
  } catch (err) { throw normalizeAIError(err); }
};

export const generateInterviewQuestions = async (jobId) => {
  try {
    const res = await API.post('/ai/interview-questions', { jobId });
    return res.data.data;
  } catch (err) { throw normalizeAIError(err); }
};

export const generateResumeFeedback = async () => {
  try {
    const res = await API.post('/ai/resume-feedback');
    return res.data.data;
  } catch (err) { throw normalizeAIError(err); }
};

export const analyzeJobDescription = async (description) => {
  try {
    const res = await API.post('/ai/analyze-jd', { description }, { timeout: 10000 });
    return res.data.data;
  } catch (err) { throw normalizeAIError(err); }
};