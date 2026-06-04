// applicationService

import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';

// ─── Used by CandidateDashboard (returns array directly) ──────
// No change — dashboard still works
export const getMyApplications = async () => {
  const res = await API.get(API_ENDPOINTS.MY_APPLICATIONS);
  return res.data.data;
};

// ─── Used by CandidateApplicationsPage (returns data + pagination) ──
// page=1 by default. Call with page=2 to load next page.
export const getMyApplicationsPaginated = async (page = 1, limit = 10) => {
  const res = await API.get(API_ENDPOINTS.MY_APPLICATIONS, {
    params: { page, limit },
  });
  return {
    data:       res.data.data,
    pagination: res.data.pagination,
  };
};

// ─── Used by CompanyDashboard (returns array directly) ────────
// No change — dashboard still works
export const getCompanyApplications = async () => {
  const res = await API.get(API_ENDPOINTS.COMPANY_APPLICATIONS);
  return res.data.data;
};

// ─── Used by CompanyApplicationsPage (returns data + pagination) ──
export const getCompanyApplicationsPaginated = async (page = 1, limit = 10) => {
  const res = await API.get(API_ENDPOINTS.COMPANY_APPLICATIONS, {
    params: { page, limit },
  });
  return {
    data:       res.data.data,
    pagination: res.data.pagination,
  };
};

// ─── Apply to a job ───────────────────────────────────────────
export const applyToJob = async (jobId, coverLetter = '') => {
  const res = await API.post(API_ENDPOINTS.APPLY_TO_JOB(jobId), { coverLetter });
  return res.data;
};

// ─── Company updates application status ───────────────────────
export const updateApplicationStatus = async (applicationId, status) => {
  const res = await API.patch(
    API_ENDPOINTS.UPDATE_APPLICATION_STATUS(applicationId),
    { status }
  );
  return res.data;
};

// ─── Candidate 7-day application trend ───────────────────────
export const getMyApplicationTrend = async () => {
  const res = await API.get(API_ENDPOINTS.MY_APPLICATIONS_TREND);
  return res.data;
};