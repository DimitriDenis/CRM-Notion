// src/components/layout/Sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  UserGroupIcon, 
  FunnelIcon, 
  CurrencyDollarIcon,
  TagIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile?: boolean;
  id?: string;
}

export function Sidebar({ isOpen, setIsOpen, isMobile = false, id = 'sidebar' }: SidebarProps) {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Contacts', href: '/contacts', icon: UserGroupIcon },
    { name: 'Pipelines', href: '/pipelines', icon: FunnelIcon },
    { name: 'Deals', href: '/deals', icon: CurrencyDollarIcon },
    { name: 'Tags', href: '/tags', icon: TagIcon },
  ];
  
  const secondaryNavigation = [
    { name: 'Paramètres', href: '/settings', icon: Cog6ToothIcon },
    { name: 'Aide', href: '/help', icon: QuestionMarkCircleIcon },
  ];

  // Détermine si un lien est actif
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/') return true;
    return pathname.startsWith(path);
  };

  const sidebarClasses = `
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
    ${!isOpen && !isMobile ? 'lg:w-20' : 'lg:w-72'} 
    fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md 
    transition-all duration-300 ease-in-out
  `;

  return (
    <div id={id} className={sidebarClasses}>
      {/* Logo et titre */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700 px-6">
        <Link href="/" className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-md bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          {(isOpen || isMobile) && (
            <span className="text-xl font-semibold text-gray-900 dark:text-white">NotionCRM</span>
          )}
        </Link>
      </div>
      
      {/* Navigation principale */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const IconComponent = active && item.activeIcon ? item.activeIcon : item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center rounded-md px-3 py-2 text-sm font-medium
                  ${active 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                  ${!isOpen && !isMobile ? 'justify-center' : ''}
                `}
              >
                <IconComponent 
                  className={`h-5 w-5 shrink-0 ${
                    active 
                      ? 'text-blue-600 dark:text-blue-300' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`} 
                  aria-hidden="true" 
                />
                {(isOpen || isMobile) && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-10">
          <p className={`mb-2 px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase ${!isOpen && !isMobile ? 'text-center' : ''}`}>
            {(isOpen || isMobile) ? 'Paramètres' : ''}
          </p>
          <nav className="space-y-1">
            {secondaryNavigation.map((item) => {
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center rounded-md px-3 py-2 text-sm font-medium
                    ${active 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                    ${!isOpen && !isMobile ? 'justify-center' : ''}
                  `}
                >
                  <item.icon 
                    className={`h-5 w-5 shrink-0 ${
                      active 
                        ? 'text-blue-600 dark:text-blue-300' 
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    }`} 
                    aria-hidden="true" 
                  />
                  {(isOpen || isMobile) && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}