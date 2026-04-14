


import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import UpdateSalaryAdvanceModal from "./UpdateSalaryAdvanceModal";
// import SuccessSalaryAdvancePopup from "./SuccessSalaryAdvancePopup";
import {salaryAdvanceAPI} from "../../../context_or_provider/pos/EmployeeSalaryAdvance/salary_advanceAPI";
import UpdateEmployeeSalaryAdvanceSuccessPopup from "./UpdateEmployeeSalaryAdvanceSuccessPopup";
// import { salaryAdvanceAPI } from "../../../utils/api";

const EmployeeSalaryAdvanceCard = ({advance, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [selectedAdvance, setSelectedAdvance] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
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

    const handleUserClick = () => {
        navigate(`/employee/profile/${advance.user}`);
    };

    const handleEdit = (advance) => {
        setSelectedAdvance(advance);
        setShowEditModal(true);
        setShowDropdown(false);
    };

    const handleDelete = async (advance) => {
        if (!window.confirm(`Are you sure you want to delete salary advance of $${advance.amount} for ${advance.user_name}?`)) {
            return;
        }

        setLoadingId(advance.id);
        try {
            await salaryAdvanceAPI.delete(advance.id);
            setSuccessMessage(`Salary advance of $${advance.amount} deleted successfully!`);
            setShowSuccess(true);

            // Refresh the list
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete salary advance.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        setSuccessMessage("Salary advance updated successfully!");
        setShowSuccess(true);

        // Refresh the list
        if (onEdit) {
            onEdit(updatedData);
        }
    };

    const handleApprove = async (advance) => {
        if (!window.confirm(`Approve salary advance of $${advance.amount} for ${advance.user_name}?`)) {
            return;
        }

        setLoadingId(advance.id);
        try {
            await salaryAdvanceAPI.approve(advance.id);
            setSuccessMessage(`Salary advance of $${advance.amount} approved successfully!`);
            setShowSuccess(true);

            // Refresh the list
            if (onEdit) {
                onEdit();
            }
        } catch (error) {
            console.error("Approve error:", error);
            alert("Failed to approve salary advance.");
        } finally {
            setLoadingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <>
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
                <div className="p-4">
                    {/* Card Header with Actions */}
                    <div className="flex justify-between items-start mb-4">
                        {/* Status Badge */}
                        <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                advance.is_approved ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></span>
                            <span className="text-xs text-gray-500">
                                {advance.is_approved ? 'Approved' : 'Pending'}
                            </span>
                        </div>

                        {/* Actions Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                                </svg>
                            </button>

                            {showDropdown && (
                                <div
                                    className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                    <button
                                        onClick={() => handleEdit(advance)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        disabled={loadingId === advance.id}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                        Edit
                                    </button>

                                    {!advance.is_approved && (
                                        <button
                                            onClick={() => handleApprove(advance)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-50"
                                            disabled={loadingId === advance.id}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M5 13l4 4L19 7"/>
                                            </svg>
                                            Approve
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(advance)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                        disabled={loadingId === advance.id}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                        Delete
                                    </button>

                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={() => navigate(`/employee/profile/${advance.user}`)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                        View Employee
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Employee Info */}
                    <div className="text-center mb-4">
                        <div
                            onClick={handleUserClick}
                            className="cursor-pointer inline-block"
                        >
                            {advance.user_image ? (
                                <div className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-2 border-white overflow-hidden bg-gray-100">
                                    <img 
                                        src={`${advance.user_image}`} 
                                        alt={advance.user_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150?text=User';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div
                                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold mb-2 shadow-md">
                                    {advance.user_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="text-center mb-3">
                            <h3
                                onClick={handleUserClick}
                                className="font-semibold text-gray-900 mb-0.5 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                                {advance.user_name || `User ${advance.user}`}
                            </h3>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                {advance.user_designation || advance.user_drsignation || "Staff"}
                            </p>
                        </div>
                    </div>

                    {/* Advance Details */}
                    <div className="space-y-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-600 mb-1">Amount</div>
                            <div className="text-2xl font-bold text-blue-600">
                                ${parseFloat(advance.amount).toLocaleString()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center">
                                <div className="text-xs text-gray-600 mb-1">Request Date</div>
                                <div className="text-sm font-medium text-gray-900">
                                    {formatDate(advance.request_date)}
                                </div>
                            </div>
                            {advance.is_approved && (
                                <div className="text-center">
                                    <div className="text-xs text-gray-600 mb-1">Approved Date</div>
                                    <div className="text-sm font-medium text-green-600">
                                        {formatDate(advance.approved_date)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {advance.reason && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-xs text-gray-600 mb-1">Reason</div>
                                <div className="text-sm text-gray-700 break-words">
                                    {advance.reason}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Stats */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center">
                                <div className="text-xs text-gray-600 mb-1">Status</div>
                                <div className={`text-sm font-medium ${
                                    advance.is_approved ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                    {advance.is_approved ? '✓ Approved' : '⏳ Pending'}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-gray-600 mb-1">User ID</div>
                                <div className="text-sm font-medium text-gray-900">
                                    #{advance.user}
                                </div>
                            </div>
                        </div>
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
            {/*{showSuccess && (*/}
            {/*    <UpdateSuccessSalaryAdvancePopup*/}
            {/*        message={successMessage}*/}
            {/*        onClose={() => setShowSuccess(false)}*/}
            {/*        duration={3000}*/}
            {/*    />*/}
            {/*)}*/}


            {showSuccess && (
                <UpdateEmployeeSalaryAdvanceSuccessPopup
                    message={successMessage || "Advance updated"}
                    subtitle="Approved successfully"
                    onClose={() => setShowSuccess(false)}   // ✅ FIXED
                    duration={3000}
                />
            )}
        </>
    );
};

export default EmployeeSalaryAdvanceCard;