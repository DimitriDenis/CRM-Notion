// src/app/(app)/deals/[id]/edit/page.tsx
'use client';

import { DealForm } from '@/components/deals/DealForm';

interface EditDealPageProps {
  params: {
    id: string;
  };
}

export default function EditDealPage({ params }: EditDealPageProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Modifier le Deal</h1>
      <DealForm dealId={params.id} />
    </div>
  );
}