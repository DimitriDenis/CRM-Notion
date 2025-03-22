import { ReactNode } from 'react';
import ClientLayoutWrapper from '@/components/client-wrapper/ClientLayoutWrapper';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
} 