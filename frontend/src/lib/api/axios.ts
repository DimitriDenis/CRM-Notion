import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuration par défaut de l'en-tête d'autorisation
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

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
        authHeader: token ? `Bearer ${token.substring(0, 10)}...` : 'none',
        headers: config.headers,
        data: config.data
      });

      // Assurer que le token est toujours présent dans les en-têtes
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

// Intercepteur pour les réponses
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
    // Si l'erreur est 401 (non autorisé), rediriger vers login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }

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