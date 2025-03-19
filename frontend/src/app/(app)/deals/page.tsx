// src/app/(app)/deals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { dealsApi, Deal, DealFilters } from '@/lib/api/deals';
import { pipelinesApi, Pipeline } from '@/lib/api/pipelines';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { formatCurrency } from '@/utils/formatters';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [totalDeals, setTotalDeals] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DealFilters>({
    status: 'active',
    skip: 0,
    take: 20,
  });
  const [sortField, setSortField] = useState<'name' | 'value' | 'updatedAt'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [showFilters, setShowFilters] = useState(false);

  // Load pipelines for filtering
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const data = await pipelinesApi.getPipelines({ skip: 0, take: 100 });
        setPipelines(data);
      } catch (err) {
        console.error('Error fetching pipelines:', err);
        setPipelines([]);
      }
    };

    fetchPipelines();
  }, []);

  // Load deals with filters
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        
        // Filtrer les paramètres vides avant de les envoyer à l'API
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        );
        
        const { items, total } = await dealsApi.getDeals({
          ...cleanFilters,
          sort: sortField,
          direction: sortDirection,
        });
        
        setDeals(items);
        setTotalDeals(total);
        
        // Calculer la valeur totale
        const totalValue = items.reduce((sum, deal) => {
          const value = typeof deal.value === 'string' ? parseFloat(deal.value) : deal.value;
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
        setTotalValue(totalValue);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Une erreur est survenue lors du chargement des deals');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDeals();
  }, [filters, sortField, sortDirection]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      skip: 0, // Reset pagination when filters change
    }));
  };

  const handleSort = (field: 'name' | 'value' | 'updatedAt') => {
    setSortDirection(prev => 
      sortField === field 
        ? prev === 'asc' ? 'desc' : 'asc'
        : 'desc'
    );
    setSortField(field);
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'won': return 'bg-green-100 text-green-800 border border-green-200';
      case 'lost': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };
  
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'won': return 'Gagné';
      case 'lost': return 'Perdu';
      default: return 'En cours';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'won': return <CheckCircleIcon className="h-4 w-4 mr-1" />;
      case 'lost': return <XCircleIcon className="h-4 w-4 mr-1" />;
      default: return <ClockIcon className="h-4 w-4 mr-1" />;
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowsUpDownIcon className="h-4 w-4 inline-block ml-1 rotate-180" />
      : <ArrowsUpDownIcon className="h-4 w-4 inline-block ml-1" />;
  };

  if (error) {
    return <ErrorAlert message={error} />;
  }

  // Générer une couleur basée sur le nom du deal
  const getDealColor = (name: string) => {
    const gradients = [
      'from-blue-50 to-indigo-50 border-blue-200',
      'from-emerald-50 to-teal-50 border-emerald-200',
      'from-purple-50 to-pink-50 border-purple-200',
      'from-orange-50 to-amber-50 border-orange-200',
      'from-rose-50 to-red-50 border-rose-200',
    ];
    
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[sum % gradients.length];
  };

  const renderSummaryStats = () => {
    interface StatItem {
      label: string;
      value: string | number;
      icon: React.ReactNode;
      color: string;
    }

    const stats: StatItem[] = [
      {
        label: 'Deals totaux',
        value: totalDeals,
        icon: <ShoppingBagIcon className="h-5 w-5" />,
        color: 'bg-blue-50 text-blue-600'
      },
      {
        label: 'Valeur totale',
        value: formatCurrency(totalValue),
        icon: <CurrencyDollarIcon className="h-5 w-5" />,
        color: 'bg-green-50 text-green-600'
      }
    ];

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className={`${stat.color} p-2 rounded-md`}>
                {stat.icon}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-white/60 rounded-lg">
              <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
              <p className="mt-1 text-sm text-gray-600">
                {isLoading
                  ? 'Chargement des deals...'
                  : `${totalDeals} deal${totalDeals !== 1 ? 's' : ''} - ${formatCurrency(totalValue)}`}
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href="/deals/new"
              className="inline-flex items-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Nouveau deal
            </Link>
          </div>
        </div>
      </div>

      {/* Résumé des statistiques */}
      {!isLoading && renderSummaryStats()}

      {/* Options de filtrage et d'affichage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                showFilters
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtres
            </button>
            
            <div className="border border-gray-200 rounded-md p-1 flex items-center">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="Vue liste"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded ${
                  viewMode === 'cards' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="Vue cartes"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              name="pipelineId"
              id="pipelineId"
              value={filters.pipelineId || ''}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">Tous les pipelines</option>
              {pipelines.map(pipeline => (
                <option key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </option>
              ))}
            </select>

            <select
              name="status"
              id="status"
              value={filters.status || ''}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="active">En cours</option>
              <option value="won">Gagné</option>
              <option value="lost">Perdu</option>
            </select>
          </div>
        </div>
        
        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Rechercher par nom..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="minValue" className="block text-sm font-medium text-gray-700 mb-1">
                Valeur minimale
              </label>
              <input
                type="number"
                name="minValue"
                id="minValue"
                placeholder="Valeur min..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                onChange={(e) => setFilters(prev => ({ ...prev, minValue: e.target.value ? parseFloat(e.target.value) : undefined }))}
              />
            </div>
            
            <div>
              <label htmlFor="maxValue" className="block text-sm font-medium text-gray-700 mb-1">
                Valeur maximale
              </label>
              <input
                type="number"
                name="maxValue"
                id="maxValue"
                placeholder="Valeur max..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                onChange={(e) => setFilters(prev => ({ ...prev, maxValue: e.target.value ? parseFloat(e.target.value) : undefined }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Vue liste */}
      {viewMode === 'list' && (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th 
                    scope="col" 
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-6 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <span className="group inline-flex items-center">
                      Nom
                      {getSortIcon('name')}
                    </span>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                    Pipeline / Étape
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 py-3.5 text-left text-sm font-medium text-gray-900 cursor-pointer"
                    onClick={() => handleSort('value')}
                  >
                    <span className="group inline-flex items-center">
                      Valeur
                      {getSortIcon('value')}
                    </span>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                    Statut
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 py-3.5 text-left text-sm font-medium text-gray-900 cursor-pointer"
                    onClick={() => handleSort('updatedAt')}
                  >
                    <span className="group inline-flex items-center">
                      Mise à jour
                      {getSortIcon('updatedAt')}
                    </span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </td>
                    </tr>
                  ))
                ) : deals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <ShoppingBagIcon className="h-10 w-10 text-gray-400 mb-2" />
                        <p>Aucun deal trouvé</p>
                        <p className="text-xs text-gray-400 mt-1">Modifiez vos filtres ou créez un nouveau deal</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  deals.map(deal => (
                    <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <Link href={`/deals/${deal.id}`} className="hover:text-blue-600 hover:underline">
                          {deal.name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {deal.pipeline?.name || 'N/A'} / {deal.stage?.name || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(deal.value)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(deal.status)}`}>
                          {getStatusIcon(deal.status)}
                          {getStatusLabel(deal.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(deal.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link 
                          href={`/deals/${deal.id}/edit`} 
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors"
                        >
                          Modifier
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vue cartes */}
      {viewMode === 'cards' && (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {isLoading ? (
      Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm h-40"></div>
      ))
    ) : deals.length === 0 ? (
      <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center">
        <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-base font-medium text-gray-900">Aucun deal trouvé</h3>
        <p className="mt-1 text-sm text-gray-500">Modifiez vos filtres ou créez un nouveau deal</p>
        <div className="mt-6">
          <Link
            href="/deals/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
            Nouveau deal
          </Link>
        </div>
      </div>
    ) : (
      deals.map(deal => {
        // Appliquer une couleur de bordure basée sur le statut plutôt que sur le nom
        const statusBorderClass = 
          deal.status === 'won' ? 'border-green-200 bg-green-50/30' : 
          deal.status === 'lost' ? 'border-red-200 bg-red-50/30' : 
          'border-blue-200 bg-blue-50/30';
          
        return (
          <div
            key={deal.id}
            className={`bg-white rounded-lg shadow-sm overflow-hidden border ${statusBorderClass} hover:shadow-md transition-all`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <Link href={`/deals/${deal.id}`} className="text-lg font-medium text-gray-900 hover:text-blue-700 transition-colors">
                  {deal.name}
                </Link>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(deal.status)}`}>
                  {getStatusIcon(deal.status)}
                  {getStatusLabel(deal.status)}
                </span>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pipeline / Étape</span>
                  <span className="text-sm font-medium text-gray-900">
                    {deal.pipeline?.name || 'N/A'} / {deal.stage?.name || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Valeur</span>
                  <span className="text-sm font-bold text-blue-700">
                    {formatCurrency(deal.value)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Dernière mise à jour</span>
                  <span className="text-sm text-gray-700">
                    {new Date(deal.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white px-5 py-3 border-t border-gray-200">
              <Link 
                href={`/deals/${deal.id}/edit`} 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Modifier ce deal
              </Link>
            </div>
          </div>
        );
      })
    )}
  </div>
)}
    </div>
  );
}