// src/lib/api/auth.ts
import api from './axios';

export async function handleNotionCallback(code: string) {
    try {
      console.log('A. Début de handleNotionCallback avec code:', code);
      
      const response = await api.get(`/auth/notion/callback?code=${code}`);
      console.log('B. Réponse complète du backend:', response.data);
      
      // Vérification du contenu de la réponse
      const { token } = response.data || {};
      console.log('C. Token extrait:', token);
      
      if (!token) {
        console.warn('D. Attention: Pas de token dans la réponse');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  export async function logout() {
    console.log('Déconnexion: nettoyage complet des données d\'authentification');
    
    // 1. Supprimer le cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // 2. Supprimer de localStorage et sessionStorage
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('notion_token');
    } catch (e) {
      console.warn('Erreur lors de la suppression du stockage:', e);
    }
    
    // 3. Supprimer l'en-tête d'autorisation pour les futures requêtes API
    if (api.defaults.headers.common['Authorization']) {
      delete api.defaults.headers.common['Authorization'];
    }
    
    console.log('Déconnexion terminée');
  }