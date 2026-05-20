export const ROUTES = {
  HOME:                '/',
  LOGIN:               '/login',
  SIGNUP:              '/signup',
  DASHBOARD:           '/dashboard',
  PROFILE:             '/profile',

  // Candidate
  CANDIDATE_DASHBOARD:     '/candidate/dashboard',
  CANDIDATE_APPLICATIONS:  '/candidate/applications',
  SAVED_JOBS:              '/candidate/saved-jobs',     

  // Company
  COMPANY_DASHBOARD:       '/company/dashboard',
  COMPANY_JOBS:            '/company/jobs',
  COMPANY_JOB_CREATE:      '/company/jobs/create',
  COMPANY_JOB_EDIT:        '/company/jobs/:id/edit',
  COMPANY_APPLICATIONS:    '/company/applications',

  // Admin
  ADMIN_DASHBOARD:         '/admin/dashboard',
  ADMIN_COMPANIES:         "/admin/companies",

  // Public
  JOB_DETAILS:             '/jobs/:slug',
  PUBLIC_JOBS:             '/jobs',
};