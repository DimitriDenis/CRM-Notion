// src/components/dashboard/PipelineOverview.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Pipeline } from "@/types/dashboard";

// Interface pour représenter le type de données que vous recevez du backend
interface BackendPipeline {
  id: string;
  name: string;
  dealCount: number;
  totalValue: number;
  stages: {
    [key: string]: {
      id: string;
      name: string;
      count: number;
      value: number;
      deals: any[];
    }
  };
}

interface PipelineOverviewProps {
  pipelines: BackendPipeline[] | Pipeline[];
  initialPipelineId?: string;
}

export function PipelineOverview({ pipelines, initialPipelineId }: PipelineOverviewProps) {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(
    initialPipelineId || (pipelines.length > 0 ? pipelines[0].id : null)
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Trouver le pipeline sélectionné
  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId) || pipelines[0];

  if (!selectedPipeline) {
    return (
      <div className="p-6">
        <p className="text-gray-500 dark:text-gray-400">Aucun pipeline disponible</p>
      </div>
    );
  }

  // Déterminer si nous avons affaire à un BackendPipeline ou un Pipeline
  const isBackendPipeline = 'stages' in selectedPipeline && typeof selectedPipeline.stages === 'object' && !Array.isArray(selectedPipeline.stages);

  // Transformer le format des stages si nécessaire
  const stagesArray = isBackendPipeline 
    ? Object.values((selectedPipeline as BackendPipeline).stages)
    : (selectedPipeline as Pipeline).stages;

  // Calculer les totaux
  const totalDeals = isBackendPipeline 
    ? (selectedPipeline as BackendPipeline).dealCount
    : stagesArray.reduce((sum, stage) => sum + (stage.count || 0), 0);
  
  const totalValue = isBackendPipeline 
    ? (selectedPipeline as BackendPipeline).totalValue
    : stagesArray.reduce((sum, stage) => sum + (stage.value || 0), 0);

  // Formatage de la devise
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="sm:flex-auto">
          {pipelines.length > 1 ? (
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedPipeline.name}
                <ChevronDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none">
                  <div className="py-1">
                    {pipelines.map((pipeline) => (
                      <button
                        key={pipeline.id}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          pipeline.id === selectedPipelineId 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          setSelectedPipelineId(pipeline.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {pipeline.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedPipeline.name}
            </h3>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {totalDeals} deals · {formatCurrency(totalValue)}
          </p>
        </div>
      </div>
      
      <div className="space-y-5">
        {stagesArray.length > 0 ? (
          stagesArray.map((stage) => (
            <div key={stage.id} className="relative">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="w-1/4">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{stage.name}</span>
                </div>
                <div className="w-1/4 text-right">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {stage.count || 0} deals
                  </span>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-novum dark:bg-novum rounded-full"
                  style={{
                    width: totalDeals > 0 
                      ? `${((stage.count || 0) / totalDeals) * 100}%` 
                      : '0%',
                  }}
                />
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(stage.value || 0)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            Aucune étape dans ce pipeline
          </div>
        )}
      </div>
    </div>
  );
}