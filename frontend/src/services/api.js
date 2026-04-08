import axios from 'axios';

const API_BASE =  'https://inventorypos-xxeq.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData)
};

// Product API calls
export const productAPI = {
  getAll: (page = 1, limit = 10) => api.get('/products', { params: { page, limit } }),
  search: (query, page = 1, limit = 10) => api.get('/products/search', { params: { query, page, limit } }),
  getById: (id) => api.get(`/products/${id}`),
  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getLowStock: () => api.get('/products/low-stock')
};

// Sale API calls
export const saleAPI = {
  getAll: (page = 1, limit = 15) => api.get('/sales', { params: { page, limit } }),
  search: (query, page = 1, limit = 15) => api.get('/sales/search', { params: { q: query, page, limit } }),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  getTodayStats: () => api.get('/sales/stats/today'),
  getDashboardStats: () => api.get('/sales/stats/dashboard')
};

export default api;
