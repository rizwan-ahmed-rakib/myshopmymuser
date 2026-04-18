// // import React, { useState, useEffect } from "react";
// // import Select from "react-select";
// // import { Plus, X, Loader2 } from "lucide-react";
// // import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
// // import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
// // import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
// // import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
// // import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
// // import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";
// // import { posWarrantyPeriodAPI } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";
// //
// // // --- Quick Add Modal Component ---
// // const QuickAddModal = ({ isOpen, onClose, onSave, title, hasImage = false, existingOptions = [] }) => {
// //     const [name, setName] = useState("");
// //     const [image, setImage] = useState(null);
// //     const [loading, setLoading] = useState(false);
// //     const [localError, setLocalError] = useState("");
// //
// //     useEffect(() => {
// //         if (!isOpen) {
// //             setName("");
// //             setImage(null);
// //             setLocalError("");
// //         }
// //     }, [isOpen]);
// //
// //     // Live validation check for duplicates
// //     useEffect(() => {
// //         const trimmedName = name.trim().toLowerCase();
// //         if (trimmedName && existingOptions.some(opt => opt.label.trim().toLowerCase() === trimmedName)) {
// //             setLocalError(`This ${title} already exists!`);
// //         } else {
// //             setLocalError("");
// //         }
// //     }, [name, existingOptions, title]);
// //
// //     if (!isOpen) return null;
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         if (localError) return;
// //
// //         setLoading(true);
// //         try {
// //             const data = { title: name.trim() };
// //             if (hasImage && image) data.image = image;
// //
// //             // Wait for save to complete
// //             await onSave(data);
// //             // If onSave doesn't throw, it was successful
// //             onClose();
// //         } catch (err) {
// //             // Error occurred (e.g., API failed), we DO NOT call onClose()
// //             console.error("Quick add failed:", err);
// //             const errorMsg = err.response?.data?.title || err.response?.data?.detail || "Something went wrong. Please try again.";
// //             alert("Error: " + errorMsg);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     return (
// //         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
// //             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
// //                 <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
// //                     <h3 className="font-bold text-gray-800">Add New {title}</h3>
// //                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
// //                 </div>
// //                 <form onSubmit={handleSubmit} className="p-6 space-y-4">
// //                     <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
// //                         <input
// //                             className={`w-full p-2 border rounded-lg outline-none transition-all ${localError ? 'border-red-500 ring-1 ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
// //                             value={name}
// //                             onChange={(e) => setName(e.target.value)}
// //                             required
// //                             autoFocus
// //                         />
// //                         {localError && <p className="text-red-500 text-xs mt-1 font-medium">{localError}</p>}
// //                     </div>
// //                     {hasImage && (
// //                         <div>
// //                             <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
// //                             <input
// //                                 type="file"
// //                                 accept="image/*"
// //                                 className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
// //                                 onChange={(e) => setImage(e.target.files[0])}
// //                             />
// //                         </div>
// //                     )}
// //                     <div className="flex justify-end gap-3 pt-2">
// //                         <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
// //                         <button
// //                             type="submit"
// //                             disabled={loading || !name.trim() || !!localError}
// //                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
// //                         >
// //                             {loading && <Loader2 className="animate-spin" size={16} />}
// //                             Save {title}
// //                         </button>
// //                     </div>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // // --- Main Add Product Modal ---
// // const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
// //     const initialFormState = {
// //         name: "",
// //         product_code: "",
// //         purchase_price: "",
// //         selling_price: "",
// //         stock: "",
// //         category: "",
// //         sub_category: "",
// //         brand: "",
// //         size: "",
// //         unit: "",
// //         image: null,
// //     };
// //
// //     const [form, setForm] = useState(initialFormState);
// //     const [previewImage, setPreviewImage] = useState(null);
// //     const [loading, setLoading] = useState(false);
// //     const [errors, setErrors] = useState({});
// //
// //     // Options for dropdowns
// //     const [categories, setCategories] = useState([]);
// //     const [subCategories, setSubCategories] = useState([]);
// //     const [brands, setBrands] = useState([]);
// //     const [units, setUnits] = useState([]);
// //     const [sizes, setSizes] = useState([]);
// //
// //     // Quick Add Modal states
// //     const [quickAdd, setQuickAdd] = useState({ type: null, title: "", hasImage: false });
// //
// //     useEffect(() => {
// //         if (isOpen) {
// //             fetchOptions();
// //         }
// //     }, [isOpen]);
// //
// //     const fetchOptions = async () => {
// //         try {
// //             const [catRes, subCatRes, brandRes, unitRes, sizeRes] = await Promise.all([
// //                 posCategoryAPI.getAll(),
// //                 posSubCategoryAPI.getAll(),
// //                 posBrandAPI.getAll(),
// //                 posUnitAPI.getAll(),
// //                 posSizeAPI.getAll()
// //             ]);
// //
// //             setCategories(catRes.data.map(item => ({ value: item.id, label: item.title })));
// //             setSubCategories(subCatRes.data.map(item => ({ value: item.id, label: item.title, categoryId: item.category })));
// //             setBrands(brandRes.data.map(item => ({ value: item.id, label: item.title })));
// //             setUnits(unitRes.data.map(item => ({ value: item.id, label: item.title })));
// //             setSizes(sizeRes.data.map(item => ({ value: item.id, label: item.title })));
// //         } catch (err) {
// //             console.error("Error fetching options:", err);
// //         }
// //     };
// //
// //     if (!isOpen) return null;
// //
// //     const handleChange = (e) => {
// //         const { name, value, files } = e.target;
// //         if (name === "image") {
// //             const file = files[0];
// //             setForm(prev => ({ ...prev, image: file }));
// //             if (file) {
// //                 const reader = new FileReader();
// //                 reader.onloadend = () => setPreviewImage(reader.result);
// //                 reader.readAsDataURL(file);
// //             } else {
// //                 setPreviewImage(null);
// //             }
// //         } else {
// //             setForm(prev => ({ ...prev, [name]: value }));
// //         }
// //     };
// //
// //     const handleSelectChange = (selectedOption, actionMeta) => {
// //         const { name } = actionMeta;
// //         setForm(prev => ({
// //             ...prev,
// //             [name]: selectedOption ? selectedOption.value : ""
// //         }));
// //
// //         if (name === "category") {
// //             setForm(prev => ({ ...prev, sub_category: "" }));
// //         }
// //     };
// //
// //     const handleQuickAddSave = async (data) => {
// //         let response;
// //         switch (quickAdd.type) {
// //             case "category":
// //                 response = await posCategoryAPI.create(data);
// //                 const newCat = { value: response.data.id, label: response.data.title };
// //                 setCategories(prev => [newCat, ...prev]);
// //                 setForm(prev => ({ ...prev, category: newCat.value }));
// //                 break;
// //             case "sub_category":
// //                 if (!form.category) return alert("Please select a category first");
// //                 response = await posSubCategoryAPI.create({ ...data, category: form.category });
// //                 const newSub = { value: response.data.id, label: response.data.title, categoryId: response.data.category };
// //                 setSubCategories(prev => [newSub, ...prev]);
// //                 setForm(prev => ({ ...prev, sub_category: newSub.value }));
// //                 break;
// //             case "brand":
// //                 response = await posBrandAPI.create(data);
// //                 const newBrand = { value: response.data.id, label: response.data.title };
// //                 setBrands(prev => [newBrand, ...prev]);
// //                 setForm(prev => ({ ...prev, brand: newBrand.value }));
// //                 break;
// //             case "unit":
// //                 response = await posUnitAPI.create(data);
// //                 const newUnit = { value: response.data.id, label: response.data.title };
// //                 setUnits(prev => [newUnit, ...prev]);
// //                 setForm(prev => ({ ...prev, unit: newUnit.value }));
// //                 break;
// //             case "size":
// //                 response = await posSizeAPI.create(data);
// //                 const newSize = { value: response.data.id, label: response.data.title };
// //                 setSizes(prev => [newSize, ...prev]);
// //                 setForm(prev => ({ ...prev, size: newSize.value }));
// //                 break;
// //             default: break;
// //         }
// //     };
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);
// //         setErrors({});
// //
// //         try {
// //             const res = await posProductAPI.create(form);
// //             if (onSuccess) onSuccess(res.data);
// //             resetForm();
// //             onClose();
// //         } catch (err) {
// //             if (err.response?.data) {
// //                 setErrors(err.response.data);
// //             } else {
// //                 alert("An unknown error occurred.");
// //             }
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     const resetForm = () => {
// //         setForm(initialFormState);
// //         setPreviewImage(null);
// //         setErrors({});
// //     };
// //
// //     const filteredSubCategories = subCategories.filter(
// //         sub => !form.category || sub.categoryId === form.category
// //     );
// //
// //     const customSelectStyles = {
// //         control: (provided) => ({
// //             ...provided,
// //             borderRadius: '0.5rem',
// //             padding: '1px',
// //             borderColor: '#D1D5DB',
// //             '&:hover': { borderColor: '#3B82F6' }
// //         }),
// //         menu: (provided) => ({
// //             ...provided,
// //             zIndex: 9999
// //         })
// //     };
// //
// //     const FieldLabel = ({ label, onAdd, isRequired = false }) => (
// //         <div className="flex justify-between items-center mb-1">
// //             <label className="text-sm font-medium text-gray-700">{label} {isRequired && "*"}</label>
// //             {onAdd && (
// //                 <button
// //                     type="button"
// //                     onClick={onAdd}
// //                     className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
// //                     title={`Add new ${label}`}
// //                 >
// //                     <Plus size={14} strokeWidth={3} />
// //                 </button>
// //             )}
// //         </div>
// //     );
// //
// //     // Dynamic options for duplicate check in QuickAddModal
// //     const getExistingOptions = () => {
// //         switch (quickAdd.type) {
// //             case 'category': return categories;
// //             case 'sub_category': return filteredSubCategories;
// //             case 'brand': return brands;
// //             case 'unit': return units;
// //             case 'size': return sizes;
// //             default: return [];
// //         }
// //     };
// //
// //     return (
// //         <>
// //             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
// //                 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
// //                     {/* Header */}
// //                     <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0 z-20">
// //                         <div>
// //                             <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
// //                             <p className="text-sm text-gray-500">Create a new item in your inventory</p>
// //                         </div>
// //                         <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
// //                             <X size={24} className="text-gray-500" />
// //                         </button>
// //                     </div>
// //
// //                     <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
// //                         {/* Section 1: Classification (Moved to Top) */}
// //                         <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100 space-y-4">
// //                             <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Product Classification</h3>
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                                 <div>
// //                                     <FieldLabel label="Category" isRequired onAdd={() => setQuickAdd({ type: 'category', title: 'Category', hasImage: true })} />
// //                                     <Select
// //                                         name="category"
// //                                         options={categories}
// //                                         value={categories.find(opt => opt.value === form.category)}
// //                                         onChange={handleSelectChange}
// //                                         styles={customSelectStyles}
// //                                         placeholder="Search category..."
// //                                         isSearchable
// //                                     />
// //                                     {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
// //                                 </div>
// //                                 <div>
// //                                     <FieldLabel label="Sub-Category" onAdd={() => setQuickAdd({ type: 'sub_category', title: 'Sub-Category', hasImage: true })} />
// //                                     <Select
// //                                         name="sub_category"
// //                                         options={filteredSubCategories}
// //                                         value={subCategories.find(opt => opt.value === form.sub_category)}
// //                                         onChange={handleSelectChange}
// //                                         styles={customSelectStyles}
// //                                         placeholder="Search sub-category..."
// //                                         isSearchable
// //                                         isDisabled={!form.category}
// //                                     />
// //                                 </div>
// //                                 <div>
// //                                     <FieldLabel label="Brand" onAdd={() => setQuickAdd({ type: 'brand', title: 'Brand', hasImage: true })} />
// //                                     <Select
// //                                         name="brand"
// //                                         options={brands}
// //                                         value={brands.find(opt => opt.value === form.brand)}
// //                                         onChange={handleSelectChange}
// //                                         styles={customSelectStyles}
// //                                         placeholder="Search brand..."
// //                                         isSearchable
// //                                     />
// //                                 </div>
// //                                 <div className="grid grid-cols-2 gap-3">
// //                                     <div>
// //                                         <FieldLabel label="Unit" onAdd={() => setQuickAdd({ type: 'unit', title: 'Unit' })} />
// //                                         <Select
// //                                             name="unit"
// //                                             options={units}
// //                                             value={units.find(opt => opt.value === form.unit)}
// //                                             onChange={handleSelectChange}
// //                                             styles={customSelectStyles}
// //                                             placeholder="Unit"
// //                                             isSearchable
// //                                         />
// //                                     </div>
// //                                     <div>
// //                                         <FieldLabel label="Size" onAdd={() => setQuickAdd({ type: 'size', title: 'Size' })} />
// //                                         <Select
// //                                             name="size"
// //                                             options={sizes}
// //                                             value={sizes.find(opt => opt.value === form.size)}
// //                                             onChange={handleSelectChange}
// //                                             styles={customSelectStyles}
// //                                             placeholder="Size"
// //                                             isSearchable
// //                                         />
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>
// //
// //                         {/* Section 2: Core Details */}
// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                             <div className="space-y-4">
// //                                 <div>
// //                                     <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
// //                                     <input className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Smart Watch" />
// //                                     {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
// //                                 </div>
// //                                 <div>
// //                                     <label className="block text-sm font-medium text-gray-700 mb-1">Product Code/SKU</label>
// //                                     <input className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" name="product_code" value={form.product_code} onChange={handleChange} placeholder="Leave blank to auto-generate" />
// //                                 </div>
// //                                 <div className="grid grid-cols-2 gap-4 pt-2">
// //                                     <div>
// //                                         <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
// //                                         <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded-lg" name="purchase_price" value={form.purchase_price} onChange={handleChange} required placeholder="0.00" />
// //                                     </div>
// //                                     <div>
// //                                         <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
// //                                         <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded-lg" name="selling_price" value={form.selling_price} onChange={handleChange} required placeholder="0.00" />
// //                                     </div>
// //                                 </div>
// //                                 <div>
// //                                     <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock *</label>
// //                                     <input type="number" className="w-full p-2 border border-gray-300 rounded-lg" name="stock" value={form.stock} onChange={handleChange} required placeholder="0" />
// //                                 </div>
// //                             </div>
// //
// //                             {/* Image Section */}
// //                             <div className="space-y-4">
// //                                 <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
// //                                 <div className="relative group cursor-pointer" onClick={() => document.getElementById("main-image-upload").click()}>
// //                                     <div className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-hover:bg-blue-50/30">
// //                                         {previewImage ? (
// //                                             <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
// //                                         ) : (
// //                                             <>
// //                                                 <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
// //                                                     <Plus size={32} className="text-gray-400 group-hover:text-blue-500" />
// //                                                 </div>
// //                                                 <p className="text-sm text-gray-500">Click to upload image</p>
// //                                                 <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
// //                                             </>
// //                                         )}
// //                                     </div>
// //                                     <input id="main-image-upload" type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
// //                                     {previewImage && (
// //                                         <button
// //                                             type="button"
// //                                             onClick={(e) => { e.stopPropagation(); setPreviewImage(null); setForm(p => ({...p, image: null})) }}
// //                                             className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
// //                                         >
// //                                             <X size={16} />
// //                                         </button>
// //                                     )}
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </form>
// //
// //                     {/* Footer */}
// //                     <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
// //                         <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-white text-gray-700 font-medium transition-all" disabled={loading}>
// //                             Cancel
// //                         </button>
// //                         <button
// //                             type="submit"
// //                             onClick={handleSubmit}
// //                             className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold flex items-center gap-2 transition-all disabled:opacity-50"
// //                             disabled={loading}
// //                         >
// //                             {loading ? (
// //                                 <>
// //                                     <Loader2 className="animate-spin" size={20} />
// //                                     Processing...
// //                                 </>
// //                             ) : "Save Product"}
// //                         </button>
// //                     </div>
// //                 </div>
// //             </div>
// //
// //             {/* Quick Add Sub-Modal */}
// //             <QuickAddModal
// //                 isOpen={!!quickAdd.type}
// //                 onClose={() => setQuickAdd({ type: null, title: "", hasImage: false })}
// //                 onSave={handleQuickAddSave}
// //                 title={quickAdd.title}
// //                 hasImage={quickAdd.hasImage}
// //                 existingOptions={getExistingOptions()}
// //             />
// //         </>
// //     );
// // };
// //
// // export default AddProductModal;
//
//
//
// //////////////////////////////////////
//
// // AddProductModal.jsx - সম্পূর্ণ কোড
//
// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import { Plus, X, Loader2 } from "lucide-react";
// import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
// import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
// import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
// import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
// import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
// import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";
// import { posWarrantyPeriodAPI } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";
//
// // --- Quick Add Modal Component ---
// const QuickAddModal = ({ isOpen, onClose, onSave, title, hasImage = false, existingOptions = [] }) => {
//     const [name, setName] = useState("");
//     const [duration, setDuration] = useState("");
//     const [periodType, setPeriodType] = useState("month");
//     const [image, setImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [localError, setLocalError] = useState("");
//
//     useEffect(() => {
//         if (!isOpen) {
//             setName("");
//             setDuration("");
//             setPeriodType("month");
//             setImage(null);
//             setLocalError("");
//         }
//     }, [isOpen]);
//
//     // Live validation check for duplicates
//     useEffect(() => {
//         const trimmedName = name.trim().toLowerCase();
//         if (trimmedName && existingOptions.some(opt => opt.label.trim().toLowerCase() === trimmedName)) {
//             setLocalError(`This ${title} already exists!`);
//         } else {
//             setLocalError("");
//         }
//     }, [name, existingOptions, title]);
//
//     if (!isOpen) return null;
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (localError) return;
//
//         setLoading(true);
//         try {
//             const data = { title: name.trim() };
//             if (title === "Warranty Period") {
//                 data.name = name.trim();
//                 data.duration = parseInt(duration);
//                 data.period_type = periodType;
//                 data.is_active = true;
//             }
//             if (hasImage && image) data.image = image;
//
//             await onSave(data);
//             onClose();
//         } catch (err) {
//             console.error("Quick add failed:", err);
//             const errorMsg = err.response?.data?.title || err.response?.data?.detail || "Something went wrong. Please try again.";
//             alert("Error: " + errorMsg);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const isWarranty = title === "Warranty Period";
//
//     return (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
//                 <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
//                     <h3 className="font-bold text-gray-800">Add New {title}</h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
//                         <input
//                             className={`w-full p-2 border rounded-lg outline-none transition-all ${localError ? 'border-red-500 ring-1 ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             required
//                             autoFocus
//                         />
//                         {localError && <p className="text-red-500 text-xs mt-1 font-medium">{localError}</p>}
//                     </div>
//
//                     {isWarranty && (
//                         <>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
//                                 <input
//                                     type="number"
//                                     className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//                                     value={duration}
//                                     onChange={(e) => setDuration(e.target.value)}
//                                     required
//                                     placeholder="e.g., 12, 24, 36"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Period Type *</label>
//                                 <select
//                                     className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//                                     value={periodType}
//                                     onChange={(e) => setPeriodType(e.target.value)}
//                                 >
//                                     <option value="day">Day(s)</option>
//                                     <option value="month">Month(s)</option>
//                                     <option value="year">Year(s)</option>
//                                 </select>
//                             </div>
//                         </>
//                     )}
//
//                     {hasImage && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                                 onChange={(e) => setImage(e.target.files[0])}
//                             />
//                         </div>
//                     )}
//                     <div className="flex justify-end gap-3 pt-2">
//                         <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
//                         <button
//                             type="submit"
//                             disabled={loading || !name.trim() || !!localError || (isWarranty && (!duration || parseInt(duration) <= 0))}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                         >
//                             {loading && <Loader2 className="animate-spin" size={16} />}
//                             Save {title}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// // --- Main Add Product Modal ---
// const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
//     const initialFormState = {
//         name: "",
//         product_code: "",
//         purchase_price: "",
//         selling_price: "",
//         stock: "",
//         alarm_when_stock_is_lessthanOrEqualto: 0,
//         category: "",
//         sub_category: "",
//         brand: "",
//         size: "",
//         unit: "",
//         image: null,
//         warranty_status: false,
//         warranty_period: null,
//         has_expiry: false,
//     };
//
//     const [form, setForm] = useState(initialFormState);
//     const [previewImage, setPreviewImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//
//     // Options for dropdowns
//     const [categories, setCategories] = useState([]);
//     const [subCategories, setSubCategories] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [units, setUnits] = useState([]);
//     const [sizes, setSizes] = useState([]);
//     const [warrantyPeriods, setWarrantyPeriods] = useState([]);
//
//     // Quick Add Modal states
//     const [quickAdd, setQuickAdd] = useState({ type: null, title: "", hasImage: false });
//
//     useEffect(() => {
//         if (isOpen) {
//             fetchOptions();
//         }
//     }, [isOpen]);
//
//     const fetchOptions = async () => {
//         try {
//             const [catRes, subCatRes, brandRes, unitRes, sizeRes, warrantyRes] = await Promise.all([
//                 posCategoryAPI.getAll(),
//                 posSubCategoryAPI.getAll(),
//                 posBrandAPI.getAll(),
//                 posUnitAPI.getAll(),
//                 posSizeAPI.getAll(),
//                 posWarrantyPeriodAPI.getAll()
//             ]);
//
//             setCategories(catRes.data.map(item => ({ value: item.id, label: item.title })));
//             setSubCategories(subCatRes.data.map(item => ({ value: item.id, label: item.title, categoryId: item.category })));
//             setBrands(brandRes.data.map(item => ({ value: item.id, label: item.title })));
//             setUnits(unitRes.data.map(item => ({ value: item.id, label: item.title })));
//             setSizes(sizeRes.data.map(item => ({ value: item.id, label: item.title })));
//             setWarrantyPeriods(warrantyRes.data.map(item => ({
//                 value: item.id,
//                 label: `${item.name} (${item.duration} ${item.period_type}${item.duration > 1 ? 's' : ''})`,
//                 duration: item.duration,
//                 period_type: item.period_type
//             })));
//         } catch (err) {
//             console.error("Error fetching options:", err);
//         }
//     };
//
//     if (!isOpen) return null;
//
//     const handleChange = (e) => {
//         const { name, value, files, type, checked } = e.target;
//         if (name === "image") {
//             const file = files[0];
//             setForm(prev => ({ ...prev, image: file }));
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onloadend = () => setPreviewImage(reader.result);
//                 reader.readAsDataURL(file);
//             } else {
//                 setPreviewImage(null);
//             }
//         } else if (type === "checkbox") {
//             setForm(prev => ({ ...prev, [name]: checked }));
//             // Reset warranty_period if warranty_status is unchecked
//             if (name === "warranty_status" && !checked) {
//                 setForm(prev => ({ ...prev, warranty_period: null }));
//             }
//         } else {
//             setForm(prev => ({ ...prev, [name]: value }));
//         }
//     };
//
//     const handleSelectChange = (selectedOption, actionMeta) => {
//         const { name } = actionMeta;
//         setForm(prev => ({
//             ...prev,
//             [name]: selectedOption ? selectedOption.value : ""
//         }));
//
//         if (name === "category") {
//             setForm(prev => ({ ...prev, sub_category: "" }));
//         }
//     };
//
//     const handleWarrantyQuickAdd = async (data) => {
//         const response = await posWarrantyPeriodAPI.create({
//             name: data.name,
//             duration: data.duration,
//             period_type: data.period_type,
//             is_active: true
//         });
//         const newWarranty = {
//             value: response.data.id,
//             label: `${response.data.name} (${response.data.duration} ${response.data.period_type}${response.data.duration > 1 ? 's' : ''})`,
//             duration: response.data.duration,
//             period_type: response.data.period_type
//         };
//         setWarrantyPeriods(prev => [newWarranty, ...prev]);
//         setForm(prev => ({ ...prev, warranty_period: newWarranty.value }));
//     };
//
//     const handleQuickAddSave = async (data) => {
//         switch (quickAdd.type) {
//             case "category":
//                 const catRes = await posCategoryAPI.create(data);
//                 const newCat = { value: catRes.data.id, label: catRes.data.title };
//                 setCategories(prev => [newCat, ...prev]);
//                 setForm(prev => ({ ...prev, category: newCat.value }));
//                 break;
//             case "sub_category":
//                 if (!form.category) return alert("Please select a category first");
//                 const subRes = await posSubCategoryAPI.create({ ...data, category: form.category });
//                 const newSub = { value: subRes.data.id, label: subRes.data.title, categoryId: subRes.data.category };
//                 setSubCategories(prev => [newSub, ...prev]);
//                 setForm(prev => ({ ...prev, sub_category: newSub.value }));
//                 break;
//             case "brand":
//                 const brandRes = await posBrandAPI.create(data);
//                 const newBrand = { value: brandRes.data.id, label: brandRes.data.title };
//                 setBrands(prev => [newBrand, ...prev]);
//                 setForm(prev => ({ ...prev, brand: newBrand.value }));
//                 break;
//             case "unit":
//                 const unitRes = await posUnitAPI.create(data);
//                 const newUnit = { value: unitRes.data.id, label: unitRes.data.title };
//                 setUnits(prev => [newUnit, ...prev]);
//                 setForm(prev => ({ ...prev, unit: newUnit.value }));
//                 break;
//             case "size":
//                 const sizeRes = await posSizeAPI.create(data);
//                 const newSize = { value: sizeRes.data.id, label: sizeRes.data.title };
//                 setSizes(prev => [newSize, ...prev]);
//                 setForm(prev => ({ ...prev, size: newSize.value }));
//                 break;
//             case "warranty":
//                 await handleWarrantyQuickAdd(data);
//                 break;
//             default: break;
//         }
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setErrors({});
//
//         try {
//             const formData = new FormData();
//             formData.append('name', form.name);
//             if (form.product_code) formData.append('product_code', form.product_code);
//             formData.append('purchase_price', form.purchase_price);
//             formData.append('selling_price', form.selling_price);
//             formData.append('stock', form.stock);
//             formData.append('alarm_when_stock_is_lessthanOrEqualto', form.alarm_when_stock_is_lessthanOrEqualto);
//             if (form.category) formData.append('category', form.category);
//             if (form.sub_category) formData.append('sub_category', form.sub_category);
//             if (form.brand) formData.append('brand', form.brand);
//             if (form.size) formData.append('size', form.size);
//             if (form.unit) formData.append('unit', form.unit);
//             if (form.image) formData.append('image', form.image);
//
//             formData.append('warranty_status', form.warranty_status);
//             if (form.warranty_period) formData.append('warranty_period', form.warranty_period);
//             formData.append('has_expiry', form.has_expiry);
//
//             const res = await posProductAPI.create(formData);
//             if (onSuccess) onSuccess(res.data);
//             resetForm();
//             onClose();
//         } catch (err) {
//             if (err.response?.data) {
//                 setErrors(err.response.data);
//             } else {
//                 alert("An unknown error occurred.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const resetForm = () => {
//         setForm(initialFormState);
//         setPreviewImage(null);
//         setErrors({});
//     };
//
//     const filteredSubCategories = subCategories.filter(
//         sub => !form.category || sub.categoryId === form.category
//     );
//
//     const customSelectStyles = {
//         control: (provided) => ({
//             ...provided,
//             borderRadius: '0.5rem',
//             padding: '1px',
//             borderColor: '#D1D5DB',
//             '&:hover': { borderColor: '#3B82F6' }
//         }),
//         menu: (provided) => ({
//             ...provided,
//             zIndex: 9999
//         })
//     };
//
//     const FieldLabel = ({ label, onAdd, isRequired = false }) => (
//         <div className="flex justify-between items-center mb-1">
//             <label className="text-sm font-medium text-gray-700">{label} {isRequired && "*"}</label>
//             {onAdd && (
//                 <button
//                     type="button"
//                     onClick={onAdd}
//                     className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
//                     title={`Add new ${label}`}
//                 >
//                     <Plus size={14} strokeWidth={3} />
//                 </button>
//             )}
//         </div>
//     );
//
//     const getExistingOptions = () => {
//         switch (quickAdd.type) {
//             case 'category': return categories;
//             case 'sub_category': return filteredSubCategories;
//             case 'brand': return brands;
//             case 'unit': return units;
//             case 'size': return sizes;
//             case 'warranty': return warrantyPeriods;
//             default: return [];
//         }
//     };
//
//     return (
//         <>
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
//                     {/* Header */}
//                     <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0 z-20">
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
//                             <p className="text-sm text-gray-500">Create a new item in your inventory</p>
//                         </div>
//                         <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                             <X size={24} className="text-gray-500" />
//                         </button>
//                     </div>
//
//                     <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
//                         {/* Section 1: Classification */}
//                         <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100 space-y-4">
//                             <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Product Classification</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <FieldLabel label="Category" isRequired onAdd={() => setQuickAdd({ type: 'category', title: 'Category', hasImage: true })} />
//                                     <Select
//                                         name="category"
//                                         options={categories}
//                                         value={categories.find(opt => opt.value === form.category)}
//                                         onChange={handleSelectChange}
//                                         styles={customSelectStyles}
//                                         placeholder="Search category..."
//                                         isSearchable
//                                     />
//                                     {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
//                                 </div>
//                                 <div>
//                                     <FieldLabel label="Sub-Category" onAdd={() => setQuickAdd({ type: 'sub_category', title: 'Sub-Category', hasImage: true })} />
//                                     <Select
//                                         name="sub_category"
//                                         options={filteredSubCategories}
//                                         value={subCategories.find(opt => opt.value === form.sub_category)}
//                                         onChange={handleSelectChange}
//                                         styles={customSelectStyles}
//                                         placeholder="Search sub-category..."
//                                         isSearchable
//                                         isDisabled={!form.category}
//                                     />
//                                 </div>
//                                 <div>
//                                     <FieldLabel label="Brand" onAdd={() => setQuickAdd({ type: 'brand', title: 'Brand', hasImage: true })} />
//                                     <Select
//                                         name="brand"
//                                         options={brands}
//                                         value={brands.find(opt => opt.value === form.brand)}
//                                         onChange={handleSelectChange}
//                                         styles={customSelectStyles}
//                                         placeholder="Search brand..."
//                                         isSearchable
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <div>
//                                         <FieldLabel label="Unit" onAdd={() => setQuickAdd({ type: 'unit', title: 'Unit' })} />
//                                         <Select
//                                             name="unit"
//                                             options={units}
//                                             value={units.find(opt => opt.value === form.unit)}
//                                             onChange={handleSelectChange}
//                                             styles={customSelectStyles}
//                                             placeholder="Unit"
//                                             isSearchable
//                                         />
//                                     </div>
//                                     <div>
//                                         <FieldLabel label="Size" onAdd={() => setQuickAdd({ type: 'size', title: 'Size' })} />
//                                         <Select
//                                             name="size"
//                                             options={sizes}
//                                             value={sizes.find(opt => opt.value === form.size)}
//                                             onChange={handleSelectChange}
//                                             styles={customSelectStyles}
//                                             placeholder="Size"
//                                             isSearchable
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Section 2: Warranty & Expiry Settings */}
//                         <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-100 space-y-4">
//                             <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Warranty & Expiry Settings</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//
//                                 {/* Warranty Status */}
//                                 <div className="space-y-3">
//                                     <div className="flex items-center gap-3">
//                                         <input
//                                             type="checkbox"
//                                             id="warranty_status"
//                                             name="warranty_status"
//                                             checked={form.warranty_status}
//                                             onChange={handleChange}
//                                             className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                         />
//                                         <label htmlFor="warranty_status" className="text-sm font-medium text-gray-700">
//                                             Enable Warranty
//                                         </label>
//                                     </div>
//
//                                     {form.warranty_status && (
//                                         <div className="pl-7">
//                                             <FieldLabel label="Warranty Period" onAdd={() => setQuickAdd({ type: 'warranty', title: 'Warranty Period' })} />
//                                             <Select
//                                                 name="warranty_period"
//                                                 options={warrantyPeriods}
//                                                 value={warrantyPeriods.find(opt => opt.value === form.warranty_period)}
//                                                 onChange={handleSelectChange}
//                                                 styles={customSelectStyles}
//                                                 placeholder="Select warranty period..."
//                                                 isSearchable
//                                             />
//                                             {errors.warranty_period && <p className="text-red-500 text-xs mt-1">{errors.warranty_period}</p>}
//                                         </div>
//                                     )}
//                                 </div>
//
//                                 {/* Expiry Status */}
//                                 <div className="space-y-3">
//                                     <div className="flex items-center gap-3">
//                                         <input
//                                             type="checkbox"
//                                             id="has_expiry"
//                                             name="has_expiry"
//                                             checked={form.has_expiry}
//                                             onChange={handleChange}
//                                             className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                         />
//                                         <label htmlFor="has_expiry" className="text-sm font-medium text-gray-700">
//                                             Has Expiry Date (Food, Medicine, etc.)
//                                         </label>
//                                     </div>
//                                     {form.has_expiry && (
//                                         <div className="pl-7 text-xs text-gray-500">
//                                             <p>⚠️ Products with expiry will be tracked per batch during purchase.</p>
//                                             <p className="mt-1">Expired products cannot be sold.</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Section 3: Core Details */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
//                                     <input
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                                         name="name"
//                                         value={form.name}
//                                         onChange={handleChange}
//                                         required
//                                         placeholder="e.g. Smart Watch"
//                                     />
//                                     {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Product Code/SKU</label>
//                                     <input
//                                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                                         name="product_code"
//                                         value={form.product_code}
//                                         onChange={handleChange}
//                                         placeholder="Leave blank to auto-generate"
//                                     />
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4 pt-2">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
//                                         <input
//                                             type="number"
//                                             step="0.01"
//                                             className="w-full p-2 border border-gray-300 rounded-lg"
//                                             name="purchase_price"
//                                             value={form.purchase_price}
//                                             onChange={handleChange}
//                                             required
//                                             placeholder="0.00"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
//                                         <input
//                                             type="number"
//                                             step="0.01"
//                                             className="w-full p-2 border border-gray-300 rounded-lg"
//                                             name="selling_price"
//                                             value={form.selling_price}
//                                             onChange={handleChange}
//                                             required
//                                             placeholder="0.00"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock *</label>
//                                         <input
//                                             type="number"
//                                             className="w-full p-2 border border-gray-300 rounded-lg"
//                                             name="stock"
//                                             value={form.stock}
//                                             onChange={handleChange}
//                                             required
//                                             placeholder="0"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
//                                         <input
//                                             type="number"
//                                             className="w-full p-2 border border-gray-300 rounded-lg"
//                                             name="alarm_when_stock_is_lessthanOrEqualto"
//                                             value={form.alarm_when_stock_is_lessthanOrEqualto}
//                                             onChange={handleChange}
//                                             placeholder="0"
//                                         />
//                                         <p className="text-xs text-gray-400 mt-1">Alert when stock ≤ this value</p>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {/* Image Section */}
//                             <div className="space-y-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
//                                 <div className="relative group cursor-pointer" onClick={() => document.getElementById("main-image-upload").click()}>
//                                     <div className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-hover:bg-blue-50/30">
//                                         {previewImage ? (
//                                             <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
//                                         ) : (
//                                             <>
//                                                 <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
//                                                     <Plus size={32} className="text-gray-400 group-hover:text-blue-500" />
//                                                 </div>
//                                                 <p className="text-sm text-gray-500">Click to upload image</p>
//                                                 <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
//                                             </>
//                                         )}
//                                     </div>
//                                     <input id="main-image-upload" type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
//                                     {previewImage && (
//                                         <button
//                                             type="button"
//                                             onClick={(e) => { e.stopPropagation(); setPreviewImage(null); setForm(p => ({...p, image: null})) }}
//                                             className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
//                                         >
//                                             <X size={16} />
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//
//                     {/* Footer */}
//                     <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
//                         <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-white text-gray-700 font-medium transition-all" disabled={loading}>
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             onClick={handleSubmit}
//                             className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold flex items-center gap-2 transition-all disabled:opacity-50"
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <>
//                                     <Loader2 className="animate-spin" size={20} />
//                                     Processing...
//                                 </>
//                             ) : "Save Product"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Quick Add Sub-Modal */}
//             <QuickAddModal
//                 isOpen={!!quickAdd.type}
//                 onClose={() => setQuickAdd({ type: null, title: "", hasImage: false })}
//                 onSave={handleQuickAddSave}
//                 title={quickAdd.title}
//                 hasImage={quickAdd.hasImage}
//                 existingOptions={getExistingOptions()}
//             />
//         </>
//     );
// };
//
// export default AddProductModal;


// AddProductModal.jsx - আপনার প্রথম কোডের উপর ভিত্তি করে (শুধু warranty & expiry যোগ করা হয়েছে)

import React, {useState, useEffect} from "react";
import Select from "react-select";
import {Plus, X, Loader2} from "lucide-react";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posCategoryAPI} from "../../../context_or_provider/pos/categories/categoryAPI";
import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import {posBrandAPI} from "../../../context_or_provider/pos/brands/brandAPI";
import {posUnitAPI} from "../../../context_or_provider/pos/units/unitAPI";
import {posSizeAPI} from "../../../context_or_provider/pos/sizes/sizeAPI";
import {posWarrantyPeriodAPI} from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";

// --- Quick Add Modal Component ---
const QuickAddModal = ({isOpen, onClose, onSave, title, hasImage = false, existingOptions = []}) => {
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

    // Live validation check for duplicates
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
            const data = {title: name.trim()};
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
            const errorMsg = err.response?.data?.title || err.response?.data?.detail || "Something went wrong. Please try again.";
            alert("Error: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Add New {title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                            className={`w-full p-2 border rounded-lg outline-none transition-all ${localError ? 'border-red-500 ring-1 ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                        />
                        {localError && <p className="text-red-500 text-xs mt-1 font-medium">{localError}</p>}
                    </div>

                    {isWarranty && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    required
                                    placeholder="e.g., 12, 24, 36"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Period Type *</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={periodType}
                                    onChange={(e) => setPeriodType(e.target.value)}
                                >
                                    <option value="day">Day(s)</option>
                                    <option value="month">Month(s)</option>
                                    <option value="year">Year(s)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {hasImage && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim() || !!localError || (isWarranty && (!duration || parseInt(duration) <= 0))}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <Loader2 className="animate-spin" size={16}/>}
                            Save {title}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Add Product Modal ---
const AddProductModal = ({isOpen, onClose, onSuccess}) => {
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
        // ✅ নতুন ফিল্ড যোগ করা হয়েছে
        alarm_when_stock_is_lessthanOrEqualto: 0,
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

    // Quick Add Modal states
    const [quickAdd, setQuickAdd] = useState({type: null, title: "", hasImage: false});

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

            setCategories(catRes.data.map(item => ({value: item.id, label: item.title})));
            setSubCategories(subCatRes.data.map(item => ({
                value: item.id,
                label: item.title,
                categoryId: item.category
            })));
            setBrands(brandRes.data.map(item => ({value: item.id, label: item.title})));
            setUnits(unitRes.data.map(item => ({value: item.id, label: item.title})));
            setSizes(sizeRes.data.map(item => ({value: item.id, label: item.title})));
            setWarrantyPeriods(warrantyRes.data.map(item => ({
                value: item.id,
                label: `${item.name} (${item.duration} ${item.period_type}${item.duration > 1 ? 's' : ''})`
            })));
        } catch (err) {
            console.error("Error fetching options:", err);
        }
    };

    if (!isOpen) return null;

    const handleChange = (e) => {
        const {name, value, files, type, checked} = e.target;
        if (name === "image") {
            const file = files[0];
            setForm(prev => ({...prev, image: file}));
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewImage(reader.result);
                reader.readAsDataURL(file);
            } else {
                setPreviewImage(null);
            }
        } else if (type === "checkbox") {
            setForm(prev => ({...prev, [name]: checked}));
            if (name === "warranty_status" && !checked) {
                setForm(prev => ({...prev, warranty_period: null}));
            }
        } else {
            setForm(prev => ({...prev, [name]: value}));
        }
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        const {name} = actionMeta;
        setForm(prev => ({
            ...prev,
            [name]: selectedOption ? selectedOption.value : ""
        }));

        if (name === "category") {
            setForm(prev => ({...prev, sub_category: ""}));
        }
    };

    const handleQuickAddSave = async (data) => {
        let response;
        switch (quickAdd.type) {
            case "category":
                response = await posCategoryAPI.create(data);
                const newCat = {value: response.data.id, label: response.data.title};
                setCategories(prev => [newCat, ...prev]);
                setForm(prev => ({...prev, category: newCat.value}));
                break;
            case "sub_category":
                if (!form.category) return alert("Please select a category first");
                response = await posSubCategoryAPI.create({...data, category: form.category});
                const newSub = {
                    value: response.data.id,
                    label: response.data.title,
                    categoryId: response.data.category
                };
                setSubCategories(prev => [newSub, ...prev]);
                setForm(prev => ({...prev, sub_category: newSub.value}));
                break;
            case "brand":
                response = await posBrandAPI.create(data);
                const newBrand = {value: response.data.id, label: response.data.title};
                setBrands(prev => [newBrand, ...prev]);
                setForm(prev => ({...prev, brand: newBrand.value}));
                break;
            case "unit":
                response = await posUnitAPI.create(data);
                const newUnit = {value: response.data.id, label: response.data.title};
                setUnits(prev => [newUnit, ...prev]);
                setForm(prev => ({...prev, unit: newUnit.value}));
                break;
            case "size":
                response = await posSizeAPI.create(data);
                const newSize = {value: response.data.id, label: response.data.title};
                setSizes(prev => [newSize, ...prev]);
                setForm(prev => ({...prev, size: newSize.value}));
                break;
            case "warranty":
                response = await posWarrantyPeriodAPI.create({
                    name: data.name,
                    duration: data.duration,
                    period_type: data.period_type,
                    is_active: true
                });
                const newWarranty = {
                    value: response.data.id,
                    label: `${response.data.name} (${response.data.duration} ${response.data.period_type}${response.data.duration > 1 ? 's' : ''})`
                };
                setWarrantyPeriods(prev => [newWarranty, ...prev]);
                setForm(prev => ({...prev, warranty_period: newWarranty.value}));
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const payload = {
                name: form.name,
                product_code: form.product_code || "",
                purchase_price: parseFloat(form.purchase_price) || 0,
                selling_price: parseFloat(form.selling_price) || 0,
                stock: parseInt(form.stock) || 0,
                alarm_when_stock_is_lessthanOrEqualto: parseInt(form.alarm_when_stock_is_lessthanOrEqualto) || 0,
                category: form.category || null,
                sub_category: form.sub_category || null,
                brand: form.brand || null,
                size: form.size || null,
                unit: form.unit || null,
                warranty_status: form.warranty_status,
                warranty_period: form.warranty_status ? (form.warranty_period || null) : null,
                has_expiry: form.has_expiry,
                image: form.image, // ✅ image যোগ করা হয়েছে
            };

            const res = await posProductAPI.create(payload);
            if (onSuccess) onSuccess(res.data);
            resetForm();
            onClose();
        } catch (err) {
            console.error("Error:", err.response?.data);
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                alert("An unknown error occurred.");
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

    const filteredSubCategories = subCategories.filter(
        sub => !form.category || sub.categoryId === form.category
    );

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '0.5rem',
            padding: '1px',
            borderColor: '#D1D5DB',
            '&:hover': {borderColor: '#3B82F6'}
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999
        })
    };

    const FieldLabel = ({label, onAdd, isRequired = false}) => (
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">{label} {isRequired && "*"}</label>
            {onAdd && (
                <button
                    type="button"
                    onClick={onAdd}
                    className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    title={`Add new ${label}`}
                >
                    <Plus size={14} strokeWidth={3}/>
                </button>
            )}
        </div>
    );

    const getExistingOptions = () => {
        switch (quickAdd.type) {
            case 'category':
                return categories;
            case 'sub_category':
                return filteredSubCategories;
            case 'brand':
                return brands;
            case 'unit':
                return units;
            case 'size':
                return sizes;
            case 'warranty':
                return warrantyPeriods;
            default:
                return [];
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0 z-20">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                            <p className="text-sm text-gray-500">Create a new item in your inventory</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={24} className="text-gray-500"/>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Section 1: Classification (Moved to Top) */}
                        <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100 space-y-4">
                            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Product
                                Classification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel label="Category" isRequired onAdd={() => setQuickAdd({
                                        type: 'category',
                                        title: 'Category',
                                        hasImage: true
                                    })}/>
                                    <Select
                                        name="category"
                                        options={categories}
                                        value={categories.find(opt => opt.value === form.category)}
                                        onChange={handleSelectChange}
                                        styles={customSelectStyles}
                                        placeholder="Search category..."
                                        isSearchable
                                    />
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>
                                <div>
                                    <FieldLabel label="Sub-Category" onAdd={() => setQuickAdd({
                                        type: 'sub_category',
                                        title: 'Sub-Category',
                                        hasImage: true
                                    })}/>
                                    <Select
                                        name="sub_category"
                                        options={filteredSubCategories}
                                        value={subCategories.find(opt => opt.value === form.sub_category)}
                                        onChange={handleSelectChange}
                                        styles={customSelectStyles}
                                        placeholder="Search sub-category..."
                                        isSearchable
                                        isDisabled={!form.category}
                                    />
                                </div>
                                <div>
                                    <FieldLabel label="Brand" onAdd={() => setQuickAdd({
                                        type: 'brand',
                                        title: 'Brand',
                                        hasImage: true
                                    })}/>
                                    <Select
                                        name="brand"
                                        options={brands}
                                        value={brands.find(opt => opt.value === form.brand)}
                                        onChange={handleSelectChange}
                                        styles={customSelectStyles}
                                        placeholder="Search brand..."
                                        isSearchable
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <FieldLabel label="Unit"
                                                    onAdd={() => setQuickAdd({type: 'unit', title: 'Unit'})}/>
                                        <Select
                                            name="unit"
                                            options={units}
                                            value={units.find(opt => opt.value === form.unit)}
                                            onChange={handleSelectChange}
                                            styles={customSelectStyles}
                                            placeholder="Unit"
                                            isSearchable
                                        />
                                    </div>
                                    <div>
                                        <FieldLabel label="Size"
                                                    onAdd={() => setQuickAdd({type: 'size', title: 'Size'})}/>
                                        <Select
                                            name="size"
                                            options={sizes}
                                            value={sizes.find(opt => opt.value === form.size)}
                                            onChange={handleSelectChange}
                                            styles={customSelectStyles}
                                            placeholder="Size"
                                            isSearchable
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ✅ Section 2: Warranty & Expiry Settings (New) */}
                        <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-100 space-y-4">
                            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Warranty &
                                Expiry Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Warranty Status */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="warranty_status"
                                            name="warranty_status"
                                            checked={form.warranty_status}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="warranty_status" className="text-sm font-medium text-gray-700">
                                            Enable Warranty
                                        </label>
                                    </div>

                                    {form.warranty_status && (
                                        <div className="pl-7">
                                            <FieldLabel label="Warranty Period" onAdd={() => setQuickAdd({
                                                type: 'warranty',
                                                title: 'Warranty Period'
                                            })}/>
                                            <Select
                                                name="warranty_period"
                                                options={warrantyPeriods}
                                                value={warrantyPeriods.find(opt => opt.value === form.warranty_period)}
                                                onChange={handleSelectChange}
                                                styles={customSelectStyles}
                                                placeholder="Select warranty period..."
                                                isSearchable
                                            />
                                            {errors.warranty_period &&
                                                <p className="text-red-500 text-xs mt-1">{errors.warranty_period}</p>}
                                        </div>
                                    )}
                                </div>

                                {/* Expiry Status */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="has_expiry"
                                            name="has_expiry"
                                            checked={form.has_expiry}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="has_expiry" className="text-sm font-medium text-gray-700">
                                            Has Expiry Date (Food, Medicine, etc.)
                                        </label>
                                    </div>
                                    {form.has_expiry && (
                                        <div className="pl-7 text-xs text-gray-500">
                                            <p>⚠️ Products with expiry will be tracked per batch during purchase.</p>
                                            <p className="mt-1">Expired products cannot be sold.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Core Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name
                                        *</label>
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        name="name" value={form.name} onChange={handleChange} required
                                        placeholder="e.g. Smart Watch"/>
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product
                                        Code/SKU</label>
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        name="product_code" value={form.product_code} onChange={handleChange}
                                        placeholder="Leave blank to auto-generate"/>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price
                                            *</label>
                                        <input type="number" step="0.01"
                                               className="w-full p-2 border border-gray-300 rounded-lg"
                                               name="purchase_price" value={form.purchase_price} onChange={handleChange}
                                               required placeholder="0.00"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price
                                            *</label>
                                        <input type="number" step="0.01"
                                               className="w-full p-2 border border-gray-300 rounded-lg"
                                               name="selling_price" value={form.selling_price} onChange={handleChange}
                                               required placeholder="0.00"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock
                                            *</label>
                                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg"
                                               name="stock" value={form.stock} onChange={handleChange} required
                                               placeholder="0"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock
                                            Alert</label>
                                        <input type="number" className="w-full p-2 border border-gray-300 rounded-lg"
                                               name="alarm_when_stock_is_lessthanOrEqualto"
                                               value={form.alarm_when_stock_is_lessthanOrEqualto}
                                               onChange={handleChange} placeholder="0"/>
                                        <p className="text-xs text-gray-400 mt-1">Alert when stock ≤ this value</p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                <div className="relative group cursor-pointer"
                                     onClick={() => document.getElementById("main-image-upload").click()}>
                                    <div
                                        className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-hover:bg-blue-50/30">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview"
                                                 className="w-full h-full object-cover"/>
                                        ) : (
                                            <>
                                                <div
                                                    className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                    <Plus size={32}
                                                          className="text-gray-400 group-hover:text-blue-500"/>
                                                </div>
                                                <p className="text-sm text-gray-500">Click to upload image</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                    <input id="main-image-upload" type="file" name="image" accept="image/*"
                                           onChange={handleChange} className="hidden"/>
                                    {previewImage && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewImage(null);
                                                setForm(p => ({...p, image: null}))
                                            }}
                                            className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16}/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                        <button type="button" onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"
                                disabled={loading}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20}/>
                                    Processing...
                                </>
                            ) : "Save Product"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Add Sub-Modal */}
            <QuickAddModal
                isOpen={!!quickAdd.type}
                onClose={() => setQuickAdd({type: null, title: "", hasImage: false})}
                onSave={handleQuickAddSave}
                title={quickAdd.title}
                hasImage={quickAdd.hasImage}
                existingOptions={getExistingOptions()}
            />
        </>
    );
};

export default AddProductModal;