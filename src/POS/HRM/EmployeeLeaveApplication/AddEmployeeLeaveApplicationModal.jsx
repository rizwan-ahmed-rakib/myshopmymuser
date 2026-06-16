import React, { useState } from "react";
import PropTypes from "prop-types";
import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";
import { leaveApplicationAPI } from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";
import BaseModal from "../../components/BaseModal";
import { User, Briefcase, Calendar, FileText } from "lucide-react";

/**
 * AddEmployeeLeaveApplicationModal - Refactored to use BaseModal and Backbone patterns.
 */
const AddEmployeeLeaveApplicationModal = ({ isOpen, onClose, onSuccess }) => {
    const { allProfile } = useUserWithProfile();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        user: "",
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.user) newErrors.user = "Employee is required";
        if (!form.leave_type) newErrors.leave_type = "Leave type is required";
        if (!form.start_date) newErrors.start_date = "Start date is required";
        if (!form.end_date) newErrors.end_date = "End date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await leaveApplicationAPI.create(form);
            onSuccess?.(res.data);
            onClose();
            // Reset form
            setForm({
                user: "",
                leave_type: "",
                start_date: "",
                end_date: "",
                reason: "",
            });
        } catch (err) {
            console.error(err);
            alert("Failed to add leave application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="New Leave Application"
            subtitle="Submit a nother leave request for an employee"
            isLoading={loading}
            onSubmit={handleSubmit}
            submitText="Submit Application"
            showFooter={true}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Selection */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
                        <User size={12} className="text-brand-primary" /> Select Employee *
                    </label>
                    <select
                        name="user"
                        value={form.user}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                    >
                        <option value="">-- Choose Employee --</option>
                        {allProfile?.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.role})
                            </option>
                        ))}
                    </select>
                    {errors.user && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.user}</p>}
                </div>

                {/* Leave Type */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
                        <Briefcase size={12} className="text-brand-primary" /> Leave Type *
                    </label>
                    <select
                        name="leave_type"
                        value={form.leave_type}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                    >
                        <option value="">-- Select Type --</option>
                        <option value="sick">Sick Leave</option>
                        <option value="casual">Casual Leave</option>
                        <option value="annual">Annual Leave</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.leave_type && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.leave_type}</p>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
                            <Calendar size={12} className="text-brand-primary" /> Start Date
                        </label>
                        <input
                            type="date"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                        />
                        {errors.start_date && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.start_date}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
                            <Calendar size={12} className="text-brand-primary" /> End Date
                        </label>
                        <input
                            type="date"
                            name="end_date"
                            value={form.end_date}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                        />
                        {errors.end_date && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.end_date}</p>}
                    </div>
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
                        <FileText size={12} className="text-brand-primary" /> Reason / Note
                    </label>
                    <textarea
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
                        placeholder="Explain the reason for leave..."
                    />
                </div>
            </form>
        </BaseModal>
    );
};

AddEmployeeLeaveApplicationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

export default AddEmployeeLeaveApplicationModal;
