
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProfileImageUpload from "./ProfileImageUpload";
import {ROLE_OPTIONS} from "./roles";
import {useForm} from "../../../hooks/profile";
import LoadingSpinner from "./LoadingSpinner";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";

const UpdateEmployeeModal = ({ isOpen, onClose, onSuccess, employeeData }) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // Initialize form with validation rules
    const {
        form,
        errors,
        handleChange,
        setFormData,
        validateForm
    } = useForm(
        {
            name: "",
            email: "",
            role: "marketing_officer",
            phone_number: "",
            address: "",
            // salary: "",
            // target: "",
            // areacode: "",
        },
        {
            name: (value) => !value ? "Name is required" : null,
            email: (value) => {
                if (!value) return "Email is required";
                if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid";
                return null;
            },
            role: (value) => !value ? "Role is required" : null,
        }
    );

    // Load employee data when modal opens
    useEffect(() => {
        if (employeeData && isOpen) {
            setFormData({
                name: employeeData.name || "",
                email: employeeData.email || "",
                role: employeeData.role || "marketing_officer",
                phone_number: employeeData.phone || "",
                address: employeeData.address || "",
                // salary: employeeData.salary?.toString() || "",
                // target: employeeData.target?.toString() || "",
                // areacode: employeeData.areacode || "",
            });

            if (employeeData.image) {
                setPreviewImage(employeeData.image);
            }
        }
    }, [employeeData, isOpen, setFormData]);

    const handleImageChange = (file) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = () => {
        document.getElementById("profile-picture-upload").click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const dataToSend = {
                ...form,
                // salary: form.salary ? Number(form.salary) : 0,
                // target: form.target ? Number(form.target) : 0,
            };

            if (imageFile) {
                dataToSend.image = imageFile;
            }

            const res = await posCustomerAPI.update(employeeData.id, dataToSend);

            if (onSuccess) {
                onSuccess(res.data);
            }

            onClose();
        } catch (error) {
            console.error("Update error:", error);
            if (error.response?.data) {
                // Handle API errors
                alert("Update failed: " + JSON.stringify(error.response.data));
            } else {
                alert("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Update Employee</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            ID: <span className="font-semibold">#{employeeData?.id}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Profile Image */}
                        <div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Profile Picture
                                </h3>
                                <ProfileImageUpload
                                    previewImage={previewImage}
                                    onImageChange={handleImageChange}
                                    onImageUpload={handleImageUpload}
                                    size="lg"
                                    editable={true}
                                />
                            </div>
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Personal Information
                                </h3>
                                <div className="space-y-4">
                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                errors.name ? "border-red-500" : "border-gray-300"
                                            }`}
                                            name="name"
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email and Role */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                    errors.email ? "border-red-500" : "border-gray-300"
                                                }`}
                                                name="email"
                                                placeholder="john@example.com"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Role *
                                            </label>
                                            <select
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                                name="role"
                                                value={form.role}
                                                onChange={handleChange}
                                                required
                                            >
                                                {ROLE_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Phone and Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Phone
                                        </label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            name="phone_number"
                                            placeholder="+880 1X-XXXX-XXXX"
                                            value={form.phone_number}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            name="address"
                                            placeholder="Full address"
                                            value={form.address}
                                            onChange={handleChange}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}

                    {/*<div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">*/}
                    {/*    <h3 className="text-lg font-semibold text-gray-800 mb-4">*/}
                    {/*        Employment Details*/}
                    {/*    </h3>*/}
                    {/*    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">*/}
                    {/*        <div>*/}
                    {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*                Salary (৳)*/}
                    {/*            </label>*/}
                    {/*            <div className="relative">*/}
                    {/*                <span className="absolute left-3 top-3 text-gray-500 font-medium">৳</span>*/}
                    {/*                <input*/}
                    {/*                    type="number"*/}
                    {/*                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"*/}
                    {/*                    name="salary"*/}
                    {/*                    placeholder="0"*/}
                    {/*                    value={form.salary}*/}
                    {/*                    onChange={handleChange}*/}
                    {/*                    min="0"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}

                    {/*        <div>*/}
                    {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*                Target (৳)*/}
                    {/*            </label>*/}
                    {/*            <div className="relative">*/}
                    {/*                <span className="absolute left-3 top-3 text-gray-500 font-medium">৳</span>*/}
                    {/*                <input*/}
                    {/*                    type="number"*/}
                    {/*                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"*/}
                    {/*                    name="target"*/}
                    {/*                    placeholder="0"*/}
                    {/*                    value={form.target}*/}
                    {/*                    onChange={handleChange}*/}
                    {/*                    min="0"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}

                    {/*        <div>*/}
                    {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*                Area Code*/}
                    {/*            </label>*/}
                    {/*            <input*/}
                    {/*                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"*/}
                    {/*                name="areacode"*/}
                    {/*                placeholder="DHA-01"*/}
                    {/*                value={form.areacode}*/}
                    {/*                onChange={handleChange}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Updating...
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

UpdateEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    employeeData: PropTypes.object.isRequired,
};

export default UpdateEmployeeModal;





// components/suppliers/UpdateSupplierModal.jsx

// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";
// import BASE_URL_of_POS from "../../../posConfig";
// import LoadingSpinner from "./LoadingSpinner";
//
// const UpdateSupplierModal = ({ isOpen, onClose, onSuccess, supplierData }) => {
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     address: "",
//   });
//
//   const [previewImage, setPreviewImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//
//   /* ===============================
//      Load existing supplier data
//      =============================== */
//   useEffect(() => {
//     if (supplierData && isOpen) {
//       setForm({
//         name: supplierData.name || "",
//         phone: supplierData.phone || "",
//         email: supplierData.email || "",
//         address: supplierData.address || "",
//       });
//
//       setPreviewImage(supplierData.image || null);
//       setImageFile(null);
//       setErrors({});
//     }
//   }, [supplierData, isOpen]);
//
//   /* ===============================
//      Handle input change
//      =============================== */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };
//
//   /* ===============================
//      Handle image change
//      =============================== */
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//
//     setImageFile(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setPreviewImage(reader.result);
//     reader.readAsDataURL(file);
//   };
//
//   /* ===============================
//      Detect changes (UX improvement)
//      =============================== */
//   const isChanged =
//     form.name !== supplierData?.name ||
//     form.phone !== supplierData?.phone ||
//     form.email !== supplierData?.email ||
//     form.address !== supplierData?.address ||
//     imageFile;
//
//   /* ===============================
//      Submit (PATCH)
//      =============================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//
//     if (!form.name || !form.phone) {
//       setErrors({ message: "Name and Phone are required" });
//       return;
//     }
//
//     setLoading(true);
//
//     try {
//       const formData = new FormData();
//
//       // Append only changed fields
//       if (form.name !== supplierData.name)
//         formData.append("name", form.name);
//
//       if (form.phone !== supplierData.phone)
//         formData.append("phone", form.phone);
//
//       if (form.email !== supplierData.email)
//         formData.append("email", form.email);
//
//       if (form.address !== supplierData.address)
//         formData.append("address", form.address);
//
//       if (imageFile) {
//         formData.append("image", imageFile);
//       }
//
//       const res = await axios.patch(
//         `${BASE_URL_of_POS}/api/purchase/suppliers/${supplierData.id}/`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//
//       onSuccess?.(res.data);
//       onClose();
//     } catch (err) {
//       console.error("Update error:", err);
//       if (err.response?.data) {
//         setErrors(err.response.data);
//       } else {
//         alert("Network error. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   if (!isOpen) return null;
//
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">
//               Update Supplier
//             </h2>
//             <p className="text-sm text-gray-500">
//               ID: #{supplierData?.id}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-2xl"
//           >
//             &times;
//           </button>
//         </div>
//
//         {/* Body */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Image */}
//           <div className="flex flex-col items-center">
//             <div className="w-28 h-28 rounded-full overflow-hidden border bg-gray-100">
//               {previewImage ? (
//                 <img
//                   src={previewImage}
//                   alt="Supplier"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center h-full text-gray-400 text-sm">
//                   No Image
//                 </div>
//               )}
//             </div>
//
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="mt-2 text-sm"
//             />
//           </div>
//
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Supplier Name *
//             </label>
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg"
//               required
//             />
//           </div>
//
//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Phone *
//             </label>
//             <input
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg"
//               required
//             />
//           </div>
//
//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg"
//             />
//           </div>
//
//           {/* Address */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Address
//             </label>
//             <textarea
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg"
//               rows="3"
//             />
//           </div>
//
//           {errors.message && (
//             <p className="text-red-500 text-sm">{errors.message}</p>
//           )}
//
//           {/* Footer buttons */}
//           <div className="flex justify-end gap-3 pt-4 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-3 border border-gray-300 rounded-lg"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//
//             <button
//               type="submit"
//               disabled={!isChanged || loading}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <LoadingSpinner size="sm" className="mr-2" />
//                   Updating...
//                 </>
//               ) : (
//                 "Update Supplier"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// UpdateSupplierModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSuccess: PropTypes.func,
//   supplierData: PropTypes.object.isRequired,
// };
//
// export default UpdateSupplierModal;


