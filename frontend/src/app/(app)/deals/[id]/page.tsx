// src/app/(app)/deals/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { dealsApi, Deal } from '@/lib/api/deals';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface DealDetailsPageProps {
  params: {
    id: string;
  };
}

export default function DealDetailsPage({ params }: DealDetailsPageProps) {
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setIsLoading(true);
        const data = await dealsApi.getDeal(params.id);
        setDeal(data);
      } catch (err) {
        console.error('Error fetching deal:', err);
        setError('Erreur lors du chargement du deal');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeal();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce deal ?')) {
      return;
    }

    try {
      await dealsApi.deleteDeal(params.id);
      router.push(`/pipelines/${deal?.pipelineId}/board`);
    } catch (err) {
      console.error('Error deleting deal:', err);
      setError('Erreur lors de la suppression du deal');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse p-4 h-96 bg-gray-100 rounded-lg"></div>;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!deal) {
    return <div>Deal introuvable</div>;
  }
  

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{deal.name}</h1>
        <div className="flex space-x-3">
          <Link
            href={`/deals/${deal.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50"
          >
            <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
          >
            <TrashIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Supprimer
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Détails du deal
              </h3>
              <dl className="mt-4 space-y-4">
                <div className="flex items-center">
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Valeur
                  </dt>
                  <dd className="ml-4 text-sm text-gray-900">
                    {deal.value.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </dd>
                </div>
                <div className="flex items-center">
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <TagIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Étape
                  </dt>
                  <dd className="ml-4 text-sm text-gray-900">
                    {deal.stage?.name || 'N/A'}
                  </dd>
                </div>
                {deal.expectedCloseDate && (
                  <div className="flex items-center">
                    <dt className="flex items-center text-sm font-medium text-gray-500">
                      <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                      Date de clôture prévue
                    </dt>
                    <dd className="ml-4 text-sm text-gray-900">
                      {new Date(deal.expectedCloseDate).toLocaleDateString()}
                    </dd>
                  </div>
                )}
                <div className="flex items-center">
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    Statut
                  </dt>
                  <dd className="ml-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        deal.status === 'won'
                          ? 'bg-green-100 text-green-800'
                          : deal.status === 'lost'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {deal.status === 'won'
                        ? 'Gagné'
                        : deal.status === 'lost'
                        ? 'Perdu'
                        : 'En cours'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {deal.contacts && deal.contacts.length > 0 && (
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">Contacts</h3>
                <ul className="mt-4 space-y-2">
                  {deal.contacts.map((contact) => (
                    <li key={contact.id}>
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="flex items-center p-2 rounded-md hover:bg-gray-50"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                          <span className="text-sm font-medium text-white">
                            {contact.firstName[0]}{contact.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {deal.notes && (
          <div className="border-t border-gray-100 px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">Notes</h3>
            <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">{deal.notes}</div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          href={`/pipelines/${deal.pipelineId}/board`}
          className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
        >
          ← Retour au tableau
        </Link>
      </div>
    </div>
  );
}