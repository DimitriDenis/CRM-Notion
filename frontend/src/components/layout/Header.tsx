// src/components/layout/Header.tsx
'use client';

import { Bars3Icon, BellIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { UserMenu } from './UserMenu';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface HeaderProps {
  openSidebar: () => void;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

export function Header({ openSidebar, isSidebarOpen, toggleSidebar }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Bouton hamburger pour mobile */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        onClick={openSidebar}
      >
        <span className="sr-only">Ouvrir la sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Bouton toggle pour desktop */}
      {toggleSidebar && (
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 hidden lg:block"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Réduire/Étendre la sidebar</span>
          <ArrowsRightLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Bouton de thème ajouté ici */}
          <ThemeToggle />
          
          
          
          <UserMenu />
        </div>
      </div>
    </div>
  );
}