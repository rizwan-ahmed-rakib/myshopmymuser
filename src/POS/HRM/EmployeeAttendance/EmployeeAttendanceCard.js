// import React, {useState, useRef, useEffect} from "react";
// import {useNavigate} from "react-router-dom";
// import UpdateSalaryAdvanceModal from "./UpdateEmployeeAttendanceModal";
// import UpdateEmployeeAttendanceSuccessPopup from "./UpdateEmployeeAttendanceSuccessPopup";
// import {employeeAttendanceAPI} from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
// import UpdateEmployeeAttendanceModal from "./UpdateEmployeeAttendanceModal";
//
// const EmployeeAttendanceCard = ({ attendance, onEdit, onDelete}) => {
//     const navigate = useNavigate();
//     const [selectedAdvance, setSelectedAdvance] = useState(null);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showSuccess, setShowSuccess] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");
//     const [loadingId, setLoadingId] = useState(null);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef(null);
//
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowDropdown(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);
//
//     const handleUserClick = () => {
//         navigate(`/employee/profile/${attendance.user}`);
//     };
//
//     const handleEdit = (advance) => {
//         setSelectedAdvance(advance);
//         setShowEditModal(true);
//         setShowDropdown(false);
//     };
//
//     const handleDelete = async (advance) => {
//         if (!window.confirm(`Are you sure you want to delete salary advance of $${advance.amount} for ${advance.name}?`)) {
//             return;
//         }
//
//         setLoadingId(advance.id);
//         try {
//             await employeeAttendanceAPI.delete(advance.id);
//             setSuccessMessage(`Salary advance of $${advance.amount} deleted successfully!`);
//             setShowSuccess(true);
//
//             // Refresh the list
//             if (onDelete) {
//                 onDelete();
//             }
//         } catch (error) {
//             console.error("Delete error:", error);
//             alert("Failed to delete salary advance.");
//         } finally {
//             setLoadingId(null);
//         }
//     };
//
//     const handleUpdateSuccess = (updatedData) => {
//         setShowEditModal(false);
//         setSuccessMessage("Salary advance updated successfully!");
//         setShowSuccess(true);
//
//         // Refresh the list
//         if (onEdit) {
//             onEdit(updatedData);
//         }
//     };
//
//     const handleApprove = async (advance) => {
//         if (!window.confirm(`Approve salary advance of $${advance.amount} for ${advance.name}?`)) {
//             return;
//         }
//
//         setLoadingId(advance.id);
//         try {
//             await employeeAttendanceAPI.approve(advance.id);
//             setSuccessMessage(`Salary advance of $${advance.amount} approved successfully!`);
//             setShowSuccess(true);
//
//             // Refresh the list
//             if (onEdit) {
//                 onEdit();
//             }
//         } catch (error) {
//             console.error("Approve error:", error);
//             alert("Failed to approve salary advance.");
//         } finally {
//             setLoadingId(null);
//         }
//     };
//
//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         return new Date(dateString).toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric'
//         });
//     };
//
//     return (
//         <>
//             <div
//                 className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
//                 <div className="p-4">
//                     {/* Card Header with Actions */}
//                     <div className="flex justify-between items-start mb-4">
//                         {/* Status Badge */}
//                         <div className="flex items-center">
//                             <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
//                                 attendance.is_present ? 'bg-green-500' : 'bg-yellow-500'
//                             }`}></span>
//                             <span className="text-xs text-gray-500">
//                                 {attendance.is_present ? 'Present' : 'Absent'}
//                             </span>
//                         </div>
//
//                         {/* Actions Dropdown */}
//                         <div className="relative" ref={dropdownRef}>
//                             <button
//                                 onClick={() => setShowDropdown(!showDropdown)}
//                                 className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
//                             >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                           d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
//                                 </svg>
//                             </button>
//
//                             {showDropdown && (
//                                 <div
//                                     className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
//                                     <button
//                                         onClick={() => handleEdit(attendance)}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                                         disabled={loadingId === attendance.id}
//                                     >
//                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
//                                              viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                   d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
//                                         </svg>
//                                         Edit
//                                     </button>
//
//                                     {!attendance.is_present && (
//                                         <button
//                                             onClick={() => handleApprove(attendance)}
//                                             className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-50"
//                                             disabled={loadingId === attendance.id}
//                                         >
//                                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
//                                                  viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                       d="M5 13l4 4L19 7"/>
//                                             </svg>
//                                             Approve
//                                         </button>
//                                     )}
//
//                                     <button
//                                         onClick={() => handleDelete(attendance)}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
//                                         disabled={loadingId === attendance.id}
//                                     >
//                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
//                                              viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
//                                         </svg>
//                                         Delete
//                                     </button>
//
//                                     <div className="border-t border-gray-100 my-1"></div>
//                                     <button
//                                         onClick={() => navigate(`/employee/profile/${attendance.user}`)}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
//                                     >
//                                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
//                                              viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
//                                         </svg>
//                                         View Employee
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Employee Info */}
//                     <div className="text-center mb-4">
//                         <div
//                             onClick={handleUserClick}
//                             className="cursor-pointer inline-block"
//                         >
//                             {attendance.profile_picture ? (
//                                 <div className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-2 border-white overflow-hidden bg-gray-100">
//                                     <img
//                                         src={`${attendance.profile_picture}`}
//                                         alt={attendance.name}
//                                         className="w-full h-full object-cover"
//                                         onError={(e) => {
//                                             e.target.src = 'https://via.placeholder.com/150?text=User';
//                                         }}
//                                     />
//                                 </div>
//                             ) : (
//                                 <div
//                                     className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold mb-2 shadow-md">
//                                     {attendance.name?.charAt(0).toUpperCase() || 'U'}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="text-center mb-3">
//                             <h3
//                                 onClick={handleUserClick}
//                                 className="font-semibold text-gray-900 mb-0.5 hover:text-blue-600 transition-colors cursor-pointer"
//                             >
//                                 {attendance.name || `User ${attendance.user}`}
//                             </h3>
//                             <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
//                                 {attendance.user_designation || attendance.user_drsignation || "Staff"}
//                             </p>
//                         </div>
//                     </div>
//
//                     {/* Advance Details */}
//                     <div className="space-y-3 mb-4">
//
//                         <div className="bg-blue-50 rounded-lg p-3 text-center">
//                             <div className="text-xs text-gray-600 mb-1">daily_work_time</div>
//                             <div className="text-2xl font-bold text-blue-600">
//                                 {formatDate(attendance.date).toLocaleString()}
//                             </div>
//                             <div className="text-2xl font-bold text-blue-600">
//                                 {parseFloat(attendance.daily_work_time).toLocaleString()}
//                             </div>
//                         </div>
//
//                         <div className="grid grid-cols-2 gap-3">
//                             <div className="text-center">
//                                 <div className="text-xs text-gray-600 mb-1">Check In:</div>
//                                 <div className="text-sm font-medium text-gray-900">
//                                     {/*{formatDate(attendance.check_in_time )}*/}
//                                     {(attendance.check_in_time )}
//                                 </div>
//                             </div>
//                             {attendance.is_present && (
//                                 <div className="text-center">
//                                     <div className="text-xs text-gray-600 mb-1">Check Out:</div>
//                                     <div className="text-sm font-medium text-green-600">
//                                         {formatDate(attendance.check_out_time )}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//
//                         {attendance.reason && (
//                             <div className="bg-gray-50 rounded-lg p-3">
//                                 <div className="text-xs text-gray-600 mb-1">Reason</div>
//                                 <div className="text-sm text-gray-700 break-words">
//                                     {attendance.reason}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Footer Stats */}
//                     <div className="bg-gray-50 rounded-lg p-3">
//                         <div className="grid grid-cols-2 gap-3">
//                             <div className="text-center">
//                                 <div className="text-xs text-gray-600 mb-1">Status</div>
//                                 <div className={`text-sm font-medium ${
//                                     attendance.is_present? 'text-green-600' : 'text-yellow-600'
//                                 }`}>
//                                     {attendance.is_present ? '✓ Present' : '⏳ Absent'}
//                                 </div>
//                             </div>
//                             <div className="text-center">
//                                 <div className="text-xs text-gray-600 mb-1">User ID</div>
//                                 <div className="text-sm font-medium text-gray-900">
//                                     #{attendance.marketing_officer}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Edit Modal */}
//             {showEditModal && selectedAdvance && (
//                 <UpdateEmployeeAttendanceModal
//                     isOpen={showEditModal}
//                     onClose={() => {
//                         setShowEditModal(false);
//                         setSelectedAdvance(null);
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
// export default EmployeeAttendanceCard;

////////////////////////////////////////////////////////

import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import UpdateEmployeeAttendanceModal from "./UpdateEmployeeAttendanceModal";
import UpdateEmployeeAttendanceSuccessPopup from "./UpdateEmployeeAttendanceSuccessPopup";
import {employeeAttendanceAPI} from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";

const EmployeeAttendanceCard = ({ attendance, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [loadingId, setLoadingId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
        // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);

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
        navigate(`/employee/profile/${attendance.marketing_officer}`);
    };

    const handleEdit = (attendance) => {
        setSelectedAttendance(attendance);
        setShowEditModal(true);
        setShowDropdown(false);
    };

    const handleDelete = async (attendance) => {
        if (!window.confirm(`Are you sure you want to delete attendance record for ${attendance.name} on ${formatDate(attendance.date)}?`)) {
            return;
        }

        setLoadingId(attendance.id);
        try {
            await employeeAttendanceAPI.delete(attendance.id);
            setSuccessMessage(`Attendance record for ${attendance.name} deleted successfully!`);
            setShowSuccess(true);

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

        if (onEdit) {
            onEdit(updatedData);
        }
    };

    // Format time from ISO string
    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";
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

    // Format date only
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    // Format full datetime
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return "Invalid DateTime";
        }
    };

    // Convert minutes to hours and minutes
    const formatWorkTime = (minutes) => {
        if (!minutes || minutes === 0) return "0h 0m";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // Get work time status color
    const getWorkTimeColor = (minutes) => {
        if (!minutes || minutes === 0) return "text-red-600";
        if (minutes < 480) return "text-yellow-600"; // Less than 8 hours
        return "text-green-600"; // 8 hours or more
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
                <div className="p-4">
                    {/* Card Header with Actions */}
                    <div className="flex justify-between items-start mb-4">
                        {/* Status Badge */}
                        <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                attendance.is_present ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <span className="text-xs text-gray-500">
                                {attendance.is_present ? 'Present' : 'Absent'}
                            </span>
                        </div>

                        {/* Date Badge */}
                        <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {formatDate(attendance.date)}
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
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                    <button
                                        onClick={() => handleEdit(attendance)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        disabled={loadingId === attendance.id}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(attendance)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                        disabled={loadingId === attendance.id}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                        Delete
                                    </button>

                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={() => navigate(`/employee/profile/${attendance.marketing_officer}`)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div onClick={handleUserClick} className="cursor-pointer inline-block">
                            {attendance.profile_picture ? (
                                <div className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md border-2 border-white overflow-hidden bg-gray-100">
                                    <img
                                        src={attendance.profile_picture}
                                        alt={attendance.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150?text=User';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold mb-2 shadow-md">
                                    {attendance.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="text-center mb-3">
                            <h3
                                onClick={handleUserClick}
                                className="font-semibold text-gray-900 mb-0.5 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                                {attendance.name || `User ${attendance.marketing_officer}`}
                            </h3>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                                {attendance.user_designation || "Staff"}
                            </p>
                        </div>
                    </div>

                    {/* Attendance Details */}
                    <div className="space-y-3 mb-4">
                        {/* Work Time Card */}
                        <div className={`rounded-lg p-3 text-center ${
                            attendance.daily_work_time >= 480 ? 'bg-green-50' : 
                            attendance.daily_work_time > 0 ? 'bg-yellow-50' : 'bg-red-50'
                        }`}>
                            <div className="text-xs text-gray-600 mb-1">Total Work Time</div>
                            <div className={`text-2xl font-bold ${getWorkTimeColor(attendance.daily_work_time)}`}>
                                {formatWorkTime(attendance.daily_work_time)}
                            </div>
                            {attendance.daily_work_time >= 480 && (
                                <div className="text-xs text-green-600 mt-1">✓ Full day completed</div>
                            )}
                            {attendance.daily_work_time > 0 && attendance.daily_work_time < 480 && (
                                <div className="text-xs text-yellow-600 mt-1">⚠ Partial day</div>
                            )}
                        </div>

                        {/* Check In/Out Times */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <div className="text-xs text-gray-600 mb-1 flex items-center justify-center">
                                    <svg className="w-3 h-3 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6 3 3 0 000 6z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v5m0 0h-2m2 0h2"/>
                                    </svg>
                                    Check In
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                    {attendance.check_in_time ? formatTime(attendance.check_in_time) : '—'}
                                </div>
                                {attendance.check_in_time_location && (
                                    <div className="text-xs text-gray-500 mt-1 truncate">
                                        📍 {attendance.check_in_time_location}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <div className="text-xs text-gray-600 mb-1 flex items-center justify-center">
                                    <svg className="w-3 h-3 mr-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                    </svg>
                                    Check Out
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                    {attendance.check_out_time ? formatTime(attendance.check_out_time) : '—'}
                                </div>
                                {attendance.check_out_time_location && (
                                    <div className="text-xs text-gray-500 mt-1 truncate">
                                        📍 {attendance.check_out_time_location}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Leave Type (if any) */}
                        {attendance.leave_type && (
                            <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs text-gray-600 mb-1">Leave Type</div>
                                <div className="text-sm font-medium text-purple-700 capitalize">
                                    {attendance.leave_type} Leave
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
                                    attendance.is_present ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {attendance.is_present ? '✓ Present' : '✗ Absent'}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-gray-600 mb-1">Record ID</div>
                                <div className="text-sm font-medium text-gray-900">
                                    #{attendance.id}
                                </div>
                            </div>
                        </div>
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

export default EmployeeAttendanceCard;