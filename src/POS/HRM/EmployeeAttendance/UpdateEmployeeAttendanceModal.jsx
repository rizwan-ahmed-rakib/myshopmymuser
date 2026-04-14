//
//
//
//
// // UpdateEmployeeSalaryAdvanceModal.jsx
//
// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { useForm } from "../../../hooks/profile";
// import LoadingSpinner from "./LoadingSpinner";
// import {employeeAttendanceAPI} from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
//
// const UpdateEmployeeAttendanceModal = ({
//     isOpen,
//     onClose,
//     onSuccess,
//     advanceData
// }) => {
//     const [loading, setLoading] = useState(false);
//
//     const {
//         form,
//         errors,
//         handleChange,
//         setFormData,
//         validateForm
//     } = useForm(
//         {
//             amount: "",
//             reason: "",
//             is_approved: false,
//         },
//         {
//             amount: (v) => !v ? "Amount is required" : null,
//         }
//     );
//
//     // Load data
//     useEffect(() => {
//         if (advanceData && isOpen) {
//             setFormData({
//                 amount: advanceData.amount?.toString() || "",
//                 reason: advanceData.reason || "",
//                 is_approved: advanceData.is_approved || false,
//             });
//         }
//     }, [advanceData, isOpen, setFormData]);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         if (!validateForm()) return;
//
//         setLoading(true);
//
//         try {
//             const payload = {
//                 amount: Number(form.amount),
//                 reason: form.reason,
//                 is_approved: form.is_approved,
//             };
//
//             const res = await employeeAttendanceAPI.update(advanceData.id, payload);
//
//             onSuccess?.(res.data);
//             onClose();
//
//         } catch (err) {
//             console.error(err);
//             alert("Update failed");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     if (!isOpen) return null;
//
//     return (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
//             <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
//
//                 {/* Header */}
//                 <div className="border-b p-4 flex justify-between items-center">
//                     <div>
//                         <h2 className="text-xl font-bold">
//                             Update Salary Advance
//                         </h2>
//                         <p className="text-sm text-gray-500">
//                             #{advanceData?.id}
//                         </p>
//                     </div>
//
//                     <button onClick={onClose} className="text-xl">×</button>
//                 </div>
//
//                 {/* Body */}
//                 <form onSubmit={handleSubmit} className="p-5 space-y-4">
//
//                     {/* User Name (readonly) */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             Employee
//                         </label>
//                         <input
//                             value={advanceData?.user_name || ""}
//                             disabled
//                             className="w-full p-2 border rounded bg-gray-100"
//                         />
//                     </div>
//
//                     {/* Amount */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             Amount (৳)
//                         </label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={form.amount}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                         />
//                         {errors.amount && (
//                             <p className="text-red-500 text-sm">{errors.amount}</p>
//                         )}
//                     </div>
//
//                     {/* Reason */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             Reason
//                         </label>
//                         <textarea
//                             name="reason"
//                             value={form.reason}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>
//
//                     {/* Approval Toggle */}
//                     <div className="flex items-center gap-3">
//                         <input
//                             type="checkbox"
//                             name="is_approved"
//                             checked={form.is_approved}
//                             onChange={(e) =>
//                                 handleChange({
//                                     target: {
//                                         name: "is_approved",
//                                         value: e.target.checked
//                                     }
//                                 })
//                             }
//                         />
//                         <label>Approved</label>
//                     </div>
//
//                     {/* Buttons */}
//                     <div className="flex justify-end gap-3 pt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 border rounded"
//                         >
//                             Cancel
//                         </button>
//
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="px-6 py-2 bg-blue-600 text-white rounded flex items-center"
//                         >
//                             {loading ? (
//                                 <>
//                                     <LoadingSpinner size="sm" className="mr-2" />
//                                     Updating...
//                                 </>
//                             ) : (
//                                 "Update"
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// UpdateEmployeeAttendanceModal.propTypes = {
//     isOpen: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
//     onSuccess: PropTypes.func,
//     advanceData: PropTypes.object.isRequired,
// };
//
// export default UpdateEmployeeAttendanceModal;





// UpdateEmployeeAttendanceModal.jsx (সংশোধিত)

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import { employeeAttendanceAPI } from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";

const UpdateEmployeeAttendanceModal = ({
    isOpen,
    onClose,
    onSuccess,
    advanceData
}) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        check_in_time: "",
        check_out_time: "",
        check_in_time_location: "",
        check_out_time_location: "",
        is_present: false,
        leave_type: "",
    });
    const [errors, setErrors] = useState({});

    // Load data when modal opens
    useEffect(() => {
        if (advanceData && isOpen) {
            // Format times for input fields (datetime-local expects YYYY-MM-DDThh:mm)
            const formatForInput = (dateTimeString) => {
                if (!dateTimeString) return "";
                try {
                    const date = new Date(dateTimeString);
                    return date.toISOString().slice(0, 16); // Returns YYYY-MM-DDThh:mm
                } catch (error) {
                    return "";
                }
            };

            setForm({
                check_in_time: formatForInput(advanceData.check_in_time),
                check_out_time: formatForInput(advanceData.check_out_time),
                check_in_time_location: advanceData.check_in_time_location || "",
                check_out_time_location: advanceData.check_out_time_location || "",
                is_present: advanceData.is_present || false,
                leave_type: advanceData.leave_type || "",
            });
        }
    }, [advanceData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Check if check_in_time is provided when present
        if (form.is_present && !form.check_in_time) {
            newErrors.check_in_time = "Check-in time is required when marked present";
        }

        // Check if check_out_time is after check_in_time
        if (form.check_in_time && form.check_out_time) {
            if (new Date(form.check_out_time) <= new Date(form.check_in_time)) {
                newErrors.check_out_time = "Check-out time must be after check-in time";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Create FormData object
            const formData = new FormData();

            // Add fields to FormData (only if they have values)
            if (form.check_in_time) {
                formData.append('check_in_time', form.check_in_time);
            }

            if (form.check_out_time) {
                formData.append('check_out_time', form.check_out_time);
            }

            if (form.check_in_time_location) {
                formData.append('check_in_time_location', form.check_in_time_location);
            }

            if (form.check_out_time_location) {
                formData.append('check_out_time_location', form.check_out_time_location);
            }

            formData.append('is_present', form.is_present);

            if (form.leave_type) {
                formData.append('leave_type', form.leave_type);
            }

            // For debugging - log FormData contents
            console.log("Updating attendance with FormData:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            // Call API with FormData (no manual Content-Type header)
            const res = await employeeAttendanceAPI.update(advanceData.id, formData);

            onSuccess?.(res.data);
            onClose();

        } catch (err) {
            console.error("Update error:", err);
            console.error("Error response:", err.response?.data);

            if (err.response?.data) {
                const errorMsg = Object.values(err.response.data).flat().join(", ");
                alert(`Update failed: ${errorMsg}`);
            } else {
                alert("Failed to update attendance record");
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format display time
    const formatDisplayTime = (dateTimeString) => {
        if (!dateTimeString) return "Not set";
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return "Invalid date";
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
                    <div>
                        <h2 className="text-xl font-bold">
                            Update Attendance Record
                        </h2>
                        <p className="text-sm text-gray-500">
                            Record #{advanceData?.id} | {advanceData?.name} | {advanceData?.date ? new Date(advanceData.date).toLocaleDateString() : ''}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-xl hover:text-gray-700">×</button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Employee Info (readonly) */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            {advanceData?.profile_picture ? (
                                <img
                                    src={advanceData.profile_picture}
                                    className="w-10 h-10 rounded-full object-cover"
                                    alt={advanceData.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/40?text=User';
                                    }}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {advanceData?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <div>
                                <div className="font-semibold text-gray-900">{advanceData?.name}</div>
                                <div className="text-xs text-gray-500">{advanceData?.user_designation}</div>
                            </div>
                        </div>
                    </div>

                    {/* Check In Time */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Check In Time
                        </label>
                        <input
                            type="datetime-local"
                            name="check_in_time"
                            value={form.check_in_time}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.check_in_time ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.check_in_time && (
                            <p className="text-red-500 text-sm mt-1">{errors.check_in_time}</p>
                        )}
                        {advanceData?.check_in_time && !form.check_in_time && (
                            <p className="text-xs text-gray-500 mt-1">
                                Current: {formatDisplayTime(advanceData.check_in_time)}
                            </p>
                        )}
                    </div>

                    {/* Check Out Time */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Check Out Time
                        </label>
                        <input
                            type="datetime-local"
                            name="check_out_time"
                            value={form.check_out_time}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.check_out_time ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.check_out_time && (
                            <p className="text-red-500 text-sm mt-1">{errors.check_out_time}</p>
                        )}
                        {advanceData?.check_out_time && !form.check_out_time && (
                            <p className="text-xs text-gray-500 mt-1">
                                Current: {formatDisplayTime(advanceData.check_out_time)}
                            </p>
                        )}
                    </div>

                    {/* Check In Location */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Check In Location
                        </label>
                        <input
                            type="text"
                            name="check_in_time_location"
                            value={form.check_in_time_location}
                            onChange={handleChange}
                            placeholder="e.g., Office, Home, Client Site"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {advanceData?.check_in_time_location && !form.check_in_time_location && (
                            <p className="text-xs text-gray-500 mt-1">
                                Current: {advanceData.check_in_time_location}
                            </p>
                        )}
                    </div>

                    {/* Check Out Location */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Check Out Location
                        </label>
                        <input
                            type="text"
                            name="check_out_time_location"
                            value={form.check_out_time_location}
                            onChange={handleChange}
                            placeholder="e.g., Office, Home, Client Site"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {advanceData?.check_out_time_location && !form.check_out_time_location && (
                            <p className="text-xs text-gray-500 mt-1">
                                Current: {advanceData.check_out_time_location}
                            </p>
                        )}
                    </div>

                    {/* Leave Type */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Leave Type
                        </label>
                        <select
                            name="leave_type"
                            value={form.leave_type}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">No Leave</option>
                            <option value="casual">Casual Leave</option>
                            <option value="sick">Sick Leave</option>
                            <option value="earned">Earned Leave</option>
                            <option value="unpaid">Unpaid Leave</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Note: Selecting leave will override attendance status
                        </p>
                    </div>

                    {/* Present Status */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            name="is_present"
                            id="is_present"
                            checked={form.is_present}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={form.leave_type !== "" && form.leave_type !== "casual"}
                        />
                        <label htmlFor="is_present" className="text-sm font-medium text-gray-700">
                            Mark as Present
                        </label>
                    </div>
                    {form.leave_type === "casual" && (
                        <p className="text-xs text-blue-600 mt-1">
                            Note: Casual leave is considered as present but with no work hours
                        </p>
                    )}

                    {/* Current Work Time Info */}
                    {advanceData?.daily_work_time > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Current Work Time</div>
                            <div className="text-sm font-semibold text-blue-700">
                                {Math.floor(advanceData.daily_work_time / 60)}h {advanceData.daily_work_time % 60}m
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Work time will be automatically recalculated based on check-in/out times
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    Updating...
                                </>
                            ) : (
                                "Update Attendance"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

UpdateEmployeeAttendanceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    advanceData: PropTypes.object.isRequired,
};

export default UpdateEmployeeAttendanceModal;