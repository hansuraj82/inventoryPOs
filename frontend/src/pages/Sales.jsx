import React, { useEffect, useState, useRef } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef(null);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!query.trim()) {
      // If search is empty, fetch all sales
      fetchSales();
      return;
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      searchSales(query);
    }, 500); // 500ms debounce delay
  };

  const searchSales = async (query) => {
    try {
      setIsSearching(true);
      const response = await saleAPI.search(query);
      setPublicSales(response.data.data);
      if (response.data.count === 0) {
        toast.info('No sales found matching your search');
      }
    } catch (error) {
      toast.error('Failed to search sales');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrint = async (sale) => {
    console.log(sale);
    
    try {
      await printInvoice(sale, user.shopName);
      toast.success('Invoice sent to printer');
    } catch (error) {
      console.log(`error is ${error}`);
      
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Sales History</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by invoice number, customer name, or mobile..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin">
                <span className="text-indigo-600">⟳</span>
              </div>
            </div>
          )}
        </div>
        
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Found {sales.length} sale(s)
          </p>
        )}
      </div>

      {sales.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">
            {searchQuery ? 'No sales found matching your search' : 'No sales found'}
          </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    {/* Invoice & Customer */}
                    <div>
                      {sale.invoiceNumber && (
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Invoice</p>
                      )}
                      <p className="font-semibold text-gray-900">
                        {sale.invoiceNumber || 'N/A'}
                      </p>
                      {sale.customerName && (
                        <>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">Customer</p>
                          <p className="text-sm text-gray-700">{sale.customerName}</p>
                        </>
                      )}
                    </div>
                    
                    {/* Date & Items */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(sale.createdAt)}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        {sale.items.length} item(s)
                      </p>
                    </div>

                    {/* Total Amount */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {formatCurrency(sale.totalAmount)}
                      </p>
                    </div>

                    {/* Profit & Payment */}
                    <div className="text-right">
                      {sale.totalProfit !== undefined && (
                        <>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Profit</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(sale.totalProfit)}
                          </p>
                        </>
                      )}
                      <p className="text-xs text-gray-600 capitalize mt-2">
                        {sale.paymentMethod || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-2xl text-gray-400 ml-4 flex-shrink-0">
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
                    {sale.totalProfit !== undefined && (
                      <div className="flex justify-between mb-2 font-semibold text-green-600">
                        <span>Total Profit:</span>
                        <span>{formatCurrency(sale.totalProfit)}</span>
                      </div>
                    )}
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
