// src/components/deals/DealForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dealsApi, Deal } from '@/lib/api/deals';
import { pipelinesApi, Pipeline } from '@/lib/api/pipelines';
import { contactsApi, Contact } from '@/lib/api/contacts';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { CalendarIcon, UserPlusIcon } from '@heroicons/react/24/outline';

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
        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {dealId ? 'Modifier le deal' : 'Nouveau deal'}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {dealId
              ? 'Modifiez les informations du deal'
              : 'Créez un nouveau deal'}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="value" className="block text-sm font-medium leading-6 text-gray-900">
                Valeur (€)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="value"
                  id="value"
                  required
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="pipelineId" className="block text-sm font-medium leading-6 text-gray-900">
                Pipeline
              </label>
              <div className="mt-2">
                <select
                  id="pipelineId"
                  name="pipelineId"
                  required
                  value={formData.pipelineId}
                  onChange={handlePipelineChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
              <label htmlFor="stageId" className="block text-sm font-medium leading-6 text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Sélectionner une étape</option>
                  {selectedPipeline?.stages.map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                Statut
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="active">En cours</option>
                  <option value="won">Gagné</option>
                  <option value="lost">Perdu</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="expectedCloseDate" className="block text-sm font-medium leading-6 text-gray-900">
                Date de clôture prévue
              </label>
              <div className="mt-2 relative">
                <input
                  type="date"
                  name="expectedCloseDate"
                  id="expectedCloseDate"
                  value={formData.expectedCloseDate}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                Notes
              </label>
              <div className="mt-2">
                <textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Contacts</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Sélectionnez les contacts associés à ce deal
          </p>

          {contacts.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className={`relative flex items-center space-x-3 rounded-lg border ${
                    formData.contactIds.includes(contact.id)
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200'
                  } px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 hover:border-gray-300`}
                >
                  <div className={`flex-shrink-0 ${
                    formData.contactIds.includes(contact.id)
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                  } flex items-center justify-center h-10 w-10 rounded-full`}>
                    <span className={`text-sm font-medium ${
                      formData.contactIds.includes(contact.id)
                      ? 'text-white'
                      : 'text-gray-500'
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
                      <p className="text-sm font-medium text-gray-900">{contact.firstName} {contact.lastName}</p>
                      <p className="truncate text-sm text-gray-500">{contact.email}</p>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-4 p-4 bg-gray-50 rounded-lg">
              <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun contact</h3>
              <p className="mt-1 text-sm text-gray-500">
                Créez des contacts pour les associer à ce deal.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-x-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}