// src/lib/api/pipelines.ts
import api from './axios';

export interface Stage {
  id?: string;
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

// Interface pour les options de pagination
export interface PaginationOptions {
  skip?: number;
  take?: number;
}

export const pipelinesApi = {
  getPipelines: async (options: PaginationOptions = {}): Promise<Pipeline[]> => {
    try {
      // Construire l'URL avec les paramètres de pagination
      let url = '/pipelines';
      
      // Ajouter les paramètres de pagination s'ils sont définis
      const params = new URLSearchParams();
      if (options.skip !== undefined) params.append('skip', options.skip.toString());
      if (options.take !== undefined) params.append('take', options.take.toString());
      
      // Ajouter les paramètres à l'URL si nécessaire
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await api.get(url);
      return response.data.items || response.data;
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      throw error;
    }
  },

  getPipeline: async (id: string): Promise<Pipeline> => {
    try {
      if (!id) throw new Error('Pipeline ID is required');
      
      const response = await api.get(`/pipelines/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pipeline ${id}:`, error);
      throw error;
    }
  },

  getPipelineStats: async (id: string): Promise<PipelineStats> => {
    try {
      if (!id) throw new Error('Pipeline ID is required');
      
      const response = await api.get(`/pipelines/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pipeline stats for ${id}:`, error);
      throw error;
    }
  },

  createPipeline: async (data: {
    name: string;
    stages: Omit<Stage, 'id'>[];
  }): Promise<Pipeline> => {
    try {
      const response = await api.post('/pipelines', data);
      return response.data;
    } catch (error) {
      console.error('Error creating pipeline:', error);
      throw error;
    }
  },

  updatePipeline: async (
    id: string,
    data: {
      name?: string;
      stages?: Stage[];
    }
  ): Promise<Pipeline> => {
    try {
      if (!id) throw new Error('Pipeline ID is required');
      
      const response = await api.put(`/pipelines/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating pipeline ${id}:`, error);
      throw error;
    }
  },

  deletePipeline: async (id: string): Promise<void> => {
    try {
      if (!id) throw new Error('Pipeline ID is required');
      
      await api.delete(`/pipelines/${id}`);
    } catch (error) {
      console.error(`Error deleting pipeline ${id}:`, error);
      throw error;
    }
  },
  
  // Obtenir un aperçu du pipeline (ajouté pour correspondre à votre endpoint backend)
  getPipelineOverview: async (): Promise<any> => {
    try {
      const response = await api.get('/pipelines/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline overview:', error);
      throw error;
    }
  },
};