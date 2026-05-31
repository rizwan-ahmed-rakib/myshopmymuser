import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Edit, Trash2, Eye, Calendar, User, HandCoins, Info} from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import {employeeLoanAPI} from "../../../context_or_provider/pos/EmployeeLoan/employee_loanAPI";
import UpdateEmployeeLoanSuccessPopup from "./UpdateEmployeeLoanSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import UpdateSalaryAdvanceModal from "./UpdateEmployeeLoanModal";

/**
 * EmployeeLoanList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Employee Loans.
 */
const EmployeeLoanList = ({advance, onEdit}) => {
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
        navigate(`/hrm/loan/details/${item.id}`);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete loan record for ${item.user_name}?`)) return;
        setLoadingId(item.id);
        try {
            await employeeLoanAPI.delete(item.id);
            setSuccessMessage(`${item.user_name}'s loan record deleted successfully!`);
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
                    <div
                        className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        {item.user_image ? (
                            <img src={item.user_image} className="w-full h-full object-cover" alt=""/>
                        ) : (
                            item.user_name?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">{item.user_name}</span>
                        <span
                            className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{item.user_designation || "Staff"}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Loan Details",
            accessor: "amount",
            render: (item) => (
                <div className="flex flex-col">
                    <span
                        className="font-black text-brand-primary text-sm">৳{parseFloat(item.amount).toLocaleString()}</span>
                    <span
                        className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">EMI: ৳{parseFloat(item.monthly_repayment_amount).toLocaleString()}</span>
                </div>
            )
        },
        {
            header: "Status / Method",
            accessor: "is_fully_paid",
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <StatusBadge
                        type={item.is_fully_paid ? "paid" : "warning"}
                        label={item.is_fully_paid ? "Paid" : "Active"}
                    />
                    <span className="text-[9px] font-bold text-gray-400 pl-1 uppercase tracking-tighter">
                        Via: {item.payment_method || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: "Loan Date",
            accessor: "loan_date",
            hiddenMobile: true,
            render: (item) => (
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                    <Calendar size={12} className="text-gray-400"/> {formatDate(item.loan_date)}
                </div>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => handleViewDetails(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye
                        size={16}/></button>
                    <button onClick={() => handleEdit(item)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Edit
                        size={16}/></button>
                    <button onClick={() => handleDelete(item)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        {loadingId === item.id ? <LoadingSpinner size="xs"/> : <Trash2 size={16}/>}
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            {/*<BackboneTable */}
            {/*    columns={columns} */}
            {/*    data={advance} */}
            {/*/>*/}

            <BackboneTable
                columns={columns}
                data={advance}
                // onRowClick={handleViewDetails}
            />

            {/* Modals & Popups */}
            {showEditModal && selectedAdvance && (
                <UpdateSalaryAdvanceModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedAdvance(null);
                    }}
                    onSuccess={(data) => {
                        setShowEditModal(false);
                        setSuccessMessage("Updated successfully!");
                        setShowSuccess(true);
                        onEdit(data);
                    }}
                    advanceData={selectedAdvance}
                />
            )}

            {showSuccess && (
                <UpdateEmployeeLoanSuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default EmployeeLoanList;
