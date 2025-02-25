// src/components/contacts/ContactForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contactsApi } from '@/lib/api/contacts';
import { tagsApi, Tag } from '@/lib/api/tags';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

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
    return <div className="animate-pulse p-4 h-96 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <ErrorAlert message={error} />}

      <div className="space-y-6">
        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {contactId ? 'Modifier le contact' : 'Nouveau contact'}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {contactId ? 'Modifiez les informations du contact' : 'Ajoutez un nouveau contact à votre CRM'}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Téléphone
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900">
                Entreprise
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
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
          <h2 className="text-base font-semibold leading-7 text-gray-900">Tags</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Sélectionnez les tags pour ce contact
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  formData.tagIds.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-6">
        <button
          type="button"
          onClick={() => router.push('/contacts')}
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