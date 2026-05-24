




// components/employees/UpdateEmployeeModal.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProfileImageUpload from "./ProfileImageUpload";
import {ROLE_OPTIONS} from "./roles";
import {useForm} from "../../../hooks/profile";
import {employeeAPI} from "../../../context_or_provider/pos/profile/profileupdate";
import LoadingSpinner from "./LoadingSpinner";

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
            salary: "",
            target: "",
            areacode: "",
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
                phone_number: employeeData.phone_number || "",
                address: employeeData.address || "",
                salary: employeeData.salary?.toString() || "",
                target: employeeData.target?.toString() || "",
                areacode: employeeData.areacode || "",
            });

            if (employeeData.profile_picture) {
                setPreviewImage(employeeData.profile_picture);
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
                salary: form.salary ? Number(form.salary) : 0,
                target: form.target ? Number(form.target) : 0,
            };

            if (imageFile) {
                dataToSend.profile_picture = imageFile;
            }

            const res = await employeeAPI.update(employeeData.id, dataToSend);

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
                    <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Employment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Salary (৳)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500 font-medium">৳</span>
                                    <input
                                        type="number"
                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        name="salary"
                                        placeholder="0"
                                        value={form.salary}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target (৳)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500 font-medium">৳</span>
                                    <input
                                        type="number"
                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        name="target"
                                        placeholder="0"
                                        value={form.target}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Area Code
                                </label>
                                <input
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    name="areacode"
                                    placeholder="DHA-01"
                                    value={form.areacode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

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