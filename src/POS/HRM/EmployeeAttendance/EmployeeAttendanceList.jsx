import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, MapPin, Clock } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import UpdateEmployeeAttendanceModal from "./UpdateEmployeeAttendanceModal";
import UpdateEmployeeAttendanceSuccessPopup from "./UpdateEmployeeAttendanceSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import { employeeAttendanceAPI } from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";

/**
 * EmployeeAttendanceList - Refactored to use BackboneTable and StatusBadge.
 * Extreme reduction in boilerplate while increasing UI fidelity.
 */
const EmployeeAttendanceList = ({ attendance, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // --- Actions ---
    const handleEdit = (item) => {
        setSelectedAttendance(item);
        setShowEditModal(true);
    };

    const handleViewDetails = (item) => {
        navigate(`/hrm/attendance/details/${item.id}`);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete attendance record for ${item.name}?`)) return;
        setLoadingId(item.id);
        try {
            await employeeAttendanceAPI.delete(item.id);
            setSuccessMessage(`Attendance deleted successfully!`);
            setShowSuccess(true);
            if (onDelete) onDelete();
        } catch (error) {
            console.error(error);
            alert("Failed to delete.");
        } finally {
            setLoadingId(null);
        }
    };

    // --- Helpers ---
    const formatWorkTime = (minutes) => {
        if (!minutes) return "0h 0m";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return "—";
        return new Date(dateTimeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // --- Table Configuration ---
    const columns = [
        {
            header: "Employee / Designation",
            accessor: "name",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {item.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">{item.name}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{item.user_designation || "Staff"}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Date",
            accessor: "date",
            render: (item) => (
                <span className="text-gray-600 font-bold">{new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            )
        },
        {
            header: "Status",
            accessor: "is_present",
            className: "text-center",
            render: (item) => (
                <StatusBadge 
                    type={item.is_present ? "present" : "absent"} 
                    label={item.is_present ? "Present" : "Absent"} 
                />
            )
        },
        {
            header: "Log Times",
            accessor: "check_in_time",
            hiddenMobile: true,
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <Clock size={12} /> {formatTime(item.check_in_time)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                        <Clock size={12} /> {formatTime(item.check_out_time)}
                    </div>
                </div>
            )
        },
        {
            header: "Work Hours",
            accessor: "daily_work_time",
            className: "text-center",
            render: (item) => (
                <span className={`px-2 py-1 rounded text-xs font-black ${item.daily_work_time >= 480 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {formatWorkTime(item.daily_work_time)}
                </span>
            )
        },
        {
            header: "Location",
            accessor: "check_in_time_location",
            hiddenMobile: true,
            className: "max-w-[150px]",
            render: (item) => (
                <div className="flex items-start gap-1 text-[10px] text-gray-400 italic">
                    <MapPin size={10} className="shrink-0 mt-0.5" />
                    <span className="truncate">{item.check_in_time_location || "No GPS Data"}</span>
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
                data={attendance} 
            />

            {/* Modals & Popups */}
            {showEditModal && selectedAttendance && (
                <UpdateEmployeeAttendanceModal
                    isOpen={showEditModal}
                    onClose={() => { setShowEditModal(false); setSelectedAttendance(null); }}
                    onSuccess={(data) => { setShowEditModal(false); setSuccessMessage("Updated successfully!"); setShowSuccess(true); onEdit(data); }}
                    advanceData={selectedAttendance}
                />
            )}

            {showSuccess && (
                <UpdateEmployeeAttendanceSuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default EmployeeAttendanceList;
