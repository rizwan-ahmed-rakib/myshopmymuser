import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ROLE_COLORS, ROLE_OPTIONS} from "./roles";
import UpdateEmployeeLoanSuccessPopup from "./UpdateEmployeeLoanSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import UpdateSalaryAdvanceModal from "./UpdateEmployeeLoanModal";
import {employeeLoanAPI} from "../../../context_or_provider/pos/EmployeeLoan/employee_loanAPI";

// const EmployeeSalaryAdvanceList = ({ advances, onUpdate}) => {
const EmployeeLoanList = ({advance, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdvance, setselectedAdvance] = useState(null);
    // const [selectedEmployee, setSelectedEmployee] = useState(null);
    // const [selectedAdvance, setSelectedAdvance] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleViewProfile = (advance) => {
        navigate(`/employee/profile/${advance.id}`);
    };

    const handleEdit = (advance) => {
        setselectedAdvance(advance);
        setShowEditModal(true);
    };

    const handleDelete = async (advance) => {
        if (!window.confirm(`Are you sure you want to delete ${advance.name}?`)) {
            return;
        }

        setLoadingId(advance.id);
        try {
            await employeeLoanAPI.delete(advance.id);
            setSuccessMessage(`${advance.name} deleted successfully!`);
            setShowSuccess(true);

            // Refresh employee list
            if (onEdit) {
                onEdit();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete employee.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        setSuccessMessage("Employee updated successfully!");
        setShowSuccess(true);

        // Refresh employee list
        if (onEdit) {
            onEdit(updatedData);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleLabel = (roleValue) => {
        const role = ROLE_OPTIONS.find(r => r.value === roleValue);
        return role ? role.label : roleValue;
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    {/*<div className="min-w-[1000px]">*/}
                        {/* Header */}
                        <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
                            <div className="col-span-3">User / Designation</div>
                            <div className="col-span-1">Amount</div>
                            <div className="col-span-2">Req. Date</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-2">App. Date</div>
                            <div className="col-span-1">Reason</div>
                            <div className="col-span-1 text-right">Actions</div>
                        </div>

                        {/* Body */}
                        <div className="divide-y divide-gray-100">
                            {advance?.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors">

                                    <div className="col-span-3 flex items-center gap-3">
                                        {item.user_image ? (
                                            <img 
                                                src={`${item.user_image}`} 
                                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                                alt=""
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/150?text=U';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {item.user_name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-gray-900 truncate">{item.user_name}</span>
                                            <span className="text-[10px] text-gray-400 uppercase font-medium truncate">
                                                {item.user_designation || item.user_drsignation || "Staff"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-span-1 font-bold text-gray-900">
                                        ৳{parseFloat(item.amount).toLocaleString()}
                                    </div>

                                    <div className="col-span-2 text-sm text-gray-600">
                                        {formatDate(item.request_date)}
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            item.is_approved
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                            {item.is_approved ? "Approved" : "Pending"}
                                        </span>
                                    </div>

                                    <div className="col-span-2 text-sm text-gray-600">
                                        {formatDate(item.approved_date)}
                                    </div>

                                    <div className="col-span-1 text-sm text-gray-500 truncate italic" title={item.reason}>
                                        {item.reason || "N/A"}
                                    </div>

                                    <div className="col-span-1 flex justify-end gap-3">
                                        {/* Edit */}
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            {loadingId === item.id ? (
                                                <LoadingSpinner size="xs"/>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {(!advance || advance.length === 0) && (
                                <div className="text-center py-20 bg-gray-50/50">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No Salary Advances Found</p>
                                </div>
                            )}
                        </div>
                    {/*</div>*/}
                </div>
            </div>


            {/* Edit Modal */}
            {showEditModal && selectedAdvance && (
                <UpdateSalaryAdvanceModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setselectedAdvance(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    advanceData={selectedAdvance}
                />
            )}

            {/* Success Popup */}
            {/*{showSuccess && (*/}
            {/*    <UpdateSuccessSalaryAdvancePopup*/}
            {/*        message={successMessage}*/}
            {/*        onClose={() => setShowSuccess(false)}*/}
            {/*        duration={3000}*/}
            {/*    />*/}
            {/*)}*/}

            {showSuccess && (
                <UpdateEmployeeLoanSuccessPopup
                    message={successMessage || "Advance updated"}
                    subtitle="Approved successfully"
                    onClose={() => setShowSuccess(false)}   // ✅ FIXED
                    duration={3000}
                />
            )}
        </>
    );
};

export default EmployeeLoanList;