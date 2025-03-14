// src/app/(app)/dashboard/page.tsx
'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  FunnelIcon 
} from '@heroicons/react/24/outline';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentDeals } from '@/components/dashboard/RecentDeals';
import { PipelineOverview } from '@/components/dashboard/PipelineOverview';
import type { Deal, DashboardStats, Pipeline } from '@/types/dashboard';
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

        console.log('Stats Data:', statsData);
        
        setStats(statsData);
        setRecentDeals(dealsData);
        
        // Les statistiques des pipelines sont dans stats.pipeline
        if (statsData && statsData.pipeline && Array.isArray(statsData.pipeline)) {
          setPipelines(statsData.pipeline);
          console.log('Pipelines Data:', statsData.pipeline);
        } else {
          console.warn('Pipeline data not found or not in expected format:', statsData.pipeline);
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

  // Formater la valeur totale en euros
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2
    });
  };

  return (
    <Suspense fallback={<DashboardLoading />}>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={UserGroupIcon}
            trend={{ 
              value: stats.trends?.contacts || 0, 
              label: 'vs dernier mois', 
              positive: (stats.trends?.contacts || 0) >= 0 
            }}
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
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Passer le tableau de pipelines au composant */}
        {pipelines.length > 0 ? (
          <PipelineOverview pipelines={pipelines} />
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Aucun pipeline disponible</p>
          </div>
        )}
        <RecentDeals deals={recentDeals} />
      </div>

        {/* Nouvelle section pour les tendances mensuelles si vous le souhaitez */}
        {stats.monthlyTrends && stats.monthlyTrends.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tendances mensuelles</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-6 gap-4">
                {stats.monthlyTrends.map((monthData, index) => (
                  <div key={index} className="text-center border-r last:border-r-0 border-gray-200">
                    <div className="font-medium text-gray-500">{monthData.month} {monthData.year}</div>
                    <div className="mt-2 text-sm">
                      <div>Contacts: {monthData.contacts}</div>
                      <div>Deals: {monthData.deals}</div>
                      <div>Valeur: {formatCurrency(Number(monthData.value) || 0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}