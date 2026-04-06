import axios from 'axios';

/**
 * Axios instance for Forest Guardian API
 */
const api = axios.create({
  baseURL: '/api', // backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Attaches JWT token automatically
 */
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

/**
 * Response interceptor
 * Handles auth errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired or invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Optional: redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
