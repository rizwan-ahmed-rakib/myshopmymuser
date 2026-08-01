import React, { useState, useEffect } from 'react';
import { posCashboxAPI } from '../../context_or_provider/pos/cashbox/cashboxAPI';

const ExpenseCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Add form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');

    // Edit state
    const [editItem, setEditItem] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    // Delete state
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await posCashboxAPI.getAllExpenseCategories();
            setCategories(res.data);
        } catch (err) {
            setError('Categories লোড করতে সমস্যা হয়েছে।');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) { setAddError('Category নাম দিন।'); return; }
        setAddLoading(true);
        setAddError('');
        try {
            await posCashboxAPI.createExpenseCategory({ name: newName.trim(), description: newDesc.trim() || null });
            setNewName('');
            setNewDesc('');
            setShowAddForm(false);
            fetchCategories();
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.name) {
                setAddError(`Name: ${Array.isArray(errData.name) ? errData.name.join(', ') : errData.name}`);
            } else {
                setAddError('Category যোগ করতে সমস্যা হয়েছে।');
            }
        } finally {
            setAddLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!editItem || !editItem.name.trim()) { setEditError('নাম দিন।'); return; }
        setEditLoading(true);
        setEditError('');
        try {
            await posCashboxAPI.updateExpenseCategory(editItem.id, {
                name: editItem.name.trim(),
                description: editItem.description?.trim() || null,
            });
            setEditItem(null);
            fetchCategories();
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.name) {
                setEditError(`Name: ${Array.isArray(errData.name) ? errData.name.join(', ') : errData.name}`);
            } else {
                setEditError('Update করতে সমস্যা হয়েছে।');
            }
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await posCashboxAPI.deleteExpenseCategory(deleteId);
            setDeleteId(null);
            fetchCategories();
        } catch (err) {
            alert('Delete করতে সমস্যা হয়েছে।');
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Expense Categories</h2>
                    <p className="text-sm text-gray-500">খরচের category পরিচালনা করুন</p>
                </div>
                <button
                    onClick={() => { setShowAddForm(!showAddForm); setAddError(''); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        showAddForm
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-rose-500 text-white shadow-md shadow-rose-200 hover:bg-rose-600'
                    }`}
                >
                    {showAddForm ? '✕ Cancel' : '➕ Add Category'}
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">নতুন Category যোগ করুন</h3>
                    {addError && (
                        <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">{addError}</div>
                    )}
                    <form onSubmit={handleAdd} className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="যেমন: দোকান ভাড়া, ইউটিলিটি বিল, যাতায়াত খরচ..."
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                Description <span className="text-gray-400">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={newDesc}
                                onChange={e => setNewDesc(e.target.value)}
                                placeholder="সংক্ষিপ্ত বিবরণ..."
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={addLoading}
                            className="w-full py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 disabled:opacity-50 transition-all"
                        >
                            {addLoading ? 'Adding...' : '➕ Add Category'}
                        </button>
                    </form>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">{error}</div>
            )}

            {/* Category List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="text-5xl mb-3">🏷️</div>
                    <p className="text-gray-500 font-medium">No categories yet</p>
                    <p className="text-gray-400 text-sm mt-1">উপরে "Add Category" বাটন চাপুন</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {categories.map((cat, idx) => (
                        <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:border-rose-200 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm shrink-0">
                                {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
                                {cat.description && (
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{cat.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => setEditItem({ ...cat })}
                                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => setDeleteId(cat.id)}
                                    className="px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">✏️ Edit Category</h3>
                        {editError && (
                            <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-lg text-sm">{editError}</div>
                        )}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    value={editItem.name}
                                    onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    value={editItem.description || ''}
                                    onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => { setEditItem(null); setEditError(''); }}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                disabled={editLoading}
                                className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 disabled:opacity-50"
                            >
                                {editLoading ? 'Saving...' : '✓ Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
                        <div className="text-center mb-4">
                            <div className="text-3xl mb-2">⚠️</div>
                            <h3 className="font-semibold text-gray-800">Delete Category?</h3>
                            <p className="text-gray-500 text-sm mt-1">এই category মুছে গেলে সংশ্লিষ্ট expense records এর category blank হয়ে যাবে।</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseCategory;
