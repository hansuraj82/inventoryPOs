import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { saleAPI, productAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { DashboardFullSkeleton, ModalProductsContentSkeleton, ModalSalesContentSkeleton, ModalHeaderSkeleton, ModalFooterSkeleton } from '../components/Skeletons';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, type: null, data: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await saleAPI.getDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleViewProducts = async () => {
    try {
      setDetailsModal({ isOpen: true, type: 'products', data: [] });
      setIsLoadingModal(true);
      const response = await productAPI.getAll();
      setDetailsModal({ isOpen: true, type: 'products', data: response.data.data });
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoadingModal(false);
    }
  };

  const handleViewLowStock = async () => {
    try {
      setDetailsModal({ isOpen: true, type: 'lowStock', data: [] });
      setIsLoadingModal(true);
      const response = await productAPI.getLowStock();
      setDetailsModal({ isOpen: true, type: 'lowStock', data: response.data.data });
    } catch (error) {
      toast.error('Failed to fetch low stock products');
    } finally {
      setIsLoadingModal(false);
    }
  };

  const handleViewTodaysSales = async () => {
    try {
      setDetailsModal({ isOpen: true, type: 'todaysSales', data: [] });
      setIsLoadingModal(true);
      const response = await saleAPI.getTodayStats();
      setDetailsModal({ isOpen: true, type: 'todaysSales', data: response.data.data.sales });
    } catch (error) {
      toast.error('Failed to fetch today\'s sales');
    } finally {
      setIsLoadingModal(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Dashboard</h1>
          <DashboardFullSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          <button
            onClick={handleViewProducts}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
          >
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Total Products</h3>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            <p className="text-xs text-gray-500 mt-2">Click to view details</p>
          </button>

          <button
            onClick={handleViewLowStock}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
          >
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Low Stock Items</h3>
            <p className="text-2xl md:text-3xl font-bold text-red-600">{stats.lowStockProducts}</p>
            <p className="text-xs text-gray-500 mt-2">Click to view details</p>
          </button>

          <button
            onClick={handleViewTodaysSales}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
          >
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Today Sales</h3>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.todaySales}</p>
            <p className="text-xs text-gray-500 mt-2">Click to view details</p>
          </button>

          <div className="card">
            <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Today Revenue</h3>
            <p className="text-2xl md:text-3xl font-bold text-indigo-600">
              {formatCurrency(stats.todayRevenue)}
            </p>
          </div>
        </div>
      )}

      {stats?.lowStockProducts > 0 && (
        <div className="card bg-yellow-50 border-l-4 border-yellow-400 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold text-yellow-800 mb-2 md:mb-3">
            ⚠️ Low Stock Alert
          </h2>
          <p className="text-xs md:text-sm text-yellow-700">
            You have {stats.lowStockProducts} product(s) with low stock. Please reorder soon!
          </p>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
            {/* Modal Header */}
            {isLoadingModal ? (
              <ModalHeaderSkeleton />
            ) : (
              <div className="sticky top-0 bg-white border-b p-3 md:p-4 flex justify-between items-center">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                  {detailsModal.type === 'products' && 'All Products'}
                  {detailsModal.type === 'lowStock' && 'Low Stock Items'}
                  {detailsModal.type === 'todaysSales' && "Today's Sales"}
                </h2>
                <button
                  onClick={() => setDetailsModal({ ...detailsModal, isOpen: false })}
                  className="text-gray-600 hover:text-gray-900 text-2xl"
                >
                  ×
                </button>
              </div>
            )}

            {/* Modal Content */}
            <div className="p-3 md:p-4">
              {isLoadingModal ? (
                detailsModal.type === 'todaysSales' ? (
                  <ModalSalesContentSkeleton />
                ) : (
                  <ModalProductsContentSkeleton />
                )
              ) : detailsModal.data.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-xs md:text-sm">No data available</p>
              ) : detailsModal.type === 'todaysSales' ? (
                // Sales View
                <div className="space-y-2 md:space-y-4">
                  {detailsModal.data.map((sale) => (
                    <div key={sale._id} className="border rounded-lg p-3 md:p-4 bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-2">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Invoice #</p>
                          <p className="font-semibold text-xs md:text-sm">{sale.invoiceNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Customer</p>
                          <p className="font-semibold text-xs md:text-sm truncate">{sale.customerName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Amount</p>
                          <p className="font-semibold text-xs md:text-sm text-green-600">
                            {formatCurrency(sale.totalAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Time</p>
                          <p className="font-semibold text-xs md:text-sm">
                            {new Date(sale.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Items: {sale.items.length} | Payment: {sale.paymentMethod}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                // Products View
                <div className="divide-y">
                  {detailsModal.data.map((product) => (
                    <div key={product._id} className="py-3 grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-2 text-xs">
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">Name</p>
                        <p className="font-semibold truncate">{product.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">Barcode</p>
                        <p className="font-mono text-xs truncate">{product.barcode || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">Qty</p>
                        <p
                          className={`font-semibold ${
                            product.quantity <= product.minStock
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {product.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">Price</p>
                        <p className="font-semibold">
                          {formatCurrency(product.sellingPrice || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-semibold">Min</p>
                        <p className="font-semibold">{product.minStock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {isLoadingModal ? (
              <ModalFooterSkeleton />
            ) : (
              <div className="border-t p-3 md:p-4 bg-gray-50">
                <button
                  onClick={() => setDetailsModal({ ...detailsModal, isOpen: false })}
                  className="w-full btn btn-primary text-xs md:text-sm"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <a
            href="/products"
            className="p-3 md:p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
          >
            <h3 className="font-semibold text-indigo-900 text-sm md:text-base">Manage Products</h3>
            <p className="text-xs md:text-sm text-indigo-700">Add, edit, or delete products</p>
          </a>
          <a
            href="/pos"
            className="p-3 md:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <h3 className="font-semibold text-green-900 text-sm md:text-base">POS</h3>
            <p className="text-xs md:text-sm text-green-700">Process sales and transactions</p>
          </a>
          <a
            href="/sales"
            className="p-3 md:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <h3 className="font-semibold text-blue-900 text-sm md:text-base">Sales History</h3>
            <p className="text-xs md:text-sm text-blue-700">View past transactions</p>
          </a>
        </div>
      </div>
    </Layout>
  );
}
