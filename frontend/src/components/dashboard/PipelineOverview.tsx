// src/components/dashboard/PipelineOverview.tsx
import { useState, useEffect } from 'react';
import type { Pipeline } from "@/types/dashboard";

// Interface pour représenter le type de données que vous recevez réellement du backend
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

  // Trouver le pipeline sélectionné
  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId) || pipelines[0];

  if (!selectedPipeline) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Aucun pipeline disponible</p>
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
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {selectedPipeline.name}
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              {totalDeals} deals · {formatCurrency(totalValue)}
            </p>
          </div>
          
          {pipelines.length > 1 && (
            <div className="mt-4 sm:mt-0">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={selectedPipelineId || ''}
                onChange={(e) => setSelectedPipelineId(e.target.value)}
              >
                {pipelines.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <div className="space-y-4">
            {stagesArray.length > 0 ? (
              stagesArray.map((stage) => (
                <div key={stage.id} className="relative">
                  <div className="flex items-center justify-between text-sm">
                    <div className="w-1/4">
                      <span className="text-gray-600">{stage.name}</span>
                    </div>
                    <div className="w-2/4">
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: totalDeals > 0 
                              ? `${((stage.count || 0) / totalDeals) * 100}%` 
                              : '0%',
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-1/4 text-right">
                      <span className="font-medium text-gray-900">
                        {stage.count || 0} deals
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                Aucune étape dans ce pipeline
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}