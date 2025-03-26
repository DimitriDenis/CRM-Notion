// src/components/contacts/ContactForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contactsApi } from '@/lib/api/contacts';
import { tagsApi, Tag } from '@/lib/api/tags';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { BuildingOfficeIcon, DocumentTextIcon, EnvelopeIcon, PhoneIcon, TagIcon, UserIcon } from '@heroicons/react/24/outline';

interface ContactFormProps {
  contactId?: string;
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
    tagIds?: string[];
  };
}

export function ContactForm({ contactId, initialData }: ContactFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    tagIds: [] as string[],
  });

  // Load tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await tagsApi.getTags();
        setTags(tagsData);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Erreur lors du chargement des tags');
      }
    };

    fetchTags();
  }, []);

  // Load contact data if editing
  useEffect(() => {
    if (!contactId) {
      if (initialData) {
        setFormData({
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          company: initialData.company || '',
          notes: initialData.notes || '',
          tagIds: initialData.tagIds || [],
        });
      }
      return;
    }

    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const contact = await contactsApi.getContact(contactId);
        setFormData({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone || '',
          company: contact.company || '',
          notes: contact.notes || '',
          tagIds: contact.tags?.map(tag => tag.id) || [],
        });
      } catch (err) {
        console.error('Error fetching contact:', err);
        setError('Erreur lors du chargement du contact');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [contactId, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (contactId) {
        await contactsApi.updateContact(contactId, formData);
      } else {
        await contactsApi.createContact(formData);
      }
      router.push('/contacts');
    } catch (err) {
      console.error('Error saving contact:', err);
      setError('Erreur lors de l\'enregistrement du contact');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse p-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8">
      {error && <ErrorAlert message={error} />}

      <div className="bg-blue-50 dark:bg-blue-900/20 -mx-8 -mt-8 px-8 py-6 mb-8 border-b border-blue-100 dark:border-blue-900/30">
        <h2 className="text-xl font-semibold leading-7 text-blue-800 dark:text-blue-300">
          {contactId ? 'Modifier le contact' : 'Informations du contact'}
        </h2>
        <p className="mt-1 text-sm leading-6 text-blue-600 dark:text-blue-400">
          {contactId ? 'Modifiez les informations du contact' : 'Ajoutez un nouveau contact à votre CRM'}
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label htmlFor="firstName" className="flex items-center text-sm font-medium leading-6 text-gray-900 dark:text-white">
              <UserIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Prénom
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm"
                placeholder="Jean"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="lastName" className="flex items-center text-sm font-medium leading-6 text-gray-900 dark:text-white">
              <UserIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Nom
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="flex items-center text-sm font-medium leading-6 text-gray-900 dark:text-white">
              <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm"
                placeholder="jean.dupont@exemple.com"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="phone" className="flex items-center text-sm font-medium leading-6 text-gray-900 dark:text-white">
              <PhoneIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Téléphone
            </label>
            <div className="mt-2">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="company" className="flex items-center text-sm font-medium leading-6 text-gray-900 dark:text-white">
              <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Entreprise
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm"
                placeholder="Société ABC"
              />
            </div>
          </div>

          <div className="col-span-2">
            <label htmlFor="notes" className="flex items-center text-sm font-medium leading-6 text-gray-900 dark:text-white">
              <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Notes
            </label>
            <div className="mt-2">
              <textarea
                name="notes"
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm"
                placeholder="Ajouter des notes concernant ce contact..."
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <label className="flex items-center text-sm font-medium leading-6 text-gray-900 dark:text-white">
            <TagIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            Tags
          </label>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Sélectionnez les tags pour ce contact
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    formData.tagIds.includes(tag.id)
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {tag.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Aucun tag disponible</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-x-4">
        <button
          type="button"
          onClick={() => router.push('/contacts')}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-blue-600 dark:bg-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 dark:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-500 transition-colors disabled:opacity-70"
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </span>
          ) : (
            'Enregistrer le contact'
          )}
        </button>
      </div>
    </form>
  );
}