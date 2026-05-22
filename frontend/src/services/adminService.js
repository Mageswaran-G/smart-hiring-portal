import { API } from "./authService";

// Get all companies (search + filter + pagination)
export const getAllCompanies = async (params = {}) => {
  const response = await API.get("/admin/companies", { params });
  return response.data;
};

// Verify or Unverify a company
export const verifyCompany = async (id) => {
  const response = await API.patch(`/admin/companies/${id}/verify`);
  return response.data;
};

// Suspend or Unsuspend a company
export const suspendCompany = async (id) => {
  const response = await API.patch(`/admin/companies/${id}/suspend`);
  return response.data;
};

// Get all users (search + filter + pagination)
export const getAllUsers = async (params = {}) => {
  const response = await API.get("/admin/users", { params });
  return response.data;
};

// Suspend or Unsuspend a user
export const suspendUser = async (id) => {
  const response = await API.patch(`/admin/users/${id}/suspend`);
  return response.data;
};

// Delete a user permanently
export const deleteUser = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};

// Get all jobs for admin
export const getAllJobs = async (params = {}) => {
  const response = await API.get("/admin/jobs", { params });
  return response.data;
};

// Close a job
export const closeJob = async (id) => {
  const response = await API.patch(`/admin/jobs/${id}/close`);
  return response.data;
};


export const deleteJob = async (id) => {
  const response = await API.delete(`/admin/jobs/${id}`);
  return response.data;
};