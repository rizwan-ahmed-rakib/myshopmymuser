// // AddEmployeeSalaryAdvanceModal.jsx
//
// import React, {useState} from "react";
// import axios from "axios";
// import BASE_URL_of_POS from "../../../posConfig";
// import {useUserWithProfile} from "../../../context_or_provider/pos/profile/userWithProfile";
//
// const AddEmployeeAttendanceModal = ({isOpen, onClose, onSuccess}) => {
//
//     const {allProfile} = useUserWithProfile();
//
//     const [form, setForm] = useState({
//         marketing_officer: "",
//         date: "",
//         check_in_time: "",
//         check_out_time: "",
//         is_present: false,
//     });
//
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//
//     if (!isOpen) return null;
//
//     const handleChange = (e) => {
//         const {name, value} = e.target;
//
//         setForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setErrors({});
//
//         // Validation
//         if (!form.marketing_officer) {
//             setErrors({user: "Employee is required"});
//             setLoading(false);
//             return;
//         }
//
//         if (!form.date) {
//             setErrors({date: "Date is required"});
//             setLoading(false);
//             return;
//         }
//
//         try {
//             const payload = {
//                 user: form.marketing_officer, // 👈 selected user ID
//                 date: Number(form.date),
//                 check_in_time: form.check_in_time,
//                 check_out_time: form.check_out_time,
//                 is_present: form.is_present,
//             };
//
//             const res = await axios.post(
//                 `${BASE_URL_of_POS}/api/attendance/attendance/`,
//                 payload
//             );
//
//             onSuccess?.(res.data);
//             onClose();
//
//             // reset
//             setForm({
//                 user: "",
//                 date: "",
//                 check_in_time: "",
//                 check_out_time: "",
//                 is_present: "",
//             });
//
//         } catch (err) {
//             console.error(err);
//             alert("Failed to add attendance ");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
//             <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
//
//                 {/* Header */}
//                 <div className="border-b p-4 flex justify-between items-center">
//                     <h2 className="text-xl font-bold">Add Employee Attendance</h2>
//                     <button onClick={onClose} className="text-xl">×</button>
//                 </div>
//
//                 {/* Body */}
//                 <form onSubmit={handleSubmit} className="p-5 space-y-4">
//
//                     {/* ✅ USER DROPDOWN */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             Select Employee *
//                         </label>
//
//                         <select
//                             name="user"
//                             value={form.marketing_officer}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                         >
//                             <option value="">-- Select Employee --</option>
//
//                             {allProfile?.map((emp) => (
//                                 <option key={emp.id} value={emp.id}>
//                                     {emp.name} ({emp.role})
//                                 </option>
//                             ))}
//                         </select>
//
//                         {errors.user && (
//                             <p className="text-red-500 text-sm">{errors.user}</p>
//                         )}
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
//                             value={form.date}
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
//                             check_in_time
//                         </label>
//                         <textarea
//                             name="check_in_time"
//                             value={form.check_in_time}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                         />
//
//                     </div>
//
//                     <div>
//                         <label className="text-sm font-medium text-gray-700">
//                             check_out_time
//                         </label>
//                         <textarea
//                             name="check_in_time"
//                             value={form.check_out_time}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                         />
//
//                     </div>
//
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
//                             className="px-6 py-2 bg-blue-600 text-white rounded"
//                         >
//                             {loading ? "Adding..." : "Add"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default AddEmployeeAttendanceModal;






// AddEmployeeAttendanceModal.jsx

// import React, { useState } from "react";
// import axios from "axios";
// import BASE_URL_of_POS from "../../../posConfig";
// import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";
//
// const AddEmployeeAttendanceModal = ({ isOpen, onClose, onSuccess }) => {
//     const { allProfile } = useUserWithProfile();
//
//     const [form, setForm] = useState({
//         marketing_officer: "",
//         date: "",
//         check_in_time: "",
//         check_out_time: "",
//         is_present: false,
//     });
//
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//
//     if (!isOpen) return null;
//
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//
//         setForm((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setErrors({});
//
//         // Validation
//         const newErrors = {};
//
//         if (!form.marketing_officer) {
//             newErrors.marketing_officer = "Employee is required";
//         }
//
//         if (!form.date) {
//             newErrors.date = "Date is required";
//         }
//
//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             setLoading(false);
//             return;
//         }
//
//         try {
//             const payload = {
//                 marketing_officer: parseInt(form.marketing_officer), // 👈 correct field name
//                 date: form.date,
//                 check_in_time: form.check_in_time || null,
//                 check_out_time: form.check_out_time || null,
//                 is_present: form.is_present,
//             };
//
//             const res = await axios.post(
//                 `${BASE_URL_of_POS}/api/attendance/attendance/`,
//                 payload
//             );
//
//             onSuccess?.(res.data);
//             onClose();
//
//             // Reset form
//             setForm({
//                 marketing_officer: "",
//                 date: "",
//                 check_in_time: "",
//                 check_out_time: "",
//                 is_present: false,
//             });
//
//         } catch (err) {
//             console.error("Error adding attendance:", err);
//             alert(err.response?.data?.message || "Failed to add attendance");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
//             <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
//                 {/* Header */}
//                 <div className="border-b p-4 flex justify-between items-center">
//                     <h2 className="text-xl font-bold">Add Employee Attendance</h2>
//                     <button onClick={onClose} className="text-xl hover:text-gray-700">×</button>
//                 </div>
//
//                 {/* Body */}
//                 <form onSubmit={handleSubmit} className="p-5 space-y-4">
//                     {/* Employee Dropdown */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 block mb-1">
//                             Select Employee *
//                         </label>
//                         <select
//                             name="marketing_officer"
//                             value={form.marketing_officer}
//                             onChange={handleChange}
//                             className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                 errors.marketing_officer ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         >
//                             <option value="">-- Select Employee --</option>
//                             {allProfile?.map((emp) => (
//                                 <option key={emp.id} value={emp.id}>
//                                     {emp.name} ({emp.role || emp.user_designation || "Staff"})
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.marketing_officer && (
//                             <p className="text-red-500 text-sm mt-1">{errors.marketing_officer}</p>
//                         )}
//                     </div>
//
//                     {/* Date */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 block mb-1">
//                             Date *
//                         </label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={form.date}
//                             onChange={handleChange}
//                             className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                 errors.date ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.date && (
//                             <p className="text-red-500 text-sm mt-1">{errors.date}</p>
//                         )}
//                     </div>
//
//                     {/* Check In Time */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 block mb-1">
//                             Check In Time
//                         </label>
//                         <input
//                             type="time"
//                             name="check_in_time"
//                             value={form.check_in_time}
//                             onChange={handleChange}
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             step="1"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">Format: HH:MM:SS (optional)</p>
//                     </div>
//
//                     {/* Check Out Time */}
//                     <div>
//                         <label className="text-sm font-medium text-gray-700 block mb-1">
//                             Check Out Time
//                         </label>
//                         <input
//                             type="time"
//                             name="check_out_time"
//                             value={form.check_out_time}
//                             onChange={handleChange}
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             step="1"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">Format: HH:MM:SS (optional)</p>
//                     </div>
//
//                     {/* Present Status */}
//                     <div className="flex items-center gap-3 pt-2">
//                         <input
//                             type="checkbox"
//                             name="is_present"
//                             id="is_present"
//                             checked={form.is_present}
//                             onChange={handleChange}
//                             className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         />
//                         <label htmlFor="is_present" className="text-sm font-medium text-gray-700">
//                             Mark as Present
//                         </label>
//                     </div>
//
//                     {/* Info Note */}
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                         <p className="text-xs text-blue-700">
//                             <span className="font-bold">Note:</span> If check-in/out times are not provided,
//                             they will be set as null. The system will calculate daily work time automatically.
//                         </p>
//                     </div>
//
//                     {/* Buttons */}
//                     <div className="flex justify-end gap-3 pt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? "Adding..." : "Add Attendance"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default AddEmployeeAttendanceModal;



// AddEmployeeAttendanceModal.jsx

import React, { useState } from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";

const AddEmployeeAttendanceModal = ({ isOpen, onClose, onSuccess }) => {
    const { allProfile } = useUserWithProfile();

    const [form, setForm] = useState({
        marketing_officer: "",
        check_in_time: "",
        check_out_time: "",
        check_in_time_location: "",
        check_out_time_location: "",
        is_present: false,
        leave_type: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Helper function to combine date and time
    const combineDateAndTime = (timeValue) => {
        if (!timeValue) return null;

        // Use current date since backend will auto-set date
        const today = new Date();
        const [hours, minutes] = timeValue.split(':');
        today.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Format to ISO string
        return today.toISOString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Validation
        const newErrors = {};

        if (!form.marketing_officer) {
            newErrors.marketing_officer = "Employee is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const checkInTime = combineDateAndTime(form.check_in_time);
            const checkOutTime = combineDateAndTime(form.check_out_time);

            const payload = {
                marketing_officer: parseInt(form.marketing_officer),
                check_in_time: checkInTime,
                check_out_time: checkOutTime,
                check_in_time_location: form.check_in_time_location || null,
                check_out_time_location: form.check_out_time_location || null,
                is_present: form.is_present,
                leave_type: form.leave_type || null,
            };

            console.log("Sending payload:", payload); // Debug log

            const res = await axios.post(
                `${BASE_URL_of_POS}/api/attendance/attendance/`,
                payload,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            onSuccess?.(res.data);
            onClose();

            // Reset form
            setForm({
                marketing_officer: "",
                check_in_time: "",
                check_out_time: "",
                check_in_time_location: "",
                check_out_time_location: "",
                is_present: false,
                leave_type: "",
            });

        } catch (err) {
            console.error("Error adding attendance:", err);
            console.error("Error response:", err.response?.data);

            // Show detailed error message
            if (err.response?.data) {
                const errorMsg = JSON.stringify(err.response.data);
                alert(`Failed to add attendance: ${errorMsg}`);
            } else {
                alert("Failed to add attendance. Please check console for details.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-xl font-bold">Add Employee Attendance</h2>
                    <button onClick={onClose} className="text-xl hover:text-gray-700">×</button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Employee Dropdown */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Select Employee *
                        </label>
                        <select
                            name="marketing_officer"
                            value={form.marketing_officer}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.marketing_officer ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">-- Select Employee --</option>
                            {allProfile?.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.role || "Staff"})
                                </option>
                            ))}
                        </select>
                        {errors.marketing_officer && (
                            <p className="text-red-500 text-sm mt-1">{errors.marketing_officer}</p>
                        )}
                    </div>

                    {/* Check In Time */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Check In Time
                        </label>
                        <input
                            type="time"
                            name="check_in_time"
                            value={form.check_in_time}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            step="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: HH:MM (24-hour)</p>
                    </div>

                    {/* Check Out Time */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Check Out Time
                        </label>
                        <input
                            type="time"
                            name="check_out_time"
                            value={form.check_out_time}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            step="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: HH:MM (24-hour)</p>
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
                    </div>

                    {/* Leave Type */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Leave Type (if applicable)
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
                            disabled={form.leave_type !== ""} // Disable if leave is selected
                        />
                        <label htmlFor="is_present" className="text-sm font-medium text-gray-700">
                            Mark as Present
                        </label>
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                            <span className="font-bold">Note:</span>
                            <br />
                            • Date will be automatically set to today's date
                            <br />
                            • Work hours will be calculated automatically from check-in/out times
                            <br />
                            • Leave type overrides attendance status
                        </p>
                    </div>

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
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Adding..." : "Add Attendance"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeAttendanceModal;