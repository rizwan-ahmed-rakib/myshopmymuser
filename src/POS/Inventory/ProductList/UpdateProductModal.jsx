import React, {useState, useEffect, useCallback} from "react";
import Select from "react-select";
import axios from "axios";
import {
    Package, Tag, Layers, GitCommit,
    Scale, Maximize, ShieldCheck, Calendar, Info, Image as ImageIcon,
    DollarSign, Target, Activity, Settings, FileClock, Boxes, FlaskConical,
    Bell, Plus, Check, Boxes as BoxesIcon,
} from 'lucide-react';
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posCategoryAPI} from "../../../context_or_provider/pos/categories/categoryAPI";
import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import {posBrandAPI} from "../../../context_or_provider/pos/brands/brandAPI";
import {posUnitAPI} from "../../../context_or_provider/pos/units/unitAPI";
import {posSizeAPI} from "../../../context_or_provider/pos/sizes/sizeAPI";
import {posWarrantyPeriodAPI} from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";
import BASE_URL_of_POS from "../../../posConfig";
import BaseModal from "../../components/BaseModal";
import {useForm} from "../../../hooks/profile";
import ImagePicker from "../../components/imagecapture/ImagePicker";

const specificationAPI = {
    getAll: () => axios.get(`${BASE_URL_of_POS}/api/products/specification/`),
};

/* ═══════════════════════════════════════════════
   🎯 MODULE-LEVEL HELPERS (focus preservation)
   ═══════════════════════════════════════════════ */
const SmallLabel = ({children}) => (
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 flex items-center gap-1">
        {children}
    </label>
);

const InputField = ({name, value, onChange, placeholder, type = "text", icon = null, extra = ""}) => (
    <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-gray-50 border-2 border-gray-100 ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2 rounded-xl font-bold text-sm text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all ${extra}`}
        />
    </div>
);

const SliderToggle = ({checked, onChange, color = "blue", title}) => {
    const colorMap = {blue: "bg-blue-600", orange: "bg-orange-500"};
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            title={title}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${
                checked ? (colorMap[color] || colorMap.blue) : 'bg-gray-300'
            }`}
        >
            <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 flex items-center justify-center ${
                    checked ? 'left-[22px]' : 'left-0.5'
                }`}
            >
                {checked && (
                    <Check
                        size={10}
                        className={color === 'orange' ? 'text-orange-500' : 'text-blue-600'}
                        strokeWidth={4}
                    />
                )}
            </span>
        </button>
    );
};

/* ═══════════════════════════════════════════════
   🆕 Warranty Quick Add Modal
   ═══════════════════════════════════════════════ */
const WarrantyQuickAddModal = ({isOpen, onClose, onSave, existingOptions = []}) => {
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [periodType, setPeriodType] = useState("month");
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setDuration("");
            setPeriodType("month");
            setLocalError("");
        }
    }, [isOpen]);

    useEffect(() => {
        const trimmed = name.trim().toLowerCase();
        if (trimmed && existingOptions.some(opt => opt.label.toLowerCase().startsWith(trimmed))) {
            setLocalError("এই Warranty আগেই আছে!");
        } else {
            setLocalError("");
        }
    }, [name, existingOptions]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (localError || !name.trim() || !duration) return;

        setLoading(true);
        try {
            await onSave({
                name: name.trim(),
                duration: parseInt(duration),
                period_type: periodType,
                is_active: true,
            });
            onClose();
        } catch (err) {
            console.error("Warranty quick add failed:", err);
            const errorMsg = err.response?.data?.name || err.response?.data?.detail || "Something went wrong.";
            alert("Error: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Quick Add Warranty Period"
            size="sm"
            icon={<ShieldCheck className="text-blue-600"/>}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Warranty"
            isLoading={loading}
        >
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Warranty Name *
                    </label>
                    <input
                        className={`w-full p-3 border-2 rounded-2xl font-bold outline-none transition-all ${
                            localError
                                ? 'border-rose-200 bg-rose-50'
                                : 'border-gray-100 focus:border-blue-500 bg-gray-50'
                        }`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                        placeholder="e.g. Standard Warranty"
                    />
                    {localError &&
                        <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{localError}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                            Duration *
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="w-full p-3 border-2 border-gray-100 bg-gray-50 rounded-2xl font-bold outline-none focus:border-blue-500"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                            placeholder="e.g. 12"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                            Type *
                        </label>
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

                {name && duration && (
                    <div
                        className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 text-[10px] text-blue-700 font-bold text-center">
                        🛡️ {name} — {duration} {periodType}{parseInt(duration) > 1 ? "s" : ""}
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

/* ═══════════════════════════════════════════════
   Main Update Product Modal
   ═══════════════════════════════════════════════ */
const UpdateProductModal = ({isOpen, onClose, onSuccess, productData}) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isWarrantyQuickAddOpen, setIsWarrantyQuickAddOpen] = useState(false);

    const [options, setOptions] = useState({
        categories: [], subCategories: [], brands: [],
        units: [], sizes: [], warrantyPeriods: [], specifications: [],
    });

    const {form, errors, handleChange, setFormData, validateForm, setFormField} = useForm(
        {
            name: "", product_code: "", purchase_price: "", selling_price: "",
            alarm_when_stock_is_lessthanOrEqualto: 0,
            category: "", sub_category: "", specification: "",
            brand: "", size: "", unit: "",
            warranty_status: false, warranty_period: "",
            has_expiry: false, instance_tracking_mode: "serial",
            /* 🆕 Carton hierarchy */
            boxes_per_carton: 0,
            strips_per_box: 0,
            pcs_per_strip: 0,
        },
        {
            name: (v) => !v ? "Product name is required" : null,
            category: (v) => !v ? "Category is required" : null,
        }
    );

    const fetchOptions = useCallback(async () => {
        try {
            const [catRes, subCatRes, brandRes, unitRes, sizeRes, warrantyRes, specRes] = await Promise.all([
                posCategoryAPI.getAll(),
                posSubCategoryAPI.getAll(),
                posBrandAPI.getAll(),
                posUnitAPI.getAll(),
                posSizeAPI.getAll(),
                posWarrantyPeriodAPI.getAll(),
                specificationAPI.getAll().catch(() => ({data: []})),
            ]);

            setOptions({
                categories: catRes.data.map(item => ({value: item.id, label: item.title})),
                subCategories: subCatRes.data.map(item => ({
                    value: item.id,
                    label: item.title,
                    categoryId: item.category
                })),
                brands: brandRes.data.map(item => ({value: item.id, label: item.title})),
                units: unitRes.data.map(item => ({value: item.id, label: item.title})),
                sizes: sizeRes.data.map(item => ({value: item.id, label: item.title})),
                warrantyPeriods: warrantyRes.data.map(item => ({
                    value: item.id,
                    label: `${item.name} (${item.duration} ${item.period_type}${item.duration > 1 ? 's' : ''})`
                })),
                specifications: (specRes.data || []).map(item => ({value: item.id, label: item.title})),
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
                    alarm_when_stock_is_lessthanOrEqualto: productData.alarm_when_stock_is_lessthanOrEqualto || 0,
                    category: productData.category || "",
                    sub_category: productData.sub_category || "",
                    specification: productData.specification || "",
                    brand: productData.brand || "",
                    size: productData.size || "",
                    unit: productData.unit || "",
                    warranty_status: productData.warranty_status || false,
                    warranty_period: productData.warranty_period || "",
                    has_expiry: productData.has_expiry || false,
                    instance_tracking_mode: productData.instance_tracking_mode || "serial",
                    /* 🆕 Carton hierarchy */
                    boxes_per_carton: productData.boxes_per_carton || 0,
                    strips_per_box: productData.strips_per_box || 0,
                    pcs_per_strip: productData.pcs_per_strip || 0,
                });
                setPreviewImage(productData.image || null);
                setImageFile(null);
            }
        }
    }, [productData, isOpen, setFormData, fetchOptions]);

    const handleSelectChange = (selectedOption, actionMeta) => {
        const {name} = actionMeta;
        const val = selectedOption ? selectedOption.value : "";
        setFormField(name, val);
        if (name === "category") setFormField("sub_category", "");
    };

    const handleImageChange = (fileOrEvent) => {
        const file = fileOrEvent?.target?.files?.[0] || fileOrEvent;
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageClear = () => {
        setImageFile(null);
        setPreviewImage(null);
    };

    /* 🆕 Warranty Quick Add Save */
    const handleWarrantyQuickAddSave = async (data) => {
        const response = await posWarrantyPeriodAPI.create(data);
        const newWarranty = {
            value: response.data.id,
            label: `${response.data.name} (${response.data.duration} ${response.data.period_type}${response.data.duration > 1 ? 's' : ''})`
        };
        setOptions(prev => ({
            ...prev,
            warrantyPeriods: [newWarranty, ...prev.warrantyPeriods]
        }));
        setFormField("warranty_period", newWarranty.value);
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
                alarm_when_stock_is_lessthanOrEqualto: parseInt(form.alarm_when_stock_is_lessthanOrEqualto) || 0,
                /* 🆕 Carton hierarchy */
                boxes_per_carton: parseInt(form.boxes_per_carton) || 0,
                strips_per_box: parseInt(form.strips_per_box) || 0,
                pcs_per_strip: parseInt(form.pcs_per_strip) || 0,
                specification: form.specification || null,
                warranty_period: form.warranty_status ? (form.warranty_period || null) : null,
            };
            if (imageFile) dataToSend.image = imageFile;

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

    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '34px',
            height: '34px',
            borderRadius: '0.75rem',
            borderColor: state.isFocused ? '#3B82F6' : '#E5E7EB',
            borderWidth: '2px',
            backgroundColor: '#F9FAFB',
            boxShadow: 'none',
            fontSize: '12px',
            '&:hover': {borderColor: '#3B82F6'}
        }),
        valueContainer: (provided) => ({...provided, padding: '0 8px'}),
        input: (provided) => ({...provided, margin: 0, padding: 0}),
        indicatorsContainer: (provided) => ({...provided, height: '34px'}),
        menu: (provided) => ({...provided, zIndex: 9999, borderRadius: '0.75rem', overflow: 'hidden'}),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
            color: state.isSelected ? 'white' : '#1F2937',
            fontWeight: 'bold',
            fontSize: '11px',
            padding: '6px 10px'
        })
    };

    /* 🆕 Carton math */
    const cartonPcs = (Number(form.boxes_per_carton) || 0)
        * (Number(form.strips_per_box) || 0)
        * (Number(form.pcs_per_strip) || 0);
    const boxPcs = (Number(form.strips_per_box) || 0) * (Number(form.pcs_per_strip) || 0);

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title="Update Product Details"
                subtitle={`Ref: #PRD-${productData?.id}`}
                size="3xl"
                icon={<Settings/>}
                showFooter={true}
                onSubmit={handleSubmit}
                submitText="Save Changes"
                isLoading={loading}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                    {/* ═════════ LEFT PANEL ═════════ */}
                    <div className="lg:col-span-3 space-y-3">
                        <div
                            className="bg-gray-50 p-3 rounded-2xl border-2 border-gray-100 flex flex-col items-center text-center">
                            <ImagePicker
                                value={previewImage}
                                onChange={handleImageChange}
                                onClear={handleImageClear}
                                shape="square"
                                size="md"
                                placeholder={<ImageIcon size={32} className="text-gray-200"/>}
                                label=""
                            />
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 truncate w-full">
                                {form.name || "Product"}
                            </p>
                        </div>

                        <div className="bg-gray-900 p-3 rounded-2xl text-white space-y-2.5">
                            <div className="flex items-center gap-2">
                                <Activity size={14} className="text-blue-400"/>
                                <span className="text-[10px] font-black uppercase tracking-widest">Live Stock</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span
                                        className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Stock</span>
                                    <span className="text-[8px] font-black uppercase text-gray-500">🔒</span>
                                </div>
                                <span className="text-xl font-black text-emerald-400 font-mono">
                                    {productData?.stock ?? 0}
                                </span>
                            </div>
                            <div>
                                <label
                                    className="text-[9px] font-black text-rose-400 uppercase tracking-widest ml-1 mb-1 flex items-center gap-1">
                                    <Bell size={9}/> Low Alert
                                </label>
                                <input
                                    name="alarm_when_stock_is_lessthanOrEqualto"
                                    type="number"
                                    value={form.alarm_when_stock_is_lessthanOrEqualto}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-rose-400 font-black text-sm focus:bg-white/10 focus:border-rose-500 outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tight leading-tight">
                                ⚠️ Stock পরিবর্তন করতে Purchase/Sale করুন
                            </p>
                        </div>
                    </div>

                    {/* ═════════ RIGHT PANEL ═════════ */}
                    <div className="lg:col-span-9 space-y-3">

                        {/* Row 1: Essential + Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                            <div className="md:col-span-3">
                                <SmallLabel><Package size={9}/> Product Name *</SmallLabel>
                                <InputField name="name" value={form.name} onChange={handleChange}
                                            placeholder="Product name" icon={<Package size={14}/>}/>
                                {errors.name &&
                                    <p className="text-rose-500 text-[9px] font-bold uppercase mt-0.5 ml-1">{errors.name}</p>}
                            </div>
                            <div className="md:col-span-3">
                                <SmallLabel><Tag size={9}/> SKU / Code</SmallLabel>
                                <InputField name="product_code" value={form.product_code} onChange={handleChange}
                                            placeholder="AUTO-GENERATE" icon={<Tag size={14}/>} extra="uppercase"/>
                            </div>
                            <div className="md:col-span-3">
                                <SmallLabel><DollarSign size={9}/> Cost Price</SmallLabel>
                                <InputField name="purchase_price" value={form.purchase_price} onChange={handleChange}
                                            type="number" placeholder="0.00"
                                            icon={<DollarSign size={14} className="text-emerald-500"/>}
                                            extra="text-emerald-700 bg-emerald-50/30 border-emerald-100 focus:border-emerald-500"/>
                            </div>
                            <div className="md:col-span-3">
                                <SmallLabel><Target size={9}/> Selling Price</SmallLabel>
                                <InputField name="selling_price" value={form.selling_price} onChange={handleChange}
                                            type="number" placeholder="0.00"
                                            icon={<Target size={14} className="text-blue-500"/>}
                                            extra="text-blue-700 bg-blue-50/30 border-blue-100 focus:border-blue-500"/>
                            </div>
                        </div>

                        {/* Row 2: Organization */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                                    Organization
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                                <div className="col-span-2 md:col-span-2">
                                    <SmallLabel><Layers size={9}/> Category</SmallLabel>
                                    <Select name="category" options={options.categories}
                                            value={options.categories.find(o => o.value === form.category)}
                                            onChange={handleSelectChange} styles={selectStyles}/>
                                </div>
                                <div className="col-span-2 md:col-span-2">
                                    <SmallLabel><GitCommit size={9}/> Sub-Category</SmallLabel>
                                    <Select name="sub_category" options={filteredSubCategories}
                                            value={options.subCategories.find(o => o.value === form.sub_category)}
                                            onChange={handleSelectChange} styles={selectStyles}
                                            isDisabled={!form.category}/>
                                </div>
                                <div className="col-span-2 md:col-span-2">
                                    <SmallLabel><FlaskConical size={9}/> Specification</SmallLabel>
                                    <Select name="specification" options={options.specifications}
                                            value={options.specifications.find(o => o.value === form.specification)}
                                            onChange={handleSelectChange} styles={selectStyles}
                                            placeholder="Generic / Material"/>
                                </div>
                                <div className="col-span-2 md:col-span-2">
                                    <SmallLabel><Package size={9}/> Brand</SmallLabel>
                                    <Select name="brand" options={options.brands}
                                            value={options.brands.find(o => o.value === form.brand)}
                                            onChange={handleSelectChange} styles={selectStyles}/>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <SmallLabel><Scale size={9}/> Unit</SmallLabel>
                                    <Select name="unit" options={options.units}
                                            value={options.units.find(o => o.value === form.unit)}
                                            onChange={handleSelectChange} styles={selectStyles}/>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <SmallLabel><Maximize size={9}/> Size</SmallLabel>
                                    <Select name="size" options={options.sizes}
                                            value={options.sizes.find(o => o.value === form.size)}
                                            onChange={handleSelectChange} styles={selectStyles}/>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Box Config — 🆕 Carton + Box + Strip + Pcs */}
                        <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-3">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <div className="w-1 h-4 bg-teal-500 rounded-full"></div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-teal-700">
                                    Box Configuration
                                </h3>
                                {cartonPcs > 0 && (
                                    <span
                                        className="ml-auto text-[10px] font-black text-teal-700 bg-white px-2 py-0.5 rounded-full border border-teal-200">
                                        📦 ১ কার্টন = {cartonPcs.toLocaleString()} পিস
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <SmallLabel><BoxesIcon size={9}/> Boxes per Carton</SmallLabel>
                                    <input type="number" name="boxes_per_carton"
                                           value={form.boxes_per_carton} onChange={handleChange}
                                           placeholder="0"
                                           className="w-full bg-white border-2 border-teal-200 py-2 px-3 rounded-xl font-black text-sm text-teal-800 focus:border-teal-500 outline-none"/>
                                </div>
                                <div>
                                    <SmallLabel>Strips per Box</SmallLabel>
                                    <input type="number" name="strips_per_box"
                                           value={form.strips_per_box} onChange={handleChange}
                                           placeholder="0"
                                           className="w-full bg-white border-2 border-teal-200 py-2 px-3 rounded-xl font-black text-sm text-teal-800 focus:border-teal-500 outline-none"/>
                                </div>
                                <div>
                                    <SmallLabel>Pcs per Strip</SmallLabel>
                                    <input type="number" name="pcs_per_strip"
                                           value={form.pcs_per_strip} onChange={handleChange}
                                           placeholder="0"
                                           className="w-full bg-white border-2 border-teal-200 py-2 px-3 rounded-xl font-black text-sm text-teal-800 focus:border-teal-500 outline-none"/>
                                </div>
                            </div>

                            {/* 🆕 Hierarchy summary */}
                            {(Number(form.boxes_per_carton) > 0 || Number(form.strips_per_box) > 0 || Number(form.pcs_per_strip) > 0) && (
                                <div
                                    className="mt-2 pt-2 border-t border-teal-100 flex flex-wrap gap-2 text-[9px] font-black text-teal-700">
                                    {Number(form.boxes_per_carton) > 0 && (
                                        <span className="bg-white px-2 py-0.5 rounded-md border border-teal-200">
                                            ১ কার্টন = {form.boxes_per_carton} বক্স
                                        </span>
                                    )}
                                    {boxPcs > 0 && (
                                        <span className="bg-white px-2 py-0.5 rounded-md border border-teal-200">
                                            ১ বক্স = {boxPcs} পিস
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Row 4: Warranty + Expiry — slider toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Warranty Card */}
                            <div className={`p-3 rounded-2xl border-2 transition-all ${
                                form.warranty_status
                                    ? "bg-blue-50/50 border-blue-200"
                                    : "bg-gray-50 border-gray-100"
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-all duration-200 ${
                                        form.warranty_status
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                            : 'bg-gray-200 text-gray-400'
                                    }`}>
                                        <ShieldCheck size={18} strokeWidth={2.5}/>
                                    </div>
                                    <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight flex-1">
                                        Enable Warranty
                                    </p>
                                    {form.warranty_status && (
                                        <span
                                            className="text-[8px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            ✓ Active
                                        </span>
                                    )}
                                    <SliderToggle
                                        checked={form.warranty_status}
                                        onChange={() => setFormField("warranty_status", !form.warranty_status)}
                                        color="blue"
                                        title={form.warranty_status ? "Disable Warranty" : "Enable Warranty"}
                                    />
                                </div>

                                {form.warranty_status && (
                                    <div className="mt-3 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex justify-between items-center ml-1 mb-1">
                                            <label
                                                className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                <FileClock size={9}/> Select Plan
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setIsWarrantyQuickAddOpen(true)}
                                                className="p-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                                                title="Add new warranty"
                                            >
                                                <Plus size={11} strokeWidth={4}/>
                                            </button>
                                        </div>
                                        <Select
                                            name="warranty_period"
                                            options={options.warrantyPeriods}
                                            value={options.warrantyPeriods.find(o => o.value === form.warranty_period)}
                                            onChange={handleSelectChange}
                                            styles={selectStyles}
                                            placeholder="Choose Warranty..."
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Expiry Card */}
                            <div className={`p-3 rounded-2xl border-2 transition-all ${
                                form.has_expiry
                                    ? "bg-orange-50/50 border-orange-200"
                                    : "bg-gray-50 border-gray-100"
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-all duration-200 ${
                                        form.has_expiry
                                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                                            : 'bg-gray-200 text-gray-400'
                                    }`}>
                                        <Calendar size={18} strokeWidth={2.5}/>
                                    </div>
                                    <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight flex-1">
                                        Expiry Tracking
                                    </p>
                                    {form.has_expiry && (
                                        <span
                                            className="text-[8px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            ✓ Active
                                        </span>
                                    )}
                                    <SliderToggle
                                        checked={form.has_expiry}
                                        onChange={() => setFormField("has_expiry", !form.has_expiry)}
                                        color="orange"
                                        title={form.has_expiry ? "Disable Expiry" : "Enable Expiry"}
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-2 flex items-start gap-1.5 ml-11">
                                    <Info size={9} className="mt-0.5 shrink-0"/>
                                    Batch validation enable করবে
                                </p>
                            </div>
                        </div>

                        {/* Row 5: Instance Tracking */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-4 bg-violet-500 rounded-full"></div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                                    Instance Tracking Mode
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button"
                                        onClick={() => setFormField("instance_tracking_mode", "serial")}
                                        className={`p-3 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                                            form.instance_tracking_mode === "serial"
                                                ? "border-violet-500 bg-violet-50 shadow-sm"
                                                : "border-gray-100 bg-gray-50 hover:border-violet-200"
                                        }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div
                                            className={`p-1.5 rounded-lg ${form.instance_tracking_mode === "serial" ? "bg-violet-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                                            <Tag size={12}/>
                                        </div>
                                        <p className="text-[10px] font-black text-gray-800 uppercase">Serial / Unit</p>
                                        {form.instance_tracking_mode === "serial" && (
                                            <span
                                                className="ml-auto text-[8px] font-black bg-violet-500 text-white px-1.5 py-0.5 rounded-full uppercase">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight">
                                        প্রতিটি unit আলাদা। QR/Barcode দিয়ে track।
                                        <br/><span className="text-violet-500">TV, Fridge, Laptop</span>
                                    </p>
                                </button>

                                <button type="button"
                                        onClick={() => setFormField("instance_tracking_mode", "batch")}
                                        className={`p-3 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                                            form.instance_tracking_mode === "batch"
                                                ? "border-teal-500 bg-teal-50 shadow-sm"
                                                : "border-gray-100 bg-gray-50 hover:border-teal-200"
                                        }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div
                                            className={`p-1.5 rounded-lg ${form.instance_tracking_mode === "batch" ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                                            <Boxes size={12}/>
                                        </div>
                                        <p className="text-[10px] font-black text-gray-800 uppercase">Batch / Qty</p>
                                        {form.instance_tracking_mode === "batch" && (
                                            <span
                                                className="ml-auto text-[8px] font-black bg-teal-500 text-white px-1.5 py-0.5 rounded-full uppercase">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase leading-tight">
                                        Batch+expiry তে qty update। FEFO sale।
                                        <br/><span className="text-teal-500">Medicine, Food, Cosmetics</span>
                                    </p>
                                </button>
                            </div>
                            {form.has_expiry && form.instance_tracking_mode === "serial" && (
                                <div className="flex items-start gap-1.5 px-1 mt-2">
                                    <Info size={10} className="text-amber-500 mt-0.5 shrink-0"/>
                                    <p className="text-[8px] font-bold text-amber-500 uppercase leading-tight">
                                        Expiry tracking চালু — Medicine/FMCG হলে Batch mode ব্যবহার করুন।
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </BaseModal>

            {/* 🆕 Warranty Quick Add Sub-Modal */}
            <WarrantyQuickAddModal
                isOpen={isWarrantyQuickAddOpen}
                onClose={() => setIsWarrantyQuickAddOpen(false)}
                onSave={handleWarrantyQuickAddSave}
                existingOptions={options.warrantyPeriods}
            />
        </>
    );
};

export default UpdateProductModal;