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
};