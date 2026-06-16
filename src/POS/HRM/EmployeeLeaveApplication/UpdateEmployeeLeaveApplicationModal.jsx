import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "../../../hooks/profile";
import { leaveApplicationAPI } from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";
import BaseModal from "../../components/BaseModal";
import { Briefcase, Calendar, FileText, CheckCircle } from "lucide-react";

/**
 * UpdateEmployeeLeaveApplicationModal - Refactored to use BaseModal and Backbone patterns.
 */
const UpdateEmployeeLeaveApplicationModal = ({
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
            leave_type: "",
            start_date: "",
            end_date: "",
            reason: "",
            is_approved: false,
        },
        {
            leave_type: (v) => !v ? "Leave type required" : null,
            start_date: (v) => !v ? "Start date required" : null,
            end_date: (v) => !v ? "End date required" : null,
        }
    );

    // Load data when modal opens
    useEffect(() => {
        if (advanceData && isOpen) {
            setFormData({
                leave_type: advanceData.leave_type || "",
                start_date: advanceData.start_date || "",
                end_date: advanceData.end_date || "",
                reason: advanceData.reason || "",
                is_approved: advanceData.status === "approved" || advanceData.is_approved,
            });
        }
    }, [advanceData, isOpen, setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                leave_type: form.leave_type,
                start_date: form.start_date,
                end_date: form.end_date,
                reason: form.reason,
                status: form.is_approved ? "approved" : "pending",
            };

            const res = await leaveApplicationAPI.update(advanceData.id, payload);
            onSuccess?.(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Leave Application"
            subtitle={`Ref: #LVE-${advanceData?.id}`}
            isLoading={loading}
            onSubmit={handleSubmit}
            submitText="Update Application"
            showFooter={true}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Info (Read-only) */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {advanceData?.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Employee</p>
                        <p className="font-bold text-gray-800 leading-none">{advanceData?.user_name}</p>
                    </div>
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

                {/* Approval Toggle */}
                <div 
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-emerald-50/50 transition-colors"
                    onClick={() => handleChange({ target: { name: 'is_approved', value: !form.is_approved } })}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${form.is_approved ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                            <CheckCircle size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800 leading-none mb-1">Approve Application</p>
                            <p className="text-[10px] font-medium text-gray-400 leading-none">Mark this leave as officially approved</p>
                        </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${form.is_approved ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.is_approved ? 'left-6' : 'left-1'}`}></div>
                    </div>
                </div>
            </form>
        </BaseModal>
    );
};

UpdateEmployeeLeaveApplicationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    advanceData: PropTypes.object.isRequired,
};

export default UpdateEmployeeLeaveApplicationModal;
