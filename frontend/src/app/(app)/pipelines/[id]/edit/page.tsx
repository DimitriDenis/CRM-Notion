// src/app/(app)/pipelines/[id]/edit/page.tsx
'use client';

import { PipelineForm } from '@/components/pipelines/PipelineForm';

interface EditPipelinePageProps {
  params: {
    id: string;
  };
}

export default function EditPipelinePage({ params }: EditPipelinePageProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Modifier le Pipeline</h1>
      <PipelineForm pipelineId={params.id} />
    </div>
  );
}