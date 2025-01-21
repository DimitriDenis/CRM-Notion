// src/hooks/auth/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken, isTokenValid } from '@/utils/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    setIsAuthenticated(!!token && isTokenValid(token));
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return { isAuthenticated, isLoading, logout };
};