// src/components/contacts/ContactsList.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, PhoneIcon, EllipsisVerticalIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Contact } from '@/lib/api/contacts';

interface ContactsListProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

// Composant de menu adaptatif qui s'ajuste en fonction de sa position
const AdaptiveMenu = ({ contact, onDelete, index, totalContacts }: { 
  contact: Contact, 
  onDelete: (id: string) => void,
  index: number,
  totalContacts: number
}) => {
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Détermine si le menu doit s'ouvrir vers le haut ou vers le bas
  useEffect(() => {
    const updateMenuPosition = () => {
      if (!menuButtonRef.current) return;
      
      // Si c'est dans les deux premiers éléments, positionner vers le bas
      // sinon, positionner vers le haut
      if (index < 2) {
        setMenuPosition('bottom');
      } else {
        setMenuPosition('top');
      }
    };

    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    return () => window.removeEventListener('resize', updateMenuPosition);
  }, [index, totalContacts]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button 
          ref={menuButtonRef}
          className="flex items-center rounded-full p-1 bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
        >
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
        <Menu.Items 
          className={`absolute ${
            menuPosition === 'top' 
              ? 'bottom-full right-0 mb-1 origin-bottom-right' 
              : 'top-full right-0 mt-1 origin-top-right'
          } z-50 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/contacts/${contact.id}`}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
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
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
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
                    active ? 'bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400' : 'text-red-500 dark:text-red-400'
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
  );
};

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
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Nom</th>
                <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Entreprise</th>
                <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Téléphone</th>
                <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Tags</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {contacts.map((contact, index) => (
                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* Colonne Nom - toujours visible */}
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-full ${getAvatarColor(contact.firstName, contact.lastName)} flex items-center justify-center text-white font-medium text-xs sm:text-sm`}>
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <Link href={`/contacts/${contact.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-sm sm:text-base">
                          {contact.firstName} {contact.lastName}
                        </Link>
                        {/* Information conditionnelle sur mobile */}
                        <div className="flex flex-col sm:hidden text-xs mt-1">
                          {contact.company && (
                            <span className="text-gray-500 dark:text-gray-400">
                              {contact.company}
                            </span>
                          )}
                          {contact.email && (
                            <a href={`mailto:${contact.email}`} className="text-blue-600 dark:text-blue-400 truncate max-w-[150px]">
                              {contact.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Colonne Entreprise - visible à partir de sm */}
                  <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {contact.company || '—'}
                  </td>
                  
                  {/* Colonne Email - visible à partir de md */}
                  <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm">
                    {contact.email ? (
                      <a href={`mailto:${contact.email}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                        {contact.email}
                      </a>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">—</span>
                    )}
                  </td>
                  
                  {/* Colonne Téléphone - visible à partir de lg */}
                  <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm">
                    {contact.phone ? (
                      <a href={`tel:${contact.phone}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                        {contact.phone}
                      </a>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">—</span>
                    )}
                  </td>
                  
                  {/* Colonne Tags - visible à partir de lg */}
                  <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {contact.tags && contact.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <span key={tag.id} className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-400/30">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    ) : '—'}
                  </td>
                  
                  {/* Colonne Actions - toujours visible */}
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <AdaptiveMenu 
                      contact={contact} 
                      onDelete={onDelete} 
                      index={index} 
                      totalContacts={contacts.length}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Mode grille par défaut
  // Modifications à apporter uniquement à la partie "Mode grille" du composant ContactsList

// Mode grille par défaut
// Mode grille par défaut - avec corrections pour préserver le mode clair d'origine
return (
  <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {contacts.map((contact, index) => (
      <li key={contact.id} className="col-span-1 divide-y divide-gray-400 dark:divide-gray-600 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow hover:shadow-md dark:shadow-gray-900/30 dark:hover:shadow-gray-900/50 transition-all relative flex flex-col">
        <div className="flex w-full items-center justify-between space-x-6 p-6 flex-grow">
          <div className="flex-1 truncate">
            <Link href={`/contacts/${contact.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-base font-medium text-gray-900 dark:text-white">
                  {contact.firstName} {contact.lastName}
                </h3>
              </div>
            </Link>
            
            {contact.company && (
              <p className="mt-1 flex items-center truncate text-sm text-gray-500 dark:text-gray-300">
                <BuildingOfficeIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-400" />
                {contact.company}
              </p>
            )}
            
            {contact.tags && contact.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {contact.tags.map((tag) => (
                  <span 
                    key={tag.id} 
                    className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/50 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-400/40"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className={`h-12 w-12 rounded-full ${getAvatarColor(contact.firstName, contact.lastName)} flex items-center justify-center text-white text-sm font-medium dark:border-2 dark:border-gray-700`}>
              {contact.firstName[0]}{contact.lastName[0]}
            </div>
          </div>
        </div>
        
        <div className="flex divide-x divide-gray-200 dark:divide-gray-600 mt-auto">
          <div className="flex w-0 flex-1">
            <Link
              href={`mailto:${contact.email}`}
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-2 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 group dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" aria-hidden="true" />
              Email
            </Link>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            {contact.phone ? (
              <Link
                href={`tel:${contact.phone}`}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-2 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 group dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <PhoneIcon className="h-5 w-5 text-gray-400 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" aria-hidden="true" />
                Appeler
              </Link>
            ) : (
              <span className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-2 rounded-br-lg border border-transparent py-4 text-sm text-gray-400 dark:text-gray-500 dark:bg-gray-700/50">
                <PhoneIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                Pas de téléphone
              </span>
            )}
          </div>
        </div>
        
        <div className="absolute top-2 right-2">
          <AdaptiveMenu 
            contact={contact} 
            onDelete={onDelete} 
            index={index} 
            totalContacts={contacts.length}
          />
        </div>
      </li>
    ))}
  </ul>
);
}