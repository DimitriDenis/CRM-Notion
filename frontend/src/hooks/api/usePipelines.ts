// src/hooks/api/usePipelines.ts
'use client';

import { useState, useEffect } from 'react';
import { pipelinesApi, Pipeline } from '@/lib/api/pipelines';

export function usePipelines() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        setIsLoading(true);
        const data = await pipelinesApi.getPipelines();
        setPipelines(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching pipelines:', err);
        setError('Une erreur est survenue lors du chargement des pipelines');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPipelines();
  }, []);

  const deletePipeline = async (id: string) => {
    try {
      await pipelinesApi.deletePipeline(id);
      setPipelines(prev => prev.filter(pipeline => pipeline.id !== id));
    } catch (err) {
      console.error('Error deleting pipeline:', err);
      setError('Une erreur est survenue lors de la suppression du pipeline');
    }
  };

  const refetch = async () => {
    try {
      setIsLoading(true);
      const data = await pipelinesApi.getPipelines();
      setPipelines(data);
      setError(null);
    } catch (err) {
      console.error('Error refetching pipelines:', err);
      setError('Une erreur est survenue lors de l\'actualisation des pipelines');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pipelines,
    isLoading,
    error,
    deletePipeline,
    refetch,
  };
}