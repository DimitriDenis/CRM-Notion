// src/app/(app)/pipelines/page.tsx
'use client';

import { useState } from 'react';
import { PipelinesList } from '@/components/pipelines/PipelinesList';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { usePipelines } from '@/hooks/api/usePipelines';
import { PlusIcon, FunnelIcon, ChartBarIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ExportModal from '@/components/notion/ExportModal';

export default function PipelinesPage() {
  const { pipelines, isLoading, error, deletePipeline, refetch } = usePipelines();
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedPipelines, setSelectedPipelines] = useState<string[]>([]);
  
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-sm p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800/50 rounded-lg p-3">
              <FunnelIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pipelines</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {isLoading
                  ? 'Chargement des pipelines...'
                  : `${pipelines.length} pipeline${pipelines.length !== 1 ? 's' : ''} configuré${pipelines.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              <DocumentArrowUpIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              Exporter vers Notion
            </button>
            <Link
              href="/pipelines/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nouveau pipeline
            </Link>
          </div>
        </div>
      </div>

      {/* Section d'aide ou d'information */}
      {!isLoading && pipelines.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 flex items-start space-x-4">
          <div className="flex-shrink-0">
            <ChartBarIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Astuce</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Personnalisez vos pipelines pour refléter votre processus de vente. Vous pouvez ajouter, réorganiser ou supprimer des étapes à tout moment.
            </p>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : pipelines.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mx-auto w-fit">
              <FunnelIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucun pipeline configuré</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Les pipelines vous permettent d'organiser vos opportunités commerciales par étapes. Créez votre premier pipeline pour commencer.
            </p>
            <div className="mt-6">
              <Link
                href="/pipelines/new"
                className="inline-flex items-center px-5 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          entityType="pipelines"
          selectedIds={selectedPipelines}
          entityName="Pipelines"
        />
      )}
    </div>
  );
}