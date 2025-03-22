// src/components/auth/LoginForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { NotionLogo } from '../ui/icons/NotionLogo';

export default function LoginForm() {
  // Appeler useSearchParams au niveau racine du composant (correct)
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Effet pour marquer que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
    
    // Logging des variables d'environnement
    console.log('All env variables:', {
      clientId: process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID,
      nodeEnv: process.env.NODE_ENV,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
    });
  }, []);

  // Effet pour traiter l'erreur des paramètres d'URL
  useEffect(() => {
    // Attendre que le composant soit monté côté client
    if (isClient && searchParams) {
      const error = searchParams.get('error');
      
      if (error) {
        setErrorMessage(
          error === 'oauth_failed'
            ? "L'authentification avec Notion a échoué. Veuillez réessayer."
            : 'Une erreur est survenue. Veuillez réessayer.'
        );
      }
    }
  }, [isClient, searchParams]);

  const handleNotionLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID;
    console.log('Client ID:', clientId);
    
    // Utiliser l'URL de l'API configurée ou localhost par défaut
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const redirectUri = encodeURIComponent('https://crm-notion-production.up.railway.app/auth/notion/callback');
    
    window.location.href = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{errorMessage}</div>
        </div>
      )}

      <button
        onClick={handleNotionLogin}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <NotionLogo className="h-5 w-5 mr-2" />
        Se connecter avec Notion
      </button>

      <div className="mt-6">
        <div className="relative">
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Gérez vos relations directement dans Notion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}