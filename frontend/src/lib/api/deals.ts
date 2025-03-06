// src/lib/api/deals.ts
import api from './axios';

export interface Deal {
  id: string;
  name: string;
  value: number;
  pipelineId: string;
  pipeline?: {
    id: string;
    name: string;
  };
  stageId: string;
  stage?: {
    id: string;
    name: string;
  };
  status?: 'active' | 'won' | 'lost';
  expectedCloseDate?: string;
  contacts?: { id: string; firstName: string; lastName: string }[];
  notes?: string;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DealFilters {
  pipelineId?: string;
  stageId?: string;
  search?: string;
  status?: string;
  skip?: number;
  take?: number;
  sort?: 'name' | 'value' | 'updatedAt';
  direction?: 'asc' | 'desc';
}

export const dealsApi = {
  getDeals: async (filters: DealFilters = {}): Promise<{ items: Deal[]; total: number }> => {
    const response = await api.get('/deals', { 
        params: { 
          ...filters, 
          include: 'stage,pipeline'  // Demande au backend d'inclure ces relations
        } 
      });
    return response.data;
  },

  getDealsByPipeline: async (pipelineId: string): Promise<Deal[]> => {
    const response = await api.get(`/pipelines/${pipelineId}/deals`);
    return response.data.items;
  },

  getDeal: async (id: string): Promise<Deal> => {
    const response = await api.get(`/deals/${id}?include=stage`);
    return response.data;
  },
  

  createDeal: async (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> => {
    const response = await api.post('/deals', data);
    return response.data;
  },

  updateDeal: async (id: string, data: Partial<Deal>): Promise<Deal> => {
    const response = await api.put(`/deals/${id}`, data);
    return response.data;
  },

  deleteDeal: async (id: string): Promise<void> => {
    await api.delete(`/deals/${id}`);
  },
};