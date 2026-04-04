import React from 'react';

export function DashboardStatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="w-10 h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-40"></div>
    </div>
  );
}

export function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((n) => (
        <DashboardStatCardSkeleton key={n} />
      ))}
    </div>
  );
}

export function DashboardChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="flex-1 h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardFullSkeleton() {
  return (
    <div>
      <DashboardGridSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChartSkeleton />
        <DashboardChartSkeleton />
      </div>
    </div>
  );
}

export function DetailsModalContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}
