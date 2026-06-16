import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Receipt, Calendar, User, Link as LinkIcon } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { posDueCollectionAPI } from "../../../context_or_provider/pos/Sale/dueCollection/dueCollectionAPI";

/**
 * CustomerDueCollectionList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Customer Due Collection records.
 */
const CustomerDueCollectionList = ({ collections, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = (item) => {
        navigate(`/sales/customer-due-collection/details/${item.id}`);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete collection #${item.invoice_no}?`)) return;
        setLoadingId(item.id);
        try {
            await posDueCollectionAPI.delete(item.id);
            if (onDelete) onDelete();
        } catch (error) {
            console.error(error);
            alert("Failed to delete record.");
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
            header: "Collection Invoice",
            accessor: "invoice_no",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                        <Receipt size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">#{item.invoice_no}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
                            {item.payment_method?.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Customer & Sale",
            accessor: "customer_name",
            render: (item) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                        <User size={12} className="text-gray-400" />
                        <span className="text-xs truncate">{item.customer_name}</span>
                    </div>
                    {item.sale_invoice_no && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
                            <LinkIcon size={10} />
                            <span>Sale: #{item.sale_invoice_no}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: "Amount Collected",
            accessor: "amount",
            className: "text-right",
            render: (item) => (
                <div className="flex flex-col items-end">
                    <span className="font-black text-gray-900">৳{parseFloat(item.amount).toLocaleString()}</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Received</span>
                </div>
            )
        },
        {
            header: "Date",
            accessor: "created_at",
            render: (item) => (
                <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-xs">{formatDate(item.created_at)}</span>
                </div>
            )
        },
        {
            header: "Method",
            accessor: "payment_method",
            className: "text-center",
            render: (item) => (
                <StatusBadge 
                    type={item.payment_method === 'cash' ? 'success' : item.payment_method === 'bank' ? 'info' : 'warning'} 
                    label={item.payment_method} 
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
                    <button onClick={() => onEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
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
            data={collections} 
        />
    );
};

export default CustomerDueCollectionList;