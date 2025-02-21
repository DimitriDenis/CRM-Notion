// src/app/(app)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/api/axios';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      console.log('=== Layout Auth Check ===');
      console.log('Token in localStorage:', !!token);
  
      if (!token) {
        console.log('No token found, redirecting to login');
        router.replace('/auth/login');
        return;
      }
  
      // Configurer le cookie pour le middleware
      document.cookie = `token=${token}; path=/`;
  
      // Configurer l'en-tête par défaut pour Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      setIsAuthChecked(true);
    };
  
    setTimeout(checkAuth, 100);
  }, [router]);

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Vérification de l'authentification...</div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}