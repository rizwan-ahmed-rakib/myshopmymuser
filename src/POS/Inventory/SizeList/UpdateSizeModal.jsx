import React, { useState, useEffect } from "react";
import { Maximize, Camera, Image as ImageIcon, Settings } from 'lucide-react';
import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";
import BaseModal from "../../components/BaseModal";
import { useForm } from "../../../hooks/profile";

/**
 * UpdateSizeModal - Refactored to use BaseModal and match Backbone pattern.
 */
const UpdateSizeModal = ({ isOpen, onClose, onSuccess, productData }) => {
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
            title: "",
        },
        {
            title: (v) => !v ? "Size title is required" : null,
        }
    );

    useEffect(() => {
        if (productData && isOpen) {
            setFormData({
                title: productData.title || "",
            });
            setPreviewImage(productData.image || null);
            setImageFile(null);
        }
    }, [productData, isOpen, setFormData]);

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
            const dataToSend = { ...form };
            if (imageFile) {
                dataToSend.image = imageFile;
            }

            const res = await posSizeAPI.update(productData.id, dataToSend);
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
            title="Update Size"
            subtitle={`Ref: #SIZ-${productData?.id}`}
            size="md"
            icon={<Settings />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Changes"
            isLoading={loading}
        >
            <div className="space-y-8">
                {/* Image Upload Area */}
                <div className="bg-gray-50 p-8 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center text-center shadow-inner relative group hover:border-blue-400 transition-colors">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-[2rem] bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={48} className="text-gray-200" />
                            )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700 active:scale-90 transition-all border-4 border-white">
                            <Camera size={18} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">{form.title || "Size Reference"}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Click camera to update photo</p>
                    </div>
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Size Label *</label>
                    <div className="relative">
                        <Maximize size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="title" 
                            value={form.title} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                            placeholder="e.g. XL, 42, 10-inch, etc." 
                        />
                    </div>
                    {errors.title && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.title}</p>}
                </div>
            </div>
        </BaseModal>
    );
};

export default UpdateSizeModal;
