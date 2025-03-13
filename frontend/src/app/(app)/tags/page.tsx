// src/app/(app)/tags/page.tsx
'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TagsList } from '@/components/tags/TagsList';
import { TagModal } from '@/components/tags/TagModal';
import { useTags } from '@/hooks/api/useTags';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Tag } from '@/lib/api/tags';

export default function TagsPage() {
  const { tags, isLoading, error, createTag, updateTag, deleteTag, refetch } = useTags();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag | undefined>(undefined);

  const handleOpenCreateModal = () => {
    setCurrentTag(undefined);
    setModalOpen(true);
  };

  const handleOpenEditModal = (tag: Tag) => {
    setCurrentTag(tag);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTag(undefined);
  };

  const handleSubmit = async (data: { name: string; color: string }) => {
    try {
      if (currentTag) {
        await updateTag(currentTag.id, data);
      } else {
        await createTag(data);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving tag:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) {
      try {
        await deleteTag(id);
      } catch (err) {
        console.error('Error deleting tag:', err);
      }
    }
  };

  if (error) {
    return <ErrorAlert message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tags</h1>
          <p className="mt-2 text-sm text-gray-700">
            {isLoading
              ? 'Chargement des tags...'
              : `Total: ${tags.length} tag${tags.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Nouveau tag
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">Aucun tag trouvé</p>
          <p className="mt-1 text-sm text-gray-500">
            Créez des tags pour catégoriser vos contacts
          </p>
        </div>
      ) : (
        <TagsList tags={tags} onEdit={handleOpenEditModal} onDelete={handleDelete} />
      )}

      {modalOpen && (
        <TagModal
          open={modalOpen}
          tag={currentTag}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}