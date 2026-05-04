// authService.js
// Production-grade auth service
// Handles: token injection, auto-retry on 401, refresh queue

import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true
});

// ── Token Getter (closure pattern) ──
// AuthContext registers this after login
let getToken = () => null;
export const setTokenGetter = (fn) => { getToken = fn; };

// ── Refresh Queue System ──
// Prevents multiple simultaneous refresh calls
// If 5 requests fail at same time → only 1 refresh happens
// Other 4 wait in queue → get new token after refresh done
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  refreshQueue = [];
};

// ── Request Interceptor ──
// Attaches token to every outgoing request
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
// Auto-retry when token expires (401 error)
// This means user never gets logged out mid-session
API.interceptors.response.use(
  // Success — just return response normally
  (response) => response,

  // Error — check if 401 and try refresh
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 (unauthorized) errors
    // _retry flag prevents infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing — add this request to queue
      // Queue will retry it after refresh completes
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      // Mark request so we don't retry it again
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to get new access token using refresh cookie
        const res = await API.post('/auth/refresh');
        const newToken = res.data.data.accessToken;

        // Update token in ref (via getter mechanism)
        setTokenGetter(() => newToken);

        // Update this request's header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Give new token to all waiting requests in queue
        processQueue(null, newToken);

        // Retry the original failed request
        return API(originalRequest);

      } catch (refreshError) {
        // Refresh also failed — session is truly expired
        // Reject all waiting requests
        processQueue(refreshError, null);
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Error Message Normalizer ──
// Backend sometimes sends { message } sometimes { error }
// This always gives clean message
export const getErrorMessage = (err) => {
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    'Something went wrong. Please try again.'
  );
};

// ── Auth API Functions ──
export const signup = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  return response.data;
};

// Fix 2 — Logout calls backend to invalidate refresh token in DB
export const logoutAPI = async () => {
  try {
    await API.post('/auth/logout');
  } catch (err) {
    // Even if backend fails — still clear frontend
    console.error('Logout API error:', err.message);
  }
};