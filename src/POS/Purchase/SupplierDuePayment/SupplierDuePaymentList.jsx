// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye, Edit, Trash2, Receipt, Calendar, User, Link as LinkIcon } from 'lucide-react';
// import BackboneTable from "../../components/BackboneTable";
// import StatusBadge from "../../components/StatusBadge";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
//
// /**
//  * SupplierDuePaymentList - Refactored to use BackboneTable and StatusBadge.
//  * Standardized list view for Supplier Due Payment records.
//  */
// const SupplierDuePaymentList = ({ payments, onEdit, onDelete }) => {
//     const navigate = useNavigate();
//     const [loadingId, setLoadingId] = useState(null);
//
//     const handleViewDetails = (item) => {
//         // navigate(`/purchase/supplier-due-payment/details/${item.id}`);
//         navigate(`/purchase/due-payment/details/${item.id}`);
//     };
//
//     const handleDelete = async (item) => {
//         if (!window.confirm(`Are you sure you want to delete payment #${item.invoice_no}?`)) return;
//         setLoadingId(item.id);
//         try {
//             await posDuePaymentAPI.delete(item.id);
//             if (onDelete) onDelete();
//         } catch (error) {
//             console.error(error);
//             alert("Failed to delete record.");
//         } finally {
//             setLoadingId(null);
//         }
//     };
//
//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//     };
//
//     const columns = [
//         {
//             header: "Payment Invoice",
//             accessor: "invoice_no",
//             render: (item) => (
//                 <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-full border-2 border-white shadow-xs overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
//                         {item.supplier_image ? (
//                             <img
//                                 src={item.supplier_image}
//                                 className="w-full h-full object-cover"
//                                 alt={item.supplier_image || "Customer"}
//                                 onError={(e) => {
//                                     // ইমেজ লোড হতে ব্যর্থ হলে হাইড হয়ে যাবে এবং ইউজার আইকন ব্যাকগ্রাউন্ডে শো করবে
//                                     e.target.style.display = 'none';
//                                 }}
//                             />
//                         ) : (
//                             <User size={18} className="text-gray-400" />
//                         )}
//                     </div>
//                     <div className="flex flex-col min-w-0">
//                         <span className="font-bold text-gray-900 truncate">#{item.invoice_no}</span>
//                         <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
//                             {item.payment_method?.replace('_', ' ')}
//                         </span>
//                     </div>
//                 </div>
//             )
//         },
//         {
//             header: "Supplier & Purchase",
//             accessor: "supplier_name",
//             render: (item) => (
//                 <div className="flex flex-col">
//                     <div className="flex items-center gap-1.5 text-gray-700 font-bold">
//                         <User size={12} className="text-gray-400" />
//                         <span className="text-xs truncate">{item.supplier_name}</span>
//                     </div>
//                     {item.purchase_invoice_no && (
//                         <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
//                             <LinkIcon size={10} />
//                             <span>Purchase: #{item.purchase_invoice_no}</span>
//                         </div>
//                     )}
//                 </div>
//             )
//         },
//         {
//             header: "Amount Paid",
//             accessor: "amount",
//             className: "text-right",
//             render: (item) => (
//                 <div className="flex flex-col items-end">
//                     <span className="font-black text-gray-900">৳{parseFloat(item.amount).toLocaleString()}</span>
//                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Settled</span>
//                 </div>
//             )
//         },
//         {
//             header: "Date",
//             accessor: "created_at",
//             render: (item) => (
//                 <div className="flex items-center gap-1.5 text-gray-700 font-bold">
//                     <Calendar size={12} className="text-gray-400" />
//                     <span className="text-xs">{formatDate(item.created_at)}</span>
//                 </div>
//             )
//         },
//         {
//             header: "Method",
//             accessor: "payment_method",
//             className: "text-center",
//             render: (item) => (
//                 <StatusBadge
//                     type={item.payment_method === 'cash' ? 'success' : item.payment_method === 'bank' ? 'info' : 'warning'}
//                     label={item.payment_method}
//                 />
//             )
//         },
//         {
//             header: "Actions",
//             accessor: "actions",
//             className: "text-right w-1 whitespace-nowrap",
//             render: (item) => (
//                 <div className="flex justify-end gap-1">
//                     <button onClick={() => handleViewDetails(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><Eye size={16} /></button>
//                     <button onClick={() => onEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
//                     <button onClick={() => handleDelete(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
//                         {loadingId === item.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
//                     </button>
//                 </div>
//             )
//         }
//     ];
//
//     return (
//         <BackboneTable
//             columns={columns}
//             data={payments}
//         />
//     );
// };
//
// export default SupplierDuePaymentList;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Receipt, Calendar, User, Link as LinkIcon, RefreshCcw } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";

const SupplierDuePaymentList = ({ payments, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = (item) => {
        navigate(`/purchase/due-payment/details/${item.id}`);
    };

    const handleDelete = async (item) => {
        const label = item.transaction_type === 'refund' ? 'refund' : 'payment';
        if (!window.confirm(`Are you sure you want to delete ${label} #${item.invoice_no}?`)) return;
        setLoadingId(item.id);
        try {
            await posDuePaymentAPI.delete(item.id);
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
            header: "Invoice",
            accessor: "invoice_no",
            render: (item) => {
                const isRefund = item.transaction_type === 'refund';
                return (
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full border-2 border-white shadow-xs overflow-hidden flex items-center justify-center shrink-0 ${
                            isRefund ? 'bg-blue-50' : 'bg-gray-100'
                        }`}>
                            {item.supplier_image ? (
                                <img src={item.supplier_image} className="w-full h-full object-cover" alt={item.supplier_name}
                                    onError={(e) => { e.target.style.display = 'none'; }} />
                            ) : (
                                <User size={18} className={isRefund ? 'text-blue-400' : 'text-gray-400'} />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-900 truncate">#{item.invoice_no}</span>
                            <span className={`text-[10px] uppercase font-black tracking-tighter flex items-center gap-1 ${
                                isRefund ? 'text-blue-600' : 'text-emerald-500'
                            }`}>
                                {isRefund ? <RefreshCcw size={9} /> : <Receipt size={9} />}
                                {isRefund ? 'REFUND' : 'PAYMENT'}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: "Supplier & Ref",
            accessor: "supplier_name",
            render: (item) => {
                const isRefund = item.transaction_type === 'refund';
                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                            <User size={12} className="text-gray-400" />
                            <span className="text-xs truncate">{item.supplier_name}</span>
                        </div>
                        {!isRefund && item.purchase_invoice_no && (
                            <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
                                <LinkIcon size={10} />
                                <span>Purchase: #{item.purchase_invoice_no}</span>
                            </div>
                        )}
                        {isRefund && (
                            <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
                                <RefreshCcw size={10} />
                                <span>Advance Settlement</span>
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Amount",
            accessor: "amount",
            className: "text-right",
            render: (item) => {
                const isRefund = item.transaction_type === 'refund';
                return (
                    <div className="flex flex-col items-end">
                        <span className={`font-black ${isRefund ? 'text-blue-700' : 'text-gray-900'}`}>
                            ৳{parseFloat(item.amount).toLocaleString()}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                            isRefund ? 'text-blue-500' : 'text-emerald-500'
                        }`}>
                            {isRefund ? 'Received' : 'Settled'}
                        </span>
                    </div>
                );
            }
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
            render: (item) => {
                const isRefund = item.transaction_type === 'refund';
                const badgeType = isRefund ? 'info'
                    : item.payment_method === 'cash' ? 'success'
                    : item.payment_method === 'bank' ? 'info' : 'warning';
                return <StatusBadge type={badgeType} label={item.payment_method} />;
            }
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => handleViewDetails(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={16} />
                    </button>
                    <button onClick={() => onEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                        {loadingId === item.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
                    </button>
                </div>
            )
        }
    ];

    return <BackboneTable columns={columns} data={payments} />;
};

export default SupplierDuePaymentList;