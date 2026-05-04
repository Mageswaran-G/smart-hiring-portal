import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true
});

// Closure getter — AuthContext registers this
let getToken = () => null;

export const setTokenGetter = (fn) => {
  getToken = fn;
};

// Interceptor — attaches token to every request
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

// Normalize errors — backend sometimes sends message, sometimes error
export const getErrorMessage = (err) => {
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    'Something went wrong. Please try again.'
  );
};

export const signup = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  return response.data;
};