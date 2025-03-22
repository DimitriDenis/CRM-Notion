// src/components/client-wrapper/DealFormWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DealForm } from '@/components/deals/DealForm';

function LoadingForm() {
  return <div className="animate-pulse p-4 h-96 bg-gray-100 rounded-lg">Chargement du formulaire...</div>;
}

export default function DealFormWrapper() {
  // Appelez TOUS les hooks au début de la fonction, sans condition
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Variable pour stocker les valeurs
  let initialPipelineId = null;
  let initialStageId = null;
  
  // Utilisez useEffect pour la logique qui dépend du montage
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Une fois monté, nous pouvons accéder aux searchParams en toute sécurité
  if (isMounted && searchParams) {
    initialPipelineId = searchParams.get('pipelineId');
    initialStageId = searchParams.get('stageId');
  }

  // Rendu conditionnel basé sur l'état de montage
  if (!isMounted) {
    return <LoadingForm />;
  }

  // Retirer le Suspense et passer directement les propriétés au composant
  return (
    <DealForm 
      initialPipelineId={initialPipelineId}
      initialStageId={initialStageId}
    />
  );
}