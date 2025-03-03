// src/app/(app)/pipelines/new/page.tsx
import { PipelineForm } from '@/components/pipelines/PipelineForm';

export default function NewPipelinePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Nouveau Pipeline</h1>
      <PipelineForm />
    </div>
  );
}