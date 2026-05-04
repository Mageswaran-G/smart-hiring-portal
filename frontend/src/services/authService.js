// authService.js
// Professional pattern — no window globals
// Token is injected via interceptor using a getter function

import axios from 'axios';

// Axios instance — all API calls use this
export const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true  // sends HTTP-only cookie automatically
});

// Token getter — AuthContext will set this function
// This is closure pattern — clean and reactive
let getToken = () => null;

// AuthContext calls this after login to register the getter
export const setTokenGetter = (fn) => {
  getToken = fn;
};

// Interceptor — runs before EVERY request
// Reads token using getter function — no window globals
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

// Auth API functions
export const signup = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  return response.data;
};