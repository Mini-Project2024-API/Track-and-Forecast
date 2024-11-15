// src/services/api.js
import axios from 'axios';

// Set up an Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the token in the Authorization header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
