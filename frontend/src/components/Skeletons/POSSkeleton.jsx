import React from 'react';

export function POSProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 animate-pulse cursor-pointer hover:shadow-md transition-all">
      <div className="h-8 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

export function POSProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <POSProductCardSkeleton key={n} />
      ))}
    </div>
  );
}

export function POSCartItemSkeleton() {
  return (
    <div className="border-b py-3 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}

export function POSCartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <POSCartItemSkeleton key={n} />
        ))}
      </div>
      <div className="border-t mt-4 pt-4 space-y-2">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-10 bg-gray-200 rounded mt-4 w-full"></div>
    </div>
  );
}

export function POSFullSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="mb-4 h-10 bg-gray-200 rounded w-full"></div>
        <POSProductGridSkeleton />
      </div>
      <div>
        <POSCartSkeleton />
      </div>
    </div>
  );
}
