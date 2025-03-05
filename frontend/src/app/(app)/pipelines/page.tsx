// src/app/(app)/pipelines/page.tsx
'use client';

import { useState } from 'react';
import { PipelinesList } from '@/components/pipelines/PipelinesList';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { usePipelines } from '@/hooks/api/usePipelines';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
        <div className="text-center p-12 bg-white rounded-lg shadow border border-gray-200">
          <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun pipeline trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">Commencez par créer un pipeline pour organiser vos deals.</p>
          <div className="mt-6">
            <Link
              href="/pipelines/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Ajouter un pipeline
            </Link>
          </div>
        </div>
      ) : (
        <PipelinesList pipelines={pipelines} onDelete={handleDelete} />
      )}
    </div>
  );
}