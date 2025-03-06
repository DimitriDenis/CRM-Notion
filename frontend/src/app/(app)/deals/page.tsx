// src/app/(app)/deals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { dealsApi, Deal, DealFilters } from '@/lib/api/deals';
import { pipelinesApi, Pipeline } from '@/lib/api/pipelines';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { formatCurrency } from '@/utils/formatters';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [totalDeals, setTotalDeals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DealFilters>({
    status: 'active',
    skip: 0,
    take: 20,
  });
  const [sortField, setSortField] = useState<'name' | 'value' | 'updatedAt'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Load pipelines for filtering
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const data = await pipelinesApi.getPipelines();
        setPipelines(data);
      } catch (err) {
        console.error('Error fetching pipelines:', err);
      }
    };

    fetchPipelines();
  }, []);

  // Load deals with filters
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        const { items, total } = await dealsApi.getDeals({
          ...filters,
          sort: sortField,
          direction: sortDirection,
        });
        setDeals(items);
        setTotalDeals(total);
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
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'won': return 'Gagné';
      case 'lost': return 'Perdu';
      default: return 'En cours';
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

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Deals</h1>
          <p className="mt-2 text-sm text-gray-700">
            {isLoading
              ? 'Chargement des deals...'
              : `Total: ${totalDeals} deal${totalDeals !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/deals/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Nouveau deal
          </Link>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="border-b border-gray-200 p-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-4">
              <select
                name="pipelineId"
                id="pipelineId"
                value={filters.pipelineId || ''}
                onChange={handleFilterChange}
                className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value="">Tous les statuts</option>
                <option value="active">En cours</option>
                <option value="won">Gagné</option>
                <option value="lost">Perdu</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th 
                  scope="col" 
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <span className="group inline-flex">
                    Nom
                    {getSortIcon('name')}
                  </span>
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Pipeline / Étape
                </th>
                <th 
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort('value')}
                >
                  <span className="group inline-flex">
                    Valeur
                    {getSortIcon('value')}
                  </span>
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Statut
                </th>
                <th 
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort('updatedAt')}
                >
                  <span className="group inline-flex">
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
                    Aucun deal trouvé
                  </td>
                </tr>
              ) : (
                deals.map(deal => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <Link href={`/deals/${deal.id}`} className="hover:text-blue-600 hover:underline">
                        {deal.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {deal.pipeline?.name || 'N/A'} / {deal.stage?.name || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(deal.value)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(deal.status)}`}>
                        {getStatusLabel(deal.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(deal.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link href={`/deals/${deal.id}/edit`} className="text-blue-600 hover:text-blue-900">
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
    </div>
  );
}

