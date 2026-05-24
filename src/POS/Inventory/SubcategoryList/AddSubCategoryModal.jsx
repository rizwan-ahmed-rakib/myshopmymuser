// import React, {useState, useCallback} from "react";
// import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";
//
// const AddSubCategoryModal = ({isOpen, onClose, onSuccess}) => {
//     // 🔹 ফ্রেশ স্টেট ক্রিয়েটের জন্য
//     const [form, setForm] = useState({title: ""});
//     const [imageFile, setImageFile] = useState(null);
//     const [previewImage, setPreviewImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//
//     // 🔹 ফর্ম রিসেট এবং ক্লোজ হ্যান্ডলার
//     const resetAndClose = useCallback(() => {
//         setForm({title: ""});
//         setPreviewImage(null);
//         setImageFile(null);
//         setErrors({});
//         onClose();
//     }, [onClose]);
//
//     if (!isOpen) return null;
//
//     const handleChange = (e) => {
//         const {name, value, files} = e.target;
//
//         if (name === "image") {
//             const file = files[0];
//             if (file) {
//                 setImageFile(file);
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     setPreviewImage(reader.result);
//                 };
//                 reader.readAsDataURL(file);
//             } else {
//                 setImageFile(null);
//                 setPreviewImage(null);
//             }
//         } else {
//             setForm(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };
//
//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
//     //     setLoading(true);
//     //     setErrors({});
//     //
//     //     // 💡 ইমেজ সহ ডেটা পাঠানোর জন্য FormData ব্যবহার করা হলো (মাল্টিপার্ট ফর্ম ডাটা)
//     //     const formData = new FormData();
//     //     formData.append("title", form.title);
//     //
//     //     if (imageFile) {
//     //         formData.append("image", imageFile);
//     //     }
//     //
//     //     try {
//     //         // আপনার API যদি সরাসরি FormData রিসিভ করে, তবে formData পাঠাবেন,
//     //         // আর যদি সাধারণ JSON নেয় (এবং ইমেজ আলাদা হ্যান্ডেল করে), তবে `form` অবজেক্ট পাঠাতে পারেন।
//     //         // জেনারেলি ইমেজ থাকলে formData-ই স্ট্যান্ডার্ড।
//     //         const res = await posSubCategoryAPI.create(formData);
//     //
//     //         if (onSuccess) {
//     //             // সাকসেসফুলি ক্রিয়েট হওয়া ডেটা পাস করা হচ্ছে
//     //             onSuccess(res.data);
//     //         }
//     //         resetAndClose();
//     //
//     //     } catch (err) {
//     //         console.error("API Error:", err);
//     //         if (err.response?.data) {
//     //             setErrors(err.response.data);
//     //         } else {
//     //             alert("An unknown error occurred. Please try again.");
//     //         }
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setErrors({});
//
//         // 🔥 FormData না বানিয়ে সাধারণ অবজেক্ট তৈরি করুন, api.js নিজে এটাকে FormData বানিয়ে নেবে
//         const payload = {
//             title: form.title,
//         };
//
//         if (imageFile) {
//             payload.image = imageFile;
//         }
//
//         try {
//             // payload অবজেক্টটি পাস করুন
//             const res = await posSubCategoryAPI.create(payload);
//
//             if (onSuccess) {
//                 onSuccess(res.data);
//             }
//             resetAndClose();
//
//         } catch (err) {
//             console.error("API Error:", err);
//             if (err.response?.data) {
//                 setErrors(err.response.data);
//             } else {
//                 alert("An unknown error occurred. Please try again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleImageUploadClick = () => {
//         document.getElementById("subcategory-image-upload-create").click();
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//             <div
//                 className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
//
//                 {/* Header */}
//                 <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
//                     <h2 className="text-xl font-bold text-gray-800">Add New Subcategory</h2>
//                     <button onClick={resetAndClose}
//                             className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
//                 </div>
//
//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="p-6">
//                     <div className="space-y-5">
//
//                         {/* Image Upload Area */}
//                         <div className="bg-gray-50 p-4 rounded-xl text-center border border-dashed border-gray-200">
//                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
//                                 Subcategory Image
//                             </label>
//
//                             <div
//                                 className="mx-auto w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shadow-inner group relative">
//                                 {previewImage ? (
//                                     <img src={previewImage} alt="Preview" className="w-full h-full object-cover"/>
//                                 ) : (
//                                     <div className="text-center p-2">
//                                         <span className="text-3xl block mb-1">📸</span>
//                                         <span className="text-xs text-gray-400">No Image</span>
//                                     </div>
//                                 )}
//                             </div>
//
//                             <input
//                                 id="subcategory-image-upload-create"
//                                 type="file"
//                                 name="image"
//                                 accept="image/*"
//                                 onChange={handleChange}
//                                 className="hidden"
//                             />
//
//                             <button
//                                 type="button"
//                                 onClick={handleImageUploadClick}
//                                 className="mt-3 px-3 py-1 bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
//                             >
//                                 {previewImage ? "Change Image" : "Upload Image"}
//                             </button>
//
//                             {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
//                         </div>
//
//                         {/* Title Input */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-1">
//                                 Subcategory Title <span className="text-rose-500">*</span>
//                             </label>
//                             <input
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
//                                 name="title"
//                                 placeholder="e.g., Men's Clothing, Electronics"
//                                 value={form.title}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
//                         </div>
//                     </div>
//
//                     {/* Action Buttons */}
//                     <div className="mt-6 pt-4 border-t flex justify-end space-x-2">
//                         <button
//                             type="button"
//                             onClick={resetAndClose}
//                             className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
//                             disabled={loading}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-5 py-2 bg-blue-600 text-sm font-semibold text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
//                             disabled={loading}
//                         >
//                             {loading ? "Saving..." : "Save Subcategory"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default AddSubCategoryModal;



import React, { useState, useEffect, useCallback } from "react";
import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import {posCategoryAPI} from "../../../context_or_provider/pos/categories/categoryAPI";
// import { posCategoryAPI } from "../../../utils/api"; // নিশ্চিত হয়ে নিন আপনার সঠিক পাথ অনুযায়ী
// import { posSubCategoryAPI } from "../../../utils/api";

const AddSubCategoryModal = ({ isOpen, onClose, onSuccess, productData }) => {
    // 🔹 ফরম স্টেট (এখন এখানে category ID ও থাকবে)
    const [form, setForm] = useState({ title: "", category: "" });
    const [categories, setCategories] = useState([]); // সব ক্যাটাগরি রাখার জন্য
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // 🔹 ড্রপডাউনের জন্য সমস্ত ক্যাটাগরি লোড করার ফাংশন
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

    // 🔹 ফরম রিসেট এবং ক্লোজ
    const resetAndClose = useCallback(() => {
        setForm({ title: "", category: "" });
        setPreviewImage(null);
        setImageFile(null);
        setErrors({});
        onClose();
    }, [onClose]);

    // 🔹 মোডাল ওপেন হলে ক্যাটাগরি লিস্ট লোড করা এবং ক্রিয়েট/আপডেট মোড ডিটেক্ট করা
    useEffect(() => {
        if (isOpen) {
            fetchCategories(); // মোডাল খুললেই ক্যাটাগরি ড্রপডাউন ডাটা নিয়ে আসবে

            if (productData) {
                // 📝 যদি productData থাকে -> Update Mode
                setForm({
                    title: productData.title || "",
                    category: productData.category || "", // জ্যাঙ্গো ফরেন কি-র ID
                });
                if (productData.image) {
                    setPreviewImage(productData.image);
                }
            } else {
                // ➕ যদি productData না থাকে -> Create Mode
                setForm({ title: "", category: "" });
                setPreviewImage(null);
                setImageFile(null);
            }
            setErrors({});
        }
    }, [isOpen, productData, fetchCategories]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files[0];
            if (file) {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setImageFile(null);
                setPreviewImage(productData?.image || null);
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

        // 💡 api.js এর রুলস অনুযায়ী আমরা একটি প্লেইন অবজেক্ট পাঠাবো
        const payload = {
            title: form.title,
            category: form.category, // ফরেন কি আইডি ডাটাবেজে পুশ হবে
        };

        if (imageFile) {
            payload.image = imageFile;
        }

        try {
            let res;
            if (productData?.id) {
                // 🔄 যদি আইডি থাকে, তবে আপডেট এপিআই কল হবে
                res = await posSubCategoryAPI.update(productData.id, payload);
            } else {
                // ➕ আইডি না থাকলে নতুন ক্রিয়েট এপিআই কল হবে
                res = await posSubCategoryAPI.create(payload);
            }

            if (onSuccess) {
                onSuccess(res.data);
            }
            resetAndClose();

        } catch (err) {
            console.error("API Error:", err);
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                alert("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImageUploadClick = () => {
        document.getElementById("subcategory-image-input").click();
    };

    const isUpdateMode = !!productData; // বুুলিয়ান ভ্যালু ট্রু হবে যদি আপডেট মোড হয়

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isUpdateMode ? "Update Subcategory" : "Add New Subcategory"}
                    </h2>
                    <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">

                        {/* Image Section */}
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-dashed border-gray-200">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subcategory Image</label>
                            <div className="mx-auto w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shadow-inner relative">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-2">
                                        <span className="text-3xl block mb-1">📸</span>
                                        <span className="text-xs text-gray-400">No Image</span>
                                    </div>
                                )}
                            </div>
                            <input id="subcategory-image-input" type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                            <button type="button" onClick={handleImageUploadClick} className="mt-3 px-3 py-1 bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50 shadow-sm">
                                {previewImage ? "Change Image" : "Upload Image"}
                            </button>
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                        </div>

                        {/* 🌟 ১. নতুন যুক্ত হওয়া ক্যাটাগরি ড্রপডাউন সিলেক্টর */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Select Parent Category <span className="text-rose-500">*</span>
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                disabled={categoriesLoading}
                            >
                                <option value="">-- {categoriesLoading ? "Loading Categories..." : "Choose a Category"} --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.title}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>

                        {/* ২. সাব-ক্যাটাগরি টাইটেল ইনপুট */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Subcategory Title <span className="text-rose-500">*</span>
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                name="title"
                                placeholder="e.g., Smart Phones, T-Shirts"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-6 pt-4 border-t flex justify-end space-x-2">
                        <button type="button" onClick={resetAndClose} className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50" disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="px-5 py-2 bg-blue-600 text-sm font-semibold text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm" disabled={loading}>
                            {loading ? (isUpdateMode ? "Updating..." : "Saving...") : (isUpdateMode ? "Update Subcategory" : "Save Subcategory")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategoryModal;