// src/app/(app)/help/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PlayCircleIcon,
  LightBulbIcon,
  CursorArrowRaysIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Définir le type pour un élément FAQ
interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export default function HelpPage() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    setOpenFaqs(prevOpenFaqs => 
      prevOpenFaqs.includes(index)
        ? prevOpenFaqs.filter(i => i !== index)
        : [...prevOpenFaqs, index]
    );
  };

  // Données FAQ
  const faqs: FaqItem[] = [
    {
      question: "Qu'est-ce que NotionCRM ?",
      answer: (
        <div>
          <p>
            NotionCRM est un système de gestion de la relation client (CRM) intégré à Notion, conçu pour vous aider à gérer vos contacts, vos opportunités commerciales (deals) et vos processus de vente (pipelines).
          </p>
          <p className="mt-2">
            Grâce à la synchronisation avec Notion, toutes vos données sont accessibles et modifiables depuis les deux plateformes, ce qui vous offre une flexibilité maximale.
          </p>
        </div>
      )
    },
    {
      question: "Comment ajouter un nouveau contact ?",
      answer: (
        <div>
          <p>Pour ajouter un nouveau contact :</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Accédez à la section <strong>Contacts</strong> via le menu latéral</li>
            <li>Cliquez sur le bouton <strong>Nouveau contact</strong> en haut à droite</li>
            <li>Remplissez les informations requises dans le formulaire</li>
            <li>Cliquez sur <strong>Enregistrer</strong></li>
          </ol>
          <p className="mt-2">
            Vous pouvez également ajouter des tags à vos contacts pour les organiser plus efficacement.
          </p>
        </div>
      )
    },
    {
      question: "Comment créer un pipeline de vente ?",
      answer: (
        <div>
          <p>
            Un pipeline représente votre processus de vente, divisé en étapes (stages). Pour créer un pipeline :
          </p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Accédez à la section <strong>Pipelines</strong> via le menu latéral</li>
            <li>Cliquez sur <strong>Ajouter un pipeline</strong></li>
            <li>Donnez un nom à votre pipeline</li>
            <li>Ajoutez et organisez les différentes étapes de votre processus de vente</li>
            <li>Cliquez sur <strong>Enregistrer</strong></li>
          </ol>
          <p className="mt-2">
            Une fois votre pipeline créé, vous pourrez visualiser et gérer vos opportunités (deals) à travers les différentes étapes de votre processus de vente.
          </p>
        </div>
      )
    },
    {
      question: "Comment ajouter un deal à un pipeline ?",
      answer: (
        <div>
          <p>Pour ajouter un deal (opportunité commerciale) à un pipeline :</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Accédez à la section <strong>Deals</strong> ou ouvrez directement un pipeline</li>
            <li>Cliquez sur <strong>Nouveau deal</strong></li>
            <li>Remplissez les informations : nom, valeur, date de clôture prévue</li>
            <li>Sélectionnez le pipeline et l'étape appropriés</li>
            <li>Associez des contacts existants à ce deal si nécessaire</li>
            <li>Cliquez sur <strong>Enregistrer</strong></li>
          </ol>
          <p className="mt-2">
            Les deals peuvent être déplacés entre les différentes étapes d'un pipeline par glisser-déposer dans la vue tableau kanban.
          </p>
        </div>
      )
    },
    {
      question: "Comment voir mes statistiques de vente ?",
      answer: (
        <div>
          <p>
            Le tableau de bord (Dashboard) vous donne un aperçu de vos performances commerciales :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Nombre total de contacts et évolution</li>
            <li>Nombre de deals en cours</li>
            <li>Valeur totale de votre pipeline et évolution</li>
            <li>Tendances mensuelles pour suivre votre progression</li>
            <li>Vue d'ensemble de vos pipelines actifs</li>
          </ul>
          <p className="mt-2">
            Pour des analyses plus détaillées, consultez chaque pipeline individuellement pour voir la répartition par étape.
          </p>
        </div>
      )
    }
  ];


  return (
    <div className="max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 mb-8">
        <div className="flex items-start">
          <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
            <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Centre d'aide</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl">
              Bienvenue dans le centre d'aide de NotionCRM. Découvrez comment tirer le meilleur parti de notre outil pour gérer vos contacts, suivre vos opportunités commerciales et optimiser votre processus de vente.
            </p>
          </div>
        </div>
      </div>
  
      {/* Présentation de NotionCRM */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
          Présentation de NotionCRM
        </h2>
        
        <div className="prose prose-blue dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300">
            NotionCRM est un système de gestion de la relation client (CRM) intégré à Notion. Il vous permet de gérer efficacement vos contacts, de suivre vos opportunités commerciales et d'optimiser votre processus de vente.
          </p>
          
          <p className="text-gray-600 dark:text-gray-300">
            <strong className="text-gray-900 dark:text-white">Principales fonctionnalités :</strong>
          </p>
          
          <ul className="space-y-2">
            <li className="text-gray-600 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Gestion des contacts</strong> - Centralisez les informations de vos prospects et clients.
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Pipelines personnalisables</strong> - Créez des processus de vente adaptés à votre activité.
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Suivi des deals</strong> - Suivez la progression de vos opportunités commerciales.
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Tableau de bord</strong> - Visualisez vos performances et les tendances mensuelles.
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-white">Export vers Notion</strong> - Exportation des données vers Notion.
            </li>
          </ul>
          
          <p className="text-gray-600 dark:text-gray-300">
            Le tout est conçu pour être simple, intuitif et parfaitement intégré à l'écosystème Notion que vous utilisez déjà.
          </p>
        </div>
      </div>
  
      {/* Comment utiliser NotionCRM */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <CursorArrowRaysIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
          Comment utiliser NotionCRM
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
            <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-2">1. Gestion des contacts</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Créez et organisez votre base de contacts pour centraliser les informations de vos clients et prospects.
            </p>
            <Link 
              href="/contacts" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium inline-flex items-center"
            >
              Accéder aux contacts
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
            <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-2">2. Configuration des pipelines</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Créez des pipelines qui reflètent votre processus de vente avec des étapes personnalisées.
            </p>
            <Link 
              href="/pipelines" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium inline-flex items-center"
            >
              Gérer les pipelines
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
            <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-2">3. Gestion des deals</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Ajoutez des opportunités commerciales et suivez leur progression à travers votre pipeline.
            </p>
            <Link 
              href="/deals" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium inline-flex items-center"
            >
              Voir les deals
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
            <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-2">4. Analyse des performances</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Consultez le tableau de bord pour analyser vos performances et suivre vos tendances mensuelles.
            </p>
            <Link 
              href="/dashboard" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium inline-flex items-center"
            >
              Voir le tableau de bord
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
  
      {/* FAQ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
          Questions fréquentes
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-gray-900 dark:text-white font-medium">{faq.question}</span>
                {openFaqs.includes(index) ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              
              {openFaqs.includes(index) && (
                <div className="px-6 py-4 bg-white dark:bg-gray-800">
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
  
  
      {/* Contact support */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 text-center">
        <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">Vous avez besoin d'aide supplémentaire ?</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl mx-auto">
          Notre équipe de support est disponible pour répondre à toutes vos questions et vous aider à tirer le meilleur parti de NotionCRM.
        </p>
        <a 
          href="mailto:support@notioncrm.com"
          className="mt-4 inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Contacter le support
        </a>
      </div>
    </div>
  );
}