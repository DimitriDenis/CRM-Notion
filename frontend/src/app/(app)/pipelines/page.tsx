// src/app/(app)/pipelines/page.tsx
'use client';

import { useState } from 'react';
import { PipelinesList } from '@/components/pipelines/PipelinesList';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { usePipelines } from '@/hooks/api/usePipelines';
import { PlusIcon, FunnelIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PipelinesPage() {
  const { pipelines, isLoading, error, deletePipeline, refetch } = usePipelines();
  
  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pipeline ? Tous les deals associés seront également supprimés.')) {
      deletePipeline(id);
    }
  };

  if (error) {
    return <ErrorAlert message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec effet dégradé */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <FunnelIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Pipelines</h1>
              <p className="mt-1 text-sm text-gray-600">
                {isLoading
                  ? 'Chargement des pipelines...'
                  : `${pipelines.length} pipeline${pipelines.length !== 1 ? 's' : ''} configuré${pipelines.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/pipelines/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nouveau pipeline
            </Link>
          </div>
        </div>
      </div>

      {/* Section d'aide ou d'information */}
      {!isLoading && pipelines.length > 0 && (
        <div className="bg-white border border-blue-100 rounded-lg p-4 flex items-start space-x-4">
          <div className="flex-shrink-0">
            <ChartBarIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Astuce</h3>
            <p className="mt-1 text-sm text-gray-500">
              Personnalisez vos pipelines pour refléter votre processus de vente. Vous pouvez ajouter, réorganiser ou supprimer des étapes à tout moment.
            </p>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : pipelines.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-full bg-blue-100 p-3 mx-auto w-fit">
              <FunnelIcon className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun pipeline configuré</h3>
            <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
              Les pipelines vous permettent d'organiser vos opportunités commerciales par étapes. Créez votre premier pipeline pour commencer.
            </p>
            <div className="mt-6">
              <Link
                href="/pipelines/new"
                className="inline-flex items-center px-5 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Créer mon premier pipeline
              </Link>
            </div>
          </div>
        ) : (
          <PipelinesList pipelines={pipelines} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}