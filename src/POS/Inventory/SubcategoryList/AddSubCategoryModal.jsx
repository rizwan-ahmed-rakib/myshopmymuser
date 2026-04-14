import React, { useState } from "react";
import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";

const AddSubCategoryModal = ({ isOpen, onClose, onSuccess }) => {

    const initialFormState = {
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
    };

    const [form, setForm] = useState(initialFormState);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files[0];
            setForm(prev => ({
                ...prev,
                image: file
            }));

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewImage(null);
            }
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await posSubCategoryAPI.create(form);

            if (onSuccess) {
                onSuccess(res.data);
            }

            resetForm();
            onClose();

        } catch (err) {
            console.error("API Error:", err);
            if (err.response?.data) {
                setErrors(err.response.data);
                alert("Error creating product: " + JSON.stringify(err.response.data));
            } else {
                alert("An unknown error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm(initialFormState);
        setPreviewImage(null);
        setErrors({});
    };
    
    const handleImageUploadClick = () => {
        document.getElementById("product-image-upload").click();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Image and Core Info */}
                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                                <div className="mx-auto w-40 h-40 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center border">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400">No Image</span>
                                    )}
                                </div>
                                <input id="product-image-upload" type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                                <button type="button" onClick={handleImageUploadClick} className="mt-2 text-sm text-blue-600 hover:underline">
                                    Upload Image
                                </button>
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input className="w-full p-2 border border-gray-300 rounded-lg" name="name" placeholder="e.g., Click Fan" value={form.name} onChange={handleChange} required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Code/SKU *</label>
                                <input className="w-full p-2 border border-gray-300 rounded-lg" name="product_code" placeholder="e.g., CKF-001" value={form.product_code} onChange={handleChange} required />
                                {errors.product_code && <p className="text-red-500 text-xs mt-1">{errors.product_code}</p>}
                            </div>
                        </div>

                        {/* Right Column - Pricing, Stock, and IDs */}
                        <div className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
                                    <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded-lg" name="purchase_price" placeholder="0.00" value={form.purchase_price} onChange={handleChange} required />
                                    {errors.purchase_price && <p className="text-red-500 text-xs mt-1">{errors.purchase_price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                                    <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded-lg" name="selling_price" placeholder="0.00" value={form.selling_price} onChange={handleChange} required />
                                    {errors.selling_price && <p className="text-red-500 text-xs mt-1">{errors.selling_price}</p>}
                                </div>
                             </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock *</label>
                                <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="stock" placeholder="0" value={form.stock} onChange={handleChange} required />
                                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                            </div>
                            
                            <p className="text-xs text-gray-500 pt-2">Enter the corresponding IDs. These can be replaced with dropdowns later.</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category ID *</label>
                                    <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="category" placeholder="e.g., 2" value={form.category} onChange={handleChange} required />
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category ID</label>
                                    <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="sub_category" placeholder="e.g., 3" value={form.sub_category} onChange={handleChange} />
                                    {errors.sub_category && <p className="text-red-500 text-xs mt-1">{errors.sub_category}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand ID</label>
                                    <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="brand" placeholder="e.g., 2" value={form.brand} onChange={handleChange} />
                                    {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID</label>
                                    <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="unit" placeholder="e.g., 1" value={form.unit} onChange={handleChange} />
                                    {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Size ID</label>
                                    <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="size" placeholder="e.g., 1" value={form.size} onChange={handleChange} />
                                    {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50" disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
                            {loading ? "Adding..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategoryModal;