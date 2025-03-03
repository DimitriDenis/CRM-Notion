// src/components/pipelines/PipelinesList.tsx
'use client';

import Link from 'next/link';
import { FunnelIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Pipeline } from '@/lib/api/pipelines';

interface PipelinesListProps {
  pipelines: Pipeline[];
  onDelete: (id: string) => void;
}

export function PipelinesList({ pipelines, onDelete }: PipelinesListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pipelines.map((pipeline) => (
        <div
          key={pipeline.id}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
        >
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <FunnelIcon className="h-6 w-6 text-gray-500" />
                <h3 className="truncate text-sm font-medium text-gray-900">
                  {pipeline.name}
                </h3>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">
                {pipeline.stages.length} stages
              </p>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <Link
                  href={`/pipelines/${pipeline.id}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  Voir
                </Link>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <Link
                  href={`/pipelines/${pipeline.id}/edit`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  Modifier
                </Link>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <button
                  onClick={() => onDelete(pipeline.id)}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Link
        href="/pipelines/new"
        className="col-span-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400"
      >
        <PlusIcon className="h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Ajouter un pipeline</h3>
        <p className="mt-1 text-sm text-gray-500">Créez un nouveau pipeline de vente</p>
      </Link>
    </div>
  );
}