// src/app/(app)/layout.tsx
import { ReactNode } from 'react';
import ClientLayoutWrapper from '@/components/client-wrapper/ClientLayoutWrapper';

export default function AppLayout({ children }: { children: ReactNode }) {
  console.log("AppLayout rendering (server component)");
  return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
}