// src/app/(app)/contacts/new/page.tsx
import { ContactForm } from '@/components/contacts/ContactForm';

export default function NewContactPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Nouveau Contact</h1>
      <ContactForm />
    </div>
  );
}