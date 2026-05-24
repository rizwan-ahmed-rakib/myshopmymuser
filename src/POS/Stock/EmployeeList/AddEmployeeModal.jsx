import React, {useState} from "react";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";

const AddEmployeeModal = ({isOpen, onClose, onSuccess}) => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "marketing_officer",
        phone_number: "",
        address: "",
        salary: "",
        target: "",
        areacode: "",
        profile_picture: null,
        user: {
            phone_number: "",
            password: "",
            confirm_password: "",
            fingerprint_id: ""
        }
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const roleOptions = [
        {value: "admin", label: "Admin"},
        {value: "head_officer", label: "Head Marketing Officer"},
        {value: "marketing_officer", label: "Marketing Officer"},
        {value: "sales_person", label: "Sales Person"},
        {value: "accountant", label: "Accountant"},
        {value: "delivery_person", label: "Delivery Person"},
        {value: "other", label: "Other"}
    ];

    const handleChange = (e) => {
        const {name, value, files} = e.target;

        if (name === "profile_picture") {
            const file = files[0];
            setForm(prev => ({
                ...prev,
                profile_picture: file
            }));

            // Create image preview
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewImage(null);
            }
        }
        // Handle nested user fields (user.phone_number, user.password, etc.)
        else if (name.startsWith("user.")) {
            const fieldName = name.split(".")[1]; // "user.phone_number" -> "phone_number"
            setForm(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    [fieldName]: value
                }
            }));
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

        // Basic validation
        if (!form.user.phone_number) {
            setErrors({user: {phone_number: "Phone number is required"}});
            setLoading(false);
            return;
        }

        if (form.user.password !== form.user.confirm_password) {
            setErrors({confirm_password: "Passwords do not match!"});
            setLoading(false);
            return;
        }

        try {
            // Method 1: Send as FormData with nested objects (Recommended)
            const formData = new FormData();

            // 1. Create a complete data object
            const dataToSend = {
                user: {
                    phone_number: form.user.phone_number,
                    password: form.user.password,
                    confirm_password: form.user.confirm_password,
                    fingerprint_id: form.user.fingerprint_id || ""
                },
                name: form.name || "",
                email: form.email || "",
                role: form.role || "marketing_officer",
                phone_number: form.phone_number || "", // Profile phone (optional)
                address: form.address || "",
                salary: form.salary ? Number(form.salary) : 0,
                target: form.target ? Number(form.target) : 0,
                areacode: form.areacode || ""
            };

            // 2. Append JSON data for user and other fields
            // Method 1: Append each field separately with proper naming
            formData.append("user.phone_number", dataToSend.user.phone_number);
            formData.append("user.password", dataToSend.user.password);
            formData.append("user.confirm_password", dataToSend.user.confirm_password);
            formData.append("user.fingerprint_id", dataToSend.user.fingerprint_id);

            formData.append("name", dataToSend.name);
            formData.append("email", dataToSend.email);
            formData.append("role", dataToSend.role);
            formData.append("phone_number", dataToSend.phone_number);
            formData.append("address", dataToSend.address);
            formData.append("salary", dataToSend.salary.toString());
            formData.append("target", dataToSend.target.toString());
            formData.append("areacode", dataToSend.areacode);

            // 3. Append profile picture if exists
            if (form.profile_picture) {
                formData.append("profile_picture", form.profile_picture);
            }

            console.log("Sending data:", dataToSend);

            const res = await axios.post(
                `${BASE_URL_of_POS}/api/users/create-new-user-with-profile/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("Response received:", res.data);

            // Success
            if (onSuccess) {
                onSuccess(res.data);
            }

            // Reset form and close
            resetForm();
            onClose();

        } catch (err) {
            console.error("API Error:", err);

            if (err.response?.data) {
                setErrors(err.response.data);

                // Show user-friendly error message
                const errorMsg = JSON.stringify(err.response.data);
                if (errorMsg.includes("phone_number")) {
                    alert("Error: Phone number already exists or invalid!");
                } else {
                    alert("Error: " + errorMsg);
                }
            } else {
                alert("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            role: "marketing_officer",
            phone_number: "",
            address: "",
            salary: "",
            target: "",
            areacode: "",
            profile_picture: null,
            user: {
                phone_number: "",
                password: "",
                confirm_password: "",
                fingerprint_id: ""
            }
        });
        setPreviewImage(null);
        setErrors({});
    };

    const handleImageUpload = () => {
        document.getElementById("profile-picture-upload").click();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Profile Picture */}

                            {/*<div className="bg-gray-50 p-4 rounded-lg">*/}
                            {/*    <h3 className="text-lg font-semibold text-gray-700 mb-3">Profile Picture</h3>*/}
                            {/*    <div className="flex flex-col items-center">*/}
                            {/*        <div className="relative mb-4">*/}
                            {/*            <div*/}
                            {/*                className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-200 flex items-center justify-center">*/}
                            {/*                {previewImage ? (*/}
                            {/*                    <img*/}
                            {/*                        src={previewImage}*/}
                            {/*                        alt="Preview"*/}
                            {/*                        className="w-full h-full object-cover"*/}
                            {/*                    />*/}
                            {/*                ) : (*/}
                            {/*                    <span className="text-gray-400">No Image</span>*/}
                            {/*                )}*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*        <input*/}
                            {/*            type="file"*/}
                            {/*            name="profile_picture"*/}
                            {/*            accept="image/*"*/}
                            {/*            onChange={handleChange}*/}
                            {/*            className="w-full p-2 border rounded"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Profile Picture</h3>
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-4">
                                        <div
                                            className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-200 flex items-center justify-center">
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-sm">No Image</span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleImageUpload}
                                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                                        >
                                            📷
                                        </button>
                                    </div>
                                    <input
                                        id="profile-picture-upload"
                                        type="file"
                                        name="profile_picture"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageUpload}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {previewImage ? "Change Photo" : "Upload Photo"}
                                    </button>
                                </div>
                            </div>


                            {/* Login Credentials - MOST IMPORTANT */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Login Credentials *</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="user.phone_number"
                                            placeholder="017XXXXXXXX"
                                            value={form.user.phone_number}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.user?.phone_number && (
                                            <p className="text-red-500 text-sm mt-1">{errors.user.phone_number}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="user.password"
                                            placeholder="Enter password"
                                            value={form.user.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Password *
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="user.confirm_password"
                                            placeholder="Confirm password"
                                            value={form.user.confirm_password}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.confirm_password && (
                                            <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fingerprint ID
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="user.fingerprint_id"
                                            placeholder="Fingerprint ID (optional)"
                                            value={form.user.fingerprint_id}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="name"
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="email"
                                            placeholder="john@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Role *
                                        </label>
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            {roleOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Phone
                                        </label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="phone_number"
                                            placeholder="Contact phone (optional)"
                                            value={form.phone_number}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="address"
                                            placeholder="Full address"
                                            value={form.address}
                                            onChange={handleChange}
                                            rows="2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Employment Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Employment Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Monthly Salary (৳)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="salary"
                                            placeholder="0"
                                            value={form.salary}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sales Target (৳)
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="target"
                                            placeholder="0"
                                            value={form.target}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Area Code
                                        </label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            name="areacode"
                                            placeholder="e.g., DHA-01"
                                            value={form.areacode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </>
                            ) : (
                                "Add Employee"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;


//////////////////////////////////////////////////////////
