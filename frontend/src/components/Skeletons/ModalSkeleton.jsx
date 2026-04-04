import React from 'react';

export function ModalProductsContentSkeleton() {
  return (
    <div className="space-y-0">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="py-3 grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-2 border-b animate-pulse">
          <div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
          <div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
          <div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
          <div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
          <div>
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModalSalesContentSkeleton() {
  return (
    <div className="space-y-2 md:space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="border rounded-lg p-3 md:p-4 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-3">
            <div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}

export function ModalHeaderSkeleton() {
  return (
    <div className="sticky top-0 bg-white border-b p-3 md:p-4 flex justify-between items-center animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48"></div>
      <div className="w-6 h-6 bg-gray-200 rounded"></div>
    </div>
  );
}

export function ModalFooterSkeleton() {
  return (
    <div className="border-t p-3 md:p-4 bg-gray-50 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );
}
