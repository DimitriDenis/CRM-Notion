// src/components/landing/LandingPage.tsx
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon, 
  CheckCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  BoltIcon,
  DocumentTextIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Gestion des contacts',
    description: 'Centralisez toutes les informations de vos clients et prospects en un seul endroit.',
    icon: UserGroupIcon,
  },
  {
    name: 'Pipelines personnalisables',
    description: 'Créez et personnalisez des pipelines de vente adaptés à votre processus commercial.',
    icon: CubeTransparentIcon,
  },
  {
    name: 'Suivi des deals',
    description: 'Suivez l évolution de vos affaires et visualisez leur progression dans votre pipeline.',
    icon: ChartBarIcon, 
  },
  {
    name: 'Intégration Notion native',
    description: 'Synchronisation bidirectionnelle avec vos bases Notion pour une expérience fluide.',
    icon: DocumentTextIcon,
  },
];

const testimonials = [
  {
    content: "NotionCRM a transformé notre processus de vente. La synchronisation avec Notion est impeccable !",
    author: "Sophie Martin",
    role: "Responsable Commercial, Studio Design"
  },
  {
    content: "Simple, efficace et parfaitement intégré à Notion. Exactement ce dont notre startup avait besoin.",
    author: "Thomas Dubois",
    role: "CEO, TechStart"
  },
  {
    content: "Enfin un CRM que toute mon équipe a adopté sans résistance. L'intégration Notion fait toute la différence.",
    author: "Lucie Bernard",
    role: "Directrice des Ventes, GrowthAgency"
  }
];

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background with subtle grid pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/90 dark:to-indigo-950/90" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                <span className="block text-blue-600 dark:text-blue-400">Simplifiez votre</span>
                <span className="block">relation client avec Notion</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
                NotionCRM est un CRM simple et puissant qui s'intègre nativement à Notion pour une gestion fluide de vos contacts et opportunités commerciales.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                  Commencer gratuitement
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/help" 
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  En savoir plus
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 backdrop-blur-xl z-0"></div>
                <div className="relative z-10 p-2">
                  <Image
                    src="/dashboard-preview.png"
                    alt="NotionCRM Dashboard"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg"
                  />
                </div>
                <div className="absolute top-2 left-2 right-2 h-6 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center px-2">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-5 -right-5 bg-white dark:bg-gray-800 rounded-full shadow-lg px-3 py-1.5 flex items-center">
                <BoltIcon className="h-5 w-5 text-amber-500 mr-1" />
                <span className="text-sm font-semibold text-gray-800 dark:text-white">100% gratuit</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Tout ce dont vous avez besoin pour gérer vos clients
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              NotionCRM combine la simplicité de Notion avec les fonctionnalités essentielles d'un CRM moderne.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative p-6 bg-gray-50 dark:bg-gray-750 rounded-xl overflow-hidden group hover:shadow-md transition-shadow"
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
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-750">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Comment ça marche
            </h2>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Connectez-vous à votre compte', description: 'Accédez à NotionCRM avec vos identifiants ou créez un nouveau compte en quelques secondes.' },
              { step: '02', title: 'Importez ou créez vos contacts', description: 'Commencez à ajouter vos clients et prospects ou importez-les depuis une source existante.' },
              { step: '03', title: 'Personnalisez vos pipelines', description: 'Créez des pipelines qui correspondent parfaitement à votre processus de vente.' },
              { step: '04', title: 'Suivez vos opportunités', description: 'Gérez vos deals à travers les différentes étapes de votre pipeline et ne manquez aucune opportunité.' },
            ].map((item, index) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex ${index !== 3 ? 'pb-12' : ''} relative`}
              >
                {index !== 3 && (
                  <div className="absolute h-full left-6 top-6 border-l-2 border-gray-200 dark:border-gray-600"></div>
                )}
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold">
                  {item.step}
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Ce que nos utilisateurs disent
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-gray-50 dark:bg-gray-750 p-6 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                <div className="mb-4 text-gray-900 dark:text-white">
                  <svg className="h-8 w-8 text-blue-400" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.author.split(' ')[0][0]}{testimonial.author.split(' ')[1][0]}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Prêt à améliorer votre gestion commerciale ?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
            Commencez dès aujourd'hui avec NotionCRM et transformez votre façon de gérer vos relations clients.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 transition-colors"
            >
              Commencer maintenant
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">NotionCRM</span>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/help" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Aide
              </Link>
              <Link href="/legal" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Mentions légales
              </Link>
              <a href="mailto:contact@notioncrm.com" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} NotionCRM. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}