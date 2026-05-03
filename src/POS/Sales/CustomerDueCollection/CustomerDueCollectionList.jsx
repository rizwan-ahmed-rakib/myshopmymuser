import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { posDueCollectionAPI } from "../../../context_or_provider/pos/Sale/dueCollection/dueCollectionAPI";

const CustomerDueCollectionList = ({ collections, onEdit, onDelete }) => {
    const [loadingId, setLoadingId] = useState(null);

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete collection #${item.invoice_no}?`)) return;
        setLoadingId(item.id);
        try {
            await posDueCollectionAPI.delete(item.id);
            onDelete?.();
        } catch (error) {
            console.error(error);
            alert("Failed to delete record.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Invoice</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Customer</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Linked Sale</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Method</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {collections.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs">#{item.invoice_no}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900">{item.customer_name}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-gray-500 font-medium">
                                        {item.sale_invoice_no ? `#${item.sale_invoice_no}` : "—"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <p className="font-black text-gray-900 font-mono text-sm">৳{parseFloat(item.amount).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                        item.payment_method === 'cash' ? 'bg-green-100 text-green-700' :
                                        item.payment_method === 'bank' ? 'bg-blue-100 text-blue-700' :
                                        'bg-purple-100 text-purple-700'
                                    }`}>
                                        {item.payment_method}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(item)} disabled={loadingId === item.id} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                            {loadingId === item.id ? <LoadingSpinner size="xs" /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {collections.length === 0 && (
                    <div className="p-20 text-center text-gray-400 font-medium">No collection records found.</div>
                )}
            </div>
        </div>
    );
};

export default CustomerDueCollectionList;
