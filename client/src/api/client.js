import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('threadline_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on expiry if required
      if (window.location.pathname.startsWith('/checkout') || window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('threadline_token');
        localStorage.removeItem('threadline_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
