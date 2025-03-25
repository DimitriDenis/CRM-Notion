// src/components/layout/MainLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'écran est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px correspond à lg: dans Tailwind
    };

    // Vérifier immédiatement
    checkIfMobile();

    // Mettre à jour lors du redimensionnement
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoyage
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fermer automatiquement la sidebar sur mobile quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const hamburgerButton = document.getElementById('hamburger-button');
      
      if (sidebarOpen && isMobile && 
          sidebar && !sidebar.contains(event.target as Node) && 
          hamburgerButton && !hamburgerButton.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, isMobile]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay sombre lorsque la sidebar est ouverte sur mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-20 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar avec gestion des états ouvert/fermé */}
      <Sidebar 
        id="sidebar"
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isMobile={isMobile}
      />
      
      {/* Bouton pour fermer la sidebar sur mobile */}
      {isMobile && sidebarOpen && (
        <button
          className="fixed top-4 left-72 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      )}
      
      {/* Contenu principal avec adaptation selon l'état de la sidebar */}
      <div className={`transition-all duration-300 ${isMobile ? 'lg:pl-72' : sidebarOpen ? 'lg:pl-72' : 'lg:pl-24'}`}>
        <Header 
          openSidebar={() => setSidebarOpen(true)} 
          isSidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="py-6 dark:text-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}