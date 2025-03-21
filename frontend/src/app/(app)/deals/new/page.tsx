// src/app/(app)/deals/new/page.tsx
import { Suspense } from 'react';
import { DealFormWrapper } from '@/components/deals/DealFormWrapper';

export default function NewDealPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Nouveau Deal</h1>
      <Suspense fallback={<div>Chargement du formulaire...</div>}>
        <DealFormWrapper />
      </Suspense>
    </div>
  );
}