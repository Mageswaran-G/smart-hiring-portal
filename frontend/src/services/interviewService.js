import { API } from './authService';
import { API_ENDPOINTS } from '../constants/api';

export const scheduleInterview = async (data) => {
  const res = await API.post(API_ENDPOINTS.INTERVIEWS, data);
  return res.data.data;
};

export const getMyInterviews = async () => {
  const res = await API.get(API_ENDPOINTS.INTERVIEWS_MY);
  return res.data.data.interviews;
};

export const getCompanyInterviews = async () => {
  const res = await API.get(API_ENDPOINTS.INTERVIEWS_COMPANY);
  return res.data.data.interviews;
};

export const updateInterviewStatus = async (id, status) => {
  const res = await API.patch(`${API_ENDPOINTS.INTERVIEWS}/${id}/status`, { status });
  return res.data.data;
};
