// src/app/(app)/dashboard/page.tsx
import { Suspense } from 'react';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  FunnelIcon 
} from '@heroicons/react/24/outline';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentDeals } from '@/components/dashboard/RecentDeals';
import { PipelineOverview } from '@/components/dashboard/PipelineOverview';
import DashboardLoading from './loading';
import { dashboardApi } from '@/lib/api/dashboard';

async function getStats() {
  // TODO: Remplacer par un appel API réel
  return {
    totalContacts: 150,
    totalDeals: 45,
    totalValue: 125000,
  };
}

async function getRecentDeals() {
  // TODO: Remplacer par un appel API réel
  return [
    {
      id: '1',
      name: 'Deal Test',
      value: 5000,
      stage: 'Négociation',
      updatedAt: new Date().toISOString(),
    },
  ];
}

async function getPipeline() {
  // TODO: Remplacer par un appel API réel
  return {
    id: '1',
    name: 'Pipeline Principal',
    stages: [
      { name: 'Lead', count: 10, value: 50000 },
      { name: 'Contact', count: 5, value: 25000 },
      { name: 'Négociation', count: 3, value: 15000 },
    ],
  };
}

export default async function DashboardPage() {
    const [stats, recentDeals, pipeline] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentDeals(),
        dashboardApi.getPipeline(),
      ]);

  return (
    <Suspense fallback={<DashboardLoading />}>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={UserGroupIcon}
            trend={{ value: 12, label: 'vs dernier mois', positive: true }}
          />
          <StatCard
            title="Deals en cours"
            value={stats.totalDeals}
            icon={FunnelIcon}
          />
          <StatCard
            title="Valeur Totale"
            value={stats.totalValue.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
            icon={CurrencyDollarIcon}
            trend={{ value: 8.2, label: 'vs dernier mois', positive: true }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PipelineOverview pipeline={pipeline} />
          <RecentDeals deals={recentDeals} />
        </div>
      </div>
    </Suspense>
  );
}