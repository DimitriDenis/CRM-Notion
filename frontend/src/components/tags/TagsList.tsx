// src/components/tags/TagsList.tsx
'use client';

import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Tag } from '@/lib/api/tags';

interface TagsListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
}

export function TagsList({ tags, onEdit, onDelete }: TagsListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
        >
          <div
            className="flex-shrink-0 rounded-full h-4 w-4"
            style={{ backgroundColor: tag.color || '#9CA3AF' }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{tag.name}</p>
            <p className="text-sm text-gray-500 truncate">
              {new Date(tag.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => onEdit(tag)}
              className="inline-flex items-center text-gray-400 hover:text-gray-500"
            >
              <PencilIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(tag.id)}
              className="inline-flex items-center text-gray-400 hover:text-red-500"
            >
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

