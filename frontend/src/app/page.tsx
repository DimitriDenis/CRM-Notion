// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/landing/LandingPage';
import { Suspense } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifiez si l'utilisateur est authentifié
    const checkAuth = async () => {
      try {
        // Adaptez cette vérification à votre mécanisme d'authentification
        const token = localStorage.getItem('auth_token'); // ou toute autre méthode que vous utilisez
        
        if (token) {
          // Si l'utilisateur est authentifié, rediriger vers le dashboard
          router.push('/dashboard');
        } else {
          // Sinon, afficher la landing page
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l authentification', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Chargement...</div>; // ou votre composant de chargement
  }

  // Si l'utilisateur n'est pas authentifié, montrer la landing page
  return !isAuthenticated ? (
    <Suspense fallback={<div>Chargement...</div>}>
      <LandingPage />
    </Suspense>
  ) : null;
}