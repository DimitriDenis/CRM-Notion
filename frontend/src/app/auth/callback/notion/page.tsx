// src/app/auth/callback/notion/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NotionCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      console.log('1. Code reçu de Notion:', code);
      const error = searchParams.get('error');
      console.log('2. Paramètre d\'erreur:', error);
      
      // Redirection directe vers le backend
      if (code && !error) {
        window.location.href = `http://localhost:3001/auth/notion/callback?code=${code}`;
      } else {
        router.push('/auth/login?error=no_code');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Connexion en cours...</div>
    </div>
  );
}