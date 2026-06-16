import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Target, Camera, Settings } from 'lucide-react';
import { ROLE_OPTIONS } from "./roles";
import { useForm } from "../../../hooks/profile";
import { employeeAPI } from "../../../context_or_provider/pos/profile/profileupdate";
import BaseModal from "../../components/BaseModal";

/**
 * UpdateEmployeeModal - Refactored to use BaseModal and match Backbone pattern.
 */
const UpdateEmployeeModal = ({ isOpen, onClose, onSuccess, employeeData }) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const {
        form,
        errors,
        handleChange,
        setFormData,
        validateForm
    } = useForm(
        {
            name: "",
            email: "",
            role: "marketing_officer",
            phone_number: "",
            address: "",
            salary: "",
            target: "",
            areacode: "",
        },
        {
            name: (v) => !v ? "Name is required" : null,
            email: (v) => !v ? "Email is required" : !/\S+@\S+\.\S+$/.test(v) ? "Invalid email" : null,
        }
    );

    useEffect(() => {
        if (employeeData && isOpen) {
            setFormData({
                name: employeeData.name || "",
                email: employeeData.email || "",
                role: employeeData.role || "marketing_officer",
                phone_number: employeeData.phone_number || "",
                address: employeeData.address || "",
                salary: employeeData.salary?.toString() || "",
                target: employeeData.target?.toString() || "",
                areacode: employeeData.areacode || "",
            });
            setPreviewImage(employeeData.profile_picture || null);
            setImageFile(null);
        }
    }, [employeeData, isOpen, setFormData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const dataToSend = {
                ...form,
                salary: form.salary ? Number(form.salary) : 0,
                target: form.target ? Number(form.target) : 0,
            };

            if (imageFile) {
                dataToSend.profile_picture = imageFile;
            }

            const res = await employeeAPI.update(employeeData.id, dataToSend);
            onSuccess?.(res.data);
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
            title="Update Employee Profile"
            subtitle={`Ref: #EMP-${employeeData?.id}`}
            size="xl"
            icon={<Settings />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Changes"
            isLoading={loading}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Profile Photo */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100 flex flex-col items-center text-center shadow-inner">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2rem] bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-gray-200" />
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700 active:scale-90 transition-all border-4 border-white">
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">{form.name || "Employee"}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Click camera to update photo</p>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm font-bold text-lg">
                            #{employeeData?.id}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Employee ID</p>
                            <p className="font-bold text-gray-800 leading-none">{employeeData?.name}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Personal & Employment Details */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-blue-600 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Personal Information</h3></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input name="name" value={form.name} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                                </div>
                                {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                                </div>
                                {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role / Designation *</label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select name="role" value={form.role} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none appearance-none transition-all">
                                        {ROLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
                                <textarea name="address" value={form.address} onChange={handleChange} rows="2" className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-medium text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none" />
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Employment & Salary</h3></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Monthly Salary</label>
                                <div className="relative">
                                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                                    <input type="number" name="salary" value={form.salary} onChange={handleChange} className="w-full bg-emerald-50/30 border-2 border-emerald-100 p-4 pl-12 rounded-2xl font-black text-emerald-700 focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Sales Target</label>
                                <div className="relative">
                                    <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
                                    <input type="number" name="target" value={form.target} onChange={handleChange} className="w-full bg-indigo-50/30 border-2 border-indigo-100 p-4 pl-12 rounded-2xl font-black text-indigo-700 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Area Code</label>
                                <input name="areacode" value={form.areacode} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-black text-gray-900 focus:bg-white focus:border-gray-900 outline-none transition-all uppercase" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

UpdateEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    employeeData: PropTypes.object.isRequired,
};

export default UpdateEmployeeModal;
