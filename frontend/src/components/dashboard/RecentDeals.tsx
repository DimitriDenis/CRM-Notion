// src/components/dashboard/RecentDeals.tsx
import { CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { Deal } from '@/types/dashboard';

interface RecentDealsProps {
  deals: Deal[];
}

export function RecentDeals({ deals }: RecentDealsProps) {
  // Formatage de la devise
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2
    });
  };

  // Formatage de la date
  const formatDate = (date: Date | string): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  };

  // Obtenir un badge de statut avec la bonne couleur
  const getStatusBadge = (status: string) => {
    let color = '';
    let text = '';

    switch (status) {
      case 'won':
        color = 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400';
        text = 'Gagné';
        break;
      case 'lost':
        color = 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400';
        text = 'Perdu';
        break;
      default:
        color = 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
        text = 'En cours';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Derniers deals</h3>
        {deals.length > 0 && (
          <Link 
            href="/deals" 
            className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Voir tous les deals
          </Link>
        )}
      </div>

      {deals.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {deals.map((deal) => (
            <div 
              key={deal.id} 
              className="flex flex-col p-3 sm:p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white/40 dark:bg-gray-800/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between sm:justify-start gap-2">
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
                      {deal.name}
                    </h4>
                    <div className="sm:hidden">
                      {getStatusBadge(deal.status)}
                    </div>
                  </div>
                  <div className="mt-1 flex flex-col xs:flex-row gap-2 xs:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(deal.value)}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span>{formatDate(deal.expectedCloseDate || deal.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  {getStatusBadge(deal.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">Aucun deal récent</p>
          <Link 
            href="/deals/new" 
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            Créer un nouveau deal
          </Link>
        </div>
      )}
    </div>
  );
}