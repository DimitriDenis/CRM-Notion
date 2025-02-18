// src/app/auth/callback/notion/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function NotionCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    console.log('Code reçu de Notion:', code);

    if (code) {
      // Faire la requête au backend
      fetch('http://localhost:3001/auth/notion/callback?code=' + code)
        .then(response => response.json())
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            Cookies.set('token', data.access_token, { expires: 7 });
            router.push('/dashboard');
          } else {
            router.push('/auth/login?error=oauth_failed');
          }
        })
        .catch(error => {
          console.error('Erreur:', error);
          router.push('/auth/login?error=oauth_failed');
        });
    } else {
      router.push('/auth/login?error=no_code');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Connexion en cours...</h2>
        <p className="text-gray-600">Veuillez patienter pendant que nous finalisons votre connexion.</p>
      </div>
    </div>
  );
}