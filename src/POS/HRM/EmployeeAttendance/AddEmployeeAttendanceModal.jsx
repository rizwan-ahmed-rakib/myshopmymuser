import React, { useState } from "react";
import { User, Clock, MapPin, ClipboardList, CheckCircle } from 'lucide-react';
import { employeeAttendanceAPI } from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
import BaseModal from "../../components/BaseModal";
import { useForm } from "../../../hooks/profile";
import EmployeeSelect from "../components/EmployeeSelect";

/**
 * AddEmployeeAttendanceModal - Refactored to use BaseModal, useForm, and Backbone branding.
 */
const AddEmployeeAttendanceModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const {
        form,
        errors,
        handleChange,
        resetForm,
        validateForm,
        setFormField
    } = useForm(
        {
            marketing_officer: "",
            check_in_time: "",
            check_out_time: "",
            check_in_time_location: "",
            check_out_time_location: "",
            is_present: false,
            leave_type: "",
        },
        {
            marketing_officer: (v) => !v ? "Employee is required" : null,
        }
    );

    // Helper function to combine date and time
    const combineDateAndTime = (timeValue) => {
        if (!timeValue) return null;
        const today = new Date();
        const [hours, minutes] = timeValue.split(':');
        today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return today.toISOString();
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
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

            const res = await employeeAttendanceAPI.create(payload);
            onSuccess?.(res.data);
            handleClose();
        } catch (err) {
            console.error(err);
            alert("Failed to add attendance: " + (err.response?.data ? JSON.stringify(err.response.data) : "Network error"));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Log Attendance Record"
            size="md"
            icon={<ClipboardList />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Attendance"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Employee Selection */}
                <EmployeeSelect 
                    value={form.marketing_officer} 
                    onChange={handleChange} 
                    name="marketing_officer"
                    label="Employee *"
                    error={errors.marketing_officer}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Clock size={12}/> Check In</label>
                        <input type="time" name="check_in_time" value={form.check_in_time} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-2xl font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Clock size={12}/> Check Out</label>
                        <input type="time" name="check_out_time" value={form.check_out_time} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-2xl font-bold focus:bg-white focus:border-rose-500 outline-none transition-all" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><MapPin size={12}/> Check In Location</label>
                        <input name="check_in_time_location" value={form.check_in_time_location} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-2xl font-medium focus:bg-white outline-none transition-all" placeholder="e.g. Office HQ" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><MapPin size={12}/> Check Out Location</label>
                        <input name="check_out_time_location" value={form.check_out_time_location} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-2xl font-medium focus:bg-white outline-none transition-all" placeholder="e.g. Office HQ" />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Leave Type (Override)</label>
                        <select name="leave_type" value={form.leave_type} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-2xl font-bold focus:bg-white outline-none appearance-none transition-all">
                            <option value="">No Leave</option>
                            <option value="casual">Casual Leave</option>
                            <option value="sick">Sick Leave</option>
                            <option value="earned">Earned Leave</option>
                            <option value="unpaid">Unpaid Leave</option>
                        </select>
                    </div>

                    <div 
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${form.is_present ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}
                        onClick={() => !form.leave_type && setFormField("is_present", !form.is_present)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${form.is_present ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <CheckCircle size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Mark as Present</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Status: {form.is_present ? 'PRESENT' : 'ABSENT'}</p>
                            </div>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${form.is_present ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.is_present ? 'left-6' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default AddEmployeeAttendanceModal;
