// src/components/pipelines/PipelineView.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PencilIcon, 
  CurrencyDollarIcon, 
  FunnelIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  TagIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
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

  // Fonction pour formater la devise de manière sécurisée
  const formatCurrency = (value: number | string) => {
    // Convertir en nombre si c'est une chaîne
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Vérifier si c'est un nombre valide
    if (isNaN(numValue)) return '0,00 €';
    
    return numValue.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculer le pourcentage pour la barre de progression
  const calculatePercentage = (stageValue: number | string, totalValue: number | string) => {
    const stageNum = typeof stageValue === 'string' ? parseFloat(stageValue) : stageValue;
    const totalNum = typeof totalValue === 'string' ? parseFloat(totalValue) : totalValue;
    
    if (isNaN(stageNum) || isNaN(totalNum) || totalNum === 0) return 0;
    return (stageNum / totalNum) * 100;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
        <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4 mt-2"></div>
        <div className="animate-pulse h-72 bg-gray-200 dark:bg-gray-700 rounded-lg mt-6"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!pipeline) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <FunnelIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Pipeline introuvable</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Le pipeline demandé n'existe pas ou a été supprimé.</p>
        <div className="mt-6">
          <Link
            href="/pipelines"
            className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600"
          >
            Retour aux pipelines
          </Link>
        </div>
      </div>
    );
  }

  // Convertir totalValue en nombre pour les calculs
  const totalValueNum = typeof pipeline.totalValue === 'string' 
    ? parseFloat(pipeline.totalValue) 
    : pipeline.totalValue;

  return (
    <div className="space-y-6">
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-sm p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <FunnelIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pipeline.name}</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <ShoppingBagIcon className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="mr-2 font-medium">{pipeline.totalDeals} deals</span>
                <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                <CurrencyDollarIcon className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">{formatCurrency(pipeline.totalValue)}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href={`/pipelines/${pipelineId}/board`}
              className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800/60"
            >
              <ChartBarIcon className="mr-2 h-5 w-5" />
              Tableau Kanban
            </Link>
            <Link
              href={`/pipelines/${pipelineId}/edit`}
              className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-700 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <PencilIcon className="mr-2 h-5 w-5" />
              Modifier
            </Link>
          </div>
        </div>
      </div>

      {/* Statistiques sommaires */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-50 dark:bg-blue-900/30">
                <FunnelIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Étapes</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{pipeline.stages.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-50 dark:bg-green-900/30">
                <ShoppingBagIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Deals</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{pipeline.totalDeals}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-purple-50 dark:bg-purple-900/30">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Valeur totale</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(pipeline.totalValue)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-amber-50 dark:bg-amber-900/30">
                <TagIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Valeur moyenne</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(pipeline.totalDeals > 0 ? totalValueNum / pipeline.totalDeals : 0)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des étapes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
            <ChartBarIcon className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Progression par étape
          </h3>
        </div>
        
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {pipeline.stages.map((stage) => {
            // Convertir la valeur en nombre
            const stageValueNum = typeof stage.value === 'string' ? parseFloat(stage.value) : stage.value;
            const percentage = calculatePercentage(stageValueNum, totalValueNum);
            
            return (
              <li key={stage.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">{stage.name}</h4>
                    <div className="flex items-center">
                      <span className="mr-4 text-sm text-gray-500 dark:text-gray-400">{stage.count} deals</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(stage.value)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>{Math.round(percentage)}% de la valeur totale</span>
                      <span>{formatCurrency(stage.value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          percentage > 66 ? 'bg-green-500 dark:bg-green-600' : 
                          percentage > 33 ? 'bg-blue-500 dark:bg-blue-600' : 'bg-purple-500 dark:bg-purple-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Dernière mise à jour: <span className="text-gray-700 dark:text-gray-300 font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
        </div>
        
        <div className="flex space-x-4">
          <Link
            href={`/pipelines/${pipelineId}/board`}
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Voir le tableau kanban
            <ArrowRightIcon className="ml-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}