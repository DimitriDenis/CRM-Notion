// src/app/(app)/contacts/[id]/edit/page.tsx
'use client';

import { ContactForm } from '@/components/contacts/ContactForm';

interface EditContactPageProps {
  params: {
    id: string;
  };
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Modifier le Contact</h1>
      <ContactForm contactId={params.id} />
    </div>
  );
}