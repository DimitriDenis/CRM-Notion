// src/lib/api/dashboard.ts
import api from './axios';

export interface DashboardStats {
  totalContacts: number;
  totalDeals: number;
  totalValue: number;
  trends: {
    contacts: number;
    deals: number;
    value: number;
  };
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  updatedAt: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: {
    name: string;
    count: number;
    value: number;
  }[];
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },

  getRecentDeals: async (): Promise<Deal[]> => {
    const response = await api.get('/deals/recent');
    return response.data;
  },

  getPipeline: async (): Promise<Pipeline> => {
    const response = await api.get('/pipelines/overview');
    return response.data;
  },
};