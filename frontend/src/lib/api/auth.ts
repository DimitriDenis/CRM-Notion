// src/lib/api/auth.ts
import api from './axios';

export async function handleNotionCallback(code: string) {
  const response = await api.post('/auth/notion/callback', { code });
  return response.data;
}

export async function logout() {
  localStorage.removeItem('token');
}