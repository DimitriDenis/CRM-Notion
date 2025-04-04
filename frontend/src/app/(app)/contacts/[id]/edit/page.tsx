// src/app/(app)/contacts/[id]/edit/page.tsx
import { ContactForm } from '@/components/contacts/ContactForm';

interface EditContactPageProps {
  params: {
    id: string;
  };
}

export default async function EditContactPage(props: EditContactPageProps) {
  // Attendre explicitement que les paramètres soient résolus
  const params = await props.params;
  const contactId = params.id;
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Modifier le Contact</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <ContactForm contactId={contactId} />
      </div>
    </div>
  );
}