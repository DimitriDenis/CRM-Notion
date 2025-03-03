// src/lib/api/pipelines.ts
import api from './axios';

export interface Stage {
  id: string;
  name: string;
  order: number;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
  createdAt: string;
  updatedAt: string;
  notionMetadata?: {
    databaseId?: string;
    pageId?: string;
    lastSync?: string;
  };
}

export interface PipelineStats {
  id: string;
  name: string;
  stages: {
    id: string;
    name: string;
    count: number;
    value: number;
  }[];
  totalDeals: number;
  totalValue: number;
}

export const pipelinesApi = {
  getPipelines: async (): Promise<Pipeline[]> => {
    const response = await api.get('/pipelines');
    return response.data.items;
  },

  getPipeline: async (id: string): Promise<Pipeline> => {
    const response = await api.get(`/pipelines/${id}`);
    return response.data;
  },

  getPipelineStats: async (id: string): Promise<PipelineStats> => {
    const response = await api.get(`/pipelines/${id}/stats`);
    return response.data;
  },

  createPipeline: async (data: {
    name: string;
    stages: Omit<Stage, 'id'>[];
  }): Promise<Pipeline> => {
    const response = await api.post('/pipelines', data);
    return response.data;
  },

  updatePipeline: async (
    id: string,
    data: {
      name?: string;
      stages?: Stage[];
    }
  ): Promise<Pipeline> => {
    const response = await api.put(`/pipelines/${id}`, data);
    return response.data;
  },

  deletePipeline: async (id: string): Promise<void> => {
    await api.delete(`/pipelines/${id}`);
  },
};