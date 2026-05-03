import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";

const SupplierDuePaymentCard = ({ item, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleViewDetails = () => {
        navigate(`/purchase/due-payment/details/${item.id}`);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete payment record #${item.invoice_no}?`)) return;
        setLoadingId(item.id);
        try {
            await posDuePaymentAPI.delete(item.id);
            onDelete?.();
        } catch (error) {
            console.error(error);
            alert("Failed to delete record.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div 
            onClick={handleViewDetails}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
        >
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        #{item.invoice_no}
                    </div>
                    
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                            className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
                        </button>
                        
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 z-20" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => { onEdit(item); setShowDropdown(false); }} className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Edit Record
                                </button>
                                <div className="border-t my-1"></div>
                                <button onClick={handleDelete} disabled={loadingId === item.id} className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete Record
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{item.supplier_name}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                    {item.purchase_invoice_no ? `Purchase: #${item.purchase_invoice_no}` : "General Due Payment"}
                </p>

                <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center shadow-inner">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase">Paid Amount</p>
                        <p className="text-xl font-black text-green-600 font-mono">৳{parseFloat(item.amount).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            item.payment_method === 'cash' ? 'bg-green-100 text-green-700' :
                            item.payment_method === 'bank' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                        }`}>
                            {item.payment_method}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    {item.transaction_id && <span className="truncate max-w-[100px]">TxID: {item.transaction_id}</span>}
                </div>
            </div>
        </div>
    );
};

export default SupplierDuePaymentCard;
