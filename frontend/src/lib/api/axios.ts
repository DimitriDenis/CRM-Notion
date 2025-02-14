import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('=== Request Details ===', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data
      });

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Ajout de l'intercepteur de réponse
api.interceptors.response.use(
  (response) => {
    console.log('=== Response Success ===', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('=== Response Error Details ===', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      details: error.response?.data?.message || error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;