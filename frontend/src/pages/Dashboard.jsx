// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import Layout from '../components/Layout';
// import SalesGraph from '../components/SalesGraph';
// import { saleAPI, productAPI } from '../services/api';
// import { formatCurrency, formatDate } from '../utils/helpers';
// import { DashboardFullSkeleton, ModalProductsContentSkeleton, ModalSalesContentSkeleton, ModalHeaderSkeleton, ModalFooterSkeleton } from '../components/Skeletons';
// import { useAuthStore } from '../store/store';

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingModal, setIsLoadingModal] = useState(false);
//   const [detailsModal, setDetailsModal] = useState({ isOpen: false, type: null, data: [] });
//   const { user } = useAuthStore();

//   useEffect(() => {
//     document.title = 'Dashboard - Dukanbill';
//   }, []);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setIsLoading(true);
//         const response = await saleAPI.getDashboardStats();
//         setStats(response.data.data);
//       } catch (error) {
//         toast.error('Failed to load dashboard stats');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   const handleViewProducts = () => {
//     navigate('/products');
//   };

//   const handleViewBarcodes = () => {
//     navigate('/Barcode');
//   };

//   const handleViewLowStock = async () => {
//     try {
//       if (stats.lowStockProducts <= 0) return;
//       setDetailsModal({ isOpen: true, type: 'lowStock', data: [] });
//       setIsLoadingModal(true);
//       const response = await productAPI.getLowStock();
//       setDetailsModal({ isOpen: true, type: 'lowStock', data: response.data.data });
//     } catch (error) {
//       toast.error('Failed to fetch low stock products');
//     } finally {
//       setIsLoadingModal(false);
//     }
//   };

//   const handleViewTodaysSales = async () => {
//     try {
//       if (stats.todaySales <= 0) return;
//       setDetailsModal({ isOpen: true, type: 'todaysSales', data: [] });
//       setIsLoadingModal(true);
//       const response = await saleAPI.getTodayStats();
//       setDetailsModal({ isOpen: true, type: 'todaysSales', data: response.data.data.sales });
//     } catch (error) {
//       toast.error('Failed to fetch today\'s sales');
//     } finally {
//       setIsLoadingModal(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="mb-6 md:mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Dashboard</h1>
//           <DashboardFullSkeleton />
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Dashboard</h1>

//       {stats && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
//           <button
//             onClick={handleViewProducts}
//             className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
//           >
//             <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Total Products</h3>
//             <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
//             <p className="text-xs text-gray-500 mt-2">Go to Products</p>
//           </button>

//           <button
//             onClick={handleViewLowStock}
//             className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
//           >
//             <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Low Stock Items</h3>
//             <p className="text-2xl md:text-3xl font-bold text-red-600">{stats.lowStockProducts}</p>
//             {<p className="text-xs text-gray-500 mt-2">Click to view details</p>}
//           </button>

//           <button
//             onClick={handleViewTodaysSales}
//             className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
//           >
//             <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Today's Sales</h3>
//             <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.todaySales}</p>
//             <p className="text-xs text-gray-500 mt-2">Click to view details</p>
//           </button>

//           <div className="card">
//             <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Today's Revenue</h3>
//             <p className="text-2xl md:text-3xl font-bold text-indigo-600">
//               {formatCurrency(stats.todayRevenue)}
//             </p>
//           </div>
//           <div className="card">
//             <h3 className="text-gray-600 text-xs md:text-sm font-semibold mb-2">Today's Due</h3>
//             <p className="text-2xl md:text-3xl font-bold text-red-600">
//               {formatCurrency(stats.todayDue)}
//             </p>
//           </div>
//           {user.barcodeAccess && <button
//             onClick={handleViewBarcodes}
//             className="card hover:shadow-lg transition-shadow cursor-pointer text-left"
//           >
//             <p className="text-2xl md:text-3xl font-bold text-blue-900">Barcodes</p>
//             <p className="text-xs text-gray-500 mt-2">Generate Barcodes</p>
//           </button>}
//         </div>
//       )}

//       {stats?.lowStockProducts > 0 && (
//         <div className="card bg-yellow-50 border-l-4 border-yellow-400 mb-6 md:mb-8">
//           <h2 className="text-base md:text-lg font-semibold text-yellow-800 mb-2 md:mb-3">
//             ⚠️ Low Stock Alert
//           </h2>
//           <p className="text-xs md:text-sm text-yellow-700">
//             You have {stats.lowStockProducts} product(s) with low stock. Please reorder soon!
//           </p>
//         </div>
//       )}

//       {/* Sales Analytics Graph */}
//       <div className="mb-6 md:mb-8">
//         <SalesGraph />
//       </div>

//       {/* Details Modal */}
//       {detailsModal.isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
//             {/* Modal Header */}
//             {isLoadingModal ? (
//               <ModalHeaderSkeleton />
//             ) : (
//               <div className="sticky top-0 bg-white border-b p-3 md:p-4 flex justify-between items-center">
//                 <h2 className="text-lg md:text-2xl font-bold text-gray-900">
//                   {detailsModal.type === 'products' && 'All Products'}
//                   {detailsModal.type === 'lowStock' && 'Low Stock Items'}
//                   {detailsModal.type === 'todaysSales' && "Today's Sales"}
//                 </h2>
//                 <button
//                   onClick={() => setDetailsModal({ ...detailsModal, isOpen: false })}
//                   className="text-gray-600 hover:text-gray-900 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             )}

//             {/* Modal Content */}
//             <div className="p-3 md:p-4">
//               {isLoadingModal ? (
//                 detailsModal.type === 'todaysSales' ? (
//                   <ModalSalesContentSkeleton />
//                 ) : (
//                   <ModalProductsContentSkeleton />
//                 )
//               ) : detailsModal.data.length === 0 ? (
//                 <p className="text-gray-500 text-center py-8 text-xs md:text-sm">No data available</p>
//               ) : detailsModal.type === 'todaysSales' ? (
//                 // Sales View
//                 <div className="space-y-2 md:space-y-4">
//                   {detailsModal.data.map((sale) => (
//                     <div key={sale._id} className="border rounded-lg p-3 md:p-4 bg-gray-50">
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-2">
//                         <div>
//                           <p className="text-xs text-gray-600 font-semibold">Invoice #</p>
//                           <p className="font-semibold text-xs md:text-sm">{sale.invoiceNumber}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 font-semibold">Customer</p>
//                           <p className="font-semibold text-xs md:text-sm truncate">{sale.customerName}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 font-semibold">Amount</p>
//                           <p className="font-semibold text-xs md:text-sm text-green-600">
//                             {formatCurrency(sale.totalAmount)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 font-semibold">Time</p>
//                           <p className="font-semibold text-xs md:text-sm">
//                             {new Date(sale.createdAt).toLocaleTimeString()}
//                           </p>
//                         </div>
//                       </div>
//                       <p className="text-xs text-gray-500">
//                         Items: {sale.items.length} | Payment: {sale.paymentMethod}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 // Products View
//                 <div className="divide-y">
//                   {detailsModal.data.map((product) => (
//                     <div key={product._id} className="py-3 grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-2 text-xs">
//                       <div>
//                         <p className="text-gray-600 text-xs font-semibold">Name</p>
//                         <p className="font-semibold truncate">{product.name}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-600 text-xs font-semibold">Barcode</p>
//                         <p className="font-mono text-xs truncate">{product.barcode || 'N/A'}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-600 text-xs font-semibold">Qty</p>
//                         <p
//                           className={`font-semibold ${product.quantity <= product.minStock
//                             ? 'text-red-600'
//                             : 'text-green-600'
//                             }`}
//                         >
//                           {product.quantity}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-gray-600 text-xs font-semibold">Price</p>
//                         <p className="font-semibold">
//                           {formatCurrency(product.sellingPrice || 0)}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-gray-600 text-xs font-semibold">Min</p>
//                         <p className="font-semibold">{product.minStock}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             {isLoadingModal ? (
//               <ModalFooterSkeleton />
//             ) : (
//               <div className="border-t p-3 md:p-4 bg-gray-50">
//                 <button
//                   onClick={() => setDetailsModal({ ...detailsModal, isOpen: false })}
//                   className="w-full btn btn-primary text-xs md:text-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="card">
//         <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Quick Links</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
//           <a
//             href="/products"
//             className="p-3 md:p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
//           >
//             <h3 className="font-semibold text-indigo-900 text-sm md:text-base">Manage Products</h3>
//             <p className="text-xs md:text-sm text-indigo-700">Add, edit, or delete products</p>
//           </a>
//           <a
//             href="/pos"
//             className="p-3 md:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
//           >
//             <h3 className="font-semibold text-green-900 text-sm md:text-base">POS</h3>
//             <p className="text-xs md:text-sm text-green-700">Process sales and transactions</p>
//           </a>
//           <a
//             href="/sales"
//             className="p-3 md:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
//           >
//             <h3 className="font-semibold text-blue-900 text-sm md:text-base">Sales History</h3>
//             <p className="text-xs md:text-sm text-blue-700">View past transactions</p>
//           </a>
//         </div>
//       </div>
//     </Layout>
//   );
// }











import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiPackage, FiAlertTriangle, FiTrendingUp, FiDollarSign, 
  FiClock, FiBarChart2, FiArrowRight, FiX, FiShoppingCart, FiFileText, FiSettings 
} from 'react-icons/fi';
import Layout from '../components/Layout';
import SalesGraph from '../components/SalesGraph';
import { saleAPI, productAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { DashboardFullSkeleton, ModalProductsContentSkeleton, ModalSalesContentSkeleton, ModalHeaderSkeleton, ModalFooterSkeleton } from '../components/Skeletons';
import { useAuthStore } from '../store/store';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, type: null, data: [] });
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = 'Dashboard - Dukanbill';
  }, []);

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

  const handleViewProducts = () => navigate('/products');
  const handleViewBarcodes = () => navigate('/Barcode');

  const handleViewLowStock = async () => {
    try {
      if (!stats || stats.lowStockProducts <= 0) return;
      setDetailsModal({ isOpen: true, type: 'lowStock', data: [] });
      setIsLoadingModal(true);
      const response = await productAPI.getLowStock();
      setDetailsModal({ isOpen: true, type: 'lowStock', data: response.data.data });
    } catch (error) {
      toast.error('Failed to fetch low stock products');
    } finally {
      setIsLoadingModal(false);
    }
  };

  const handleViewTodaysSales = async () => {
    try {
      if (!stats || stats.todaySales <= 0) return;
      setDetailsModal({ isOpen: true, type: 'todaysSales', data: [] });
      setIsLoadingModal(true);
      const response = await saleAPI.getTodayStats();
      setDetailsModal({ isOpen: true, type: 'todaysSales', data: response.data.data.sales });
    } catch (error) {
      toast.error("Failed to fetch today's sales");
    } finally {
      setIsLoadingModal(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">Dashboard</h1>
          <DashboardFullSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* HEADER TITLE */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Store Dashboard</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">Welcome back, <strong className="text-slate-800">{user?.name.toUpperCase() || 'Partner'}</strong></p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          
          {/* TOTAL PRODUCTS */}
          <button
            onClick={handleViewProducts}
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
                  <FiPackage />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.totalProducts}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 mt-4 group-hover:translate-x-1 transition">
              <span>Manage Catalog</span> <FiArrowRight />
            </div>
          </button>

          {/* LOW STOCK ITEMS */}
          <button
            onClick={handleViewLowStock}
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-500 transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Alert</span>
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition">
                  <FiAlertTriangle />
                </div>
              </div>
              <p className="text-3xl font-black text-red-600">{stats.lowStockProducts}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-red-600 mt-4 group-hover:translate-x-1 transition">
              <span>View Low Stock</span> <FiArrowRight />
            </div>
          </button>

          {/* TODAY'S SALES COUNT */}
          <button
            onClick={handleViewTodaysSales}
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Sales</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
                  <FiTrendingUp />
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-600">{stats.todaySales}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4 group-hover:translate-x-1 transition">
              <span>View Transactions</span> <FiArrowRight />
            </div>
          </button>

          {/* TODAY'S REVENUE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Revenue</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiDollarSign />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-black text-indigo-600">
              {formatCurrency(stats.todayRevenue)}
            </p>
            <span className="text-[11px] font-semibold text-slate-400 mt-4 block">Recorded earnings today</span>
          </div>

          {/* TODAY'S DUE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Due (Credit)</span>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <FiClock />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-black text-red-600">
              {formatCurrency(stats.todayDue)}
            </p>
            <span className="text-[11px] font-semibold text-slate-400 mt-4 block">Pending customer credit</span>
          </div>

          {/* BARCODES QUICK ACCESS */}
          {user?.barcodeAccess && (
            <button
              onClick={handleViewBarcodes}
              className="group bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between sm:col-span-2 lg:col-span-1"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Barcode Suite</span>
                <p className="text-xl md:text-2xl font-black mt-2">Generate Sheets</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-blue-300 mt-4 group-hover:translate-x-1 transition">
                <span>Open Barcodes</span> <FiArrowRight />
              </div>
            </button>
          )}
        </div>
      )}

      {/* LOW STOCK BANNER WARNING */}
      {stats?.lowStockProducts > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 md:p-5 rounded-2xl mb-6 md:mb-8 flex items-start gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <FiAlertTriangle />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-amber-900">Inventory Low Stock Warning</h2>
            <p className="text-xs md:text-sm text-amber-700 mt-0.5">
              You currently have <strong className="font-bold">{stats.lowStockProducts}</strong> product(s) falling below safety stock limits. Please restock soon.
            </p>
          </div>
        </div>
      )}

      {/* SALES ANALYTICS GRAPH */}
      <div className="mb-6 md:mb-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FiBarChart2 className="text-indigo-600 text-lg" />
          <h2 className="font-bold text-slate-900 text-base">Sales Analytics Overview</h2>
        </div>
        <SalesGraph />
      </div>

      {/* --- DETAILS MODAL --- */}
      {detailsModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            {isLoadingModal ? (
              <ModalHeaderSkeleton />
            ) : (
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-lg font-bold text-slate-900">
                  {detailsModal.type === 'lowStock' && 'Low Stock Inventory Items'}
                  {detailsModal.type === 'todaysSales' && "Today's Completed Sales"}
                </h2>
                <button
                  onClick={() => setDetailsModal({ ...detailsModal, isOpen: false })}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                >
                  <FiX />
                </button>
              </div>
            )}

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingModal ? (
                detailsModal.type === 'todaysSales' ? <ModalSalesContentSkeleton /> : <ModalProductsContentSkeleton />
              ) : detailsModal.data.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">No records available for this view</div>
              ) : detailsModal.type === 'todaysSales' ? (
                /* TODAY'S SALES VIEW */
                <div className="space-y-3">
                  {detailsModal.data.map((sale) => (
                    <div key={sale._id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 text-sm">#{sale.invoiceNumber || 'N/A'}</strong>
                          <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">{sale.paymentMethod}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1"><strong className="text-slate-700">Customer:</strong> {sale.customerName || 'Walk-in'}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{new Date(sale.createdAt).toLocaleTimeString()} • {sale.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-600">{formatCurrency(sale.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* LOW STOCK VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {detailsModal.data.map((product) => (
                    <div key={product._id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">Bar: {product.barcode || 'N/A'}</p>
                        <p className="text-xs text-slate-500 mt-1">Min Safety: <strong className="text-slate-700">{product.minStock}</strong></p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-red-50 border border-red-200 text-red-600 font-black text-xs rounded-full">
                          {product.quantity} left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!isLoadingModal && (
              <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setDetailsModal({ ...detailsModal, isOpen: false })}
                  className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Close Modal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- QUICK LINKS SECTION --- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">Quick Navigation Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/products"
            className="group p-5 bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-100 rounded-2xl transition flex items-center gap-4"
          >
            <div className="w-11 h-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg shadow-md shadow-indigo-600/30 group-hover:scale-110 transition">
              <FiPackage />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 text-sm">Manage Products</h3>
              <p className="text-xs text-indigo-700 mt-0.5">Add, edit, or remove inventory</p>
            </div>
          </Link>

          <Link
            to="/pos"
            className="group p-5 bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-100 rounded-2xl transition flex items-center gap-4"
          >
            <div className="w-11 h-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-lg shadow-md shadow-emerald-600/30 group-hover:scale-110 transition">
              <FiShoppingCart />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 text-sm">POS Checkout</h3>
              <p className="text-xs text-emerald-700 mt-0.5">Process billing & print receipts</p>
            </div>
          </Link>

          <Link
            to="/sales"
            className="group p-5 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-100 rounded-2xl transition flex items-center gap-4"
          >
            <div className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg shadow-md shadow-blue-600/30 group-hover:scale-110 transition">
              <FiFileText />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-sm">Sales History</h3>
              <p className="text-xs text-blue-700 mt-0.5">View past orders & edit bills</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}