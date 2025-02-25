// src/app/(app)/contacts/new/page.tsx
'use client';
import React from 'react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NewContactPage() {
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <Link 
          href="/contacts" 
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Retour à la liste des contacts
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-xl font-medium text-gray-900">Nouveau Contact</h1>
          <p className="mt-1 text-sm text-gray-500">
            Ajoutez un nouveau contact à votre CRM
          </p>
        </div>
        
        <div className="px-6 py-5">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}