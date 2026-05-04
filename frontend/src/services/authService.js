// authService.js
// Production-grade auth service
// Fixed: infinite refresh loop, proper token update

import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true
});

// ── Token Getter (closure pattern) ──
let getToken = () => null;
export const setTokenGetter = (fn) => { getToken = fn; };

// ── Token Updater ──
// Interceptor calls this to update token in AuthContext ref
// Separate from getter — avoids breaking the ref pattern
let updateTokenInContext = (token) => {};
export const setTokenUpdater = (fn) => { updateTokenInContext = fn; };

// ── Refresh Queue — prevents multiple refresh calls ──
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach((p) => {
    if (error) { p.reject(error); }
    else        { p.resolve(token); }
  });
  refreshQueue = [];
};

// ── Request Interceptor ──
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ✅ CRITICAL FIX: Never retry the refresh endpoint itself!
    // This prevents the infinite loop
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Only handle 401 errors — and only once per request
    if (error.response?.status === 401 && !originalRequest._retry) {

      // If already refreshing — add this request to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get new token from backend using HTTP-only cookie
        const res = await API.post('/auth/refresh');
        const newToken = res.data.data.accessToken;

        // ✅ Update token properly via AuthContext updater
        // This updates tokenRef.current in AuthContext
        updateTokenInContext(newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return API(originalRequest);

      } catch (refreshError) {
        // Refresh failed — session expired, clear everything
        processQueue(refreshError, null);
        updateTokenInContext(null);
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Error normalizer ──
export const getErrorMessage = (err) => {
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    'Something went wrong. Please try again.'
  );
};

// ── Auth API functions ──
export const signup = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  return response.data;
};

export const logoutAPI = async () => {
  try {
    await API.post('/auth/logout');
  } catch (err) {
    console.error('Logout API error:', err.message);
  }
};