// savedJobService.js

import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';

// Returns array directly
export const getSavedJobs = async () => {
  const res = await API.get(API_ENDPOINTS.SAVED_JOBS);
  return res.data.data; // ← normalized
};

export const getSavedJobIds = async () => {
  const res = await API.get(API_ENDPOINTS.SAVED_JOB_IDS);
  return res.data.data; // ← normalized
};

export const saveJob = async (jobId) => {
  const res = await API.post(API_ENDPOINTS.SAVE_JOB(jobId));
  return res.data;
};

export const unsaveJob = async (jobId) => {
  const res = await API.delete(API_ENDPOINTS.UNSAVE_JOB(jobId));
  return res.data;
};