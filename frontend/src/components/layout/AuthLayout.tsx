// src/components/layout/AuthLayout.tsx
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/router';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && !router.pathname.startsWith('/auth')) {
    router.push('/auth/login');
    return null;
  }

  return <>{children}</>;
}