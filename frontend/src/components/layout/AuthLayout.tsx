'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname?.startsWith('/auth')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && !pathname?.startsWith('/auth')) {
    return <div>Redirection vers la page de connexion...</div>;
  }

  return <>{children}</>;
}