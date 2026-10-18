import React, { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp, ShoppingCart, RotateCcw, CreditCard, DollarSign,
    Calendar, RefreshCw, Send, Plus, User, Clock, ChevronDown, Filter, AlertCircle, Percent
} from 'lucide-react';
import { posReportsAPI } from '../../../context_or_provider/pos/reports/reportsAPI';

const fmtCurrency = (v) => `৳${parseFloat(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtNumber = (v) => parseFloat(v || 0).toLocaleString('en-IN');
const fmtPct = (v) => `${parseFloat(v || 0).toFixed(2)}%`;

const StatTile = ({ label, value, sub, icon: Icon, color = '#10b981', isMoney = true, isPct = false }) => (
    <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-4 border border-gray-100 transition-all shadow-sm hover:shadow group">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${color}15`, color }}>
                <Icon size={15} />
            </div>
        </div>
        <div className="text-xl font-black text-gray-900 tracking-tight">
            {isPct ? fmtPct(value) : isMoney ? fmtCurrency(value) : fmtNumber(value)}
        </div>
        {sub && <div className="text-[10px] font-medium text-gray-400 mt-1">{sub}</div>}
    </div>
);

const CustomerProfitStatsCard = ({ customerId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recalculating, setRecalculating] = useState(false);
    const [filterType, setFilterType] = useState('all_time'); // 'all_time' | 'month' | 'year' | 'custom'
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [noteText, setNoteText] = useState('');
    const [addingNote, setAddingNote] = useState(false);

    const fetchStats = useCallback(async (params = {}) => {
        if (!customerId) return;
        setLoading(true);
        try {
            const res = await posReportsAPI.getCustomerProfitDetail(customerId, params);
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch customer profit stats:', err);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

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
            const res = await posReportsAPI.recalculateCustomerProfit(customerId);
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
            const res = await posReportsAPI.updateCustomerBusinessNote(customerId, noteText.trim());
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
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Customer Sales & Profitability Analytics</h3>
                            {stats?.is_dynamic_range && (
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-200">
                                    {stats.date_range_label}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Sales volume, gross/net profit, margin percentages, and dues</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
                        <button
                            onClick={() => setFilterType('all_time')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'all_time' ? 'bg-white text-emerald-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            All-Time
                        </button>
                        <button
                            onClick={() => setFilterType('month')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'month' ? 'bg-white text-emerald-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setFilterType('year')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'year' ? 'bg-white text-emerald-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            This Year
                        </button>
                        <button
                            onClick={() => setFilterType('custom')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'custom' ? 'bg-white text-emerald-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            Custom
                        </button>
                    </div>

                    <button
                        onClick={handleRecalculate}
                        disabled={recalculating}
                        title="Recalculate customer stats from database"
                        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={13} className={recalculating ? 'animate-spin text-emerald-600' : ''} />
                        {recalculating ? 'Recalculating...' : 'Refresh Stats'}
                    </button>
                </div>
            </div>

            {/* Custom Range Picker */}
            {filterType === 'custom' && (
                <div className="mt-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">From:</span>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">To:</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                </div>
            )}

            {/* Loading Skeleton or Metrics */}
            {loading ? (
                <div className="py-12 flex justify-center items-center text-gray-400 text-sm gap-2">
                    <RefreshCw size={16} className="animate-spin text-emerald-500" />
                    <span>Loading customer analytics...</span>
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    {/* Section 1: Sales & Volume Overview */}
                    <div>
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>🛒</span> Sales & Volume
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatTile
                                label="Total Invoices"
                                value={stats?.total_sales_count}
                                sub="Unique sales made"
                                icon={ShoppingCart}
                                color="#10b981"
                                isMoney={false}
                            />
                            <StatTile
                                label="Units Purchased"
                                value={stats?.total_units_bought}
                                sub="Items bought"
                                icon={TrendingUp}
                                color="#0ea5e9"
                                isMoney={false}
                            />
                            <StatTile
                                label="Units Returned"
                                value={stats?.total_units_sale_returned}
                                sub="Customer returns"
                                icon={RotateCcw}
                                color="#ef4444"
                                isMoney={false}
                            />
                            <StatTile
                                label="Gross Sales Value"
                                value={stats?.total_sale_price}
                                sub="Before item/bill discount"
                                icon={DollarSign}
                                color="#6366f1"
                            />
                            <StatTile
                                label="Net Sales Value"
                                value={stats?.total_net_sale_value}
                                sub="Total billed amount"
                                icon={CreditCard}
                                color="#059669"
                            />
                        </div>
                    </div>

                    {/* Section 2: Profitability & Margins */}
                    <div>
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>📈</span> Profitability & Margins
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatTile
                                label="Total Cost (COGS)"
                                value={stats?.total_cost}
                                sub="Product purchase cost"
                                icon={DollarSign}
                                color="#64748b"
                            />
                            <StatTile
                                label="Gross Profit"
                                value={stats?.total_gross_profit}
                                sub="Gross sale - cost"
                                icon={TrendingUp}
                                color="#10b981"
                            />
                            <StatTile
                                label="Net Profit"
                                value={stats?.total_net_profit}
                                sub="After discount & returns"
                                icon={DollarSign}
                                color={parseFloat(stats?.total_net_profit || 0) >= 0 ? '#059669' : '#ef4444'}
                            />
                            <StatTile
                                label="Margin on Sales"
                                value={stats?.average_profit_percentage_on_net_sale_value}
                                sub="Profit / Revenue %"
                                icon={Percent}
                                color="#0284c7"
                                isPct={true}
                            />
                            <StatTile
                                label="Markup on Cost"
                                value={stats?.average_profit_percentage_on_cost}
                                sub="Profit / Cost %"
                                icon={Percent}
                                color="#8b5cf6"
                                isPct={true}
                            />
                        </div>
                    </div>

                    {/* Section 3: Payments, Collections & Returns */}
                    <div>
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>💳</span> Payments, Dues & Returns
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatTile
                                label="Paid at Sale"
                                value={stats?.total_sale_time_paid}
                                sub="Cash/Online at sale"
                                icon={DollarSign}
                                color="#10b981"
                            />
                            <StatTile
                                label="Due Collected"
                                value={stats?.total_due_collection_amount}
                                sub={`${stats?.total_due_collection_count || 0} collections`}
                                icon={CreditCard}
                                color="#0d9488"
                            />
                            <StatTile
                                label="Remaining Due"
                                value={stats?.total_after_sale_remaining_due}
                                sub="Outstanding balance"
                                icon={AlertCircle}
                                color={parseFloat(stats?.total_after_sale_remaining_due || 0) > 0 ? '#ef4444' : '#10b981'}
                            />
                            <StatTile
                                label="Net Returns"
                                value={stats?.total_return_net_amount}
                                sub={`${stats?.total_return_count || 0} invoices return`}
                                icon={RotateCcw}
                                color="#f59e0b"
                            />
                            <StatTile
                                label="Avg Per Invoice"
                                value={stats?.average_sale_per_invoice}
                                sub={`Avg unit profit: ${fmtCurrency(stats?.average_profit_per_unit)}`}
                                icon={TrendingUp}
                                color="#6366f1"
                            />
                        </div>
                    </div>

                    {/* Section 4: Business Notes */}
                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>📝</span> Customer Business Notes
                        </h4>

                        <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Write a business note regarding this customer (e.g. credit terms, buying preference, discount eligibility)..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={addingNote || !noteText.trim()}
                                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-200"
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
                            <p className="text-xs text-gray-400 italic">No business notes added yet for this customer.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerProfitStatsCard;
