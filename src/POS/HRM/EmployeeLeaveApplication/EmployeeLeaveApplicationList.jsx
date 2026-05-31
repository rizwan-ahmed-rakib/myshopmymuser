import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Calendar, User, FileText, ShieldCheck } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import { leaveApplicationAPI } from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";
import UpdateEmployeeLeaveApplicationSuccessPopup from "./UpdateEmployeeLeaveApplicationSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import UpdateSalaryAdvanceModal from "./UpdateEmployeeLeaveApplicationModal";

/**
 * EmployeeLeaveApplicationList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Leave Applications.
 */
const EmployeeLeaveApplicationList = ({ advance, onEdit }) => {
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
        navigate(`/hrm/leave-application/details/${item.id}`);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete leave application for ${item.user_name}?`)) return;
        setLoadingId(item.id);
        try {
            await leaveApplicationAPI.delete(item.id);
            setSuccessMessage(`${item.user_name}'s application deleted successfully!`);
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
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{item.user_designation || "Staff"}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Leave Type",
            accessor: "leave_type",
            render: (item) => (
                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-bold capitalize">
                    {item.leave_type}
                </span>
            )
        },
        {
            header: "Duration",
            accessor: "start_date",
            render: (item) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-gray-700">{formatDate(item.start_date)}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">To: {formatDate(item.end_date)}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: "status",
            className: "text-center",
            render: (item) => (
                <StatusBadge 
                    type={item.status} 
                    label={item.status} 
                />
            )
        },
        {
            header: "Meta Details",
            accessor: "applied_on",
            hiddenMobile: true,
            render: (item) => (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        <Calendar size={10} /> Applied: {formatDate(item.applied_on)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        <ShieldCheck size={10} /> By: {item.approved_by_name || "Pending"}
                    </div>
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
                <UpdateEmployeeLeaveApplicationSuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default EmployeeLeaveApplicationList;
