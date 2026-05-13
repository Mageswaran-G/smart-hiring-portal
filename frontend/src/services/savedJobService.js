// savedJobService.js
// All saved job API calls in one place

import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';


// Get all saved jobs with full details
export const getSavedJobs = async () => {
  const res = await API.get(API_ENDPOINTS.SAVED_JOBS);
  return res.data;
};


// Get only saved job IDs — lightweight, for bookmark check
export const getSavedJobIds = async () => {
  const res = await API.get(API_ENDPOINTS.SAVED_JOB_IDS);
  return res.data;
};


// Save a job
export const saveJob = async (jobId) => {
  const res = await API.post(API_ENDPOINTS.SAVE_JOB(jobId));
  return res.data;
};


// Unsave a job
export const unsaveJob = async (jobId) => {
  const res = await API.delete(API_ENDPOINTS.UNSAVE_JOB(jobId));
  return res.data;
};