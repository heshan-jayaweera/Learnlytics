import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Student API
export const studentAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  add: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getMyProfile: () => api.get('/students/profile/me'),
};

// Marks API
export const marksAPI = {
  getAll: (params) => api.get('/marks', { params }),
  getStudentMarks: (studentId, params) => api.get(`/marks/student/${studentId}`, { params }),
  getMyMarks: (params) => api.get('/marks/me', { params }),
  getStudentGpa: (studentId) => api.get(`/marks/gpa/${studentId}`),
  getMyGpa: () => api.get('/marks/me/gpa'),
  add: (data) => api.post('/marks', data),
  update: (id, data) => api.put(`/marks/${id}`, data),
  delete: (id) => api.delete(`/marks/${id}`),
  getStatistics: (params) => api.get('/marks/statistics', { params }),
};

// Courses API
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  exportPowerBI: () => api.get('/courses/export/powerbi'),
  getByCode: (code) => api.get(`/courses/${code}`),
  add: (data) => api.post('/courses', data),
  update: (code, data) => api.put(`/courses/${code}`, data),
  delete: (code) => api.delete(`/courses/${code}`),
};

export default api;

