import React from 'react';

export function SaleRowSkeleton() {
  return (
    <tr className="border-b hover:bg-gray-50 animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-28"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </td>
    </tr>
  );
}

export function SaleTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b-2">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice #</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((n) => (
            <SaleRowSkeleton key={n} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SaleMobileCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-28"></div>
    </div>
  );
}

export function SaleMobileListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <SaleMobileCardSkeleton key={n} />
      ))}
    </div>
  );
}
