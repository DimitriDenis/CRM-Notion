// src/components/deals/DealCard.tsx
import Link from 'next/link';
import { Deal } from '@/lib/api/deals';

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <Link href={`/deals/${deal.id}`}>
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <h4 className="font-medium text-gray-900 truncate">{deal.name}</h4>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {deal.value.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            })}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              getStatusClass(deal.status || 'active')
            }`}
          >
            {getStatusLabel(deal.status || 'active')}
          </span>
        </div>
        {deal.expectedCloseDate && (
          <div className="mt-2 text-xs text-gray-500">
            Clôture: {new Date(deal.expectedCloseDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </Link>
  );
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'won':
      return 'bg-green-100 text-green-800';
    case 'lost':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'active':
      return 'En cours';
    case 'won':
      return 'Gagné';
    case 'lost':
      return 'Perdu';
    default:
      return status;
  }
}