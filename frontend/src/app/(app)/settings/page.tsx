// src/app/(app)/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Cog6ToothIcon, 
  BellIcon, 
  UserIcon, 
  KeyIcon, 
  DocumentTextIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  ScaleIcon,
  ChevronDownIcon,
  SunIcon,
  PaintBrushIcon,
  ComputerDesktopIcon,
  MoonIcon,
  CheckCircleIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { Disclosure, RadioGroup, Switch } from '@headlessui/react';

const settingsSections = [
  { id: 'account', name: 'Compte utilisateur', icon: UserIcon },
  { id: 'integration', name: 'Intégration Notion', icon: CloudArrowUpIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
  { id: 'api', name: 'Clés API', icon: KeyIcon },
  { id: 'appearance', name: 'Apparence', icon: Cog6ToothIcon },
  { id: 'legal', name: 'Mentions légales', icon: DocumentTextIcon },
];

// Types pour les personnalisations
interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  sidebarCompact: boolean;
  enableAnimations: boolean;
  fontSize: 'small' | 'default' | 'large';
  borderRadius: 'none' | 'small' | 'default' | 'large';
  denseMode: boolean;
}

// Couleurs primaires disponibles
const colorOptions = [
  { name: 'Bleu (Défaut)', value: 'blue', class: 'bg-blue-600' },
  { name: 'Indigo', value: 'indigo', class: 'bg-indigo-600' },
  { name: 'Violet', value: 'purple', class: 'bg-purple-600' },
  { name: 'Rose', value: 'pink', class: 'bg-pink-600' },
  { name: 'Rouge', value: 'red', class: 'bg-red-600' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-600' },
  { name: 'Ambre', value: 'amber', class: 'bg-amber-500' },
  { name: 'Vert', value: 'green', class: 'bg-green-600' },
  { name: 'Émeraude', value: 'emerald', class: 'bg-emerald-600' },
  { name: 'Cyan', value: 'cyan', class: 'bg-cyan-600' }
];

// Options de taille de police
const fontSizeOptions = [
  { name: 'Petite', value: 'small', description: '14px - Compact' },
  { name: 'Moyenne', value: 'default', description: '16px - Recommandé' },
  { name: 'Grande', value: 'large', description: '18px - Accessibilité' },
];

// Options de rayon des bordures
const borderRadiusOptions = [
  { name: 'Aucun', value: 'none', description: 'Coins carrés' },
  { name: 'Petit', value: 'small', description: '4px - Subtil' },
  { name: 'Moyen', value: 'default', description: '8px - Recommandé' },
  { name: 'Grand', value: 'large', description: '12px - Arrondi' },
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
  // État des paramètres d'apparence avec valeurs par défaut
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: 'system',
    primaryColor: 'blue',
    sidebarCompact: false,
    enableAnimations: true,
    fontSize: 'default',
    borderRadius: 'default',
    denseMode: false,
  });

  // État pour indiquer si les paramètres ont été modifiés
  const [hasChanges, setHasChanges] = useState(false);

  // Charge les paramètres sauvegardés au chargement du composant
  useEffect(() => {
    const savedSettings = localStorage.getItem('notionity-appearance');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres d\'apparence:', error);
      }
    }
  }, []);

  // Met à jour un paramètre spécifique
  const updateSetting = (key: keyof AppearanceSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // Applique les paramètres
  const applySettings = () => {
    // Sauvegarde les paramètres dans le localStorage
    localStorage.setItem('notionity-appearance', JSON.stringify(settings));

    // Applique le thème
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Mode système - utilise la préférence du système
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Applique la couleur primaire - nécessite une configuration CSS adaptée
    document.documentElement.dataset.primaryColor = settings.primaryColor;

    // Applique la taille de police
    document.documentElement.dataset.fontSize = settings.fontSize;

    // Applique le rayon des bordures
    document.documentElement.dataset.borderRadius = settings.borderRadius;

    // Applique le mode dense
    if (settings.denseMode) {
      document.documentElement.classList.add('dense-mode');
    } else {
      document.documentElement.classList.remove('dense-mode');
    }

    // Applique les animations
    if (!settings.enableAnimations) {
      document.documentElement.classList.add('disable-animations');
    } else {
      document.documentElement.classList.remove('disable-animations');
    }

    // Applique le mode compact pour la sidebar - via localStorage, à gérer dans le composant Sidebar
    localStorage.setItem('notionity-sidebar-compact', settings.sidebarCompact.toString());

    // Réinitialise l'état des modifications
    setHasChanges(false);

    // Notification de succès (à implémenter selon votre système de notification)
    alert("Les paramètres ont été appliqués avec succès.");
  };

 
  return (
    <div className="space-y-8 max-w-3xl">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
        <div className="flex items-center">
          <PaintBrushIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Paramètres d'apparence</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Personnalisez l'apparence de votre interface Notionity pour qu'elle corresponde à vos préférences.
            </p>
          </div>
        </div>
      </div>

      {/* Thème */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
            <SunIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Thème</h3>
        </div>

        <RadioGroup value={settings.theme} onChange={value => updateSetting('theme', value)} className="mt-2">
          <RadioGroup.Label className="sr-only">Sélectionnez un thème</RadioGroup.Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: 'light', icon: SunIcon, title: 'Clair', description: 'Mode lumineux' },
              { value: 'dark', icon: MoonIcon, title: 'Sombre', description: 'Mode sombre' },
              { value: 'system', icon: ComputerDesktopIcon, title: 'Système', description: 'Basé sur vos préférences' },
            ].map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option.value}
                className={({ active, checked }) =>
                  `${active ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                  ${checked ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}
                  relative flex cursor-pointer rounded-lg px-5 py-4 border shadow-sm focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${
                              checked ? 'text-blue-800 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            <div className="flex items-center">
                              <option.icon className={`h-5 w-5 mr-2 ${checked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                              {option.title}
                            </div>
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {option.description}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="flex-shrink-0 text-blue-600 dark:text-blue-400">
                          <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

    
     

      
     
      {/* Actions */}
      <div className="flex justify-between items-center py-4">
        <button
          type="button"
          onClick={applySettings}
          disabled={!hasChanges}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            hasChanges 
              ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer' 
              : 'bg-blue-400 dark:bg-blue-500/70 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800`}
        >
          Appliquer les modifications
        </button>
      </div>
    </div>
  );
}

function LegalSettings() {
  const [activeTab, setActiveTab] = useState('terms');
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mentions légales</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Consultez les conditions d'utilisation et la politique de confidentialité de Notionity.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('terms')}
            className={`${
              activeTab === 'terms'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Conditions d'utilisation
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`${
              activeTab === 'privacy'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Politique de confidentialité
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`${
              activeTab === 'company'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ScaleIcon className="h-5 w-5 mr-2" />
            Informations légales
          </button>
        </nav>
      </div>

      {/* Terms of Service */}
      {activeTab === 'terms' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conditions Générales d'Utilisation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium text-gray-900 dark:text-white">1. Introduction</p>
            <p>
              Bienvenue sur Notionity. Les présentes Conditions Générales d'Utilisation ("CGU") régissent votre utilisation de l'application Notionity 
              ("l'Application"), qui est un outil de gestion de la relation client (CRM) s'intégrant avec Notion. En utilisant notre Application, 
              vous acceptez d'être lié par ces CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre Application.
            </p>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>2. Description des services</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">
                      Notionity est un service de CRM qui s'intègre avec Notion pour vous permettre de gérer vos contacts, vos pipelines, 
                      vos deals et d'autres éléments liés à la gestion de la relation client. Nos services comprennent, sans s'y limiter :
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>La gestion des contacts et des entreprises</li>
                      <li>La gestion des pipelines de vente et des deals</li>
                      <li>L'organisation par tags et catégories</li>
                      <li>L'exportdes données vers Notion</li>
                      <li>Les tableaux de bords</li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>3. Comptes utilisateurs</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">Pour utiliser Notionity, vous devez créer un compte Notion. Vous êtes responsable de :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Maintenir la confidentialité de vos informations de connexion</li>
                      <li>Toutes les activités qui se produisent sous votre compte</li>
                      <li>Nous informer immédiatement de toute utilisation non autorisée de votre compte</li>
                    </ul>
                    <p className="mt-2">
                      Nous nous réservons le droit de suspendre ou de résilier votre compte si nous constatons une violation de ces CGU.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>4. Conditions d'utilisation</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">En utilisant Notionity, vous acceptez de :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Ne pas utiliser l'Application d'une manière qui pourrait endommager, désactiver ou surcharger nos services</li>
                      <li>Ne pas tenter d'accéder à des zones restreintes de l'Application</li>
                      <li>Ne pas utiliser l'Application pour stocker ou transmettre des virus ou d'autres codes malveillants</li>
                      <li>Ne pas violer les lois applicables, y compris les lois sur la protection des données</li>
                      <li>Ne pas utiliser l'Application pour stocker ou traiter des informations sensibles telles que des données médicales, des numéros de carte de crédit ou d'autres informations similaires sans notre autorisation écrite préalable</li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>5. Propriété intellectuelle</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">
                      Tous les droits de propriété intellectuelle relatifs à Notionity, y compris, mais sans s'y limiter, les droits d'auteur, 
                      les marques, les logos, les conceptions, les textes, les graphiques et le code source, sont la propriété exclusive de 
                      Notionity ou de ses concédants de licence.
                    </p>
                    <p>
                      L'utilisation de l'Application ne vous confère aucun droit de propriété intellectuelle sur nos services ou sur le contenu auquel vous accédez.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>6. Limitation de responsabilité</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">
                      Dans les limites autorisées par la loi, Notionity ne sera pas responsable des dommages directs, indirects, 
                      accessoires, spéciaux, consécutifs ou punitifs, y compris, mais sans s'y limiter, la perte de profits, 
                      de données, d'utilisation, de clientèle ou d'autres pertes intangibles, résultant de :
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Votre utilisation ou votre incapacité à utiliser l'Application</li>
                      <li>Toute modification, suspension ou interruption de l'Application</li>
                      <li>Tout accès non autorisé à vos transmissions ou données</li>
                      <li>Toute erreur, omission ou inexactitude dans l'Application</li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>7. Modifications des CGU</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p>
                      Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications entreront en vigueur dès leur 
                      publication sur notre site web ou notre Application. Votre utilisation continue de l'Application après la publication 
                      des modifications constitue votre acceptation des nouvelles conditions.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>8. Résiliation</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p>
                      Nous nous réservons le droit, à notre seule discrétion, de suspendre ou de résilier votre accès à l'Application 
                      pour quelque raison que ce soit, y compris, sans limitation, si nous pensons que vous avez violé ces CGU. 
                      Vous pouvez également résilier votre compte à tout moment en suivant les instructions sur notre site.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>9. Loi applicable</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p>
                      Ces CGU sont régies par les lois françaises. Tout litige découlant de ces CGU sera soumis à la compétence 
                      exclusive des tribunaux de Paris, France.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <p className="mt-6">
              Pour toute question concernant ces CGU, veuillez nous contacter à legal@notionity.com.
            </p>
          </div>
        </div>
      )}

      {/* Privacy Policy */}
      {activeTab === 'privacy' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Politique de Confidentialité</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium text-gray-900 dark:text-white">1. Introduction</p>
            <p>
              Chez Notionity, nous nous engageons à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, 
              utilisons, divulguons et protégeons vos informations personnelles lorsque vous utilisez notre application CRM Notionity. 
              En utilisant notre application, vous consentez aux pratiques décrites dans cette politique.
            </p>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>2. Informations que nous collectons</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">Nous collectons plusieurs types d'informations, notamment :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><span className="font-medium">Informations d'inscription</span> : Lorsque vous créez un compte, nous collectons votre nom, adresse e-mail, mot de passe et autres informations de profil.</li>
                      <li><span className="font-medium">Informations sur les contacts et les entreprises</span> : Les données que vous saisissez dans notre application concernant vos contacts professionnels et les entreprises.</li>
                      <li><span className="font-medium">Données d'utilisation</span> : Informations sur la façon dont vous utilisez notre application, telles que les fonctionnalités auxquelles vous accédez, les actions que vous effectuez et les horodatages associés.</li>
                      <li><span className="font-medium">Informations techniques</span> : Adresse IP, type d'appareil, navigateur, système d'exploitation et autres informations techniques.</li>
                      <li><span className="font-medium">Données issues de Notion</span> : Lorsque vous connectez votre compte Notion, nous accédons aux données pertinentes conformément aux autorisations que vous accordez.</li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>3. Comment nous utilisons vos informations</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">Nous utilisons vos informations pour :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Fournir, maintenir et améliorer notre application</li>
                      <li>Synchroniser les données avec votre compte Notion</li>
                      <li>Communiquer avec vous concernant votre compte, nos services et des mises à jour</li>
                      <li>Vous envoyer des informations techniques, de sécurité et administratives</li>
                      <li>Répondre à vos questions et demandes d'assistance</li>
                      <li>Analyser l'utilisation pour améliorer notre application et votre expérience</li>
                      <li>Détecter, prévenir et résoudre les problèmes techniques et de sécurité</li>
                      <li>Se conformer aux obligations légales</li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>4. Partage des informations</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">Nous pouvons partager vos informations dans les circonstances suivantes :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><span className="font-medium">Avec Notion</span> : Pour permettre l'intégration et la synchronisation des données</li>
                      <li><span className="font-medium">Avec nos fournisseurs de services</span> : Tiers qui nous aident à fournir nos services (hébergement, analyse, assistance client)</li>
                      <li><span className="font-medium">Pour se conformer à la loi</span> : Lorsque nous croyons de bonne foi que la divulgation est nécessaire pour respecter les lois applicables, les procédures légales ou les demandes gouvernementales</li>
                      <li><span className="font-medium">En cas de transfert d'entreprise</span> : Dans le cadre d'une fusion, acquisition, vente d'actifs ou toute autre transaction commerciale</li>
                      <li><span className="font-medium">Avec votre consentement</span> : Lorsque vous nous donnez votre autorisation explicite</li>
                    </ul>
                    <p className="mt-2">
                      Nous ne vendons pas vos informations personnelles à des tiers.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>5. Conservation des données</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p>
                      Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos services 
                      et respecter nos obligations légales. Si vous supprimez votre compte, nous supprimerons ou anonymiserons 
                      vos informations dans un délai raisonnable, sauf si la loi nous oblige à les conserver plus longtemps.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>6. Sécurité des données</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p>
                      Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger 
                      vos informations contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, la modification 
                      ou la destruction. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est 
                      totalement sécurisée, et nous ne pouvons garantir une sécurité absolue.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>7. Transferts internationaux</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p>
                      Vos informations peuvent être transférées et traitées dans des pays autres que celui où vous résidez. 
                      Ces pays peuvent avoir des lois différentes sur la protection des données. Si nous transférons vos informations 
                      en dehors de l'Espace économique européen ou de la Suisse, nous prendrons des mesures appropriées pour nous 
                      assurer que vos informations sont protégées conformément à cette politique de confidentialité.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>8. Vos droits</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">
                      Selon votre lieu de résidence, vous pouvez avoir certains droits concernant vos informations personnelles. Ces droits peuvent inclure :
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Le droit d'accéder à vos informations personnelles</li>
                      <li>Le droit de rectifier ou de mettre à jour vos informations</li>
                      <li>Le droit de supprimer vos informations (droit à l'oubli)</li>
                      <li>Le droit de limiter le traitement de vos informations</li>
                      <li>Le droit à la portabilité des données</li>
                      <li>Le droit de vous opposer au traitement</li>
                      <li>Le droit de retirer votre consentement</li>
                    </ul>
                    <p className="mt-2">
                      Pour exercer ces droits, veuillez nous contacter à privacy@notionity.com. Nous répondrons à votre demande dans les délais prévus par la loi applicable.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>9. Cookies et technologies similaires</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p className="mb-2">
                      Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser l'utilisation de notre application et personnaliser nos services. Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
                    </p>
                    <p>
                      Types de cookies que nous utilisons :
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><span className="font-medium">Cookies essentiels</span> : Nécessaires au fonctionnement de l'application</li>
                      <li><span className="font-medium">Cookies analytiques</span> : Nous aident à comprendre comment vous utilisez notre application</li>
                      <li><span className="font-medium">Cookies de préférences</span> : Permettent de mémoriser vos préférences et paramètres</li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span>10. Modification de la politique de confidentialité</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    <p>
                      Nous pouvons mettre à jour cette politique de confidentialité de temps à autre pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. Nous vous encourageons à consulter régulièrement cette politique. Si nous apportons des modifications importantes, nous vous en informerons par e-mail ou par une notification dans notre application.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <p className="mt-6">
              Pour toute question ou préoccupation concernant cette politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter à privacy@notionity.com.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}