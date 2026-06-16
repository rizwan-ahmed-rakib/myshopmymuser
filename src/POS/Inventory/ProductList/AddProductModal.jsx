import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import {
    Plus, X, Loader2, Package, Tag, Layers, GitCommit,
    Scale, Maximize, ShieldCheck, Calendar, Info,
    Camera, Image as ImageIcon, DollarSign, Target, Activity, FileClock
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

// --- Quick Add Modal Component ---
const QuickAddModal = ({ isOpen, onClose, onSave, title, hasImage = false, existingOptions = [] }) => {
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [periodType, setPeriodType] = useState("month");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setDuration("");
            setPeriodType("month");
            setImage(null);
            setLocalError("");
        }
    }, [isOpen]);

    useEffect(() => {
        const trimmedName = name.trim().toLowerCase();
        if (trimmedName && existingOptions.some(opt => opt.label.trim().toLowerCase() === trimmedName)) {
            setLocalError(`This ${title} already exists!`);
        } else {
            setLocalError("");
        }
    }, [name, existingOptions, title]);

    if (!isOpen) return null;

    const isWarranty = title === "Warranty Period";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (localError) return;

        setLoading(true);
        try {
            const data = { title: name.trim() };
            if (isWarranty) {
                data.name = name.trim();
                data.duration = parseInt(duration);
                data.period_type = periodType;
                data.is_active = true;
            }
            if (hasImage && image) data.image = image;

            await onSave(data);
            onClose();
        } catch (err) {
            console.error("Quick add failed:", err);
            const errorMsg = err.response?.data?.title || err.response?.data?.detail || "Something went wrong.";
            alert("Error: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Quick Add ${title}`}
            size="sm"
            showFooter={true}
            onSubmit={handleSubmit}
            submitText={`Save ${title}`}
            isLoading={loading}
        >
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name *</label>
                    <input
                        className={`w-full p-3 border-2 rounded-2xl font-bold outline-none transition-all ${localError ? 'border-rose-200 bg-rose-50' : 'border-gray-100 focus:border-blue-500 bg-gray-50'}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                    />
                    {localError && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{localError}</p>}
                </div>

                {isWarranty && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration *</label>
                            <input
                                type="number"
                                className="w-full p-3 border-2 border-gray-100 bg-gray-50 rounded-2xl font-bold outline-none focus:border-blue-500"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type *</label>
                            <select
                                className="w-full p-3 border-2 border-gray-100 bg-gray-50 rounded-2xl font-bold outline-none focus:border-blue-500 appearance-none"
                                value={periodType}
                                onChange={(e) => setPeriodType(e.target.value)}
                            >
                                <option value="day">Day(s)</option>
                                <option value="month">Month(s)</option>
                                <option value="year">Year(s)</option>
                            </select>
                        </div>
                    </div>
                )}

                {hasImage && (
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Icon/Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-[10px] font-bold text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

// --- Main Add Product Modal ---
const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Options for dropdowns
    const [options, setOptions] = useState({
        categories: [],
        subCategories: [],
        brands: [],
        units: [],
        sizes: [],
        warrantyPeriods: []
    });

    // Quick Add Modal states
    const [quickAdd, setQuickAdd] = useState({ type: null, title: "", hasImage: false });

    const {
        form,
        errors,
        handleChange,
        resetForm,
        validateForm,
        setFormField,
        setFormData
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
            image: null,
            alarm_when_stock_is_lessthanOrEqualto: 0,
            warranty_status: false,
            warranty_period: "",
            has_expiry: false,
        },
        {
            name: (v) => !v ? "Product name is required" : null,
            category: (v) => !v ? "Category is required" : null,
            purchase_price: (v) => !v ? "Required" : isNaN(v) ? "Number only" : null,
            selling_price: (v) => !v ? "Required" : isNaN(v) ? "Number only" : null,
            stock: (v) => !v && v !== 0 ? "Required" : isNaN(v) ? "Number only" : null,
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
        }
    }, [isOpen, fetchOptions]);

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
            setFormField("image", file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
            setFormField("image", null);
        }
    };

    const handleQuickAddSave = async (data) => {
        let response;
        try {
            switch (quickAdd.type) {
                case "category":
                    response = await posCategoryAPI.create(data);
                    const newCat = { value: response.data.id, label: response.data.title };
                    setOptions(prev => ({ ...prev, categories: [newCat, ...prev.categories] }));
                    setFormField("category", newCat.value);
                    break;
                case "sub_category":
                    if (!form.category) return alert("Please select a category first");
                    response = await posSubCategoryAPI.create({ ...data, category: form.category });
                    const newSub = { value: response.data.id, label: response.data.title, categoryId: response.data.category };
                    setOptions(prev => ({ ...prev, subCategories: [newSub, ...prev.subCategories] }));
                    setFormField("sub_category", newSub.value);
                    break;
                case "brand":
                    response = await posBrandAPI.create(data);
                    const newBrand = { value: response.data.id, label: response.data.title };
                    setOptions(prev => ({ ...prev, brands: [newBrand, ...prev.brands] }));
                    setFormField("brand", newBrand.value);
                    break;
                case "unit":
                    response = await posUnitAPI.create(data);
                    const newUnit = { value: response.data.id, label: response.data.title };
                    setOptions(prev => ({ ...prev, units: [newUnit, ...prev.units] }));
                    setFormField("unit", newUnit.value);
                    break;
                case "size":
                    response = await posSizeAPI.create(data);
                    const newSize = { value: response.data.id, label: response.data.title };
                    setOptions(prev => ({ ...prev, sizes: [newSize, ...prev.sizes] }));
                    setFormField("size", newSize.value);
                    break;
                case "warranty":
                    response = await posWarrantyPeriodAPI.create({ ...data, is_active: true });
                    const newWarranty = {
                        value: response.data.id,
                        label: `${response.data.name} (${response.data.duration} ${response.data.period_type}${response.data.duration > 1 ? 's' : ''})`
                    };
                    setOptions(prev => ({ ...prev, warrantyPeriods: [newWarranty, ...prev.warrantyPeriods] }));
                    setFormField("warranty_period", newWarranty.value);
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.error("Quick add save failed:", err);
            throw err; // Let QuickAddModal handle it
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                ...form,
                purchase_price: parseFloat(form.purchase_price) || 0,
                selling_price: parseFloat(form.selling_price) || 0,
                stock: parseInt(form.stock) || 0,
                alarm_when_stock_is_lessthanOrEqualto: parseInt(form.alarm_when_stock_is_lessthanOrEqualto) || 0,
                category: form.category || null,
                sub_category: form.sub_category || null,
                brand: form.brand || null,
                size: form.size || null,
                unit: form.unit || null,
                warranty_period: form.warranty_status ? (form.warranty_period || null) : null,
            };

            const res = await posProductAPI.create(payload);
            onSuccess?.(res.data);
            handleClose();
        } catch (err) {
            console.error("Submit error:", err.response?.data);
            alert("Error: " + (err.response?.data ? JSON.stringify(err.response.data) : "An unknown error occurred."));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        setPreviewImage(null);
        onClose();
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

    const FieldLabel = ({ label, onAdd, isRequired = false, icon }) => (
        <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                {icon} {label} {isRequired && "*"}
            </label>
            {onAdd && (
                <button
                    type="button"
                    onClick={onAdd}
                    className="p-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                    title={`Add new ${label}`}
                >
                    <Plus size={12} strokeWidth={4} />
                </button>
            )}
        </div>
    );

    const getExistingOptions = () => {
        switch (quickAdd.type) {
            case 'category': return options.categories;
            case 'sub_category': return filteredSubCategories;
            case 'brand': return options.brands;
            case 'unit': return options.units;
            case 'size': return options.sizes;
            case 'warranty': return options.warrantyPeriods;
            default: return [];
        }
    };

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                title="Register New Product"
                subtitle="Create a high-fidelity inventory entry"
                size="xl"
                icon={<Package />}
                showFooter={true}
                onSubmit={handleSubmit}
                submitText="Save Product"
                isLoading={loading}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Image & Secondary Info */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Product Image Card */}
                        <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100 flex flex-col items-center text-center shadow-inner">
                            <div className="relative group">
                                <div className="w-full aspect-square min-w-[200px] rounded-[2rem] bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02] duration-300">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-200">
                                            <ImageIcon size={64} />
                                            <p className="text-[10px] font-black uppercase mt-2">No Image Selected</p>
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-4 rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700 active:scale-90 transition-all border-4 border-white z-10">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                                {previewImage && (
                                    <button
                                        type="button"
                                        onClick={() => { setPreviewImage(null); setFormField("image", null); }}
                                        className="absolute -top-3 -right-3 bg-rose-500 text-white p-2 rounded-xl shadow-lg hover:bg-rose-600 active:scale-90 transition-all z-10"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="mt-6">
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Display Media</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">HQ Preview recommended</p>
                            </div>
                        </div>

                        {/* Inventory Pulse */}
                        <div className="bg-gray-900 p-6 rounded-[2rem] space-y-4 shadow-2xl relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10 flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/10 rounded-xl text-blue-400"><Activity size={16}/></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em]">Stock Logic</h3>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Initial Stock Count *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-white font-black text-sm focus:bg-white/10 focus:border-blue-500 outline-none transition-all"
                                        placeholder="0"
                                    />
                                    {errors.stock && <p className="text-rose-400 text-[10px] font-bold uppercase mt-1 ml-1">{errors.stock}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Low Stock Threshold</label>
                                    <input
                                        type="number"
                                        name="alarm_when_stock_is_lessthanOrEqualto"
                                        value={form.alarm_when_stock_is_lessthanOrEqualto}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-rose-400 font-black text-sm focus:bg-white/10 focus:border-rose-500 outline-none transition-all"
                                        placeholder="0"
                                    />
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mt-1 ml-1">Trigger alert when stock dips below this</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Core Details & Settings */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Essential Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-blue-600 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Essential Information</h3></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name *</label>
                                    <div className="relative">
                                        <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input name="name" value={form.name} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="e.g. iPhone 15 Pro Max" />
                                    </div>
                                    {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product SKU / Code</label>
                                    <div className="relative">
                                        <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input name="product_code" value={form.product_code} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-black text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all uppercase" placeholder="AUTO-GENERATE" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Logic */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Pricing Logic</h3></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Cost Price *</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                                        <input type="number" name="purchase_price" value={form.purchase_price} onChange={handleChange} className="w-full bg-emerald-50/30 border-2 border-emerald-100 p-4 pl-12 rounded-2xl font-black text-emerald-700 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Retail Price *</label>
                                    <div className="relative">
                                        <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                        <input type="number" name="selling_price" value={form.selling_price} onChange={handleChange} className="w-full bg-blue-50/30 border-2 border-blue-100 p-4 pl-12 rounded-2xl font-black text-blue-700 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Organization Hierarchy */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-purple-500 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Organization</h3></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <FieldLabel label="Category" isRequired icon={<Layers size={10}/>} onAdd={() => setQuickAdd({ type: 'category', title: 'Category', hasImage: true })} />
                                        <Select name="category" options={options.categories} value={options.categories.find(o => o.value === form.category)} onChange={handleSelectChange} styles={customSelectStyles} placeholder="Select Category" />
                                        {errors.category && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.category}</p>}
                                    </div>
                                    <div>
                                        <FieldLabel label="Sub-Category" icon={<GitCommit size={10}/>} onAdd={() => setQuickAdd({ type: 'sub_category', title: 'Sub-Category', hasImage: true })} />
                                        <Select name="sub_category" options={filteredSubCategories} value={options.subCategories.find(o => o.value === form.sub_category)} onChange={handleSelectChange} styles={customSelectStyles} placeholder="Select Sub-Category" isDisabled={!form.category} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <FieldLabel label="Brand" icon={<Package size={10}/>} onAdd={() => setQuickAdd({ type: 'brand', title: 'Brand', hasImage: true })} />
                                        <Select name="brand" options={options.brands} value={options.brands.find(o => o.value === form.brand)} onChange={handleSelectChange} styles={customSelectStyles} placeholder="Select Brand" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <FieldLabel label="Unit" icon={<Scale size={10}/>} onAdd={() => setQuickAdd({ type: 'unit', title: 'Unit' })} />
                                            <Select name="unit" options={options.units} value={options.units.find(o => o.value === form.unit)} onChange={handleSelectChange} styles={customSelectStyles} placeholder="Unit" />
                                        </div>
                                        <div>
                                            <FieldLabel label="Size" icon={<Maximize size={10}/>} onAdd={() => setQuickAdd({ type: 'size', title: 'Size' })} />
                                            <Select name="size" options={options.sizes} value={options.sizes.find(o => o.value === form.size)} onChange={handleSelectChange} styles={customSelectStyles} placeholder="Size" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Settings */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3"><div className="w-1.5 h-6 bg-orange-500 rounded-full"></div><h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Compliance & Warranty</h3></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Warranty Logic */}
                                <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${form.warranty_status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                <ShieldCheck size={18} />
                                            </div>
                                            <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">Enable Warranty</p>
                                        </div>
                                        <div 
                                            className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${form.warranty_status ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            onClick={() => setFormField("warranty_status", !form.warranty_status)}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.warranty_status ? 'left-6' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                    {form.warranty_status && (
                                        <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                            <FieldLabel label="Select Plan" icon={<FileClock size={10}/>} onAdd={() => setQuickAdd({ type: 'warranty', title: 'Warranty Period' })} />
                                            <Select name="warranty_period" options={options.warrantyPeriods} value={options.warrantyPeriods.find(o => o.value === form.warranty_period)} onChange={handleSelectChange} styles={customSelectStyles} placeholder="Choose Warranty..." />
                                        </div>
                                    )}
                                </div>

                                {/* Expiry Logic */}
                                <div className="space-y-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${form.has_expiry ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                <Calendar size={18} />
                                            </div>
                                            <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">Expiry Tracking</p>
                                        </div>
                                        <div 
                                            className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${form.has_expiry ? 'bg-orange-500' : 'bg-gray-300'}`}
                                            onClick={() => setFormField("has_expiry", !form.has_expiry)}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.has_expiry ? 'left-6' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 mt-2">
                                        <Info size={12} className="text-gray-400 mt-0.5 shrink-0" />
                                        <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight tracking-tight">Track batches and prevent sales of expired items.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseModal>

            {/* Quick Add Sub-Modal */}
            <QuickAddModal
                isOpen={!!quickAdd.type}
                onClose={() => setQuickAdd({ type: null, title: "", hasImage: false })}
                onSave={handleQuickAddSave}
                title={quickAdd.title}
                hasImage={quickAdd.hasImage}
                existingOptions={getExistingOptions()}
            />
        </>
    );
};

export default AddProductModal;
