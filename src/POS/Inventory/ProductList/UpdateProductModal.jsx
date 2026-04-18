import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Plus, X, Loader2 } from "lucide-react";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";
import { posWarrantyPeriodAPI } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";

const UpdateProductModal = ({ isOpen, onClose, onSuccess, productData }) => {
    const initialFormState = {
        name: "",
        product_code: "",
        purchase_price: "",
        selling_price: "",
        stock: "",
        alarm_when_stock_is_lessthanOrEqualto: 0,
        category: "",
        sub_category: "",
        brand: "",
        size: "",
        unit: "",
        warranty_status: false,
        warranty_period: null,
        has_expiry: false,
    };

    const [form, setForm] = useState(initialFormState);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Options for dropdowns
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [units, setUnits] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [warrantyPeriods, setWarrantyPeriods] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchOptions();
        }
    }, [isOpen]);

    const fetchOptions = async () => {
        try {
            const [catRes, subCatRes, brandRes, unitRes, sizeRes, warrantyRes] = await Promise.all([
                posCategoryAPI.getAll(),
                posSubCategoryAPI.getAll(),
                posBrandAPI.getAll(),
                posUnitAPI.getAll(),
                posSizeAPI.getAll(),
                posWarrantyPeriodAPI.getAll()
            ]);

            setCategories(catRes.data.map(item => ({ value: item.id, label: item.title })));
            setSubCategories(subCatRes.data.map(item => ({ value: item.id, label: item.title, categoryId: item.category })));
            setBrands(brandRes.data.map(item => ({ value: item.id, label: item.title })));
            setUnits(unitRes.data.map(item => ({ value: item.id, label: item.title })));
            setSizes(sizeRes.data.map(item => ({ value: item.id, label: item.title })));
            setWarrantyPeriods(warrantyRes.data.map(item => ({
                value: item.id,
                label: `${item.name} (${item.duration} ${item.period_type}${item.duration > 1 ? 's' : ''})`
            })));
        } catch (err) {
            console.error("Error fetching options:", err);
        }
    };

    useEffect(() => {
        if (productData && isOpen) {
            setForm({
                name: productData.name || "",
                product_code: productData.product_code || "",
                purchase_price: productData.purchase_price || "",
                selling_price: productData.selling_price || "",
                stock: productData.stock || "",
                alarm_when_stock_is_lessthanOrEqualto: productData.alarm_when_stock_is_lessthanOrEqualto || 0,
                category: productData.category || "",
                sub_category: productData.sub_category || "",
                brand: productData.brand || "",
                size: productData.size || "",
                unit: productData.unit || "",
                warranty_status: productData.warranty_status || false,
                warranty_period: productData.warranty_period || null,
                has_expiry: productData.has_expiry || false,
                image: null,
            });
            if (productData.image) {
                setPreviewImage(productData.image);
            }
        } else {
            setForm(initialFormState);
            setPreviewImage(null);
            setErrors({});
        }
    }, [productData, isOpen]);


    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (name === "image") {
            const file = files[0];
            setForm(prev => ({ ...prev, image: file }));
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewImage(reader.result);
                reader.readAsDataURL(file);
            } else {
                setPreviewImage(productData.image);
            }
        } else if (type === "checkbox") {
            setForm(prev => ({ ...prev, [name]: checked }));
            if (name === "warranty_status" && !checked) {
                setForm(prev => ({ ...prev, warranty_period: null }));
            }
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setForm(prev => ({
            ...prev,
            [name]: selectedOption ? selectedOption.value : ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const payload = {
                ...form,
                purchase_price: parseFloat(form.purchase_price) || 0,
                selling_price: parseFloat(form.selling_price) || 0,
                stock: parseInt(form.stock) || 0,
                alarm_when_stock_is_lessthanOrEqualto: parseInt(form.alarm_when_stock_is_lessthanOrEqualto) || 0,
                warranty_period: form.warranty_status ? (form.warranty_period || null) : null,
            };

            const res = await posProductAPI.update(productData.id, payload);
            if (onSuccess) onSuccess(res.data);
            onClose();
        } catch (err) {
            console.error("API Error:", err);
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                alert("An unknown error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredSubCategories = subCategories.filter(
        sub => !form.category || sub.categoryId === form.category
    );

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '0.5rem',
            padding: '1px',
            borderColor: '#D1D5DB',
            '&:hover': { borderColor: '#3B82F6' }
        }),
        menu: (provided) => ({ ...provided, zIndex: 9999 })
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0 z-20">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Update Product</h2>
                        <p className="text-sm text-gray-500">Edit product details and settings</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Classification & Settings */}
                        <div className="space-y-6">
                            <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100 space-y-4">
                                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Classification</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Category *</label>
                                        <Select
                                            name="category"
                                            options={categories}
                                            value={categories.find(opt => opt.value === form.category)}
                                            onChange={handleSelectChange}
                                            styles={customSelectStyles}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700">Sub-Category</label>
                                        <Select
                                            name="sub_category"
                                            options={filteredSubCategories}
                                            value={subCategories.find(opt => opt.value === form.sub_category)}
                                            onChange={handleSelectChange}
                                            styles={customSelectStyles}
                                            isDisabled={!form.category}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-gray-700">Brand</label>
                                            <Select
                                                name="brand"
                                                options={brands}
                                                value={brands.find(opt => opt.value === form.brand)}
                                                onChange={handleSelectChange}
                                                styles={customSelectStyles}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-700">Unit</label>
                                            <Select
                                                name="unit"
                                                options={units}
                                                value={units.find(opt => opt.value === form.unit)}
                                                onChange={handleSelectChange}
                                                styles={customSelectStyles}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-100 space-y-4">
                                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider">Warranty & Expiry</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="warranty_status_update" name="warranty_status" checked={form.warranty_status} onChange={handleChange} />
                                        <label htmlFor="warranty_status_update" className="text-sm text-gray-700">Enable Warranty</label>
                                    </div>
                                    {form.warranty_status && (
                                        <Select
                                            name="warranty_period"
                                            options={warrantyPeriods}
                                            value={warrantyPeriods.find(opt => opt.value === form.warranty_period)}
                                            onChange={handleSelectChange}
                                            styles={customSelectStyles}
                                            placeholder="Select period..."
                                        />
                                    )}
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="has_expiry_update" name="has_expiry" checked={form.has_expiry} onChange={handleChange} />
                                        <label htmlFor="has_expiry_update" className="text-sm text-gray-700">Has Expiry Date</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Core Details & Image */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Product Name *</label>
                                    <input className="w-full p-2 border border-gray-300 rounded-lg" name="name" value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Purchase Price</label>
                                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="purchase_price" value={form.purchase_price} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Selling Price</label>
                                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="selling_price" value={form.selling_price} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Stock</label>
                                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="stock" value={form.stock} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Low Stock Alert</label>
                                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="alarm_when_stock_is_lessthanOrEqualto" value={form.alarm_when_stock_is_lessthanOrEqualto} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Product Image</label>
                                <div className="relative h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden group cursor-pointer" onClick={() => document.getElementById("update-image-upload").click()}>
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <Plus size={32} />
                                            <p className="text-xs mt-2">Click to upload</p>
                                        </div>
                                    )}
                                    <input id="update-image-upload" type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2 border rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                        <button type="submit" disabled={loading} className="px-10 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 font-bold shadow-lg shadow-blue-100 disabled:opacity-50">
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductModal;
