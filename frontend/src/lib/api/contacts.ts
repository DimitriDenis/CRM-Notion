// src/lib/api/contacts.ts
import api from './axios';
import { Tag } from './tags';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  tags?: Tag[];
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
  search?: string;
  tagIds?: string[];
  skip?: number;
  take?: number;
}

export const contactsApi = {
  getContacts: async (filters: ContactFilters = {}): Promise<{ items: Contact[]; total: number }> => {
    const response = await api.get('/contacts', { params: filters });
    return response.data;
  },

  getContact: async (id: string): Promise<Contact> => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  createContact: async (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> => {
    const response = await api.post('/contacts', data);
    return response.data;
  },

  updateContact: async (id: string, data: Partial<Contact>): Promise<Contact> => {
    const response = await api.put(`/contacts/${id}`, data);
    return response.data;
  },

  deleteContact: async (id: string): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },
};