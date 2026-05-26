import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UpdateEmployeeLeaveApplicationModal from "./UpdateEmployeeLeaveApplicationModal";
import UpdateEmployeeLeaveApplicationSuccessPopup from "./UpdateEmployeeLeaveApplicationSuccessPopup";
import { leaveApplicationAPI } from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";

const EmployeeLeaveApplicationCard = ({ advance, onEdit, onDelete }) => {

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
        navigate(`/hrm/leave-application/details/${advance.id}`);
    };

    const handleEdit = () => {
        setSelectedAdvance(advance);
        setShowEditModal(true);
        setShowDropdown(false);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete leave request of ${advance.user_name}?`)) return;

        setLoadingId(advance.id);
        try {
            await leaveApplicationAPI.delete(advance.id);
            setSuccessMessage("Deleted successfully");
            setShowSuccess(true);

            onDelete && onDelete();
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        } finally {
            setLoadingId(null);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm(`Approve leave of ${advance.user_name}?`)) return;

        setLoadingId(advance.id);
        try {
            await leaveApplicationAPI.approve(advance.id);
            setSuccessMessage("Approved successfully");
            setShowSuccess(true);

            onEdit && onEdit();
        } catch (error) {
            console.error(error);
            alert("Approve failed");
        } finally {
            setLoadingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString();
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow border p-4">

                {/* HEADER */}
                <div className="flex justify-between items-start mb-3">
                    
                    {/* STATUS */}
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                            advance.status === "approved" ? "bg-green-500" : "bg-yellow-500"
                        }`} />
                        <span className="text-xs capitalize">
                            {advance.status}
                        </span>
                    </div>

                    {/* DROPDOWN */}
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setShowDropdown(!showDropdown)}>
                            ⋮
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 bg-white border shadow rounded p-2 z-10 w-40">

                                <button onClick={handleEdit} className="block w-full text-left px-2 py-1 hover:bg-gray-100">
                                    Edit
                                </button>

                                {advance.status !== "approved" && (
                                    <button onClick={handleApprove} className="block w-full text-left px-2 py-1 text-green-600 hover:bg-gray-100">
                                        Approve
                                    </button>
                                )}

                                <button onClick={handleDelete} className="block w-full text-left px-2 py-1 text-red-600 hover:bg-gray-100">
                                    Delete
                                </button>

                                <button
                                    onClick={() => navigate(`/hrm/employee/profile/${advance.user}`)}
                                    className="block w-full text-left px-2 py-1 text-blue-600 hover:bg-gray-100"
                                >
                                    View Profile
                                </button>

                            </div>
                        )}
                    </div>
                </div>

                {/* USER */}
                <div className="text-center mb-3">
                    <img
                        src={advance.user_image || "https://via.placeholder.com/100"}
                        alt=""
                        className="w-16 h-16 rounded-full mx-auto object-cover"
                    />

                    <h3
                        onClick={handleUserClick}
                        className="font-semibold cursor-pointer hover:text-blue-600"
                    >
                        {advance.user_name}
                    </h3>

                    <p className="text-xs text-gray-500 capitalize">
                        {advance.user_designation}
                    </p>
                </div>

                {/* DETAILS */}
                <div className="text-sm space-y-1">

                    <p><b>Leave:</b> {advance.leave_type}</p>
                    <p><b>Start:</b> {advance.start_date}</p>
                    <p><b>End:</b> {advance.end_date}</p>
                    <p><b>Applied:</b> {formatDate(advance.applied_on)}</p>

                    <p>
                        <b>Status:</b>{" "}
                        <span className={advance.status === "approved" ? "text-green-600" : "text-yellow-600"}>
                            {advance.status}
                        </span>
                    </p>

                    <p><b>Approved By:</b> {advance.approved_by_name || "N/A"}</p>

                    <p><b>Reason:</b> {advance.reason}</p>

                </div>
            </div>

            {/* EDIT MODAL */}
            {showEditModal && selectedAdvance && (
                <UpdateEmployeeLeaveApplicationModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    advanceData={selectedAdvance}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSuccessMessage("Updated successfully");
                        setShowSuccess(true);
                        onEdit && onEdit();
                    }}
                />
            )}

            {/* SUCCESS POPUP */}
            {showSuccess && (
                <UpdateEmployeeLeaveApplicationSuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default EmployeeLeaveApplicationCard;