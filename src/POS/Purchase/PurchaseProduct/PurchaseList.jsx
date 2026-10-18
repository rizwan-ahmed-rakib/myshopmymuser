import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Eye, Edit, Trash2, Receipt, Calendar, CreditCard, User} from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";

/**
 * PurchaseList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Purchase records.
 */
const PurchaseList = ({ products, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = (item) => {
        navigate(`/purchase/purchase/details/${item.id}`);
    };

    const handleEdit = (item) => {
        if (onEdit) onEdit(item);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete Invoice #${item.invoice_no}?`)) return;
        setLoadingId(item.id);
        try {
            await posPurchaseProductAPI.delete(item.id);
            if (onDelete) onDelete();
        } catch (error) {
            console.error(error);
            alert("Failed to delete purchase.");
        } finally {
            setLoadingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const columns = [
        {
            header: "Invoice & Method",
            accessor: "invoice_no",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-white shadow-xs overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                        {item.supplier_image ? (
                            <img
                                src={item.supplier_image}
                                className="w-full h-full object-cover"
                                alt={item.supplier_image || "Customer"}
                                onError={(e) => {
                                    // ইমেজ লোড হতে ব্যর্থ হলে হাইড হয়ে যাবে এবং ইউজার আইকন ব্যাকগ্রাউন্ডে শো করবে
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <User size={18} className="text-gray-400" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">{item.invoice_no}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
                            {item.payment_method?.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Date & Supplier",
            accessor: "created_at",
            render: (item) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs">{formatDate(item.created_at)}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium truncate uppercase tracking-tighter">
                        {item.supplier_name || "Unknown Supplier"}
                    </span>
                </div>
            )
        },
        {
            header: "Financials",
            accessor: "net_total",
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total:</span>
                        <span className="font-black text-gray-900">৳{parseFloat(item.net_total).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Paid:</span>
                        <span className="font-bold text-emerald-600 text-xs">৳{parseFloat(item.paid_amount).toLocaleString()}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Due Amount",
            accessor: "due_amount",
            className: "text-right",
            render: (item) => (
                <div className="flex flex-col items-end">
                    <span className={`font-black text-sm ${parseFloat(item.due_amount) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        ৳{parseFloat(item.due_amount).toLocaleString()}
                    </span>
                    {parseFloat(item.due_amount) > 0 && (
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest animate-pulse">Outstanding</span>
                    )}
                </div>
            )
        },
        {
            header: "Status",
            accessor: "payment_status",
            className: "text-center",
            render: (item) => (
                <StatusBadge 
                    type={item.payment_status} 
                    label={item.payment_status} 
                />
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => handleViewDetails(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><Eye size={16} /></button>
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                        {loadingId === item.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <BackboneTable 
            columns={columns} 
            data={products} 
        />
    );
};

export default PurchaseList;