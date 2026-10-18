import React, { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp, ShoppingCart, ShoppingBag, RotateCcw, CreditCard, DollarSign,
    Calendar, RefreshCw, Send, Plus, User, Clock, ChevronDown, Filter, AlertCircle, Percent,
    Boxes, PackageCheck, Sparkles
} from 'lucide-react';
import { posReportsAPI } from '../../../context_or_provider/pos/reports/reportsAPI';

const fmtCurrency = (v) => `৳${parseFloat(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtNumber = (v) => parseFloat(v || 0).toLocaleString('en-IN');
const fmtPct = (v) => `${parseFloat(v || 0).toFixed(2)}%`;

const StatTile = ({ label, value, sub, icon: Icon, color = '#8b5cf6', isMoney = true, isPct = false }) => (
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

const BrandProfitStatsCard = ({ brandId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recalculating, setRecalculating] = useState(false);
    const [filterType, setFilterType] = useState('all_time'); // 'all_time' | 'month' | 'year' | 'custom'
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [noteText, setNoteText] = useState('');
    const [addingNote, setAddingNote] = useState(false);

    const fetchStats = useCallback(async (params = {}) => {
        if (!brandId) return;
        setLoading(true);
        try {
            const res = await posReportsAPI.getBrandProfitDetail(brandId, params);
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch brand profit stats:', err);
        } finally {
            setLoading(false);
        }
    }, [brandId]);

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
            const res = await posReportsAPI.recalculateBrandProfit(brandId);
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
            const res = await posReportsAPI.updateBrandBusinessNote(brandId, noteText.trim());
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
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                        <Boxes size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Brand Performance & Inventory Valuation</h3>
                            {stats?.is_dynamic_range && (
                                <span className="bg-purple-50 text-purple-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-purple-200">
                                    {stats.date_range_label}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Sales, net profit, margins, purchases, and live in-stock valuation</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
                        <button
                            onClick={() => setFilterType('all_time')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'all_time' ? 'bg-white text-purple-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            All-Time
                        </button>
                        <button
                            onClick={() => setFilterType('month')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'month' ? 'bg-white text-purple-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setFilterType('year')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'year' ? 'bg-white text-purple-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            This Year
                        </button>
                        <button
                            onClick={() => setFilterType('custom')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'custom' ? 'bg-white text-purple-600 shadow-sm font-black' : 'hover:text-gray-900'}`}
                        >
                            Custom
                        </button>
                    </div>

                    <button
                        onClick={handleRecalculate}
                        disabled={recalculating}
                        title="Recalculate brand stats & inventory snapshot"
                        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={13} className={recalculating ? 'animate-spin text-purple-600' : ''} />
                        {recalculating ? 'Recalculating...' : 'Refresh Stats'}
                    </button>
                </div>
            </div>

            {/* Custom Range Picker */}
            {filterType === 'custom' && (
                <div className="mt-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">From:</span>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">To:</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                </div>
            )}

            {/* Loading Skeleton or Metrics */}
            {loading ? (
                <div className="py-12 flex justify-center items-center text-gray-400 text-sm gap-2">
                    <RefreshCw size={16} className="animate-spin text-purple-500" />
                    <span>Loading brand analytics...</span>
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    {/* Section 1: Live Inventory Valuation */}
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-6 rounded-[2rem] text-white relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-purple-300 flex items-center gap-2">
                                <Sparkles size={14} className="text-amber-400" /> Live Inventory Valuation
                            </h4>
                            <span className="text-[11px] font-bold text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                                Current Real-Time Snapshot
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">In-Stock Units</span>
                                <div className="text-2xl font-black mt-1">{fmtNumber(stats?.in_stock_units)}</div>
                                <span className="text-[9px] text-purple-300">Available products</span>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Stock Cost Value</span>
                                <div className="text-2xl font-black mt-1">{fmtCurrency(stats?.in_stock_total_purchase_value)}</div>
                                <span className="text-[9px] text-purple-300">Capital invested</span>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Stock Selling Value</span>
                                <div className="text-2xl font-black mt-1">{fmtCurrency(stats?.in_stock_total_selling_value)}</div>
                                <span className="text-[9px] text-purple-300">Expected sales</span>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Potential Profit</span>
                                <div className="text-2xl font-black mt-1 text-emerald-400">{fmtCurrency(stats?.potential_profit)}</div>
                                <span className="text-[9px] text-purple-300">Expected gain</span>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Potential Margin</span>
                                <div className="text-2xl font-black mt-1 text-cyan-300">{fmtPct(stats?.potential_profit_margin_pct)}</div>
                                <span className="text-[9px] text-purple-300">Profit / Selling %</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Sales & Profitability */}
                    <div>
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>📊</span> Sales & Profitability
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatTile
                                label="Sales Invoices"
                                value={stats?.total_sales_count}
                                sub="Unique sales made"
                                icon={ShoppingCart}
                                color="#8b5cf6"
                                isMoney={false}
                            />
                            <StatTile
                                label="Units Sold"
                                value={stats?.total_units_sold}
                                sub={`Returned: ${stats?.total_units_sale_returned || 0}`}
                                icon={TrendingUp}
                                color="#0ea5e9"
                                isMoney={false}
                            />
                            <StatTile
                                label="Total Revenue"
                                value={stats?.total_revenue}
                                sub="Net sales proceeds"
                                icon={DollarSign}
                                color="#6366f1"
                            />
                            <StatTile
                                label="COGS / Cost"
                                value={stats?.total_cost}
                                sub="Purchase cost of sold goods"
                                icon={DollarSign}
                                color="#64748b"
                            />
                            <StatTile
                                label="Net Profit"
                                value={stats?.total_net_profit}
                                sub={`Gross: ${fmtCurrency(stats?.total_gross_profit)}`}
                                icon={DollarSign}
                                color={parseFloat(stats?.total_net_profit || 0) >= 0 ? '#10b981' : '#ef4444'}
                            />
                        </div>
                    </div>

                    {/* Section 3: Margins & Purchases */}
                    <div>
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>📦</span> Margins & Procurement
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatTile
                                label="Margin on Sales"
                                value={stats?.profit_percentage_on_sales}
                                sub="Profit / Revenue %"
                                icon={Percent}
                                color="#0284c7"
                                isPct={true}
                            />
                            <StatTile
                                label="Markup on Cost"
                                value={stats?.profit_percentage_on_cost}
                                sub="Profit / Cost %"
                                icon={Percent}
                                color="#8b5cf6"
                                isPct={true}
                            />
                            <StatTile
                                label="Avg Profit / Unit"
                                value={stats?.average_profit_per_unit}
                                sub="Net profit per unit"
                                icon={TrendingUp}
                                color="#10b981"
                            />
                            <StatTile
                                label="Units Purchased"
                                value={stats?.total_units_purchased}
                                sub={`Procured in ${stats?.total_purchase_count || 0} bills`}
                                icon={ShoppingBag}
                                color="#f59e0b"
                                isMoney={false}
                            />
                            <StatTile
                                label="Total Purchase Cost"
                                value={stats?.total_purchase_value}
                                sub="Procured value"
                                icon={CreditCard}
                                color="#f97316"
                            />
                        </div>
                    </div>

                    {/* Section 4: Business Notes */}
                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                            <span>📝</span> Brand Business Notes
                        </h4>

                        <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Write a business note regarding this brand (e.g. warranty support, dealership terms, seasonal demand)..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={addingNote || !noteText.trim()}
                                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-purple-200"
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
                            <p className="text-xs text-gray-400 italic">No business notes added yet for this brand.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandProfitStatsCard;
