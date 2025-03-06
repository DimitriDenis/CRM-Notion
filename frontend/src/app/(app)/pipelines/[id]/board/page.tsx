// src/app/(app)/pipelines/[id]/board/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { KanbanBoard } from '@/components/deals/KanbanBoard';
import { pipelinesApi, Pipeline } from '@/lib/api/pipelines';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface KanbanPageProps {
  params: {
    id: string;
  };
}

export default function KanbanPage({ params }: KanbanPageProps) {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        setIsLoading(true);
        const data = await pipelinesApi.getPipeline(params.id);
        setPipeline(data);
      } catch (err) {
        console.error('Error fetching pipeline:', err);
        setError('Erreur lors du chargement du pipeline');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPipeline();
  }, [params.id]);

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
          <div className="flex items-center">
            <Link
              href={`/pipelines/${params.id}`}
              className="mr-2 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">{pipeline.name}</h1>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            Faites glisser les deals pour les déplacer entre les étapes
          </p>
        </div>
      </div>

      <KanbanBoard pipeline={pipeline} />
    </div>
  );
}