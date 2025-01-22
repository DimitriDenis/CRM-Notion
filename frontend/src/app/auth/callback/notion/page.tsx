// src/app/auth/callback/notion/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleNotionCallback } from '@/lib/api/auth';

export default function NotionCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('Notion auth error:', error);
        router.push('/auth/login?error=oauth_failed');
        return;
      }

      if (!code) {
        router.push('/auth/login');
        return;
      }

      try {
        const { token } = await handleNotionCallback(code);
        localStorage.setItem('token', token);
        router.push('/dashboard');
      } catch (error) {
        console.error('Callback error:', error);
        router.push('/auth/login?error=callback_failed');
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