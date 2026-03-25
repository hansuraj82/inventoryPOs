import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import BarcodeScanner from '../components/BarcodeScanner';
import { productAPI, saleAPI } from '../services/api';
import { useCartStore, useAuthStore } from '../store/store';
import { formatCurrency, debounce } from '../utils/helpers';
import { generateInvoicePDF, downloadInvoice, printInvoice } from '../utils/invoice';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [lastSale, setLastSale] = useState(null);
  
  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    mobile: '',
    address: '',
    email: ''
  });

  // New Product Form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    category: 'General',
    minStock: '5'
  });

  const { user } = useAuthStore();
  const { items: cartItems, addItem, updateQuantity, removeItem, clearCart, totalAmount } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch products');
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
  }, 300);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const handleBarcodeScanned = async (barcode) => {
    try {
      const response = await productAPI.getByBarcode(barcode);
      if (response.data.success) {
        addItem(response.data.data);
        toast.success(`${response.data.data.name} added to cart`);
        setShowBarcodeScanner(false);
      }
    } catch (error) {
      toast.error('Product not found. Do you want to add it?');
      setScannedBarcode(barcode);
    }
  };

  const handleProductNotFound = (barcode) => {
    setScannedBarcode(barcode);
    setShowProductForm(true);
    setShowBarcodeScanner(false);
  };

  const handleAddNewProduct = async (e) => {
    e.preventDefault();
    try {
      if (!newProduct.name || !newProduct.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      const productData = {
        ...newProduct,
        barcode: scannedBarcode,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity) || 0,
        minStock: parseInt(newProduct.minStock) || 5
      };

      const response = await productAPI.create(productData);
      toast.success('Product added successfully!');
      addItem(response.data.data);
      
      // Reset form
      setNewProduct({
        name: '',
        price: '',
        quantity: '',
        category: 'General',
        minStock: '5'
      });
      setScannedBarcode('');
      setShowProductForm(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  const handleAddToCart = (product) => {
    if (product.quantity <= 0) {
      toast.error('Product out of stock');
      return;
    }
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const calculateChange = () => {
    const paid = parseFloat(paidAmount) || 0;
    return paid - totalAmount;
  };

  const handleCompletePayment = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!customerInfo.name || !customerInfo.mobile) {
      toast.error('Please enter customer details');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select payment method');
      return;
    }

    const paid = parseFloat(paidAmount);
    if (!paid || paid < 0) {
      toast.error('Please enter valid payment amount');
      return;
    }

    try {
      setIsProcessing(true);
      const saleData = {
        customer: customerInfo,
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount,
        paymentMethod,
        paidAmount: paid
      };

      const response = await saleAPI.create(saleData);
      const sale = response.data.data;
      
      toast.success('Sale completed successfully!');
      setLastSale(sale);
      clearCart();
      setPaidAmount('');
      setPaymentMethod('cash');
      setSearchQuery('');
      setCustomerInfo({
        name: '',
        mobile: '',
        address: '',
        email: ''
      });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete sale');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintInvoice = async () => {
    if (!lastSale) return;
    try {
      await printInvoice(lastSale, user.shopName);
      toast.success('Invoice sent to printer');
    } catch (error) {
      toast.error('Failed to print invoice');
    }
  };

  const handleDownloadInvoice = async () => {
    if (!lastSale) return;
    try {
      await downloadInvoice(lastSale, user.shopName);
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const handleNewSale = () => {
    setLastSale(null);
    fetchProducts();
  };

  // Invoice Display
  if (lastSale) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-green-600 mb-2">✓ Sale Completed!</h1>
              <p className="text-gray-600">Your transaction has been recorded.</p>
            </div>

            {/* Invoice Display */}
            <div className="bg-white border-2 border-gray-300 p-8 rounded-lg mb-8 shadow-lg">
              {/* Header */}
              <div className="text-center mb-6 border-b-2 pb-4">
                <h2 className="text-3xl font-bold text-gray-900">{user.shopName}</h2>
                <p className="text-gray-600 text-sm mt-2">RECEIPT/INVOICE</p>
              </div>

              {/* Transaction Date and Details */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-600">Invoice #: <span className="font-semibold text-gray-900">{lastSale._id.substring(0, 8).toUpperCase()}</span></p>
                  <p className="text-gray-600">Date: <span className="font-semibold text-gray-900">{new Date(lastSale.createdAt).toLocaleDateString('en-IN')}</span></p>
                  <p className="text-gray-600">Time: <span className="font-semibold text-gray-900">{new Date(lastSale.createdAt).toLocaleTimeString('en-IN')}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Customer: <span className="font-semibold text-gray-900">{lastSale.customer.name}</span></p>
                  <p className="text-gray-600">Mobile: <span className="font-semibold text-gray-900">{lastSale.customer.mobile}</span></p>
                  {lastSale.customer.address && (
                    <p className="text-gray-600">Address: <span className="font-semibold text-gray-900">{lastSale.customer.address}</span></p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 font-bold text-gray-900">Item</th>
                      <th className="text-center py-2 font-bold text-gray-900">Qty</th>
                      <th className="text-right py-2 font-bold text-gray-900">Price</th>
                      <th className="text-right py-2 font-bold text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastSale.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-2 text-gray-900">{item.productName}</td>
                        <td className="text-center py-2 text-gray-900">{item.quantity}</td>
                        <td className="text-right py-2 text-gray-900">{formatCurrency(item.price)}</td>
                        <td className="text-right py-2 font-semibold text-gray-900">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(lastSale.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(lastSale.totalAmount)}</span>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded mb-6">
                <div className="flex justify-between mb-2 text-gray-700">
                  <span>Payment Method:</span>
                  <span className="font-semibold uppercase">{lastSale.paymentMethod}</span>
                </div>
                <div className="flex justify-between mb-2 text-gray-700">
                  <span>Amount Received:</span>
                  <span className="font-semibold">{formatCurrency(lastSale.paidAmount)}</span>
                </div>
                {lastSale.isCredit && lastSale.creditAmount > 0 ? (
                  <div className="flex justify-between text-red-600 font-bold text-lg">
                    <span>Customer Credit/Due:</span>
                    <span>{formatCurrency(lastSale.creditAmount)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-green-600 font-bold text-lg">
                    <span>Change Returned:</span>
                    <span>{formatCurrency(lastSale.change)}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center border-t-2 border-gray-300 pt-4 text-sm text-gray-600">
                <p>Thank you for your purchase!</p>
                <p className="text-xs mt-1">Please visit again</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-col md:flex-row">
              <button
                onClick={handlePrintInvoice}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                🖨️ Print Invoice
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                📄 Download PDF
              </button>
              <button
                onClick={handleNewSale}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                ➕ New Sale
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Search and List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Products</h2>

          <div className="card mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products by name or barcode..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="input-field flex-1"
              />
              <button
                onClick={() => setShowBarcodeScanner(true)}
                className="btn-secondary"
              >
                📱 Scan
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="card text-center py-8 text-gray-500">
              No products available. Add some products first.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product._id} className="card hover:shadow-lg transition">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.category} {product.barcode && `| ${product.barcode}`}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(product.price)}
                    </span>
                    <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-3 py-1 rounded`}>
                      Stock: {product.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity <= 0}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart and Payment */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice</h2>

          <div className="card sticky top-24">
            {/* Customer Information */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3 text-blue-900">Customer Details</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Customer Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="input-field text-sm"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Number *"
                  value={customerInfo.mobile}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
                  className="input-field text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Address (Optional)"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="input-field text-sm"
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
            </div>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded hover:bg-red-200"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded hover:bg-green-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Section */}
                <div className="border-t pt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="cash">💵 Cash</option>
                      <option value="card">💳 Card</option>
                      <option value="upi">📱 UPI</option>
                    </select>
                  </div>

                  {/* Amount Summary */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border-2 border-indigo-200">
                    <div className="flex justify-between mb-2 text-gray-700">
                      <span>Total:</span>
                      <span className="font-semibold">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="border-t border-indigo-200 pt-2 flex justify-between text-lg font-bold text-indigo-700">
                      <span>Amount Due:</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Payment Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      className="input-field mb-2"
                      placeholder="Enter amount"
                      step="0.01"
                    />
                    {paidAmount && (
                      <div className="text-sm font-semibold">
                        {calculateChange() >= 0 ? (
                          <span className="text-green-600 bg-green-50 p-2 rounded block text-center">
                            Change: {formatCurrency(calculateChange())}
                          </span>
                        ) : (
                          <span className="text-red-600 bg-red-50 p-2 rounded block text-center">
                            Due/Credit: {formatCurrency(Math.abs(calculateChange()))}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handleCompletePayment}
                    disabled={isProcessing || cartItems.length === 0}
                    className="w-full btn-primary text-lg py-3 disabled:opacity-50 font-bold"
                  >
                    {isProcessing ? 'Processing...' : '💰 Complete Payment'}
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full btn-secondary text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
          onProductNotFound={handleProductNotFound}
        />
      )}

      {/* Add New Product Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Product from Barcode</h2>
            <p className="text-gray-600 mb-4">Barcode: <span className="font-semibold">{scannedBarcode}</span></p>

            <form onSubmit={handleAddNewProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Stock
                </label>
                <input
                  type="number"
                  value={newProduct.minStock}
                  onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Add & To Cart
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setScannedBarcode('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
