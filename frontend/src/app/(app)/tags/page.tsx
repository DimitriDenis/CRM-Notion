// src/app/(app)/tags/page.tsx
'use client';

import { useState } from 'react';
import { 
  PlusIcon, 
  TagIcon, 
  InformationCircleIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { TagsList } from '@/components/tags/TagsList';
import { TagModal } from '@/components/tags/TagModal';
import { useTags } from '@/hooks/api/useTags';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Tag } from '@/lib/api/tags';

export default function TagsPage() {
  const { tags, isLoading, error, createTag, updateTag, deleteTag, refetch } = useTags();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInfo, setShowInfo] = useState(true);

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
    <div className="space-y-6">
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-white/60 rounded-lg">
              <TagIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
              <p className="mt-1 text-sm text-gray-600">
                {isLoading
                  ? 'Chargement des tags...'
                  : `${tags.length} tag${tags.length !== 1 ? 's' : ''} pour organiser vos contacts`}
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <div className="border border-gray-200 rounded-md p-1 flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="Vue en grille"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="Vue en liste"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Nouveau tag
            </button>
          </div>
        </div>
      </div>

      {/* Section d'information */}
      {showInfo && (
        <div className="bg-white border border-blue-100 rounded-lg p-4 flex items-start space-x-4">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">Utilisation des tags</h3>
            <p className="mt-1 text-sm text-gray-500">
              Les tags vous permettent de catégoriser et filtrer vos contacts selon différents critères. 
              Utilisez-les pour identifier rapidement des segments comme les clients VIP, les prospects 
              chauds, ou les partenaires stratégiques.
            </p>
          </div>
          <button 
            onClick={() => setShowInfo(false)} 
            className="flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Fermer</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      )}

      {/* Contenu principal */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <TagIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun tag trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer des tags pour catégoriser vos contacts et faciliter leur gestion.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Créer mon premier tag
            </button>
          </div>
        </div>
      ) : (
        <TagsList 
          tags={tags} 
          onEdit={handleOpenEditModal} 
          onDelete={handleDelete} 
          viewMode={viewMode}
        />
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