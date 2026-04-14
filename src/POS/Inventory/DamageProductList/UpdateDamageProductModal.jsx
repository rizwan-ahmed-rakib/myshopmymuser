/////////////////////////////////////////////////version 2///////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import { posDamageProductAPI } from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
// import { FaBox, FaExclamationTriangle, FaImage, FaBarcode, FaLayerGroup, FaDollarSign, FaWarehouse, FaTag, FaRuler, FaWeightHanging, FaIndustry, FaSave, FaTimes, FaInfoCircle } from "react-icons/fa";
//
// const UpdateDamageProductModal = ({ isOpen, onClose, onSuccess, productData }) => {
//     const [form, setForm] = useState({
//         returnable_damage_stock: 0,
//         unreturnable_damage_stock: 0,
//         damage_reason: "",
//         damage_notes: "",
//         damage_type: "returnable" // default tab
//     });
//
//     const [activeTab, setActiveTab] = useState("returnable");
//     const [imageFile, setImageFile] = useState(null);
//     const [previewImage, setPreviewImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [damageHistory, setDamageHistory] = useState([]);
//
//     useEffect(() => {
//         if (productData && isOpen) {
//             setForm({
//                 returnable_damage_stock: productData.returnable_damage_stock || 0,
//                 unreturnable_damage_stock: productData.unreturnable_damage_stock || 0,
//                 damage_reason: "",
//                 damage_notes: "",
//                 damage_type: "returnable"
//             });
//
//             if (productData.image) {
//                 setPreviewImage(productData.image);
//             }
//
//             // Load damage history (you can fetch from API)
//             setDamageHistory([
//                 { type: 'returnable', quantity: productData.returnable_damage_stock || 0, date: new Date().toLocaleDateString(), reason: 'Current stock' },
//                 { type: 'unreturnable', quantity: productData.unreturnable_damage_stock || 0, date: new Date().toLocaleDateString(), reason: 'Current stock' }
//             ]);
//
//             setActiveTab("returnable");
//             setErrors({});
//         }
//     }, [productData, isOpen]);
//
//     if (!isOpen || !productData) return null;
//
//     const validateForm = () => {
//         const newErrors = {};
//
//         if (activeTab === "returnable") {
//             const qty = Number(form.returnable_damage_stock);
//             const currentQty = Number(productData.returnable_damage_stock || 0);
//             const maxAllowed = currentQty + Number(productData.stock || 0);
//
//             if (qty < 0) {
//                 newErrors.returnable_damage_stock = "Damage stock cannot be negative";
//             } else if (qty > maxAllowed) {
//                 newErrors.returnable_damage_stock = `Cannot exceed ${maxAllowed} (Current: ${currentQty} + Available: ${productData.stock})`;
//             }
//         } else {
//             const qty = Number(form.unreturnable_damage_stock);
//             const currentQty = Number(productData.unreturnable_damage_stock || 0);
//             const maxAllowed = currentQty + Number(productData.stock || 0);
//
//             if (qty < 0) {
//                 newErrors.unreturnable_damage_stock = "Damage stock cannot be negative";
//             } else if (qty > maxAllowed) {
//                 newErrors.unreturnable_damage_stock = `Cannot exceed ${maxAllowed} (Current: ${currentQty} + Available: ${productData.stock})`;
//             }
//         }
//
//         if (!form.damage_reason.trim()) {
//             newErrors.damage_reason = "Damage reason is required";
//         }
//
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };
//
//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//
//         if (name === "image") {
//             const file = files[0];
//             setImageFile(file);
//
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     setPreviewImage(reader.result);
//                 };
//                 reader.readAsDataURL(file);
//             }
//         } else {
//             setForm(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//
//             // Clear error for this field
//             if (errors[name]) {
//                 setErrors(prev => ({ ...prev, [name]: null }));
//             }
//         }
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;
//
//         setLoading(true);
//         setErrors({});
//
//         try {
//             const damageType = activeTab;
//             const newQuantity = Number(form[`${damageType}_damage_stock`]);
//             const currentQuantity = Number(productData[`${damageType}_damage_stock`] || 0);
//             const quantityDifference = newQuantity - currentQuantity;
//
//             const payload = {
//                 [damageType === 'returnable' ? 'returnable_damage_stock' : 'unreturnable_damage_stock']: newQuantity,
//                 stock: productData.stock - (quantityDifference > 0 ? quantityDifference : 0), // Reduce stock if damage increases
//                 damage_update: {
//                     type: damageType,
//                     previous_quantity: currentQuantity,
//                     new_quantity: newQuantity,
//                     difference: quantityDifference,
//                     reason: form.damage_reason,
//                     notes: form.damage_notes,
//                     updated_by: "current_user", // Add actual user
//                     updated_at: new Date().toISOString()
//                 }
//             };
//
//             // If image changed, add to payload
//             if (imageFile) {
//                 payload.image = imageFile;
//             }
//
//             const res = await posDamageProductAPI.update(productData.id, payload);
//
//             // Show success message with damage info
//             onSuccess?.({
//                 ...res.data,
//                 damage_update: {
//                     ...payload.damage_update,
//                     product_name: productData.name,
//                     product_code: productData.product_code
//                 }
//             });
//
//             onClose();
//
//         } catch (err) {
//             console.error("API Error:", err);
//             if (err.response?.data) {
//                 setErrors(err.response.data);
//                 alert("Error updating damage stock: " + JSON.stringify(err.response.data));
//             } else {
//                 alert("An unknown error occurred. Please try again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleImageUploadClick = () => {
//         document.getElementById("product-image-upload-update").click();
//     };
//
//     const getStockStatusColor = () => {
//         const stock = Number(productData.stock) || 0;
//         if (stock <= 0) return 'text-red-600 bg-red-100';
//         if (stock <= (productData.alarm_when_stock_is_lessthanOrEqualto || 5)) return 'text-yellow-600 bg-yellow-100';
//         return 'text-green-600 bg-green-100';
//     };
//
//     const getDamagePercentage = (type) => {
//         const total = Number(productData.stock) + Number(productData.returnable_damage_stock) + Number(productData.unreturnable_damage_stock);
//         if (total === 0) return 0;
//
//         if (type === 'returnable') {
//             return ((Number(productData.returnable_damage_stock) / total) * 100).toFixed(1);
//         } else {
//             return ((Number(productData.unreturnable_damage_stock) / total) * 100).toFixed(1);
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
//
//                 {/* Header - Fixed */}
//                 <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-5 text-white">
//                     <div className="flex justify-between items-start">
//                         <div className="flex items-center gap-4">
//                             <div className="bg-white bg-opacity-20 p-3 rounded-xl">
//                                 <FaExclamationTriangle className="text-white text-3xl" />
//                             </div>
//                             <div>
//                                 <h2 className="text-2xl font-bold flex items-center gap-2">
//                                     Update Damage Stock
//                                     <span className="bg-white text-red-600 text-xs px-3 py-1 rounded-full">
//                                         v2.0
//                                     </span>
//                                 </h2>
//                                 <div className="flex items-center gap-3 mt-2 text-white text-opacity-90">
//                                     <span className="flex items-center gap-1">
//                                         <FaBox /> {productData.product_code}
//                                     </span>
//                                     <span>•</span>
//                                     <span>{productData.name}</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="text-white hover:text-gray-200 transition-colors bg-white bg-opacity-20 rounded-lg p-2"
//                         >
//                             <FaTimes size={20} />
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Product Summary Cards */}
//                 <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
//                     <div className="bg-white rounded-xl p-4 shadow-sm">
//                         <p className="text-xs text-gray-500 mb-1">Available Stock</p>
//                         <div className="flex items-center justify-between">
//                             <FaWarehouse className="text-blue-500 text-lg" />
//                             <span className={`text-2xl font-bold ${getStockStatusColor().split(' ')[0]}`}>
//                                 {productData.stock || 0}
//                             </span>
//                         </div>
//                     </div>
//
//                     <div className="bg-white rounded-xl p-4 shadow-sm">
//                         <p className="text-xs text-gray-500 mb-1">Returnable Damage</p>
//                         <div className="flex items-center justify-between">
//                             <FaTag className="text-yellow-500 text-lg" />
//                             <span className="text-2xl font-bold text-yellow-600">
//                                 {productData.returnable_damage_stock || 0}
//                             </span>
//                         </div>
//                         <p className="text-xs text-gray-400 mt-1">{getDamagePercentage('returnable')}% of total</p>
//                     </div>
//
//                     <div className="bg-white rounded-xl p-4 shadow-sm">
//                         <p className="text-xs text-gray-500 mb-1">Unreturnable Damage</p>
//                         <div className="flex items-center justify-between">
//                             <FaExclamationTriangle className="text-red-500 text-lg" />
//                             <span className="text-2xl font-bold text-red-600">
//                                 {productData.unreturnable_damage_stock || 0}
//                             </span>
//                         </div>
//                         <p className="text-xs text-gray-400 mt-1">{getDamagePercentage('unreturnable')}% of total</p>
//                     </div>
//
//                     <div className="bg-white rounded-xl p-4 shadow-sm">
//                         <p className="text-xs text-gray-500 mb-1">Total Products</p>
//                         <div className="flex items-center justify-between">
//                             <FaLayerGroup className="text-purple-500 text-lg" />
//                             <span className="text-2xl font-bold text-purple-600">
//                                 {Number(productData.stock || 0) +
//                                  Number(productData.returnable_damage_stock || 0) +
//                                  Number(productData.unreturnable_damage_stock || 0)}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//
//                 <form onSubmit={handleSubmit}>
//                     <div className="p-6 max-h-[calc(95vh-280px)] overflow-y-auto">
//
//                         {/* Product Details Section */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                             {/* Left Column - Image */}
//                             <div className="bg-gray-50 p-5 rounded-xl">
//                                 <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
//                                     <FaImage className="text-blue-500" /> Product Image
//                                 </label>
//                                 <div className="relative">
//                                     <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-300 flex items-center justify-center">
//                                         {previewImage ? (
//                                             <img src={previewImage} alt={productData.name} className="w-full h-full object-contain" />
//                                         ) : (
//                                             <div className="text-center p-4">
//                                                 <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
//                                                 <p className="text-xs text-gray-500">No Image</p>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <input
//                                         id="product-image-upload-update"
//                                         type="file"
//                                         name="image"
//                                         accept="image/*"
//                                         onChange={handleChange}
//                                         className="hidden"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={handleImageUploadClick}
//                                         className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 shadow-lg flex items-center gap-1"
//                                     >
//                                         <FaImage size={14} /> Change
//                                     </button>
//                                 </div>
//                                 {errors.image && <p className="text-red-500 text-xs mt-2">{errors.image}</p>}
//                             </div>
//
//                             {/* Right Column - Product Info */}
//                             <div className="md:col-span-2 space-y-4">
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <label className="text-xs text-gray-500">Product Name</label>
//                                         <p className="font-semibold text-gray-800 flex items-center gap-2">
//                                             <FaBox className="text-blue-500" /> {productData.name}
//                                         </p>
//                                     </div>
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <label className="text-xs text-gray-500">Product Code/SKU</label>
//                                         <p className="font-semibold text-gray-800 flex items-center gap-2">
//                                             <FaBarcode className="text-blue-500" /> {productData.product_code}
//                                         </p>
//                                     </div>
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <label className="text-xs text-gray-500">Category</label>
//                                         <p className="font-semibold text-gray-800">{productData.category_name || 'N/A'}</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <label className="text-xs text-gray-500">Brand</label>
//                                         <p className="font-semibold text-gray-800">{productData.brand_name || 'N/A'}</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <label className="text-xs text-gray-500">Unit</label>
//                                         <p className="font-semibold text-gray-800">{productData.unit_name || 'N/A'}</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <label className="text-xs text-gray-500">Size</label>
//                                         <p className="font-semibold text-gray-800">{productData.size_name || 'N/A'}</p>
//                                     </div>
//                                 </div>
//
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="bg-green-50 p-4 rounded-lg">
//                                         <label className="text-xs text-gray-500">Purchase Price</label>
//                                         <p className="font-semibold text-gray-800 flex items-center gap-1">
//                                             <FaDollarSign className="text-green-600" /> {productData.purchase_price || 0}
//                                         </p>
//                                     </div>
//                                     <div className="bg-blue-50 p-4 rounded-lg">
//                                         <label className="text-xs text-gray-500">Selling Price</label>
//                                         <p className="font-semibold text-gray-800 flex items-center gap-1">
//                                             <FaDollarSign className="text-blue-600" /> {productData.selling_price || 0}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Damage Stock Update Section */}
//                         <div className="border-t pt-6">
//                             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                                 <FaExclamationTriangle className="text-red-500" />
//                                 Update Damage Stock
//                                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                                     Select Type First
//                                 </span>
//                             </h3>
//
//                             {/* Damage Type Tabs */}
//                             <div className="flex gap-3 mb-6">
//                                 <button
//                                     type="button"
//                                     onClick={() => setActiveTab("returnable")}
//                                     className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
//                                         activeTab === "returnable"
//                                             ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
//                                             : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                                     }`}
//                                 >
//                                     <FaTag className="inline mr-2" />
//                                     Returnable Damage
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => setActiveTab("unreturnable")}
//                                     className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
//                                         activeTab === "unreturnable"
//                                             ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
//                                             : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                                     }`}
//                                 >
//                                     <FaExclamationTriangle className="inline mr-2" />
//                                     Unreturnable Damage
//                                 </button>
//                             </div>
//
//                             {/* Damage Input Fields */}
//                             <div className="bg-gray-50 p-6 rounded-xl">
//                                 <div className="grid md:grid-cols-2 gap-6">
//                                     {/* Left Column - Quantity Input */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             {activeTab === "returnable" ? "Returnable Damage Quantity" : "Unreturnable Damage Quantity"}
//                                         </label>
//                                         <div className="relative">
//                                             <input
//                                                 type="number"
//                                                 step="1"
//                                                 min="0"
//                                                 name={`${activeTab}_damage_stock`}
//                                                 value={form[`${activeTab}_damage_stock`]}
//                                                 onChange={handleChange}
//                                                 className={`w-full p-3 border-2 rounded-lg text-lg font-bold ${
//                                                     errors[`${activeTab}_damage_stock`]
//                                                         ? "border-red-500 bg-red-50"
//                                                         : "border-gray-300 focus:border-blue-500"
//                                                 }`}
//                                                 placeholder="Enter quantity"
//                                             />
//                                             <span className="absolute right-3 top-3 text-gray-400">
//                                                 Current: {activeTab === "returnable" ? productData.returnable_damage_stock || 0 : productData.unreturnable_damage_stock || 0}
//                                             </span>
//                                         </div>
//                                         {errors[`${activeTab}_damage_stock`] && (
//                                             <p className="text-red-500 text-xs mt-1">{errors[`${activeTab}_damage_stock`]}</p>
//                                         )}
//
//                                         {/* Quantity Helper */}
//                                         <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
//                                             <FaInfoCircle className="text-blue-500" />
//                                             <span>Max allowed: {Number(productData.stock || 0) +
//                                                 (activeTab === "returnable"
//                                                     ? Number(productData.returnable_damage_stock || 0)
//                                                     : Number(productData.unreturnable_damage_stock || 0))}
//                                             </span>
//                                         </div>
//                                     </div>
//
//                                     {/* Right Column - Reason and Notes */}
//                                     <div className="space-y-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Damage Reason <span className="text-red-500">*</span>
//                                             </label>
//                                             <select
//                                                 name="damage_reason"
//                                                 value={form.damage_reason}
//                                                 onChange={handleChange}
//                                                 className={`w-full p-3 border-2 rounded-lg ${
//                                                     errors.damage_reason ? "border-red-500 bg-red-50" : "border-gray-300"
//                                                 }`}
//                                             >
//                                                 <option value="">Select Reason</option>
//                                                 <option value="customer_return">Customer Return (Damaged)</option>
//                                                 <option value="transit_damage">Transit/Shipping Damage</option>
//                                                 <option value="storage_damage">Storage/Warehouse Damage</option>
//                                                 <option value="expired">Expired Product</option>
//                                                 <option value="defective">Manufacturing Defect</option>
//                                                 <option value="other">Other</option>
//                                             </select>
//                                             {errors.damage_reason && (
//                                                 <p className="text-red-500 text-xs mt-1">{errors.damage_reason}</p>
//                                             )}
//                                         </div>
//
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Additional Notes
//                                             </label>
//                                             <textarea
//                                                 name="damage_notes"
//                                                 rows="3"
//                                                 value={form.damage_notes}
//                                                 onChange={handleChange}
//                                                 className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
//                                                 placeholder="Add any additional details about the damage..."
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {/* Damage History Preview */}
//                             {damageHistory.length > 0 && (
//                                 <div className="mt-6">
//                                     <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
//                                         <FaInfoCircle className="text-blue-500" />
//                                         Current Damage Status
//                                     </h4>
//                                     <div className="grid grid-cols-2 gap-3">
//                                         <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
//                                             <p className="text-xs text-yellow-700">Returnable Damage</p>
//                                             <p className="text-lg font-bold text-yellow-700">{productData.returnable_damage_stock || 0} units</p>
//                                         </div>
//                                         <div className="bg-red-50 p-3 rounded-lg border border-red-200">
//                                             <p className="text-xs text-red-700">Unreturnable Damage</p>
//                                             <p className="text-lg font-bold text-red-700">{productData.unreturnable_damage_stock || 0} units</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Footer Actions */}
//                     <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
//                             disabled={loading}
//                         >
//                             <FaTimes /> Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className={`px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-orange-700 transition-colors flex items-center gap-2 shadow-lg ${
//                                 loading ? "opacity-50 cursor-not-allowed" : ""
//                             }`}
//                         >
//                             {loading ? (
//                                 <>
//                                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                                     Updating...
//                                 </>
//                             ) : (
//                                 <>
//                                     <FaSave /> Update Damage Stock
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default UpdateDamageProductModal;


///////////////////version 3  ///////////////////////////////////////////


import React, {useState, useEffect} from "react";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import {
    FaBox, FaExclamationTriangle, FaBarcode, FaLayerGroup,
    FaDollarSign, FaWarehouse, FaTag, FaSave, FaTimes,
    FaInfoCircle, FaHistory, FaUser, FaCalendarAlt
} from "react-icons/fa";

const UpdateDamageStockModal = ({isOpen, onClose, onSuccess, productData, supplierData, customerData}) => {
    // ============ STATE MANAGEMENT ============
    const [form, setForm] = useState({
        damage_type: "returnable",
        source_type: "manual",
        quantity: 0,
        reason: "",
        notes: "",
        unit_cost: 0,
        supplier: null,
        customer: null,
        reference_no: "",
        is_compensated: false,
        compensated_amount: 0
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState("damage_info");
    const [damageHistory, setDamageHistory] = useState([]);
    const [showCompensation, setShowCompensation] = useState(false);

    // ============ INITIALIZE ============
    useEffect(() => {
        if (isOpen && productData) {
            // Load damage history
            loadDamageHistory();

            // Set initial form values
            setForm({
                damage_type: "returnable",
                source_type: "manual",
                quantity: 0,
                reason: "",
                notes: "",
                unit_cost: productData.purchase_price || 0,
                supplier: supplierData?.id || null,
                customer: customerData?.id || null,
                reference_no: generateReferenceNo(),
                is_compensated: false,
                compensated_amount: 0
            });
            setErrors({});
            setActiveTab("damage_info");
        }
    }, [isOpen, productData, supplierData, customerData]);

    // ============ API CALLS ============
    const loadDamageHistory = async () => {
        try {
            const res = await posDamageProductAPI.getByProduct(productData.id, {
                limit: 5,
                ordering: '-created_at'
            });
            setDamageHistory(res.data.results || res.data);
        } catch (error) {
            console.error("Failed to load damage history:", error);
        }
    };

    // ============ HELPERS ============
    const generateReferenceNo = () => {
        const date = new Date();
        return `DMG-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    };

    const validateForm = () => {
        const newErrors = {};

        // Quantity validation
        if (!form.quantity || form.quantity <= 0) {
            newErrors.quantity = "Quantity must be greater than 0";
        } else if (form.quantity > (productData.stock || 0)) {
            newErrors.quantity = `Cannot exceed available stock (${productData.stock})`;
        }

        // Reason validation
        if (!form.reason?.trim()) {
            newErrors.reason = "Damage reason is required";
        }

        // Unit cost validation
        if (!form.unit_cost || form.unit_cost <= 0) {
            newErrors.unit_cost = "Valid unit cost is required";
        }

        // Source specific validation
        if (form.source_type === 'purchase' && !form.supplier) {
            newErrors.supplier = "Supplier is required for purchase damage";
        }

        if (form.source_type === 'sale' && !form.customer) {
            newErrors.customer = "Customer is required for sale damage";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ============ HANDLERS ============
    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setForm(prev => ({
    //         ...prev,
    //         [name]: type === 'checkbox' ? checked : value
    //     }));
    //
    //     // Clear error for this field
    //     if (errors[name]) {
    //         setErrors(prev => ({ ...prev, [name]: null }));
    //     }
    // };
    //
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!validateForm()) return;
    //
    //     setLoading(true);
    //     setErrors({});
    //
    //     try {
    //         // ✅ সঠিক Payload - DamageStock API এর জন্য
    //         const payload = {
    //             product: productData.id,
    //             damage_type: form.damage_type,
    //             source_type: form.source_type,
    //             quantity: Number(form.quantity),
    //             unit_cost: Number(form.unit_cost),
    //             reason: form.reason,
    //             notes: form.notes,
    //             reference_no: form.reference_no,
    //             supplier: form.supplier,
    //             customer: form.customer,
    //             is_compensated: form.is_compensated,
    //             compensated_amount: form.is_compensated ? Number(form.compensated_amount) : 0
    //         };
    //
    //         // Add source references based on source_type
    //         if (form.source_purchase_id) {
    //             payload.source_purchase = form.source_purchase_id;
    //             payload.source_purchase_item = form.source_purchase_item_id;
    //         }
    //         if (form.source_sale_id) {
    //             payload.source_sale = form.source_sale_id;
    //             payload.source_sale_item = form.source_sale_item_id;
    //         }
    //
    //         console.log("Creating Damage Entry:", payload);
    //
    //         // ✅ DamageStock API কল
    //         const res = await posDamageProductAPI.create(payload);
    //
    //         onSuccess?.({
    //             ...res.data,
    //             product_name: productData.name,
    //             product_code: productData.product_code
    //         });
    //
    //         onClose();
    //
    //     } catch (err) {
    //         console.error("Failed to create damage entry:", err);
    //         if (err.response?.data) {
    //             setErrors(err.response.data);
    //         } else {
    //             alert("Failed to create damage entry. Please try again.");
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // ============ HANDLERS ============
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        // ✅ Number conversion for supplier/customer
        if (name === 'supplier' || name === 'customer') {
            setForm(prev => ({
                ...prev,
                [name]: value ? Number(value) : null
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: null}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            // ✅ সঠিক Payload - সব Number এ convert করা
            const payload = {
                product: productData.id,
                damage_type: form.damage_type,
                source_type: form.source_type,
                quantity: Number(form.quantity),
                unit_cost: Number(form.unit_cost),
                reason: form.reason,
                notes: form.notes,
                reference_no: form.reference_no,
                // ✅ Force convert to Number or null
                supplier: form.supplier ? Number(form.supplier) : null,
                customer: form.customer ? Number(form.customer) : null,
                is_compensated: form.is_compensated,
                compensated_amount: form.is_compensated ? Number(form.compensated_amount) : 0
            };

            console.log("Creating Damage Entry:", payload);

            // const res = await posDamageProductAPI.create(payload);
            const res = await posDamageProductAPI.update(payload);

            onSuccess?.({
                ...res.data,
                product_name: productData.name,
                product_code: productData.product_code
            });

            onClose();

        } catch (err) {
            console.error("Failed to create damage entry:", err);
            if (err.response?.data) {
                setErrors(err.response.data);
                alert("Validation Error: " + JSON.stringify(err.response.data));
            } else {
                alert("Failed to create damage entry. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ============ UI COMPONENTS ============
    const DamageSummaryCards = () => (
        <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <p className="text-sm text-blue-600 mb-1">Available Stock</p>
                <div className="flex items-center justify-between">
                    <FaWarehouse className="text-blue-600 text-xl"/>
                    <span className="text-2xl font-bold text-blue-700">
                        {productData?.stock || 0}
                    </span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                <p className="text-sm text-yellow-600 mb-1">Returnable Damage</p>
                <div className="flex items-center justify-between">
                    <FaTag className="text-yellow-600 text-xl"/>
                    <span className="text-2xl font-bold text-yellow-700">
                        {productData?.returnable_damage_stock || 0}
                    </span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                <p className="text-sm text-red-600 mb-1">Unreturnable Damage</p>
                <div className="flex items-center justify-between">
                    <FaExclamationTriangle className="text-red-600 text-xl"/>
                    <span className="text-2xl font-bold text-red-700">
                        {productData?.unreturnable_damage_stock || 0}
                    </span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <p className="text-sm text-purple-600 mb-1">Total Loss</p>
                <div className="flex items-center justify-between">
                    <FaDollarSign className="text-purple-600 text-xl"/>
                    <span className="text-2xl font-bold text-purple-700">
                        ৳{(productData?.returnable_damage_stock + productData?.unreturnable_damage_stock) * (productData?.purchase_price || 0)}
                    </span>
                </div>
            </div>
        </div>
    );

    const ProductInfoCard = () => (
        <div className="bg-white border rounded-xl p-6 mb-6">
            <div className="flex items-start gap-6">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {productData?.image ? (
                        <img src={productData.image} alt={productData.name} className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FaBox className="text-4xl text-gray-400"/>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-gray-500">Product Name</p>
                        <p className="font-semibold">{productData?.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Product Code</p>
                        <p className="font-semibold">{productData?.product_code}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="font-semibold">{productData?.category_name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Purchase Price</p>
                        <p className="font-semibold text-green-600">৳{productData?.purchase_price}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Selling Price</p>
                        <p className="font-semibold text-blue-600">৳{productData?.selling_price}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Unit</p>
                        <p className="font-semibold">{productData?.unit_name || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const DamageForm = () => (
        <div className="space-y-6">
            {/* Row 1: Damage Type & Source Type */}
            <div className="grid grid-cols-2 gap-6">
                {/* Damage Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Damage Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({...prev, damage_type: "returnable"}))}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                                form.damage_type === "returnable"
                                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                    : "border-gray-200 hover:border-yellow-300"
                            }`}
                        >
                            <FaTag className="inline mr-2"/>
                            Returnable
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm(prev => ({...prev, damage_type: "unreturnable"}))}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                                form.damage_type === "unreturnable"
                                    ? "border-red-500 bg-red-50 text-red-700"
                                    : "border-gray-200 hover:border-red-300"
                            }`}
                        >
                            <FaExclamationTriangle className="inline mr-2"/>
                            Unreturnable
                        </button>
                    </div>
                </div>

                {/* Source Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="source_type"
                        value={form.source_type}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                    >
                        <option value="manual">Manual Entry</option>
                        <option value="purchase">Purchase Related</option>
                        <option value="sale">Sale Related</option>
                        <option value="adjustment">Stock Adjustment</option>
                    </select>
                </div>
            </div>

            {/* Row 2: Quantity & Unit Cost */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Damage Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        max={productData?.stock}
                        value={form.quantity}
                        onChange={handleChange}
                        className={`w-full p-3 border-2 rounded-xl ${
                            errors.quantity ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="Enter quantity"
                    />
                    {errors.quantity && (
                        <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Max: {productData?.stock || 0} units
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Cost (৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="unit_cost"
                        step="0.01"
                        min="0"
                        value={form.unit_cost}
                        onChange={handleChange}
                        className={`w-full p-3 border-2 rounded-xl ${
                            errors.unit_cost ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                    />
                    {errors.unit_cost && (
                        <p className="text-red-500 text-xs mt-1">{errors.unit_cost}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Total Loss: ৳{(form.quantity * form.unit_cost).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Row 3: Supplier/Customer (conditional) */}

            {form.source_type === 'purchase' && (
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Supplier <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="supplier"
                            value={form.supplier || ''}
                            onChange={handleChange}
                            className={`w-full p-3 border-2 rounded-xl ${
                                errors.supplier ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                            }`}
                        >
                            <option value="">Select Supplier</option>
                            <option value={supplierData?.id}>{supplierData?.name}</option>
                        </select>
                        {errors.supplier && (
                            <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Purchase Reference
                        </label>
                        <input
                            type="text"
                            name="source_purchase"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl"
                            placeholder="Invoice #"
                        />
                    </div>
                </div>
            )}

            {form.source_type === 'sale' && (
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Customer <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="customer"
                            value={form.customer || ''}
                            onChange={handleChange}
                            className={`w-full p-3 border-2 rounded-xl ${
                                errors.customer ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                            }`}
                        >
                            <option value="">Select Customer</option>
                            <option value={customerData?.id}>{customerData?.name}</option>
                        </select>
                        {errors.customer && (
                            <p className="text-red-500 text-xs mt-1">{errors.customer}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sale Reference
                        </label>
                        <input
                            type="text"
                            name="source_sale"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl"
                            placeholder="Invoice #"
                        />
                    </div>
                </div>
            )}

            {/* Row 4: Reason & Reference */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Damage Reason <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        className={`w-full p-3 border-2 rounded-xl ${
                            errors.reason ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
                        }`}
                    >
                        <option value="">Select Reason</option>
                        <option value="customer_return">Customer Return (Damaged)</option>
                        <option value="transit_damage">Transit/Shipping Damage</option>
                        <option value="storage_damage">Storage/Warehouse Damage</option>
                        <option value="expired">Expired Product</option>
                        <option value="defective">Manufacturing Defect</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.reason && (
                        <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reference Number
                    </label>
                    <input
                        type="text"
                        name="reference_no"
                        value={form.reference_no}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                        readOnly
                    />
                </div>
            </div>

            {/* Row 5: Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                </label>
                <textarea
                    name="notes"
                    rows="3"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                    placeholder="Add any additional details about the damage..."
                />
            </div>

            {/* Row 6: Compensation */}
            <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="is_compensated"
                        name="is_compensated"
                        checked={form.is_compensated}
                        onChange={(e) => {
                            handleChange(e);
                            setShowCompensation(e.target.checked);
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_compensated" className="ml-2 text-sm font-medium text-gray-700">
                        Mark as Compensated
                    </label>
                </div>

                {showCompensation && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Compensated Amount
                            </label>
                            <input
                                type="number"
                                name="compensated_amount"
                                step="0.01"
                                min="0"
                                max={form.quantity * form.unit_cost}
                                value={form.compensated_amount}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pending Amount
                            </label>
                            <input
                                type="text"
                                value={(form.quantity * form.unit_cost - form.compensated_amount).toFixed(2)}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                                readOnly
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const DamageHistory = () => (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaHistory className="text-gray-500"/>
                Recent Damage History
            </h3>
            <div className="space-y-3">
                {damageHistory.map((damage, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        damage.damage_type === 'returnable'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {damage.damage_type}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        <FaUser className="inline mr-1"/>
                                        {damage.created_by_name || 'System'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        <FaCalendarAlt className="inline mr-1"/>
                                        {new Date(damage.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="font-medium">{damage.quantity} units - {damage.reason}</p>
                                <p className="text-sm text-gray-600">{damage.notes}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Loss</p>
                                <p className="font-bold text-red-600">৳{damage.total_loss}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // ============ MAIN RENDER ============
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                                <FaExclamationTriangle className="text-white text-3xl"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Add Damage Stock Entry</h2>
                                <p className="text-white text-opacity-90 mt-1">
                                    {productData?.name} ({productData?.product_code})
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors bg-white bg-opacity-20 rounded-lg p-2"
                        >
                            <FaTimes size={20}/>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b px-6">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab("damage_info")}
                            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                                activeTab === "damage_info"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Damage Information
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                                activeTab === "history"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Damage History
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
                    <DamageSummaryCards/>
                    <ProductInfoCard/>

                    {activeTab === "damage_info" ? (
                        <form onSubmit={handleSubmit}>
                            <DamageForm/>

                            {/* Footer Actions */}
                            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    disabled={loading}
                                >
                                    <FaTimes/> Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div
                                                className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave/> Create Damage Entry
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <DamageHistory/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateDamageStockModal;