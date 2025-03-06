// src/app/(app)/deals/new/page.tsx
import { DealForm } from '@/components/deals/DealForm';

export default function NewDealPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Nouveau Deal</h1>
      <DealForm />
    </div>
  );
}