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
    <div className="min-h-screen bg-gray-50">
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
          <div className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tendances mensuelles</h2>
              <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="grid grid-cols-6 gap-4">
              {stats.monthlyTrends.map((monthData, index) => (
                <div key={index} className="text-center border-r last:border-r-0 border-gray-200 p-2">
                  <div className="font-medium text-gray-500">{monthData.month} {monthData.year}</div>
                  <div className="mt-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Contacts:</span>
                      <span className="font-medium">{monthData.contacts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Deals:</span>
                      <span className="font-medium">{monthData.deals}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Valeur:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(Number(monthData.value) || 0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}