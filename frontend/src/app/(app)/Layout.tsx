// src/app/(app)/layout.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api/axios';

// Fonction utilitaire pour lire un cookie par son nom
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part) {
      return part.split(';').shift() || null;
    }
  }
  return null;
}

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('=== Layout Auth Check ===');
    
    // Vérifier si le token est dans les cookies (défini par le middleware)
    const token = getCookie('token');
    console.log('Token dans cookie:', !!token);
    
    if (token) {
      // Configurer l'en-tête pour les requêtes API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('En-tête API configuré');
      setIsAuthChecked(true);
    } else {
      console.log('Pas de token dans le cookie (inhabituel car le middleware devrait rediriger)');
      setIsAuthChecked(true); // On continue quand même, le middleware s'en occupera
    }
  }, []);

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Vérification de l'authentification...</div>
      </div>
    );
  }
  console.log("AppLayout rendering");
  return <MainLayout>{children}</MainLayout>;
}