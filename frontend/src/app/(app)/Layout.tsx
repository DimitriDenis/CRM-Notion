// src/app/(app)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { jwtDecode } from 'jwt-decode';

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
    console.log('=== Layout Auth Check ===', {
      hasToken: !!token,
      tokenValue: token?.substring(0, 20) + '...' // Pour voir le début du token
    });

    if (!token) {
      console.log('No token found, redirecting to login');
      router.replace('/auth/login');
      return;
    }

    // Vérifier si le token est valide
    try {
      const decoded = jwtDecode(token);
      console.log('Token decoded:', decoded);
      
      setIsAuthChecked(true);
    } catch (error) {
      console.error('Token validation error:', error);
      router.replace('/auth/login');
    }
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