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
import { useRouter, useSearchParams } from 'next/navigation';



export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDeals, setRecentDeals] = useState<Deal[] | null>(null);
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log('=== Dashboard Token Check ===');
    const token = searchParams.get('token');
    console.log('Token in URL:', !!token);
    
    if (token) {
      console.log('Storing token in localStorage');
      localStorage.setItem('token', token);
      console.log('Token stored:', localStorage.getItem('token'));
      console.log('Redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, dealsData, pipelineData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentDeals(),
          dashboardApi.getPipeline(),
        ]);

        setStats(statsData);
        setRecentDeals(dealsData);
        setPipeline(pipelineData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !stats || !recentDeals || !pipeline) {
    return <DashboardLoading />;
  }

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