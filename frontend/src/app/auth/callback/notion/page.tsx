// src/app/auth/callback/notion/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCookie } from 'cookies-next';

export default function NotionCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      console.log('Starting callback process...', {
        hasCode: !!code,
        hasToken: !!token,
        hasError: !!error,
        tokenValue: token // Pour voir le token complet dans les logs
      });

      if (token) {
        try {
          // Stockage du token
          localStorage.setItem('token', token);
          
          

          // Vérification immédiate que le token est bien stocké
          const storedToken = localStorage.getItem('token');
          console.log('Verified stored token:', storedToken ? 'present' : 'missing');

          // Ajout d'un petit délai pour s'assurer que le token est bien stocké
          await new Promise(resolve => setTimeout(resolve, 100));

          setCookie('auth-token', token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 jours
            secure: process.env.NODE_ENV === 'production',
          });

          console.log('Attempting to redirect to /dashboard');
          router.push('/dashboard');
        } catch (error) {
          console.error('Error in callback handling:', error);
          router.push('/auth/login?error=storage_error');
        }
      } else if (code && !error) {
        console.log('Redirecting to backend with code');
        window.location.href = `http://localhost:3001/auth/notion/callback?code=${code}`;
      } else {
        console.error('No token or code found');
        router.push('/auth/login?error=no_credentials');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-pulse">Connexion en cours...</div>
        <div className="text-sm text-gray-500">Veuillez patienter</div>
      </div>
    </div>
  );
}