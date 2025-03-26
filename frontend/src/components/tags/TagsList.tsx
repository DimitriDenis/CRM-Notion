// src/components/tags/TagsList.tsx
'use client';

import { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Tag } from '@/lib/api/tags';

interface TagsListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export function TagsList({ tags, onEdit, onDelete, viewMode = 'grid' }: TagsListProps) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  // Fonction pour générer un texte de placeholder pour les contacts
  const getRandomCount = (tagName: string) => {
    // Crée un nombre déterministe basé sur le nom du tag
    const sum = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (sum % 15) + 1; // Entre 1 et 15 contacts
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Couleur
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nom
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Créé le
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contacts
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tags.map((tag) => (
              <tr 
                key={tag.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onMouseEnter={() => setHoveredTag(tag.id)}
                onMouseLeave={() => setHoveredTag(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div 
                    className="h-5 w-5 rounded-full" 
                    style={{ backgroundColor: tag.color || '#9CA3AF' }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {tag.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(tag.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <UserGroupIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span>{getRandomCount(tag.name)} contacts</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onEdit(tag)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span className="sr-only">Modifier</span>
                    </button>
                    <button
                      onClick={() => onDelete(tag.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="sr-only">Supprimer</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Vue en grille (défaut)
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-5"
          onMouseEnter={() => setHoveredTag(tag.id)}
          onMouseLeave={() => setHoveredTag(null)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div
                className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: tag.color || '#9CA3AF' }}
              >
                <TagIcon className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{tag.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Créé le {new Date(tag.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => onEdit(tag)}
                className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <PencilIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(tag.id)}
                className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <TrashIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          
        </div>
      ))}
    </div>
  );
}