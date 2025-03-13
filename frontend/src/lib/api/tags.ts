// src/lib/api/tags.ts
import api from './axios';

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export const tagsApi = {
  getTags: async (): Promise<Tag[]> => {
    const response = await api.get('/tags');
    return response.data.items;
  },

  getTag: async (id: string): Promise<Tag> => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  createTag: async (data: { name: string; color: string }): Promise<Tag> => {
    const response = await api.post('/tags', data);
    return response.data;
  },

  updateTag: async (id: string, data: { name: string; color: string }): Promise<Tag> => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data;
  },

  deleteTag: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};