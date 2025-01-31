// src/app/(app)/dashboard/loading.tsx
export default function DashboardLoading() {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }