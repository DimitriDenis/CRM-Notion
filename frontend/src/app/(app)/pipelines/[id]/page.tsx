// src/app/(app)/pipelines/[id]/page.tsx
'use client';

import { PipelineView } from "@/components/pipelines/PipelineView";

interface PipelinePageProps {
  params: {
    id: string;
  };
}

export default function PipelinePage({ params }: PipelinePageProps) {
  return (
    <div className="space-y-8">
      <PipelineView pipelineId={params.id} />
    </div>
  );
}