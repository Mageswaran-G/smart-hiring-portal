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

// SIGNUP function
// Sends user data to POST /api/v1/auth/signup
// userData = { name, email, password, role }
export const signup = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data; // return backend's JSON reply
};

// LOGIN function
// Sends credentials to POST /api/v1/auth/login
// userData = { email, password }
export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  return response.data; // return backend's JSON reply
};