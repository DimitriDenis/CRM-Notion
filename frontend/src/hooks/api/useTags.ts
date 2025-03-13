// src/hooks/api/useTags.ts
'use client';

import { useState, useEffect } from 'react';
import { tagsApi, Tag } from '@/lib/api/tags';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const data = await tagsApi.getTags();
      setTags(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Une erreur est survenue lors du chargement des tags');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const createTag = async (data: { name: string; color: string }) => {
    try {
      const newTag = await tagsApi.createTag(data);
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (err) {
      console.error('Error creating tag:', err);
      setError('Une erreur est survenue lors de la création du tag');
      throw err;
    }
  };

  const updateTag = async (id: string, data: { name: string; color: string }) => {
    try {
      const updatedTag = await tagsApi.updateTag(id, data);
      setTags(prev => prev.map(tag => (tag.id === id ? updatedTag : tag)));
      return updatedTag;
    } catch (err) {
      console.error('Error updating tag:', err);
      setError('Une erreur est survenue lors de la mise à jour du tag');
      throw err;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      await tagsApi.deleteTag(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
    } catch (err) {
      console.error('Error deleting tag:', err);
      setError('Une erreur est survenue lors de la suppression du tag');
      throw err;
    }
  };

  return {
    tags,
    isLoading,
    error,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
}