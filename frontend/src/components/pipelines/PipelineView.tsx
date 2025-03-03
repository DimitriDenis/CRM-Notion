// src/components/pipelines/PipelineView.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PencilIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { pipelinesApi, PipelineStats } from '@/lib/api/pipelines';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface PipelineViewProps {
  pipelineId: string;
}

export function PipelineView({ pipelineId }: PipelineViewProps) {
  const [pipeline, setPipeline] = useState<PipelineStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        setIsLoading(true);
        const data = await pipelinesApi.getPipelineStats(pipelineId);
        setPipeline(data);
      } catch (err) {
        console.error('Error fetching pipeline:', err);
        setError('Erreur lors du chargement du pipeline');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPipeline();
  }, [pipelineId]);

  if (isLoading) {
    return <div className="animate-pulse p-4 h-96 bg-gray-100 rounded-lg"></div>;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!pipeline) {
    return <div>Pipeline introuvable</div>;
  }

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{pipeline.name}</h1>
          <p className="mt-2 text-sm text-gray-700">
            {pipeline.totalDeals} deals · {pipeline.totalValue.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href={`/pipelines/${pipelineId}/edit`}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PencilIcon className="-ml-0.5 mr-1.5 inline-block h-5 w-5" aria-hidden="true" />
            Modifier
          </Link>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="border-b border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Stages
            </h3>
          </div>
        </div>
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {pipeline.stages.map((stage) => (
              <div key={stage.id} className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">{stage.name}</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-1 sm:mt-0">
                  {stage.count} deals
                </dd>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-1 sm:mt-0">
                  <CurrencyDollarIcon className="-ml-0.5 mr-1 inline-block h-5 w-5 text-gray-400" />
                  {stage.value.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/pipelines/${pipelineId}/board`}
          className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
        >
          Voir le tableau kanban →
        </Link>
      </div>
    </div>
  );
}
