// jobService.js
// All job API calls in one place
// Uses the same API instance from authService (has token interceptor)

import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';


// Get all jobs — public (search, filter, pagination)
export const getAllJobs = async (params = {}) => {
  const response = await API.get(API_ENDPOINTS.JOBS, { params });
  return response.data;
};

// Get single job by ID — public
export const getJobById = async (id) => {
  const response = await API.get(API_ENDPOINTS.JOB_BY_ID(id));
  return response.data;
};

// Get company's own jobs — company only
export const getMyJobs = async () => {
  const res = await API.get(API_ENDPOINTS.MY_JOBS);
  return res.data.data;     
};

// Create new job — company only
export const createJob = async (jobData) => {
  const response = await API.post(API_ENDPOINTS.JOBS, jobData);
  return response.data;
};

// Update job — company only
export const updateJob = async (id, jobData) => {
  const response = await API.put(API_ENDPOINTS.JOB_BY_ID(id), jobData);
  return response.data;
};

// Update job status (isActive / status) — company only
export const updateJobStatus = async (id, statusData) => {
  const response = await API.patch(API_ENDPOINTS.JOB_STATUS(id), statusData);
  return response.data;
};

// Delete job (soft delete) — company only
export const deleteJob = async (id) => {
  const response = await API.delete(API_ENDPOINTS.JOB_BY_ID(id));
  return response.data;
};



export const applyToJob = async (jobId, coverLetter = '') => {
  const response = await API.post(API_ENDPOINTS.APPLY_TO_JOB(jobId), { coverLetter });
  return response.data;
};

export const getCompanyDashboardStats = async () => {
  const res = await API.get(API_ENDPOINTS.COMPANY_DASHBOARD_STATS);
  return res.data.data;
};

export const getCompanyTrend = async () => {
  const res = await API.get(API_ENDPOINTS.COMPANY_TREND);
  return res.data.data;
};

// Get single job by SEO slug — for job details page
export const getJobBySlug = async (slug) => {
  const res = await API.get(API_ENDPOINTS.JOB_BY_SLUG(slug));
  return res.data;
};