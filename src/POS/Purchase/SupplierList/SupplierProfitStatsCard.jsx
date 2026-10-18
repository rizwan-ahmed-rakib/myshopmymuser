import React, { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp, ShoppingBag, RotateCcw, CreditCard, DollarSign,
    Calendar, RefreshCw, Send, Plus, User, Clock, ChevronDown, Filter, AlertCircle
} from 'lucide-react';
import { posReportsAPI } from '../../../context_or_provider/pos/reports/reportsAPI';

const fmtCurrency = (v) => `৳${parseFloat(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtNumber = (v) => parseFloat(v || 0).toLocaleString('en-IN');

const StatTile = ({ label, value, sub, icon: Icon, color = '#6366f1', isMoney = true }) => (
    <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-4 border border-gray-100 transition-all shadow-sm hover:shadow group">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${color}15`, color }}>
                <Icon size={15} />
            </div>
        </div>
        <div className="text-xl font-black text-gray-900 tracking-tight">
            {isMoney ? fmtCurrency(value) : fmtNumber(value)}
        </div>
        {sub && <div className="text-[10px] font-medium text-gray-400 mt-1">{sub}</div>}
    </div>
);

const SupplierProfitStatsCard = ({ supplierId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recalculating, setRecalculating] = useState(false);
    const [filterType, setFilterType] = useState('all_time'); // 'all_time' | 'month' | 'year' | 'custom'
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [noteText, setNoteText] = useState('');
    const [addingNote, setAddingNote] = useState(false);

    const fetchStats = useCallback(async (params = {}) => {
        if (!supplierId) return;
        setLoading(true);
        try {
            const res = await posReportsAPI.getSupplierProfitDetail(supplierId, params);
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch supplier profit stats:', err);
        } finally {
            setLoading(false);
        }
    }, [supplierId]);

    useEffect(() => {
        let params = {};
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');

        if (filterType === 'month') {
            params = { year, month };
        } else if (filterType === 'year') {
            params = { year };
        } else if (filterType === 'custom' && customStart && customEnd) {
            params = { start_date: customStart, end_date: customEnd };
        }
        fetchStats(params);
    }, [filterType, customStart, customEnd, fetchStats]);

    const handleRecalculate = async () => {
        setRecalculating(true);
        try {
            const res = await posReportsAPI.recalculateSupplierProfit(supplierId);
            if (res.data?.data) {
                setStats(res.data.data);
            } else {
                fetchStats();
            }
        } catch (err) {
            console.error('Recalculate failed:', err);
        } finally {
            setRecalculating(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!noteText.trim()) return;
        setAddingNote(true);
        try {
            const res = await posReportsAPI.updateSupplierBusinessNote(supplierId, noteText.trim());
            if (res.data) {
                setStats(prev => ({ ...prev, business_notes: res.data.business_notes }));
                setNoteText('');
            }
        } catch (err) {
            console.error('Add note failed:', err);
        } finally {
            setAddingNote(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-gray-100">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Supplier Purchase & Performance Analytics</h3>
                            {stats?.is_dynamic_range && (
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-indigo-200">
                                    {stats.date_range_label}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">All purchase, payment, and return metrics with real-time aggregates</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
                        <button
                            onClick={() => setFilterType('all_time')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'all_time' ? 'bg-white text-indigo-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            All-Time
                        </button>
                        <button
                            onClick={() => setFilterType('month')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'month' ? 'bg-white text-indigo-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setFilterType('year')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'year' ? 'bg-white text-indigo-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            This Year
                        </button>
                        <button
                            onClick={() => setFilterType('custom')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'custom' ? 'bg-white text-indigo-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            Custom
                        </button>
                    </div>

                    <button
                        onClick={handleRecalculate}
                        disabled={recalculating}
                        title="Recalculate supplier stats from database"
                        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={13} className={recalculating ? 'animate-spin text-indigo-600' : ''} />
                        {recalculating ? 'Recalculating...' : 'Refresh Stats'}
                    </button>
                </div>
            </div>

            {/* Custom Range Picker */}
            {filterType === 'custom' && (
                <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">From:</span>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">To:</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                </div>
            )}

            {/* Loading Skeleton or Metrics */}
            {loading ? (
                <div className="py-12 flex justify-center items-center text-gray-400 text-sm gap-2">
                    <RefreshCw size={16} className="animate-spin text-indigo-500" />
                    <span>Loading supplier analytics...</span>
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    {/* Section 1: Purchase Overview */}
                    <div>
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>📦</span> Purchase Metrics
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatTile
                                label="Total Invoices"
                                value={stats?.total_purchase_count}
                                sub="Unique purchase bills"
                                icon={ShoppingBag}
                                color="#6366f1"
                                isMoney={false}
                            />
                            <StatTile
                                label="Units Purchased"
                                value={stats?.total_units_purchased}
                                sub="Total pieces received"
                                icon={TrendingUp}
                                color="#3b82f6"
                                isMoney={false}
                            />
                            <StatTile
                                label="Units Returned"
                                value={stats?.total_units_purchase_returned}
                                sub="Items sent back"
                                icon={RotateCcw}
                                color="#ef4444"
                                isMoney={false}
                            />
                            <StatTile
                                label="Gross Purchase"
                                value={stats?.total_purchase_price}
                                sub="Before item/bill discount"
                                icon={DollarSign}
                                color="#0ea5e9"
                            />
                            <StatTile
                                label="Net Purchase Value"
                                value={stats?.total_purchase_value}
                                sub="Net cost payable"
                                icon={CreditCard}
                                color="#8b5cf6"
                            />
                        </div>
                    </div>

                    {/* Section 2: Payment & Due Tracking */}
                    <div>
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>💳</span> Payment & Balance Tracking
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatTile
                                label="Paid at Purchase"
                                value={stats?.total_purchase_time_paid}
                                sub="Immediate cash/bank paid"
                                icon={DollarSign}
                                color="#10b981"
                            />
                            <StatTile
                                label="Due Payments Paid"
                                value={stats?.total_purchase_due_paid}
                                sub="Paid via due vouchers"
                                icon={CreditCard}
                                color="#059669"
                            />
                            <StatTile
                                label="Due Payment Invoices"
                                value={stats?.total_due_payment_count}
                                sub="Due vouchers issued"
                                icon={Clock}
                                color="#0284c7"
                                isMoney={false}
                            />
                            <StatTile
                                label="Total Due Paid"
                                value={stats?.total_due_payment_amount}
                                sub="SupplierDuePayment sum"
                                icon={CreditCard}
                                color="#14b8a6"
                            />
                            <StatTile
                                label="Remaining Due"
                                value={stats?.total_purchase_remaining_due}
                                sub="Negative = advance"
                                icon={AlertCircle}
                                color={parseFloat(stats?.total_purchase_remaining_due || 0) > 0 ? '#ef4444' : '#10b981'}
                            />
                        </div>
                    </div>

                    {/* Section 3: Return Metrics & Derived Averages */}
                    <div>
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>🔄</span> Returns & Averages
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatTile
                                label="Return Invoices"
                                value={stats?.total_return_count}
                                sub="PurchaseReturn bills"
                                icon={RotateCcw}
                                color="#f59e0b"
                                isMoney={false}
                            />
                            <StatTile
                                label="Return Gross"
                                value={stats?.total_return_amount}
                                sub="Before penalty deductions"
                                icon={DollarSign}
                                color="#f97316"
                            />
                            <StatTile
                                label="Return Penalty"
                                value={stats?.total_return_penalty}
                                sub="Total penalty charges"
                                icon={AlertCircle}
                                color="#e11d48"
                            />
                            <StatTile
                                label="Net Return Value"
                                value={stats?.total_return_net_amount}
                                sub="Gross minus penalty"
                                icon={CreditCard}
                                color="#ec4899"
                            />
                            <StatTile
                                label="Avg Per Invoice"
                                value={stats?.average_purchase_per_invoice}
                                sub={`Avg unit cost: ${fmtCurrency(stats?.average_unit_cost)}`}
                                icon={TrendingUp}
                                color="#6366f1"
                            />
                        </div>
                    </div>

                    {/* Section 4: Business Notes */}
                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>📝</span> Supplier Business Notes
                        </h4>

                        <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Write a business note regarding this supplier (e.g. discount terms, delivery timeline)..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={addingNote || !noteText.trim()}
                                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-200"
                            >
                                <Send size={13} />
                                {addingNote ? 'Saving...' : 'Add Note'}
                            </button>
                        </form>

                        {/* Notes List */}
                        {stats?.business_notes && stats.business_notes.length > 0 ? (
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {stats.business_notes.map((note, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs">
                                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                                            <span className="font-bold text-gray-700 flex items-center gap-1">
                                                <User size={10} /> {note.by_name || 'Admin'} {note.by_role ? `(${note.by_role})` : ''}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={10} /> {note.at ? new Date(note.at).toLocaleString() : 'N/A'}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 font-medium">{note.note}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">No business notes added yet for this supplier.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierProfitStatsCard;
