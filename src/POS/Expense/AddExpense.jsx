import React, { useState, useEffect } from 'react';
import { posCashboxAPI } from '../../context_or_provider/pos/cashbox/cashboxAPI';

const MOBILE_OPERATORS = ['bkash', 'nagad', 'rocket', 'upay'];

const AddExpense = ({ onSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Inline Category Modal states
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');
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
                description: newCatDesc.trim() || null
            });
            // Reload categories
            const catListRes = await posCashboxAPI.getAllExpenseCategories();
            setCategories(catListRes.data);
            
            // Set newly created category as selected in form
            setForm(prev => ({ ...prev, category: res.data.id }));
            
            // Reset modal states
            setNewCatName('');
            setNewCatDesc('');
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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

        // Validate
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

        // Determine Payment Method
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
            });
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

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-5">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        💸 Add New Expense
                    </h2>
                    <p className="text-rose-100 text-sm mt-1">নতুন খরচের তথ্য যোগ করুন</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Success */}
                    {success && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm font-medium">
                            {success}
                        </div>
                    )}
                    {/* Error */}
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
                                onClick={() => setShowAddCategoryModal(true)}
                                className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-0.5"
                            >
                                ➕ New Category
                            </button>
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm bg-white"
                        >
                            <option value="">-- Select Category --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {categories.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">⚠️ কোনো category নেই। ডান পাশের বোতামে চাপ দিয়ে সরাসরি category তৈরি করুন।</p>
                        )}
                    </div>

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

                        {/* Mobile operator details */}
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

                        {/* Net Total Indicator */}
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

                    {/* Submit */}
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

            {/* Add Category Modal */}
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
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddCategoryModal(false);
                                    setModalError('');
                                    setNewCatName('');
                                    setNewCatDesc('');
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
