import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import BarcodeScanner from '../components/BarcodeScanner';
import { productAPI, saleAPI } from '../services/api';
import { useCartStore, useAuthStore } from '../store/store';
import { formatCurrency, debounce } from '../utils/helpers';
import { generateInvoicePDF, downloadInvoice, printInvoice } from '../utils/invoice';
import { POSProductGridSkeleton } from '../components/Skeletons';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [isGstBill, setIsGstBill] = useState(true);
  const [lastSale, setLastSale] = useState(null);
  const [quickAddQuantity, setQuickAddQuantity] = useState('1');
  const [selectedProductForAdd, setSelectedProductForAdd] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingHsn, setEditingHsn] = useState('');
  const [editingGst, setEditingGst] = useState('18');

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
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    category: 'General',
    sku: '',
    hsnCode: '',
    gstRate: '18',
    description: '',
    minStock: '5'
  });

  const [productFormErrors, setProductFormErrors] = useState({});

  const { user } = useAuthStore();
  const { items: cartItems, addItem, updateQuantity, removeItem, clearCart, totalAmount, updateItemTaxDetails } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productAPI.getAll();
      // Show only 2 most recently added products (default view)
      const allProducts = response.data.data;
      // Sort by createdAt in descending order and take top 2
      const recentProducts = allProducts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2);
      setProducts(recentProducts);
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
      // Show search results
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
        const product = response.data.data;
        addItem({
          _id: product._id,
          name: product.name,
          price: product.sellingPrice,
          quantity: 1,
          barcode: product.barcode,
          category: product.category,
          hsnCode: product.hsnCode,
          gstRate: product.gstRate
        });
        toast.success(`${product.name} added to cart`);
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
    const errors = {};

    // Validation
    if (!newProduct.name || newProduct.name.trim() === '') {
      errors.name = 'Product name is required';
    }

    if (!newProduct.sellingPrice || parseFloat(newProduct.sellingPrice) <= 0) {
      errors.sellingPrice = 'Selling price must be greater than 0';
    }

    if (newProduct.costPrice && parseFloat(newProduct.costPrice) < 0) {
      errors.costPrice = 'Cost price cannot be negative';
    }

    if (newProduct.quantity && parseInt(newProduct.quantity) < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }

    if (newProduct.minStock && parseInt(newProduct.minStock) < 0) {
      errors.minStock = 'Min stock cannot be negative';
    }

    if (Object.keys(errors).length > 0) {
      setProductFormErrors(errors);
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setIsProcessing(true);
      const productData = {
        name: newProduct.name.trim(),
        barcode: scannedBarcode,
        sellingPrice: parseFloat(newProduct.sellingPrice),
        costPrice: parseFloat(newProduct.costPrice) || 0,
        quantity: parseInt(newProduct.quantity) || 0,
        category: newProduct.category || 'General',
        sku: newProduct.sku || null,
        hsnCode: newProduct.hsnCode || null,
        gstRate: parseInt(newProduct.gstRate) || 18,
        description: newProduct.description || null,
        minStock: parseInt(newProduct.minStock) || 5
      };

      const response = await productAPI.create(productData);
      const createdProduct = response.data.data;

      toast.success('Product added successfully!');

      // Add to cart
      addItem({
        _id: createdProduct._id,
        name: createdProduct.name,
        price: createdProduct.sellingPrice,
        quantity: 1,
        barcode: createdProduct.barcode,
        category: createdProduct.category,
        hsnCode: createdProduct.hsnCode,
        gstRate: createdProduct.gstRate
      });

      // Reset form
      setNewProduct({
        name: '',
        sellingPrice: '',
        costPrice: '',
        quantity: '',
        category: 'General',
        sku: '',
        hsnCode: '',
        gstRate: '18',
        description: '',
        minStock: '5'
      });
      setProductFormErrors({});
      setScannedBarcode('');
      setShowProductForm(false);

      // Refresh products list
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.quantity <= 0) {
      toast.error('Product out of stock');
      return;
    }
    // Ensure all required fields are present
    const productForCart = {
      ...product,
      price: product.sellingPrice || product.price,
      // Ensure HSN and GST are always present
      hsnCode: product.hsnCode || '',
      gstRate: product.gstRate || 18
    };
    setSelectedProductForAdd(productForCart);
    setQuickAddQuantity('1');
  };

  const handleConfirmAdd = () => {
    if (!selectedProductForAdd) return;

    const qtyToAdd = parseInt(quickAddQuantity) || 1;
    if (qtyToAdd <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Add item multiple times based on quantity
    for (let i = 0; i < qtyToAdd; i++) {
      addItem(selectedProductForAdd);
    }

    toast.success(`${selectedProductForAdd.name} x${qtyToAdd} added to cart`);
    setSelectedProductForAdd(null);
    setQuickAddQuantity('1');
  };

  const handleEditTaxDetails = (item) => {
    setEditingItemId(item._id);
    setEditingHsn(item.customHsnCode || item.hsnCode || '');
    setEditingGst(item.customGstRate || item.gstRate || '18');
  };

  const handleSaveTaxDetails = () => {
    if (!editingItemId) return;
    updateItemTaxDetails(editingItemId, editingHsn, parseFloat(editingGst) || 18);
    toast.success('Tax details updated');
    setEditingItemId(null);
    setEditingHsn('');
    setEditingGst('18');
  };

  const calculateChange = () => {
    const paid = parseFloat(paidAmount) || 0;
    
    // Calculate effective total based on isGstBill flag
    let effectiveTotal = 0;
    cartItems.forEach(item => {
      const base = item.price * item.quantity;
      const gstRate = isGstBill ? (item.customGstRate || item.gstRate || 18) : 0;
      const tax = (base * gstRate) / 100;
      effectiveTotal += base + tax;
    });
    
    return paid - effectiveTotal;
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
      
      // Calculate effective total based on isGstBill flag
      let effectiveTotal = 0;
      cartItems.forEach(item => {
        const base = item.price * item.quantity;
        const gstRate = isGstBill ? (item.customGstRate || item.gstRate || 18) : 0;
        const tax = (base * gstRate) / 100;
        effectiveTotal += base + tax;
      });
      
      const saleData = {
        customer: customerInfo,
        items: cartItems.map((item, idx) => {
          // If not a GST bill, set everything to 0/empty
          if (!isGstBill) {
            const itemData = {
              product: item._id,
              quantity: item.quantity,
              price: item.price,
              hsnCode: '',
              gstRate: 0
            };
            return itemData;
          }

          // For GST bills: Priority: custom value > default value > fallback
          const finalHsn = (item.customHsnCode !== undefined && item.customHsnCode !== null) 
            ? String(item.customHsnCode).trim() 
            : (item.hsnCode ? String(item.hsnCode).trim() : '');
          
          const finalGst = (item.customGstRate !== undefined && item.customGstRate !== null 
            ? Number(item.customGstRate)
            : (item.gstRate !== undefined && item.gstRate !== null 
              ? Number(item.gstRate)
              : 18));

          const itemData = {
            product: item._id,
            quantity: item.quantity,
            price: item.price,
            hsnCode: finalHsn,
            gstRate: finalGst
          };
          
          return itemData;
        }),
        totalAmount: effectiveTotal,
        paymentMethod,
        paidAmount: paid,
        isGstBill
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
      const businessDetails = {
        gstin: user.businessDetails?.gstin || '',
        pan: user.businessDetails?.pan || '',
        address: user.businessDetails?.businessAddress || '',
        phone: user.businessDetails?.businessPhone || '',
        email: user.businessDetails?.businessEmail || '',
        bankDetails: user.businessDetails?.bankName && user.businessDetails?.accountNumber
          ? `${user.businessDetails.bankName}, Acc: ${user.businessDetails.accountNumber}, IFSC: ${user.businessDetails.ifscCode || 'N/A'}`
          : ''
      };
      await printInvoice(lastSale, user.shopName, businessDetails);
      toast.success('Invoice sent to printer');
    } catch (error) {
      toast.error('Failed to print invoice');
    }
  };

  const handleDownloadInvoice = async () => {
    if (!lastSale) return;
    try {
      const businessDetails = {
        gstin: user.businessDetails?.gstin || '',
        pan: user.businessDetails?.pan || '',
        address: user.businessDetails?.businessAddress || '',
        phone: user.businessDetails?.businessPhone || '',
        email: user.businessDetails?.businessEmail || '',
        bankDetails: user.businessDetails?.bankName && user.businessDetails?.accountNumber
          ? `${user.businessDetails.bankName}, Acc: ${user.businessDetails.accountNumber}, IFSC: ${user.businessDetails.ifscCode || 'N/A'}`
          : ''
      };
      await downloadInvoice(lastSale, user.shopName, businessDetails);
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
                  <p className="text-gray-600">Invoice #: <span className="font-semibold text-gray-900">{lastSale.invoiceNumber}</span></p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Product Search and List */}
        <div className="lg:col-span-2">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Select Products</h2>

          <div className="card mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="input-field flex-1 text-sm"
              />
              <button
                onClick={() => setShowBarcodeScanner(true)}
                className="btn-secondary whitespace-nowrap text-sm"
              >
                📱 Scan
              </button>
            </div>
          </div>

          {isLoading ? (
            <POSProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="card text-center py-8 text-gray-500 text-sm">
              No products available. Add some products first.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
              {products.map((product) => (
                <div key={product._id} className="card hover:shadow-lg transition">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-3 truncate">
                    {product.category} {product.barcode && `| ${product.barcode}`}
                  </p>
                  <div className="flex justify-between items-center mb-4 gap-2">
                    <span className="text-xl md:text-2xl font-bold text-indigo-600">
                      {formatCurrency(product.sellingPrice || product.price)}
                    </span>
                    <span className={`text-xs font-medium whitespace-nowrap ${product.quantity > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded`}>
                      {product.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity <= 0}
                    className="w-full btn-primary disabled:opacity-50 text-xs md:text-sm py-2"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart and Payment - Sticky on Desktop */}
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Invoice</h2>

          <div className="card sticky top-24 md:top-20 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Customer Information */}
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base text-blue-900">Customer Details</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Customer Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="input-field text-xs md:text-sm py-2"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Number *"
                  value={customerInfo.mobile}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
                  className="input-field text-xs md:text-sm py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Address (Optional)"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="input-field text-xs md:text-sm py-2"
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="input-field text-xs md:text-sm py-2"
                />
              </div>
            </div>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-6 md:py-8 text-xs md:text-sm">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-2 mb-4 md:mb-6 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex flex-col p-2 md:p-3 bg-gray-50 rounded border border-gray-200 gap-2">
                      <div className="flex justify-between items-start gap-1">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs md:text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 flex-shrink-0 font-semibold"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 bg-white rounded border border-gray-300 p-1.5">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded hover:bg-red-200 font-bold"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 0;
                            if (newQty > 0) {
                              updateQuantity(item._id, newQty);
                            }
                          }}
                          className="w-10 text-center text-xs md:text-sm font-bold border border-gray-300 rounded py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded hover:bg-green-200 font-bold"
                        >
                          +
                        </button>
                        <span className="text-xs md:text-sm font-semibold text-gray-700 ml-auto flex-shrink-0">
                          {(() => {
                            const baseAmount = item.price * item.quantity;
                            const gstRate = item.customGstRate || item.gstRate || 18;
                            const taxAmount = (baseAmount * gstRate) / 100;
                            const total = baseAmount + taxAmount;
                            return formatCurrency(total);
                          })()}
                        </span>
                      </div>

                      {/* HSN and GST Info with Amount Breakdown */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1.5 rounded border border-blue-200 text-xs md:text-sm">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <p className="text-gray-600 text-xs">HSN:</p>
                            <p className="font-semibold text-gray-900">{item.customHsnCode || item.hsnCode || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">GST:</p>
                            <p className="font-semibold text-indigo-600">{item.customGstRate || item.gstRate || 18}%</p>
                          </div>
                        </div>
                        
                        {/* Amount Breakdown */}
                        <div className="text-xs bg-white p-1 rounded mb-2 space-y-0.5">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Base:</span>
                            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(((item.price * item.quantity) * (item.customGstRate || item.gstRate || 18)) / 100)}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-0.5">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-indigo-600">
                              {formatCurrency((item.price * item.quantity) + (((item.price * item.quantity) * (item.customGstRate || item.gstRate || 18)) / 100))}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleEditTaxDetails(item)}
                          className="w-full px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded hover:bg-indigo-200 font-semibold"
                        >
                          Edit HSN & GST
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* HSN Code Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-xs">
                  <p className="text-blue-900 font-semibold mb-1">💡 Tip: Set HSN Codes</p>
                  <p className="text-blue-800">Click "Edit HSN & GST" on each item to set HSN/SAC codes for proper GST compliance on invoices.</p>
                </div>

                {/* Payment Section */}
                <div className="border-t pt-3 md:pt-4 space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="input-field text-xs md:text-sm py-2"
                    >
                      <option value="cash">💵 Cash</option>
                      <option value="card">💳 Card</option>
                      <option value="upi">📱 UPI</option>
                    </select>
                  </div>

                  {/* GST Bill Toggle */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isGstBill}
                        onChange={(e) => setIsGstBill(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-xs md:text-sm font-medium text-gray-700">
                        {isGstBill ? '✓ GST Bill' : '✗ Non-GST Bill'}
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 mt-2 ml-7">
                      {isGstBill ? 'GST will be applied' : 'No GST will be applied'}
                    </p>
                  </div>

                  {/* Amount Summary with Tax Breakdown */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 md:p-4 rounded-lg border-2 border-indigo-200 space-y-2">
                    {/* Calculate base and tax amounts */}
                    {(() => {
                      let baseTotal = 0;
                      let totalTax = 0;
                      cartItems.forEach(item => {
                        const base = item.price * item.quantity;
                        const gstRate = isGstBill ? (item.customGstRate || item.gstRate || 18) : 0;
                        const tax = (base * gstRate) / 100;
                        baseTotal += base;
                        totalTax += tax;
                      });
                      
                      const effectiveTotal = baseTotal + totalTax;
                      
                      return (
                        <>
                          <div className="flex justify-between text-xs text-gray-700">
                            <span>Subtotal (Base):</span>
                            <span className="font-semibold">{formatCurrency(baseTotal)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-green-700">
                            <span>Total Tax:</span>
                            <span className="font-semibold">+ {formatCurrency(totalTax)}</span>
                          </div>
                          <div className="border-t-2 border-indigo-300 pt-2 flex justify-between text-sm md:text-base font-bold text-indigo-700">
                            <span>Amount Due:</span>
                            <span>{formatCurrency(effectiveTotal)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Payment Amount */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      className="input-field mb-2 text-xs md:text-sm py-2"
                      placeholder="Enter amount"
                      step="0.01"
                    />
                    {paidAmount && (
                      <div className="text-xs md:text-sm font-semibold">
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
                    className="w-full btn-primary text-sm md:text-base py-2 md:py-3 disabled:opacity-50 font-bold"
                  >
                    {isProcessing ? 'Processing...' : '💰 Complete Payment'}
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full btn-secondary text-xs md:text-sm py-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Add Product</h2>
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(false);
                  setScannedBarcode('');
                  setProductFormErrors({});
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-6">Barcode: <span className="font-semibold text-indigo-600">{scannedBarcode}</span></p>

            <form onSubmit={handleAddNewProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, name: e.target.value });
                    if (productFormErrors.name) {
                      setProductFormErrors({ ...productFormErrors, name: '' });
                    }
                  }}
                  placeholder="Enter product name"
                  className={`input-field w-full ${productFormErrors.name ? 'border-red-500' : ''}`}
                />
                {productFormErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{productFormErrors.name}</p>
                )}
              </div>

              {/* Selling Price and Cost Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Price <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={newProduct.costPrice}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, costPrice: e.target.value });
                      if (productFormErrors.costPrice) {
                        setProductFormErrors({ ...productFormErrors, costPrice: '' });
                      }
                    }}
                    placeholder="0.00"
                    className={`input-field w-full ${productFormErrors.costPrice ? 'border-red-500' : ''}`}
                    step="0.01"
                  />
                  {productFormErrors.costPrice && (
                    <p className="text-red-500 text-sm mt-1">{productFormErrors.costPrice}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newProduct.sellingPrice}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, sellingPrice: e.target.value });
                      if (productFormErrors.sellingPrice) {
                        setProductFormErrors({ ...productFormErrors, sellingPrice: '' });
                      }
                    }}
                    placeholder="0.00"
                    className={`input-field w-full ${productFormErrors.sellingPrice ? 'border-red-500' : ''}`}
                    step="0.01"
                  />
                  {productFormErrors.sellingPrice && (
                    <p className="text-red-500 text-sm mt-1">{productFormErrors.sellingPrice}</p>
                  )}
                </div>
              </div>

              {/* Quantity and Min Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, quantity: e.target.value });
                      if (productFormErrors.quantity) {
                        setProductFormErrors({ ...productFormErrors, quantity: '' });
                      }
                    }}
                    placeholder="0"
                    className={`input-field w-full ${productFormErrors.quantity ? 'border-red-500' : ''}`}
                  />
                  {productFormErrors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{productFormErrors.quantity}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Stock <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, minStock: e.target.value });
                      if (productFormErrors.minStock) {
                        setProductFormErrors({ ...productFormErrors, minStock: '' });
                      }
                    }}
                    placeholder="5"
                    className={`input-field w-full ${productFormErrors.minStock ? 'border-red-500' : ''}`}
                  />
                  {productFormErrors.minStock && (
                    <p className="text-red-500 text-sm mt-1">{productFormErrors.minStock}</p>
                  )}
                </div>
              </div>

              {/* Category and SKU */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="General"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="e.g., SKU123"
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* HSN/SAC Code and GST Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HSN/SAC Code <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newProduct.hsnCode}
                    onChange={(e) => setNewProduct({ ...newProduct, hsnCode: e.target.value })}
                    placeholder="e.g., 27090010"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Rate (%) <span className="text-gray-500 text-xs">(Default: 18%)</span>
                  </label>
                  <select
                    value={newProduct.gstRate}
                    onChange={(e) => setNewProduct({ ...newProduct, gstRate: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description"
                  rows="3"
                  className="input-field w-full resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Adding...' : '✓ Add & To Cart'}
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    setShowProductForm(false);
                    setScannedBarcode('');
                    setProductFormErrors({});
                  }}
                  className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Quantity Modal */}
      {selectedProductForAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="bg-indigo-600 text-white px-4 md:px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold">Add to Cart</h2>
              <button
                onClick={() => setSelectedProductForAdd(null)}
                className="text-white hover:bg-indigo-700 rounded-full p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedProductForAdd.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Price: <span className="font-semibold text-indigo-600">{formatCurrency(selectedProductForAdd.price)}</span></p>
                <p className="text-sm text-gray-600">Available: <span className="font-semibold text-green-600">{selectedProductForAdd.quantity}</span></p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantity to Add
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setQuickAddQuantity(Math.max(1, parseInt(quickAddQuantity) - 1).toString())}
                    className="px-4 py-2 bg-red-100 text-red-600 text-lg rounded hover:bg-red-200 font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quickAddQuantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d+$/.test(val)) {
                        setQuickAddQuantity(val);
                      }
                    }}
                    className="w-20 text-center text-2xl font-bold border-2 border-indigo-300 rounded py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                  />
                  <button
                    onClick={() => setQuickAddQuantity((parseInt(quickAddQuantity) + 1).toString())}
                    className="px-4 py-2 bg-green-100 text-green-600 text-lg rounded hover:bg-green-200 font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-3">
                  Total: <span className="font-bold text-lg text-indigo-600">{formatCurrency(selectedProductForAdd.price * parseInt(quickAddQuantity || 1))}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAdd}
                  className="btn-primary flex-1 py-3 text-base font-bold"
                >
                  ✓ Add to Cart
                </button>
                <button
                  onClick={() => setSelectedProductForAdd(null)}
                  className="btn-secondary flex-1 py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* HSN and GST Editor Modal - Redesigned */}
{editingItemId && (() => {
    const currentItem = cartItems.find(item => item._id === editingItemId);
    if (!currentItem) return null;
    
    const taxableAmount = currentItem.price * currentItem.quantity;
    const gstRate = parseFloat(editingGst) || 0;
    const taxAmount = (taxableAmount * gstRate) / 100;
    const totalAmount = taxableAmount + taxAmount;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative"
            >
                {/* Decorative Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

                {/* Header */}
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                            Tax <span className="text-indigo-600">Config</span>
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Regulatory Adjustment</p>
                    </div>
                    <button
                        onClick={() => setEditingItemId(null)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                    >
                        <MdClose size={20} />
                    </button>
                </div>

                {/* Glass Product Info Card */}
                <div className="bg-slate-900 rounded-3xl p-5 mb-8 text-white shadow-xl shadow-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                        <MdOutlineInventory2 size={24} className="text-indigo-300" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-black text-sm uppercase tracking-tight truncate">{currentItem.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 tabular-nums">
                            {currentItem.quantity} Units <span className="mx-2 text-slate-600">|</span> Rs {currentItem.price.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* HSN Code Input */}
                    <div className="relative">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">HSN/SAC Code</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={editingHsn}
                                onChange={(e) => setEditingHsn(e.target.value)}
                                placeholder="8517..."
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:border-indigo-500 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <MdQrCodeScanner size={20} />
                            </div>
                        </div>
                    </div>

                    {/* GST Rate Selection */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-1">GST Rate (%)</label>
                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {[0, 5, 12, 18, 28].map((rate) => (
                                <button
                                    key={rate}
                                    onClick={() => setEditingGst(rate.toString())}
                                    className={`py-3 rounded-xl text-[11px] font-black transition-all border-2 ${
                                        parseFloat(editingGst) === rate
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200'
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                    }`}
                                >
                                    {rate}%
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            value={editingGst}
                            onChange={(e) => setEditingGst(e.target.value)}
                            placeholder="Custom GST %"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-5 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>

                    {/* Pro Breakdown Summary */}
                    <div className="bg-indigo-50/50 rounded-[2rem] p-6 border border-indigo-100/50">
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Base Taxable</span>
                                <span className="text-slate-900 tabular-nums">Rs {taxableAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>GST @ {gstRate}%</span>
                                <span className="text-indigo-600 tabular-nums">+ Rs {taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="pt-4 border-t border-indigo-100 flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Final Invoice Amount</p>
                                    <p className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">
                                        Rs {totalAmount.toFixed(2)}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <MdCheck size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleSaveTaxDetails}
                            className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                        >
                            Commit Changes
                        </button>
                        <button
                            onClick={() => setEditingItemId(null)}
                            className="flex-1 bg-slate-50 text-slate-400 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            Abort
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
})()}
    </Layout>
  );
}
