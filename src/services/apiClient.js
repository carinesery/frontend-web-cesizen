import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Instance axios avec config de base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token dans chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Si c'est FormData, on retire le Content-Type pour laisser le navigateur ajouter multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
