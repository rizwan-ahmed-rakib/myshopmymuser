import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Undo2, Calendar, User } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { posSaleReturnAPI } from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";

/**
 * SaleReturnList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Sale Return records.
 */
const SaleReturnList = ({ products, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = (item) => {
        navigate(`/sales/sale-return/details/${item.id}`);
    };

    const handleEdit = (item) => {
        if (onEdit) onEdit(item);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete return for invoice #${item.sale_invoice_no}?`)) return;
        setLoadingId(item.id);
        try {
            await posSaleReturnAPI.delete(item.id);
            if (onDelete) onDelete();
        } catch (error) {
            console.error(error);
            alert("Failed to delete sale return.");
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
            header: "Invoice & Customer",
            accessor: "sale_invoice_no",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                        <Undo2 size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">#{item.sale_invoice_no}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            <User size={10} />
                            <span className="truncate">{item.customer_name || "Walk-in Customer"}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Return Amount",
            accessor: "total_return_amount",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">৳{parseFloat(item.total_return_amount).toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Net Refund: ৳{parseFloat(item.net_return_amount).toLocaleString()}</span>
                </div>
            )
        },
        {
            header: "Refund Progress",
            accessor: "paid_amount",
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Paid Back:</span>
                        <span className="font-bold text-emerald-600 text-xs">৳{parseFloat(item.paid_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Pending:</span>
                        <span className="font-bold text-rose-600 text-xs">৳{parseFloat(item.due_amount).toLocaleString()}</span>
                    </div>
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

export default SaleReturnList;