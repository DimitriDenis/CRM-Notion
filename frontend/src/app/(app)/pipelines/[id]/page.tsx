// src/app/(app)/pipelines/[id]/page.tsx
import { PipelineView } from '@/components/pipelines/PipelineView';
import { use } from 'react';

// Notez que nous n'utilisons plus 'use client' car c'est un Server Component

interface PipelinePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PipelinePage({ params }: PipelinePageProps) {
  // Résoudre les paramètres avec React.use
  const resolvedParams = use(params);
  
  return (
    <div className="space-y-8">
      <PipelineView pipelineId={resolvedParams.id} />
    </div>
  );
}