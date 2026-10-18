// TaxSettings.jsx - Tax Configuration

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';   // ✅ Portal import
import api from '../../context_or_provider/pos/posApi';

const TaxSettings = () => {
    const [taxes, setTaxes] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTax, setEditingTax] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        rate: '',
        type: 'percentage',
        is_default: false,
        description: '',
    });

    useEffect(() => {
        fetchTaxes();
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && showAddModal) closeModal();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [showAddModal]);

    useEffect(() => {
        if (showAddModal) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
    }, [showAddModal]);

    const fetchTaxes = async () => {
        setFetching(true);
        try {
            const response = await api.get(`/api/settings/taxes/`);
            setTaxes(response.data || []);
        } catch (error) {
            console.error('Error fetching taxes:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingTax) {
                await api.put(`/api/settings/taxes/${editingTax.id}/`, formData);
            } else {
                await api.post(`/api/settings/taxes/`, formData);
            }
            fetchTaxes();
            closeModal();
        } catch (error) {
            console.error('Error saving tax:', error);
            alert('Failed to save tax');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tax) => {
        setEditingTax(tax);
        setFormData({
            name: tax.name,
            rate: tax.rate,
            type: tax.type,
            is_default: tax.is_default,
            description: tax.description || '',
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tax?')) return;
        try {
            await api.delete(`/api/settings/taxes/${id}/`);
            fetchTaxes();
        } catch (error) {
            alert('Failed to delete tax');
        }
    };

    const resetForm = useCallback(() => {
        setFormData({
            name: '',
            rate: '',
            type: 'percentage',
            is_default: false,
            description: '',
        });
        setEditingTax(null);
    }, []);

    const closeModal = () => {
        setShowAddModal(false);
        resetForm();
    };

    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const formatRate = (tax) => {
        if (tax.type === 'fixed') return `৳ ${tax.rate}`;
        return `${tax.rate}%`;
    };

    // ✅ Modal কে Portal দিয়ে render করা হচ্ছে
    const modalContent = showAddModal ? createPortal(
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) closeModal();
            }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col"
                style={{ maxHeight: 'calc(100vh - 2rem)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <span className="text-[14px]">💰</span>
                        </div>
                        <h3 className="text-[15px] font-semibold text-slate-800">
                            {editingTax ? 'Edit Tax' : 'Add New Tax'}
                        </h3>
                    </div>
                    <button
                        onClick={closeModal}
                        aria-label="Close"
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        {/* Tax Name */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Tax Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                                placeholder="e.g., VAT, GST"
                                className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400"
                            />
                        </div>

                        {/* Rate + Type */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                    Tax Rate <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.rate}
                                    onChange={(e) => handleChange('rate', e.target.value)}
                                    required
                                    placeholder="15.00"
                                    className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                    Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white text-slate-800"
                                >
                                    <option value="percentage">%</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={2}
                                placeholder="Optional description"
                                className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400 resize-none"
                            />
                        </div>

                        {/* Default */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={formData.is_default}
                                onChange={(e) => handleChange('is_default', e.target.checked)}
                                className="w-4 h-4 text-slate-800 border-slate-300 rounded focus:ring-slate-400"
                            />
                            <span className="text-[13px] text-slate-700">Set as default tax</span>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 py-2.5 text-[13px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 text-[13px] font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-60"
                        >
                            {loading ? 'Saving...' : editingTax ? 'Update Tax' : 'Add Tax'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body   // ✅ সরাসরি body-তে render
    ) : null;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
                <div>
                    <h2 className="text-[16px] font-semibold text-slate-900">Tax Settings</h2>
                    <p className="text-[12px] text-slate-500 mt-0.5">
                        Manage tax rates for your products and services
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white text-[12px] font-medium rounded-lg hover:bg-slate-700 transition-colors shrink-0"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Tax
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {['Tax Name', 'Rate', 'Type', 'Status', 'Actions'].map((h, i) => (
                                    <th
                                        key={h}
                                        className={`px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${
                                            i === 4 ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {fetching &&
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-5 py-4">
                                            <div className="h-3 w-28 bg-slate-200 rounded" />
                                            <div className="h-2 w-40 bg-slate-100 rounded mt-2" />
                                        </td>
                                        <td className="px-5 py-4"><div className="h-3 w-12 bg-slate-200 rounded" /></td>
                                        <td className="px-5 py-4"><div className="h-3 w-16 bg-slate-200 rounded" /></td>
                                        <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-200 rounded-full" /></td>
                                        <td className="px-5 py-4"><div className="h-3 w-16 bg-slate-200 rounded ml-auto" /></td>
                                    </tr>
                                ))}

                            {!fetching &&
                                taxes.map((tax) => (
                                    <tr key={tax.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="text-[13px] font-medium text-slate-800">{tax.name}</p>
                                            {tax.description && (
                                                <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[240px]">
                                                    {tax.description}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[13px] font-semibold text-slate-800">
                                                {formatRate(tax)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[12px] capitalize text-slate-600">{tax.type}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {tax.is_default ? (
                                                <span className="inline-flex px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[11px] font-medium">
                                                    Default
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[11px] font-medium">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(tax)}
                                                    aria-label="Edit tax"
                                                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tax.id)}
                                                    aria-label="Delete tax"
                                                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {!fetching && taxes.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-5 py-14 text-center">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                            <span className="text-[20px]">💰</span>
                                        </div>
                                        <p className="text-[13px] font-medium text-slate-600">No taxes configured</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                                            Add your first tax rate to get started
                                        </p>
                                        <button
                                            onClick={openAddModal}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 text-white text-[12px] font-medium rounded-lg hover:bg-slate-700 transition-colors"
                                        >
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            Add Tax
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ Modal Portal দিয়ে body-তে render হবে */}
            {modalContent}
        </div>
    );
};

export default TaxSettings;