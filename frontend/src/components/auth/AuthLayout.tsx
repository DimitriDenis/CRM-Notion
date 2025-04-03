// src/components/auth/AuthLayout.tsx

'use client';


import { ChartBarIcon, CubeTransparentIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import dashboardImg from '../../../public/dashboard.png'
import logoImg from '../../../public/Notion_CRM-.png'


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
    description: 'Export de vos données possible vers Notion.',
    icon: DocumentTextIcon,
  },
];

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            i % 3 === 0 
              ? "bg-blue-400/20 " 
              : i % 3 === 1 
              ? "bg-indigo-400/20 "
              : "bg-purple-400/20 "
          }`}
          style={{
            width: `${Math.random() * 30 + 10}px`,
            height: `${Math.random() * 30 + 10}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25],
            y: [0, Math.random() * 50 - 25],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 5 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animation de fond avec des formes
const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200/30  rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0],
          opacity: [0.4, 0.5, 0.4]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      <motion.div 
        className="absolute -bottom-40 -left-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -10, 0],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
    </div>
  );
};

// Animation du bouton "pulse"
const PulseEffect = () => {
  return (
    <span className="absolute inset-0 rounded-md">
      <span className="absolute inset-0 rounded-md bg-blue-400 animate-ping opacity-20"></span>
    </span>
  );
};

export default function AuthLayout({ children }: { children: ReactNode }) {

  const [animatedFeature, setAnimatedFeature] = useState(0);

  // Rotation automatique de la fonctionnalité mise en évidence
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative">
       <BackgroundAnimation />
       <FloatingParticles />

      {/* Hero Section */}
      <div className="relative pt-12 pb-6 sm:pt-16 md:pt-20 lg:pt-24">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-indigo-50/90"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo + Titre */}
          <div className="flex flex-col items-center justify-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-3 rounded-xl shadow-lg mb-6"
            >
              <div className="h-16 w-16 relative">
                <img 
                  src={logoImg.src} 
                  alt="NotionCRM Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900  text-center"
            >
              <span className="block text-blue-600 ">Novum<span className="text-novum">CRM</span><span className="text-black text-2xl sm:text-3xl"> for Notion</span></span> 
              <span className="block text-3xl sm:text-4xl mt-2">Simplifiez votre relation client</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 max-w-xl mx-auto text-xl text-gray-600  text-center"
            >
              Gérez vos contacts, deals et pipelines directement gràce à ce CRM lié avec Notion.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 -mt-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white  py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-200  relative"
        >
          <div className="absolute -top-3 right-3 bg-blue-100  text-blue-700  px-3 py-1 rounded-full text-xs font-semibold">
            Gratuit
          </div>
          <div className="relative">
            {children}
          </div>
        </motion.div>
      </div>

        {/* Features Section with Animation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 ">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-gray-600 ">
            NovumCRM combine la simplicité de Notion avec les fonctionnalités essentielles d'un CRM.
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
              className={`relative p-6 bg-white  rounded-xl overflow-hidden group hover:shadow-md transition-shadow border border-gray-200  ${
                animatedFeature === index ? 'ring-2 ring-blue-500 ' : ''
              }`}
            >
              {animatedFeature === index && (
                <PulseEffect />
              )}
              <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-novum  transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100  text-blue-600 ">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 ">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-600 ">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

     {/* How it works */}
     <div className="bg-white  py-16 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30  rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            y: [-150, -140, -150],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 ">
              Comment ça fonctionne
            </h2>
            <p className="mt-4 text-gray-600 ">
              Un processus simple pour commencer à utiliser NotionCRM
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-10 md:space-y-0 md:space-x-10">
            {[
              { step: "1", title: "Connectez-vous", description: "Utilisez votre compte Notion pour vous connecter en un clic" },
              { step: "2", title: "Configurez", description: "Adaptez les pipelines et tags selon vos besoins" },
              { step: "3", title: "Commencez", description: "Gérez vos contacts et deals efficacement au même endroit" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center max-w-xs"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto bg-blue-100  rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mb-4"
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 10px rgba(59, 130, 246, 0.1)', '0 0 0 0 rgba(59, 130, 246, 0)'],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 1
                  }}
                >
                  {item.step}
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900  mb-2">{item.title}</h3>
                <p className="text-gray-600 ">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


      {/* Preview Section à ajouter dans votre AuthLayout avant le footer */}
<div className="bg-gray-50  py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 ">
        Une interface intuitive et élégante
      </h2>
      <p className="mt-4 text-lg text-gray-600  max-w-2xl mx-auto">
        Découvrez comment NovumCRM vous aide à visualiser et gérer efficacement votre processus commercial.
      </p>
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative rounded-2xl overflow-hidden shadow-xl mx-auto max-w-4xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10  backdrop-blur-xl z-0"></div>
      
      {/* En-tête du faux navigateur */}
      <div className="relative z-10 bg-gray-100 h-8 flex items-center px-4">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 bg-gray-200  rounded-md h-5 w-64"></div>
      </div>
      
      {/* Contenu de l'aperçu */}
      <div className="relative z-10 p-2 bg-white ">
        <img
          src={dashboardImg.src}
          alt="NotionCRM Dashboard"
          className="rounded-md shadow-lg w-full"
        />
      </div>
      
      {/* Badges flottants qui soulignent les fonctionnalités clés */}
      <div className="absolute -top-5 -right-5 bg-white  rounded-full shadow-lg px-3 py-1.5 flex items-center z-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-semibold text-gray-800 ">100% gratuit</span>
      </div>
      
      <div className="absolute top-1/4 -left-4 bg-white  rounded-full shadow-lg px-3 py-1.5 flex items-center z-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
        <span className="text-sm font-semibold text-gray-800 ">Vue intuitive</span>
      </div>
      
      <div className="absolute bottom-1/4 -right-4 bg-white  rounded-full shadow-lg px-3 py-1.5 flex items-center z-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-semibold text-gray-800 ">Analyses détaillées</span>
      </div>
    </motion.div>
    
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 ">
        <div className="h-12 w-12 mx-auto bg-indigo-100  rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900  mb-2">Interface claire</h3>
        <p className="text-gray-600 ">Visualisez en un coup d'œil l'état de vos deals et la progression de vos pipelines.</p>
      </div>
      
      <div className="bg-white  rounded-lg p-6 shadow-sm border border-gray-100 ">
        <div className="h-12 w-12 mx-auto bg-blue-100  rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900  mb-2">Notes contextuelles</h3>
        <p className="text-gray-600 ">Gardez vos informations importantes à portée de main dans chaque fiche client et deal.</p>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 ">
        <div className="h-12 w-12 mx-auto bg-green-100  rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900  mb-2">Export vers Notion</h3>
        <p className="text-gray-600 ">Toutes vos données peuvent etre transférés directement sur une page Notion.</p>
      </div>
    </div>
  </div>
</div>

      {/* Footer */}
      <footer className="bg-gray-50 0 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-white  flex items-center justify-center">
              <img 
                  src={logoImg.src} 
                  alt="NovumCRM Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">NovumCRM for Notion</span>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500 ">
              © {new Date().getFullYear()} NovumCRM. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}