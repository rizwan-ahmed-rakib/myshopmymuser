// // TaxSettings.jsx - Tax Configuration

// import React, { useState, useEffect } from 'react';
// import api from '../../context_or_provider/pos/posApi';
// 

// const TaxSettings = () => {
//     const [taxes, setTaxes] = useState([]);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [editingTax, setEditingTax] = useState(null);
//     const [loading, setLoading] = useState(false);
    
//     const [formData, setFormData] = useState({
//         name: '',
//         rate: '',
//         type: 'percentage',
//         is_default: false,
//         description: ''
//     });

//     useEffect(() => {
//         fetchTaxes();
//     }, []);

//     const fetchTaxes = async () => {
//         try {
//             const response = await api.get(`/api/settings/taxes/`);
//             setTaxes(response.data || []);
//         } catch (error) {
//             console.error('Error fetching taxes:', error);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             if (editingTax) {
//                 await api.put(`/api/settings/taxes/${editingTax.id}/`, formData);
//             } else {
//                 await api.post(`/api/settings/taxes/`, formData);
//             }
            
//             fetchTaxes();
//             resetForm();
//             setShowAddModal(false);
//         } catch (error) {
//             console.error('Error saving tax:', error);
//             alert('Failed to save tax');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (tax) => {
//         setEditingTax(tax);
//         setFormData({
//             name: tax.name,
//             rate: tax.rate,
//             type: tax.type,
//             is_default: tax.is_default,
//             description: tax.description || ''
//         });
//         setShowAddModal(true);
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this tax?')) return;

//         try {
//             await api.delete(`/api/settings/taxes/${id}/`);
//             fetchTaxes();
//         } catch (error) {
//             console.error('Error deleting tax:', error);
//             alert('Failed to delete tax');
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             name: '',
//             rate: '',
//             type: 'percentage',
//             is_default: false,
//             description: ''
//         });
//         setEditingTax(null);
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-start">
//                 <div>
//                     <h2 className="text-xl font-bold text-gray-900 mb-2">Tax Settings</h2>
//                     <p className="text-gray-600 text-sm">Manage tax rates for your products and services</p>
//                 </div>
//                 <button
//                     onClick={() => setShowAddModal(true)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                 >
//                     + Add Tax
//                 </button>
//             </div>

//             {/* Tax List */}
//             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//                 <table className="w-full">
//                     <thead className="bg-gray-50 border-b">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tax Name</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rate</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
//                             <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                         {taxes.map((tax) => (
//                             <tr key={tax.id} className="hover:bg-gray-50">
//                                 <td className="px-6 py-4">
//                                     <div className="font-medium text-gray-900">{tax.name}</div>
//                                     {tax.description && (
//                                         <div className="text-sm text-gray-500">{tax.description}</div>
//                                     )}
//                                 </td>
//                                 <td className="px-6 py-4 text-gray-900 font-semibold">
//                                     {tax.rate}%
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <span className="capitalize text-gray-600">{tax.type}</span>
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     {tax.is_default ? (
//                                         <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                                             Default
//                                         </span>
//                                     ) : (
//                                         <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
//                                             Active
//                                         </span>
//                                     )}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <div className="flex justify-end gap-2">
//                                         <button
//                                             onClick={() => handleEdit(tax)}
//                                             className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(tax.id)}
//                                             className="text-red-600 hover:text-red-800 text-sm font-medium"
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                         {taxes.length === 0 && (
//                             <tr>
//                                 <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
//                                     No taxes configured. Click "Add Tax" to create one.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Add/Edit Modal */}
//             {showAddModal && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//                         <div className="border-b px-6 py-4">
//                             <h3 className="text-lg font-bold text-gray-900">
//                                 {editingTax ? 'Edit Tax' : 'Add New Tax'}
//                             </h3>
//                         </div>

//                         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Tax Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={formData.name}
//                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                     required
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="e.g., VAT, GST, Sales Tax"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Tax Rate (%) *
//                                 </label>
//                                 <input
//                                     type="number"
//                                     step="0.01"
//                                     value={formData.rate}
//                                     onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
//                                     required
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="15.00"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Type
//                                 </label>
//                                 <select
//                                     value={formData.type}
//                                     onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="percentage">Percentage</option>
//                                     <option value="fixed">Fixed Amount</option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Description
//                                 </label>
//                                 <textarea
//                                     value={formData.description}
//                                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                                     rows={3}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="Optional description"
//                                 />
//                             </div>

//                             <div className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     id="is_default"
//                                     checked={formData.is_default}
//                                     onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
//                                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                 />
//                                 <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
//                                     Set as default tax
//                                 </label>
//                             </div>

//                             <div className="flex justify-end gap-3 pt-4">
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setShowAddModal(false);
//                                         resetForm();
//                                     }}
//                                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                                 >
//                                     {loading ? 'Saving...' : editingTax ? 'Update' : 'Add Tax'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TaxSettings;














// TaxSettings.jsx - Tax Configuration

import React, { useState, useEffect } from 'react';
import api from '../../context_or_provider/pos/posApi';


const TaxSettings = () => {
    const [taxes, setTaxes] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTax, setEditingTax] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '', rate: '', type: 'percentage', is_default: false, description: ''
    });

    useEffect(() => { fetchTaxes(); }, []);

    const fetchTaxes = async () => {
        try {
            const response = await api.get(`/api/settings/taxes/`);
            setTaxes(response.data || []);
        } catch (error) { console.error('Error fetching taxes:', error); }
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
            fetchTaxes(); resetForm(); setShowAddModal(false);
        } catch (error) {
            console.error('Error saving tax:', error);
            alert('Failed to save tax');
        } finally { setLoading(false); }
    };

    const handleEdit = (tax) => {
        setEditingTax(tax);
        setFormData({ name: tax.name, rate: tax.rate, type: tax.type, is_default: tax.is_default, description: tax.description || '' });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tax?')) return;
        try {
            await api.delete(`/api/settings/taxes/${id}/`);
            fetchTaxes();
        } catch (error) { alert('Failed to delete tax'); }
    };

    const resetForm = () => {
        setFormData({ name: '', rate: '', type: 'percentage', is_default: false, description: '' });
        setEditingTax(null);
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-[16px] font-semibold text-slate-900">Tax Settings</h2>
                    <p className="text-[12px] text-slate-500 mt-0.5">Manage tax rates for your products and services</p>
                </div>
                <button onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white text-[12px] font-medium rounded-lg hover:bg-slate-700 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Tax
                </button>
            </div>

            {/* Tax Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            {['Tax Name', 'Rate', 'Type', 'Status', 'Actions'].map((h, i) => (
                                <th key={h} className={`px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide ${i === 4 ? 'text-right' : 'text-left'}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {taxes.map((tax) => (
                            <tr key={tax.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3.5">
                                    <p className="text-[13px] font-medium text-slate-800">{tax.name}</p>
                                    {tax.description && <p className="text-[11px] text-slate-400 mt-0.5">{tax.description}</p>}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="text-[13px] font-semibold text-slate-800">{tax.rate}%</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="text-[12px] capitalize text-slate-600">{tax.type}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    {tax.is_default ? (
                                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[11px] font-medium">Default</span>
                                    ) : (
                                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[11px] font-medium">Active</span>
                                    )}
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => handleEdit(tax)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                        </button>
                                        <button onClick={() => handleDelete(tax.id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {taxes.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-5 py-14 text-center">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
                                        <span className="text-[18px]">💰</span>
                                    </div>
                                    <p className="text-[13px] font-medium text-slate-600">No taxes configured</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Tax" to create one.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <span className="text-[14px]">💰</span>
                                </div>
                                <h3 className="text-[15px] font-semibold text-slate-800">{editingTax ? 'Edit Tax' : 'Add New Tax'}</h3>
                            </div>
                            <button onClick={() => { setShowAddModal(false); resetForm(); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {[
                                { label: 'Tax Name', key: 'name', type: 'text', placeholder: 'e.g., VAT, GST', required: true },
                                { label: 'Tax Rate (%)', key: 'rate', type: 'number', placeholder: '15.00', required: true },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                        {f.label} {f.required && <span className="text-rose-400">*</span>}
                                    </label>
                                    <input type={f.type} step={f.type === 'number' ? '0.01' : undefined}
                                        value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                                        required={f.required} placeholder={f.placeholder}
                                        className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400" />
                                </div>
                            ))}

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Type</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white text-slate-800">
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2} placeholder="Optional description"
                                    className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400 resize-none" />
                            </div>

                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" id="is_default" checked={formData.is_default}
                                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                    className="w-4 h-4 text-slate-800 border-slate-300 rounded" />
                                <span className="text-[13px] text-slate-700">Set as default tax</span>
                            </label>

                            <div className="flex gap-2.5 pt-2">
                                <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }}
                                    className="flex-1 py-2.5 text-[13px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-1 py-2.5 text-[13px] font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-60">
                                    {loading ? 'Saving...' : editingTax ? 'Update Tax' : 'Add Tax'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaxSettings;