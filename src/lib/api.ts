import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com' 
    : 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  verifyToken: () =>
    api.get('/auth/verify'),
};

export const filesAPI = {
  upload: (formData: FormData) =>
    api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getMyFiles: () =>
    api.get('/files/my-files'),
  
  deleteFile: (fileId: string) =>
    api.delete(`/files/${fileId}`),
};

export const downloadAPI = {
  getFileInfo: (uuid: string) =>
    api.get(`/download/${uuid}/info`),
  
  verifyOTP: (uuid: string, otp: string) =>
    api.post(`/download/${uuid}/verify`, { otp }),
  
  downloadFile: (uuid: string, otp: string) =>
    api.post(`/download/${uuid}`, { otp }, {
      responseType: 'blob',
    }),
};

export const auditAPI = {
  getLogs: () =>
    api.get('/audit/logs'),
};

export default api;