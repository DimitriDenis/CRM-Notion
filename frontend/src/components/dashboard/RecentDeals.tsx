// src/components/dashboard/RecentDeals.tsx
import Link from 'next/link';
import type { Deal } from '@/types/dashboard';

export function RecentDeals({ deals }: { deals: Deal[] }) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Derniers deals
        </h3>
        <div className="mt-6 flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {deals.map((deal) => (
              <li key={deal.id} className="py-5">
                <div className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {deal.name}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {/* Utiliser stage?.name ou stageId */}
                      {deal.stage?.name || deal.stageId} · {deal.value.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                  </div>
                  <time
                    dateTime={deal.updatedAt.toISOString()}
                    className="flex-shrink-0 text-sm text-gray-500"
                  >
                    {new Date(deal.updatedAt).toLocaleDateString()}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <Link
            href="/deals"
            className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50"
          >
            Voir tous les deals
          </Link>
        </div>
      </div>
    </div>
  );
}