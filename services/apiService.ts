// adikart-e-commerce-platform/services/apiService.ts
import axios from 'axios';

// Connects to your Express server running on port 5000
const API_BASE_URL = 'http://localhost:5000/api'; 

const api = axios.create({ 
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;