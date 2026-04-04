import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
      </div>
    </div>
  );
}

export function ProductTableRowSkeleton() {
  return (
    <tr className="border-b hover:bg-gray-50 animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </td>
    </tr>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <ProductCardSkeleton key={n} />
      ))}
    </div>
  );
}

export function ProductTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b-2">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Barcode</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((n) => (
            <ProductTableRowSkeleton key={n} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
