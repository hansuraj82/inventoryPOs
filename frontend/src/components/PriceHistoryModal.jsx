// import React from 'react';
// import { formatCurrency } from '../utils/helpers';

// export default function PriceHistoryModal({ product, isOpen, onClose }) {
//   if (!isOpen) return null;

//   const priceHistory = product?.priceHistory || [];

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const calculateDifference = (oldPrice, newPrice) => {
//     const diff = newPrice - oldPrice;
//     const percentage = oldPrice !== 0 ? ((diff / oldPrice) * 100).toFixed(2) : 0;
//     return { diff, percentage };
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-bold">{product?.name}</h2>
//             <p className="text-blue-100 text-sm mt-1">Price History</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-2xl font-bold hover:text-blue-200 transition"
//           >
//             ×
//           </button>
//         </div>

//         {/* Content */}
//         <div className="overflow-y-auto flex-1">
//           {priceHistory.length === 0 ? (
//             <div className="p-8 text-center">
//               <div className="text-gray-400 text-lg">
//                 <p>📊 No price changes yet</p>
//                 <p className="text-sm mt-2">Price history will appear when you update prices</p>
//               </div>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {/* Current Price */}
//               <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-semibold text-gray-600">CURRENT PRICE</p>
//                     <p className="text-3xl font-bold text-green-600 mt-2">
//                       {formatCurrency(product?.sellingPrice)}
//                     </p>
//                     {product?.costPrice > 0 && (
//                       <p className="text-sm text-gray-600 mt-2">
//                         Cost: {formatCurrency(product?.costPrice)}
//                       </p>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                       Latest
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Price History Items */}
//               {priceHistory.map((history, index) => {
//                 const sellingPriceDiff = calculateDifference(
//                   history.oldSellingPrice,
//                   history.newSellingPrice
//                 );
//                 const costPriceDiff = calculateDifference(
//                   history.oldCostPrice,
//                   history.newCostPrice
//                 );

//                 const sellingPriceChanged = history.oldSellingPrice !== history.newSellingPrice;
//                 const costPriceChanged = history.oldCostPrice !== history.newCostPrice;

//                 return (
//                   <div key={index} className="p-6 hover:bg-gray-50 transition">
//                     <div className="flex justify-between items-start mb-4">
//                       <p className="text-sm font-semibold text-gray-500">
//                         #{index + 1} • {formatDate(history.changedAt)}
//                       </p>
//                     </div>

//                     {/* Selling Price Change */}
//                     {sellingPriceChanged && (
//                       <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                         <p className="text-sm font-semibold text-gray-700 mb-3">Selling Price</p>
//                         <div className="flex justify-between items-center gap-4">
//                           <div>
//                             <p className="text-xs text-gray-500 mb-1">Old Price</p>
//                             <p className="text-lg font-semibold text-gray-700">
//                               {formatCurrency(history.oldSellingPrice)}
//                             </p>
//                           </div>
//                           <div className="text-gray-400 text-xl">→</div>
//                           <div>
//                             <p className="text-xs text-gray-500 mb-1">New Price</p>
//                             <p className="text-lg font-semibold text-gray-700">
//                               {formatCurrency(history.newSellingPrice)}
//                             </p>
//                           </div>
//                           <div
//                             className={`p-3 rounded-lg text-center ${
//                               sellingPriceDiff.diff >= 0
//                                 ? 'bg-red-100'
//                                 : 'bg-green-100'
//                             }`}
//                           >
//                             <p className={`text-xs font-semibold mb-1 ${
//                               sellingPriceDiff.diff >= 0
//                                 ? 'text-red-600'
//                                 : 'text-green-600'
//                             }`}>
//                               {sellingPriceDiff.diff >= 0 ? '📈 Increase' : '📉 Decrease'}
//                             </p>
//                             <p className={`text-lg font-bold ${
//                               sellingPriceDiff.diff >= 0
//                                 ? 'text-red-600'
//                                 : 'text-green-600'
//                             }`}>
//                               {sellingPriceDiff.diff >= 0 ? '+' : ''}{formatCurrency(sellingPriceDiff.diff)}
//                             </p>
//                             <p className={`text-xs ${
//                               sellingPriceDiff.diff >= 0
//                                 ? 'text-red-600'
//                                 : 'text-green-600'
//                             }`}>
//                               ({sellingPriceDiff.percentage}%)
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Cost Price Change */}
//                     {costPriceChanged && (
//                       <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
//                         <p className="text-sm font-semibold text-gray-700 mb-3">Cost Price</p>
//                         <div className="flex justify-between items-center gap-4">
//                           <div>
//                             <p className="text-xs text-gray-500 mb-1">Old Price</p>
//                             <p className="text-lg font-semibold text-gray-700">
//                               {formatCurrency(history.oldCostPrice)}
//                             </p>
//                           </div>
//                           <div className="text-gray-400 text-xl">→</div>
//                           <div>
//                             <p className="text-xs text-gray-500 mb-1">New Price</p>
//                             <p className="text-lg font-semibold text-gray-700">
//                               {formatCurrency(history.newCostPrice)}
//                             </p>
//                           </div>
//                           <div
//                             className={`p-3 rounded-lg text-center ${
//                               costPriceDiff.diff >= 0
//                                 ? 'bg-red-100'
//                                 : 'bg-green-100'
//                             }`}
//                           >
//                             <p className={`text-xs font-semibold mb-1 ${
//                               costPriceDiff.diff >= 0
//                                 ? 'text-red-600'
//                                 : 'text-green-600'
//                             }`}>
//                               {costPriceDiff.diff >= 0 ? '📈 Increase' : '📉 Decrease'}
//                             </p>
//                             <p className={`text-lg font-bold ${
//                               costPriceDiff.diff >= 0
//                                 ? 'text-red-600'
//                                 : 'text-green-600'
//                             }`}>
//                               {costPriceDiff.diff >= 0 ? '+' : ''}{formatCurrency(costPriceDiff.diff)}
//                             </p>
//                             <p className={`text-xs ${
//                               costPriceDiff.diff >= 0
//                                 ? 'text-red-600'
//                                 : 'text-green-600'
//                             }`}>
//                               ({costPriceDiff.percentage}%)
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import { 
  MdClose, 
  MdTrendingUp, 
  MdTrendingDown, 
  MdHistory, 
  MdArrowForward, 
  MdAttachMoney, 
  MdLocalMall 
} from 'react-icons/md';

export default function PriceHistoryModal({ product, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('selling'); // 'selling' or 'cost'
  
  if (!isOpen) return null;

  const priceHistory = product?.priceHistory || [];

  // Helper to format timestamps cleanly
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to calculate pricing deltas
  const calculateDelta = (oldPrice, newPrice) => {
    const diff = newPrice - oldPrice;
    const percentage = oldPrice !== 0 ? ((diff / oldPrice) * 100).toFixed(1) : '0.0';
    return { 
      isIncrease: diff >= 0, 
      absolute: formatCurrency(Math.abs(diff)), 
      percent: `${percentage}%` 
    };
  };

  // Filter history logs based on what actually changed
  const sellingHistory = priceHistory.filter(h => h.oldSellingPrice !== h.newSellingPrice);
  const costHistory = priceHistory.filter(h => h.oldCostPrice !== h.newCostPrice);

  const currentTabHistory = activeTab === 'selling' ? sellingHistory : costHistory;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-w-xl sm:w-full sm:max-h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        
        {/* Header Block */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="overflow-hidden pr-4">
            <h2 className="text-xl font-black tracking-tight uppercase italic">Price Records</h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5 truncate">{product?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-red-500 hover:text-white transition-all"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Live Metrics Matrix Banner */}
        <div className="grid grid-cols-2 bg-slate-950 p-4 gap-2 text-white border-b border-slate-800 shrink-0">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Current Retail Target</p>
            <p className="text-xl font-black mt-1 text-indigo-300 tabular-nums">{formatCurrency(product?.sellingPrice)}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Current Procurement Base</p>
            <p className="text-xl font-black mt-1 text-amber-300 tabular-nums">{formatCurrency(product?.costPrice || 0)}</p>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('selling')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'selling'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MdAttachMoney size={16} /> Retail Price Logs ({sellingHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'cost'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MdLocalMall size={16} /> Procurement Logs ({costHistory.length})
          </button>
        </div>

        {/* Main Streams Content Area */}
        <div className="overflow-y-auto flex-1 p-4 bg-slate-50/30 space-y-3">
          {currentTabHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <MdHistory size={24} />
              </div>
              <p className="text-slate-700 font-bold text-sm">No adjustments found</p>
              <p className="text-slate-400 text-xs mt-0.5 max-w-[240px]">
                No historical alterations recorded for this pricing ledger component yet.
              </p>
            </div>
          ) : (
            currentTabHistory.map((log, index) => {
              // Extract target pricing variables based on context tab
              const oldVal = activeTab === 'selling' ? log.oldSellingPrice : log.oldCostPrice;
              const newVal = activeTab === 'selling' ? log.newSellingPrice : log.newCostPrice;
              const delta = calculateDelta(oldVal, newVal);

              return (
                <div key={index} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
                  {/* Left Column: Visual flow direction details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 tabular-nums">
                      <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-slate-500">{formatCurrency(oldVal)}</span>
                      <MdArrowForward className="text-slate-300 shrink-0" size={14} />
                      <span className="bg-slate-900 text-white px-2 py-0.5 rounded">{formatCurrency(newVal)}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 tabular-nums">{formatDate(log.changedAt)}</p>
                  </div>

                  {/* Right Column: Status Impact Badge */}
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black tracking-tight shrink-0 ${
                    delta.isIncrease 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100/60' 
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100/60'
                  }`}>
                    {delta.isIncrease ? <MdTrendingUp size={14} /> : <MdTrendingDown size={14} />}
                    <span>{delta.isIncrease ? '+' : '-'}{delta.absolute} <span className="opacity-60 text-[10px]">({delta.percent})</span></span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all"
          >
            Close Sheet
          </button>
        </div>

      </div>
    </div>
  );
}