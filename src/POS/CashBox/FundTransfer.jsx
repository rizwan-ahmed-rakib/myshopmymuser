// components/cashbox/FundTransfer.jsx
import React, { useState, useEffect } from 'react';
import { posCashboxAPI } from '../../context_or_provider/pos/cashbox/cashboxAPI';

const OPERATORS = [
    { value: 'bkash', label: 'bKash', icon: '⚡', color: 'from-pink-500 to-rose-600', badge: 'bg-pink-50 text-pink-600 border-pink-200' },
    { value: 'nagad', label: 'Nagad', icon: '🟠', color: 'from-orange-500 to-amber-600', badge: 'bg-orange-50 text-orange-600 border-orange-200' },
    { value: 'rocket', label: 'Rocket', icon: '🚀', color: 'from-purple-600 to-indigo-700', badge: 'bg-purple-50 text-purple-600 border-purple-200' },
    { value: 'upay', label: 'Upay', icon: '🟡', color: 'from-amber-400 to-yellow-500', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
];

const ACCOUNT_TYPES = [
    { id: 'cash', label: 'Cash', icon: '💵', desc: 'নগদ ক্যাশ' },
    { id: 'bank', label: 'Bank', icon: '🏛️', desc: 'ব্যাংক হিসাব' },
    { id: 'mobile', label: 'Mobile', icon: '📱', desc: 'মোবাইল ওয়ালেট' },
];

const ACCOUNT_ICONS = { cash: '💵', mobile: '📱', bank: '🏛️' };
const ACCOUNT_LABELS = { cash: 'Cash', mobile: 'Mobile Banking', bank: 'Bank' };

// Quick transfer presets (source → destination)
const QUICK_TRANSFERS = [
    { label: 'Cash → Bank', source: 'cash', dest: 'bank' },
    { label: 'Bank → Cash', source: 'bank', dest: 'cash' },
    { label: 'Mobile → Cash', source: 'mobile', dest: 'cash' },
    { label: 'Cash → Mobile', source: 'cash', dest: 'mobile' },
    { label: 'Bank → Mobile', source: 'bank', dest: 'mobile' },
    { label: 'Mobile → Bank', source: 'mobile', dest: 'bank' },
];

const FundTransfer = () => {
    // ── State ──
    const [sourceType, setSourceType] = useState('cash');
    const [destinationType, setDestinationType] = useState('bank');
    const [sourceOperator, setSourceOperator] = useState('');
    const [destinationOperator, setDestinationOperator] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Balances
    const [balances, setBalances] = useState({
        cash: 0,
        bank: 0,
        mobile: { bkash: 0, nagad: 0, rocket: 0, upay: 0 },
        total_mobile: 0,
        grand_total: 0,
    });
    const [fetchingBalances, setFetchingBalances] = useState(true);

    // Transfers list
    const [transfers, setTransfers] = useState([]);
    const [fetchingTransfers, setFetchingTransfers] = useState(true);

    // ── ফরম্যাটার ──
    const fc = (n) => `৳${parseFloat(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    // ── ডাটা ফেচিং ──
    const fetchBalances = async () => {
        try {
            setFetchingBalances(true);
            const res = await posCashboxAPI.getBalances();
            setBalances(res.data);
        } catch (error) {
            console.error('Failed to fetch balances', error);
        } finally {
            setFetchingBalances(false);
        }
    };

    const fetchTransfers = async () => {
        try {
            setFetchingTransfers(true);
            const res = await posCashboxAPI.getFundTransfers();
            setTransfers(res.data);
        } catch (error) {
            console.error('Failed to fetch transfers', error);
        } finally {
            setFetchingTransfers(false);
        }
    };

    useEffect(() => {
        fetchBalances();
        fetchTransfers();
    }, []);

    // ── উৎসের বর্তমান ব্যালেন্স ──
    const getSourceBalance = () => {
        if (sourceType === 'cash') return balances.cash || 0;
        if (sourceType === 'bank') return balances.bank || 0;
        if (sourceType === 'mobile') {
            if (!sourceOperator) return 0;
            return balances.mobile?.[sourceOperator] || 0;
        }
        return 0;
    };

    const sourceBalance = getSourceBalance();
    const parsedAmount = parseFloat(amount) || 0;
    const isExceeding = parsedAmount > sourceBalance;

    // ── প্রি-ডিফাইন্ড ট্রান্সফার সেট করা ──
    const applyQuickTransfer = (source, dest) => {
        setSourceType(source);
        setDestinationType(dest);
        setSourceOperator('');
        setDestinationOperator('');
        setAmount('');
        setNote('');
        setMessage({ type: '', text: '' });
    };

    // ── ফর্ম সাবমিট ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Same account check (including same mobile operator)
        if (sourceType === destinationType) {
            if (sourceType === 'mobile' && sourceOperator === destinationOperator) {
                setMessage({ type: 'error', text: '❌ একই মোবাইল ওয়ালেটে ট্রান্সফার করা যাবে না!' });
                return;
            }
            if (sourceType !== 'mobile') {
                setMessage({ type: 'error', text: '❌ একই অ্যাকাউন্ট টাইপে ট্রান্সফার করা যাবে না!' });
                return;
            }
        }

        if (!parsedAmount || parsedAmount <= 0) {
            setMessage({ type: 'error', text: '❌ সঠিক পরিমাণ দিন (০-এর বেশি)' });
            return;
        }

        if (sourceType === 'mobile' && !sourceOperator) {
            setMessage({ type: 'error', text: '❌ উৎসের মোবাইল অপারেটর নির্বাচন করুন' });
            return;
        }
        if (destinationType === 'mobile' && !destinationOperator) {
            setMessage({ type: 'error', text: '❌ গন্তব্যের মোবাইল অপারেটর নির্বাচন করুন' });
            return;
        }

        if (isExceeding) {
            setMessage({
                type: 'error',
                text: `❌ পর্যাপ্ত ব্যালেন্স নেই! সর্বোচ্চ ${fc(sourceBalance)} টাকা ট্রান্সফার করতে পারবেন।`
            });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                source_type: sourceType,
                destination_type: destinationType,
                source_mobile_operator: sourceType === 'mobile' ? sourceOperator : null,
                destination_mobile_operator: destinationType === 'mobile' ? destinationOperator : null,
                amount: parsedAmount,
                note: note,
            };

            await posCashboxAPI.createFundTransfer(payload);
            setMessage({ type: 'success', text: '🎉 ট্রান্সফার সফলভাবে সম্পন্ন হয়েছে!' });
            setAmount('');
            setNote('');

            fetchBalances();
            fetchTransfers();
        } catch (error) {
            const errData = error.response?.data;
            let errorMsg = '❌ ট্রান্সফার ব্যর্থ, আবার চেষ্টা করুন।';

            if (errData) {
                if (typeof errData === 'string') errorMsg = `❌ ${errData}`;
                else if (errData.detail) errorMsg = `❌ ${errData.detail}`;
                else if (errData.non_field_errors) errorMsg = `❌ ${errData.non_field_errors.join(', ')}`;
                else {
                    const firstKey = Object.keys(errData)[0];
                    if (firstKey) {
                        const val = errData[firstKey];
                        errorMsg = `❌ ${firstKey}: ${Array.isArray(val) ? val.join(', ') : val}`;
                    }
                }
            }
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    // Quick Add Preset Buttons
    const addPresetAmount = (val) => {
        if (val === 'MAX') {
            setAmount(sourceBalance.toString());
        } else {
            setAmount((prev) => ((parseFloat(prev) || 0) + val).toString());
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-inner">
                        🔄
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">ফান্ড ট্রান্সফার স্টুডিও</h2>
                        <p className="text-xs text-slate-400 font-medium">নিরাপদে ও দ্রুত এক হিসাব থেকে অন্য হিসাবে টাকা স্থানান্তরিত করুন</p>
                    </div>
                </div>
                <button
                    onClick={() => { fetchBalances(); fetchTransfers(); }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
                >
                    <span>🔄 রিফ্রেশ ব্যালেন্স</span>
                </button>
            </div>

            {/* Quick Transfer Buttons */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-500 self-center mr-1">দ্রুত ট্রান্সফার:</span>
                    {QUICK_TRANSFERS.map((qt, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => applyQuickTransfer(qt.source, qt.dest)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:shadow-md ${
                                sourceType === qt.source && destinationType === qt.dest
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                            {qt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Grand Total */}
                <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-2xl p-5 shadow-lg shadow-indigo-200/50 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
                                Grand Total
                            </span>
                            <span className="text-xl">💰</span>
                        </div>
                        <p className="text-2xl font-black tracking-tight mt-1">
                            {fetchingBalances ? '...' : fc(balances.grand_total)}
                        </p>
                    </div>
                    <p className="text-[11px] text-indigo-200/80 mt-4 font-medium">সব অ্যাকাউন্ট মিলে মোট ব্যালেন্স</p>
                </div>

                {/* Individual Cards */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Cash */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cash Balance</span>
                            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-lg">💵</span>
                        </div>
                        <p className={`text-xl font-extrabold mt-3 ${balances.cash < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                            {fetchingBalances ? '...' : fc(balances.cash)}
                        </p>
                    </div>

                    {/* Bank */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bank Balance</span>
                            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 text-lg">🏛️</span>
                        </div>
                        <p className={`text-xl font-extrabold mt-3 ${balances.bank < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                            {fetchingBalances ? '...' : fc(balances.bank)}
                        </p>
                    </div>

                    {/* Mobile Breakdown */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Total</span>
                            <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600 text-sm font-bold">
                                {fc(balances.total_mobile)}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-slate-100">
                            {OPERATORS.map(op => (
                                <div key={op.value} className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded-lg">
                                    <span className="text-slate-500 font-semibold">{op.label}</span>
                                    <span className="font-bold text-slate-700">{fc(balances.mobile?.[op.value])}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Transfer Studio Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Interactive Account Switcher Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                            {/* Source Account Box */}
                            <div className="lg:col-span-5 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg">
                                        উৎস (From)
                                    </span>
                                    <span className="text-xs font-bold text-slate-500">
                                        Available: <strong className="text-indigo-600">{fc(sourceBalance)}</strong>
                                    </span>
                                </div>

                                {/* Segmented Buttons */}
                                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-200/50 rounded-xl">
                                    {ACCOUNT_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => {
                                                setSourceType(type.id);
                                                setSourceOperator('');
                                            }}
                                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                                                sourceType === type.id
                                                    ? 'bg-white text-indigo-600 shadow-sm scale-[1.02]'
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            <span className="text-base">{type.icon}</span>
                                            <span>{type.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Mobile Operator Selection */}
                                {sourceType === 'mobile' && (
                                    <div className="space-y-2 pt-1">
                                        <label className="text-xs font-bold text-slate-500">অপারেটর নির্বাচন করুন</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {OPERATORS.map((op) => (
                                                <button
                                                    key={op.value}
                                                    type="button"
                                                    onClick={() => setSourceOperator(op.value)}
                                                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                                        sourceOperator === op.value
                                                            ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                    }`}
                                                >
                                                    <span className="text-xs font-bold text-slate-700">{op.label}</span>
                                                    <span className="text-[10px] font-extrabold text-indigo-600">
                                                        {fc(balances.mobile?.[op.value])}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Arrow Indicator */}
                            <div className="lg:col-span-2 flex justify-center">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xl shadow-sm transform lg:rotate-0 rotate-90">
                                    ➔
                                </div>
                            </div>

                            {/* Destination Account Box */}
                            <div className="lg:col-span-5 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                                        গন্তব্য (To)
                                    </span>
                                </div>

                                {/* Segmented Buttons */}
                                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-200/50 rounded-xl">
                                    {ACCOUNT_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => {
                                                setDestinationType(type.id);
                                                setDestinationOperator('');
                                            }}
                                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                                                destinationType === type.id
                                                    ? 'bg-white text-emerald-600 shadow-sm scale-[1.02]'
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            <span className="text-base">{type.icon}</span>
                                            <span>{type.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Mobile Operator Selection */}
                                {destinationType === 'mobile' && (
                                    <div className="space-y-2 pt-1">
                                        <label className="text-xs font-bold text-slate-500">অপারেটর নির্বাচন করুন</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {OPERATORS.map((op) => (
                                                <button
                                                    key={op.value}
                                                    type="button"
                                                    onClick={() => setDestinationOperator(op.value)}
                                                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                                        destinationOperator === op.value
                                                            ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                    }`}
                                                >
                                                    <span className="text-xs font-bold text-slate-700">{op.label}</span>
                                                    <span className="text-[10px] font-extrabold text-emerald-600">
                                                        {fc(balances.mobile?.[op.value])}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amount & Notes Input Group */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            {/* Amount */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                                    ট্রান্সফার পরিমাণ (Amount) <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">৳</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className={`w-full pl-10 pr-4 py-3.5 bg-slate-50 border rounded-xl text-lg font-bold text-slate-800 focus:bg-white focus:outline-none transition-all ${
                                            isExceeding
                                                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 text-rose-600'
                                                : 'border-slate-200 focus:ring-2 focus:ring-indigo-200'
                                        }`}
                                    />
                                </div>

                                {/* Preset Buttons */}
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="text-[11px] font-bold text-slate-400">Quick Add:</span>
                                    {[500, 1000, 5000].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => addPresetAmount(val)}
                                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all"
                                        >
                                            +{val}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addPresetAmount('MAX')}
                                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold transition-all ml-auto"
                                    >
                                        Max ({fc(sourceBalance)})
                                    </button>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                                    নোট / কারণ (ঐচ্ছিক)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows="2"
                                    placeholder="লেনদেনের সংক্ষিপ্ত নোট..."
                                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Error Notification Alert */}
                        {message.text && (
                            <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                message.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                                <span>{message.text}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || isExceeding}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>প্রক্রিয়াকরণ হচ্ছে...</span>
                                </>
                            ) : (
                                <span>🔄 ফান্ড ট্রান্সফার নিশ্চিত করুন</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Transfer History Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">📋</span>
                        <h3 className="text-sm font-extrabold text-slate-800">সাম্প্রতিক ট্রান্সফার ইতিহাস</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        মোট {transfers.length} টি লেনদেন
                    </span>
                </div>

                {fetchingTransfers ? (
                    <div className="p-12 text-center text-xs font-bold text-slate-400 animate-pulse">ইতিহাস লোড হচ্ছে...</div>
                ) : transfers.length === 0 ? (
                    <div className="p-12 text-center text-xs font-bold text-slate-400">এখনো কোনো ফান্ড ট্রান্সফার করা হয়নি</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {transfers.map((t) => (
                            <div key={t.id} className="p-4 sm:px-6 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg shrink-0">
                                        💸
                                    </div>
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-extrabold text-slate-800">
                                                {ACCOUNT_ICONS[t.source_type]} {ACCOUNT_LABELS[t.source_type]}
                                                {t.source_mobile_operator && ` (${t.source_mobile_operator})`}
                                            </span>
                                            <span className="text-xs text-slate-400 font-black">➔</span>
                                            <span className="text-xs font-extrabold text-slate-800">
                                                {ACCOUNT_ICONS[t.destination_type]} {ACCOUNT_LABELS[t.destination_type]}
                                                {t.destination_mobile_operator && ` (${t.destination_mobile_operator})`}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 font-medium">
                                            {new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            {' · '}
                                            {new Date(t.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            {t.note && ` · ${t.note}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <p className="text-base font-black text-indigo-600">{fc(t.amount)}</p>
                                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                                        {t.created_by || 'system'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FundTransfer;