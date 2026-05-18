// constants/api
// All backend API endpoints in one place
// Never write raw URL strings in pages — always import from here

export const API_ENDPOINTS = {

  // ── Auth ────────────────────────────────────────────
  LOGIN:    '/auth/login',
  SIGNUP:   '/auth/signup',
  LOGOUT:   '/auth/logout',
  REFRESH:  '/auth/refresh',

  // ── Profile ─────────────────────────────────────────
  PROFILE:           '/users/profile',
  UPLOAD_RESUME:     '/users/upload-resume',
  UPLOAD_PHOTO:      '/users/upload-photo',
  UPLOAD_RESUME_ADD: '/users/upload-resume',
  RESUMES_UPDATE:    '/users/profile',

  // ── Jobs ────────────────────────────────────────────
  JOBS:              '/jobs',
  JOB_BY_ID:         (id)   => `/jobs/${id}`,
  JOB_STATUS:        (id)   => `/jobs/${id}/status`,
  MY_JOBS:           '/jobs/company/my-jobs',
  JOB_BY_SLUG:       (slug) => `/jobs/slug/${slug}`,
  COMPANY_DASHBOARD_STATS: '/jobs/company/dashboard-stats',

  // ── Applications — Candidate ─────────────────────────
  APPLY_TO_JOB:     (jobId) => `/applications/${jobId}/apply`,
  MY_APPLICATIONS:  '/applications/my',

  // ── Applications — Company ───────────────────────────
  COMPANY_APPLICATIONS:      '/applications/company',
  UPDATE_APPLICATION_STATUS: (id) => `/applications/${id}/status`,

  // ── Saved Jobs ───────────────────────────────────────
  SAVED_JOBS:   '/saved',
  SAVED_JOB_IDS: '/saved/ids',
  SAVE_JOB:     (jobId) => `/saved/${jobId}`,
  UNSAVE_JOB:   (jobId) => `/saved/${jobId}`,

  // ── Admin ────────────────────────────────────────────
  ADMIN_STATS:    '/admin/stats',

  // Get all company accounts list
  ADMIN_COMPANIES: '/admin/companies',

  // Toggle verify/unverify a company — :id = company user ID
  ADMIN_VERIFY_COMPANY: (id) => `/admin/companies/${id}/verify`,

};