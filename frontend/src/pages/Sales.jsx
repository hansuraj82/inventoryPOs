import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { saleAPI } from '../services/api';
import { useAuthStore } from '../store/store';
import { formatCurrency, formatDate } from '../utils/helpers';
import { downloadInvoice, printInvoice } from '../utils/invoice';

export default function Sales() {
  const [sales, setPublicSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setIsLoading(true);
      const response = await saleAPI.getAll();
      setPublicSales(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch sales');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async (sale) => {
    try {
      await printInvoice(sale, user.shopName);
      toast.success('Invoice sent to printer');
    } catch (error) {
      toast.error('Failed to print invoice');
    }
  };

  const handleDownload = async (sale) => {
    try {
      await downloadInvoice(sale, user.shopName);
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sales History</h1>

      {sales.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">No sales found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale._id} className="card">
              <button
                onClick={() => toggleExpand(sale._id)}
                className="w-full flex justify-between items-center text-left"
              >
                <div className="flex-1">
                  <div className="flex gap-6 items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {formatDate(sale.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {sale.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">
                        {formatCurrency(sale.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {sale.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-2xl text-gray-400 ml-4">
                  {expandedId === sale._id ? '▼' : '▶'}
                </span>
              </button>

              {expandedId === sale._id && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Items Sold</h3>
                  <div className="space-y-2 mb-6">
                    {sale.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold">
                        {formatCurrency(sale.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Paid:</span>
                      <span className="font-semibold">
                        {formatCurrency(sale.paidAmount)}
                      </span>
                    </div>
                    {sale.change > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Change:</span>
                        <span>{formatCurrency(sale.change)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handlePrint(sale)}
                      className="btn-secondary flex-1"
                    >
                      🖨️ Print
                    </button>
                    <button
                      onClick={() => handleDownload(sale)}
                      className="btn-secondary flex-1"
                    >
                      📄 Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
