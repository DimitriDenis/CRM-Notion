// src/components/pipelines/PipelineForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon, FunnelIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
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
    return (
      <div className="animate-pulse p-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mb-6"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-8"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Bouton retour */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push('/pipelines')}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowUturnLeftIcon className="mr-1 h-4 w-4" />
          Retour aux pipelines
        </button>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {error && <div className="px-6 pt-6"><ErrorAlert message={error} /></div>}

        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
              <FunnelIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {pipelineId ? 'Modifier le pipeline' : 'Nouveau pipeline'}
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {pipelineId
                  ? 'Modifiez les informations du pipeline existant'
                  : 'Créez un nouveau pipeline pour organiser vos opportunités de vente'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-white dark:bg-gray-800">
          {/* Nom du pipeline */}
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
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
                placeholder="Ex: Pipeline commercial, Ventes B2B..."
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Étapes */}
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Étapes du pipeline</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2.5 py-1 rounded-full">
                {formData.stages.length} étape{formData.stages.length > 1 ? 's' : ''}
              </span>
            </div>
            <p className="mb-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Définissez les étapes par lesquelles passeront vos opportunités, de la première prise de contact jusqu'à la conclusion.
            </p>

            <div className="space-y-4">
              {formData.stages.map((stage, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 bg-white dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm group relative"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      id={`stage-${index}`}
                      required
                      value={stage.name}
                      onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                      placeholder={`Étape ${index + 1}`}
                      className="block w-full border-0 p-0 text-gray-900 dark:text-white bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStage(index)}
                    className="opacity-0 group-hover:opacity-100 rounded-full p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStage}
                className="flex items-center w-full justify-center py-3 px-4 text-sm text-blue-600 dark:text-blue-400 border border-dashed border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors  dark:bg-gray-750"
              >
                <PlusIcon className="h-5 w-5 mr-1.5" />
                Ajouter une étape
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-x-4">
          <button
            type="button"
            onClick={() => router.push('/pipelines')}
            className="py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-blue-600 dark:bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500 transition-colors disabled:opacity-70 flex items-center"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              'Enregistrer le pipeline'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}