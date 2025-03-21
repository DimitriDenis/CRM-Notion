// src/app/(app)/deals/new/page.tsx

'use client';

import { DealForm } from '@/components/deals/DealForm';
import { useSearchParams } from 'next/navigation';

export default function NewDealPage() {

  const searchParams = useSearchParams();
  const initialPipelineId = searchParams.get('pipelineId');
  const initialStageId = searchParams.get('stageId');
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Nouveau Deal</h1>
      <DealForm 
      initialPipelineId={initialPipelineId} 
      initialStageId={initialStageId} />
    </div>
  );
}