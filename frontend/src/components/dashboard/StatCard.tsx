import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

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
    className?: string;
  }
  
  export function StatCard({ title, value, icon: Icon, trend, className = '' }: StatCardProps) {
    return (
      <div className={`rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
          <div className="bg-blue-50 rounded-full p-2">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          
          {trend && (
            <p className={`flex items-center text-sm mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              <span className="font-medium">
                {trend.positive ? '+' : ''}{trend.value}% 
              </span>
              <span className="text-gray-500 ml-1">{trend.label}</span>
            </p>
          )}
        </div>
      </div>
    );
  }