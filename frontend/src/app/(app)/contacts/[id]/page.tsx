// src/app/(app)/contacts/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingOfficeIcon, 
  PencilIcon, 
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { contactsApi, Contact } from '@/lib/api/contacts';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface ContactDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ContactDetailsPage({ params }: ContactDetailsPageProps) {
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const data = await contactsApi.getContact(params.id);
        setContact(data);
      } catch (err) {
        
        setError('Erreur lors du chargement du contact');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      return;
    }

    try {
      await contactsApi.deleteContact(params.id);
      router.push('/contacts');
    } catch (err) {
      
      setError('Erreur lors de la suppression du contact');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse p-4 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!contact) {
    return <div className="text-gray-900 dark:text-white">Contact introuvable</div>;
  }

  return (
    <div className="space-y-8">
      {/* Bouton retour à la liste */}
      <div>
        <Link
          href="/contacts"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Retour à la liste
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {contact.firstName} {contact.lastName}
        </h1>
        <div className="flex gap-2">
          <Link
            href={`/contacts/${contact.id}/edit`}
            className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-inset ring-blue-300 dark:ring-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 shadow-sm ring-1 ring-inset ring-red-300 dark:ring-red-700/50 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <TrashIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Supprimer
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                Informations de contact
              </h3>
              <dl className="mt-4 space-y-4">
                <div className="flex items-center">
                  <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                    Email
                  </dt>
                  <dd className="ml-4 text-sm text-gray-900 dark:text-white">
                    <a href={`mailto:${contact.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {contact.email}
                    </a>
                  </dd>
                </div>
                {contact.phone && (
                  <div className="flex items-center">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                      <PhoneIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                      Téléphone
                    </dt>
                    <dd className="ml-4 text-sm text-gray-900 dark:text-white">
                      <a href={`tel:${contact.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {contact.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {contact.company && (
                  <div className="flex items-center">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                      Entreprise
                    </dt>
                    <dd className="ml-4 text-sm text-gray-900 dark:text-white">{contact.company}</dd>
                  </div>
                )}
              </dl>
            </div>

            {contact.tags && contact.tags.length > 0 && (
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Tags</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-400/30"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {contact.notes && (
          <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Notes</h3>
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{contact.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}