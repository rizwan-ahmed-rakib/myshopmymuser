



// UpdateEmployeeSalaryAdvanceModal.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "../../../hooks/profile";
import LoadingSpinner from "./LoadingSpinner";
import {employeeLoanAPI} from "../../../context_or_provider/pos/EmployeeLoan/employee_loanAPI";

const UpdateEmployeeLoanModal = ({
    isOpen,
    onClose,
    onSuccess,
    advanceData
}) => {
    const [loading, setLoading] = useState(false);

    const {
        form,
        errors,
        handleChange,
        setFormData,
        validateForm
    } = useForm(
        {
            amount: "",
            reason: "",
            is_approved: false,
        },
        {
            amount: (v) => !v ? "Amount is required" : null,
        }
    );

    // Load data
    useEffect(() => {
        if (advanceData && isOpen) {
            setFormData({
                amount: advanceData.amount?.toString() || "",
                reason: advanceData.reason || "",
                is_approved: advanceData.is_approved || false,
            });
        }
    }, [advanceData, isOpen, setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const payload = {
                amount: Number(form.amount),
                reason: form.reason,
                is_approved: form.is_approved,
            };

            const res = await employeeLoanAPI.update(advanceData.id, payload);

            onSuccess?.(res.data);
            onClose();

        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">

                {/* Header */}
                <div className="border-b p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">
                            Update Salary Advance
                        </h2>
                        <p className="text-sm text-gray-500">
                            #{advanceData?.id}
                        </p>
                    </div>

                    <button onClick={onClose} className="text-xl">×</button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* User Name (readonly) */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Employee
                        </label>
                        <input
                            value={advanceData?.user_name || ""}
                            disabled
                            className="w-full p-2 border rounded bg-gray-100"
                        />
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

                    {/* Approval Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="is_approved"
                            checked={form.is_approved}
                            onChange={(e) =>
                                handleChange({
                                    target: {
                                        name: "is_approved",
                                        value: e.target.checked
                                    }
                                })
                            }
                        />
                        <label>Approved</label>
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
                            className="px-6 py-2 bg-blue-600 text-white rounded flex items-center"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Updating...
                                </>
                            ) : (
                                "Update"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

UpdateEmployeeLoanModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    advanceData: PropTypes.object.isRequired,
};

export default UpdateEmployeeLoanModal;