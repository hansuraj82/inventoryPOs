// import React, { useEffect, useState, useRef } from 'react';
// import toast from 'react-hot-toast';
// import Layout from '../components/Layout';
// import BarcodeScanner from '../components/BarcodeScanner';
// import PriceHistoryModal from '../components/PriceHistoryModal';
// import { productAPI } from '../services/api';
// import { debounce, formatCurrency } from '../utils/helpers';
// import { ProductTableSkeleton, ProductCardSkeleton } from '../components/Skeletons';

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [priceHistoryModal, setPriceHistoryModal] = useState({ isOpen: false, product: null });

//   useEffect(() => {
//     document.title = 'Products - Dukanbill';
//   }, []);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [scannedBarcode, setScannedBarcode] = useState('');
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
//   const barcodeInputRef = useRef(null);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [totalCount, setTotalCount] = useState(0);
//   const pageSize = 10;
//   const [formData, setFormData] = useState({
//     name: '',
//     costPrice: '',
//     sellingPrice: '',
//     quantity: '',
//     barcode: '',
//     category: 'General',
//     sku: '',
//     hsnCode: '',
//     gstRate: '18',
//     description: '',
//     minStock: '5'
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async (page = 1, isLoadMore = false) => {
//     try {
//       setIsLoading(true);
//       const response = await productAPI.getAll(page, pageSize);
//       const paginatedProducts = response.data.data || [];
      
//       if (isLoadMore) {
//         setProducts(prev => [...prev, ...paginatedProducts]);
//       } else {
//         setProducts(paginatedProducts);
//       }
      
//       setCurrentPage(page);
//       setTotalCount(response.data.totalCount || 0);
//       setHasMore(page < response.data.totalPages);
//     } catch (error) {
//       toast.error('Failed to fetch products');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = debounce(async (query) => {
//     if (!query) {
//       setCurrentPage(1);
//       setHasMore(true);
//       fetchProducts(1);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await productAPI.search(query, 1, pageSize);
//       const searchResults = response.data.data || [];
//       setProducts(searchResults);
//       setCurrentPage(1);
//       setTotalCount(response.data.totalCount || 0);
//       setHasMore(1 < response.data.totalPages);
//     } catch (error) {
//       toast.error('Search failed');
//     } finally {
//       setIsLoading(false);
//     }
//   }, 500);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     handleSearch(e.target.value);
//   };

//   const handleBarcodeScanned = async (barcode) => {
//     setScannedBarcode(barcode);
//     setShowBarcodeScanner(false);

//     // Try to find product by barcode
//     try {
//       const response = await productAPI.getByBarcode(barcode);
//       if (response.data.success) {
//         // Product exists, show it in form for verification/editing
//         const product = response.data.data;
//         setFormData({
//           name: product.name,
//           costPrice: product.costPrice?.toString() || '',
//           sellingPrice: product.sellingPrice?.toString() || '',
//           quantity: product.quantity.toString(),
//           barcode: product.barcode || '',
//           category: product.category || 'General',
//           sku: product.sku || '',
//           hsnCode: product.hsnCode || '',
//           gstRate: product.gstRate?.toString() || '18',
//           description: product.description || '',
//           minStock: product.minStock?.toString() || '5'
//         });
//         setEditingId(product._id);
//         setShowForm(true);
//         toast.success(`Product found: ${product.name}`);
//       }
//     } catch (error) {
//       // Product not found, create new with this barcode
//       setFormData({
//         name: '',
//         costPrice: '',
//         sellingPrice: '',
//         quantity: '',
//         barcode: barcode,
//         category: 'General',
//         sku: '',
//         hsnCode: '',
//         gstRate: '18',
//         description: '',
//         minStock: '5'
//       });
//       setEditingId(null);
//       setShowForm(true);
//       toast.info('Product not found. Fill details to create new.');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.costPrice || !formData.sellingPrice) {
//       toast.error('Please fill in all required fields: name, cost price, and selling price');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       // Convert string values to numbers
//       const dataToSend = {
//         ...formData,
//         costPrice: parseFloat(formData.costPrice),
//         sellingPrice: parseFloat(formData.sellingPrice),
//         quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
//         gstRate: parseInt(formData.gstRate) || 18,
//         minStock: formData.minStock ? parseFloat(formData.minStock) : 5
//       };

//       if (editingId) {
//         await productAPI.update(editingId, dataToSend);
//         toast.success('Product updated successfully');
//         setEditingId(null);
//       } else {
//         await productAPI.create(dataToSend);
//         toast.success('Product added successfully');
//       }

//       setFormData({
//         name: '',
//         costPrice: '',
//         sellingPrice: '',
//         quantity: '',
//         barcode: '',
//         category: 'General',
//         sku: '',
//         hsnCode: '',
//         gstRate: '18',
//         description: '',
//         minStock: '5'
//       });
//       setShowForm(false);
//       setCurrentPage(1);
//       setHasMore(true);
//       fetchProducts(1);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to save product');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEdit = (product) => {
//     setFormData({
//       name: product.name,
//       costPrice: product.costPrice?.toString() || '',
//       sellingPrice: product.sellingPrice?.toString() || '',
//       quantity: product.quantity.toString(),
//       barcode: product.barcode || '',
//       category: product.category || 'General',
//       sku: product.sku || '',
//       hsnCode: product.hsnCode || '',
//       gstRate: product.gstRate?.toString() || '18',
//       description: product.description || '',
//       minStock: product.minStock.toString()
//     });
//     setEditingId(product._id);
//     setShowForm(true);
//   };

//   const handleViewPriceHistory = (product) => {
//     setPriceHistoryModal({ isOpen: true, product });
//   };

//   const handleDelete = async (id) => {
//     const product = products.find(p => p._id === id);
//     setDeleteModal({ isOpen: true, product });
//   };

//   const handleConfirmDelete = async () => {
//     if (!deleteModal.product) return;

//     try {
//       setIsLoading(true);
//       await productAPI.delete(deleteModal.product._id);
//       toast.success('Product deleted successfully');
//       setDeleteModal({ isOpen: false, product: null });
//       setCurrentPage(1);
//       setHasMore(true);
//       fetchProducts(1);
//     } catch (error) {
//       toast.error('Failed to delete product');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setEditingId(null);
//     setScannedBarcode('');
//     setFormData({
//       name: '',
//       costPrice: '',
//       sellingPrice: '',
//       quantity: '',
//       barcode: '',
//       category: 'General',
//       sku: '',
//       hsnCode: '',
//       gstRate: '18',
//       description: '',
//       minStock: '5'
//     });
//   };

//   const handleLoadMore = () => {
//     fetchProducts(currentPage + 1, true);
//   };

//   return (
//     <Layout>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="btn-primary w-full sm:w-auto text-sm md:text-base"
//         >
//           {showForm ? 'Cancel' : '+ Add Product'}
//         </button>
//       </div>

//       {showForm && (
//         <div className="card mb-6 md:mb-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
//             <h2 className="text-lg md:text-xl font-bold text-gray-900">
//               {editingId ? 'Edit Product' : 'Add New Product'}
//             </h2>
//             <button
//               onClick={() => setShowBarcodeScanner(true)}
//               className="btn-secondary flex items-center gap-2 text-xs md:text-sm w-full sm:w-auto justify-center"
//             >
//               📱 Scan Barcode
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 Product Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="input-field text-xs md:text-sm"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 Cost Price *
//               </label>
//               <input
//                 type="number"
//                 name="costPrice"
//                 value={formData.costPrice}
//                 onChange={handleChange}
//                 className="input-field text-xs md:text-sm"
//                 step="0.01"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 Selling Price *
//               </label>
//               <input
//                 type="number"
//                 name="sellingPrice"
//                 value={formData.sellingPrice}
//                 onChange={handleChange}
//                 className="input-field text-xs md:text-sm"
//                 step="0.01"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 Quantity
//               </label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={formData.quantity}
//                 onChange={handleChange}
//                 className="input-field text-xs md:text-sm"
//               />
//             </div>

//             <div className="col-span-1 md:col-span-2">
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 Barcode {scannedBarcode && '(Scanned)'}
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   name="barcode"
//                   value={formData.barcode}
//                   onChange={handleChange}
//                   ref={barcodeInputRef}
//                   className="input-field flex-1 text-xs md:text-sm"
//                   placeholder="Barcode (from scanner or manual entry)"
//                 />
//                 {scannedBarcode && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setScannedBarcode('');
//                       setFormData({ ...formData, barcode: '' });
//                     }}
//                     className="px-2 md:px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs md:text-sm font-medium whitespace-nowrap"
//                   >
//                     Clear
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <input
//                 type="text"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="input-field text-xs md:text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 Min Stock
//               </label>
//               <input
//                 type="number"
//                 name="minStock"
//                 value={formData.minStock}
//                 onChange={handleChange}
//                 className="input-field text-xs md:text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 SKU
//               </label>
//               <input
//                 type="text"
//                 name="sku"
//                 value={formData.sku}
//                 onChange={handleChange}
//                 placeholder="e.g., SKU123"
//                 className="input-field text-xs md:text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 HSN/SAC Code
//               </label>
//               <input
//                 type="text"
//                 name="hsnCode"
//                 value={formData.hsnCode}
//                 onChange={handleChange}
//                 placeholder="e.g., 27090010"
//                 className="input-field text-xs md:text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 GST Rate (%)
//               </label>
//               <select
//                 name="gstRate"
//                 value={formData.gstRate}
//                 onChange={handleChange}
//                 className="input-field text-xs md:text-sm"
//               >
//                 <option value="0">0%</option>
//                 <option value="5">5%</option>
//                 <option value="12">12%</option>
//                 <option value="18">18%</option>
//                 <option value="28">28%</option>
//               </select>
//             </div>

//             <div className="col-span-1 md:col-span-2">
//               <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Enter product description"
//                 rows="3"
//                 className="input-field text-xs md:text-sm resize-none"
//               />
//             </div>

//             <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-3">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="btn-primary flex-1 disabled:opacity-50 text-xs md:text-sm"
//               >
//                 {isLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="btn-secondary flex-1 text-xs md:text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       <div className="card mb-6 md:mb-8">
//         <input
//           type="text"
//           placeholder="Search by name or barcode..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//           className="input-field text-xs md:text-sm"
//         />
//       </div>

//       {isLoading && !showForm ? (
//         <>
//           {/* Desktop Skeleton */}
//           <div className="hidden md:block">
//             <ProductTableSkeleton />
//           </div>

//           {/* Mobile Skeleton */}
//           <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {[1, 2, 3, 4, 5, 6].map((n) => (
//               <ProductCardSkeleton key={n} />
//             ))}
//           </div>
//         </>
//       ) : products.length === 0 ? (
//         <div className="text-center py-8 text-gray-500 text-sm">No products found</div>
//       ) : (
//         <>
//           {/* Desktop Table View */}
//           <div className="hidden md:block card overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-100 border-b">
//                   <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Name</th>
//                   <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Cost</th>
//                   <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Selling</th>
//                   <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Qty</th>
//                   <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Category</th>
//                   <th className="px-3 lg:px-4 py-3 text-left font-semibold text-gray-900">Barcode</th>
//                   <th className="px-3 lg:px-4 py-3 text-center font-semibold text-gray-900">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product) => (
//                   <tr key={product._id} className="border-b hover:bg-gray-50">
//                     <td className="px-3 lg:px-4 py-3 font-medium text-gray-900">{product.name}</td>
//                     <td className="px-3 lg:px-4 py-3">{formatCurrency(product.costPrice || 0)}</td>
//                     <td className="px-3 lg:px-4 py-3">{formatCurrency(product.sellingPrice || 0)}</td>
//                     <td className="px-3 lg:px-4 py-3">
//                       <span className={product.quantity <= product.minStock ? 'text-red-600 font-semibold' : ''}>
//                         {product.quantity}
//                       </span>
//                     </td>
//                     <td className="px-3 lg:px-4 py-3 text-xs">{product.category}</td>
//                     <td className="px-3 lg:px-4 py-3 font-mono text-xs">{product.barcode || '-'}</td>
//                     <td className="px-3 lg:px-4 py-3 text-center space-x-2">
//                       <button
//                         onClick={() => handleViewPriceHistory(product)}
//                         className="p-2 bg-blue-100 text-blue-600 rounded text-xs font-medium hover:bg-blue-200"
//                         title="View Price History"
//                       >
//                         📈 Price
//                       </button>
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="p-2 bg-indigo-100 text-indigo-600 rounded text-xs font-medium hover:bg-indigo-200"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product._id)}
//                         className="p-2 bg-red-100 text-red-600 rounded text-xs font-medium hover:bg-red-200"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {products.map((product) => (
//               <div key={product._id} className="card">
//                 <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">{product.name}</h3>
//                 <div className="space-y-1 text-xs mb-3">
//                   <p className="text-gray-600">
//                     <span className="font-medium">Cost:</span> {formatCurrency(product.costPrice || 0)}
//                   </p>
//                   <p className="text-gray-600">
//                     <span className="font-medium">Sell:</span> {formatCurrency(product.sellingPrice || 0)}
//                   </p>
//                   <p className={product.quantity <= product.minStock ? 'text-red-600 font-semibold' : 'text-gray-600'}>
//                     <span className="font-medium">Qty:</span> {product.quantity}
//                   </p>
//                   <p className="text-gray-600">
//                     <span className="font-medium">Cat:</span> {product.category}
//                   </p>
//                   {product.barcode && (
//                     <p className="text-gray-600 font-mono text-xs">
//                       <span className="font-medium">Bar:</span> {product.barcode}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleViewPriceHistory(product)}
//                     className="flex-1 py-2 bg-blue-100 text-blue-600 rounded text-xs font-medium hover:bg-blue-200"
//                   >
//                     📈 Price
//                   </button>
//                   <button
//                     onClick={() => handleEdit(product)}
//                     className="flex-1 py-2 bg-indigo-100 text-indigo-600 rounded text-xs font-medium hover:bg-indigo-200"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product._id)}
//                     className="flex-1 py-2 bg-red-100 text-red-600 rounded text-xs font-medium hover:bg-red-200"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination Info & Load More Button */}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 px-4 py-3 bg-gray-50 rounded-lg">
//             <p className="text-xs md:text-sm text-gray-600">
//               Showing {products.length} of {totalCount} products
//             </p>
//             {hasMore && (
//               <button
//                 onClick={handleLoadMore}
//                 disabled={isLoading}
//                 className="btn-primary text-xs md:text-sm px-4 py-2 disabled:opacity-50 w-full sm:w-auto"
//               >
//                 {isLoading ? 'Loading...' : '⬇ Load More'}
//               </button>
//             )}
//           </div>
//         </>
//       )}

//       {showBarcodeScanner && (
//         <BarcodeScanner
//           onScan={handleBarcodeScanned}
//           onClose={() => setShowBarcodeScanner(false)}
//         />
//       )}

//       {/* Price History Modal */}
//       <PriceHistoryModal
//         product={priceHistoryModal.product}
//         isOpen={priceHistoryModal.isOpen}
//         onClose={() => setPriceHistoryModal({ isOpen: false, product: null })}
//       />

//       {/* Delete Confirmation Modal */}
//       {deleteModal.isOpen && deleteModal.product && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden">
//             {/* Header */}
//             <div className="bg-red-50 border-b border-red-200 px-4 md:px-6 py-4">
//               <h2 className="text-lg md:text-xl font-bold text-red-900">Delete Product</h2>
//             </div>

//             {/* Content */}
//             <div className="p-4 md:p-6">
//               <div className="mb-4">
//                 <p className="text-gray-600 mb-4 text-sm md:text-base">
//                   Are you sure you want to delete this product?
//                 </p>
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                   <p className="text-sm text-gray-600 mb-2">
//                     <span className="font-semibold">Product:</span> {deleteModal.product.name}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-2">
//                     <span className="font-semibold">Category:</span> {deleteModal.product.category}
//                   </p>
//                   {deleteModal.product.barcode && (
//                     <p className="text-sm text-gray-600">
//                       <span className="font-semibold">Barcode:</span> {deleteModal.product.barcode}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-6">
//                 <p className="text-xs md:text-sm text-yellow-800">
//                   ⚠️ This action cannot be undone!
//                 </p>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="border-t bg-gray-50 px-4 md:px-6 py-4 flex gap-3">
//               <button
//                 onClick={() => setDeleteModal({ isOpen: false, product: null })}
//                 className="flex-1 btn-secondary py-2 text-sm md:text-base"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 disabled={isLoading}
//                 className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition text-sm md:text-base"
//               >
//                 {isLoading ? 'Deleting...' : 'Delete Product'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }









import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiTrendingUp, 
   FiX, FiAlertTriangle, FiChevronLeft, FiChevronRight, FiPackage 
} from 'react-icons/fi';
import Layout from '../components/Layout';
import BarcodeScanner from '../components/BarcodeScanner';
import PriceHistoryModal from '../components/PriceHistoryModal';
import { productAPI } from '../services/api';
import { debounce, formatCurrency } from '../utils/helpers';
import { ProductTableSkeleton, ProductCardSkeleton } from '../components/Skeletons';
import { ScanBarcode } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [priceHistoryModal, setPriceHistoryModal] = useState({ isOpen: false, product: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const barcodeInputRef = useRef(null);

  // Pagination state (Backend-driven)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    hsnCode: '',
    gstRate: '18',
    description: '',
    minStock: '5'
  });

  useEffect(() => {
    document.title = 'Products - Dukanbill';
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await productAPI.getAll(page, pageSize);
      setProducts(response.data.data || []);
      setTotalCount(response.data.totalCount || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = debounce(async (query) => {
    if (!query) {
      setCurrentPage(1);
      fetchProducts(1);
      return;
    }

    try {
      setIsLoading(true);
      const response = await productAPI.search(query, 1, pageSize);
      setProducts(response.data.data || []);
      setCurrentPage(1);
      setTotalCount(response.data.totalCount || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  }, 400);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const handleBarcodeScanned = async (barcode) => {
    setScannedBarcode(barcode);
    setShowBarcodeScanner(false);

    try {
      const response = await productAPI.getByBarcode(barcode);
      if (response.data.success) {
        const product = response.data.data;
        setFormData({
          name: product.name,
          costPrice: product.costPrice?.toString() || '',
          sellingPrice: product.sellingPrice?.toString() || '',
          quantity: product.quantity.toString(),
          barcode: product.barcode || '',
          category: product.category || 'General',
          sku: product.sku || '',
          hsnCode: product.hsnCode || '',
          gstRate: product.gstRate?.toString() || '18',
          description: product.description || '',
          minStock: product.minStock?.toString() || '5'
        });
        setEditingId(product._id);
        setShowFormModal(true);
        toast.success(`Product found: ${product.name}`);
      }
    } catch (error) {
      setFormData({
        name: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '',
        barcode: barcode,
        category: 'General',
        sku: '',
        hsnCode: '',
        gstRate: '18',
        description: '',
        minStock: '5'
      });
      setEditingId(null);
      setShowFormModal(true);
      toast.success('Barcode captured. Fill details to create new product.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.costPrice || !formData.sellingPrice) {
      toast.error('Please fill in required fields: name, cost price, and selling price');
      return;
    }

    try {
      setIsLoading(true);
      const dataToSend = {
        ...formData,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
        gstRate: parseInt(formData.gstRate) || 18,
        minStock: formData.minStock ? parseFloat(formData.minStock) : 5,
        barcode: (formData.barcode && formData.barcode.trim() !== '') ? formData.barcode.trim() : undefined
      };

      if (editingId) {
        await productAPI.update(editingId, dataToSend);
        toast.success('Product updated successfully');
      } else {
        await productAPI.create(dataToSend);
        toast.success('Product added successfully');
      }

      handleCloseModal();
      fetchProducts(currentPage);
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
      sku: product.sku || '',
      hsnCode: product.hsnCode || '',
      gstRate: product.gstRate?.toString() || '18',
      description: product.description || '',
      minStock: product.minStock.toString()
    });
    setEditingId(product._id);
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditingId(null);
    setScannedBarcode('');
    setFormData({
      name: '',
      costPrice: '',
      sellingPrice: '',
      quantity: '',
      barcode: '',
      category: 'General',
      sku: '',
      hsnCode: '',
      gstRate: '18',
      description: '',
      minStock: '5'
    });
  };

  const handleDelete = (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.product) return;

    try {
      setIsLoading(true);
      await productAPI.delete(deleteModal.product._id);
      toast.success('Product deleted successfully');
      setDeleteModal({ isOpen: false, product: null });
      fetchProducts(currentPage);
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* HEADER & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Products Management</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">Manage inventory, barcodes, pricing, and stock levels</p>
        </div>
        <button
          onClick={() => setShowFormModal(true)}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 text-sm py-2.5 px-5"
        >
          <FiPlus className="text-lg" /> Add New Product
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
        <FiSearch className="text-slate-400 text-lg ml-1" />
        <input
          type="text"
          placeholder="Search products by name or scan barcode..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-transparent border-none focus:outline-none text-slate-800 text-sm placeholder-slate-400"
        />
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); fetchProducts(1); }} className="text-xs text-slate-400 hover:text-slate-600">
            Clear
          </button>
        )}
      </div>

      {/* PRODUCT LIST / SKELEtons */}
      {isLoading && products.length === 0 ? (
        <>
          <div className="hidden md:block"><ProductTableSkeleton /></div>
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => <ProductCardSkeleton key={n} />)}
          </div>
        </>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 my-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center text-2xl mx-auto">
            <FiPackage />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No products found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">Get started by adding your first store inventory item or scanning a barcode.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  <th className="px-5 py-4">Product Name</th>
                  <th className="px-4 py-4">Cost Price</th>
                  <th className="px-4 py-4">Selling Price</th>
                  <th className="px-4 py-4">Stock Qty</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Barcode</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-semibold text-slate-800">{product.name}</td>
                    <td className="px-4 py-4 text-slate-600 font-medium">{formatCurrency(product.costPrice || 0)}</td>
                    <td className="px-4 py-4 text-slate-900 font-bold">{formatCurrency(product.sellingPrice || 0)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.quantity <= product.minStock ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 text-xs font-medium">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md">{product.category}</span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-500">{product.barcode || '—'}</td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setPriceHistoryModal({ isOpen: true, product })}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition"
                          title="View Price History"
                        >
                          <FiTrendingUp className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition"
                          title="Edit Product"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition"
                          title="Delete Product"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-sm">{product.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      product.quantity <= product.minStock ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      Qty: {product.quantity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Cost Price</span>
                      <strong className="text-slate-800">{formatCurrency(product.costPrice || 0)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Selling Price</span>
                      <strong className="text-indigo-600">{formatCurrency(product.sellingPrice || 0)}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setPriceHistoryModal({ isOpen: true, product })}
                    className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-100 transition"
                  >
                    <FiTrendingUp /> Price
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-100 transition"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BACKEND PAGINATION BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500">
              Showing page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong> ({totalCount} total items)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition"
              >
                <FiChevronLeft /> Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isLoading}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition"
              >
                Next <FiChevronRight />
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- ADD / EDIT PRODUCT POPUP MODAL --- */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-slate-100 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Product Details' : 'Create New Product'}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBarcodeScanner(true)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ScanBarcode  /> Scan Barcode
                </button>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cost Price (₹) *</label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Low Stock Alert (Min)</label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Barcode</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    ref={barcodeInputRef}
                    placeholder="Leave blank or scan barcode"
                    className="flex-1 text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-mono text-xs"
                  />
                  {formData.barcode && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, barcode: '' })}
                      className="px-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GST Rate (%)</label>
                <select
                  name="gstRate"
                  value={formData.gstRate}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g., SKU123"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">HSN / SAC Code</label>
                <input
                  type="text"
                  name="hsnCode"
                  value={formData.hsnCode}
                  onChange={handleChange}
                  placeholder="e.g., 27090010"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Optional product description..."
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <div className="sm:col-span-2 pt-3 flex gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
                >
                  {isLoading ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARCODE SCANNER MODAL */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* PRICE HISTORY MODAL */}
      <PriceHistoryModal
        product={priceHistoryModal.product}
        isOpen={priceHistoryModal.isOpen}
        onClose={() => setPriceHistoryModal({ isOpen: false, product: null })}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && deleteModal.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden">
            <div className="bg-red-50 p-5 border-b border-red-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-lg shrink-0">
                <FiAlertTriangle />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-sm">Delete Product</h3>
                <p className="text-xs text-red-600">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-600">Are you sure you want to permanently delete this product from your inventory?</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div><strong className="text-slate-800">Name:</strong> {deleteModal.product.name}</div>
                <div><strong className="text-slate-800">Category:</strong> {deleteModal.product.category}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setDeleteModal({ isOpen: false, product: null })}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-lg shadow-red-600/30"
              >
                {isLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}