import React, {useState} from "react";
import UpdateEmployeeLoanSuccessPopup from "./UpdateEmployeeLoanSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import UpdateSalaryAdvanceModal from "./UpdateEmployeeLoanModal";
import {employeeLoanAPI} from "../../../context_or_provider/pos/EmployeeLoan/employee_loanAPI";
import {useNavigate} from "react-router-dom";

const EmployeeLoanList = ({advance, onEdit}) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdvance, setSelectedAdvance] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleEdit = (item) => {
        setSelectedAdvance(item);
        setShowEditModal(true);
    };
    const handleViewDetails = (item) => {
        navigate(`/hrm/loan/details/${item.id}`);
    };
    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete ${item.user_name}?`)) return;

        setLoadingId(item.id);
        try {
            await employeeLoanAPI.delete(item.id);
            setSuccessMessage(`${item.user_name} deleted successfully!`);
            setShowSuccess(true);

            if (onEdit) onEdit();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        setSuccessMessage("Loan updated successfully!");
        setShowSuccess(true);

        if (onEdit) onEdit(updatedData);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">

                    {/* Header */}
                    <div
                        className="grid grid-cols-12 px-6 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
                        <div className="col-span-3">User / Designation</div>
                        <div className="col-span-1">Amount</div>
                        <div className="col-span-2">Payment</div>
                        <div className="col-span-2">Loan Date</div>
                        <div className="col-span-2">Monthly</div>
                        <div className="col-span-1 text-center">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Body */}
                    <div className="divide-y divide-gray-100">
                        {advance?.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50">

                                {/* User */}
                                <div className="col-span-3 flex items-center gap-3">
                                    {item.user_image ? (
                                        <img
                                            src={item.user_image}
                                            className="w-10 h-10 rounded-full object-cover border"
                                            alt=""
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/150?text=U";
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {item.user_name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <div>
                                        <div className="font-semibold text-sm truncate">{item.user_name}</div>
                                        <div className="text-[10px] text-gray-400 uppercase">
                                            {item.user_designation || "Staff"}
                                        </div>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="col-span-1 font-bold text-gray-900 text-sm">
                                    ৳{parseFloat(item.amount).toLocaleString()}
                                </div>

                                {/* Payment Method */}
                                <div className="col-span-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        item.payment_method === 'cash' ? 'bg-green-50 text-green-600' :
                                            item.payment_method === 'bank' ? 'bg-blue-50 text-blue-600' :
                                                item.payment_method === 'hybrid' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                        {item.payment_method || 'N/A'}
                                    </span>
                                </div>

                                {/* Loan Date */}
                                <div className="col-span-2 text-xs text-gray-600">
                                    {formatDate(item.loan_date)}
                                </div>

                                {/* Monthly Amount */}
                                <div className="col-span-2 text-sm text-gray-700 font-medium">
                                    ৳{parseFloat(item.monthly_repayment_amount).toLocaleString()}
                                </div>

                                {/* Status */}
                                <div className="col-span-1 flex justify-center">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            item.is_fully_paid
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {item.is_fully_paid ? "Paid" : "Active"}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex justify-end gap-2">

                                    {/* View Button */}
                                    <button
                                        onClick={() => handleViewDetails(item)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Profile"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete"
                                    >
                                        {loadingId === item.id ? (
                                            <LoadingSpinner size="xs"/>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Empty */}
                        {(!advance || advance.length === 0) && (
                            <div className="text-center py-20">
                                <p className="text-gray-500">No Loan Records Found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedAdvance && (
                <UpdateSalaryAdvanceModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedAdvance(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    advanceData={selectedAdvance}
                />
            )}

            {/* Success Popup */}
            {showSuccess && (
                <UpdateEmployeeLoanSuccessPopup
                    message={successMessage}
                    subtitle="Success"
                    onClose={() => setShowSuccess(false)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default EmployeeLoanList;