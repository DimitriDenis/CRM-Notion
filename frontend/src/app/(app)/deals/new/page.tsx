// src/app/(app)/deals/new/page.tsx
import dynamic from 'next/dynamic';

// Importer dynamiquement DealForm avec SSR désactivé
const DealForm = dynamic(() => import('@/components/deals/DealForm').then(mod => ({ default: mod.DealForm })), {
  ssr: false,
  loading: () => <div className="animate-pulse p-4 h-96 bg-gray-100 rounded-lg">Chargement du formulaire...</div>
});

export default function NewDealPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Nouveau Deal</h1>
      <DealForm />
    </div>
  );
}