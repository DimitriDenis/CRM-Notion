// src/components/tags/TagForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { TagIcon } from '@heroicons/react/24/outline';
import { Tag } from '@/lib/api/tags';

const COLOR_PRESETS = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#84CC16', // lime
  '#10B981', // emerald
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#6B7280', // gray
];

interface TagFormProps {
  tag?: Tag;
  onSubmit: (data: { name: string; color: string }) => void;
  onCancel: () => void;
}

export function TagForm({ tag, onSubmit, onCancel }: TagFormProps) {
  const [name, setName] = useState(tag?.name || '');
  const [color, setColor] = useState(tag?.color || COLOR_PRESETS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ name, color });
    } catch (error) {
      console.error('Error submitting tag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Prévisualisation du tag */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <TagIcon className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {name || 'Nom du tag'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aperçu du tag
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nom
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Ex: Client VIP, Prospect, Partenaire..."
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Choisissez un nom court et descriptif pour ce tag.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Couleur</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`h-10 w-10 rounded-full transition-all ${
                color === preset ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-800 scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: preset }}
              onClick={() => setColor(preset)}
              title={`Couleur ${preset}`}
              aria-label={`Choisir la couleur ${preset}`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500 ${
            isSubmitting 
              ? 'bg-blue-400 dark:bg-blue-500/70 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {tag ? 'Mise à jour...' : 'Création...'}
            </>
          ) : (
            <>{tag ? 'Mettre à jour' : 'Créer le tag'}</>
          )}
        </button>
      </div>
    </form>
  );
}