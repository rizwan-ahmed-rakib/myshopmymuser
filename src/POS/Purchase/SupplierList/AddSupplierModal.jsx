import React, { useState } from "react";
import api from '../../../context_or_provider/pos/posApi';

import BaseModal from "../../components/BaseModal";
import { UserPlus, Image as ImageIcon, User, Phone, Mail, MapPin, Wallet } from 'lucide-react';

/**
 * AddSupplierModal - Refactored to use BaseModal and standardized backbone layout.
 */
const AddSupplierModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    due_amount: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!form.name || !form.phone) {
      setErrors({ message: "Name and Phone are required" });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("address", form.address);
      formData.append("due_amount", form.due_amount || "0");
      if (form.image) formData.append("image", form.image);

      const res = await api.post(`/api/purchase/suppliers/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess?.(res.data);
      resetForm();
    } catch (err) {
      setErrors(err.response?.data || { message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", address: "", due_amount: "", image: null });
    setPreviewImage(null);
    setErrors({});
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Supplier"
      size="md"
      icon={<UserPlus className="text-white" />}
      showFooter={true}
      onSubmit={handleSubmit}
      submitText="Create Supplier"
      isLoading={loading}
    >
      <div className="space-y-6">
        {/* Profile Image Upload */}
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
                    <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                </label>
            </div>
            <p className="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Supplier Photo</p>
        </div>

        <div className="grid gap-5">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <User size={10} className="text-brand-primary" /> Supplier Name *
                </label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Acme Corp" className="w-full border border-gray-200 p-3 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" required />
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
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="supplier@example.com" className="w-full border border-gray-200 p-3 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <MapPin size={10} className="text-brand-primary" /> Office Address
                </label>
                <textarea name="address" value={form.address} onChange={handleChange} placeholder="Enter full address..." className="w-full border border-gray-200 p-3 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" rows="2" />
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Wallet size={12} /> Opening Due Balance (Optional)
                </label>
                <input type="number" name="due_amount" value={form.due_amount} onChange={handleChange} placeholder="0.00" className="w-full border border-emerald-100 p-3 rounded-xl font-black text-emerald-700 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 outline-none transition-all bg-white shadow-inner" />
            </div>
        </div>

        {errors.message && (
          <p className="bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 text-[10px] font-black uppercase tracking-widest text-center">{errors.message}</p>
        )}
      </div>
    </BaseModal>
  );
};

export default AddSupplierModal;