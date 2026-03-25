import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { saleAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>

          <div className="card">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Low Stock Items</h3>
            <p className="text-3xl font-bold text-red-600">{stats.lowStockProducts}</p>
          </div>

          <div className="card">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Today Sales</h3>
            <p className="text-3xl font-bold text-green-600">{stats.todaySales}</p>
          </div>

          <div className="card">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Today Revenue</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {formatCurrency(stats.todayRevenue)}
            </p>
          </div>
        </div>
      )}

      {stats?.lowStockProducts > 0 && (
        <div className="card bg-yellow-50 border-l-4 border-yellow-400 mb-8">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3">
            ⚠️ Low Stock Alert
          </h2>
          <p className="text-yellow-700">
            You have {stats.lowStockProducts} product(s) with low stock. Please reorder soon!
          </p>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/products"
            className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
          >
            <h3 className="font-semibold text-indigo-900">Manage Products</h3>
            <p className="text-sm text-indigo-700">Add, edit, or delete products</p>
          </a>
          <a
            href="/pos"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <h3 className="font-semibold text-green-900">POS</h3>
            <p className="text-sm text-green-700">Process sales and transactions</p>
          </a>
          <a
            href="/sales"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <h3 className="font-semibold text-blue-900">Sales History</h3>
            <p className="text-sm text-blue-700">View past transactions</p>
          </a>
        </div>
      </div>
    </Layout>
  );
}
