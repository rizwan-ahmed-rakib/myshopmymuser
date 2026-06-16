import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Calendar, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import { leaveApplicationAPI } from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";
import SuccessPopup from "../../components/SuccessPopup";
import LoadingSpinner from "../../components/LoadingSpinner";
import UpdateEmployeeLeaveApplicationModal from "./UpdateEmployeeLeaveApplicationModal";

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

    const handleApprove = async (item) => {
        if (!window.confirm(`Approve leave for ${item.user_name}?`)) return;
        setLoadingId(item.id);
        try {
            await leaveApplicationAPI.approve(item.id);
            setSuccessMessage(`Application approved successfully!`);
            setShowSuccess(true);
            if (onEdit) onEdit();
        } catch (error) {
            console.error(error);
            alert("Failed to approve.");
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
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
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
            header: "Leave Type / Duration",
            accessor: "leave_type",
            render: (item) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-gray-700">{item.leave_type}</span>
                    <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">
                        {Math.ceil((new Date(item.end_date) - new Date(item.start_date)) / (1000 * 60 * 60 * 24)) + 1} Days
                    </span>
                </div>
            )
        },
        {
            header: "Period",
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
            render: (item) => {
                const isApproved = item.status === "approved" || item.is_approved;
                const isRejected = item.status === "rejected";
                const type = isApproved ? 'success' : isRejected ? 'danger' : 'warning';
                return <StatusBadge type={type} label={item.status || (isApproved ? 'Approved' : 'Pending')} />;
            }
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => handleViewDetails(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><Eye size={16} /></button>
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
                    {!(item.status === "approved" || item.is_approved) && (
                        <button onClick={() => handleApprove(item)} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                            {loadingId === item.id ? <LoadingSpinner size="xs" /> : <CheckCircle size={16} />}
                        </button>
                    )}
                    <button onClick={() => handleDelete(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
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
                <UpdateEmployeeLeaveApplicationModal
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
                />
            )}
        </>
    );
};

export default EmployeeLeaveApplicationList;
