// src/hooks/api/useContacts.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { contactsApi, Contact, ContactFilters } from '@/lib/api/contacts';
import { tagsApi, Tag } from '@/lib/api/tags';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [filters, setFilters] = useState<ContactFilters>({
    skip: 0,
    take: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { items, total } = await contactsApi.getContacts(filters);
      setContacts(items);
      setTotalContacts(total);
      setError(null);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Une erreur est survenue lors du chargement des contacts');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchTags = useCallback(async () => {
    try {
      const tagsData = await tagsApi.getTags();
      setTags(tagsData);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const deleteContact = async (id: string) => {
    try {
      await contactsApi.deleteContact(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      setTotalContacts(prev => prev - 1);
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Une erreur est survenue lors de la suppression du contact');
    }
  };

  const applyFilters = (newFilters: Partial<ContactFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      skip: 0, // Reset pagination when applying new filters
    }));
  };

  return {
    contacts,
    tags,
    totalContacts,
    isLoading,
    error,
    filters,
    applyFilters,
    deleteContact,
    refetch: fetchContacts,
  };
}