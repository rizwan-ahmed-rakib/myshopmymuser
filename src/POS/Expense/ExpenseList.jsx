import React, {useState, useEffect} from 'react';
import {posCashboxAPI} from '../../context_or_provider/pos/cashbox/cashboxAPI';

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

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [totalWithdraw, setTotalWithdraw] = useState(0); // ✅ Withdraw Total
    const [totalNormalExpense, setTotalNormalExpense] = useState(0); // ✅ Normal Expense Total
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
        fetchExpenses();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await posCashboxAPI.getAllExpenseCategories();
            setCategories(res.data);
        } catch (err) {
            console.error('Categories fetch error:', err);
        }
    };

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await posCashboxAPI.getAllExpense();
            setExpenses(response.data);

            // ✅ Total, Withdraw, Normal Expense আলাদা করে 계산
            const totalAmount = response.data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            const withdrawAmount = response.data
                .filter(item => item.is_withdraw)
                .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            const normalExpenseAmount = totalAmount - withdrawAmount;

            setTotal(totalAmount);
            setTotalWithdraw(withdrawAmount);
            setTotalNormalExpense(normalExpenseAmount);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('Expense লোড করতে সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await posCashboxAPI.deleteExpense(deleteId);
            setDeleteId(null);
            fetchExpenses();
        } catch (err) {
            alert('Expense delete করতে সমস্যা হয়েছে।');
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
            await posCashboxAPI.updateExpense(editItem.id, {
                title: editItem.title,
                category: editItem.category || null,
                payment_method: paymentMethod,
                amount: totalAmount,
                paid_cash: cashVal,
                paid_mobile: mobileVal,
                paid_bank: bankVal,
                mobile_operator: mobileVal > 0 ? editItem.mobile_operator : null,
                description: editItem.description || null,
                is_withdraw: editItem.is_withdraw || false, // ✅ Withdraw flag পাঠান
            });
            setEditItem(null);
            fetchExpenses();
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
    const filtered = expenses.filter(exp => {
        const matchSearch = !search || exp.title?.toLowerCase().includes(search.toLowerCase()) || exp.description?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = !filterCategory || String(exp.category) === String(filterCategory);
        const matchMethod = !filterMethod || exp.payment_method === filterMethod;

        let matchDate = true;
        if (startDate || endDate) {
            const expDate = new Date(exp.created_at);
            expDate.setHours(0, 0, 0, 0);

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (expDate < start) matchDate = false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                if (expDate > end) matchDate = false;
            }
        }

        return matchSearch && matchCategory && matchMethod && matchDate;
    });

    // ✅ Filtered data এর উপর ভিত্তি করে আলাদা টোটাল
    const filteredTotal = filtered.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const filteredWithdraw = filtered
        .filter(item => item.is_withdraw)
        .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const filteredNormalExpense = filteredTotal - filteredWithdraw;

    return (
        <div>
            {/* ✅ Summary Cards - Updated with Withdraw & Normal Expense */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Expense */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">💰 Total Expense</p>
                    <p className="text-2xl font-bold text-rose-600">৳{total.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">সব মিলিয়ে মোট খরচ</p>
                </div>

                {/* Normal Expense */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-200 bg-rose-50/30">
                    <p className="text-xs text-gray-500 mb-1">📉 Normal Expense</p>
                    <p className="text-2xl font-bold text-rose-600">৳{totalNormalExpense.toLocaleString()}</p>
                    <p className="text-xs text-rose-600 mt-1">✅ উইথড্র বাদে খরচ</p>
                </div>

                {/* Withdraw */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200 bg-amber-50/30">
                    <p className="text-xs text-gray-500 mb-1">🏦 Withdraw</p>
                    <p className="text-2xl font-bold text-amber-600">৳{totalWithdraw.toLocaleString()}</p>
                    <p className="text-xs text-amber-600 mt-1">📊 মোট উত্তোলনের পরিমাণ</p>
                </div>

                {/* Total Records */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">📋 Total Records</p>
                    <p className="text-2xl font-bold text-gray-700">{filtered.length}</p>
                    <div className="flex gap-2 mt-1">
                        <span className="text-xs text-amber-600">
                            🏦 {filtered.filter(i => i.is_withdraw).length} Withdraw
                        </span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-rose-600">
                            💸 {filtered.filter(i => !i.is_withdraw).length} Normal
                        </span>
                    </div>
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
                        className="flex-1 min-w-[180px] px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={filterMethod}
                        onChange={e => setFilterMethod(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
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
                            className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 font-semibold">To:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
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
                    <button onClick={fetchExpenses} className="ml-3 underline text-sm">আবার চেষ্টা করুন</button>
                </div>
            )}

            {/* Expense Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-rose-50 border-b border-rose-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-700 uppercase tracking-wider">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-700 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-700 uppercase tracking-wider">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-700 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-700 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-700 uppercase tracking-wider">Payment</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-700 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-700 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-12 text-center">
                                    <div
                                        className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mb-2"></div>
                                    <p className="text-gray-500 text-sm">Loading expenses...</p>
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-12 text-center">
                                    <div className="text-4xl mb-3">💸</div>
                                    <p className="text-gray-500">No expense records found</p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((expense, idx) => (
                                <tr key={expense.id} className={`hover:bg-rose-50/50 transition-colors ${
                                    expense.is_withdraw ? 'bg-amber-50/30' : ''
                                }`}>
                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                                        {expense.description && (
                                            <div
                                                className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{expense.description}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {expense.category_name ? (
                                            <span
                                                className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
                                                    {expense.category_name}
                                                </span>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        {expense.is_withdraw ? (
                                            <span
                                                className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium whitespace-nowrap">🏦 Withdraw</span>
                                        ) : (
                                            <span
                                                className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium whitespace-nowrap">💸 Expense</span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                            <span className={`text-sm font-bold ${
                                                expense.is_withdraw ? 'text-amber-600' : 'text-rose-600'
                                            }`}>
                                                ৳{parseFloat(expense.amount).toLocaleString()}
                                            </span>
                                    </td>

                                    <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_METHOD_COLORS[expense.payment_method] || 'bg-gray-100 text-gray-600'}`}>
                                                {PAYMENT_METHOD_LABELS[expense.payment_method] || expense.payment_method}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                        {formatDate(expense.created_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditItem({...expense})}
                                                className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(expense.id)}
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
                            <h3 className="text-lg font-semibold text-gray-800">Delete Expense?</h3>
                            <p className="text-gray-500 text-sm mt-1">এই expense record টি মুছে ফেলবেন? এটি আর ফেরত আনা
                                যাবে না।</p>
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
                    <div
                        className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            ✏️ Edit Expense
                        </h3>

                        {editError && (
                            <div
                                className="mb-3 p-2 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{editError}</div>
                        )}

                        <div className="space-y-3">
                            <div>
                                <label
                                    className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                                    value={editItem.title}
                                    onChange={e => setEditItem({...editItem, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Category</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm bg-white"
                                    value={editItem.category || ''}
                                    onChange={e => setEditItem({...editItem, category: e.target.value || null})}
                                >
                                    <option value="">-- No Category --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ✅ Edit Modal-এ Withdraw Checkbox */}
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                <input
                                    type="checkbox"
                                    checked={editItem.is_withdraw || false}
                                    onChange={e => setEditItem({...editItem, is_withdraw: e.target.checked})}
                                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                                />
                                <label className="text-sm font-medium text-amber-800">
                                    🏦 Withdraw?
                                    <span className="block text-xs text-amber-600 font-normal">
                                        চেক করলে এটি Expense হিসেবে গণ্য হবে না
                                    </span>
                                </label>
                            </div>

                            {/* Payment Channels Block */}
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Payment
                                    Channels</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Cash
                                            (৳)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border border-gray-200 p-1.5 rounded-lg text-xs bg-white focus:border-rose-500 outline-none font-mono"
                                            value={editItem.paid_cash || ''}
                                            onChange={e => setEditItem({...editItem, paid_cash: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Mobile
                                            (৳)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border border-gray-200 p-1.5 rounded-lg text-xs bg-white focus:border-rose-500 outline-none font-mono"
                                            value={editItem.paid_mobile || ''}
                                            onChange={e => setEditItem({...editItem, paid_mobile: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Bank
                                            (৳)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border border-gray-200 p-1.5 rounded-lg text-xs bg-white focus:border-rose-500 outline-none font-mono"
                                            value={editItem.paid_bank || ''}
                                            onChange={e => setEditItem({...editItem, paid_bank: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {parseFloat(editItem.paid_mobile || 0) > 0 && (
                                    <div
                                        className="p-2 bg-orange-50/70 rounded-xl border border-orange-100 animate-in fade-in duration-200">
                                        <label className="block text-[9px] uppercase font-black text-orange-850 mb-1">Mobile
                                            Operator *</label>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {['bkash', 'nagad', 'rocket', 'upay'].map(op => (
                                                <button
                                                    key={op}
                                                    type="button"
                                                    onClick={() => setEditItem({...editItem, mobile_operator: op})}
                                                    className={`py-1 rounded-lg text-[10px] font-bold border transition-all capitalize ${
                                                        editItem.mobile_operator === op
                                                            ? 'border-orange-500 bg-orange-100 text-orange-850 font-bold shadow-sm'
                                                            : 'border-gray-200 bg-white text-gray-600'
                                                    }`}
                                                >
                                                    {op}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div
                                    className="flex justify-between items-center text-xs font-bold border-t border-gray-200 pt-2">
                                    <span className="text-gray-500">Total Amount:</span>
                                    <span className="font-mono text-rose-600">
                                        ৳{(parseFloat(editItem.paid_cash || 0) + parseFloat(editItem.paid_mobile || 0) + parseFloat(editItem.paid_bank || 0)).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                                <textarea
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm resize-none"
                                    value={editItem.description || ''}
                                    onChange={e => setEditItem({...editItem, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => {
                                    setEditItem(null);
                                    setEditError('');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                disabled={editLoading}
                                className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 disabled:opacity-50 font-medium text-sm"
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

export default ExpenseList;