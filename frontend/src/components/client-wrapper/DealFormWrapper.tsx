// src/components/client-wrappers/DealFormWrapper.tsx
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DealForm } from '@/components/deals/DealForm';

// Composant de chargement à afficher pendant le chargement
function LoadingForm() {
  return <div className="animate-pulse p-4 h-96 bg-gray-100 rounded-lg">Chargement du formulaire...</div>;
}

export default function DealFormWrapper() {
  // État pour suivre si le composant est monté côté client
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  // Effet pour marquer le montage côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Seulement accéder à useSearchParams une fois que le composant est monté côté client
  if (!isMounted) {
    return <LoadingForm />;
  }

  // Maintenant on peut utiliser useSearchParams en toute sécurité
  const searchParams = useSearchParams();
  const initialPipelineId = searchParams.get('pipelineId');
  const initialStageId = searchParams.get('stageId');

  return (
    <Suspense fallback={<LoadingForm />}>
      <DealForm 
        initialPipelineId={initialPipelineId}
        initialStageId={initialStageId}
      />
    </Suspense>
  );
}