// src/app/auth/callback/notion/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function NotionCallback() {
  const router = useRouter();
  // Ne pas utiliser useSearchParams directement ici
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Marquer que nous sommes sur le client
    setIsClient(true);
  }, []);

  useEffect(() => {
    // N'exécuter la logique d'authentification que côté client
    if (!isClient) return;

    // Maintenant nous pouvons utiliser useSearchParams en toute sécurité
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    console.log('Code reçu de Notion:', code);

    if (code) {
      // Ajuster l'URL pour l'environnement de production
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Faire la requête au backend
      fetch(`${apiUrl}/auth/notion/callback?code=${code}`)
        .then(response => response.json())
        .then(data => {
          setIsLoading(false);
          if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            Cookies.set('token', data.access_token, { expires: 7 });
            router.push('/dashboard');
          } else {
            setError('Échec de l\'authentification');
            setTimeout(() => router.push('/auth/login?error=oauth_failed'), 2000);
          }
        })
        .catch(error => {
          setIsLoading(false);
          setError('Une erreur est survenue');
          console.error('Erreur:', error);
          setTimeout(() => router.push('/auth/login?error=oauth_failed'), 2000);
        });
    } else {
      setIsLoading(false);
      setError('Code d\'autorisation manquant');
      setTimeout(() => router.push('/auth/login?error=no_code'), 2000);
    }
  }, [isClient, router]); // Dépendance sur isClient au lieu de searchParams

  if (!isClient) {
    // État de chargement initial pendant l'hydratation
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Initialisation...</h2>
          <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <h2 className="text-xl font-semibold mb-2 text-red-600">{error}</h2>
            <p className="text-gray-600">Redirection en cours...</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">Connexion en cours...</h2>
            <p className="text-gray-600">Veuillez patienter pendant que nous finalisons votre connexion.</p>
            {isLoading && (
              <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            )}
          </>
        )}
      </div>
    </div>
  );
}