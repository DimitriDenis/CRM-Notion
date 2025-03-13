// src/components/tags/TagForm.tsx
'use client';

import { useState, useEffect } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Nom du tag"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Couleur</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`h-8 w-8 rounded-full ${
                color === preset ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: preset }}
              onClick={() => setColor(preset)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {tag ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}