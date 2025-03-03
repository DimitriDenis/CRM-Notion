// src/components/pipelines/PipelineForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { pipelinesApi, Pipeline, Stage } from '@/lib/api/pipelines';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface PipelineFormProps {
  pipelineId?: string;
}

export function PipelineForm({ pipelineId }: PipelineFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    stages: [{ name: 'Nouveau', order: 1 }],
  });

  // Load pipeline data if editing
  useEffect(() => {
    if (!pipelineId) return;

    const fetchPipeline = async () => {
      try {
        setIsLoading(true);
        const pipeline = await pipelinesApi.getPipeline(pipelineId);
        setFormData({
          name: pipeline.name,
          stages: pipeline.stages,
        });
      } catch (err) {
        console.error('Error fetching pipeline:', err);
        setError('Erreur lors du chargement du pipeline');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPipeline();
  }, [pipelineId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStageChange = (index: number, field: keyof Stage, value: string | number) => {
    setFormData(prev => {
      const updatedStages = [...prev.stages];
      updatedStages[index] = {
        ...updatedStages[index],
        [field]: value,
      };
      return { ...prev, stages: updatedStages };
    });
  };

  const addStage = () => {
    setFormData(prev => ({
      ...prev,
      stages: [...prev.stages, { name: '', order: prev.stages.length + 1 }],
    }));
  };

  const removeStage = (index: number) => {
    if (formData.stages.length <= 1) {
      return; // Keep at least one stage
    }
    
    setFormData(prev => {
      const updatedStages = prev.stages.filter((_, i) => i !== index);
      // Reorder stages
      return {
        ...prev,
        stages: updatedStages.map((stage, i) => ({
          ...stage,
          order: i + 1,
        })),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (pipelineId) {
        await pipelinesApi.updatePipeline(pipelineId, formData);
      } else {
        await pipelinesApi.createPipeline(formData);
      }
      router.push('/pipelines');
    } catch (err) {
      console.error('Error saving pipeline:', err);
      setError('Erreur lors de l\'enregistrement du pipeline');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse p-4 h-96 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <ErrorAlert message={error} />}

      <div className="space-y-6">
        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {pipelineId ? 'Modifier le pipeline' : 'Nouveau pipeline'}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {pipelineId
              ? 'Modifiez les informations du pipeline'
              : 'Créez un nouveau pipeline de vente'}
          </p>

          <div className="mt-6">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Nom du pipeline
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Étapes</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Définissez les étapes de votre pipeline de vente
          </p>

          <div className="mt-6 space-y-4">
            {formData.stages.map((stage, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <label
                    htmlFor={`stage-${index}`}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Étape {index + 1}
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id={`stage-${index}`}
                      required
                      value={stage.name}
                      onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeStage(index)}
                  className="mt-6 rounded-full p-1 text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addStage}
              className="flex items-center text-sm text-blue-600 hover:text-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Ajouter une étape
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-6">
        <button
          type="button"
          onClick={() => router.push('/pipelines')}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}