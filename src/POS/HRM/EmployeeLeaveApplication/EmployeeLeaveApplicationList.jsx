
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateEmployeeLeaveApplicationSuccessPopup from "./UpdateEmployeeLeaveApplicationSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import UpdateSalaryAdvanceModal from "./UpdateEmployeeLeaveApplicationModal";
import { leaveApplicationAPI } from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";

const EmployeeLeaveApplicationList = ({ advance, onEdit }) => {
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
        navigate(`/hrm/leave-application/details/${item.id}`);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete ${item.user_name}?`)) return;

        setLoadingId(item.id);
        try {
            await leaveApplicationAPI.delete(item.id);
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
        setSuccessMessage("Leave updated successfully!");
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
                    <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
                        <div className="col-span-3">User / Designation</div>
                        <div className="col-span-2">Leave Type</div>
                        <div className="col-span-2">Start Date</div>
                        <div className="col-span-2">End Date</div>
                        <div className="col-span-1 text-center">Status</div>
                        <div className="col-span-1">Applied</div>
                        <div className="col-span-1">Approved By</div>
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
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {item.user_name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <div>
                                        <div className="font-semibold">{item.user_name}</div>
                                        <div className="text-xs text-gray-400">
                                            {item.user_designation || "Staff"}
                                        </div>
                                    </div>
                                </div>

                                {/* Leave Type */}
                                <div className="col-span-2 text-sm text-gray-600">
                                    {item.leave_type}
                                </div>

                                {/* Start Date */}
                                <div className="col-span-2 text-sm text-gray-600">
                                    {formatDate(item.start_date)}
                                </div>

                                {/* End Date */}
                                <div className="col-span-2 text-sm text-gray-600">
                                    {formatDate(item.end_date)}
                                </div>

                                {/* Status */}
                                <div className="col-span-1 flex justify-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            item.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                {/* Applied */}
                                <div className="col-span-1 text-sm text-gray-600">
                                    {formatDate(item.applied_on)}
                                </div>

                                {/* Approved By */}
                                <div className="col-span-1 text-sm text-gray-600">
                                    {item.approved_by_name || "N/A"}
                                </div>

                                {/* Actions */}
                                <div className="col-span-12 flex justify-end gap-3 mt-2">
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
                                    {/* Edit */}
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        Edit
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        {loadingId === item.id ? (
                                            <LoadingSpinner size="xs" />
                                        ) : (
                                            "Delete"
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Empty */}
                        {(!advance || advance.length === 0) && (
                            <div className="text-center py-20">
                                <p className="text-gray-500">No Leave Applications Found</p>
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
                <UpdateEmployeeLeaveApplicationSuccessPopup
                    message={successMessage}
                    subtitle="Success"
                    onClose={() => setShowSuccess(false)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default EmployeeLeaveApplicationList;