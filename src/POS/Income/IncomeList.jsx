import React, { useState, useEffect } from 'react';
import { posCashboxAPI } from '../../context_or_provider/pos/cashbox/cashboxAPI';

const PAYMENT_METHOD_LABELS = {
    cash: '💵 Cash',
    mobile_banking: '📱 Mobile Banking',
    bank: '🏦 Bank',
    hybrid: '🔀 Hybrid',
};

const PAYMENT_METHOD_COLORS = {
    cash: 'bg-green-100 text-green-800',
    mobile_banking: 'bg-blue-100 text-blue-800',
    bank: 'bg-purple-100 text-purple-800',
    hybrid: 'bg-orange-100 text-orange-800',
};

const IncomeList = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterMethod, setFilterMethod] = useState('');
    const [categories, setCategories] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Delete modal state
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Edit modal state
    const [editItem, setEditItem] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    useEffect(() => {
        fetchIncomes();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await posCashboxAPI.getAllIncomeCategories();
            setCategories(res.data);
        } catch (err) {
            console.error('Categories fetch error:', err);
        }
    };

    const fetchIncomes = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await posCashboxAPI.getAllIncome();
            setIncomes(response.data);
            const totalAmount = response.data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            setTotal(totalAmount);
        } catch (err) {
            console.error('Error fetching incomes:', err);
            setError('Income লোড করতে সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await posCashboxAPI.deleteIncome(deleteId);
            setDeleteId(null);
            fetchIncomes();
        } catch (err) {
            alert('Income delete করতে সমস্যা হয়েছে।');
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    const handleEditSubmit = async () => {
        if (!editItem) return;
        setEditLoading(true);
        setEditError('');

        const cashVal = parseFloat(editItem.paid_cash || 0);
        const mobileVal = parseFloat(editItem.paid_mobile || 0);
        const bankVal = parseFloat(editItem.paid_bank || 0);
        const totalAmount = cashVal + mobileVal + bankVal;

        if (totalAmount <= 0) {
            setEditError('অন্তত একটি পেমেন্ট চ্যানেলে পরিমাণ (amount) দিন।');
            setEditLoading(false);
            return;
        }

        if (mobileVal > 0 && !editItem.mobile_operator) {
            setEditError('মোবাইল ব্যাংকিং অপারেটর নির্বাচন করুন।');
            setEditLoading(false);
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

        try {
            await posCashboxAPI.updateIncome(editItem.id, {
                title: editItem.title,
                category: editItem.category || null,
                payment_method: paymentMethod,
                amount: totalAmount,
                paid_cash: cashVal,
                paid_mobile: mobileVal,
                paid_bank: bankVal,
                mobile_operator: mobileVal > 0 ? editItem.mobile_operator : null,
                description: editItem.description || null,
            });
            setEditItem(null);
            fetchIncomes();
        } catch (err) {
            const errData = err.response?.data;
            if (errData && typeof errData === 'object') {
                setEditError(Object.entries(errData).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | '));
            } else {
                setEditError('Update করতে সমস্যা হয়েছে।');
            }
        } finally {
            setEditLoading(false);
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    // Filter logic (client-side)
    const filtered = incomes.filter(inc => {
        const matchSearch = !search || inc.title?.toLowerCase().includes(search.toLowerCase()) || inc.description?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = !filterCategory || String(inc.category) === String(filterCategory);
        const matchMethod = !filterMethod || inc.payment_method === filterMethod;

        // Date range match
        let matchDate = true;
        if (startDate || endDate) {
            const incDate = new Date(inc.created_at);
            incDate.setHours(0, 0, 0, 0);

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (incDate < start) matchDate = false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                if (incDate > end) matchDate = false;
            }
        }

        return matchSearch && matchCategory && matchMethod && matchDate;
    });

    const filteredTotal = filtered.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    return (
        <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">৳{total.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Filtered Total</p>
                    <p className="text-2xl font-bold text-emerald-500">৳{filteredTotal.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Total Records</p>
                    <p className="text-2xl font-bold text-gray-700">{filtered.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="🔍 Search title or description..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 min-w-[180px] px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={filterMethod}
                        onChange={e => setFilterMethod(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                    >
                        <option value="">All Methods</option>
                        <option value="cash">Cash</option>
                        <option value="mobile_banking">Mobile Banking</option>
                        <option value="bank">Bank</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 font-semibold">From:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 font-semibold">To:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                        />
                    </div>
                    {(search || filterCategory || filterMethod || startDate || endDate) && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setFilterCategory('');
                                setFilterMethod('');
                                setStartDate('');
                                setEndDate('');
                            }}
                            className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                    <button onClick={fetchIncomes} className="ml-3 underline text-sm">আবার চেষ্টা করুন</button>
                </div>
            )}

            {/* Income Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-green-50 border-b border-green-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Title</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Payment</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
                                        <p className="text-gray-500 text-sm">Loading incomes...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="text-4xl mb-3">💰</div>
                                        <p className="text-gray-500">No income records found</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((income, idx) => (
                                    <tr key={income.id} className="hover:bg-green-50/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-900">{income.title}</div>
                                            {income.description && (
                                                <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{income.description}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {income.category_name ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    {income.category_name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-bold text-green-600">
                                                ৳{parseFloat(income.amount).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_METHOD_COLORS[income.payment_method] || 'bg-gray-100 text-gray-600'}`}>
                                                {PAYMENT_METHOD_LABELS[income.payment_method] || income.payment_method}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                            {formatDate(income.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditItem({ ...income })}
                                                    className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(income.id)}
                                                    className="px-3 py-1 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-red-100">
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">⚠️</div>
                            <h3 className="text-lg font-semibold text-gray-800">Delete Income?</h3>
                            <p className="text-gray-500 text-sm mt-1">এই income record টি মুছে ফেলবেন? এটি আর ফেরত আনা যাবে না।</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 font-medium text-sm"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            ✏️ Edit Income
                        </h3>

                        {editError && (
                            <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{editError}</div>
                        )}

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
                                    value={editItem.title}
                                    onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Category</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-sm bg-white"
                                    value={editItem.category || ''}
                                    onChange={e => setEditItem({ ...editItem, category: e.target.value || null })}
                                >
                                    <option value="">-- No Category --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Payment Channels Block */}
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Payment Channels</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Cash (৳)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border border-gray-200 p-1.5 rounded-lg text-xs bg-white focus:border-green-500 outline-none font-mono"
                                            value={editItem.paid_cash || ''}
                                            onChange={e => setEditItem({ ...editItem, paid_cash: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Mobile (৳)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border border-gray-200 p-1.5 rounded-lg text-xs bg-white focus:border-green-500 outline-none font-mono"
                                            value={editItem.paid_mobile || ''}
                                            onChange={e => setEditItem({ ...editItem, paid_mobile: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Bank (৳)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border border-gray-200 p-1.5 rounded-lg text-xs bg-white focus:border-green-500 outline-none font-mono"
                                            value={editItem.paid_bank || ''}
                                            onChange={e => setEditItem({ ...editItem, paid_bank: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {parseFloat(editItem.paid_mobile || 0) > 0 && (
                                    <div className="p-2 bg-orange-50/70 rounded-xl border border-orange-100 animate-in fade-in duration-200">
                                        <label className="block text-[9px] uppercase font-black text-orange-850 mb-1">Mobile Operator *</label>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {['bkash', 'nagad', 'rocket', 'upay'].map(op => (
                                                <button
                                                    key={op}
                                                    type="button"
                                                    onClick={() => setEditItem({ ...editItem, mobile_operator: op })}
                                                    className={`py-1 rounded-lg text-[10px] font-bold border transition-all capitalize ${
                                                        editItem.mobile_operator === op
                                                            ? 'border-orange-500 bg-orange-100 text-orange-800'
                                                            : 'border-gray-200 bg-white text-gray-600'
                                                    }`}
                                                >
                                                    {op}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-xs font-bold border-t border-gray-200 pt-2">
                                    <span className="text-gray-500">Total Amount:</span>
                                    <span className="font-mono text-green-600">
                                        ৳{(parseFloat(editItem.paid_cash || 0) + parseFloat(editItem.paid_mobile || 0) + parseFloat(editItem.paid_bank || 0)).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                                <textarea
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-sm resize-none"
                                    value={editItem.description || ''}
                                    onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => { setEditItem(null); setEditError(''); }}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                disabled={editLoading}
                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 font-medium text-sm"
                            >
                                {editLoading ? 'Saving...' : '✓ Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomeList;
