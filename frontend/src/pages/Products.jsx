import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import BarcodeScanner from '../components/BarcodeScanner';
import { productAPI } from '../services/api';
import { debounce, formatCurrency } from '../utils/helpers';
import { ProductTableSkeleton, ProductCardSkeleton } from '../components/Skeletons';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const barcodeInputRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [formData, setFormData] = useState({
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    barcode: '',
    category: 'General',
    sku: '',
    description: '',
    minStock: '5'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (page = 1, isLoadMore = false) => {
    try {
      setIsLoading(true);
      const response = await productAPI.getAll(page, pageSize);
      const paginatedProducts = response.data.data || [];
      
      if (isLoadMore) {
        setProducts(prev => [...prev, ...paginatedProducts]);
      } else {
        setProducts(paginatedProducts);
      }
      
      setCurrentPage(page);
      setTotalCount(response.data.totalCount || 0);
      setHasMore(page < response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = debounce(async (query) => {
    if (!query) {
      setCurrentPage(1);
      setHasMore(true);
      fetchProducts(1);
      return;
    }

    try {
      setIsLoading(true);
      const response = await productAPI.search(query, 1, pageSize);
      const searchResults = response.data.data || [];
      setProducts(searchResults);
      setCurrentPage(1);
      setTotalCount(response.data.totalCount || 0);
      setHasMore(1 < response.data.totalPages);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const handleBarcodeScanned = async (barcode) => {
    setScannedBarcode(barcode);
    setShowBarcodeScanner(false);

    // Try to find product by barcode
    try {
      const response = await productAPI.getByBarcode(barcode);
      if (response.data.success) {
        // Product exists, show it in form for verification/editing
        const product = response.data.data;
        setFormData({
          name: product.name,
          costPrice: product.costPrice?.toString() || '',
          sellingPrice: product.sellingPrice?.toString() || '',
          quantity: product.quantity.toString(),
          barcode: product.barcode || '',
          category: product.category || 'General',
          sku: product.sku || '',
          description: product.description || '',
          minStock: product.minStock?.toString() || '5'
        });
        setEditingId(product._id);
        setShowForm(true);
        toast.success(`Product found: ${product.name}`);
      }
    } catch (error) {
      // Product not found, create new with this barcode
      setFormData({
        name: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '',
        barcode: barcode,
        category: 'General',
        minStock: '5'
      });
      setEditingId(null);
      setShowForm(true);
      toast.info('Product not found. Fill details to create new.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.costPrice || !formData.sellingPrice) {
      toast.error('Please fill in all required fields: name, cost price, and selling price');
      return;
    }

    try {
      setIsLoading(true);
      // Convert string values to numbers
      const dataToSend = {
        ...formData,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
        minStock: formData.minStock ? parseFloat(formData.minStock) : 5
      };

      if (editingId) {
        await productAPI.update(editingId, dataToSend);
        toast.success('Product updated successfully');
        setEditingId(null);
      } else {
        await productAPI.create(dataToSend);
        toast.success('Product added successfully');
      }

      setFormData({
        name: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '',
        barcode: '',
        category: 'General',
        sku: '',
        description: '',
        minStock: '5'
      });
      setShowForm(false);
      setCurrentPage(1);
      setHasMore(true);
      fetchProducts(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      costPrice: product.costPrice?.toString() || '',
      sellingPrice: product.sellingPrice?.toString() || '',
      quantity: product.quantity.toString(),
      barcode: product.barcode || '',
      category: product.category || 'General',
      minStock: product.minStock.toString()
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const product = products.find(p => p._id === id);
    setDeleteModal({ isOpen: true, product });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.product) return;

    try {
      setIsLoading(true);
      await productAPI.delete(deleteModal.product._id);
      toast.success('Product deleted successfully');
      setDeleteModal({ isOpen: false, product: null });
      setCurrentPage(1);
      setHasMore(true);
      fetchProducts(1);
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setScannedBarcode('');
    setFormData({
      name: '',
      costPrice: '',
      sellingPrice: '',
      quantity: '',
      barcode: '',
      category: 'General',
      minStock: '5'
    });
  };

  const handleLoadMore = () => {
    fetchProducts(currentPage + 1, true);
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary w-full sm:w-auto text-sm md:text-base"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={() => setShowBarcodeScanner(true)}
              className="btn-secondary flex items-center gap-2 text-xs md:text-sm w-full sm:w-auto justify-center"
            >
              📱 Scan Barcode
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field text-xs md:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Cost Price *
              </label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                className="input-field text-xs md:text-sm"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Selling Price *
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="input-field text-xs md:text-sm"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input-field text-xs md:text-sm"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Barcode {scannedBarcode && '(Scanned)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  ref={barcodeInputRef}
                  className="input-field flex-1 text-xs md:text-sm"
                  placeholder="Barcode (from scanner or manual entry)"
                />
                {scannedBarcode && (
                  <button
                    type="button"
                    onClick={() => {
                      setScannedBarcode('');
                      setFormData({ ...formData, barcode: '' });
                    }}
                    className="px-2 md:px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs md:text-sm font-medium whitespace-nowrap"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field text-xs md:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Min Stock
              </label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                className="input-field text-xs md:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., SKU123"
                className="input-field text-xs md:text-sm"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="3"
                className="input-field text-xs md:text-sm resize-none"
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 disabled:opacity-50 text-xs md:text-sm"
              >
                {isLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex-1 text-xs md:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card mb-6 md:mb-8">
        <input
          type="text"
          placeholder="Search by name or barcode..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="input-field text-xs md:text-sm"
        />
      </div>

      {isLoading && !showForm ? (
        <>
          {/* Desktop Skeleton */}
          <div className="hidden md:block">
            <ProductTableSkeleton />
          </div>

          {/* Mobile Skeleton */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        </>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">No products found</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Cost</th>
                  <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Selling</th>
                  <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Qty</th>
                  <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                  <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Barcode</th>
                  <th className="px-3 lg:px-4 py-3 text-center font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 lg:px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-3 lg:px-4 py-3">{formatCurrency(product.costPrice || 0)}</td>
                    <td className="px-3 lg:px-4 py-3">{formatCurrency(product.sellingPrice || 0)}</td>
                    <td className="px-3 lg:px-4 py-3">
                      <span className={product.quantity <= product.minStock ? 'text-red-600 font-semibold' : ''}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-3 lg:px-4 py-3 text-xs">{product.category}</td>
                    <td className="px-3 lg:px-4 py-3 font-mono text-xs">{product.barcode || '-'}</td>
                    <td className="px-3 lg:px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 text-xs md:text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 text-xs md:text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((product) => (
              <div key={product._id} className="card">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">{product.name}</h3>
                <div className="space-y-1 text-xs mb-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Cost:</span> {formatCurrency(product.costPrice || 0)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Sell:</span> {formatCurrency(product.sellingPrice || 0)}
                  </p>
                  <p className={product.quantity <= product.minStock ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                    <span className="font-medium">Qty:</span> {product.quantity}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Cat:</span> {product.category}
                  </p>
                  {product.barcode && (
                    <p className="text-gray-600 font-mono text-xs">
                      <span className="font-medium">Bar:</span> {product.barcode}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 py-2 bg-indigo-100 text-indigo-600 rounded text-xs font-medium hover:bg-indigo-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 py-2 bg-red-100 text-red-600 rounded text-xs font-medium hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Info & Load More Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 px-4 py-3 bg-gray-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600">
              Showing {products.length} of {totalCount} products
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
        </>
      )}

      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 border-b border-red-200 px-4 md:px-6 py-4">
              <h2 className="text-lg md:text-xl font-bold text-red-900">Delete Product</h2>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  Are you sure you want to delete this product?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Product:</span> {deleteModal.product.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Category:</span> {deleteModal.product.category}
                  </p>
                  {deleteModal.product.barcode && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Barcode:</span> {deleteModal.product.barcode}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-6">
                <p className="text-xs md:text-sm text-yellow-800">
                  ⚠️ This action cannot be undone!
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t bg-gray-50 px-4 md:px-6 py-4 flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, product: null })}
                className="flex-1 btn-secondary py-2 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition text-sm md:text-base"
              >
                {isLoading ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
