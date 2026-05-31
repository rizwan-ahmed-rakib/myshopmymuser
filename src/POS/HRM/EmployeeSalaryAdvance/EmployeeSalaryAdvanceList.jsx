import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Calendar, User, Wallet, Info } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import { salaryAdvanceAPI } from "../../../context_or_provider/pos/EmployeeSalaryAdvance/salary_advanceAPI";
import UpdateEmployeeSalaryAdvanceSuccessPopup from "./UpdateEmployeeSalaryAdvanceSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import UpdateSalaryAdvanceModal from "./UpdateSalaryAdvanceModal";

/**
 * EmployeeSalaryAdvanceList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Salary Advances.
 */
const EmployeeSalaryAdvanceList = ({ advance, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdvance, setselectedAdvance] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // --- Actions ---
    const handleEdit = (item) => {
        setselectedAdvance(item);
        setShowEditModal(true);
    };

    const handleViewDetails = (item) => {
        navigate(`/hrm/advance/details/${item.id}`);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete advance for ${item.user_name}?`)) return;
        setLoadingId(item.id);
        try {
            await salaryAdvanceAPI.delete(item.id);
            setSuccessMessage(`${item.user_name} deleted successfully!`);
            setShowSuccess(true);
            if (onEdit) onEdit();
        } catch (error) {
            console.error(error);
            alert("Failed to delete.");
        } finally {
            setLoadingId(null);
        }
    };

    // --- Helpers ---
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString('en-GB', { 
            day: '2-digit', month: 'short', year: 'numeric' 
        });
    };

    // --- Table Configuration ---
    const columns = [
        {
            header: "Employee / Designation",
            accessor: "user_name",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        {item.user_image ? (
                            <img src={item.user_image} className="w-full h-full object-cover" alt="" />
                        ) : (
                            item.user_name?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">{item.user_name}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{item.user_designation || item.user_drsignation || "Staff"}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Advance Amount",
            accessor: "amount",
            className: "text-right",
            render: (item) => (
                <span className="font-black text-brand-primary text-sm">
                    ৳{parseFloat(item.amount).toLocaleString()}
                </span>
            )
        },
        {
            header: "Status / Method",
            accessor: "is_approved",
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <StatusBadge 
                        type={item.is_approved ? "approved" : "pending"} 
                        label={item.is_approved ? "Approved" : "Pending"} 
                    />
                    <span className="text-[9px] font-bold text-gray-400 pl-1 uppercase tracking-tighter">
                        Via: {item.payment_method || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: "Request Timeline",
            accessor: "request_date",
            hiddenMobile: true,
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <Calendar size={12} className="text-gray-400" /> {formatDate(item.request_date)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                         App: {item.approved_date ? formatDate(item.approved_date) : "TBD"}
                    </div>
                </div>
            )
        },
        {
            header: "Reason",
            accessor: "reason",
            hiddenMobile: true,
            className: "max-w-[120px]",
            render: (item) => (
                <div className="flex items-start gap-1 text-[10px] text-gray-400 italic">
                    <Info size={10} className="shrink-0 mt-0.5" />
                    <span className="truncate">{item.reason || "No reason provided"}</span>
                </div>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => handleViewDetails(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></button>
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        {loadingId === item.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <BackboneTable 
                columns={columns} 
                data={advance} 
            />

            {/* Modals & Popups */}
            {showEditModal && selectedAdvance && (
                <UpdateSalaryAdvanceModal
                    isOpen={showEditModal}
                    onClose={() => { setShowEditModal(false); setselectedAdvance(null); }}
                    onSuccess={(data) => { setShowEditModal(false); setSuccessMessage("Updated successfully!"); setShowSuccess(true); onEdit(data); }}
                    advanceData={selectedAdvance}
                />
            )}

            {showSuccess && (
                <UpdateEmployeeSalaryAdvanceSuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default EmployeeSalaryAdvanceList;
