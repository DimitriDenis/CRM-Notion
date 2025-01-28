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
  console.log('Déconnexion: suppression du token');
  localStorage.removeItem('token');
}