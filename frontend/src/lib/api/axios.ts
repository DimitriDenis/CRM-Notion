import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Fonction pour récupérer le token de toutes les sources possibles
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  // Essayer d'abord localStorage
  let token = localStorage.getItem('token');
  
  // Si pas trouvé, essayer les cookies
  if (!token) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') {
        token = value;
        // Optionnel: synchroniser avec localStorage
        localStorage.setItem('token', value);
        break;
      }
    }
  }
  
  return token;
};

// Intercepteur pour les requêtes - mise à jour pour vérifier le token à chaque requête
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Récupérer le token à chaque requête
      const token = getAuthToken();
      
      console.log('=== Request Details ===', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        baseURL: config.baseURL,
        authHeader: token ? `Bearer ${token.substring(0, 10)}...` : 'none',
      });

      // Définir l'en-tête d'autorisation
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