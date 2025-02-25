// src/app/(app)/contacts/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/20/solid';
import { ContactsList } from '@/components/contacts/ContactsList';
import { ContactsFilter } from '@/components/contacts/ContactsFilter';
import { useContacts } from '@/hooks/api/useContacts';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

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

  if (error) {
    return <ErrorAlert message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <p className="mt-2 text-sm text-gray-700">
            {isLoading
              ? 'Chargement des contacts...'
              : `Total: ${totalContacts} contact${totalContacts !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/contacts/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Nouveau contact
          </Link>
        </div>
      </div>

      <ContactsFilter tags={tags} onFilter={applyFilters} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">Aucun contact trouvé</p>
        </div>
      ) : (
        <ContactsList contacts={contacts} onDelete={deleteContact} />
      )}
    </div>
  );
}