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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vue d'ensemble de vos performances commerciales
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard
            title="Contacts du mois"
            value={stats.currentMonth.contacts}
            icon={UserGroupIcon}
            trend={{ 
              value: stats.trends?.contacts || 0, 
              label: 'vs dernier mois', 
              positive: (stats.trends?.contacts || 0) >= 0 
            }}
            className="bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Deals en cours du mois"
            value={stats.currentMonth.deals}
            icon={FunnelIcon}
            trend={{ 
              value: stats.trends?.deals || 0, 
              label: 'vs dernier mois', 
              positive: (stats.trends?.deals || 0) >= 0 
            }}
            className="bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Valeur du mois"
            value={formatCurrency(Number(stats.currentMonth.value) || 0)}
            icon={CurrencyDollarIcon}
            trend={{
              value: stats.trends?.value || 0,
              label: 'vs dernier mois',
              positive: (stats.trends?.value || 0) >= 0
            }}
            className="bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          {pipelines.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <PipelineOverview pipelines={pipelines} />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <p className="text-gray-500 dark:text-gray-400">Aucun pipeline disponible</p>
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <RecentDeals deals={recentDeals} />
          </div>
        </div>

        {stats.monthlyTrends && stats.monthlyTrends.length > 0 && (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow overflow-hidden">
  {/* En-tête */}
  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
    <div className="flex items-center">
      <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Tendances mensuelles</h2>
    </div>
  </div>
  
  {/* Contenu principal - rendre responsive sans défilement fixe */}
  <div className="px-2 py-3 sm:p-4">
    {/* Affichage adaptatif des mois - 2 par ligne sur mobile, 3 sur tablette, 4 sur petit écran, 6 sur grand écran */}
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
      {stats.monthlyTrends.length > 0 ? (
        stats.monthlyTrends.map((monthData, index) => (
          <div 
            key={index} 
            className={`relative rounded-lg bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow ${
              monthData.value > 0 ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-200 dark:border-gray-600'
            }`}
          >
            <div className="font-medium text-sm text-gray-700 dark:text-gray-200 mb-2 pb-2 border-b border-gray-200 dark:border-gray-600">
              {monthData.month} {monthData.year}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Contacts</span>
                <span className={`font-medium text-xs sm:text-sm ${monthData.contacts > 0 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
                  {monthData.contacts}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Deals</span>
                <span className={`font-medium text-xs sm:text-sm ${monthData.deals > 0 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
                  {monthData.deals}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-600">
                <span className="text-xs text-gray-500 dark:text-gray-400">Valeur</span>
                <span className={`font-semibold text-xs sm:text-sm ${monthData.value > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {formatCurrency(Number(monthData.value) || 0)}
                </span>
              </div>
            </div>
            
            {monthData.value > 0 && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-600 dark:to-blue-400" 
                style={{ 
                  width: `${Math.min(100, (monthData.value / Math.max(...stats.monthlyTrends.map(m => m.value || 0))) * 100)}%` 
                }}
              />
            )}
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">Aucune donnée disponible pour cette période</p>
        </div>
      )}
    </div>
  </div>
  
  {/* Pied de page avec pagination */}
  <div className="px-3 py-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
      Période: <span className="font-medium text-gray-700 dark:text-gray-200">
        {stats.monthlyTrends.length > 0 
          ? `${stats.monthlyTrends[0]?.month} ${stats.monthlyTrends[0]?.year} - ${stats.monthlyTrends[stats.monthlyTrends.length - 1]?.month} ${stats.monthlyTrends[stats.monthlyTrends.length - 1]?.year}`
          : 'Aucune période'}
      </span>
    </div>
    <div className="flex items-center space-x-2 self-end sm:self-auto">
      <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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