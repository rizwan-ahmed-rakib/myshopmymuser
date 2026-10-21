

// components/cashbox/CashboxTransactions.jsx
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {posCashboxAPI} from "../../context_or_provider/pos/cashbox/cashboxAPI";
import api from "../../context_or_provider/pos/posApi";
import {Lock, Unlock, AlertCircle, ChevronLeft, ChevronRight} from "lucide-react";
import CloseDayModal from "./CloseDayModal";

// ─── Helpers ────────────────────────────────────────────────────────────────
const today = () => new Date();
const fmt = (d) => d.toISOString().slice(0, 10);

const getDateRange = (preset) => {
    const now = today();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();

    switch (preset) {
        case 'today':
            return {start: fmt(now), end: fmt(now)};
        case 'week': {
            const day = now.getDay();
            const diff = day === 0 ? 6 : day - 1;
            const mon = new Date(y, m, d - diff);
            return {start: fmt(mon), end: fmt(now)};
        }
        case 'month':
            return {start: fmt(new Date(y, m, 1)), end: fmt(now)};
        case 'year':
            return {start: fmt(new Date(y, 0, 1)), end: fmt(now)};
        default:
            return {start: fmt(now), end: fmt(now)};
    }
};

const PRESETS = [
    {key: 'today', label: 'আজকে', icon: '📅'},
    {key: 'week', label: 'এই সপ্তাহ', icon: '🗓️'},
    {key: 'month', label: 'এই মাস', icon: '📆'},
    {key: 'year', label: 'এই বছর', icon: '🗂️'},
    {key: 'custom', label: 'কাস্টম', icon: '🔍'},
];

const DAY_PAGE_SIZE = 100;   // ✅ 100 per page

// ─── Component ───────────────────────────────────────────────────────────────
const CashboxTransactions = () => {
    // ── Date filter
    const [activePreset, setActivePreset] = useState('today');
    const [customStart, setCustomStart] = useState(fmt(today()));
    const [customEnd, setCustomEnd] = useState(fmt(today()));

    // ── Data
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        opening_balance: 0, total_income: 0, total_expense: 0, closing_balance: 0
    });
    const [incomeBreakdown, setIncomeBreakdown] = useState({});
    const [expenseBreakdown, setExpenseBreakdown] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ── Business day
    const [currentDay, setCurrentDay] = useState(null);
    const [isCloseDayOpen, setIsCloseDayOpen] = useState(false);
    const [isOpeningDay, setIsOpeningDay] = useState(false);
    const [isReopening, setIsReopening] = useState(false);
    const [dayError, setDayError] = useState('');

    // ── Day summary
    const [viewMode, setViewMode] = useState('business');
    const [daySummary, setDaySummary] = useState([]);
    const [daysLoading, setDaysLoading] = useState(false);
    const [dayPage, setDayPage] = useState(1);                      // ✅ NEW
    const [dayPagination, setDayPagination] = useState({            // ✅ NEW
        count: 0, next: null, previous: null, total_pages: 0,
    });

    // ── Live clock
    const [clock, setClock] = useState(new Date());
    const clockRef = useRef(null);

    useEffect(() => {
        clockRef.current = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(clockRef.current);
    }, []);

    // ── Date range
    const getRange = useCallback(() => {
        if (activePreset === 'custom') return {start: customStart, end: customEnd};
        return getDateRange(activePreset);
    }, [activePreset, customStart, customEnd]);

    // ── Fetch current day
    const fetchCurrentDay = useCallback(async () => {
        try {
            setDayError('');
            const res = await api.get("/api/cashbox/business-days/current/");
            setCurrentDay(res.data);
        } catch (err) {
            setCurrentDay(null);
            if (err?.response?.status !== 404) {
                setDayError(err?.response?.data?.detail || 'Could not load current day');
            }
        }
    }, []);

    // ── Fetch day summary — NOW PAGINATED ✅
    const fetchDays = useCallback(async () => {
        setDaysLoading(true);
        try {
            const {start, end} = getRange();
            const params = {
                start_date: start,
                end_date: end,
                page: dayPage,                  // ✅ current page
                page_size: DAY_PAGE_SIZE,       // ✅ 100 per page
            };
            const apiMethod = viewMode === 'business'
                ? posCashboxAPI.getBusinessDays
                : posCashboxAPI.getCalendarDays;
            const res = await apiMethod(params);

            setDaySummary(res.data.results || []);
            const total = res.data.count || 0;
            setDayPagination({
                count: total,
                next: res.data.next,
                previous: res.data.previous,
                total_pages: Math.ceil(total / DAY_PAGE_SIZE),
            });
        } catch (err) {
            console.error(err);
            setDaySummary([]);
            setDayPagination({count: 0, next: null, previous: null, total_pages: 0});
        } finally {
            setDaysLoading(false);
        }
    }, [getRange, viewMode, dayPage]);

    // ── Reset page when filters change ✅
    useEffect(() => {
        setDayPage(1);
    }, [viewMode, activePreset, customStart, customEnd]);

    // ── Fetch dashboard
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const {start, end} = getRange();
            const res = await posCashboxAPI.getDashboard({start_date: start, end_date: end});
            const data = res.data;

            setSummary(data.summary || {
                opening_balance: 0, total_income: 0, total_expense: 0, closing_balance: 0
            });
            setIncomeBreakdown(data.income_breakdown || {});
            setExpenseBreakdown(data.expense_breakdown || {});

            const txs = (data.transactions || []).map(item => ({
                ...item,
                source: item.source || 'cashbox',
                resolvedType: item.type || 'cashbox',
            }));
            setTransactions(txs);
        } catch (err) {
            console.error('Cashbox dashboard error:', err);
            setError('ডেটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setLoading(false);
        }
    }, [getRange]);

    const refreshAll = useCallback(() => {
        fetchCurrentDay();
        fetchDays();
        fetchData();
    }, [fetchCurrentDay, fetchDays, fetchData]);

    useEffect(() => {
        fetchCurrentDay();
    }, [fetchCurrentDay]);
    useEffect(() => {
        fetchDays();
    }, [fetchDays]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenDay = async () => {
        setIsOpeningDay(true);
        setDayError('');
        try {
            const res = await api.post("/api/cashbox/business-days/open/");
            setCurrentDay(res.data);
            fetchDays();
            fetchData();
        } catch (err) {
            setDayError(err?.response?.data?.detail || 'Failed to open');
        } finally {
            setIsOpeningDay(false);
        }
    };

    const handleReopenDay = async () => {
        if (!currentDay?.id) return;
        setIsReopening(true);
        setDayError('');
        try {
            const res = await api.post(`/api/cashbox/business-days/${currentDay.id}/reopen/`);
            setCurrentDay(res.data);
            fetchDays();
            fetchData();
        } catch (err) {
            setDayError(err?.response?.data?.detail || 'Failed to reopen');
        } finally {
            setIsReopening(false);
        }
    };

    // ── Helpers
    const fc = (n) => `৳${parseFloat(n || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 0, maximumFractionDigits: 2
    })}`;
    const formatDate = (ds) => new Date(ds).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    const formatTime = (ds) => new Date(ds).toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});

    const isIncome = (tx) => tx.resolvedType === 'in' || tx.source === 'income';

    const clockStr = clock.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    const dateStr = clock.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const {start: rangeStart, end: rangeEnd} = getRange();
    const pct = (part, total) => total > 0 ? Math.min(100, (part / total) * 100) : 0;

    return (
        <div className="w-full space-y-6">

            {/* ══════════════ HEADER ══════════════ */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">💼 ক্যাশবক্স ড্যাশবোর্ড</h1>
                    <p className="text-gray-400 text-sm mt-0.5">আর্থিক লেনদেনের সম্পূর্ণ চিত্র</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {currentDay ? (
                        currentDay.status === 'open' ? (
                            // ═══ OPEN state ═══
                            <>
                                <div
                                    className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-wider leading-none">
                                            Day {currentDay.business_date} — OPEN
                                        </p>
                                        <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                                            Opening: ৳{Number(currentDay.opening_balance || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCloseDayOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700"
                                >
                                    <Lock size={14}/> Close Day
                                </button>
                            </>
                        ) : (
                            // ═══ CLOSED state ═══
                            <>
                                <div
                                    className="flex items-center gap-2 bg-gray-100 border border-gray-300 px-3 py-2 rounded-xl">
                                    <Lock size={14} className="text-gray-500"/>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider leading-none">
                                            Day {currentDay.business_date} — CLOSED
                                        </p>
                                        <p className="text-[11px] text-gray-600 font-bold mt-0.5">
                                            Closing: ৳{Number(currentDay.closing_balance || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleReopenDay}
                                    disabled={isReopening}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {isReopening ? (
                                        <span
                                            className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <Unlock size={14}/>
                                    )}
                                    Reopen
                                </button>
                            </>
                        )
                    ) : (
                        // ═══ NO DAY state ═══
                        <>
                            <div
                                className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                                <AlertCircle size={14} className="text-amber-500 flex-shrink-0"/>
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider leading-none">
                                        No business day
                                    </p>
                                    {dayError && (
                                        <p className="text-[10px] text-amber-700 font-bold mt-0.5 max-w-[200px] truncate">
                                            {dayError}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleOpenDay}
                                disabled={isOpeningDay}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {isOpeningDay ? (
                                    <span
                                        className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <Unlock size={14}/>
                                )}
                                Open Day
                            </button>
                        </>
                    )}
                </div>

                <div
                    className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm px-5 py-3 rounded-2xl">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <div className="text-right">
                        <p className="text-xl font-extrabold text-gray-800 tabular-nums tracking-tight leading-none">{clockStr}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">{dateStr}</p>
                    </div>
                </div>
            </div>

            {/* ══════════════ DATE FILTER ══════════════ */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
                <div className="flex flex-wrap items-center gap-2">
                    {PRESETS.map(p => (
                        <button
                            key={p.key}
                            onClick={() => setActivePreset(p.key)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                activePreset === p.key
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <span>{p.icon}</span> {p.label}
                        </button>
                    ))}

                    <button
                        onClick={refreshAll}
                        disabled={loading || daysLoading}
                        className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span
                                    className="inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                                লোড হচ্ছে...
                            </>
                        ) : (
                            <>
                                <span>🔄</span> রিফ্রেশ
                            </>
                        )}
                    </button>
                </div>

                {activePreset === 'custom' && (
                    <div className="mt-4 flex flex-wrap items-end gap-3 pt-4 border-t border-dashed border-gray-200">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">শুরুর তারিখ</label>
                            <input
                                type="date"
                                value={customStart}
                                max={customEnd}
                                onChange={e => setCustomStart(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">শেষের তারিখ</label>
                            <input
                                type="date"
                                value={customEnd}
                                min={customStart}
                                max={fmt(today())}
                                onChange={e => setCustomEnd(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>
                        <button
                            onClick={refreshAll}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                        >
                            ফিল্টার করুন →
                        </button>
                    </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">সক্রিয় পরিসর:</span>
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                        {rangeStart} → {rangeEnd}
                    </span>
                </div>

                <div className="flex justify-center mt-4">
                    <div className="inline-flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                                viewMode === 'calendar'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            📅 Calendar Day (Midnight)
                        </button>
                        <button
                            onClick={() => setViewMode('business')}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                                viewMode === 'business'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            🏪 Business Day (Shop)
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════ SUMMARY CARDS ══════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Opening Balance</p>
                        <span
                            className="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-xl text-xl">🌅</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-800">{fc(summary.opening_balance)}</h3>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium">নির্বাচিত পরিসরের শুরুর আগের জমা</p>
                </div>

                <div
                    className="bg-white border border-green-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-bold text-green-400 uppercase tracking-wider">মোট আয়</p>
                        <span
                            className="w-9 h-9 flex items-center justify-center bg-green-50 rounded-xl text-xl">📈</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-green-600">{fc(summary.total_income)}</h3>
                    <div className="mt-2">
                        <div className="w-full bg-green-100 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-green-500 h-full rounded-full transition-all duration-700"
                                style={{width: `${pct(summary.total_income, summary.opening_balance + summary.total_income)}%`}}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white border border-red-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider">মোট ব্যয়</p>
                        <span className="w-9 h-9 flex items-center justify-center bg-red-50 rounded-xl text-xl">📉</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-red-600">{fc(summary.total_expense)}</h3>
                    <div className="mt-2">
                        <div className="w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-red-500 h-full rounded-full transition-all duration-700"
                                style={{width: `${pct(summary.total_expense, summary.total_income)}%`}}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
                    <div
                        className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none"/>
                    <div
                        className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none"/>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">Closing
                                Balance</p>
                            <span
                                className="w-9 h-9 flex items-center justify-center bg-white/15 rounded-xl text-xl">💰</span>
                        </div>
                        <h3 className="text-2xl font-extrabold">{fc(summary.closing_balance)}</h3>
                        <p className="text-[10px] text-indigo-200 mt-1.5 font-medium">
                            {summary.closing_balance >= 0 ? '✅ পজিটিভ স্থিতি' : '⚠️ ঘাটতি আছে'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ══════════════ BREAKDOWN ══════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BreakdownCard
                    title="Income Breakdown" subtitle="আয়ের উৎস বিশ্লেষণ" icon="📥" accent="green"
                    total={summary.total_income} breakdown={incomeBreakdown} fc={fc} pct={pct}
                />
                <BreakdownCard
                    title="Expense Breakdown" subtitle="ব্যয়ের খাত বিশ্লেষণ" icon="📤" accent="red"
                    total={summary.total_expense} breakdown={expenseBreakdown} fc={fc} pct={pct}
                />
            </div>

            {/* ══════════════ DAY SUMMARY — WITH PAGINATION ══════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-gray-800">
                            {viewMode === 'business' ? '🏪 Business Day Summary' : '📅 Calendar Day Summary'}
                        </h2>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                            {viewMode === 'business'
                                ? 'দোকানের close-time অনুযায়ী গ্রুপ'
                                : 'Midnight (12:00 AM) অনুযায়ী গ্রুপ'}
                        </p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                        {dayPagination.count} দিন · page {dayPage} / {dayPagination.total_pages || 1}
                    </span>
                </div>

                {daysLoading ? (
                    <div className="p-8 text-center text-gray-400">লোড হচ্ছে...</div>
                ) : daySummary.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-4xl mb-3">🗓️</p>
                        <p className="font-bold text-gray-500 mb-1">এই সময়ের মধ্যে কোনো দিন নেই</p>
                        <p className="text-xs text-gray-400">
                            {viewMode === 'business'
                                ? 'প্রথম লেনদেন হলে auto-create হবে, অথবা "Open Day" চাপুন'
                                : 'এই তারিখ রেঞ্জে কোনো লেনদেন নেই'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {daySummary.map((day) => {
                            const dayKey = viewMode === 'business' ? day.business_date : day.day;
                            const isOpen = viewMode === 'business' && day.status === 'open';
                            const isCurrent = isOpen && currentDay && day.id === currentDay.id;
                            const closing = day.closing_balance ?? 0;
                            const income = day.total_income ?? day.income ?? 0;
                            const expense = day.total_expense ?? day.expense ?? 0;

                            return (
                                <div
                                    key={dayKey}
                                    className={`px-6 py-4 transition-colors ${
                                        isCurrent
                                            ? 'bg-emerald-50/50 hover:bg-emerald-50'
                                            : 'hover:bg-gray-50/70'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-12 rounded-full ${
                                                isCurrent ? 'bg-emerald-500' :
                                                    isOpen ? 'bg-amber-400' : 'bg-indigo-500'
                                            }`}/>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm flex items-center gap-2 flex-wrap">
                                                    {new Date(dayKey).toLocaleDateString('en-GB', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                    {isCurrent && (
                                                        <span
                                                            className="px-2 py-0.5 text-[9px] bg-emerald-500 text-white rounded-md font-black">
                                                            CURRENT
                                                        </span>
                                                    )}
                                                    {isOpen && !isCurrent && (
                                                        <span
                                                            className="px-2 py-0.5 text-[9px] bg-amber-100 text-amber-700 rounded-md font-black">
                                                            OPEN
                                                        </span>
                                                    )}
                                                    {day.auto_closed && (
                                                        <span
                                                            className="px-2 py-0.5 text-[9px] bg-orange-100 text-orange-700 rounded-md font-black">
                                                            AUTO-CLOSED
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">
                                                    Opening: ৳{Number(day.opening_balance || 0).toLocaleString()}
                                                    {viewMode === 'business' && day.closed_at && (
                                                        <>
                                                            {' · '}
                                                            Closed: {new Date(day.closed_at).toLocaleString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-right">
                                            <div>
                                                <p className="text-[10px] text-green-500 font-bold uppercase">আয়</p>
                                                <p className="text-sm font-black text-green-600">
                                                    +৳{Number(income).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-red-500 font-bold uppercase">ব্যয়</p>
                                                <p className="text-sm font-black text-red-600">
                                                    −৳{Number(expense).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="min-w-[120px]">
                                                <p className="text-[10px] text-indigo-500 font-bold uppercase">Closing</p>
                                                <p className={`text-base font-black ${
                                                    isCurrent ? 'text-emerald-700' : 'text-indigo-700'
                                                }`}>
                                                    ৳{Number(closing).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ✅ PAGINATION CONTROLS */}
                {!daysLoading && daySummary.length > 0 && dayPagination.total_pages > 1 && (
                    <div
                        className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                        <p className="text-xs text-gray-500">
                            Page <strong>{dayPage}</strong> of <strong>{dayPagination.total_pages}</strong>
                            {' '}· মোট <strong>{dayPagination.count}</strong> দিন
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDayPage(p => Math.max(1, p - 1))}
                                disabled={!dayPagination.previous || daysLoading}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16}/>
                            </button>

                            <div className="flex gap-1">
                                {Array.from({length: Math.min(5, dayPagination.total_pages)}).map((_, i) => {
                                    let pageNum = dayPage - 2 + i;
                                    if (pageNum < 1) pageNum = i + 1;
                                    if (pageNum > dayPagination.total_pages) return null;
                                    if (pageNum < 1) return null;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setDayPage(pageNum)}
                                            className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                                                dayPage === pageNum
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
                                onClick={() => setDayPage(p => p + 1)}
                                disabled={!dayPagination.next || daysLoading}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={16}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ══════════════ TRANSACTIONS LIST ══════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div
                    className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-base font-bold text-gray-800">লেনদেন তালিকা</h2>
                        <p className="text-[11px] text-gray-400 mt-0.5">{rangeStart} থেকে {rangeEnd} পর্যন্ত</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase">
                        {transactions.length}টি রেকর্ড
                    </span>
                </div>

                {loading ? (
                    <div className="p-14 text-center">
                        <div
                            className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-indigo-100 border-t-indigo-600 mb-4"></div>
                        <p className="text-gray-400 font-medium text-sm">ডেটা লোড হচ্ছে...</p>
                    </div>
                ) : error ? (
                    <div className="p-14 text-center">
                        <div className="inline-block p-4 bg-red-50 rounded-full text-3xl mb-4">⚠️</div>
                        <p className="text-red-500 font-semibold mb-4">{error}</p>
                        <button
                            onClick={refreshAll}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors text-sm font-semibold"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-14 text-center text-gray-400">
                        <p className="text-5xl mb-4">💨</p>
                        <p className="font-medium">এই সময়ের মধ্যে কোনো লেনদেন নেই।</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {transactions.map((tx) => {
                            const income = isIncome(tx);
                            return (
                                <div
                                    key={`${tx.source}-${tx.id}`}
                                    className="px-6 py-4 hover:bg-gray-50/70 transition-colors group flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div
                                            className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                                                income ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {income ? '📈' : '📉'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                                                {tx.title || tx.reason || 'অনামা লেনদেন'}
                                            </p>
                                            <div
                                                className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[11px] text-gray-400 font-medium">
                                                <span>{formatDate(tx.created_at)}</span>
                                                <span>·</span>
                                                <span>{formatTime(tx.created_at)}</span>
                                                {tx.payment_method && (
                                                    <>
                                                        <span>·</span>
                                                        <span
                                                            className="uppercase font-bold text-indigo-400">{tx.payment_method}</span>
                                                    </>
                                                )}
                                                {tx.mobile_operator && (
                                                    <span
                                                        className="px-1.5 py-0.5 bg-pink-50 text-pink-500 rounded-md font-bold">
                                                        {tx.mobile_operator}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-lg font-extrabold ${income ? 'text-green-600' : 'text-red-600'}`}>
                                            {income ? '+' : '−'}{fc(tx.amount)}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                            via {tx.source}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && !error && transactions.length > 0 && (
                    <div
                        className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-gray-400">মোট {transactions.length}টি লেনদেন দেখানো হচ্ছে</p>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <span className="text-green-600">আয়: {fc(summary.total_income)}</span>
                            <span className="text-red-500">ব্যয়: {fc(summary.total_expense)}</span>
                            <span
                                className="text-indigo-700">নিট: {fc(summary.closing_balance - summary.opening_balance)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ══════════════ CLOSE DAY MODAL ══════════════ */}
            <CloseDayModal
                isOpen={isCloseDayOpen}
                onClose={() => setIsCloseDayOpen(false)}
                currentDay={currentDay}
                onSuccess={() => {
                    setIsCloseDayOpen(false);
                    refreshAll();
                }}
            />
        </div>
    );
};


// ─── Sub-component: BreakdownCard ─────────────────────────────────────────────
const BreakdownCard = ({title, subtitle, icon, accent, total, breakdown, fc, pct}) => {
    const accentMap = {
        green: {
            bar: 'bg-green-500',
            bg: 'bg-green-100',
            cash: 'bg-green-500',
            bank: 'bg-blue-500',
            mobile: 'bg-indigo-500'
        },
        red: {bar: 'bg-red-500', bg: 'bg-red-100', cash: 'bg-red-500', bank: 'bg-amber-500', mobile: 'bg-orange-500'},
    };
    const a = accentMap[accent] || accentMap.green;

    const operators = [
        {
            key: 'bkash',
            label: 'bKash',
            color: 'text-pink-600',
            bar: 'bg-[#E2125B]',
            bg: 'bg-pink-50',
            border: 'border-pink-100'
        },
        {
            key: 'nagad',
            label: 'Nagad',
            color: 'text-orange-600',
            bar: 'bg-[#F57224]',
            bg: 'bg-orange-50',
            border: 'border-orange-100'
        },
        {
            key: 'rocket',
            label: 'Rocket',
            color: 'text-purple-600',
            bar: 'bg-[#8C3494]',
            bg: 'bg-purple-50',
            border: 'border-purple-100'
        },
        {
            key: 'upay',
            label: 'Upay',
            color: 'text-blue-600',
            bar: 'bg-[#005C97]',
            bg: 'bg-blue-50',
            border: 'border-blue-100'
        },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
                <span className="text-2xl">{icon}</span>
                <div>
                    <h2 className="text-base font-bold text-gray-800">{title}</h2>
                    <p className="text-xs text-gray-400">{subtitle}</p>
                </div>
            </div>

            <div className="space-y-4">
                <ProgressRow label="💵 নগদ (Cash)" value={fc(breakdown.cash || 0)} pctVal={pct(breakdown.cash, total)}
                             barColor={a.cash} bgColor={a.bg}/>
                <ProgressRow label="🏛️ ব্যাংক (Bank)" value={fc(breakdown.bank || 0)}
                             pctVal={pct(breakdown.bank, total)} barColor={a.bank} bgColor="bg-blue-100"/>

                <div>
                    <ProgressRow label="📱 মোবাইল ব্যাংকিং" value={fc(breakdown.mobile || 0)}
                                 pctVal={pct(breakdown.mobile, total)} barColor={a.mobile} bgColor="bg-indigo-100"/>

                    {(breakdown.mobile || 0) > 0 && (
                        <div className="grid grid-cols-2 gap-2.5 mt-3 pl-4">
                            {operators.map(op => (
                                <div key={op.key} className={`p-2.5 rounded-xl border ${op.bg} ${op.border}`}>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-xs font-bold ${op.color}`}>{op.label}</span>
                                        <span
                                            className={`text-xs font-extrabold ${op.color}`}>{fc(breakdown[op.key] || 0)}</span>
                                    </div>
                                    <div className="w-full bg-white/70 h-1 rounded-full mt-1.5 overflow-hidden">
                                        <div className={`${op.bar} h-full rounded-full transition-all duration-700`}
                                             style={{width: `${pct(breakdown[op.key], breakdown.mobile)}%`}}/>
                                    </div>
                                </div>
                            ))}
                            {(breakdown.others || 0) > 0 && (
                                <div className="p-2.5 rounded-xl border bg-gray-50 border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-500">Others</span>
                                        <span
                                            className="text-xs font-extrabold text-gray-600">{fc(breakdown.others)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-1 rounded-full mt-1.5 overflow-hidden">
                                        <div className="bg-gray-400 h-full rounded-full transition-all duration-700"
                                             style={{width: `${pct(breakdown.others, breakdown.mobile)}%`}}/>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Tiny helper row
const ProgressRow = ({label, value, pctVal, barColor, bgColor}) => (
    <div>
        <div className="flex justify-between items-center mb-1.5 text-sm font-medium">
            <span className="text-gray-600">{label}</span>
            <span className="text-gray-900 font-bold">{value}</span>
        </div>
        <div className={`w-full ${bgColor} h-2 rounded-full overflow-hidden`}>
            <div className={`${barColor} h-full rounded-full transition-all duration-700`}
                 style={{width: `${pctVal}%`}}/>
        </div>
    </div>
);

export default CashboxTransactions;