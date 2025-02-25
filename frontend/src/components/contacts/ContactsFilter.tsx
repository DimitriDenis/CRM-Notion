// src/components/contacts/ContactsFilter.tsx
'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Tag } from '@/lib/api/tags';

interface ContactsFilterProps {
  tags: Tag[];
  onFilter: (filters: { search: string; tagIds: string[] }) => void;
}

export function ContactsFilter({ tags, onFilter }: ContactsFilterProps) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const applyFilters = () => {
    onFilter({
      search,
      tagIds: selectedTags,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Rechercher un contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500"
          onClick={applyFilters}
        >
          Rechercher
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag.id)}
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                selectedTags.includes(tag.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}