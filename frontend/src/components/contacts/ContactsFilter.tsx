// src/components/contacts/ContactsFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Tag } from '@/lib/api/tags';

interface ContactsFilterProps {
  tags: Tag[];
  onFilter: (filters: { search: string; tagIds: string[] }) => void;
}

export function ContactsFilter({ tags, onFilter }: ContactsFilterProps) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Appliquer les filtres automatiquement quand les valeurs changent
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onFilter({
        search,
        tagIds: selectedTags,
      });
    }, 300); // Délai de 300ms pour éviter trop d'appels API

    return () => clearTimeout(debounceTimeout);
  }, [search, selectedTags, onFilter]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedTags([]);
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="block w-full rounded-md border-0 py-2.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
          placeholder="Rechercher par nom, email ou entreprise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Tags:</span>
              {selectedTags.map(tagId => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 group"
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none group-hover:bg-blue-200"
                    >
                      <span className="sr-only">Supprimer le tag {tag.name}</span>
                      <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                ) : null;
              })}
              
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Effacer tous les filtres
              </button>
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center text-sm font-medium ${
            showAdvancedFilters ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
          Filtres avancés
        </button>
      </div>

      {/* Tags (avancés) */}
      {showAdvancedFilters && tags.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Filtrer par tags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } transition-colors`}
              >
                {tag.name}
                {selectedTags.includes(tag.id) && (
                  <XMarkIcon className="ml-1 h-4 w-4" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}