import React, { useState, useEffect } from 'react';
import { posCashboxAPI } from '../../context_or_provider/pos/cashbox/cashboxAPI';

const MOBILE_OPERATORS = ['bkash', 'nagad', 'rocket', 'upay'];

const AddExpense = ({ onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');
    const [newCatIsWithdraw, setNewCatIsWithdraw] = useState(false); // ✅ নতুন
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState('');

    const [form, setForm] = useState({
        title: '',
        category: '',
        paid_cash: '',
        paid_mobile: '',
        paid_bank: '',
        mobile_operator: '',
        description: '',
        is_withdraw: false,
        is_withdraw_overridden: false,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await posCashboxAPI.getAllExpenseCategories();
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    // ✅ Modal থেকে Category Create
    const handleCreateCategory = async () => {
        if (!newCatName.trim()) {
            setModalError('Category নাম দিন।');
            return;
        }
        setModalLoading(true);
        setModalError('');
        try {
            const res = await posCashboxAPI.createExpenseCategory({
                name: newCatName.trim(),
                description: newCatDesc.trim() || null,
                is_withdraw: newCatIsWithdraw, // ✅ Withdraw flag পাঠান
            });
            const catListRes = await posCashboxAPI.getAllExpenseCategories();
            setCategories(catListRes.data);
            setForm(prev => ({ ...prev, category: res.data.id }));
            setNewCatName('');
            setNewCatDesc('');
            setNewCatIsWithdraw(false);
            setShowAddCategoryModal(false);
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.name) {
                setModalError(`Name: ${Array.isArray(errData.name) ? errData.name.join(', ') : errData.name}`);
            } else {
                setModalError('Category যোগ করতে সমস্যা হয়েছে।');
            }
        } finally {
            setModalLoading(false);
        }
    };

    // ✅ ক্যাটাগরি নির্বাচন করলে অটো-সেট
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        const cat = categories.find(c => c.id === parseInt(categoryId));

        setSelectedCategory(cat);

        if (cat && cat.is_withdraw) {
            setForm(prev => ({
                ...prev,
                category: categoryId,
                is_withdraw: true,
                is_withdraw_overridden: false,
            }));
        } else {
            setForm(prev => ({
                ...prev,
                category: categoryId,
                is_withdraw: false,
                is_withdraw_overridden: false,
            }));
        }
    };

    // ✅ ইউজার ম্যানুয়ালি টগল করলে
    const handleWithdrawToggle = (e) => {
        const checked = e.target.checked;
        setForm(prev => ({
            ...prev,
            is_withdraw: checked,
            is_withdraw_overridden: true,
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'is_withdraw') {
            handleWithdrawToggle(e);
            return;
        }
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const getFormTotal = () => {
        const c = parseFloat(form.paid_cash || 0);
        const m = parseFloat(form.paid_mobile || 0);
        const b = parseFloat(form.paid_bank || 0);
        return c + m + b;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        let finalWithdraw = form.is_withdraw;
        if (!form.is_withdraw_overridden && selectedCategory) {
            finalWithdraw = selectedCategory.is_withdraw;
        }

        if (!form.title.trim()) {
            setError('Title দিন।');
            setLoading(false);
            return;
        }

        const totalAmount = getFormTotal();
        if (totalAmount <= 0) {
            setError('অন্তত একটি পেমেন্ট চ্যানেলে পরিমাণ (amount) দিন (০ এর বেশি হতে হবে)।');
            setLoading(false);
            return;
        }

        const cashVal = parseFloat(form.paid_cash || 0);
        const mobileVal = parseFloat(form.paid_mobile || 0);
        const bankVal = parseFloat(form.paid_bank || 0);

        if (mobileVal > 0 && !form.mobile_operator) {
            setError('মোবাইল ব্যাংকিং অপারেটর নির্বাচন করুন।');
            setLoading(false);
            return;
        }

        let paymentMethod = 'cash';
        const activeChannelsCount = [cashVal > 0, mobileVal > 0, bankVal > 0].filter(Boolean).length;

        if (activeChannelsCount > 1) {
            paymentMethod = 'hybrid';
        } else if (mobileVal > 0) {
            paymentMethod = 'mobile_banking';
        } else if (bankVal > 0) {
            paymentMethod = 'bank';
        }

        const payload = {
            title: form.title.trim(),
            category: form.category || null,
            payment_method: paymentMethod,
            amount: totalAmount,
            paid_cash: cashVal,
            paid_mobile: mobileVal,
            paid_bank: bankVal,
            mobile_operator: mobileVal > 0 ? form.mobile_operator : null,
            description: form.description.trim() || null,
            is_withdraw: finalWithdraw,
        };

        try {
            await posCashboxAPI.createExpense(payload);
            setSuccess('✅ Expense সফলভাবে যোগ হয়েছে!');
            setForm({
                title: '',
                category: '',
                paid_cash: '',
                paid_mobile: '',
                paid_bank: '',
                mobile_operator: '',
                description: '',
                is_withdraw: false,
                is_withdraw_overridden: false,
            });
            setSelectedCategory(null);
            setTimeout(() => {
                setSuccess('');
                if (onSuccess) onSuccess();
            }, 1500);
        } catch (err) {
            const errData = err.response?.data;
            if (errData && typeof errData === 'object') {
                setError(Object.entries(errData).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | '));
            } else {
                setError('Expense যোগ করতে সমস্যা হয়েছে।');
            }
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = getFormTotal();
    const showOperatorSelect = parseFloat(form.paid_mobile || 0) > 0;

    const getWithdrawCheckboxClass = () => {
        if (selectedCategory?.is_withdraw && !form.is_withdraw_overridden) {
            return 'bg-amber-50 border-amber-300';
        }
        if (form.is_withdraw_overridden && form.is_withdraw) {
            return 'bg-orange-50 border-orange-300';
        }
        return 'bg-gray-50 border-gray-200';
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-5">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        💸 Add New Expense
                    </h2>
                    <p className="text-rose-100 text-sm mt-1">নতুন খরচের তথ্য যোগ করুন</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {success && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm font-medium">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Expense Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="যেমন: দোকান ভাড়া, স্টাফ বেতন, বিদ্যুৎ বিল..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm transition-all"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide flex justify-between items-center">
                            <span>Category <span className="text-gray-400">(Optional)</span></span>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddCategoryModal(true);
                                    setNewCatIsWithdraw(false);
                                }}
                                className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-0.5"
                            >
                                ➕ New Category
                            </button>
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleCategoryChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm bg-white"
                        >
                            <option value="">-- Select Category --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} {cat.is_withdraw && '🏦 (Withdraw)'}
                                </option>
                            ))}
                        </select>
                        {categories.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">⚠️ কোনো category নেই। ডান পাশের বোতামে চাপ দিয়ে সরাসরি category তৈরি করুন।</p>
                        )}
                    </div>

                    {/* ✅ Withdraw Checkbox */}
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${getWithdrawCheckboxClass()}`}>
                        <input
                            type="checkbox"
                            name="is_withdraw"
                            checked={form.is_withdraw}
                            onChange={handleChange}
                            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                            disabled={selectedCategory?.is_withdraw && !form.is_withdraw_overridden}
                        />
                        <label className="text-sm font-medium">
                            {selectedCategory?.is_withdraw && !form.is_withdraw_overridden ? (
                                <>
                                    🔒 <span className="text-amber-700">Category Default: Withdraw</span>
                                    <span className="block text-xs text-amber-600 font-normal">
                                        ক্যাটাগরি অনুযায়ী অটো-সেট। চাইলে টগল করে পরিবর্তন করতে পারেন।
                                    </span>
                                </>
                            ) : form.is_withdraw_overridden && form.is_withdraw ? (
                                <>
                                    ✏️ <span className="text-orange-700">Manual Override: Withdraw</span>
                                    <span className="block text-xs text-orange-600 font-normal">
                                        আপনি ম্যানুয়ালি উইথড্র হিসেবে চিহ্নিত করেছেন।
                                    </span>
                                </>
                            ) : (
                                <>
                                    🏦 <span className="text-gray-700">Mark as Withdraw</span>
                                    <span className="block text-xs text-gray-500 font-normal">
                                        চেক করলে এটি Expense হিসেবে গণ্য হবে না, শুধু ক্যাশবক্সে আউট হবে
                                    </span>
                                </>
                            )}
                        </label>
                    </div>

                    {/* ✅ Override সতর্কতা */}
                    {form.is_withdraw_overridden && selectedCategory && selectedCategory.is_withdraw !== form.is_withdraw && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-700">
                                ⚠️ আপনি ক্যাটাগরির ডিফল্ট সেটিং ওভাররাইড করেছেন।
                                {selectedCategory.is_withdraw ?
                                    ' (ক্যাটাগরি: Withdraw → আপনি: Normal Expense)' :
                                    ' (ক্যাটাগরি: Normal → আপনি: Withdraw)'}
                            </p>
                        </div>
                    )}

                    {/* Payment Channels Block */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Payment Channels (পেমেন্ট চ্যানেলসমূহ)</label>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">💵 Cash (৳)</label>
                                <input
                                    type="number"
                                    name="paid_cash"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full border border-gray-200 p-2 rounded-lg font-bold text-xs bg-white focus:border-rose-500 outline-none font-mono focus:shadow-md"
                                    value={form.paid_cash}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">📱 Mobile (৳)</label>
                                <input
                                    type="number"
                                    name="paid_mobile"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full border border-gray-200 p-2 rounded-lg font-bold text-xs bg-white focus:border-rose-500 outline-none font-mono focus:shadow-md"
                                    value={form.paid_mobile}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">🏦 Bank (৳)</label>
                                <input
                                    type="number"
                                    name="paid_bank"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full border border-gray-200 p-2 rounded-lg font-bold text-xs bg-white focus:border-rose-500 outline-none font-mono focus:shadow-md"
                                    value={form.paid_bank}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {showOperatorSelect && (
                            <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-100 animate-in fade-in duration-200">
                                <label className="block text-[10px] uppercase font-black text-orange-800 mb-1.5">Select Mobile Operator (অপারেটর নির্বাচন করুন) *</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {MOBILE_OPERATORS.map(op => (
                                        <button
                                            key={op}
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, mobile_operator: op }))}
                                            className={`py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                                                form.mobile_operator === op
                                                    ? 'border-orange-500 bg-orange-100 text-orange-850 font-bold shadow-sm'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {op}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-xs font-bold border-t border-gray-200 pt-2.5">
                            <span className="text-gray-500">Total Expense Amount:</span>
                            <span className="text-sm font-black font-mono text-rose-600">৳{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                            Description <span className="text-gray-400">(Optional)</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="2"
                            placeholder="বিস্তারিত বিবরণ..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold text-sm hover:from-rose-600 hover:to-red-700 disabled:opacity-50 transition-all shadow-md shadow-rose-200 active:scale-95"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>
                                Adding...
                            </span>
                        ) : '➕ Add Expense'}
                    </button>
                </form>
            </div>

            {/* ✅ Add Category Modal - Updated with Withdraw Checkbox */}
            {showAddCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-gray-150 animate-in fade-in duration-200">
                        <h3 className="text-base font-bold text-gray-800 mb-4">➕ New Category</h3>
                        {modalError && (
                            <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{modalError}</div>
                        )}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-655 mb-1">Name *</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    placeholder="Category Name"
                                    value={newCatName}
                                    onChange={e => setNewCatName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-655 mb-1">Description (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    placeholder="Brief description"
                                    value={newCatDesc}
                                    onChange={e => setNewCatDesc(e.target.value)}
                                />
                            </div>

                            {/* ✅ Withdraw Checkbox in Modal */}
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                <input
                                    type="checkbox"
                                    checked={newCatIsWithdraw}
                                    onChange={e => setNewCatIsWithdraw(e.target.checked)}
                                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                                />
                                <label className="text-sm font-medium text-amber-800">
                                    🏦 Withdraw Category?
                                    <span className="block text-xs text-amber-600 font-normal">
                                        চেক করলে এই ক্যাটাগরির সব এক্সপেন্স ডিফল্টভাবে উইথড্র হিসেবে গণ্য হবে
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddCategoryModal(false);
                                    setModalError('');
                                    setNewCatName('');
                                    setNewCatDesc('');
                                    setNewCatIsWithdraw(false);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateCategory}
                                disabled={modalLoading}
                                className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 disabled:opacity-50"
                            >
                                {modalLoading ? 'Adding...' : '✓ Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddExpense;