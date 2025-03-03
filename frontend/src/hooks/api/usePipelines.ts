// src/hooks/api/usePipelines.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { pipelinesApi, Pipeline } from '@/lib/api/pipelines';

export function usePipelines() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPipelines = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ajouter les paramètres de pagination explicites
      const data = await pipelinesApi.getPipelines({
        skip: 0,
        take: 100
      });
      
      setPipelines(data);
    } catch (err) {
      console.error('Error fetching pipelines:', err);
      setError('Erreur lors du chargement des pipelines');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

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