import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import UpdateSuccessSalaryAdvancePopup from "./UpdateEmployeeSalaryAdvanceSuccessPopup";
import UpdateEmployeeSalaryAdvanceModal from "./UpdateSalaryAdvanceModal";
import { salaryAdvanceAPI } from "../../../context_or_provider/pos/profile/profileupdate";

const EmployeeSalaryAdvanceList = ({ advance, onEdit }) => {
    const [loadingId, setLoadingId] = useState(null);
    const [selectedAdvance, setSelectedAdvance] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const handleEdit = (advance) => {
        setSelectedAdvance(advance);
        setShowEditModal(true);
    };

    const handleDelete = async (advance) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        setLoadingId(advance.id);
        try {
            await salaryAdvanceAPI.delete(advance.id);

            setSuccessMessage("Deleted successfully!");
            setShowSuccess(true);

            onEdit && onEdit();
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                {/* Header */}
                <div className="grid grid-cols-12 px-6 py-4 bg-gray-100 text-sm font-semibold">
                    <div className="col-span-2">User</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Request Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Approved Date</div>
                    <div className="col-span-1">Reason</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Body */}
                <div className="divide-y">
                    {advance?.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 px-6 py-4 items-center">

                            <div className="col-span-2">{item.user_name}</div>

                            <div className="col-span-2 font-medium text-green-600">
                                ৳ {item.amount}
                            </div>

                            <div className="col-span-2">
                                {formatDate(item.request_date)}
                            </div>

                            <div className="col-span-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    item.is_approved
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}>
                                    {item.is_approved ? "Approved" : "Pending"}
                                </span>
                            </div>

                            <div className="col-span-2">
                                {formatDate(item.approved_date)}
                            </div>

                            <div className="col-span-1 truncate">
                                {item.reason || "N/A"}
                            </div>

                            <div className="col-span-1 flex justify-end gap-2">
                                {/* Edit */}
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-green-600"
                                >
                                    Edit
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="text-red-600"
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

                    {(!advance || advance.length === 0) && (
                        <div className="text-center py-10 text-gray-500">
                            No Salary Advances Found
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedAdvance && (
                <UpdateEmployeeSalaryAdvanceModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    data={selectedAdvance}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSuccessMessage("Updated successfully!");
                        setShowSuccess(true);
                        onEdit && onEdit();
                    }}
                />
            )}

            {/* Success */}
            {showSuccess && (
                <UpdateSuccessSalaryAdvancePopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default EmployeeSalaryAdvanceList;