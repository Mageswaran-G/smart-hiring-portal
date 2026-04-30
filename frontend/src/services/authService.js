// authService.js
// Purpose: All API calls to backend auth routes
// This file is the "phone" that talks to our backend

import axios from 'axios';

// Create a custom axios instance with base settings
// baseURL: all requests start from this address
// withCredentials: allows cookies (needed for refresh token)
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  withCredentials: true
});

// INTERCEPTOR — runs before EVERY request automatically
// Reads accessToken from memory and attaches to header
// So we never forget to send token manually
API.interceptors.request.use(
  (config) => {
    // Get token from window memory (we store it here after login)
    const token = window.__accessToken__;

    if (token) {
      // Attach token to Authorization header
      // Backend reads this header to verify user
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // send the request
  },
  (error) => {
    // If interceptor itself fails, reject the promise
    return Promise.reject(error);
  }
);

// SIGNUP function
// Sends user data to POST /api/v1/auth/signup
// userData = { name, email, password, role }
export const signup = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

// LOGIN function
// Sends credentials to POST /api/v1/auth/login
// userData = { email, password }
export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  return response.data;
};