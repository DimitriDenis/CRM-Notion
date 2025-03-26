// src/components/pipelines/PipelinesList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FunnelIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon, 
  EllipsisVerticalIcon,
  ChevronRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Pipeline } from '@/lib/api/pipelines';

interface PipelinesListProps {
  pipelines: Pipeline[];
  onDelete: (id: string) => void;
}

export function PipelinesList({ pipelines, onDelete }: PipelinesListProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Générer une couleur de dégradé basée sur le nom du pipeline
  const getPipelineGradient = (name: string) => {
    const gradients = [
      'from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30',
      'from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30',
      'from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30',
      'from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30',
      'from-rose-50 to-red-50 dark:from-rose-900/30 dark:to-red-900/30',
      'from-cyan-50 to-sky-50 dark:from-cyan-900/30 dark:to-sky-900/30',
    ];
    
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[sum % gradients.length];
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pipelines.map((pipeline) => {
        const pipelineGradient = getPipelineGradient(pipeline.name);
        
        return (
          <div
            key={pipeline.id}
            className="col-span-1 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/30 transition-shadow duration-300"
          >
            {/* En-tête */}
            <div className={`bg-gradient-to-r ${pipelineGradient} p-5 relative`}>
              <div className="absolute top-3 right-2">
                <div className="relative">
                  <button 
                    onClick={() => setMenuOpen(menuOpen === pipeline.id ? null : pipeline.id)}
                    className="p-1.5 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  
                  {menuOpen === pipeline.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-100 dark:border-gray-700">
                      <Link
                        href={`/pipelines/${pipeline.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <EyeIcon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                        Voir
                      </Link>
                      <Link
                        href={`/pipelines/${pipeline.id}/edit`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <PencilSquareIcon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                        Modifier
                      </Link>
                      <button
                        onClick={() => onDelete(pipeline.id)}
                        className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <TrashIcon className="h-4 w-4 mr-3" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white/40 dark:bg-gray-800/40 rounded-lg p-3 flex-shrink-0">
                  <FunnelIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {pipeline.name}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 flex items-center">
                    {pipeline.stages.length} {pipeline.stages.length > 1 ? 'étapes' : 'étape'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Corps - utilisant uniquement les données disponibles */}
            <div className="p-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Étapes</span>
                      <span className="font-medium text-gray-900 dark:text-white">{pipeline.stages.length}</span>
                    </div>
                    
                    {/* Liste des étapes sous forme de puces */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2">
                      {pipeline.stages.slice(0, 3).map((stage, index) => (
                        <div key={index} className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mr-2"></span>
                          <span className="truncate">{stage.name}</span>
                        </div>
                      ))}
                      {pipeline.stages.length > 3 && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 ml-3">
                          +{pipeline.stages.length - 3} autres étapes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pied */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-3">
              <Link
                href={`/pipelines/${pipeline.id}`}
                className="w-full inline-flex items-center justify-center text-sm font-medium rounded-md text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 py-2 transition-colors"
              >
                Voir les opportunités
                <ChevronRightIcon className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        );
      })}

      {/* Carte pour ajouter un pipeline */}
      <Link
        href="/pipelines/new"
        className="col-span-1 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center text-center hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all duration-300 group"
      >
        <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors">
          <PlusIcon className="h-8 w-8 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
        </div>
        <h3 className="mt-4 text-base font-medium text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100">Ajouter un pipeline</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          Créez un nouveau pipeline personnalisé pour suivre vos opportunités commerciales
        </p>
      </Link>
    </div>
  );
}