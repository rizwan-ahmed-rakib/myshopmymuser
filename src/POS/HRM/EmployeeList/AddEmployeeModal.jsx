import React, { useState } from "react";
import api from '../../../context_or_provider/pos/posApi';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Target, Lock, Fingerprint, Camera, Shield } from 'lucide-react';

import BaseModal from "../../components/BaseModal";
import { useForm } from "../../../hooks/profile";
import { ROLE_OPTIONS } from "./roles";

/**
 * AddEmployeeModal - Refactored to use BaseModal, useForm, and Backbone branding.
 */
const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const {
        form,
        errors,
        handleChange,
        resetForm,
        validateForm,
        setFormField
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
            profile_picture: null,
            user: {
                phone_number: "",
                password: "",
                confirm_password: "",
                fingerprint_id: ""
            }
        },
        // {
        //     name: (v) => !v ? "Full name is required" : null,
        //     email: (v) => !v ? "Email is required" : !/^\S+@\S+\.\S+$/.test(v) ? "Invalid email" : null,
        //     "user.phone_number": (v) => !v ? "Login phone number is required" : null,
        //     "user.password": (v) => !v ? "Password is required" : v.length < 6 ? "Minimum 6 characters" : null,
        //     "user.confirm_password": (v) => v !== form.user.password ? "Passwords do not match" : null,
        // }
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormField("profile_picture", file);
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
            const formData = new FormData();
            
            // Map nested user fields to the format backend expects (user.field)
            formData.append("user.phone_number", form.user.phone_number);
            formData.append("user.password", form.user.password);
            formData.append("user.confirm_password", form.user.confirm_password);
            formData.append("user.fingerprint_id", form.user.fingerprint_id || "");

            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("role", form.role);
            formData.append("phone_number", form.phone_number || "");
            formData.append("address", form.address || "");
            formData.append("salary", form.salary || "0");
            formData.append("target", form.target || "0");
            formData.append("areacode", form.areacode || "");

            if (form.profile_picture) {
                formData.append("profile_picture", form.profile_picture);
            }

            const res = await api.post(`/api/users/create-new-user-with-profile/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            onSuccess?.(res.data);
            handleClose();
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to add employee";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        setPreviewImage(null);
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Register New Employee"
            size="xl"
            icon={<User />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Create Account"
            isLoading={loading}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Profile & Credentials */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Profile Picture Card */}
                    <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100 flex flex-col items-center text-center shadow-inner">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2rem] bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
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
                            <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">Profile Photo</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG or JPG, Max 5MB</p>
                        </div>
                    </div>

                    {/* Login Credentials Card */}
                    <div className="bg-gray-900 p-6 rounded-[2rem] space-y-4 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10 flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/10 rounded-xl text-blue-400"><Lock size={16}/></div>
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Authentication</h3>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Login Phone *</label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        name="user.phone_number"
                                        value={form.user.phone_number}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 p-3 pl-11 rounded-2xl text-white font-bold text-sm focus:bg-white/10 focus:border-blue-500 outline-none transition-all"
                                        placeholder="017XXXXXXXX"
                                    />
                                </div>
                                {errors["user.phone_number"] && <p className="text-rose-400 text-[10px] font-bold uppercase mt-1 ml-1">{errors["user.phone_number"]}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password *</label>
                                <div className="relative">
                                    <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        type="password"
                                        name="user.password"
                                        value={form.user.password}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 p-3 pl-11 rounded-2xl text-white font-bold text-sm focus:bg-white/10 focus:border-blue-500 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors["user.password"] && <p className="text-rose-400 text-[10px] font-bold uppercase mt-1 ml-1">{errors["user.password"]}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Password *</label>
                                <input
                                    type="password"
                                    name="user.confirm_password"
                                    value={form.user.confirm_password}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white font-bold text-sm focus:bg-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                {errors["user.confirm_password"] && <p className="text-rose-400 text-[10px] font-bold uppercase mt-1 ml-1">{errors["user.confirm_password"]}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Fingerprint size={12}/> Fingerprint ID</label>
                                <input
                                    name="user.fingerprint_id"
                                    value={form.user.fingerprint_id}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white font-mono text-sm focus:bg-white/10 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Optional"
                                />
                            </div>
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
                                    <input name="name" value={form.name} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="e.g. John Doe" />
                                </div>
                                {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" />
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
                                    <input name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="Secondary Phone" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
                                <textarea name="address" value={form.address} onChange={handleChange} rows="2" className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-medium text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none" placeholder="Residential address..." />
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
                                    <input type="number" name="salary" value={form.salary} onChange={handleChange} className="w-full bg-emerald-50/30 border-2 border-emerald-100 p-4 pl-12 rounded-2xl font-black text-emerald-700 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Sales Target</label>
                                <div className="relative">
                                    <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
                                    <input type="number" name="target" value={form.target} onChange={handleChange} className="w-full bg-indigo-50/30 border-2 border-indigo-100 p-4 pl-12 rounded-2xl font-black text-indigo-700 focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Area Code</label>
                                <input name="areacode" value={form.areacode} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-black text-gray-900 focus:bg-white focus:border-gray-900 outline-none transition-all uppercase" placeholder="e.g. DHA-01" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default AddEmployeeModal;
