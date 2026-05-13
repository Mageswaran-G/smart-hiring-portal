// applicationService.js
// All application API calls in one place
// Pages import from here — never call API directly

import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';


// Candidate applies for a job
export const applyToJob = async (jobId, coverLetter = '') => {
  const res = await API.post(API_ENDPOINTS.APPLY_TO_JOB(jobId), { coverLetter });
  return res.data;
};


// Candidate gets their own applications
export const getMyApplications = async () => {
  const res = await API.get(API_ENDPOINTS.MY_APPLICATIONS);
  return res.data;
};


// Company gets all applications for their jobs
export const getCompanyApplications = async () => {
  const res = await API.get(API_ENDPOINTS.COMPANY_APPLICATIONS);
  return res.data;
};


// Company updates one application's status
export const updateApplicationStatus = async (applicationId, status) => {
  const res = await API.patch(
    API_ENDPOINTS.UPDATE_APPLICATION_STATUS(applicationId),
    { status }
  );
  return res.data;
};