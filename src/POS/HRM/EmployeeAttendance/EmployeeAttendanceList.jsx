// import React, {useState} from "react";
// import {useNavigate} from "react-router-dom";
// import {ROLE_COLORS, ROLE_OPTIONS} from "./roles";
// import UpdateEmployeeAttendanceSuccessPopup from "./UpdateEmployeeAttendanceSuccessPopup";
// import LoadingSpinner from "./LoadingSpinner";
// import UpdateSalaryAdvanceModal from "./UpdateEmployeeAttendanceModal";
// import {employeeAttendanceAPI} from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
//
// // const EmployeeSalaryAdvanceList = ({ advances, onUpdate}) => {
// const EmployeeAttendanceList = ({attendance, onEdit, onDelete}) => {
//     const navigate = useNavigate();
//     const [loadingId, setLoadingId] = useState(null);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [selectedAdvance, setselectedAdvance] = useState(null);
//     // const [selectedEmployee, setSelectedEmployee] = useState(null);
//     // const [selectedAdvance, setSelectedAdvance] = useState(null);
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//     const [showSuccess, setShowSuccess] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");
//
//     const handleViewProfile = (advance) => {
//         navigate(`/employee/profile/${advance.id}`);
//     };
//
//     const handleEdit = (advance) => {
//         setselectedAdvance(advance);
//         setShowEditModal(true);
//     };
//
//     const handleDelete = async (advance) => {
//         if (!window.confirm(`Are you sure you want to delete ${advance.name}?`)) {
//             return;
//         }
//
//         setLoadingId(advance.id);
//         try {
//             await employeeAttendanceAPI.delete(advance.id);
//             setSuccessMessage(`${advance.name} deleted successfully!`);
//             setShowSuccess(true);
//
//             // Refresh employee list
//             if (onEdit) {
//                 onEdit();
//             }
//         } catch (error) {
//             console.error("Delete error:", error);
//             alert("Failed to delete employee.");
//         } finally {
//             setLoadingId(null);
//         }
//     };
//
//     const handleUpdateSuccess = (updatedData) => {
//         setShowEditModal(false);
//         setSuccessMessage("Employee updated successfully!");
//         setShowSuccess(true);
//
//         // Refresh employee list
//         if (onEdit) {
//             onEdit(updatedData);
//         }
//     };
//
//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             // hour12:'2-digit',
//             // minute:'2-digit',
//             // second:'2-digit'
//         });
//     };
//
//     const getRoleLabel = (roleValue) => {
//         const role = ROLE_OPTIONS.find(r => r.value === roleValue);
//         return role ? role.label : roleValue;
//     };
//
//     return (
//         <>
//             <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//                 <div className="overflow-x-auto">
//                     {/*<div className="min-w-[1000px]">*/}
//                     {/* Header */}
//                     {/*<div className="grid grid-cols-12 px-6 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">*/}
//                     {/*    <div className="col-span-3">Employee / Designation</div>*/}
//                     {/*    <div className="col-span-1">Amount</div>*/}
//                     {/*    <div className="col-span-2">Req. Date</div>*/}
//                     {/*    <div className="col-span-2 text-center">Status</div>*/}
//                     {/*    <div className="col-span-2">App. Date</div>*/}
//                     {/*    <div className="col-span-1">Reason</div>*/}
//                     {/*    <div className="col-span-1 text-right">Actions</div>*/}
//                     {/*</div>*/}
//
//                     <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 text-xs font-bold">
//                         <div className="col-span-3">Employee / Designation</div>
//                         <div className="col-span-2">Date</div>
//                         <div className="col-span-1 text-center">Status</div>
//                         <div className="col-span-2">Check In</div>
//                         <div className="col-span-2">Check Out</div>
//                         <div className="col-span-1 text-center">Work Hours</div>
//                         <div className="col-span-1 text-right">Actions</div>
//
//                     </div>
//
//                     {/* Body */}
//                     <div className="divide-y divide-gray-100">
//                         {attendance?.map((item) => (
//                             <div key={item.id}
//                                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
//
//
//
//                                 <div className="col-span-3 flex items-center gap-2">
//                                     <img src={item.profile_picture} className="w-8 h-8 rounded-full"/>
//                                     <div>
//                                         <div className="font-medium">{item.name}</div>
//                                         <div className="text-xs text-gray-500">{item.user_designation}</div>
//                                     </div>
//                                 </div>
//
//
//
//
//                                 <div className="col-span-2 text-sm text-gray-600">
//                                     {formatDate(item.date)}
//                                 </div>
//
//                                 <div className="col-span-1 flex justify-center">
//                                         <span
//                                             className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                                                 item.is_present
//                                                     ? "bg-green-100 text-green-700"
//                                                     : "bg-yellow-100 text-yellow-700"
//                                             }`}>
//                                             {item.is_present ? "Present" : "Absent"}
//                                         </span>
//                                 </div>
//
//
//
//                                 {/*<div className="col-span-2">{formatDate(item.check_in_time) || '—'}</div>*/}
//                                 {/*<div className="col-span-2">{formatDate(item.check_out_time) || '—'}</div>*/}
//
//
//                                 <div className="col-span-2">{(item.check_in_time) || '—'}</div>
//                                 <div className="col-span-2">{(item.check_out_time) || '—'}</div>
//                                 <div className="col-span-1 text-center font-medium">{item.daily_work_time}h</div>
//                                 <div className="col-span-1 flex justify-end gap-3">
//                                     {/* Edit */}
//                                     <button
//                                         onClick={() => handleEdit(item)}
//                                         className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                         title="Edit"
//                                     >
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                   d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
//                                         </svg>
//                                     </button>
//
//                                     {/* Delete */}
//                                     <button
//                                         onClick={() => handleDelete(item)}
//                                         className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                         title="Delete"
//                                     >
//                                         {loadingId === item.id ? (
//                                             <LoadingSpinner size="xs"/>
//                                         ) : (
//                                             <svg className="w-5 h-5" fill="none" stroke="currentColor"
//                                                  viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
//                                             </svg>
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//
//                         {(!attendance || attendance.length === 0) && (
//                             <div className="text-center py-20 bg-gray-50/50">
//                                 <div
//                                     className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
//                                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                               d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
//                                     </svg>
//                                 </div>
//                                 <p className="text-gray-500 font-medium">No Salary Advances Found</p>
//                             </div>
//                         )}
//                     </div>
//                     {/*</div>*/}
//                 </div>
//             </div>
//
//
//             {/* Edit Modal */}
//             {showEditModal && selectedAdvance && (
//                 <UpdateSalaryAdvanceModal
//                     isOpen={showEditModal}
//                     onClose={() => {
//                         setShowEditModal(false);
//                         setselectedAdvance(null);
//                     }}
//                     onSuccess={handleUpdateSuccess}
//                     advanceData={selectedAdvance}
//                 />
//             )}
//
//             {/* Success Popup */}
//             {/*{showSuccess && (*/}
//             {/*    <UpdateSuccessSalaryAdvancePopup*/}
//             {/*        message={successMessage}*/}
//             {/*        onClose={() => setShowSuccess(false)}*/}
//             {/*        duration={3000}*/}
//             {/*    />*/}
//             {/*)}*/}
//
//             {showSuccess && (
//                 <UpdateEmployeeAttendanceSuccessPopup
//                     message={successMessage || "Advance updated"}
//                     subtitle="Approved successfully"
//                     onClose={() => setShowSuccess(false)}   // ✅ FIXED
//                     duration={3000}
//                 />
//             )}
//         </>
//     );
// };
//
// export default EmployeeAttendanceList;


//////////////////////////////////////////////

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateEmployeeAttendanceSuccessPopup from "./UpdateEmployeeAttendanceSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import UpdateEmployeeAttendanceModal from "./UpdateEmployeeAttendanceModal";
import { employeeAttendanceAPI } from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";

const EmployeeAttendanceList = ({ attendance, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleEdit = (item) => {
        setSelectedAttendance(item);
        setShowEditModal(true);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete attendance record for ${item.name} on ${formatDate(item.date)}?`)) {
            return;
        }

        setLoadingId(item.id);
        try {
            await employeeAttendanceAPI.delete(item.id);
            setSuccessMessage(`Attendance record for ${item.name} deleted successfully!`);
            setShowSuccess(true);

            // Refresh attendance list
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete attendance record.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        setSuccessMessage("Attendance record updated successfully!");
        setShowSuccess(true);

        // Refresh attendance list
        if (onEdit) {
            onEdit(updatedData);
        }
    };

    // Format date only
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    // Format time from ISO string
    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return "—";
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            return "Invalid Time";
        }
    };

    // Convert minutes to hours and minutes
    const formatWorkTime = (minutes) => {
        if (!minutes || minutes === 0) return "0h 0m";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // Get work time badge color
    const getWorkTimeBadgeClass = (minutes) => {
        if (!minutes || minutes === 0) return "bg-red-100 text-red-700";
        if (minutes < 480) return "bg-yellow-100 text-yellow-700";
        return "bg-green-100 text-green-700";
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    {/* Header */}
                    <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b min-w-[1000px]">
                        <div className="col-span-3">Employee / Designation</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-1 text-center">Status</div>
                        <div className="col-span-2">Check In</div>
                        <div className="col-span-2">Check Out</div>
                        <div className="col-span-1 text-center">Work Hours</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Body */}
                    <div className="divide-y divide-gray-100">
                        {attendance?.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors min-w-[1000px]"
                            >
                                {/* Employee Info */}
                                <div className="col-span-3 flex items-center gap-3">
                                    {item.profile_picture ? (
                                        <img
                                            src={item.profile_picture}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/40?text=User';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                            {item.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <div className="font-semibold text-gray-900">
                                            {item.name || `User ${item.marketing_officer}`}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {item.user_designation || "Staff"}
                                        </div>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="col-span-2 text-sm text-gray-600 font-medium">
                                    {formatDate(item.date)}
                                </div>

                                {/* Status Badge */}
                                <div className="col-span-1 flex justify-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        item.is_present
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                        {item.is_present ? "Present" : "Absent"}
                                    </span>
                                </div>

                                {/* Check In Time */}
                                <div className="col-span-2">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6 3 3 0 000 6z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v5m0 0h-2m2 0h2"/>
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            {item.check_in_time ? formatTime(item.check_in_time) : '—'}
                                        </span>
                                    </div>
                                    {item.check_in_time_location && (
                                        <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[150px]">
                                            📍 {item.check_in_time_location}
                                        </div>
                                    )}
                                </div>

                                {/* Check Out Time */}
                                <div className="col-span-2">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            {item.check_out_time ? formatTime(item.check_out_time) : '—'}
                                        </span>
                                    </div>
                                    {item.check_out_time_location && (
                                        <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[150px]">
                                            📍 {item.check_out_time_location}
                                        </div>
                                    )}
                                </div>

                                {/* Work Hours */}
                                <div className="col-span-1 text-center">
                                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${getWorkTimeBadgeClass(item.daily_work_time)}`}>
                                        {formatWorkTime(item.daily_work_time)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Attendance"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Attendance"
                                    >
                                        {loadingId === item.id ? (
                                            <LoadingSpinner size="xs" />
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {(!attendance || attendance.length === 0) && (
                            <div className="text-center py-20 bg-gray-50/50">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No Attendance Records Found</p>
                                <p className="text-sm text-gray-400 mt-1">No attendance data available for the selected period</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedAttendance && (
                <UpdateEmployeeAttendanceModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedAttendance(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    advanceData={selectedAttendance}
                />
            )}

            {/* Success Popup */}
            {showSuccess && (
                <UpdateEmployeeAttendanceSuccessPopup
                    message={successMessage}
                    subtitle="Attendance record updated"
                    onClose={() => setShowSuccess(false)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default EmployeeAttendanceList;