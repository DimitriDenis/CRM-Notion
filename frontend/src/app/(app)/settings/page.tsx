// src/app/(app)/settings/page.tsx
'use client';

import { useState } from 'react';
import { 
  Cog6ToothIcon, 
  BellIcon, 
  UserIcon, 
  KeyIcon, 
  DocumentTextIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const settingsSections = [
  { id: 'account', name: 'Compte utilisateur', icon: UserIcon },
  { id: 'integration', name: 'Intégration Notion', icon: CloudArrowUpIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
  { id: 'api', name: 'Clés API', icon: KeyIcon },
  { id: 'appearance', name: 'Apparence', icon: Cog6ToothIcon },
  { id: 'legal', name: 'Mentions légales', icon: DocumentTextIcon },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');

  return (
    <div className="space-y-6">
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <Cog6ToothIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Configurez votre espace de travail et vos préférences personnelles
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar des sections de paramètres */}
        <div className="w-full lg:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <nav className="p-2">
            <ul className="space-y-1">
              {settingsSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <section.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {section.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Panneau de contenu */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          {activeSection === 'account' && <AccountSettings />}
          {activeSection === 'integration' && <NotionIntegrationSettings />}
          {activeSection === 'notifications' && <NotificationSettings />}
          {activeSection === 'security' && <SecuritySettings />}
          {activeSection === 'api' && <ApiSettings />}
          {activeSection === 'appearance' && <AppearanceSettings />}
          {activeSection === 'legal' && <LegalSettings />}
        </div>
      </div>
    </div>
  );
}

// Composants pour chaque section
function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Informations du compte</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Mettez à jour vos informations personnelles.
        </p>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
          <div className="sm:col-span-3">
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prénom
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue="Jean"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="last-name"
                id="last-name"
                autoComplete="family-name"
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue="Dupont"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Adresse e-mail
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                defaultValue="jean.dupont@exemple.com"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function NotionIntegrationSettings() {
  const [connected, setConnected] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Intégration Notion</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérez votre connexion avec Notion et configurez les paramètres d'exportation.
        </p>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">État de la connexion</h3>
            <div className="mt-2 flex items-center">
              {connected ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Connecté
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300">
                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Déconnecté
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConnected(!connected)}
            className={`${
              connected 
                ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600' 
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
            } rounded-md px-3.5 py-1.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {connected ? 'Déconnecter' : 'Connecter à Notion'}
          </button>
        </div>
        
        {connected && (
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Workspace connecté</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">NotionCRM Workspace</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Autorisations</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center">
                  <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Lecture des pages et bases de données
                </li>
                <li className="flex items-center">
                  <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Création et modification de pages
                </li>
                <li className="flex items-center">
                  <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Gestion des bases de données
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">Paramètres d'exportation</h3>
        
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="default-export-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Format d'exportation par défaut
            </label>
            <select
              id="default-export-format"
              name="default-export-format"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              defaultValue="database"
            >
              <option value="database">Base de données</option>
              <option value="page">Page</option>
              <option value="list">Liste</option>
            </select>
          </div>
          
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="auto-sync"
                name="auto-sync"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="auto-sync" className="font-medium text-gray-700 dark:text-gray-300">
                Synchronisation automatique
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Synchronise automatiquement les données entre NotionCRM et Notion.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant simple pour les autres sections
function NotificationSettings() {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Paramètres de notification</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Configurez quand et comment vous souhaitez être notifié.
      </p>
      {/* Contenu à développer */}
    </div>
  );
}

function SecuritySettings() {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Paramètres de sécurité</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Gérez votre mot de passe et les paramètres de sécurité de votre compte.
      </p>
      {/* Contenu à développer */}
    </div>
  );
}

function ApiSettings() {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Clés API</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Gérez vos clés API pour intégrer d'autres services avec NotionCRM.
      </p>
      {/* Contenu à développer */}
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Paramètres d'apparence</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Personnalisez l'apparence de votre interface NotionCRM.
      </p>
      {/* Contenu à développer */}
    </div>
  );
}

function LegalSettings() {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Mentions légales</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Consultez les conditions d'utilisation et la politique de confidentialité.
      </p>
      {/* Contenu à développer */}
    </div>
  );
}