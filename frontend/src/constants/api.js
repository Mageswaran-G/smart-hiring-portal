// All backend API endpoints in one place
// Instead of writing '/users/profile' everywhere
// we use API_ENDPOINTS.PROFILE

export const API_ENDPOINTS = {
  // Auth
  LOGIN:         '/auth/login',
  SIGNUP:        '/auth/signup',
  LOGOUT:        '/auth/logout',
  REFRESH:       '/auth/refresh',

  // Profile
  PROFILE:       '/users/profile',
  UPLOAD_RESUME: '/users/upload-resume',
  UPLOAD_PHOTO:  '/users/upload-photo',
};