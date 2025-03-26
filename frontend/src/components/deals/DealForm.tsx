// src/components/deals/DealForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dealsApi, Deal } from '@/lib/api/deals';
import { pipelinesApi, Pipeline } from '@/lib/api/pipelines';
import { contactsApi, Contact } from '@/lib/api/contacts';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { CalendarIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DealFormProps {
  dealId?: string;
  initialPipelineId?: string | null; // Ajoutez ces props
  initialStageId?: string | null;
}

// Définir un type pour le statut du deal
type DealStatus = 'active' | 'won' | 'lost';

export function DealForm({ dealId, initialPipelineId, initialStageId }: DealFormProps) {
  const router = useRouter();
  

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    value: 0,
    pipelineId: initialPipelineId || '',
    stageId: initialStageId || '',
    status: 'active' as DealStatus,
    expectedCloseDate: '',
    contactIds: [] as string[],
    notes: '',
  });

  // Load pipelines
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const data = await pipelinesApi.getPipelinesNoParams();
        setPipelines(data);
        
        // Select initial pipeline
        if (initialPipelineId) {
          const pipeline = data.find(p => p.id === initialPipelineId);
          if (pipeline) {
            setSelectedPipeline(pipeline);
          }
        }
      } catch (err) {
        console.error('Error fetching pipelines:', err);
        setPipelines([]);
      }
    };
  
    fetchPipelines();
  }, [initialPipelineId]);

  // Load contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactsApi.getContacts();
        setContacts(data.items);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Erreur lors du chargement des contacts');
      }
    };

    fetchContacts();
  }, []);

  // Load deal data if editing
  useEffect(() => {
    if (!dealId) return;

    const fetchDeal = async () => {
      try {
        setIsLoading(true);
        const deal = await dealsApi.getDeal(dealId);
        
        setFormData({
          name: deal.name,
          value: deal.value,
          pipelineId: deal.pipelineId,
          stageId: deal.stageId,
          status: deal.status || 'active',
          expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : '',
          contactIds: deal.contacts?.map(c => c.id) || [],
          notes: deal.notes || '',
        });

        // Load pipeline for this deal
        const pipeline = await pipelinesApi.getPipeline(deal.pipelineId);
        setSelectedPipeline(pipeline);
      } catch (err) {
        console.error('Error fetching deal:', err);
        setError('Erreur lors du chargement du deal');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeal();
  }, [dealId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePipelineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pipelineId = e.target.value;
    const pipeline = pipelines.find(p => p.id === pipelineId);
    setSelectedPipeline(pipeline || null);
    
    setFormData(prev => ({
      ...prev,
      pipelineId,
      stageId: pipeline?.stages[0]?.id || '',
    }));
  };

  const handleContactToggle = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      contactIds: prev.contactIds.includes(contactId)
        ? prev.contactIds.filter(id => id !== contactId)
        : [...prev.contactIds, contactId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    setIsSaving(true);
    setError(null);

    try {
      if (dealId) {
        await dealsApi.updateDeal(dealId, formData);
      } else {
        await dealsApi.createDeal(formData);
      }
      
      // Navigate back to the pipeline board
      router.push(`/pipelines/${formData.pipelineId}/board`);
    } catch (err) {
      console.error('Error saving deal:', err);
      setError('Erreur lors de l\'enregistrement du deal');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse p-4 h-96 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <ErrorAlert message={error} />}
  
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
              {dealId ? 'Modifier le deal' : 'Nouveau deal'}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {dealId
                ? 'Modifiez les informations du deal'
                : 'Créez un nouveau deal et associez-le à un pipeline'}
            </p>
          </div>
  
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Nom du deal
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
                  placeholder="Ex: Application mobile pour ABC Corp"
                />
              </div>
            </div>
  
            <div className="sm:col-span-2">
              <label htmlFor="value" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Valeur (€)
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  name="value"
                  id="value"
                  required
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-2 pl-7 pr-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                />
              </div>
            </div>
  
            <div className="sm:col-span-3">
              <label htmlFor="pipelineId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Pipeline
              </label>
              <div className="mt-2">
                <select
                  id="pipelineId"
                  name="pipelineId"
                  required
                  value={formData.pipelineId}
                  onChange={handlePipelineChange}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
                >
                  <option value="">Sélectionner un pipeline</option>
                  {pipelines.map(pipeline => (
                    <option key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
  
            <div className="sm:col-span-3">
              <label htmlFor="stageId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Étape
              </label>
              <div className="mt-2">
                <select
                  id="stageId"
                  name="stageId"
                  required
                  value={formData.stageId}
                  onChange={handleChange}
                  disabled={!selectedPipeline}
                  className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                    !selectedPipeline ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : 'dark:bg-gray-700'
                  } ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6`}
                >
                  <option value="">Sélectionner une étape</option>
                  {selectedPipeline?.stages.map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
              {!selectedPipeline && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Sélectionnez d'abord un pipeline
                </p>
              )}
            </div>
  
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Statut
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
                >
                  <option value="active">En cours</option>
                  <option value="won">Gagné</option>
                  <option value="lost">Perdu</option>
                </select>
              </div>
            </div>
  
            <div className="sm:col-span-3">
              <label htmlFor="expectedCloseDate" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Date de clôture prévue
              </label>
              <div className="mt-2 relative">
                <input
                  type="date"
                  name="expectedCloseDate"
                  id="expectedCloseDate"
                  value={formData.expectedCloseDate}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
              </div>
            </div>
  
            <div className="col-span-full">
              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Notes
              </label>
              <div className="mt-2">
                <textarea
                  name="notes"
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Ajoutez des détails importants sur ce deal..."
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
  
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Contacts associés
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Sélectionnez les contacts associés à ce deal (cliquez pour sélectionner/désélectionner)
            </p>
          </div>
  
          {contacts.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className={`relative flex items-center space-x-3 rounded-lg border ${
                    formData.contactIds.includes(contact.id)
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  } px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 hover:border-gray-300 dark:hover:border-gray-600 transition-colors`}
                >
                  <div className={`flex-shrink-0 ${
                    formData.contactIds.includes(contact.id)
                    ? 'bg-blue-500 dark:bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                  } flex items-center justify-center h-10 w-10 rounded-full`}>
                    <span className={`text-sm font-medium ${
                      formData.contactIds.includes(contact.id)
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-300'
                    }`}>
                      {contact.firstName[0]}{contact.lastName[0]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => handleContactToggle(contact.id)}
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.firstName} {contact.lastName}</p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                    </button>
                  </div>
                  {formData.contactIds.includes(contact.id) && (
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 text-blue-500 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun contact</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Créez des contacts pour les associer à ce deal.
              </p>
              <div className="mt-6">
                <Link href="/contacts/new" className="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  <UserPlusIcon className="h-5 w-5 mr-2" />
                  Créer un contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-x-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Annuler
      </button>
      <button
        type="submit"
        disabled={isSaving}
        className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500 ${
          isSaving 
            ? 'bg-blue-400 dark:bg-blue-500/70 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600'
        }`}
      >
        {isSaving ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enregistrement...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Enregistrer
          </>
        )}
      </button>
    </div>
  </form>
);
}