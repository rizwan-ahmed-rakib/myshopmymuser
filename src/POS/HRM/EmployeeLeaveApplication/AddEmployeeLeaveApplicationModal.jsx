// AddEmployeeSalaryAdvanceModal.jsx

import React, { useState } from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";

const AddEmployeeLeaveApplicationModal = ({ isOpen, onClose, onSuccess }) => {

    const { allProfile } = useUserWithProfile();

    const [form, setForm] = useState({
        user: "",
        amount: "",
        reason: "",
        request_date:"",
        is_approved:false,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Validation
        if (!form.user) {
            setErrors({ user: "Employee is required" });
            setLoading(false);
            return;
        }

        if (!form.amount) {
            setErrors({ amount: "Amount is required" });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                user: form.user, // 👈 selected user ID
                amount: Number(form.amount),
                reason: form.reason,
            };

            const res = await axios.post(
                `${BASE_URL_of_POS}/api/users/leave-applications/`,
                payload
            );

            onSuccess?.(res.data);
            onClose();

            // reset
            setForm({
                user: "",
                amount: "",
                reason: "",
            });

        } catch (err) {
            console.error(err);
            alert("Failed to add salary advance");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl">

                {/* Header */}
                <div className="border-b p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Add Salary Advance</h2>
                    <button onClick={onClose} className="text-xl">×</button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* ✅ USER DROPDOWN */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Select Employee *
                        </label>

                        <select
                            name="user"
                            value={form.user}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">-- Select Employee --</option>

                            {allProfile?.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.role})
                                </option>
                            ))}
                        </select>

                        {errors.user && (
                            <p className="text-red-500 text-sm">{errors.user}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Amount (৳)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.amount && (
                            <p className="text-red-500 text-sm">{errors.amount}</p>
                        )}
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Reason
                        </label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded"
                        >
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeLeaveApplicationModal;