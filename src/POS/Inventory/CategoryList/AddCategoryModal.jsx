import React, { useState } from "react";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";

const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {

    const initialFormState = {
        title: "",
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
            const res = await posCategoryAPI.create(form);

            if (onSuccess) {
                onSuccess(res.data);
            }

            resetForm();
            onClose();

        } catch (err) {
            console.error("API Error:", err);
            if (err.response?.data) {
                setErrors(err.response.data);
                alert("Error creating category: " + JSON.stringify(err.response.data));
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
        document.getElementById("category-image-upload").click();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Category</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                            <div className="mx-auto w-40 h-40 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center border">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400">No Image</span>
                                )}
                            </div>
                            <input id="category-image-upload" type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                            <button type="button" onClick={handleImageUploadClick} className="mt-2 text-sm text-blue-600 hover:underline">
                                Upload Image
                            </button>
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Title *</label>
                            <input className="w-full p-2 border border-gray-300 rounded-lg" name="title" placeholder="e.g., Electronics" value={form.title} onChange={handleChange} required />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50" disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
                            {loading ? "Adding..." : "Add Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;