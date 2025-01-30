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
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      console.log('Callback params:', {
        hasCode: !!code,
        hasToken: !!token,
        hasError: !!error
      });

      if (token) {
        // Nous avons un token - stockons-le et redirigeons
        localStorage.setItem('token', token);
        router.push('/dashboard');
      } else if (code && !error) {
        // Nous avons un code - redirigeons vers le backend
        window.location.href = `http://localhost:3001/auth/notion/callback?code=${code}`;
      } else {
        router.push('/auth/login?error=authentication_failed');
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