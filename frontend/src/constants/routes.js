export const ROUTES = {
  HOME:                '/',
  LOGIN:               '/login',
  SIGNUP:              '/signup',
  DASHBOARD:           '/dashboard',
  PROFILE:             '/profile',

  // Candidate
  CANDIDATE_DASHBOARD:     '/candidate/dashboard',
  CANDIDATE_INTERVIEWS:    '/candidate/interviews',
  CANDIDATE_APPLICATIONS:  '/candidate/applications',
  SAVED_JOBS:              '/candidate/saved-jobs',
  RECOMMENDATIONS:         '/candidate/recommendations',     

  // Company
  COMPANY_DASHBOARD:       '/company/dashboard',
  COMPANY_JOBS:            '/company/jobs',
  COMPANY_JOB_CREATE:      '/company/jobs/create',
  COMPANY_JOB_EDIT:        '/company/jobs/:id/edit',
  COMPANY_INTERVIEWS:      '/company/interviews',
  COMPANY_APPLICATIONS:    '/company/applications',

  // Admin
  ADMIN_DASHBOARD:         '/admin/dashboard',
  ADMIN_COMPANIES:         '/admin/companies',
  ADMIN_USERS:             '/admin/users',
  ADMIN_JOBS:              '/admin/jobs',
  ADMIN_ANALYTICS:         '/admin/analytics',
  ADMIN_CHAT:              '/admin/chat',
  ADMIN_AUDIT_LOGS:        '/admin/audit-logs',

  // Public
  JOB_DETAILS:             '/jobs/:slug',
  PUBLIC_JOBS:             '/jobs',
};