import axios from 'axios';
import keycloak from '../config/keycloak';
import type { EmployeesResponse, EmployeeResponse, UserProfile } from '../types';

const API_BASE_URL = 'http://localhost:3002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Refresh token if it expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshed = await keycloak.updateToken(5);
        if (refreshed) {
          // Retry the request with new token
          error.config.headers.Authorization = `Bearer ${keycloak.token}`;
          return axios.request(error.config);
        }
      } catch {
        keycloak.login();
      }
    }
    return Promise.reject(error);
  }
);

// Employees API
export const employeesAPI = {
  getAllEmployees: async (): Promise<EmployeesResponse> => {
    const response = await api.get<EmployeesResponse>('/employees');
    return response.data;
  },

  getEmployeeByUid: async (uid: string): Promise<EmployeeResponse> => {
    const response = await api.get<EmployeeResponse>(`/employees/${uid}`);
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  getCurrentUser: async (): Promise<{ user: UserProfile }> => {
    const response = await api.get('/profile');
    return response.data;
  },
};