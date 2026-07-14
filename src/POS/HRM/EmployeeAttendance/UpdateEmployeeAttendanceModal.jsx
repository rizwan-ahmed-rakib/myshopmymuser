import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Clock, MapPin, ClipboardList, CheckCircle, Settings, User } from 'lucide-react';
import { employeeAttendanceAPI } from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
import BaseModal from "../../components/BaseModal";

/**
 * UpdateEmployeeAttendanceModal - Refactored to use BaseModal and match Backbone pattern.
 */
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

    useEffect(() => {
        if (advanceData && isOpen) {
            const formatForInput = (dateTimeString) => {
                if (!dateTimeString) return "";
                try {
                    const date = new Date(dateTimeString);
                    return date.toISOString().slice(0, 16); 
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
    };

    const validateForm = () => {
        const newErrors = {};
        if (form.is_present && !form.check_in_time) {
            newErrors.check_in_time = "Check-in time is required when marked present";
        }
        if (form.check_in_time && form.check_out_time) {
            if (new Date(form.check_out_time) <= new Date(form.check_in_time)) {
                newErrors.check_out_time = "Check-out time must be after check-in time";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            if (form.check_in_time) formData.append('check_in_time', form.check_in_time);
            if (form.check_out_time) formData.append('check_out_time', form.check_out_time);
            if (form.check_in_time_location) formData.append('check_in_time_location', form.check_in_time_location);
            if (form.check_out_time_location) formData.append('check_out_time_location', form.check_out_time_location);
            formData.append('is_present', form.is_present);
            if (form.leave_type) formData.append('leave_type', form.leave_type);

            const res = await employeeAttendanceAPI.update(advanceData.id, formData);
            onSuccess?.({
                ...advanceData,
                ...res.data
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Update failed: " + (err.response?.data ? JSON.stringify(err.response.data) : "Network error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Attendance Record"
            subtitle={`Ref: #ATT-${advanceData?.id} | ${advanceData?.date ? new Date(advanceData.date).toLocaleDateString() : ''}`}
            size="md"
            icon={<Settings />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Update Record"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Employee Info Header */}
                <div className="bg-blue-50/50 p-4 rounded-[2rem] border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 overflow-hidden">
                        {advanceData?.profile_picture ? (
                            <img src={advanceData.profile_picture} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <User size={24} />
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">{advanceData?.user_designation || "Staff"}</p>
                        <p className="font-bold text-gray-800 leading-none">{advanceData?.name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Clock size={12}/> Check In</label>
                        <input type="datetime-local" name="check_in_time" value={form.check_in_time} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-2xl font-bold focus:bg-white focus:border-blue-500 outline-none transition-all" />
                        {errors.check_in_time && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.check_in_time}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Clock size={12}/> Check Out</label>
                        <input type="datetime-local" name="check_out_time" value={form.check_out_time} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-3 rounded-2xl font-bold focus:bg-white focus:border-rose-500 outline-none transition-all" />
                        {errors.check_out_time && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.check_out_time}</p>}
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
                        onClick={() => setForm(prev => ({...prev, is_present: !prev.is_present}))}
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

UpdateEmployeeAttendanceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    advanceData: PropTypes.object.isRequired,
};

export default UpdateEmployeeAttendanceModal;
