// src/components/client-wrappers/ClientLayoutWrapper.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api/axios';

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

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    console.log('=== Layout Auth Check ===');
    
    // Vérifier si le token est dans les cookies
    const token = getCookie('token');
    console.log('Token dans cookie:', !!token);
    
    if (token) {
      // Configurer l'en-tête pour les requêtes API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('En-tête API configuré');
    } else {
      console.log('Pas de token dans le cookie');
    }
    
    setIsAuthChecked(true);
  }, []);

  // Important : ne rien rendre tant que le composant n'est pas monté côté client
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Chargement de l'interface...</div>
      </div>
    );
  }

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Vérification de l'authentification...</div>
      </div>
    );
  }

  console.log("ClientLayoutWrapper rendering - avant MainLayout");
  return <MainLayout>{children}</MainLayout>;
}