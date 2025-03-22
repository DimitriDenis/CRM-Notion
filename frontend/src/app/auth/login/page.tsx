// src/app/auth/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import { Suspense } from 'react';
import LoginClient from '@/components/client-wrapper/LoginClient';

export default function LoginPage() {
  return (
    <AuthLayout>
       <Suspense fallback={<div>Chargement...</div>}>
            <LoginClient />
          </Suspense>
    </AuthLayout>
  );
}