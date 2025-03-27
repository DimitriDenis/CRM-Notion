// src/components/tags/TagModal.tsx
'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, TagIcon } from '@heroicons/react/24/outline';
import { TagForm } from './TagForm';
import { Tag } from '@/lib/api/tags';

interface TagModalProps {
  open: boolean;
  tag?: Tag;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string }) => void;
}

export function TagModal({ open, tag, onClose, onSubmit }: TagModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                      <TagIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    </div>
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                      {tag ? 'Modifier le tag' : 'Créer un nouveau tag'}
                    </Dialog.Title>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                    {tag 
                      ? "Modifiez les détails de ce tag pour mieux organiser vos contacts."
                      : "Les tags vous aident à organiser et filtrer facilement vos contacts et deals."}
                  </p>
                  
                  <div className="mt-4 bg-gray-50 dark:bg-gray-750/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                    <TagForm tag={tag} onSubmit={onSubmit} onCancel={onClose} />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}