import React, { useState, useEffect, useCallback } from "react";
import { Layers, Camera, Image as ImageIcon, Search } from 'lucide-react';
import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
import BaseModal from "../../components/BaseModal";
import { useForm } from "../../../hooks/profile";

/**
 * AddSubCategoryModal - Refactored to use BaseModal, useForm, and Backbone branding.
 */
const AddSubCategoryModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
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
            title: "",
            category: "",
            image: null,
        },
        {
            title: (v) => !v ? "Subcategory title is required" : null,
            category: (v) => !v ? "Parent category is required" : null,
        }
    );

    const fetchCategories = useCallback(async () => {
        setCategoriesLoading(true);
        try {
            const res = await posCategoryAPI.getAll();
            setCategories(res.data || []);
        } catch (err) {
            console.error("Failed to load categories:", err);
        } finally {
            setCategoriesLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, fetchCategories]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormField("image", file);
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
            const res = await posSubCategoryAPI.create(form);
            onSuccess?.(res.data);
            handleClose();
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to add subcategory";
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
            title="Create Subcategory"
            subtitle="Define a secondary grouping level"
            size="md"
            icon={<Layers />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Subcategory"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Image Upload Area */}
                <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center text-center shadow-inner relative group hover:border-blue-400 transition-colors">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-[1.5rem] bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={32} className="text-gray-200" />
                            )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 active:scale-90 transition-all border-4 border-white">
                            <Camera size={14} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                {/* Parent Category Selector */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent Category *</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            name="category" 
                            value={form.category} 
                            onChange={handleChange} 
                            disabled={categoriesLoading}
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none appearance-none transition-all"
                        >
                            <option value="">{categoriesLoading ? "Loading..." : "Choose a Category"}</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                    {errors.category && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.category}</p>}
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subcategory Title *</label>
                    <div className="relative">
                        <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="title" 
                            value={form.title} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                            placeholder="e.g. Smart Phones, Menswear, etc." 
                        />
                    </div>
                    {errors.title && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.title}</p>}
                </div>
            </div>
        </BaseModal>
    );
};

export default AddSubCategoryModal;
