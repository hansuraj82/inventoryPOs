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


// import React, { useState } from 'react';
// import { formatCurrency } from '../utils/helpers';
// import { 
//   MdClose, 
//   MdTrendingUp, 
//   MdTrendingDown, 
//   MdHistory, 
//   MdArrowForward, 
//   MdAttachMoney, 
//   MdLocalMall 
// } from 'react-icons/md';

// export default function PriceHistoryModal({ product, isOpen, onClose }) {
//   const [activeTab, setActiveTab] = useState('selling'); // 'selling' or 'cost'
  
//   if (!isOpen) return null;

//   const priceHistory = product?.priceHistory || [];

//   // Helper to format timestamps cleanly
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-IN', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   // Helper to calculate pricing deltas
//   const calculateDelta = (oldPrice, newPrice) => {
//     const diff = newPrice - oldPrice;
//     const percentage = oldPrice !== 0 ? ((diff / oldPrice) * 100).toFixed(1) : '0.0';
//     return { 
//       isIncrease: diff >= 0, 
//       absolute: formatCurrency(Math.abs(diff)), 
//       percent: `${percentage}%` 
//     };
//   };

//   // Filter history logs based on what actually changed
//   const sellingHistory = priceHistory.filter(h => h.oldSellingPrice !== h.newSellingPrice);
//   const costHistory = priceHistory.filter(h => h.oldCostPrice !== h.newCostPrice);

//   const currentTabHistory = activeTab === 'selling' ? sellingHistory : costHistory;

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
//       <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-w-xl sm:w-full sm:max-h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        
//         {/* Header Block */}
//         <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
//           <div className="overflow-hidden pr-4">
//             <h2 className="text-xl font-black tracking-tight uppercase italic">Price Records</h2>
//             <p className="text-xs font-bold text-slate-400 mt-0.5 truncate">{product?.name}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-red-500 hover:text-white transition-all"
//           >
//             <MdClose size={18} />
//           </button>
//         </div>

//         {/* Live Metrics Matrix Banner */}
//         <div className="grid grid-cols-2 bg-slate-950 p-4 gap-2 text-white border-b border-slate-800 shrink-0">
//           <div className="bg-white/5 p-3 rounded-xl border border-white/5">
//             <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Current Selling Price</p>
//             <p className="text-xl font-black mt-1 text-indigo-300 tabular-nums">{formatCurrency(product?.sellingPrice)}</p>
//           </div>
//           <div className="bg-white/5 p-3 rounded-xl border border-white/5">
//             <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Current Cost Price</p>
//             <p className="text-xl font-black mt-1 text-amber-300 tabular-nums">{formatCurrency(product?.costPrice || 0)}</p>
//           </div>
//         </div>

//         {/* Dynamic Navigation Tabs */}
//         <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2 shrink-0">
//           <button
//             onClick={() => setActiveTab('selling')}
//             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
//               activeTab === 'selling'
//                 ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
//                 : 'text-slate-400 hover:text-slate-600'
//             }`}
//           >
//             <MdAttachMoney size={16} /> Retail Price ({sellingHistory.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('cost')}
//             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
//               activeTab === 'cost'
//                 ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
//                 : 'text-slate-400 hover:text-slate-600'
//             }`}
//           >
//             <MdLocalMall size={16} /> Cost Price ({costHistory.length})
//           </button>
//         </div>

//         {/* Main Streams Content Area */}
//         <div className="overflow-y-auto flex-1 p-4 bg-slate-50/30 space-y-3">
//           {currentTabHistory.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
//                 <MdHistory size={24} />
//               </div>
//               <p className="text-slate-700 font-bold text-sm">No adjustments found</p>
//               <p className="text-slate-400 text-xs mt-0.5 max-w-[240px]">
//                 No historical alterations recorded for this pricing ledger component yet.
//               </p>
//             </div>
//           ) : (
//             currentTabHistory.map((log, index) => {
//               // Extract target pricing variables based on context tab
//               const oldVal = activeTab === 'selling' ? log.oldSellingPrice : log.oldCostPrice;
//               const newVal = activeTab === 'selling' ? log.newSellingPrice : log.newCostPrice;
//               const delta = calculateDelta(oldVal, newVal);

//               return (
//                 <div key={index} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
//                   {/* Left Column: Visual flow direction details */}
//                   <div className="space-y-1.5 flex-1 min-w-0">
//                     <div className="flex items-center gap-2 text-xs font-bold text-slate-600 tabular-nums">
//                       <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-slate-500">{formatCurrency(oldVal)}</span>
//                       <MdArrowForward className="text-slate-300 shrink-0" size={14} />
//                       <span className="bg-slate-900 text-white px-2 py-0.5 rounded">{formatCurrency(newVal)}</span>
//                     </div>
//                     <p className="text-[10px] font-medium text-slate-400 tabular-nums">{formatDate(log.changedAt)}</p>
//                   </div>

//                   {/* Right Column: Status Impact Badge */}
//                   <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black tracking-tight shrink-0 ${
//                     delta.isIncrease 
//                       ? 'bg-rose-50 text-rose-600 border border-rose-100/60' 
//                       : 'bg-emerald-50 text-emerald-600 border border-emerald-100/60'
//                   }`}>
//                     {delta.isIncrease ? <MdTrendingUp size={14} /> : <MdTrendingDown size={14} />}
//                     <span>{delta.isIncrease ? '+' : '-'}{delta.absolute} <span className="opacity-60 text-[10px]">({delta.percent})</span></span>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Footer Area */}
//         <div className="p-4 bg-white border-t border-slate-100 shrink-0">
//           <button
//             onClick={onClose}
//             className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all"
//           >
//             Close Sheet
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }








import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { formatCurrency } from "../utils/helpers";
import {
  MdClose,
  MdTrendingUp,
  MdTrendingDown,
  MdHistory,
  MdArrowForward,
  MdAttachMoney,
  MdLocalMall,
  MdSearch,
  MdFilterList,
  MdShowChart,
  MdCalendarToday,
  MdKeyboardArrowDown,
  MdInventory2,
  MdRemove,
  MdCheckCircle,
} from "react-icons/md";

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getDelta = (oldValue, newValue) => {
  const oldPrice = toNumber(oldValue);
  const newPrice = toNumber(newValue);
  const difference = newPrice - oldPrice;

  return {
    difference,
    isIncrease: difference > 0,
    isDecrease: difference < 0,
    percentage:
      oldPrice !== 0
        ? (difference / Math.abs(oldPrice)) * 100
        : null,
  };
};

function TrendChart({ history, currentPrice }) {
  const points = useMemo(() => {
    if (!history.length) return [];

    const chronological = [...history].reverse();
    const values = [
      toNumber(chronological[0].oldValue),
      ...chronological.map((item) => toNumber(item.newValue)),
    ];

    const width = 600;
    const height = 120;
    const padding = 12;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return values.map((value, index) => ({
      x:
        padding +
        (index / Math.max(values.length - 1, 1)) *
          (width - padding * 2),
      y:
        height -
        padding -
        ((value - min) / range) * (height - padding * 2),
      value,
    }));
  }, [history]);

  if (points.length < 2) return null;

  const path = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const first = points[0];
  const last = points[points.length - 1];

  const isUp = last.value >= first.value;
  const color = isUp ? "#4f46e5" : "#e11d48";

  const areaPath = `${path} L ${last.x} 120 L ${first.x} 120 Z`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <MdShowChart size={18} />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Price trend
            </span>
          </div>
          <p className="mt-1 text-xl font-extrabold text-slate-900 tabular-nums">
            {formatCurrency(currentPrice)}
          </p>
        </div>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
          {history.length} changes
        </span>
      </div>

      <div className="mt-4 w-full">
        <svg
          viewBox="0 0 600 120"
          className="h-28 w-full overflow-visible"
          preserveAspectRatio="none"
          role="img"
          aria-label="Historical price trend"
        >
          <defs>
            <linearGradient
              id="priceHistoryArea"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={color}
                stopOpacity="0.16"
              />
              <stop
                offset="100%"
                stopColor={color}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {[30, 60, 90].map((y) => (
            <line
              key={y}
              x1="0"
              x2="600"
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="5 6"
            />
          ))}

          <path d={areaPath} fill="url(#priceHistoryArea)" />
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          <circle
            cx={last.x}
            cy={last.y}
            r="5"
            fill={color}
            stroke="white"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-400">
        <span>Oldest recorded</span>
        <span>Latest recorded</span>
      </div>
    </div>
  );
}

export default function PriceHistoryModal({
  product,
  isOpen,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState("selling");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("selling");
      setFilter("all");
      setSearch("");
      setExpandedIndex(null);
      setShowChart(true);
    }
  }, [isOpen, product?._id]);

  const priceHistory = useMemo(() => {
    return [...(Array.isArray(product?.priceHistory)
      ? product.priceHistory
      : [])].sort(
      (a, b) =>
        new Date(b.changedAt || 0).getTime() -
        new Date(a.changedAt || 0).getTime()
    );
  }, [product?.priceHistory]);

  const sellingHistory = useMemo(
    () =>
      priceHistory.filter(
        (item) =>
          toNumber(item.oldSellingPrice) !==
          toNumber(item.newSellingPrice)
      ),
    [priceHistory]
  );

  const costHistory = useMemo(
    () =>
      priceHistory.filter(
        (item) =>
          toNumber(item.oldCostPrice) !==
          toNumber(item.newCostPrice)
      ),
    [priceHistory]
  );

  const currentPrice =
    activeTab === "selling"
      ? toNumber(product?.sellingPrice)
      : toNumber(product?.costPrice);

  const history = useMemo(() => {
    const source =
      activeTab === "selling" ? sellingHistory : costHistory;

    return source.map((item, index) => ({
      ...item,
      id: item._id || `${item.changedAt}-${index}`,
      oldValue:
        activeTab === "selling"
          ? item.oldSellingPrice
          : item.oldCostPrice,
      newValue:
        activeTab === "selling"
          ? item.newSellingPrice
          : item.newCostPrice,
    }));
  }, [activeTab, sellingHistory, costHistory]);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const delta = getDelta(item.oldValue, item.newValue);

      if (filter === "increase" && !delta.isIncrease) {
        return false;
      }
      if (filter === "decrease" && !delta.isDecrease) {
        return false;
      }

      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const searchable = [
          formatCurrency(item.oldValue),
          formatCurrency(item.newValue),
          formatDate(item.changedAt),
          item.changedBy?.name,
          item.reason,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      }

      return true;
    });
  }, [history, filter, search]);

  const sellingPrice = toNumber(product?.sellingPrice);
  const costPrice = toNumber(product?.costPrice);
  const profit = sellingPrice - costPrice;
  const margin =
    sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  const latestChange = history[0];
  const latestDelta = latestChange
    ? getDelta(latestChange.oldValue, latestChange.newValue)
    : null;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/65 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-history-title"
        className="flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-slate-50 shadow-2xl sm:h-auto sm:max-h-[90dvh] sm:max-w-2xl sm:rounded-[26px]"
      >
        {/* Header */}
        <div className="shrink-0 bg-slate-950 px-4 pb-5 pt-4 text-white sm:px-6 sm:pt-6">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20 sm:hidden" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300">
                <MdHistory size={24} />
              </div>

              <div className="min-w-0">
                <h2
                  id="price-history-title"
                  className="text-lg font-extrabold tracking-tight sm:text-xl"
                >
                  Price History
                </h2>
                <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">
                  {product?.name || "Product"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close price history"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-slate-200 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
            >
              <MdClose size={22} />
            </button>
          </div>

          {/* Current price cards */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-indigo-300">
                <MdAttachMoney size={17} />
                <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">
                  Selling Price
                </span>
              </div>
              <p className="mt-2 break-all text-lg font-extrabold tabular-nums sm:text-2xl">
                {formatCurrency(sellingPrice)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-amber-300">
                <MdLocalMall size={17} />
                <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">
                  Cost Price
                </span>
              </div>
              <p className="mt-2 break-all text-lg font-extrabold tabular-nums sm:text-2xl">
                {formatCurrency(costPrice)}
              </p>
            </div>
          </div>

          {/* Profit summary */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.06] px-3.5 py-2.5">
            <span className="text-xs font-medium text-slate-300">
              Current gross profit / unit
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-extrabold tabular-nums ${
                  profit >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {formatCurrency(profit)}
              </span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                {margin.toFixed(1)}% margin
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-3 pt-3 sm:px-5">
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                key: "selling",
                label: "Selling Price",
                count: sellingHistory.length,
                Icon: MdAttachMoney,
              },
              {
                key: "cost",
                label: "Cost Price",
                count: costHistory.length,
                Icon: MdLocalMall,
              },
            ].map(({ key, label, count, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  setFilter("all");
                  setSearch("");
                  setExpandedIndex(null);
                }}
                className={`flex min-w-0 items-center justify-center gap-1.5 rounded-t-xl border-b-[3px] px-2 py-3 text-xs font-bold transition-all sm:gap-2 sm:text-sm ${
                  activeTab === key
                    ? "border-indigo-600 bg-indigo-50/60 text-indigo-700"
                    : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                    activeTab === key
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-3 pb-6 sm:p-5">
          {/* Latest change */}
          {latestChange && latestDelta && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Latest adjustment
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-600">
                  {formatDate(latestChange.changedAt)}
                </p>
              </div>

              <div
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold ${
                  latestDelta.isIncrease
                    ? "bg-rose-50 text-rose-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {latestDelta.isIncrease ? (
                  <MdTrendingUp size={18} />
                ) : (
                  <MdTrendingDown size={18} />
                )}
                {latestDelta.difference > 0 ? "+" : "-"}
                {formatCurrency(Math.abs(latestDelta.difference))}
              </div>
            </div>
          )}

          {/* Chart */}
          {history.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowChart((value) => !value)}
                aria-expanded={showChart}
                className="flex w-full items-center justify-between rounded-xl px-1 py-1 text-left text-xs font-bold text-slate-600 hover:text-indigo-600"
              >
                <span className="flex items-center gap-2">
                  <MdShowChart size={19} />
                  Historical trend
                </span>
                <MdKeyboardArrowDown
                  size={20}
                  className={`transition-transform ${
                    showChart ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showChart && (
                <TrendChart
                  history={history}
                  currentPrice={currentPrice}
                />
              )}
            </>
          )}

          {/* Search and filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Change Timeline
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {filteredHistory.length} of {history.length} records
                </p>
              </div>
              <MdFilterList size={20} className="text-slate-400" />
            </div>

            <div className="relative">
              <MdSearch
                size={20}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search date, price or reason..."
                aria-label="Search price history"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { key: "all", label: "All changes" },
                { key: "increase", label: "Increased" },
                { key: "decrease", label: "Decreased" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setFilter(item.key);
                    setExpandedIndex(null);
                  }}
                  aria-pressed={filter === item.key}
                  className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition ${
                    filter === item.key
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* History records */}
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                {history.length === 0 ? (
                  <MdHistory size={28} />
                ) : (
                  <MdSearch size={28} />
                )}
              </div>

              <p className="text-sm font-extrabold text-slate-800">
                {history.length === 0
                  ? "No price changes yet"
                  : "No matching records"}
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-400">
                {history.length === 0
                  ? "Changes to this product's price will appear here once they are recorded."
                  : "Try another search or select a different filter."}
              </p>

              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="relative space-y-3">
              {filteredHistory.map((item, index) => {
                const delta = getDelta(
                  item.oldValue,
                  item.newValue
                );

                const expanded = expandedIndex === item.id;

                return (
                  <div
                    key={item.id}
                    className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                      expanded
                        ? "border-indigo-200 shadow-md shadow-indigo-100/40"
                        : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIndex(
                          expanded ? null : item.id
                        )
                      }
                      aria-expanded={expanded}
                      className="w-full p-3.5 text-left sm:p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              delta.isIncrease
                                ? "bg-rose-50 text-rose-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {delta.isIncrease ? (
                              <MdTrendingUp size={20} />
                            ) : (
                              <MdTrendingDown size={20} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-slate-800 sm:text-sm">
                              Price{" "}
                              {delta.isIncrease
                                ? "increased"
                                : "decreased"}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                              <MdCalendarToday size={12} />
                              {formatDate(item.changedAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-start gap-1">
                          <div className="text-right">
                            <p
                              className={`text-sm font-extrabold tabular-nums ${
                                delta.isIncrease
                                  ? "text-rose-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {delta.isIncrease ? "+" : "-"}
                              {formatCurrency(
                                Math.abs(delta.difference)
                              )}
                            </p>
                            <p className="mt-1 text-[11px] font-semibold text-slate-400">
                              {delta.percentage === null
                                ? "N/A"
                                : `${
                                    delta.percentage > 0 ? "+" : ""
                                  }${delta.percentage.toFixed(1)}%`}
                            </p>
                          </div>
                          <MdKeyboardArrowDown
                            size={18}
                            className={`mt-0.5 text-slate-400 transition-transform ${
                              expanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-500 tabular-nums">
                          {formatCurrency(item.oldValue)}
                        </span>
                        <MdArrowForward
                          size={17}
                          className="text-slate-300"
                        />
                        <span className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-extrabold text-white tabular-nums">
                          {formatCurrency(item.newValue)}
                        </span>
                      </div>
                    </button>

                    {expanded && (
                      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                              Previous price
                            </p>
                            <p className="mt-1 text-sm font-extrabold text-slate-700">
                              {formatCurrency(item.oldValue)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                              Updated price
                            </p>
                            <p className="mt-1 text-sm font-extrabold text-slate-900">
                              {formatCurrency(item.newValue)}
                            </p>
                          </div>
                        </div>

                        {item.reason && (
                          <div className="mt-3">
                            <p className="text-[10px] font-bold uppercase text-slate-400">
                              Reason
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">
                              {item.reason}
                            </p>
                          </div>
                        )}

                        {item.changedBy?.name && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <MdCheckCircle
                              size={16}
                              className="text-emerald-500"
                            />
                            Updated by {item.changedBy.name}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="hidden min-w-0 sm:block">
              <p className="text-xs font-bold text-slate-700">
                {history.length} recorded changes
              </p>
              <p className="text-[11px] text-slate-400">
                Product pricing audit
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-extrabold text-white shadow-sm transition-all hover:bg-indigo-600 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 sm:w-auto sm:min-w-36"
            >
              <MdCheckCircle size={18} />
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
