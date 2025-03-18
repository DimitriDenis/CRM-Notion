// src/components/contacts/ContactsList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, PhoneIcon, EllipsisVerticalIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Contact } from '@/lib/api/contacts';

interface ContactsListProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export function ContactsList({ contacts, onDelete, viewMode = 'grid' }: ContactsListProps) {
  // Générer une couleur de fond basée sur le nom
  const getAvatarColor = (firstName: string, lastName: string) => {
    const colors = [
      'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 
      'bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-teal-500'
    ];
    
    // Utiliser la somme des codes de caractères pour déterminer l'index
    const name = `${firstName}${lastName}`;
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  if (viewMode === 'list') {
    return (
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nom</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Entreprise</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Téléphone</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tags</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 flex-shrink-0 rounded-full ${getAvatarColor(contact.firstName, contact.lastName)} flex items-center justify-center text-white font-medium`}>
                      {contact.firstName[0]}{contact.lastName[0]}
                    </div>
                    <div className="ml-4">
                      <Link href={`/contacts/${contact.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {contact.company || '—'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} className="text-gray-900 hover:text-blue-600">
                      {contact.email}
                    </a>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`} className="text-gray-900 hover:text-blue-600">
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {contact.tags && contact.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <span key={tag.id} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  ) : '—'}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="flex items-center rounded-full p-1 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
                      <span className="sr-only">Options</span>
                      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>

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
                                href={`/contacts/${contact.id}`}
                                className={`${
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } block px-4 py-2 text-sm`}
                              >
                                Voir
                              </Link>
                            )}
                          </Menu.Item>
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
                                  active ? 'bg-gray-100 text-red-600' : 'text-red-500'
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Mode grille par défaut
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <li key={contact.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition-shadow hover:shadow-md">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <Link href={`/contacts/${contact.id}`} className="hover:text-blue-600">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-base font-medium text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </h3>
                </div>
              </Link>
              
              {contact.company && (
                <p className="mt-1 flex items-center truncate text-sm text-gray-500">
                  <BuildingOfficeIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  {contact.company}
                </p>
              )}
              
              {contact.tags && contact.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {contact.tags.map((tag) => (
                    <span 
                      key={tag.id} 
                      className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <div className={`h-12 w-12 rounded-full ${getAvatarColor(contact.firstName, contact.lastName)} flex items-center justify-center text-white text-sm font-medium`}>
                {contact.firstName[0]}{contact.lastName[0]}
              </div>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <Link
                  href={`mailto:${contact.email}`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-2 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:text-blue-600 group"
                >
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600" aria-hidden="true" />
                  Email
                </Link>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                {contact.phone ? (
                  <Link
                    href={`tel:${contact.phone}`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-2 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:text-blue-600 group"
                  >
                    <PhoneIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600" aria-hidden="true" />
                    Appeler
                  </Link>
                ) : (
                  <span className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-2 rounded-br-lg border border-transparent py-4 text-sm text-gray-400">
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`/contacts/${contact.id}`}
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          Voir
                        </Link>
                      )}
                    </Menu.Item>
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
                            active ? 'bg-gray-100 text-red-600' : 'text-red-500'
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