// src/lib/api/auth.ts
import api from './axios';

export async function handleNotionCallback(code: string) {
    try {
      
      
      const response = await api.get(`/auth/notion/callback?code=${code}`);
      
      
      // Vérification du contenu de la réponse
      const { token } = response.data || {};
      
      
      if (!token) {
        
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  export async function logout() {
    
    
    // 1. Supprimer le cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // 2. Supprimer de localStorage et sessionStorage
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('notion_token');
    } catch (e) {
      
    }
    
    // 3. Supprimer l'en-tête d'autorisation pour les futures requêtes API
    if (api.defaults.headers.common['Authorization']) {
      delete api.defaults.headers.common['Authorization'];
    }
    
    
  }