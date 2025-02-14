// src/components/dashboard/PipelineOverview.tsx
import type { Pipeline } from "@/types/dashboard";
  
  export function PipelineOverview({ pipeline }: { pipeline: Pipeline }) {
    // Ajouter une vérification pour les valeurs optionnelles
    const totalDeals = pipeline.stages.reduce((sum, stage) => sum + (stage.count || 0), 0);
    const totalValue = pipeline.stages.reduce((sum, stage) => sum + (stage.value || 0), 0);
  
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {pipeline.name}
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                {totalDeals} deals · {totalValue.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="space-y-4">
              {pipeline.stages.map((stage) => (
                <div key={stage.id} className="relative"> {/* Changé stage.name en stage.id */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="w-1/4">
                      <span className="text-gray-600">{stage.name}</span>
                    </div>
                    <div className="w-2/4">
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${((stage.count || 0) / totalDeals) * 100}%`,
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
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }