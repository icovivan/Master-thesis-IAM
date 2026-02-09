import axios from 'axios';
import { LoginResponse, EmployeesResponse, EmployeeResponse, User } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

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