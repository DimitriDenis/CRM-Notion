// src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  email: string;
  exp: number;
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};