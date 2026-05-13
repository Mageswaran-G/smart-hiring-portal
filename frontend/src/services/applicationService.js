// applicationService.js

import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';

// Returns array directly — page just uses the result
export const getMyApplications = async () => {
  const res = await API.get(API_ENDPOINTS.MY_APPLICATIONS);
  return res.data.data; // ← normalized
};

export const getCompanyApplications = async () => {
  const res = await API.get(API_ENDPOINTS.COMPANY_APPLICATIONS);
  return res.data.data; // ← normalized
};

export const applyToJob = async (jobId, coverLetter = '') => {
  const res = await API.post(API_ENDPOINTS.APPLY_TO_JOB(jobId), { coverLetter });
  return res.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const res = await API.patch(
    API_ENDPOINTS.UPDATE_APPLICATION_STATUS(applicationId),
    { status }
  );
  return res.data;
};