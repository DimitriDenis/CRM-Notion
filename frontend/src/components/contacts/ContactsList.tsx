// src/components/contacts/ContactsList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, PhoneIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';
import { Contact } from '@/lib/api/contacts';

interface ContactsListProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
}

export function ContactsList({ contacts, onDelete }: ContactsListProps) {
    return (
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <li key={contact.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow relative">
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  {contact.tags && contact.tags.length > 0 && (
                    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                      {contact.tags[0].name}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">{contact.company || 'N/A'}</p>
              </div>
              <div className="flex-shrink-0">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
                  {contact.firstName[0]}{contact.lastName[0]}
                </div>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <Link
                    href={`mailto:${contact.email}`}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    Email
                  </Link>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  {contact.phone ? (
                    <Link
                      href={`tel:${contact.phone}`}
                      className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                    >
                      <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      Appeler
                    </Link>
                  ) : (
                    <span className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm text-gray-400">
                      <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      Pas de téléphone
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center rounded-full p-1 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
                    <span className="sr-only">Options</span>
                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                </div>
  
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/contacts/${contact.id}/edit`}
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block px-4 py-2 text-sm`}
                          >
                            Modifier
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onDelete(contact.id)}
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block w-full text-left px-4 py-2 text-sm`}
                          >
                            Supprimer
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </li>
        ))}
      </ul>
    );
  }