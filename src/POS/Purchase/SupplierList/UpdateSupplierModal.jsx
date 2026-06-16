import React, { useState, useEffect } from "react";
import { User, Phone, Mail, MapPin, DollarSign, Camera, Image as ImageIcon, Settings } from 'lucide-react';
import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import BaseModal from "../../components/BaseModal";
import { useForm } from "../../../hooks/profile";

/**
 * UpdateSupplierModal - Refactored to use BaseModal and match Backbone pattern.
 */
const UpdateSupplierModal = ({ isOpen, onClose, onSuccess, supplierData }) => {
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
            phone: "",
            email: "",
            address: "",
            due_amount: "0",
        },
        {
            name: (v) => !v ? "Supplier name is required" : null,
            phone: (v) => !v ? "Phone number is required" : null,
        }
    );

    useEffect(() => {
        if (supplierData && isOpen) {
            setFormData({
                name: supplierData.name || "",
                phone: supplierData.phone || "",
                email: supplierData.email || "",
                address: supplierData.address || "",
                due_amount: supplierData.due_amount?.toString() || "0",
            });
            setPreviewImage(supplierData.image || null);
            setImageFile(null);
        }
    }, [supplierData, isOpen, setFormData]);

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
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("phone", form.phone);
            formData.append("email", form.email || "");
            formData.append("address", form.address || "");
            formData.append("due_amount", form.due_amount || "0");

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await posSupplierAPI.update(supplierData.id, formData);
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
            title="Update Supplier Profile"
            subtitle={`Ref: #SUP-${supplierData?.id}`}
            size="md"
            icon={<Settings />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Changes"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Profile Media Section */}
                <div className="flex flex-col items-center py-4 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 mb-2 group">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-[2rem] bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={40} className="text-gray-200" />
                            )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700 active:scale-90 transition-all border-4 border-white">
                            <Camera size={16} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                    <div className="mt-3 text-center">
                        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">{form.name || "Partner Media"}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Click camera to update photo</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Supplier Name *</label>
                        <div className="relative">
                            <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                name="name" 
                                value={form.name} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border-2 border-gray-100 p-3 pl-11 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                            />
                        </div>
                        {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Phone *</label>
                        <div className="relative">
                            <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                name="phone" 
                                value={form.phone} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border-2 border-gray-100 p-3 pl-11 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                            />
                        </div>
                        {errors.phone && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.phone}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="email"
                                name="email" 
                                value={form.email} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border-2 border-gray-100 p-3 pl-11 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                            />
                        </div>
                        {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.email}</p>}
                    </div>

                    {/* Due Amount */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Opening Due (৳)</label>
                        <div className="relative">
                            <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                            <input 
                                type="number"
                                name="due_amount" 
                                value={form.due_amount} 
                                onChange={handleChange} 
                                className="w-full bg-amber-50/30 border-2 border-amber-100 p-3 pl-11 rounded-2xl font-black text-amber-700 focus:bg-white focus:border-amber-500 outline-none transition-all" 
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Physical Address</label>
                    <div className="relative">
                        <MapPin size={14} className="absolute left-4 top-4 text-gray-400" />
                        <textarea 
                            name="address" 
                            value={form.address} 
                            onChange={handleChange} 
                            rows="2"
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-11 rounded-2xl font-medium text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none" 
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default UpdateSupplierModal;
