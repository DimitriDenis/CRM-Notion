// src/app/(app)/contacts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, ViewColumnsIcon, Bars3Icon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { ContactsList } from '@/components/contacts/ContactsList';
import { ContactsFilter } from '@/components/contacts/ContactsFilter';
import { useContacts } from '@/hooks/api/useContacts';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Button } from '@headlessui/react';
import ExportModal from '@/components/notion/ExportModal';

export default function ContactsPage() {
  const {
    contacts,
    tags,
    totalContacts,
    isLoading,
    error,
    applyFilters,
    deleteContact,
    refetch,
  } = useContacts();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  if (error) {
    return <ErrorAlert message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="bg-white dark:bg-gray-800 px-4 sm:px-6 py-4 sm:py-5 rounded-lg shadow-sm">
  {/* En-tête avec titre et compteur */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {isLoading
          ? 'Chargement des contacts...'
          : `Total: ${totalContacts} contact${totalContacts !== 1 ? 's' : ''}`}
      </p>
    </div>
    
    {/* Contrôles de vue et boutons d'action */}
    <div className="mt-4 sm:mt-0">
      {/* Disposition en grille pour une meilleure adaptation mobile */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
        {/* Boutons de changement de vue */}
        <div className="col-span-2 sm:col-auto flex justify-between sm:justify-start">
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-1 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title="Vue en grille"
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title="Vue en liste"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bouton Exporter */}
        <button
          type="button"
          onClick={() => setShowExportModal(true)}
          className="col-span-1 flex justify-center items-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          <DocumentArrowUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 sm:mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">Exporter vers Notion</span>
          <span className="sm:hidden">Exporter</span>
        </button>

        {/* Bouton Nouveau contact */}
        <Link
          href="/contacts/new"
          className="col-span-1 flex justify-center items-center rounded-md bg-blue-600 dark:bg-blue-700 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500"
        >
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-1.5" aria-hidden="true" />
          <span className="hidden sm:inline">Nouveau contact</span>
          <span className="sm:hidden">Nouveau</span>
        </Link>
      </div>
    </div>
  </div>
</div>

      {/* Section des filtres */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <ContactsFilter tags={tags} onFilter={applyFilters} />
      </div>

      {/* Liste des contacts */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm min-h-[400px]">
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9h2m4 0h2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Aucun contact trouvé</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez par créer un nouveau contact ou modifiez vos filtres.
            </p>
            <div className="mt-6">
              <Link
                href="/contacts/new"
                className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600"
              >
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Nouveau contact
              </Link>
            </div>
          </div>
        ) : (
          <ContactsList contacts={contacts} onDelete={deleteContact} viewMode={viewMode} />
        )}
      </div>
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          entityType="contacts"
          selectedIds={selectedContacts}
          entityName="Contacts"
        />
      )}
    </div>
  );
}