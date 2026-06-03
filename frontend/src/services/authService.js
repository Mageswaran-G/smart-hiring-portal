import axios from 'axios';

export const API = axios.create({
  // Use environment variable — not hardcoded URL
  // In production, change VITE_API_URL in .env file
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true
});

// Token getter — AuthContext registers this
let getToken = () => null;
export const setTokenGetter = (fn) => { getToken = fn; };

// Refresh queue — prevents multiple simultaneous refresh calls
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve(token);
  });
  refreshQueue = [];
};

// Helper — read cookie value by name
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

// Request interceptor — attach token + CSRF to every request
API.interceptors.request.use(
  (config) => {
    // Attach JWT token
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Attach CSRF token for state-changing requests
    const safeMethods = ['get', 'head', 'options'];
    if (!safeMethods.includes(config.method?.toLowerCase())) {
      const csrfToken = getCookie('csrfToken');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — auto retry on 401
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Fix 3 — never retry refresh or logout endpoints
    // This prevents infinite loop
    const isAuthRoute =
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/logout');

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // Only retry on 401 — and only once per request
    if (error.response?.status === 401 && !originalRequest._retry) {

      // Already refreshing — add to queue, wait for new token
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
        const res = await API.post('/auth/refresh');
        const newToken = res.data.data.accessToken;

        // Fix 1 — update React state + ref via injected setter
        if (API.setAuthToken) {
          API.setAuthToken(newToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return API(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);

        // Fix 4 — force logout in UI when refresh fails
        if (API.setAuthToken) {
          API.setAuthToken(null);
        }

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Error normalizer
export const getErrorMessage = (err) => {
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    'Something went wrong. Please try again.'
  );
};

// Auth functions
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
    // 401 is expected when token is expired — ignore silently
    // User still gets logged out from frontend state
    if (err.response?.status !== 401) {
      if (import.meta.env.DEV) console.error('Logout API error:', err.message);
    }
  }
};