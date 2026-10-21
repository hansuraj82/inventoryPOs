// import React, { useEffect, useState, useRef } from 'react';
// import toast from 'react-hot-toast';
// import Layout from '../components/Layout';
// import { saleAPI } from '../services/api';
// import { useAuthStore } from '../store/store';
// import { formatCurrency, formatDate } from '../utils/helpers';
// import { downloadInvoice, printInvoice } from '../utils/invoice';
// import { SaleTableSkeleton, SaleMobileListSkeleton } from '../components/Skeletons';

// export default function Sales() {

  
//   const [sales, setPublicSales] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [expandedId, setExpandedId] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const debounceTimer = useRef(null);
//   const { user } = useAuthStore();


//   useEffect(() => {
//     document.title = 'Sales - Dukanbill';
//   }, []);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [totalCount, setTotalCount] = useState(0);
//   const pageSize = 15;

//   // Edit form state
//   const [editingSale, setEditingSale] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     document.title = 'Sales - Dukanbill';
//   }, []);

//   useEffect(() => {
//     fetchSales();
//   }, []);

//   const fetchSales = async (page = 1, isLoadMore = false) => {
//     try {
//       setIsLoading(true);
//       const response = await saleAPI.getAll(page, pageSize);
//       const paginatedSales = response.data.data || [];

//       if (isLoadMore) {
//         setPublicSales(prev => [...prev, ...paginatedSales]);
//       } else {
//         setPublicSales(paginatedSales);
//       }

//       setCurrentPage(page);
//       setTotalCount(response.data.totalCount || 0);
//       setHasMore(page < response.data.totalPages);
//     } catch (error) {
//       toast.error('Failed to fetch sales');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);

//     if (debounceTimer.current) {
//       clearTimeout(debounceTimer.current);
//     }

//     if (!query.trim()) {
//       setCurrentPage(1);
//       setHasMore(true);
//       fetchSales(1);
//       return;
//     }

//     debounceTimer.current = setTimeout(() => {
//       searchSales(query);
//     }, 500);
//   };

//   const searchSales = async (query) => {
//     try {
//       if (query.trim().length === 0) {
//         setCurrentPage(1);
//         setHasMore(true);
//         fetchSales(1);
//         return;
//       }

//       if (query.length > 100) {
//         toast.error('Search query is too long (max 100 characters)');
//         return;
//       }

//       setIsSearching(true);
//       const response = await saleAPI.search(query, 1, pageSize);
//       const searchResults = response.data.data || [];
//       setPublicSales(searchResults);
//       setCurrentPage(1);
//       setTotalCount(response.data.totalCount || 0);
//       setHasMore(1 < response.data.totalPages);

//       if (response.data.count === 0) {
//         toast.error('No sales found matching your search');
//       }
//     } catch (error) {
//       console.error('Search error:', error);
//       if (error.response?.status === 400) {
//         toast.error(error.response.data.message || 'Invalid search query. Please try with simpler text.');
//       } else {
//         toast.error('Failed to search sales');
//       }
//       setCurrentPage(1);
//       setHasMore(true);
//       fetchSales(1);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handlePrint = async (sale) => {
//     try {
//       const businessDetails = {
//         gstin: user.businessDetails?.gstin || '',
//         pan: user.businessDetails?.pan || '',
//         address: user.businessDetails?.businessAddress || '',
//         phone: user.businessDetails?.businessPhone || '',
//         email: user.businessDetails?.businessEmail || '',
//         upiId: user.businessDetails?.upiId || '',
//         bankDetails: user.businessDetails?.bankName && user.businessDetails?.accountNumber
//           ? `${user.businessDetails.bankName}, Acc: ${user.businessDetails.accountNumber}, IFSC: ${user.businessDetails.ifscCode || 'N/A'}`
//           : '',
//         bankName: user.businessDetails.bankName,
//         accountNumber: user.businessDetails.accountNumber,
//         ifscCode: user.businessDetails.ifscCode,
//         holderName: user.name.toUpperCase()
        
//       };
//       await printInvoice(sale, user.shopName, businessDetails);
//       toast.success('Invoice sent to printer');
//     } catch (error) {
//       console.log(`error is ${error}`);
//       toast.error('Failed to print invoice');
//     }
//   };

//   const handleDownload = async (sale) => {
//     try {
//       const businessDetails = {
//         gstin: user.businessDetails?.gstin || '',
//         pan: user.businessDetails?.pan || '',
//         address: user.businessDetails?.businessAddress || '',
//         phone: user.businessDetails?.businessPhone || '',
//         email: user.businessDetails?.businessEmail || '',
//         bankDetails: user.businessDetails?.bankName && user.businessDetails?.accountNumber
//           ? `${user.businessDetails.bankName}, Acc: ${user.businessDetails.accountNumber}, IFSC: ${user.businessDetails.ifscCode || 'N/A'}`
//           : '',
//         bankName: user.businessDetails.bankName,
//         accountNumber: user.businessDetails.accountNumber,
//         ifscCode: user.businessDetails.ifscCode,
//         holderName: user.name.toUpperCase()
//       };
//       await downloadInvoice(sale, user.shopName, businessDetails);
//       toast.success('Invoice downloaded');
//     } catch (error) {
//       toast.error('Failed to download invoice');
//     }
//   };

//   // Open edit modal and populate clone of sale object
//   const startEdit = (sale) => {
//     setEditingSale(JSON.parse(JSON.stringify(sale))); // deep clone
//   };

//   // Live recalculations for edited items
//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...editingSale.items];
//     const item = updatedItems[index];

//     // Direct assignment of updated field value
//     item[field] = value;

//     // Convert values safely for mathematical calculations
//     const qty = Number(field === 'quantity' ? value : item.quantity) || 0;
//     const rate = Number(field === 'price' ? value : item.price) || 0;
//     const gstRate = Number(field === 'gstRate' ? value : item.gstRate) || 0;

//     // Manage discounts nested object safely
//     let discVal = item.discount?.value || 0;
//     if (field === 'discountValue') {
//       discVal = Number(value) || 0;
//       item.discount = { ...item.discount, value: discVal, amount: discVal, type: "fixed" };
//     }

//     // Calculations based on standard India GST rules
//     const rawSubtotal = qty * rate;
//     const discountAmount = discVal; // Assuming fixed discount for simplicity
//     const taxableValue = Math.max(0, rawSubtotal - discountAmount);
//     const taxValue = (taxableValue * gstRate) / 100;
//     const itemTotalValue = taxableValue + taxValue;

//     item.taxAmount = taxValue;
//     item.subtotal = rawSubtotal;
//     item.itemTotal = itemTotalValue;

//     // Recalculate summary details for the overall bill
//     let totalTaxableAmount = 0;
//     let totalTaxAmount = 0;
//     let totalDiscountAmount = 0;

//     updatedItems.forEach(i => {
//       const iQty = Number(i.quantity) || 0;
//       const iPrice = Number(i.price) || 0;
//       const iGst = Number(i.gstRate) || 0;
//       const iDisc = Number(i.discount?.value) || 0;

//       const base = iQty * iPrice;
//       const taxBase = Math.max(0, base - iDisc);

//       totalTaxableAmount += taxBase;
//       totalTaxAmount += (taxBase * iGst) / 100;
//       totalDiscountAmount += iDisc;
//     });
//     console.log(editingSale.items);


//     const saleDiscountValue = Number(editingSale.saleDiscount?.value) || 0;
//     const grandTotal = Math.max(0, (totalTaxableAmount + totalTaxAmount) - saleDiscountValue);
//     const creditAmount = editingSale.isCredit ? Math.max(0, grandTotal - (Number(editingSale.paidAmount) || 0)) : 0;

//     setEditingSale({
//       ...editingSale,
//       items: updatedItems,
//       totalTaxableAmount,
//       totalTaxAmount,
//       totalDiscountAmount,
//       totalAmount: grandTotal,
//       creditAmount
//     });
//   };

//   const handleSaveEdit = async (e) => {
//     e.preventDefault();
//     try {
//       setIsSaving(true);
//       // Assuming saleAPI has an update method
//       const response = await saleAPI.update(editingSale._id, editingSale);

//       // Update local state list with revised entry
//       setPublicSales(prev => prev.map(s => s._id === editingSale._id ? response.data.data : s));
//       toast.success('Sale record updated successfully!');
//       setEditingSale(null);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Failed to update sale record');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const toggleExpand = (id) => {
//     setExpandedId(expandedId === id ? null : id);
//   };

//   const handleLoadMore = () => {
//     fetchSales(currentPage + 1, true);
//   };

//   return (
//     <Layout>
//       <div className="mb-6 md:mb-8">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Sales History</h1>

//         {/* Search Bar */}
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search invoice, customer or mobile..."
//             value={searchQuery}
//             onChange={(e) => handleSearch(e.target.value)}
//             className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
//           />
//           {isSearching && (
//             <div className="absolute right-3 top-2 md:top-3">
//               <div className="animate-spin">
//                 <span className="text-indigo-600">⟳</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {searchQuery && (
//           <p className="text-xs md:text-sm text-gray-600 mt-2">
//             Found {sales.length} sale(s)
//           </p>
//         )}
//       </div>

//       {isLoading ? (
//         <>
//           {/* Desktop Skeleton */}
//           <div className="hidden md:block">
//             <SaleTableSkeleton />
//           </div>

//           {/* Mobile Skeleton */}
//           <div className="md:hidden">
//             <SaleMobileListSkeleton />
//           </div>
//         </>
//       ) : sales.length === 0 ? (
//         <div className="card text-center py-8 md:py-12">
//           <p className="text-gray-500 text-sm md:text-base">
//             {searchQuery ? 'No sales found matching your search' : 'No sales found'}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-3 md:space-y-4">
//           {sales.map((sale) => (
//             <div key={sale._id} className="card">
//               <button
//                 onClick={() => toggleExpand(sale._id)}
//                 className="w-full flex justify-between items-start md:items-center text-left gap-3"
//               >
//                 <div className="flex-1 min-w-0">
//                   {/* Mobile Layout */}
//                   <div className="md:hidden">
//                     <div className="flex justify-between items-start mb-2 gap-2">
//                       <div className="flex-1">
//                         <p className="text-xs text-gray-500 font-semibold">INVOICE</p>
//                         <p className="font-bold text-gray-900 truncate">{sale.invoiceNumber || 'N/A'}</p>
//                       </div>
//                       <p className="text-xl md:text-lg font-bold text-indigo-600 text-right flex-shrink-0">
//                         {formatCurrency(sale.totalAmount)}
//                       </p>
//                     </div>
//                     <p className="text-xs text-gray-600 mb-1 truncate">{sale.customerName}</p>
//                     <p className="text-xs text-gray-500">{formatDate(sale.createdAt)}</p>
//                   </div>

//                   {/* Desktop Layout */}
//                   <div className="hidden md:grid grid-cols-4 gap-4 items-start">
//                     {/* Invoice & Customer */}
//                     <div className="min-w-0">
//                       <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Invoice</p>
//                       <p className="font-semibold text-gray-900 truncate">
//                         {sale.invoiceNumber || 'N/A'}
//                       </p>
//                       {sale.customerName && (
//                         <>
//                           <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-2">Customer</p>
//                           <p className="text-sm text-gray-700 truncate">{sale.customerName}</p>
//                         </>
//                       )}
//                     </div>

//                     {/* Date & Items */}
//                     <div>
//                       <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Date</p>
//                       <p className="font-medium text-gray-900">
//                         {formatDate(sale.createdAt)}
//                       </p>
//                       <p className="text-xs text-gray-600 mt-2">
//                         {sale.items.length} item(s)
//                       </p>
//                     </div>

//                     {/* Total Amount */}
//                     <div>
//                       <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total</p>
//                       <p className="text-lg font-bold text-indigo-600">
//                         {formatCurrency(sale.totalAmount)}
//                       </p>
//                     </div>

//                     {/* Profit & Payment */}
//                     <div className="text-right">
//                       {sale.totalProfit !== undefined && (
//                         <>
//                           <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Profit</p>
//                           <p className="text-lg font-bold text-green-600">
//                             {formatCurrency(sale.totalProfit)}
//                           </p>
//                         </>
//                       )}
//                       <p className="text-xs text-gray-600 capitalize mt-2">
//                         {sale.paymentMethod || 'N/A'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <span className="text-xl md:text-2xl text-gray-400 ml-2 flex-shrink-0">
//                   {expandedId === sale._id ? '▼' : '▶'}
//                 </span>
//               </button>

//               {expandedId === sale._id && (
//                 <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t">
//                   <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Items Sold</h3>
//                   <div className="overflow-x-auto mb-4 md:mb-6">
//                     <table className="w-full text-xs md:text-sm">
//                       <thead>
//                         <tr className="border-b border-gray-300 bg-gray-100">
//                           <th className="text-left p-2 font-semibold text-gray-700">Product</th>
//                           <th className="text-center p-2 font-semibold text-gray-700">HSN</th>
//                           <th className="text-center p-2 font-semibold text-gray-700">Qty</th>
//                           <th className="text-right p-2 font-semibold text-gray-700">Rate</th>
//                           <th className="text-center p-2 font-semibold text-gray-700">GST%</th>
//                           <th className="text-right p-2 font-semibold text-gray-700">Tax</th>
//                           <th className="text-right p-2 font-semibold text-gray-700">Discount</th>
//                           <th className="text-right p-2 font-semibold text-gray-700">Total</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {sale.items.map((item, idx) => (
//                           <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50">
//                             <td className="p-2 text-gray-900 font-medium truncate"><div>{item.productName}</div><span className='text-[0.8rem] text-yellow-500'>{item.product.barcode}</span> </td>
//                             <td className="p-2 text-center text-gray-700">{item.hsnCode || '-'}</td>
//                             <td className="p-2 text-center text-gray-700">{item.quantity}</td>
//                             <td className="p-2 text-right text-gray-700">{formatCurrency(item.price)}</td>
//                             <td className="p-2 text-center text-indigo-600 font-semibold">{item.gstRate}%</td>
//                             <td className="p-2 text-right text-green-600 font-semibold">{formatCurrency(item.taxAmount || 0)}</td>
//                             <td className="p-2 text-right text-red-600 font-semibold">{formatCurrency(item.discount.amount || 0)} {(item.discount.type === "percentage" && item.discount.value > 0) && `(${item.discount.value}%)`}</td>
//                             <td className="p-2 text-right text-gray-900 font-bold">{formatCurrency(item.itemTotal || item.subtotal)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className="bg-gray-50 p-3 md:p-4 rounded mb-4 md:mb-6 text-xs md:text-sm space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Subtotal (Taxable):</span>
//                       <span className="font-semibold">
//                         {formatCurrency(sale.totalTaxableAmount || 0)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Total Tax:</span>
//                       <span className="font-semibold text-green-600">
//                         {formatCurrency(sale.totalTaxAmount || 0)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Sale Discount:</span>
//                       <span className="font-semibold text-red-600">
//                         {formatCurrency(sale.saleDiscount?.amount || 0)} {(sale.saleDiscount.type === "percentage" && sale.saleDiscount.value > 0) && `(${sale.saleDiscount.value}%)`}
//                       </span>
//                     </div>

//                     <div className="border-t border-gray-300 pt-2 flex justify-between">
//                       <span className="text-gray-700 font-semibold">Total Amount:</span>
//                       <span className="font-bold text-indigo-600">
//                         {formatCurrency(sale.totalAmount)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Total Discount:</span>
//                       <span className="font-semibold text-red-600">
//                         {formatCurrency(sale.totalDiscountAmount || 0)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Amount Paid:</span>
//                       <span className="font-semibold">
//                         {formatCurrency(sale.paidAmount)}
//                       </span>
//                     </div>
//                     {sale.totalProfit !== undefined && (
//                       <div className="flex justify-between font-semibold text-green-600">
//                         <span>Total Profit:</span>
//                         <span>{formatCurrency(sale.totalProfit)}</span>
//                       </div>
//                     )}
//                     {sale.totalProfit !== undefined && sale.totalTaxAmount > 0 && (
//                       <div className="flex justify-between font-semibold text-green-600">
//                         <span>Total Profit With GST:</span>
//                         <span>{formatCurrency((sale.totalProfit + sale.totalTaxAmount))}</span>
//                       </div>
//                     )}
//                     {sale.change > 0 && (
//                       <div className="flex justify-between text-green-600 font-semibold">
//                         <span>Change Given:</span>
//                         <span>{formatCurrency(sale.change)}</span>
//                       </div>
//                     )}
//                     {sale.isCredit && sale.creditAmount > 0 && (
//                       <div className="border-t border-red-300 pt-2 flex justify-between bg-red-50 p-2 rounded">
//                         <span className="text-red-700 font-semibold">Amount Due:</span>
//                         <span className="font-bold text-red-600">{formatCurrency(sale.creditAmount)}</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col sm:flex-row gap-2">
//                     <button
//                       onClick={() => handlePrint(sale)}
//                       className="btn-secondary flex-1 text-xs md:text-sm py-2"
//                     >
//                       🖨️ Print
//                     </button>
//                     <button
//                       onClick={() => handleDownload(sale)}
//                       className="btn-secondary flex-1 text-xs md:text-sm py-2"
//                     >
//                       📄 Download
//                     </button>
//                     {/* EDIT BUTTON */}
//                     <button
//                       onClick={() => startEdit(sale)}
//                       className="bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 flex-1 text-xs md:text-sm py-2 rounded-lg font-medium transition"
//                     >
//                       ✏️ Edit Bill
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* Pagination Info & Load More Button */}
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 px-4 py-3 bg-gray-50 rounded-lg">
//             <p className="text-xs md:text-sm text-gray-600">
//               Showing {sales.length} of {totalCount} sales
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
//         </div>
//       )}

//       {/* EDIT MODAL FORM */}
//       {editingSale && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
//             {/* Header */}
//             <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
//               <div>
//                 <h2 className="text-lg font-bold text-gray-900">Edit Invoice</h2>
//                 <p className="text-xs text-gray-500">{editingSale.invoiceNumber || 'No Invoice Number'}</p>
//               </div>
//               <button
//                 onClick={() => setEditingSale(null)}
//                 className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

//               {/* Customer Info Section */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Customer Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={editingSale.customer.name || ''}
//                     onChange={(e) => setEditingSale({ ...editingSale, customer: { ...editingSale.customer, name: e.target.value } })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Customer Mobile</label>
//                   <input
//                     type="text"
//                     value={editingSale.customer?.mobile || ''}
//                     onChange={(e) => setEditingSale({ ...editingSale, customer: { ...editingSale.customer, mobile: e.target.value } })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Customer Address</label>
//                   <input
//                     type="text"
//                     value={editingSale.customer?.address || ''}
//                     onChange={(e) => setEditingSale({ ...editingSale, customer: { ...editingSale.customer, address: e.target.value } })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Customer Email</label>
//                   <input
//                     type="text"
//                     value={editingSale.customer?.email || ''}
//                     onChange={(e) => setEditingSale({ ...editingSale, customer: { ...editingSale.customer, email: e.target.value } })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Payment Method</label>
//                   <select
//                     value={editingSale.paymentMethod || 'cash'}
//                     onChange={(e) => setEditingSale({ ...editingSale, paymentMethod: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm capitalize"
//                   >
//                     <option value="cash">Cash</option>
//                     <option value="upi">UPI</option>
//                     <option value="card">Card</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
//                     Invoice Date
//                   </label>
//                   <input
//                     type="date"
//                     value={editingSale.createdAt ? editingSale.createdAt.split('T')[0] : ''}
//                     onChange={(e) => {
//                       const selectedDate = e.target.value; // e.g. "2026-07-31"
//                       if (!selectedDate) return;

//                       // Get current local time (e.g., 11:28 PM)
//                       const now = new Date();

//                       // Combine selected date with current local time
//                       const [year, month, day] = selectedDate.split('-').map(Number);
//                       now.setFullYear(year, month - 1, day);

//                       setEditingSale({
//                         ...editingSale,
//                         createdAt: now.toISOString() // Saves with exact current time (11:28 PM IST / UTC equivalent)
//                       });
//                     }}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Items Section */}
//               <div>
//                 <h3 className="font-bold text-gray-800 text-sm md:text-base mb-3 border-b pb-2">Modify Items</h3>
//                 <div className="space-y-4">
//                   {editingSale.items.map((item, index) => (
//                     <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">

//                       {/* Product Name (readonly/info for safety) */}
//                       <div className="sm:col-span-4">
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Product Name</label>
//                         <input
//                           type="text"
//                           disabled
//                           value={item.productName || ''}
//                           className="w-full px-2 py-1.5 border bg-gray-100 rounded text-xs text-gray-600 cursor-not-allowed"
//                         />
//                       </div>

//                       {/* Qty */}
//                       <div className="sm:col-span-2">
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Qty</label>
//                         <input
//                           type="number"
//                           min="1"
//                           required
//                           value={item.quantity}
//                           onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
//                           className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center"
//                         />
//                       </div>

//                       {/* Rate */}
//                       <div className="sm:col-span-2">
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Rate ({user.currencySymbol || '₹'})</label>
//                         <input
//                           type="number"
//                           required
//                           value={item.price}
//                           onChange={(e) => handleItemChange(index, 'price', e.target.value)}
//                           className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-right"
//                         />
//                       </div>

//                       {/* GST% */}
//                       <div className="sm:col-span-2">
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">GST%</label>
//                         <input
//                           type="number"
//                           min="0"
//                           value={item.gstRate}
//                           onChange={(e) => handleItemChange(index, 'gstRate', e.target.value)}
//                           className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center"
//                         />
//                       </div>

//                       {/* Discount Value */}
//                       <div className="sm:col-span-2">
//                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Disc. In Rs</label>
//                         <input
//                           type="number"
//                           value={item.discount?.value || 0}
//                           onChange={(e) => handleItemChange(index, 'discountValue', e.target.value)}
//                           className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-right text-red-600"
//                         />
//                       </div>

//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Edit Summary Overview */}
//               <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm">
//                 <div>
//                   <span className="text-gray-500 block">Subtotal (Taxable)</span>
//                   <span className="font-bold text-gray-800">{formatCurrency(editingSale.totalTaxableAmount)}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-500 block">Total Tax</span>
//                   <span className="font-bold text-green-600">{formatCurrency(editingSale.totalTaxAmount)}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-500 block">Sale Discount in Rs</span>
//                   <input
//                     type="number"
//                     value={editingSale.saleDiscount?.amount || 0}
//                     onChange={(e) => {
//                       const val = Number(e.target.value) || 0;
//                       const grandTotal = Math.max(0, (editingSale.totalTaxableAmount + editingSale.totalTaxAmount) - val);
//                       setEditingSale({
//                         ...editingSale,
//                         saleDiscount: { ...editingSale.saleDiscount, amount: val, value: val, type: "fixed" },
//                         totalAmount: grandTotal,
//                         creditAmount: editingSale.isCredit ? Math.max(0, grandTotal - (Number(editingSale.paidAmount) || 0)) : 0
//                       });
//                     }}
//                     className="w-20 px-1 py-0.5 border border-gray-300 rounded text-xs text-right text-red-600 mt-1 font-semibold block"
//                   />
//                 </div>
//                 <div className="text-right">
//                   <span className="text-indigo-600 font-semibold block">Total Bill Amount</span>
//                   <span className="font-extrabold text-lg text-indigo-700">{formatCurrency(editingSale.totalAmount)}</span>
//                 </div>
//               </div>

//               {/* Payments and Credit Adjustment */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Amount Paid</label>
//                   <input
//                     type="number"
//                     value={editingSale.paidAmount || 0}
//                     onChange={(e) => {
//                       const paid = Number(e.target.value) || 0;
//                       const isCredit = editingSale.isCredit || false;
//                       const creditAmount = isCredit ? Math.max(0, editingSale.totalAmount - paid) : 0;
//                       setEditingSale({
//                         ...editingSale,
//                         paidAmount: paid,
//                         creditAmount
//                       });
//                     }}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                   />
//                 </div>

//                 {/* If Credit Sale, display adjusted outstanding */}
//                 {editingSale.isCredit && (
//                   <div className="bg-red-50 border border-red-100 rounded-lg p-3">
//                     <span className="text-red-700 font-semibold text-xs block uppercase">Calculated Due Amount:</span>
//                     <span className="font-bold text-red-600 text-lg mt-1 block">{formatCurrency(editingSale.creditAmount)}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 justify-end pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={() => setEditingSale(null)}
//                   className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSaving}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 min-w-[100px]"
//                 >
//                   {isSaving ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>

//             </form>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }







import React, { useEffect, useState, useRef } from 'react';
import {
  FaSearch, FaTimes, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight,
  FaPrint, FaDownload, FaEdit, FaFileInvoice, FaSpinner, FaReceipt, FaSave
} from 'react-icons/fa';
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
  const { user } = useAuthStore();


  // Backend pagination: response.data.data, totalCount and totalPages.
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  // Search is debounced; the committed query is sent to the backend.
  const [committedQuery, setCommittedQuery] = useState('');
  const requestId = useRef(0);

  // Edit form state
  const [editingSale, setEditingSale] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = 'Sales - Dukanbill';
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setCommittedQuery(searchQuery.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;
    const id = ++requestId.current;

    const load = async () => {
      setIsLoading(true);
      if (committedQuery) setIsSearching(true);
      try {
        const response = committedQuery
          ? await saleAPI.search(committedQuery, currentPage, pageSize)
          : await saleAPI.getAll(currentPage, pageSize);

        if (cancelled || id !== requestId.current) return;
        const payload = response?.data || {};
        setPublicSales(Array.isArray(payload.data) ? payload.data : []);
        setTotalCount(Number(payload.totalCount) || 0);
        setTotalPages(Math.max(1, Number(payload.totalPages) || 1));
      } catch (error) {
        if (cancelled || id !== requestId.current) return;
        console.error('Failed to fetch sales:', error);
        toast.error(
          error.response?.data?.message ||
          (committedQuery ? 'Failed to search sales' : 'Failed to fetch sales')
        );
        setPublicSales([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        if (!cancelled && id === requestId.current) {
          setIsLoading(false);
          setIsSearching(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [currentPage, committedQuery]);

  const handleSearch = (value) => {
    setSearchQuery(value.slice(0, 100));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCommittedQuery('');
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    if (nextPage !== currentPage) {
      setCurrentPage(nextPage);
      setExpandedId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrint = async (sale) => {
    try {
      const businessDetails = {
        gstin: user.businessDetails?.gstin || '',
        pan: user.businessDetails?.pan || '',
        address: user.businessDetails?.businessAddress || '',
        phone: user.businessDetails?.businessPhone || '',
        email: user.businessDetails?.businessEmail || '',
        upiId: user.businessDetails?.upiId || '',
        bankDetails: user.businessDetails?.bankName && user.businessDetails?.accountNumber
          ? `${user.businessDetails.bankName}, Acc: ${user.businessDetails.accountNumber}, IFSC: ${user.businessDetails.ifscCode || 'N/A'}`
          : '',
        bankName: user.businessDetails?.bankName,
        accountNumber: user.businessDetails?.accountNumber,
        ifscCode: user.businessDetails?.ifscCode,
        holderName: (user.name || '').toUpperCase()
        
      };
      await printInvoice(sale, user.shopName, businessDetails);
      toast.success('Invoice sent to printer');
    } catch (error) {
      console.log(`error is ${error}`);
      toast.error('Failed to print invoice');
    }
  };

  const handleDownload = async (sale) => {
    try {
      const businessDetails = {
        gstin: user.businessDetails?.gstin || '',
        pan: user.businessDetails?.pan || '',
        address: user.businessDetails?.businessAddress || '',
        phone: user.businessDetails?.businessPhone || '',
        email: user.businessDetails?.businessEmail || '',
        bankDetails: user.businessDetails?.bankName && user.businessDetails?.accountNumber
          ? `${user.businessDetails.bankName}, Acc: ${user.businessDetails.accountNumber}, IFSC: ${user.businessDetails.ifscCode || 'N/A'}`
          : '',
        bankName: user.businessDetails?.bankName,
        accountNumber: user.businessDetails?.accountNumber,
        ifscCode: user.businessDetails?.ifscCode,
        holderName: (user.name || '').toUpperCase()
      };
      await downloadInvoice(sale, user.shopName, businessDetails);
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  // Open edit modal and populate clone of sale object
  const startEdit = (sale) => {
    setEditingSale(JSON.parse(JSON.stringify(sale))); // deep clone
  };

  // Live recalculations for edited items
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editingSale.items];
    const item = updatedItems[index];

    // Direct assignment of updated field value
    item[field] = value;

    // Convert values safely for mathematical calculations
    const qty = Number(field === 'quantity' ? value : item.quantity) || 0;
    const rate = Number(field === 'price' ? value : item.price) || 0;
    const gstRate = Number(field === 'gstRate' ? value : item.gstRate) || 0;

    // Manage discounts nested object safely
    let discVal = item.discount?.value || 0;
    if (field === 'discountValue') {
      discVal = Number(value) || 0;
      item.discount = { ...item.discount, value: discVal, amount: discVal, type: "fixed" };
    }

    // Calculations based on standard India GST rules
    const rawSubtotal = qty * rate;
    const discountAmount = discVal; // Assuming fixed discount for simplicity
    const taxableValue = Math.max(0, rawSubtotal - discountAmount);
    const taxValue = (taxableValue * gstRate) / 100;
    const itemTotalValue = taxableValue + taxValue;

    item.taxAmount = taxValue;
    item.subtotal = rawSubtotal;
    item.itemTotal = itemTotalValue;

    // Recalculate summary details for the overall bill
    let totalTaxableAmount = 0;
    let totalTaxAmount = 0;
    let totalDiscountAmount = 0;

    updatedItems.forEach(i => {
      const iQty = Number(i.quantity) || 0;
      const iPrice = Number(i.price) || 0;
      const iGst = Number(i.gstRate) || 0;
      const iDisc = Number(i.discount?.value) || 0;

      const base = iQty * iPrice;
      const taxBase = Math.max(0, base - iDisc);

      totalTaxableAmount += taxBase;
      totalTaxAmount += (taxBase * iGst) / 100;
      totalDiscountAmount += iDisc;
    });
    console.log(editingSale.items);


    const saleDiscountValue = Number(editingSale.saleDiscount?.value) || 0;
    const grandTotal = Math.max(0, (totalTaxableAmount + totalTaxAmount) - saleDiscountValue);
    const creditAmount = editingSale.isCredit ? Math.max(0, grandTotal - (Number(editingSale.paidAmount) || 0)) : 0;

    setEditingSale({
      ...editingSale,
      items: updatedItems,
      totalTaxableAmount,
      totalTaxAmount,
      totalDiscountAmount,
      totalAmount: grandTotal,
      creditAmount
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      // Assuming saleAPI has an update method
      const response = await saleAPI.update(editingSale._id, editingSale);

      // Update local state list with revised entry
      setPublicSales(prev => prev.map(s => s._id === editingSale._id ? response.data.data : s));
      toast.success('Sale record updated successfully!');
      setEditingSale(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update sale record');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((previous) => previous === id ? null : id);
  };

  return (
    <Layout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Sales History</h1>

        {/* Search and result controls */}
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search invoice, customer or mobile..."
              value={searchQuery}
              maxLength={100}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              aria-label="Search sales"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 text-xs text-gray-500 sm:justify-end sm:text-sm">
            {isSearching ? (
              <span className="inline-flex items-center gap-2 text-indigo-600"><FaSpinner className="animate-spin" /> Searching…</span>
            ) : (
              <span className="inline-flex items-center gap-2"><FaReceipt className="text-indigo-500" /> {totalCount} sale{totalCount === 1 ? '' : 's'}</span>
            )}
            {searchQuery && (
              <button type="button" onClick={clearSearch} className="font-semibold text-indigo-600 hover:text-indigo-800">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
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
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <FaFileInvoice size={24} />
          </div>
          <h3 className="font-semibold text-gray-900">{committedQuery ? 'No matching sales' : 'No sales yet'}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {committedQuery ? 'Try another invoice number, customer name, or mobile number.' : 'Completed invoices will appear here.'}
          </p>
          {searchQuery && <button type="button" onClick={clearSearch} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Clear search</button>}
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {sales.map((sale) => (
            <div key={sale._id} className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-4 md:p-5">
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
                        {sale.items?.length || 0} item(s)
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
                <span className={`ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition ${expandedId === sale._id ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
                  {expandedId === sale._id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </span>
              </button>

              {expandedId === sale._id && (
                <div className="mt-4 min-w-0 w-full border-t pt-4 md:mt-6 md:pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Items Sold</h3>
                  <div className="mb-4 w-full max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-gray-200 md:mb-6">
                    <table className="w-full min-w-[760px] text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-gray-300 bg-gray-100">
                          <th className="text-left p-2 font-semibold text-gray-700">Product</th>
                          <th className="text-center p-2 font-semibold text-gray-700">HSN</th>
                          <th className="text-center p-2 font-semibold text-gray-700">Qty</th>
                          <th className="text-right p-2 font-semibold text-gray-700">Rate</th>
                          <th className="text-center p-2 font-semibold text-gray-700">GST%</th>
                          <th className="text-right p-2 font-semibold text-gray-700">Tax</th>
                          <th className="text-right p-2 font-semibold text-gray-700">Discount</th>
                          <th className="text-right p-2 font-semibold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(sale.items || []).map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50">
                            <td className="p-2 text-gray-900 font-medium truncate"><div>{item.productName}</div><span className='text-[0.8rem] text-yellow-500'>{item.product?.barcode || item.barcode || ''}</span> </td>
                            <td className="p-2 text-center text-gray-700">{item.hsnCode || '-'}</td>
                            <td className="p-2 text-center text-gray-700">{item.quantity}</td>
                            <td className="p-2 text-right text-gray-700">{formatCurrency(item.price)}</td>
                            <td className="p-2 text-center text-indigo-600 font-semibold">{item.gstRate}%</td>
                            <td className="p-2 text-right text-green-600 font-semibold">{formatCurrency(item.taxAmount || 0)}</td>
                            <td className="p-2 text-right text-red-600 font-semibold">{formatCurrency(item.discount?.amount || 0)} {(item.discount?.type === "percentage" && item.discount?.value > 0) && `(${item.discount.value}%)`}</td>
                            <td className="p-2 text-right text-gray-900 font-bold">{formatCurrency(item.itemTotal || item.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-4 grid min-w-0 gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs md:mb-6 md:gap-3 md:p-4 md:text-sm">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <span className="min-w-0 flex-1 break-words text-gray-600">Subtotal (Taxable):</span>
                      <span className="min-w-0 max-w-[55%] break-words text-right font-semibold">
                        {formatCurrency(sale.totalTaxableAmount || 0)}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <span className="min-w-0 flex-1 break-words text-gray-600">Total Tax:</span>
                      <span className="min-w-0 max-w-[55%] break-words text-right font-semibold text-green-600">
                        {formatCurrency(sale.totalTaxAmount || 0)}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <span className="min-w-0 flex-1 break-words text-gray-600">Sale Discount:</span>
                      <span className="min-w-0 max-w-[55%] break-words text-right font-semibold text-red-600">
                        {formatCurrency(sale.saleDiscount?.amount || 0)} {(sale.saleDiscount?.type === "percentage" && sale.saleDiscount?.value > 0) && `(${sale.saleDiscount.value}%)`}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-start justify-between gap-3 border-t border-gray-300 pt-2">
                      <span className="min-w-0 flex-1 break-words text-gray-700 font-semibold">Total Amount:</span>
                      <span className="min-w-0 max-w-[55%] break-words text-right font-bold text-indigo-600">
                        {formatCurrency(sale.totalAmount)}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <span className="min-w-0 flex-1 break-words text-gray-600">Total Discount:</span>
                      <span className="min-w-0 max-w-[55%] break-words text-right font-semibold text-red-600">
                        {formatCurrency(sale.totalDiscountAmount || 0)}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <span className="min-w-0 flex-1 break-words text-gray-600">Amount Paid:</span>
                      <span className="min-w-0 max-w-[55%] break-words text-right font-semibold">
                        {formatCurrency(sale.paidAmount)}
                      </span>
                    </div>
                    {sale.totalProfit !== undefined && (
                      <div className="flex min-w-0 items-start justify-between gap-3 font-semibold text-green-600">
                        <span className="min-w-0 flex-1 break-words">Total Profit:</span>
                        <span>{formatCurrency(sale.totalProfit)}</span>
                      </div>
                    )}
                    {sale.totalProfit !== undefined && sale.totalTaxAmount > 0 && (
                      <div className="flex min-w-0 items-start justify-between gap-3 font-semibold text-green-600">
                        <span className="min-w-0 flex-1 break-words">Total Profit With GST:</span>
                        <span>{formatCurrency((sale.totalProfit + sale.totalTaxAmount))}</span>
                      </div>
                    )}
                    {sale.change > 0 && (
                      <div className="flex min-w-0 items-start justify-between gap-3 font-semibold text-green-600">
                        <span className="min-w-0 flex-1 break-words">Change Given:</span>
                        <span>{formatCurrency(sale.change)}</span>
                      </div>
                    )}
                    {sale.isCredit && sale.creditAmount > 0 && (
                      <div className="flex min-w-0 items-start justify-between gap-3 rounded-lg border-t border-red-300 bg-red-50 p-2 pt-3">
                        <span className="min-w-0 flex-1 break-words text-red-700 font-semibold">Amount Due:</span>
                        <span className="font-bold text-red-600">{formatCurrency(sale.creditAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button type="button" onClick={() => handlePrint(sale)} className="btn-secondary flex flex-1 items-center justify-center gap-2 py-2 text-xs transition hover:-translate-y-0.5 md:text-sm">
                      <FaPrint /> Print
                    </button>
                    <button type="button" onClick={() => handleDownload(sale)} className="btn-secondary flex flex-1 items-center justify-center gap-2 py-2 text-xs transition hover:-translate-y-0.5 md:text-sm">
                      <FaDownload /> Download
                    </button>
                    {/* EDIT BUTTON */}
                    <button type="button" onClick={() => startEdit(sale)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 py-2 text-xs font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100 md:text-sm">
                      <FaEdit /> Edit bill
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Backend pagination */}
          <nav aria-label="Sales pagination" className="mt-5 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-center text-xs text-gray-500 sm:text-left sm:text-sm">
                Showing <span className="font-semibold text-gray-800">{totalCount === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="font-semibold text-gray-800">{totalCount}</span> sales
              </p>
              <div className="flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1 || isLoading}
                  className="hidden rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
                >First</button>
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  aria-label="Previous page"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
                ><FaChevronLeft size={12} /></button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                  const page = startPage + index;
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      aria-current={currentPage === page ? 'page' : undefined}
                      disabled={isLoading}
                      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-semibold transition disabled:opacity-50 ${currentPage === page ? 'bg-indigo-600 text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'}`}
                    >{page}</button>
                  );
                })}
                <span className="px-1 text-xs text-gray-400 sm:hidden">{currentPage}/{totalPages}</span>
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages || isLoading}
                  aria-label="Next page"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
                ><FaChevronRight size={12} /></button>
                <button
                  type="button"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage >= totalPages || isLoading}
                  className="hidden rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
                >Last</button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* EDIT MODAL FORM */}
      {editingSale && (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="flex max-h-[96dvh] w-full max-w-4xl flex-col rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Edit Invoice</h2>
                <p className="text-xs text-gray-500">{editingSale.invoiceNumber || 'No Invoice Number'}</p>
              </div>
              <button type="button" onClick={() => setEditingSale(null)} aria-label="Close edit invoice" className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

              {/* Customer Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editingSale.customer?.name || editingSale.customerName || ''}
                    onChange={(e) => setEditingSale({ ...editingSale, customer: { ...(editingSale.customer || {}), name: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Customer Mobile</label>
                  <input
                    type="text"
                    value={editingSale.customer?.mobile || ''}
                    onChange={(e) => setEditingSale({ ...editingSale, customer: { ...(editingSale.customer || {}), mobile: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Customer Address</label>
                  <input
                    type="text"
                    value={editingSale.customer?.address || ''}
                    onChange={(e) => setEditingSale({ ...editingSale, customer: { ...(editingSale.customer || {}), address: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Customer Email</label>
                  <input
                    type="text"
                    value={editingSale.customer?.email || ''}
                    onChange={(e) => setEditingSale({ ...editingSale, customer: { ...(editingSale.customer || {}), email: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Payment Method</label>
                  <select
                    value={editingSale.paymentMethod || 'cash'}
                    onChange={(e) => setEditingSale({ ...editingSale, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm capitalize"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={editingSale.createdAt ? editingSale.createdAt.split('T')[0] : ''}
                    onChange={(e) => {
                      const selectedDate = e.target.value; // e.g. "2026-07-31"
                      if (!selectedDate) return;

                      // Get current local time (e.g., 11:28 PM)
                      const now = new Date();

                      // Combine selected date with current local time
                      const [year, month, day] = selectedDate.split('-').map(Number);
                      now.setFullYear(year, month - 1, day);

                      setEditingSale({
                        ...editingSale,
                        createdAt: now.toISOString() // Saves with exact current time (11:28 PM IST / UTC equivalent)
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base mb-3 border-b pb-2">Modify Items</h3>
                <div className="space-y-4">
                  {editingSale.items.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">

                      {/* Product Name (readonly/info for safety) */}
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Product Name</label>
                        <input
                          type="text"
                          disabled
                          value={item.productName || ''}
                          className="w-full px-2 py-1.5 border bg-gray-100 rounded text-xs text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Qty */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center"
                        />
                      </div>

                      {/* Rate */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Rate ({user.currencySymbol || '₹'})</label>
                        <input
                          type="number"
                          required
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-right"
                        />
                      </div>

                      {/* GST% */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">GST%</label>
                        <input
                          type="number"
                          min="0"
                          value={item.gstRate}
                          onChange={(e) => handleItemChange(index, 'gstRate', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-center"
                        />
                      </div>

                      {/* Discount Value */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Disc. In Rs</label>
                        <input
                          type="number"
                          value={item.discount?.value || 0}
                          onChange={(e) => handleItemChange(index, 'discountValue', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs text-right text-red-600"
                        />
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Summary Overview */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm">
                <div>
                  <span className="text-gray-500 block">Subtotal (Taxable)</span>
                  <span className="font-bold text-gray-800">{formatCurrency(editingSale.totalTaxableAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Total Tax</span>
                  <span className="font-bold text-green-600">{formatCurrency(editingSale.totalTaxAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Sale Discount in Rs</span>
                  <input
                    type="number"
                    value={editingSale.saleDiscount?.amount || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const grandTotal = Math.max(0, (editingSale.totalTaxableAmount + editingSale.totalTaxAmount) - val);
                      setEditingSale({
                        ...editingSale,
                        saleDiscount: { ...editingSale.saleDiscount, amount: val, value: val, type: "fixed" },
                        totalAmount: grandTotal,
                        creditAmount: editingSale.isCredit ? Math.max(0, grandTotal - (Number(editingSale.paidAmount) || 0)) : 0
                      });
                    }}
                    className="w-20 px-1 py-0.5 border border-gray-300 rounded text-xs text-right text-red-600 mt-1 font-semibold block"
                  />
                </div>
                <div className="text-right">
                  <span className="text-indigo-600 font-semibold block">Total Bill Amount</span>
                  <span className="font-extrabold text-lg text-indigo-700">{formatCurrency(editingSale.totalAmount)}</span>
                </div>
              </div>

              {/* Payments and Credit Adjustment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Amount Paid</label>
                  <input
                    type="number"
                    value={editingSale.paidAmount || 0}
                    onChange={(e) => {
                      const paid = Number(e.target.value) || 0;
                      const isCredit = editingSale.isCredit || false;
                      const creditAmount = isCredit ? Math.max(0, editingSale.totalAmount - paid) : 0;
                      setEditingSale({
                        ...editingSale,
                        paidAmount: paid,
                        creditAmount
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {/* If Credit Sale, display adjusted outstanding */}
                {editingSale.isCredit && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <span className="text-red-700 font-semibold text-xs block uppercase">Calculated Due Amount:</span>
                    <span className="font-bold text-red-600 text-lg mt-1 block">{formatCurrency(editingSale.creditAmount)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSaving ? <><FaSpinner className="animate-spin" /> Saving…</> : <><FaSave /> Save changes</>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}