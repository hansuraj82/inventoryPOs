import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import BarcodeScanner from '../components/BarcodeScanner';
import { productAPI } from '../services/api';
import { debounce, formatCurrency } from '../utils/helpers';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedBarcode, setScannedBarcode] = useState('');
  const barcodeInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    barcode: '',
    category: 'General',
    minStock: '5'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = debounce(async (query) => {
    if (!query) {
      fetchProducts();
      return;
    }

    try {
      const response = await productAPI.search(query);
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Search failed');
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
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setIsLoading(true);
      if (editingId) {
        await productAPI.update(editingId, formData);
        toast.success('Product updated successfully');
        setEditingId(null);
      } else {
        await productAPI.create(formData);
        toast.success('Product added successfully');
      }

      setFormData({
        name: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '',
        barcode: '',
        category: 'General',
        minStock: '5'
      });
      setShowForm(false);
      fetchProducts();
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
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setIsLoading(true);
      await productAPI.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();
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

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={() => setShowBarcodeScanner(true)}
              className="btn-secondary flex items-center gap-2"
            >
              📱 Scan Barcode
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price *
              </label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                className="input-field"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price *
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="input-field"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode {scannedBarcode && '(Scanned)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  ref={barcodeInputRef}
                  className="input-field flex-1"
                  placeholder="Barcode (from scanner or manual entry)"
                />
                {scannedBarcode && (
                  <button
                    type="button"
                    onClick={() => {
                      setScannedBarcode('');
                      setFormData({ ...formData, barcode: '' });
                    }}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Stock
              </label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card mb-8">
        <input
          type="text"
          placeholder="Search by name or barcode..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="input-field"
        />
      </div>

      {isLoading && !showForm ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No products found</div>
      ) : (
        <div className="overscroll-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Cost Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Selling Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Quantity</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Barcode</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{formatCurrency(product.costPrice || 0)}</td>
                  <td className="px-4 py-3">{formatCurrency(product.sellingPrice || 0)}</td>
                  <td className="px-4 py-3">
                    <span className={product.quantity <= product.minStock ? 'text-red-600 font-semibold' : ''}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{product.barcode || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}
    </Layout>
  );
}
