import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Banknote, Calendar, User } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import { salaryPayslipAPI } from "../../../context_or_provider/pos/EmployeeSalaryPayslip/salary_payslipAPI";
import SuccessPopup from "../../components/SuccessPopup";
import LoadingSpinner from "../../components/LoadingSpinner";
import UpdateSalaryAdvanceModal from "./UpdateEmployeeSalaryPayslipModal";

/**
 * EmployeeSalaryPayslipList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Payslips.
 */
const EmployeeSalaryPayslipList = ({ advance, onEdit }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdvance, setSelectedAdvance] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // --- Actions ---
    const handleEdit = (item) => {
        setSelectedAdvance(item);
        setShowEditModal(true);
    };

    const handleViewDetails = (item) => {
        navigate(`/hrm/payslip/details/${item.id}`);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete this payslip?`)) return;
        setLoadingId(item.id);
        try {
            await salaryPayslipAPI.delete(item.id);
            setSuccessMessage(`Payslip deleted successfully!`);
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
    const getMonthName = (monthNumber) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[monthNumber - 1] || "N/A";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
                        <span className="font-bold text-gray-900 truncate">{item.user_name || "Unknown"}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{item.user_designation || "Staff"}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Salary Period",
            accessor: "month",
            render: (item) => (
                <div className="flex items-center gap-2 font-bold text-gray-700">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{getMonthName(item.month)} {item.year}</span>
                </div>
            )
        },
        {
            header: "Net Amount",
            accessor: "net_salary",
            className: "text-right",
            render: (item) => (
                <span className="font-black text-brand-primary text-sm">
                    ৳{parseFloat(item.net_salary).toLocaleString()}
                </span>
            )
        },
        {
            header: "Payment Details",
            accessor: "payment_method",
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <StatusBadge 
                        type={item.payment_method === 'cash' ? 'success' : item.payment_method === 'bank' ? 'info' : 'warning'} 
                        label={item.payment_method} 
                    />
                    <span className="text-[9px] font-bold text-gray-400 pl-1 uppercase tracking-tighter">
                        {formatDate(item.payment_date)}
                    </span>
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
                    onClose={() => { setShowEditModal(false); setSelectedAdvance(null); }}
                    onSuccess={(data) => { setShowEditModal(false); setSuccessMessage("Updated successfully!"); setShowSuccess(true); onEdit(data); }}
                    advanceData={selectedAdvance}
                />
            )}

            {showSuccess && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                    type="success"
                />
            )}
        </>
    );
};

export default EmployeeSalaryPayslipList;
