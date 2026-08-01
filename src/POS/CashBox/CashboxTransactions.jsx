// components/cashbox/CashboxTransactions.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { posCashboxAPI } from "../../context_or_provider/pos/cashbox/cashboxAPI";

// ─── Helpers ────────────────────────────────────────────────────────────────
const today = () => new Date();

const fmt = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD

const getDateRange = (preset) => {
  const now = today();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  switch (preset) {
    case 'today':
      return { start: fmt(now), end: fmt(now) };
    case 'week': {
      const day = now.getDay(); // 0=Sun
      const diff = day === 0 ? 6 : day - 1; // Monday-start week
      const mon = new Date(y, m, d - diff);
      return { start: fmt(mon), end: fmt(now) };
    }
    case 'month':
      return { start: fmt(new Date(y, m, 1)), end: fmt(now) };
    case 'year':
      return { start: fmt(new Date(y, 0, 1)), end: fmt(now) };
    default:
      return { start: fmt(now), end: fmt(now) };
  }
};

const PRESETS = [
  { key: 'today', label: 'আজকে', icon: '📅' },
  { key: 'week',  label: 'এই সপ্তাহ', icon: '🗓️' },
  { key: 'month', label: 'এই মাস', icon: '📆' },
  { key: 'year',  label: 'এই বছর', icon: '🗂️' },
  { key: 'custom',label: 'কাস্টম', icon: '🔍' },
];

// ─── Component ───────────────────────────────────────────────────────────────
const CashboxTransactions = () => {
  // ── Date filter state
  const [activePreset, setActivePreset] = useState('today');
  const [customStart, setCustomStart] = useState(fmt(today()));
  const [customEnd,   setCustomEnd]   = useState(fmt(today()));

  // ── Data state
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    opening_balance: 0, total_income: 0, total_expense: 0, closing_balance: 0
  });
  const [incomeBreakdown,  setIncomeBreakdown]  = useState({});
  const [expenseBreakdown, setExpenseBreakdown] = useState({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // ── Live clock
  const [clock, setClock] = useState(new Date());
  const clockRef = useRef(null);

  useEffect(() => {
    clockRef.current = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(clockRef.current);
  }, []);

  // ── Derived date range
  const getRange = useCallback(() => {
    if (activePreset === 'custom') {
      return { start: customStart, end: customEnd };
    }
    return getDateRange(activePreset);
  }, [activePreset, customStart, customEnd]);

  // ── Fetch
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { start, end } = getRange();
      const res = await posCashboxAPI.getDashboard({ start_date: start, end_date: end });
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

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Preset change
  const handlePreset = (key) => {
    setActivePreset(key);
    if (key !== 'custom') {
      // fetchData triggers via useEffect -> getRange change
    }
  };

  // ── Formatters
  const fc = (n) => `৳${parseFloat(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  const formatDate = (ds) => new Date(ds).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatTime = (ds) => new Date(ds).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const isIncome = (tx) => tx.resolvedType === 'in' || tx.source === 'income';

  const clockStr = clock.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr  = clock.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const { start: rangeStart, end: rangeEnd } = getRange();

  // ── Progress helper
  const pct = (part, total) => total > 0 ? Math.min(100, (part / total) * 100) : 0;

  return (
    <div className="w-full space-y-6">

      {/* ══════════════════════════════════════════════════════════
          HEADER — Live Clock + Title
      ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">💼 ক্যাশবক্স ড্যাশবোর্ড</h1>
          <p className="text-gray-400 text-sm mt-0.5">আর্থিক লেনদেনের সম্পূর্ণ চিত্র</p>
        </div>

        {/* Live clock */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm px-5 py-3 rounded-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-gray-800 tabular-nums tracking-tight leading-none">{clockStr}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{dateStr}</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DATE FILTER BAR
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map(p => (
            <button
              key={p.key}
              onClick={() => handlePreset(p.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activePreset === p.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{p.icon}</span> {p.label}
            </button>
          ))}

          {/* Apply button (always visible for quick refresh) */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <><span className="inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span> লোড হচ্ছে...</>
            ) : (
              <><span>🔄</span> রিফ্রেশ</>
            )}
          </button>
        </div>

        {/* Custom date range picker */}
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
              onClick={fetchData}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              ফিল্টার করুন →
            </button>
          </div>
        )}

        {/* Active range display */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">সক্রিয় পরিসর:</span>
          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
            {rangeStart} → {rangeEnd}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SUMMARY CARDS (4 cards: Opening, Income, Expense, Closing)
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Opening Balance */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Opening Balance</p>
            <span className="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-xl text-xl">🌅</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800">{fc(summary.opening_balance)}</h3>
          <p className="text-[10px] text-gray-400 mt-1.5 font-medium">নির্বাচিত পরিসরের শুরুর আগের জমা</p>
        </div>

        {/* Total Income */}
        <div className="bg-white border border-green-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-green-400 uppercase tracking-wider">মোট আয়</p>
            <span className="w-9 h-9 flex items-center justify-center bg-green-50 rounded-xl text-xl">📈</span>
          </div>
          <h3 className="text-2xl font-extrabold text-green-600">{fc(summary.total_income)}</h3>
          <div className="mt-2">
            <div className="w-full bg-green-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${pct(summary.total_income, summary.opening_balance + summary.total_income)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white border border-red-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider">মোট ব্যয়</p>
            <span className="w-9 h-9 flex items-center justify-center bg-red-50 rounded-xl text-xl">📉</span>
          </div>
          <h3 className="text-2xl font-extrabold text-red-600">{fc(summary.total_expense)}</h3>
          <div className="mt-2">
            <div className="w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${pct(summary.total_expense, summary.total_income)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Closing Balance */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">Closing Balance</p>
              <span className="w-9 h-9 flex items-center justify-center bg-white/15 rounded-xl text-xl">💰</span>
            </div>
            <h3 className="text-2xl font-extrabold">{fc(summary.closing_balance)}</h3>
            <p className="text-[10px] text-indigo-200 mt-1.5 font-medium">
              {summary.closing_balance >= 0 ? '✅ পজিটিভ স্থিতি' : '⚠️ ঘাটতি আছে'}
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          BREAKDOWN CARDS
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Income Breakdown */}
        <BreakdownCard
          title="Income Breakdown"
          subtitle="আয়ের উৎস বিশ্লেষণ"
          icon="📥"
          accent="green"
          total={summary.total_income}
          breakdown={incomeBreakdown}
          fc={fc}
          pct={pct}
        />

        {/* Expense Breakdown */}
        <BreakdownCard
          title="Expense Breakdown"
          subtitle="ব্যয়ের খাত বিশ্লেষণ"
          icon="📤"
          accent="red"
          total={summary.total_expense}
          breakdown={expenseBreakdown}
          fc={fc}
          pct={pct}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
          TRANSACTIONS LIST
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-800">লেনদেন তালিকা</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{rangeStart} থেকে {rangeEnd} পর্যন্ত</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase">
              {transactions.length}টি রেকর্ড
            </span>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="p-14 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-indigo-100 border-t-indigo-600 mb-4"></div>
            <p className="text-gray-400 font-medium text-sm">ডেটা লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="p-14 text-center">
            <div className="inline-block p-4 bg-red-50 rounded-full text-3xl mb-4">⚠️</div>
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button
              onClick={fetchData}
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
                  {/* Left: icon + info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                      income ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {income ? '📈' : '📉'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                        {tx.title || tx.reason || 'অনামা লেনদেন'}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[11px] text-gray-400 font-medium">
                        <span>{formatDate(tx.created_at)}</span>
                        <span>·</span>
                        <span>{formatTime(tx.created_at)}</span>
                        {tx.payment_method && (
                          <>
                            <span>·</span>
                            <span className="uppercase font-bold text-indigo-400">{tx.payment_method}</span>
                          </>
                        )}
                        {tx.mobile_operator && (
                          <span className="px-1.5 py-0.5 bg-pink-50 text-pink-500 rounded-md font-bold">
                            {tx.mobile_operator}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: amount */}
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

        {/* Footer */}
        {!loading && !error && transactions.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-gray-400">মোট {transactions.length}টি লেনদেন দেখানো হচ্ছে</p>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-green-600">
                আয়: {fc(summary.total_income)}
              </span>
              <span className="text-red-500">
                ব্যয়: {fc(summary.total_expense)}
              </span>
              <span className="text-indigo-700">
                নিট: {fc(summary.closing_balance - summary.opening_balance)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ─── Sub-component: BreakdownCard ─────────────────────────────────────────────
const BreakdownCard = ({ title, subtitle, icon, accent, total, breakdown, fc, pct }) => {
  const accentMap = {
    green: {
      bar: 'bg-green-500',
      bg: 'bg-green-100',
      cash: 'bg-green-500',
      bank: 'bg-blue-500',
      mobile: 'bg-indigo-500',
    },
    red: {
      bar: 'bg-red-500',
      bg: 'bg-red-100',
      cash: 'bg-red-500',
      bank: 'bg-amber-500',
      mobile: 'bg-orange-500',
    },
  };
  const a = accentMap[accent] || accentMap.green;

  const operators = [
    { key: 'bkash',  label: 'bKash',  color: 'text-pink-600',  bar: 'bg-[#E2125B]', bg: 'bg-pink-50',   border: 'border-pink-100' },
    { key: 'nagad',  label: 'Nagad',  color: 'text-orange-600',bar: 'bg-[#F57224]', bg: 'bg-orange-50', border: 'border-orange-100' },
    { key: 'rocket', label: 'Rocket', color: 'text-purple-600', bar: 'bg-[#8C3494]', bg: 'bg-purple-50', border: 'border-purple-100' },
    { key: 'upay',   label: 'Upay',   color: 'text-blue-600',  bar: 'bg-[#005C97]', bg: 'bg-blue-50',   border: 'border-blue-100' },
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
        {/* Cash */}
        <ProgressRow label="💵 নগদ (Cash)" value={fc(breakdown.cash || 0)} pctVal={pct(breakdown.cash, total)} barColor={a.cash} bgColor={a.bg} />

        {/* Bank */}
        <ProgressRow label="🏛️ ব্যাংক (Bank)" value={fc(breakdown.bank || 0)} pctVal={pct(breakdown.bank, total)} barColor={a.bank} bgColor="bg-blue-100" />

        {/* Mobile Banking */}
        <div>
          <ProgressRow label="📱 মোবাইল ব্যাংকিং" value={fc(breakdown.mobile || 0)} pctVal={pct(breakdown.mobile, total)} barColor={a.mobile} bgColor="bg-indigo-100" />

          {/* Operator grid */}
          {(breakdown.mobile || 0) > 0 && (
            <div className="grid grid-cols-2 gap-2.5 mt-3 pl-4">
              {operators.map(op => (
                <div key={op.key} className={`p-2.5 rounded-xl border ${op.bg} ${op.border}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${op.color}`}>{op.label}</span>
                    <span className={`text-xs font-extrabold ${op.color}`}>{fc(breakdown[op.key] || 0)}</span>
                  </div>
                  <div className="w-full bg-white/70 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`${op.bar} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${pct(breakdown[op.key], breakdown.mobile)}%` }}
                    />
                  </div>
                </div>
              ))}
              {(breakdown.others || 0) > 0 && (
                <div className="p-2.5 rounded-xl border bg-gray-50 border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Others</span>
                    <span className="text-xs font-extrabold text-gray-600">{fc(breakdown.others)}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-gray-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct(breakdown.others, breakdown.mobile)}%` }}
                    />
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
const ProgressRow = ({ label, value, pctVal, barColor, bgColor }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5 text-sm font-medium">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
    <div className={`w-full ${bgColor} h-2 rounded-full overflow-hidden`}>
      <div
        className={`${barColor} h-full rounded-full transition-all duration-700`}
        style={{ width: `${pctVal}%` }}
      />
    </div>
  </div>
);

export default CashboxTransactions;