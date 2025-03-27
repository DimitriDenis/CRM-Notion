// src/components/auth/AuthLayout.tsx

'use client';


import { ChartBarIcon, CubeTransparentIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';


const features = [
  {
    name: 'Gestion des contacts',
    description: 'Centralisez toutes les informations de vos clients et prospects.',
    icon: UserGroupIcon,
  },
  {
    name: 'Pipelines personnalisables',
    description: 'Créez des processus de vente adaptés à votre activité.',
    icon: CubeTransparentIcon,
  },
  {
    name: 'Suivi des deals',
    description: 'Suivez l évolution de vos opportunités commerciales.',
    icon: ChartBarIcon, 
  },
  {
    name: 'Intégration Notion native',
    description: 'Synchronisation bidirectionnelle avec vos bases Notion.',
    icon: DocumentTextIcon,
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative pt-12 pb-6 sm:pt-16 md:pt-20 lg:pt-24">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/90 dark:to-indigo-950/90"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
              <span className="block text-blue-600 dark:text-blue-400">NotionCRM</span>
              <span className="block text-3xl sm:text-4xl mt-2">Simplifiez votre relation client</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300"
            >
              Gérez vos contacts, deals et pipelines directement dans Notion.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 -mt-6">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
          {children}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            NotionCRM combine la simplicité de Notion avec les fonctionnalités essentielles d'un CRM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-xl overflow-hidden group hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-blue-600 dark:bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Comment ça fonctionne
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Un processus simple pour commencer à utiliser NotionCRM
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-10 md:space-y-0 md:space-x-10">
            <div className="text-center max-w-xs">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold mb-4">1</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Connectez-vous</h3>
              <p className="text-gray-600 dark:text-gray-300">Utilisez votre compte Notion pour vous connecter en un clic</p>
            </div>

            <div className="text-center max-w-xs">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold mb-4">2</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Configurez</h3>
              <p className="text-gray-600 dark:text-gray-300">Adaptez les pipelines et tags selon vos besoins</p>
            </div>

            <div className="text-center max-w-xs">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold mb-4">3</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Commencez</h3>
              <p className="text-gray-600 dark:text-gray-300">Gérez vos contacts et deals efficacement au même endroit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section à ajouter dans votre AuthLayout avant le footer */}
<div className="bg-gray-50 dark:bg-gray-800 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Une interface intuitive et élégante
      </h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Découvrez comment NotionCRM vous aide à visualiser et gérer efficacement votre processus commercial.
      </p>
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative rounded-2xl overflow-hidden shadow-xl mx-auto max-w-4xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:to-indigo-500/20 backdrop-blur-xl z-0"></div>
      
      {/* En-tête du faux navigateur */}
      <div className="relative z-10 bg-gray-100 dark:bg-gray-800 h-8 flex items-center px-4">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 bg-gray-200 dark:bg-gray-700 rounded-md h-5 w-64"></div>
      </div>
      
      {/* Contenu de l'aperçu */}
      <div className="relative z-10 p-2 bg-white dark:bg-gray-900">
        <img
          src="./dashboard.png"
          alt="NotionCRM Dashboard"
          className="rounded-md shadow-lg w-full"
        />
      </div>
      
      {/* Badges flottants qui soulignent les fonctionnalités clés */}
      <div className="absolute -top-5 -right-5 bg-white dark:bg-gray-800 rounded-full shadow-lg px-3 py-1.5 flex items-center z-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-semibold text-gray-800 dark:text-white">100% gratuit</span>
      </div>
      
      <div className="absolute top-1/4 -left-4 bg-white dark:bg-gray-800 rounded-full shadow-lg px-3 py-1.5 flex items-center z-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
        <span className="text-sm font-semibold text-gray-800 dark:text-white">Vue intuitive</span>
      </div>
      
      <div className="absolute bottom-1/4 -right-4 bg-white dark:bg-gray-800 rounded-full shadow-lg px-3 py-1.5 flex items-center z-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-semibold text-gray-800 dark:text-white">Analyses détaillées</span>
      </div>
    </motion.div>
    
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      <div className="bg-white dark:bg-gray-750 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="h-12 w-12 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Interface claire</h3>
        <p className="text-gray-600 dark:text-gray-300">Visualisez en un coup d'œil l'état de vos deals et la progression de vos pipelines.</p>
      </div>
      
      <div className="bg-white dark:bg-gray-750 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="h-12 w-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Notes contextuelles</h3>
        <p className="text-gray-600 dark:text-gray-300">Gardez vos informations importantes à portée de main dans chaque fiche client et deal.</p>
      </div>
      
      <div className="bg-white dark:bg-gray-750 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="h-12 w-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Synchronisation Notion</h3>
        <p className="text-gray-600 dark:text-gray-300">Toutes vos données sont automatiquement synchronisées avec vos bases Notion existantes.</p>
      </div>
    </div>
  </div>
</div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">NotionCRM</span>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} NotionCRM. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}