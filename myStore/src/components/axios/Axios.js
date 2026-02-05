// axios/Axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust as needed
  withCredentials: true, // if using cookies
});

// Add auth token (if stored in localStorage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
