// src/lib/api/auth.ts
import api from './axios';

export async function handleNotionCallback(code: string) {
    try {
      const response = await api.post('/auth/notion/callback', { code });
      return response.data;
    } catch (error) {
      console.error('Détails d erreur:', error);
      throw error;
    }
  }

export async function logout() {
  localStorage.removeItem('token');
}