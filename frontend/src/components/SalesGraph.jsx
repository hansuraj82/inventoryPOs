import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { saleAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  ShoppingBag, 
  Layers, 
  DollarSign, 
  BarChart3, 
  LineChart,
  Loader2
} from 'lucide-react';

export default function SalesGraph() {
  const [graphData, setGraphData] = useState([]);
  const [summary, setMySummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [chartStyle, setChartStyle] = useState('area'); // 'area' | 'bar'

  // Fetch analytics data
  const fetchAnalytics = async (startDate, endDate) => {
    try {
      setIsLoading(true);
      const response = await saleAPI.getAnalytics(startDate, endDate);
      
      // Clean dates for the graphical axis labels
      const formattedData = (response.data.data.graphData || []).map(item => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
      }));

      setGraphData(formattedData);
      setMySummary(response.data.data.summary);
    } catch (error) {
      toast.error('Failed to load sales analytics');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRange = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    let daysBack = 30;

    if (type === '7days') daysBack = 7;
    else if (type === '14days') daysBack = 14;
    else if (type === '30days') daysBack = 30;
    else if (type === '90days') daysBack = 90;

    start.setDate(start.getDate() - daysBack);
    return { 
      startStr: start.toISOString().split('T')[0], 
      endStr: today.toISOString().split('T')[0] 
    };
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setShowCustomDatePicker(false);
    if (type !== 'custom') {
      const { startStr, endStr } = getDateRange(type);
      fetchAnalytics(startStr, endStr);
    }
  };

  const handleCustomDateFilter = () => {
    if (!customStartDate || !customEndDate) {
      toast.error('Please select both Dates');
      return;
    }
    setFilterType('custom');
    fetchAnalytics(customStartDate, customEndDate);
    setShowCustomDatePicker(false);
  };

  useEffect(() => {
    const { startStr, endStr } = getDateRange('30days');
    fetchAnalytics(startStr, endStr);
  }, []);

  // Custom UI Tooltip overlay component for Recharts graph hover states
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 text-white p-4 rounded-2xl shadow-xl border border-slate-800 text-xs space-y-1.5 backdrop-blur-md bg-opacity-95 animate-fade-in">
          <p className="font-black uppercase text-slate-400 tracking-wider mb-1">{payload[0].payload.date}</p>
          <div className="flex items-center gap-4 justify-between">
            <span className="text-indigo-300 font-bold">Revenue:</span>
            <span className="font-black tabular-nums">{formatCurrency(payload[0].value)}</span>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <span className="text-emerald-400 font-bold">Generated Bills:</span>
            <span className="font-black tabular-nums">{payload[0].payload.totalTransactions} bills</span>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <span className="text-purple-400 font-bold">Items Sold:</span>
            <span className="font-black tabular-nums">{payload[0].payload.totalItems} units</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-100 shadow-xl rounded-[2.5rem] p-4 sm:p-6 transition-all">
      
      {/* Upper Control Row Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-slate-50 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight uppercase italic text-slate-900">
              Performance <span className="text-indigo-600">Ledger</span>
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              Live Interactive Analytical Charts
            </p>
          </div>
        </div>

        {/* Filters Grouping Menu */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart View Toggle Style */}
          <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
            <button 
              onClick={() => setChartStyle('area')}
              className={`p-2 rounded-lg transition-all ${chartStyle === 'area' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              <LineChart size={16} />
            </button>
            <button 
              onClick={() => setChartStyle('bar')}
              className={`p-2 rounded-lg transition-all ${chartStyle === 'bar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              <BarChart3 size={16} />
            </button>
          </div>

          <div className="flex bg-slate-100 border p-1 rounded-xl">
            {['7days', '14days', '30days', '90days'].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  filterType === type ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type.replace('days', 'D')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCustomDatePicker(!showCustomDatePicker)}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
              filterType === 'custom' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Custom Filter</span>
          </button>
        </div>
      </div>

      {/* Custom Date Picker Frame Dropdown */}
      {showCustomDatePicker && (
        <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20"
            />
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              onClick={handleCustomDateFilter}
              className="w-full bg-indigo-600 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-all"
            >
              Get Details
            </button>
          </div>
        </div>
      )}

      {/* Summary Matrix Grid Dashboard Block */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950 p-4 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-bl-2xl flex items-center justify-center text-indigo-400"><DollarSign size={18} /></div>
            <p className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">Gross Turnover</p>
            <p className="text-xl font-black mt-1 tabular-nums truncate">{formatCurrency(summary.totalRevenue)}</p>
          </div>
          <div className="bg-white border p-4 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50 rounded-bl-2xl flex items-center justify-center text-emerald-500"><ShoppingBag size={16} /></div>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Bills</p>
            <p className="text-xl font-black mt-1 text-slate-900 tabular-nums">{summary.totalTransactions}</p>
          </div>
          <div className="bg-white border p-4 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50 rounded-bl-2xl flex items-center justify-center text-purple-500"><Layers size={16} /></div>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Items Sold</p>
            <p className="text-xl font-black mt-1 text-slate-900 tabular-nums">{summary.totalItems}</p>
          </div>
          <div className="bg-white border p-4 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50 rounded-bl-2xl flex items-center justify-center text-amber-500"><TrendingUp size={16} /></div>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Average Transaction Amount</p>
            <p className="text-xl font-black mt-1 text-slate-900 tabular-nums truncate">{formatCurrency(summary.averageTransactionValue)}</p>
          </div>
        </div>
      )}

      {/* Main Graph Component Container Block */}
      <div className="mt-8 h-80 w-full relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-2">Compiling Vector Nodes...</p>
          </div>
        ) : graphData.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-10 h-10 text-slate-200 mb-2" />
            <p className="text-xs font-black text-slate-700 uppercase">No Data Found</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartStyle === 'area' ? (
              <AreaChart data={graphData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="formattedDate" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            ) : (
              <BarChart data={graphData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="formattedDate" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="totalRevenue" 
                  fill="#4f46e5" 
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}