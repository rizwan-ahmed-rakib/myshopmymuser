// // PaymentSettings.jsx - Payment Methods Configuration

// import React, { useState } from 'react';

// const PaymentSettings = () => {
//     const [paymentMethods, setPaymentMethods] = useState([
//         { id: 1, name: 'Cash', icon: '💵', enabled: true, isDefault: true },
//         { id: 2, name: 'Hand Cash', icon: '💰', enabled: true, isDefault: false },
//         { id: 3, name: 'bKash', icon: '📱', enabled: true, isDefault: false, account: '+880 1XXX-XXXXXX' },
//         { id: 4, name: 'Nagad', icon: '📲', enabled: true, isDefault: false, account: '+880 1XXX-XXXXXX' },
//         { id: 5, name: 'Card', icon: '💳', enabled: true, isDefault: false },
//         { id: 6, name: 'Bank Transfer', icon: '🏦', enabled: true, isDefault: false, account: 'ACC-XXXXXXXX' },
//         { id: 7, name: 'Due', icon: '⏰', enabled: true, isDefault: false },
//     ]);

//     const [editingMethod, setEditingMethod] = useState(null);
//     const [success, setSuccess] = useState(false);

//     const toggleMethod = (id) => {
//         setPaymentMethods(prev => prev.map(method => 
//             method.id === id ? { ...method, enabled: !method.enabled } : method
//         ));
//         showSuccess();
//     };

//     const setDefaultMethod = (id) => {
//         setPaymentMethods(prev => prev.map(method => ({
//             ...method,
//             isDefault: method.id === id
//         })));
//         showSuccess();
//     };

//     const handleEdit = (method) => {
//         setEditingMethod(method);
//     };

//     const handleSaveEdit = () => {
//         setPaymentMethods(prev => prev.map(method => 
//             method.id === editingMethod.id ? editingMethod : method
//         ));
//         setEditingMethod(null);
//         showSuccess();
//     };

//     const showSuccess = () => {
//         setSuccess(true);
//         setTimeout(() => setSuccess(false), 2000);
//     };

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Methods</h2>
//                 <p className="text-gray-600 text-sm">Configure available payment methods for transactions</p>
//             </div>

//             {success && (
//                 <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
//                     ✅ Payment settings updated successfully!
//                 </div>
//             )}

//             {/* Payment Methods List */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {paymentMethods.map((method) => (
//                     <div
//                         key={method.id}
//                         className={`bg-white border-2 rounded-xl p-4 transition-all ${
//                             method.enabled ? 'border-blue-200 hover:border-blue-400' : 'border-gray-200 opacity-60'
//                         }`}
//                     >
//                         <div className="flex items-start justify-between mb-3">
//                             <div className="flex items-center gap-3">
//                                 <span className="text-3xl">{method.icon}</span>
//                                 <div>
//                                     <h3 className="font-semibold text-gray-900">{method.name}</h3>
//                                     {method.account && (
//                                         <p className="text-xs text-gray-500 mt-0.5">{method.account}</p>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <label className="relative inline-flex items-center cursor-pointer">
//                                     <input
//                                         type="checkbox"
//                                         checked={method.enabled}
//                                         onChange={() => toggleMethod(method.id)}
//                                         className="sr-only peer"
//                                     />
//                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                 </label>
//                             </div>
//                         </div>

//                         {method.enabled && (
//                             <div className="space-y-2 pt-3 border-t">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-gray-600">Default Method</span>
//                                     <button
//                                         onClick={() => setDefaultMethod(method.id)}
//                                         className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
//                                             method.isDefault
//                                                 ? 'bg-green-100 text-green-700'
//                                                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                         }`}
//                                     >
//                                         {method.isDefault ? '✓ Default' : 'Set Default'}
//                                     </button>
//                                 </div>

//                                 {(method.name === 'bKash' || method.name === 'Nagad' || method.name === 'Bank Transfer') && (
//                                     <button
//                                         onClick={() => handleEdit(method)}
//                                         className="w-full px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
//                                     >
//                                         Configure Account
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             {/* Edit Modal */}
//             {editingMethod && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
//                         <div className="border-b px-6 py-4">
//                             <h3 className="text-lg font-bold text-gray-900">
//                                 Configure {editingMethod.name}
//                             </h3>
//                         </div>

//                         <div className="p-6 space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Account Number / Details
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={editingMethod.account || ''}
//                                     onChange={(e) => setEditingMethod({ ...editingMethod, account: e.target.value })}
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="Enter account details"
//                                 />
//                             </div>

//                             <div className="flex justify-end gap-3 pt-4">
//                                 <button
//                                     onClick={() => setEditingMethod(null)}
//                                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleSaveEdit}
//                                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Info Box */}
//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                 <div className="flex gap-3">
//                     <span className="text-blue-600 text-xl">ℹ️</span>
//                     <div className="text-sm text-blue-800">
//                         <p className="font-semibold mb-1">Payment Method Guidelines:</p>
//                         <ul className="list-disc list-inside space-y-1 text-blue-700">
//                             <li>Enable/disable methods using the toggle switches</li>
//                             <li>Set one method as default for quick access</li>
//                             <li>Configure account details for digital payment methods</li>
//                             <li>At least one payment method must be enabled</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PaymentSettings;
















// PaymentSettings.jsx - Payment Methods Configuration

import React, { useState } from 'react';

const PaymentSettings = () => {
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, name: 'Cash',          icon: '💵', enabled: true,  isDefault: true,  account: null },
        { id: 2, name: 'Hand Cash',     icon: '💰', enabled: true,  isDefault: false, account: null },
        { id: 3, name: 'bKash',         icon: '📱', enabled: true,  isDefault: false, account: '+880 1XXX-XXXXXX' },
        { id: 4, name: 'Nagad',         icon: '📲', enabled: true,  isDefault: false, account: '+880 1XXX-XXXXXX' },
        { id: 5, name: 'Card',          icon: '💳', enabled: true,  isDefault: false, account: null },
        { id: 6, name: 'Bank Transfer', icon: '🏦', enabled: true,  isDefault: false, account: 'ACC-XXXXXXXX' },
        { id: 7, name: 'Due',           icon: '⏰', enabled: true,  isDefault: false, account: null },
    ]);

    const [editingMethod, setEditingMethod] = useState(null);
    const [success, setSuccess] = useState(false);

    const toggleMethod = (id) => {
        setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
        showSuccess();
    };

    const setDefaultMethod = (id) => {
        setPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
        showSuccess();
    };

    const handleSaveEdit = () => {
        setPaymentMethods(prev => prev.map(m => m.id === editingMethod.id ? editingMethod : m));
        setEditingMethod(null);
        showSuccess();
    };

    const showSuccess = () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    const hasConfigurable = (name) => ['bKash', 'Nagad', 'Bank Transfer'].includes(name);

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-[16px] font-semibold text-slate-900">Payment Methods</h2>
                <p className="text-[12px] text-slate-500 mt-0.5">Configure available payment methods for transactions</p>
            </div>

            {success && (
                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-[13px] font-medium">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Payment settings updated!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                    <div key={method.id}
                        className={`bg-white border rounded-xl p-4 transition-all ${method.enabled ? 'border-slate-200 hover:border-slate-300' : 'border-slate-100 opacity-55'}`}>

                        {/* Top row */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[20px]">
                                    {method.icon}
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-slate-800">{method.name}</p>
                                    {method.account && <p className="text-[11px] text-slate-400">{method.account}</p>}
                                </div>
                            </div>

                            {/* Toggle */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={method.enabled} onChange={() => toggleMethod(method.id)} className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-800"></div>
                            </label>
                        </div>

                        {/* Bottom row - only when enabled */}
                        {method.enabled && (
                            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                <button onClick={() => setDefaultMethod(method.id)}
                                    className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                                        method.isDefault ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                                    }`}>
                                    {method.isDefault ? '✓ Default' : 'Set Default'}
                                </button>

                                {hasConfigurable(method.name) && (
                                    <button onClick={() => setEditingMethod(method)}
                                        className="flex-1 py-1.5 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-100 transition-colors">
                                        Configure
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                <span className="text-blue-500 text-[16px] shrink-0 mt-0.5">ℹ️</span>
                <div>
                    <p className="text-[12px] font-semibold text-blue-700 mb-1">Payment Method Guidelines</p>
                    <ul className="text-[11px] text-blue-600 space-y-0.5 list-disc list-inside">
                        <li>Enable/disable methods using the toggle switches</li>
                        <li>Set one method as default for quick access</li>
                        <li>Configure account details for digital payment methods</li>
                        <li>At least one payment method must be enabled</li>
                    </ul>
                </div>
            </div>

            {/* Configure Modal */}
            {editingMethod && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <span className="text-[18px]">{editingMethod.icon}</span>
                                <h3 className="text-[15px] font-semibold text-slate-800">Configure {editingMethod.name}</h3>
                            </div>
                            <button onClick={() => setEditingMethod(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Account Number / Details</label>
                                <input type="text" value={editingMethod.account || ''}
                                    onChange={(e) => setEditingMethod({ ...editingMethod, account: e.target.value })}
                                    placeholder="Enter account details"
                                    className="w-full px-3.5 py-2.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400" />
                            </div>
                            <div className="flex gap-2.5 pt-2">
                                <button onClick={() => setEditingMethod(null)}
                                    className="flex-1 py-2.5 text-[13px] font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSaveEdit}
                                    className="flex-1 py-2.5 text-[13px] font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentSettings;