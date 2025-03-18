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
        color = 'bg-green-50 text-green-700';
        text = 'Gagné';
        break;
      case 'lost':
        color = 'bg-red-50 text-red-700';
        text = 'Perdu';
        break;
      default:
        color = 'bg-blue-50 text-blue-700';
        text = 'En cours';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Derniers deals</h3>
        {deals.length > 0 && (
          <Link 
            href="/deals" 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Voir tous les deals
          </Link>
        )}
      </div>

      {deals.length > 0 ? (
        <div className="space-y-4">
          {deals.map((deal) => (
            <div 
              key={deal.id} 
              className="flex flex-col p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900 truncate max-w-xs">{deal.name}</h4>
                  <div className="mt-1 flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="font-medium text-gray-700">{formatCurrency(deal.value)}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{formatDate(deal.expectedCloseDate || deal.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {getStatusBadge(deal.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Aucun deal récent</p>
          <Link 
            href="/deals/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Créer un nouveau deal
          </Link>
        </div>
      )}
    </div>
  );
}