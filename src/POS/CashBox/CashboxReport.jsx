// // components/cashbox/CashboxReport.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { posCashboxAPI } from "../../context_or_provider/pos/cashbox/cashboxAPI";
//
// const CashboxReport = () => {
//
//   const [reportData, setReportData] = useState({
//     summary: {
//       opening_balance: 0,
//       total_income: 0,
//       total_expense: 0,
//       closing_balance: 0
//     },
//     daily_transactions: [],
//     category_breakdown: {
//       income: [],
//       expense: []
//     }
//   });
//
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [dateRange, setDateRange] = useState({
//     start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
//     end_date: new Date().toISOString().split('T')[0]
//   });
//
//   const fetchReport = useCallback(async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await posCashboxAPI.getDetailedReport({
//         start_date: dateRange.start_date,
//         end_date: dateRange.end_date
//       });
//
//       if (response.data.success) {
//         setReportData(response.data.report);
//       } else {
//         setError('রিপোর্ট জেনারেট করতে সমস্যা হয়েছে।');
//       }
//     } catch (err) {
//       console.error('Error fetching report:', err);
//       setError('সার্ভারের সাথে যোগাযোগ করতে সমস্যা হয়েছে।');
//     } finally {
//       setLoading(false);
//     }
//   }, [dateRange]);
//
//   useEffect(() => {
//     fetchReport();
//   }, [fetchReport]);
//
//   const formatCurrency = (amount) => `৳${parseFloat(amount || 0).toLocaleString()}`;
//   const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', {
//     day: '2-digit', month: 'short', year: 'numeric'
//   });
//
//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Report</h1>
//         <p className="text-gray-500 mt-1">Detailed analysis of your store's cash flow</p>
//       </div>
//
//       {/* Date Range Filter */}
//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">From Date</label>
//             <input
//               type="date"
//               className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all font-medium"
//               value={dateRange.start_date}
//               onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">To Date</label>
//             <input
//               type="date"
//               className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all font-medium"
//               value={dateRange.end_date}
//               onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
//             />
//           </div>
//           <button
//             onClick={fetchReport}
//             disabled={loading}
//             className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
//           >
//             {loading ? 'Generating...' : '📊 Generate Detailed Report'}
//           </button>
//         </div>
//       </div>
//
//       {error && (
//         <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center">
//           <span className="mr-2">⚠️</span> {error}
//         </div>
//       )}
//
//       {loading ? (
//         <div className="py-20 text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
//           <p className="mt-4 text-gray-500 font-bold animate-pulse">Analyzing Financial Records...</p>
//         </div>
//       ) : (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all group">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Opening</p>
//               <p className="text-xl font-black text-gray-800 group-hover:text-indigo-600 transition-colors">
//                 {formatCurrency(reportData.summary.opening_balance)}
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-all group">
//               <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Total Income</p>
//               <p className="text-xl font-black text-green-600">
//                 +{formatCurrency(reportData.summary.total_income)}
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-red-200 transition-all group">
//               <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Total Expense</p>
//               <p className="text-xl font-black text-red-600">
//                 -{formatCurrency(reportData.summary.total_expense)}
//               </p>
//             </div>
//             <div className="bg-indigo-600 p-6 rounded-2xl shadow-xl shadow-indigo-100 text-white group">
//               <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Net Closing</p>
//               <p className="text-xl font-black">{formatCurrency(reportData.summary.closing_balance)}</p>
//             </div>
//           </div>
//
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* Income Breakdown */}
//             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//               <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center">
//                 <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
//                 Top Income Sources
//               </h2>
//               <div className="space-y-6">
//                 {reportData.category_breakdown.income.length > 0 ? reportData.category_breakdown.income.map((item, index) => (
//                   <div key={index} className="space-y-2">
//                     <div className="flex justify-between items-end">
//                       <span className="text-sm font-bold text-gray-600 truncate max-w-[200px]">{item.category}</span>
//                       <span className="text-sm font-black text-green-600">{formatCurrency(item.amount)}</span>
//                     </div>
//                     <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
//                       <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${item.percentage}%` }}></div>
//                     </div>
//                     <p className="text-[10px] text-right text-gray-400 font-bold uppercase">{item.percentage}% of total</p>
//                   </div>
//                 )) : <p className="text-center text-gray-400 font-medium italic">No income data for this period</p>}
//               </div>
//             </div>
//
//             {/* Expense Breakdown */}
//             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//               <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center">
//                 <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
//                 Top Expense Categories
//               </h2>
//               <div className="space-y-6">
//                 {reportData.category_breakdown.expense.length > 0 ? reportData.category_breakdown.expense.map((item, index) => (
//                   <div key={index} className="space-y-2">
//                     <div className="flex justify-between items-end">
//                       <span className="text-sm font-bold text-gray-600 truncate max-w-[200px]">{item.category}</span>
//                       <span className="text-sm font-black text-red-600">{formatCurrency(item.amount)}</span>
//                     </div>
//                     <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
//                       <div className="bg-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${item.percentage}%` }}></div>
//                     </div>
//                     <p className="text-[10px] text-right text-gray-400 font-bold uppercase">{item.percentage}% of total</p>
//                   </div>
//                 )) : <p className="text-center text-gray-400 font-medium italic">No expense data for this period</p>}
//               </div>
//             </div>
//           </div>
//
//           {/* Daily Table */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-8 border-b border-gray-50">
//               <h2 className="text-xl font-black text-gray-800">Daily Transaction Summary</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
//                     <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Income</th>
//                     <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Expense</th>
//                     <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Net Change</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {reportData.daily_transactions.length > 0 ? reportData.daily_transactions.map((day, index) => (
//                     <tr key={index} className="hover:bg-gray-50/50 transition-colors">
//                       <td className="px-8 py-5 text-sm font-bold text-gray-600">{formatDate(day.date)}</td>
//                       <td className="px-8 py-5 text-sm font-black text-green-600">{formatCurrency(day.income)}</td>
//                       <td className="px-8 py-5 text-sm font-black text-red-600">{formatCurrency(day.expense)}</td>
//                       <td className={`px-8 py-5 text-sm font-black ${day.net_change >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
//                         {day.net_change >= 0 ? '+' : ''}{formatCurrency(day.net_change)}
//                       </td>
//                     </tr>
//                   )) : (
//                     <tr>
//                       <td colSpan="4" className="px-8 py-10 text-center text-gray-400 font-medium italic">No activity recorded for this date range</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };
//
// export default CashboxReport;



// components/cashbox/CashboxReport.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { posCashboxAPI } from "../../context_or_provider/pos/cashbox/cashboxAPI";
import {
    Calendar, Store, ChevronLeft, ChevronRight,
    TrendingUp, TrendingDown, Wallet, Receipt, Download
} from 'lucide-react';

const fmt = (d) => d.toISOString().slice(0, 10);
const todayStr = () => fmt(new Date());
const monthStartStr = () => {
    const d = new Date();
    return fmt(new Date(d.getFullYear(), d.getMonth(), 1));
};

const CashboxReport = () => {
    // ── Filter state
    const [viewMode, setViewMode] = useState('business');
    const [startDate, setStartDate] = useState(monthStartStr());
    const [endDate, setEndDate] = useState(todayStr());
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    // ── Data
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        count: 0, next: null, previous: null, total_pages: 0,
    });

    // ── Fetch
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                start_date: startDate,
                end_date: endDate,
                page,
                page_size: pageSize,
            };
            const apiMethod = viewMode === 'business'
                ? posCashboxAPI.getBusinessDays
                : posCashboxAPI.getCalendarDays;
            const res = await apiMethod(params);

            setRows(res.data.results || []);
            const total = res.data.count || 0;
            setPagination({
                count: total,
                next: res.data.next,
                previous: res.data.previous,
                total_pages: Math.ceil(total / pageSize),
            });
        } catch (err) {
            console.error('Report fetch error:', err);
            setError('ডেটা লোড করতে সমস্যা হয়েছে।');
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [viewMode, startDate, endDate, page, pageSize]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Reset page when filters change
    useEffect(() => { setPage(1); }, [viewMode, startDate, endDate]);

    // ── Aggregates (from current page)
    const totals = rows.reduce((acc, r) => {
        acc.income += Number(r.total_income ?? r.income ?? 0);
        acc.expense += Number(r.total_expense ?? r.expense ?? 0);
        acc.closing += Number(r.closing_balance ?? 0);
        return acc;
    }, { income: 0, expense: 0, closing: 0 });

    const fc = (n) => `৳${parseFloat(n || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 0, maximumFractionDigits: 2,
    })}`;

    const formatDay = (dayKey) => new Date(dayKey).toLocaleDateString('en-GB', {
        weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    });

    const formatTime = (ts) => ts
        ? new Date(ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        : '—';

    return (
        <div className="w-full space-y-6">

            {/* ═══════ HEADER ═══════ */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        📊 ক্যাশবক্স রিপোর্ট
                    </h1>
                    <p className="text-gray-400 text-sm mt-0.5">
                        Calendar / Business Day ভিত্তিক বিশ্লেষণ
                    </p>
                </div>

                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition"
                >
                    <Download size={14} /> Print / Export
                </button>
            </div>

            {/* ═══════ FILTER BAR ═══════ */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 space-y-4">

                {/* View toggle */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                                viewMode === 'calendar'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Calendar size={14} /> Calendar Day
                        </button>
                        <button
                            onClick={() => setViewMode('business')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                                viewMode === 'business'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Store size={14} /> Business Day
                        </button>
                    </div>
                </div>

                {/* Date range */}
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">শুরুর তারিখ</label>
                        <input
                            type="date"
                            value={startDate}
                            max={endDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">শেষের তারিখ</label>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            max={todayStr()}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                        {loading ? 'লোড হচ্ছে...' : 'রিফ্রেশ'}
                    </button>
                </div>
            </div>

            {/* ═══════ SUMMARY ═══════ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-green-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold text-green-500 uppercase">মোট আয়</p>
                        <TrendingUp className="text-green-500" size={18} />
                    </div>
                    <p className="text-2xl font-black text-green-600">{fc(totals.income)}</p>
                    <p className="text-[10px] text-gray-400 mt-1">এই page-এ</p>
                </div>
                <div className="bg-white border border-red-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold text-red-500 uppercase">মোট ব্যয়</p>
                        <TrendingDown className="text-red-500" size={18} />
                    </div>
                    <p className="text-2xl font-black text-red-600">{fc(totals.expense)}</p>
                    <p className="text-[10px] text-gray-400 mt-1">এই page-এ</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold text-indigo-200 uppercase">Closing (সর্বশেষ)</p>
                        <Wallet className="text-white/60" size={18} />
                    </div>
                    <p className="text-2xl font-black">{fc(totals.closing)}</p>
                    <p className="text-[10px] text-indigo-200 mt-1">page-এর শেষ দিন</p>
                </div>
            </div>

            {/* ═══════ TABLE ═══════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-gray-800">
                            {viewMode === 'business' ? '🏪 Business Day Report' : '📅 Calendar Day Report'}
                        </h2>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                            {pagination.count}টি দিন · page {page} / {pagination.total_pages || 1}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-14 text-center">
                        <div className="inline-block w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-3" />
                        <p className="text-gray-400 text-sm">লোড হচ্ছে...</p>
                    </div>
                ) : error ? (
                    <div className="p-14 text-center text-red-500 font-semibold">{error}</div>
                ) : rows.length === 0 ? (
                    <div className="p-14 text-center text-gray-400">
                        <p className="text-4xl mb-3">🗓️</p>
                        <p className="font-bold">এই সময়ের মধ্যে কোনো দিন নেই</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {rows.map((r) => {
                            const dayKey = viewMode === 'business' ? r.business_date : r.day;
                            const isOpen = viewMode === 'business' && r.status === 'open';
                            const income = Number(r.total_income ?? r.income ?? 0);
                            const expense = Number(r.total_expense ?? r.expense ?? 0);
                            const closing = Number(r.closing_balance ?? 0);

                            return (
                                <div key={dayKey} className="px-6 py-4 hover:bg-gray-50/70">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-2 h-12 rounded-full ${
                                                isOpen ? 'bg-emerald-500' : 'bg-indigo-500'
                                            }`} />
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900 text-sm flex items-center gap-2 flex-wrap">
                                                    {formatDay(dayKey)}
                                                    {isOpen && (
                                                        <span className="px-2 py-0.5 text-[9px] bg-emerald-500 text-white rounded-md font-black">
                                                            OPEN
                                                        </span>
                                                    )}
                                                    {r.auto_closed && (
                                                        <span className="px-2 py-0.5 text-[9px] bg-orange-100 text-orange-700 rounded-md font-black">
                                                            AUTO
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">
                                                    Opening: {fc(r.opening_balance)}
                                                    {viewMode === 'business' && r.opened_at && (
                                                        <> · {formatTime(r.opened_at)}</>
                                                    )}
                                                    {viewMode === 'business' && r.closed_at && (
                                                        <> → {formatTime(r.closed_at)}</>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-right">
                                            <div>
                                                <p className="text-[10px] text-green-500 font-bold uppercase">আয়</p>
                                                <p className="text-sm font-black text-green-600">+{fc(income)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-red-500 font-bold uppercase">ব্যয়</p>
                                                <p className="text-sm font-black text-red-600">−{fc(expense)}</p>
                                            </div>
                                            <div className="min-w-[120px]">
                                                <p className="text-[10px] text-indigo-500 font-bold uppercase">Closing</p>
                                                <p className="text-base font-black text-indigo-700">{fc(closing)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ═══════ PAGINATION ═══════ */}
                {!loading && !error && rows.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Page <strong>{page}</strong> of <strong>{pagination.total_pages || 1}</strong>
                            {' '}· মোট <strong>{pagination.count}</strong> দিন
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={!pagination.previous || loading}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Page numbers */}
                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(5, pagination.total_pages) }).map((_, i) => {
                                    let pageNum = page - 2 + i;
                                    if (pageNum < 1) pageNum = i + 1;
                                    if (pageNum > pagination.total_pages) return null;
                                    if (pageNum < 1) return null;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                                                page === pageNum
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!pagination.next || loading}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashboxReport;