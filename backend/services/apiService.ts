// adikart-e-commerce-platform/services/apiService.ts
import axios from 'axios';

// Set the base URL to your Node.js/Express backend port
const API_BASE_URL = 'http://localhost:5000/api'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});