// src/app/(app)/dashboard/page.tsx
'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  FunnelIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentDeals } from '@/components/dashboard/RecentDeals';
import { PipelineOverview } from '@/components/dashboard/PipelineOverview';
import type { Deal, DashboardStats } from '@/types/dashboard';
import DashboardLoading from './loading';
import { dashboardApi } from '@/lib/api/dashboard';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDeals, setRecentDeals] = useState<Deal[] | null>(null);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, dealsData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentDeals(),
        ]);
        
        setStats(statsData);
        setRecentDeals(dealsData);
        
        if (statsData && statsData.pipeline && Array.isArray(statsData.pipeline)) {
          setPipelines(statsData.pipeline);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !stats || !recentDeals) {
    return <DashboardLoading />;
  }

  // Formatage de la devise
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2
    });
  };

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue d'ensemble de vos performances commerciales
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={UserGroupIcon}
            trend={{ 
              value: stats.trends?.contacts || 0, 
              label: 'vs dernier mois', 
              positive: (stats.trends?.contacts || 0) >= 0 
            }}
            className="bg-white shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Deals en cours"
            value={stats.totalDeals}
            icon={FunnelIcon}
            trend={{ 
              value: stats.trends?.deals || 0, 
              label: 'vs dernier mois', 
              positive: (stats.trends?.deals || 0) >= 0 
            }}
            className="bg-white shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Valeur Totale"
            value={formatCurrency(Number(stats.totalValue) || 0)}
            icon={CurrencyDollarIcon}
            trend={{
              value: stats.trends?.value || 0,
              label: 'vs dernier mois',
              positive: (stats.trends?.value || 0) >= 0
            }}
            className="bg-white shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          {pipelines.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <PipelineOverview pipelines={pipelines} />
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-500">Aucun pipeline disponible</p>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <RecentDeals deals={recentDeals} />
          </div>
        </div>

        {stats.monthlyTrends && stats.monthlyTrends.length > 0 && (
  <div className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <div className="flex items-center">
        <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Tendances mensuelles</h2>
      </div>
      
    </div>
    
    <div className="p-1 sm:p-2 md:p-4 overflow-x-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 min-w-[600px]">
        {stats.monthlyTrends.map((monthData, index) => (
          <div 
            key={index} 
            className={`relative rounded-lg bg-gray-50 p-4 transition-all hover:bg-blue-50 hover:shadow ${
              monthData.value > 0 ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-200'
            }`}
          >
            <div className="font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">
              {monthData.month} {monthData.year}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Contacts</span>
                <span className={`font-medium text-sm ${monthData.contacts > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                  {monthData.contacts}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Deals</span>
                <span className={`font-medium text-sm ${monthData.deals > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                  {monthData.deals}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                <span className="text-xs text-gray-500">Valeur</span>
                <span className={`font-semibold text-sm ${monthData.value > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                  {formatCurrency(Number(monthData.value) || 0)}
                </span>
              </div>
            </div>
            
            {monthData.value > 0 && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300" 
                style={{ 
                  width: `${Math.min(100, (monthData.value / Math.max(...stats.monthlyTrends.map(m => m.value || 0))) * 100)}%` 
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
    
    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
      <div className="text-sm text-gray-500">
        Période: <span className="font-medium text-gray-700">
          {stats.monthlyTrends[0]?.month} {stats.monthlyTrends[0]?.year} - {stats.monthlyTrends[stats.monthlyTrends.length - 1]?.month} {stats.monthlyTrends[stats.monthlyTrends.length - 1]?.year}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-1 rounded hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="p-1 rounded hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}