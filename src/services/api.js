import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle token expiration
    if (response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Only redirect if we're not already on login/register page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.post('/auth/verify-token'),
};

// User API methods
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
  addFavorite: (articleId) => api.post(`/users/favorites/${articleId}`),
  removeFavorite: (articleId) => api.delete(`/users/favorites/${articleId}`),
  getFavorites: () => api.get('/users/favorites'),
};

// Generic API method for custom requests
export default api;