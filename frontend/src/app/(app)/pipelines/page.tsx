// src/app/(app)/pipelines/page.tsx
'use client';

import { useState } from 'react';
import { PipelinesList } from '@/components/pipelines/PipelinesList';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { usePipelines } from '@/hooks/api/usePipelines';

export default function PipelinesPage() {
  const { pipelines, isLoading, error, deletePipeline, refetch } = usePipelines();
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pipeline ? Tous les deals associés seront également supprimés.')) {
      deletePipeline(id);
    }
  };

  if (error) {
    return <ErrorAlert message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pipelines</h1>
          <p className="mt-2 text-sm text-gray-700">
            {isLoading
              ? 'Chargement des pipelines...'
              : `Total: ${pipelines.length} pipeline${pipelines.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : pipelines.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">Aucun pipeline trouvé</p>
        </div>
      ) : (
        <PipelinesList pipelines={pipelines} onDelete={handleDelete} />
      )}
    </div>
  );
}