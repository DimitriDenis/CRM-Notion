// src/components/dashboard/StatCard.tsx
interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: {
      value: number;
      label: string;
      positive?: boolean;
    };
  }
  
  export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
        <dt>
          <div className="absolute rounded-md bg-blue-500 p-3">
            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">{title}</p>
        </dt>
        <dd className="ml-16 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className={`ml-2 flex items-baseline text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}%
              <span className="text-gray-500"> {trend.label}</span>
            </p>
          )}
          {description && (
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <p className="text-gray-500">{description}</p>
              </div>
            </div>
          )}
        </dd>
      </div>
    );
  }