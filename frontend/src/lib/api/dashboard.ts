// src/lib/api/dashboard.ts
import api from './axios';
import type { Deal, DashboardStats, Pipeline } from '@/types/dashboard';
export type { Deal, Pipeline, DashboardStats };

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/stats/dashboard');
    console.log('Dashboard API Response:', response.data);
    return response.data;
  },

  getRecentDeals: async (): Promise<Deal[]> => {
    try {
      const response = await api.get('/deals/recent');
      console.log('Deals response:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Deals error:', error);
      return [];
    }
  },


  getPipeline: async (): Promise<Pipeline> => {
    try {
      const response = await api.get('/pipelines/overview');
      console.log('Pipeline response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Pipeline error:', error);
      throw error;
    }
  },
};