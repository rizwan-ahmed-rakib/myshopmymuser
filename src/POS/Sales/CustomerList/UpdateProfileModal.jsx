import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProfileImageUpload from "./ProfileImageUpload";
import { posCustomerAPI } from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import BaseModal from "../../components/BaseModal";
import { User, Phone, Mail, MapPin, Edit3, Image as ImageIcon } from 'lucide-react';

/**
 * UpdateCustomerModal - Refactored to use BaseModal and standardized backbone layout.
 */
const UpdateCustomerModal = ({ isOpen, onClose, onSuccess, employeeData }) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (employeeData && isOpen) {
            setForm({
                name: employeeData.name || "",
                email: employeeData.email || "",
                phone: employeeData.phone || "",
                address: employeeData.address || "",
            });
            if (employeeData.image) setPreviewImage(employeeData.image);
            else setPreviewImage(null);
            setImageFile(null);
            setErrors({});
        }
    }, [employeeData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (file) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        if(e) e.preventDefault();
        if (!form.name || !form.phone) {
            setErrors({ message: "Name and Phone are required" });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("phone", form.phone);
            formData.append("email", form.email);
            formData.append("address", form.address);
            if (imageFile) formData.append("image", imageFile);

            const res = await posCustomerAPI.update(employeeData.id, formData);
            if (onSuccess) onSuccess(res.data);
            onClose();
        } catch (error) {
            setErrors(error.response?.data || { message: "Update failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Customer Profile"
            size="md"
            icon={<Edit3 className="text-white" />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Update Profile"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center py-2">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                            {previewImage ? (
                                <img src={previewImage} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <User size={40} className="text-gray-300" />
                            )}
                        </div>
                        <label className="absolute bottom-1 right-1 bg-brand-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-brand-primaryHover transition-colors border-2 border-white">
                            <ImageIcon size={14} />
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files[0])} className="hidden" />
                        </label>
                    </div>
                    <p className="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Photo</p>
                </div>

                <div className="grid gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                            <User size={10} className="text-brand-primary" /> Customer Name *
                        </label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Customer name" className="w-full border border-gray-200 p-3 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <Phone size={10} className="text-brand-primary" /> Phone Number *
                            </label>
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="017xxxxxxxx" className="w-full border border-gray-200 p-3 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <Mail size={10} className="text-brand-primary" /> Email Address
                            </label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border border-gray-200 p-3 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                            <MapPin size={10} className="text-brand-primary" /> Billing Address
                        </label>
                        <textarea name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border border-gray-200 p-3 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" rows="3" />
                    </div>
                </div>

                {errors.message && (
                    <p className="bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 text-[10px] font-black uppercase tracking-widest text-center">{errors.message}</p>
                )}
            </div>
        </BaseModal>
    );
};

UpdateCustomerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    employeeData: PropTypes.object.isRequired,
};

export default UpdateCustomerModal;