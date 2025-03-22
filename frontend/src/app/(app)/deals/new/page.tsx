// src/app/(app)/deals/new/page.tsx
// Pas de directive 'use client' ici - c'est un server component

import DealFormWrapper from '@/components/client-wrapper/DealFormWrapper';

export default function NewDealPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Nouveau Deal</h1>
      <DealFormWrapper />
    </div>
  );
}