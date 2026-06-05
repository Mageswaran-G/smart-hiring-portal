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
  MY_APPLICATIONS:       '/applications/my',
  MY_APPLICATIONS_TREND: '/applications/my/trend',

  // ── Applications — Company ───────────────────────────
  COMPANY_APPLICATIONS:      '/applications/company',
  UPDATE_APPLICATION_STATUS: (id) => `/applications/${id}/status`,
  WITHDRAW_APPLICATION:      (id) => `/applications/${id}/withdraw`,

  // ── Saved Jobs ───────────────────────────────────────
  SAVED_JOBS:   '/saved',
  SAVED_JOB_IDS: '/saved/ids',
  SAVE_JOB:     (jobId) => `/saved/${jobId}`,
  UNSAVE_JOB:   (jobId) => `/saved/${jobId}`,

  // ── Admin ────────────────────────────────────────────
  ADMIN_STATS:    '/admin/stats',

  // Get all company accounts list
  ADMIN_COMPANIES: '/admin/companies',

  ADMIN_ANALYTICS:       '/admin/analytics',

  // Toggle verify/unverify a company — :id = company user ID
  ADMIN_VERIFY_COMPANY: (id) => `/admin/companies/${id}/verify`,

  ADMIN_SUSPEND_COMPANY: (id) => `/admin/companies/${id}/suspend`,
  ADMIN_USERS:           '/admin/users',
  ADMIN_SUSPEND_USER:    (id) => `/admin/users/${id}/suspend`,
  ADMIN_DELETE_USER:     (id) => `/admin/users/${id}`,
  ADMIN_RESTORE_USER:    (id) => `/admin/users/${id}/restore`,
  ADMIN_JOBS:            '/admin/jobs',
  ADMIN_CLOSE_JOB:       (id) => `/admin/jobs/${id}/close`,
  ADMIN_DELETE_JOB:      (id) => `/admin/jobs/${id}`,
  CHAT_MESSAGE:          '/chat/message',
  CHAT_HISTORY:          '/chat/history',

  // Notifications
  NOTIFICATIONS:         '/notifications',
  NOTIFICATIONS_UNREAD:  '/notifications/unread-count',
  NOTIFICATIONS_READ_ALL:'/notifications/read-all',

  // Interviews
  INTERVIEWS:              '/interviews',
  INTERVIEWS_MY:           '/interviews/my',
  INTERVIEWS_COMPANY:      '/interviews/company',
  ADMIN_SYSTEM_HEALTH:   '/admin/system-health',
  
};