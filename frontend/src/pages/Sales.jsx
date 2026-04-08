import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { saleAPI } from '../services/api';
import { useAuthStore } from '../store/store';
import { formatCurrency, formatDate } from '../utils/helpers';
import { downloadInvoice, printInvoice } from '../utils/invoice';
import { SaleTableSkeleton, SaleMobileListSkeleton } from '../components/Skeletons';

export default function Sales() {
  const [sales, setPublicSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef(null);
  const { user } = useAuthStore();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async (page = 1, isLoadMore = false) => {
    try {
      setIsLoading(true);
      const response = await saleAPI.getAll(page, pageSize);
      const paginatedSales = response.data.data || [];
      
      if (isLoadMore) {
        setPublicSales(prev => [...prev, ...paginatedSales]);
      } else {
        setPublicSales(paginatedSales);
      }
      
      setCurrentPage(page);
      setTotalCount(response.data.totalCount || 0);
      setHasMore(page < response.data.totalPages);
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
      setCurrentPage(1);
      setHasMore(true);
      fetchSales(1);
      return;
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      searchSales(query);
    }, 500); // 500ms debounce delay
  };

  const searchSales = async (query) => {
    try {
      // Validate query before sending
      if (query.trim().length === 0) {
        setCurrentPage(1);
        setHasMore(true);
        fetchSales(1);
        return;
      }

      if (query.length > 100) {
        toast.error('Search query is too long (max 100 characters)');
        return;
      }

      setIsSearching(true);
      const response = await saleAPI.search(query, 1, pageSize);
      const searchResults = response.data.data || [];
      setPublicSales(searchResults);
      setCurrentPage(1);
      setTotalCount(response.data.totalCount || 0);
      setHasMore(1 < response.data.totalPages);
      
      if (response.data.count === 0) {
        toast.info('No sales found matching your search');
      }
    } catch (error) {
      console.error('Search error:', error);
      
      // Handle specific error responses from backend
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid search query. Please try with simpler text.');
      } else {
        toast.error('Failed to search sales');
      }
      
      // Fallback: show all sales on search error
      setCurrentPage(1);
      setHasMore(true);
      fetchSales(1);
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

  const handleLoadMore = () => {
    fetchSales(currentPage + 1, true);
  };

  return (
    <Layout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Sales History</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search invoice, customer or mobile..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
          />
          {isSearching && (
            <div className="absolute right-3 top-2 md:top-3">
              <div className="animate-spin">
                <span className="text-indigo-600">⟳</span>
              </div>
            </div>
          )}
        </div>
        
        {searchQuery && (
          <p className="text-xs md:text-sm text-gray-600 mt-2">
            Found {sales.length} sale(s)
          </p>
        )}
      </div>

      {isLoading ? (
        <>
          {/* Desktop Skeleton */}
          <div className="hidden md:block">
            <SaleTableSkeleton />
          </div>

          {/* Mobile Skeleton */}
          <div className="md:hidden">
            <SaleMobileListSkeleton />
          </div>
        </>
      ) : sales.length === 0 ? (
        <div className="card text-center py-8 md:py-12">
          <p className="text-gray-500 text-sm md:text-base">
            {searchQuery ? 'No sales found matching your search' : 'No sales found'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {sales.map((sale) => (
            <div key={sale._id} className="card">
              <button
                onClick={() => toggleExpand(sale._id)}
                className="w-full flex justify-between items-start md:items-center text-left gap-3"
              >
                <div className="flex-1 min-w-0">
                  {/* Mobile Layout */}
                  <div className="md:hidden">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold">INVOICE</p>
                        <p className="font-bold text-gray-900 truncate">{sale.invoiceNumber || 'N/A'}</p>
                      </div>
                      <p className="text-xl md:text-lg font-bold text-indigo-600 text-right flex-shrink-0">
                        {formatCurrency(sale.totalAmount)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 truncate">{sale.customerName}</p>
                    <p className="text-xs text-gray-500">{formatDate(sale.createdAt)}</p>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-4 gap-4 items-start">
                    {/* Invoice & Customer */}
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Invoice</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {sale.invoiceNumber || 'N/A'}
                      </p>
                      {sale.customerName && (
                        <>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-2">Customer</p>
                          <p className="text-sm text-gray-700 truncate">{sale.customerName}</p>
                        </>
                      )}
                    </div>
                    
                    {/* Date & Items */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(sale.createdAt)}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        {sale.items.length} item(s)
                      </p>
                    </div>

                    {/* Total Amount */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {formatCurrency(sale.totalAmount)}
                      </p>
                    </div>

                    {/* Profit & Payment */}
                    <div className="text-right">
                      {sale.totalProfit !== undefined && (
                        <>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Profit</p>
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
                <span className="text-xl md:text-2xl text-gray-400 ml-2 flex-shrink-0">
                  {expandedId === sale._id ? '▼' : '▶'}
                </span>
              </button>

              {expandedId === sale._id && (
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Items Sold</h3>
                  <div className="space-y-2 mb-4 md:mb-6">
                    {sale.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between p-2 md:p-3 bg-gray-50 rounded text-xs md:text-sm gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 flex-shrink-0">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-3 md:p-4 rounded mb-4 md:mb-6 text-xs md:text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold">
                        {formatCurrency(sale.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid:</span>
                      <span className="font-semibold">
                        {formatCurrency(sale.paidAmount)}
                      </span>
                    </div>
                    {sale.totalProfit !== undefined && (
                      <div className="flex justify-between font-semibold text-green-600">
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

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handlePrint(sale)}
                      className="btn-secondary flex-1 text-xs md:text-sm py-2"
                    >
                      🖨️ Print
                    </button>
                    <button
                      onClick={() => handleDownload(sale)}
                      className="btn-secondary flex-1 text-xs md:text-sm py-2"
                    >
                      📄 Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Pagination Info & Load More Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 px-4 py-3 bg-gray-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600">
              Showing {sales.length} of {totalCount} sales
            </p>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="btn-primary text-xs md:text-sm px-4 py-2 disabled:opacity-50 w-full sm:w-auto"
              >
                {isLoading ? 'Loading...' : '⬇ Load More'}
              </button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
