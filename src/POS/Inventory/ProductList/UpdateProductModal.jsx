import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import {
    Package, Tag, Layers, GitCommit,
    Scale, Maximize, ShieldCheck, Calendar, Info,
    Camera, Image as ImageIcon, DollarSign, Target, Activity, Settings, X, FileClock
} from 'lucide-react';
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";
import { posWarrantyPeriodAPI } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";
import BaseModal from "../../components/BaseModal";
import { useForm } from "../../../hooks/profile";

/**
 * UpdateProductModal - Refactored to use BaseModal and match Backbone pattern.
 */
const UpdateProductModal = ({ isOpen, onClose, onSuccess, productData }) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // Options for dropdowns
    const [options, setOptions] = useState({
        categories: [],
        subCategories: [],
        brands: [],
        units: [],
        sizes: [],
        warrantyPeriods: []
    });

    const {
        form,
        errors,
        handleChange,
        setFormData,
        validateForm,
        setFormField
    } = useForm(
        {
            name: "",
            product_code: "",
            purchase_price: "",
            selling_price: "",
            stock: "",
            category: "",
            sub_category: "",
            brand: "",
            size: "",
            unit: "",
            alarm_when_stock_is_lessthanOrEqualto: 0,
            warranty_status: false,
            warranty_period: "",
            has_expiry: false,
        },
        {
            name: (v) => !v ? "Product name is required" : null,
            category: (v) => !v ? "Category is required" : null,
        }
    );

    const fetchOptions = useCallback(async () => {
        try {
            const [catRes, subCatRes, brandRes, unitRes, sizeRes, warrantyRes] = await Promise.all([
                posCategoryAPI.getAll(),
                posSubCategoryAPI.getAll(),
                posBrandAPI.getAll(),
                posUnitAPI.getAll(),
                posSizeAPI.getAll(),
                posWarrantyPeriodAPI.getAll()
            ]);

            setOptions({
                categories: catRes.data.map(item => ({ value: item.id, label: item.title })),
                subCategories: subCatRes.data.map(item => ({ value: item.id, label: item.title, categoryId: item.category })),
                brands: brandRes.data.map(item => ({ value: item.id, label: item.title })),
                units: unitRes.data.map(item => ({ value: item.id, label: item.title })),
                sizes: sizeRes.data.map(item => ({ value: item.id, label: item.title })),
                warrantyPeriods: warrantyRes.data.map(item => ({
                    value: item.id,
                    label: `${item.name} (${item.duration} ${item.period_type}${item.duration > 1 ? 's' : ''})`
                }))
            });
        } catch (err) {
            console.error("Error fetching options:", err);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchOptions();
            if (productData) {
                setFormData({
                    name: productData.name || "",
                    product_code: productData.product_code || "",
                    purchase_price: productData.purchase_price?.toString() || "",
                    selling_price: productData.selling_price?.toString() || "",
                    stock: productData.stock?.toString() || "",
                    alarm_when_stock_is_lessthanOrEqualto: productData.alarm_when_stock_is_lessthanOrEqualto || 0,
                    category: productData.category || "",
                    sub_category: productData.sub_category || "",
                    brand: productData.brand || "",
                    size: productData.size || "",
                    unit: productData.unit || "",
                    warranty_status: productData.warranty_status || false,
                    warranty_period: productData.warranty_period || "",
                    has_expiry: productData.has_expiry || false,
                });
                setPreviewImage(productData.image || null);
                setImageFile(null);
            }
        }
    }, [productData, isOpen, setFormData, fetchOptions]);

    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        const val = selectedOption ? selectedOption.value : "";
        setFormField(name, val);

        if (name === "category") {
            setFormField("sub_category", "");
        }
    };

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
                purchase_price: parseFloat(form.purchase_price) || 0,
                selling_price: parseFloat(form.selling_price) || 0,
                stock: parseInt(form.stock) || 0,
                alarm_when_stock_is_lessthanOrEqualto: parseInt(form.alarm_when_stock_is_lessthanOrEqualto) || 0,
                warranty_period: form.warranty_status ? (form.warranty_period || null) : null,
            };

            if (imageFile) {
                dataToSend.image = imageFile;
            }

            const res = await posProductAPI.update(productData.id, dataToSend);
            onSuccess?.(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Update failed: " + (err.response?.data ? JSON.stringify(err.response.data) : "Network error"));
        } finally {
            setLoading(false);
        }
    };

    const filteredSubCategories = options.subCategories.filter(
        sub => !form.category || sub.categoryId === form.category
    );

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '1rem',
            padding: '4px',
            borderColor: state.isFocused ? '#3B82F6' : '#F3F4F6',
            borderWidth: '2px',
            backgroundColor: '#F9FAFB',
            boxShadow: 'none',
            '&:hover': { borderColor: '#3B82F6' }
        }),
        menu: (provided) => ({ ...provided, zIndex: 9999, borderRadius: '1rem', overflow: 'hidden' }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
            color: state.isSelected ? 'white' : '#1F2937',
            fontWeight: 'bold',
            fontSize: '12px'
        })
    };

    const FieldLabel = ({ label, icon }) => (
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1 mb-1.5">
            {icon} {label}
        </label>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Product Details"
            subtitle={`Ref: #PRD-${productData?.id}`}
            size="xl"
            icon={<Settings />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Changes"
            isLoading={loading}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100 flex flex-col items-center text-center shadow-inner">
                        <div className="relative group">
                            <div className="w-full aspect-square min-w-[200px] rounded-[2rem] bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02] duration-300">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={48} className="text-gray-200" />
                                )}
                            </div>
                            <label className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-4 rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700 active:scale-90 transition-all border-4 border-white z-10">
                                <Camera size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">{form.name || "Product"}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Click camera to update media</p>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-[2rem] space-y-4 shadow-2xl relative overflow-hidden text-white">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10 flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/10 rounded-xl text-blue-400"><Activity size={16}/></div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Live Inventory</h3>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Stock *</label>
                                <input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white font-black text-sm focus:bg-white/10 focus:border-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Low Stock Alert</label>
                                <input name="alarm_when_stock_is_lessthanOrEqualto" type="number" value={form.alarm_when_stock_is_lessthanOrEqualto} onChange={handleChange} className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-rose-400 font-black text-sm focus:bg-white/10 focus:border-rose-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-blue-600 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Essential Information</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name *</label>
                                <div className="relative">
                                    <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input name="name" value={form.name} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                                </div>
                                {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product SKU / Code</label>
                                <div className="relative">
                                    <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input name="product_code" value={form.product_code} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-black text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all uppercase" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Pricing Strategy</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Cost Price</label>
                                <div className="relative">
                                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                                    <input type="number" name="purchase_price" value={form.purchase_price} onChange={handleChange} className="w-full bg-emerald-50/30 border-2 border-emerald-100 p-4 pl-12 rounded-2xl font-black text-emerald-700 focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Selling Price</label>
                                <div className="relative">
                                    <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                    <input type="number" name="selling_price" value={form.selling_price} onChange={handleChange} className="w-full bg-blue-50/30 border-2 border-blue-100 p-4 pl-12 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 outline-none transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-purple-500 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Organization</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <FieldLabel label="Category" icon={<Layers size={10}/>} />
                                    <Select name="category" options={options.categories} value={options.categories.find(o => o.value === form.category)} onChange={handleSelectChange} styles={customSelectStyles} />
                                </div>
                                <div>
                                    <FieldLabel label="Sub-Category" icon={<GitCommit size={10}/>} />
                                    <Select name="sub_category" options={filteredSubCategories} value={options.subCategories.find(o => o.value === form.sub_category)} onChange={handleSelectChange} styles={customSelectStyles} isDisabled={!form.category} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <FieldLabel label="Brand" icon={<Package size={10}/>} />
                                    <Select name="brand" options={options.brands} value={options.brands.find(o => o.value === form.brand)} onChange={handleSelectChange} styles={customSelectStyles} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FieldLabel label="Unit" icon={<Scale size={10}/>} />
                                        <Select name="unit" options={options.units} value={options.units.find(o => o.value === form.unit)} onChange={handleSelectChange} styles={customSelectStyles} />
                                    </div>
                                    <div>
                                        <FieldLabel label="Size" icon={<Maximize size={10}/>} />
                                        <Select name="size" options={options.sizes} value={options.sizes.find(o => o.value === form.size)} onChange={handleSelectChange} styles={customSelectStyles} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-orange-500 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Compliance & Warranty</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${form.warranty_status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            <ShieldCheck size={18} />
                                        </div>
                                        <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">Enable Warranty</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${form.warranty_status ? 'bg-blue-600' : 'bg-gray-300'}`} onClick={() => setFormField("warranty_status", !form.warranty_status)}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.warranty_status ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                {form.warranty_status && (
                                    <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                        <FieldLabel label="Select Plan" icon={<FileClock size={10}/>} />
                                        <Select name="warranty_period" options={options.warrantyPeriods} value={options.warrantyPeriods.find(o => o.value === form.warranty_period)} onChange={handleSelectChange} styles={customSelectStyles} placeholder="Choose Warranty..." />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${form.has_expiry ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            <Calendar size={18} />
                                        </div>
                                        <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">Expiry Tracking</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${form.has_expiry ? 'bg-orange-500' : 'bg-gray-300'}`} onClick={() => setFormField("has_expiry", !form.has_expiry)}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.has_expiry ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 mt-2">
                                    <Info size={12} className="text-gray-400 mt-0.5 shrink-0" />
                                    <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight tracking-tight">Batch tracking enabled for expiry validation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default UpdateProductModal;
