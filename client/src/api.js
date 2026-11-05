import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Har request ke saath token add karo
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 par logout karo
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginAdmin = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Record APIs
export const getRecords = (params) => API.get('/records', { params });
export const createRecord = (data) => API.post('/records', data);
export const updateRecord = (id, data) => API.put(`/records/${id}`, data);
export const deleteRecord = (id) => API.delete(`/records/${id}`);

export default API;

