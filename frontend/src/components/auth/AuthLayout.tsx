// src/components/auth/AuthLayout.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

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