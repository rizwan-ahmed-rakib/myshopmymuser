import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import ProfileImageUpload from "./ProfileImageUpload";
import {ROLE_OPTIONS} from "./roles";
import {useForm} from "../../../hooks/profile";
import LoadingSpinner from "./LoadingSpinner";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";

const DueCard = ({ due_amount }) => {
    const config = useMemo(() => {
        if (due_amount > 0) return { cls: "receivable", label: "Receivable", sub: "Customer owes this amount", status: "Pending", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> };
        if (due_amount < 0) return { cls: "payable", label: "Payable", sub: "You owe this amount", status: "Pending", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> };
        return { cls: "clear", label: "Clear", sub: "No outstanding balance", status: "Settled", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> };
    }, [due_amount]);

    return (
        <div className={`dc ${config.cls}`}>
            <div className="dc-bg" />
            <div className="dc-c">
                <div className="dc-h">
                    <span className="dc-lbl">{config.label}</span>
                    <div className="dc-ico">{config.icon}</div>
                </div>
                <div className="dc-amt">${Math.abs(due_amount || 0).toFixed(2)}</div>
                <div className="dc-sub">{config.sub}</div>
                <div className="dc-ind">
                    <span className="dc-dot" />
                    <span className="dc-st">{config.status}</span>
                </div>
            </div>
        </div>
    );
};

const UpdateEmployeeModal = ({ isOpen, onClose, onSuccess, employeeData }) => {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

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

    useEffect(() => {
        if (employeeData && isOpen) {
            setFormData({
                name: employeeData.name || "",
                email: employeeData.email || "",
                role: employeeData.role || "marketing_officer",
                phone_number: employeeData.phone || "",
                address: employeeData.address || "",
                due_amount: employeeData.due_amount || 0,
            });
            if (employeeData.image) {
                setPreviewImage(employeeData.image);
            }
        }
    }, [employeeData, isOpen, setFormData]);

    const handleImageChange = (file) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleImageUpload = () => {
        document.getElementById("profile-picture-upload").click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const dataToSend = { ...form };
            if (imageFile) dataToSend.image = imageFile;
            const res = await posCustomerAPI.update(employeeData.id, dataToSend);
            if (onSuccess) onSuccess(res.data);
            onClose();
        } catch (error) {
            console.error("Update error:", error);
            if (error.response?.data) {
                alert("Update failed: " + JSON.stringify(error.response.data));
            } else {
                alert("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => onClose();

    if (!isOpen) return null;

    return (
        <>
            {/* DueCard Styles */}
            <style>{`
                .dc{position:relative;width:100%;border-radius:16px;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif;transition:all .4s ease;box-shadow:0 4px 24px rgba(0,0,0,.08)}
                .dc:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.12)}
                .dc-bg{position:absolute;inset:0;opacity:.06;transition:background .4s}
                .dc.receivable{border:1.5px solid rgba(239,68,68,.25);background:linear-gradient(145deg,#fff5f5,#fff)}
                .dc.receivable .dc-bg{background:linear-gradient(135deg,#ef4444,#b91c1c)}
                .dc.receivable .dc-lbl{background:rgba(239,68,68,.12);color:#dc2626}
                .dc.receivable .dc-ico{background:rgba(239,68,68,.1);color:#dc2626}
                .dc.receivable .dc-amt{color:#dc2626}
                .dc.receivable .dc-dot{background:#ef4444;box-shadow:0 0 8px rgba(239,68,68,.5)}
                .dc.receivable .dc-st{color:#b91c1c}
                .dc.receivable:hover{border-color:rgba(239,68,68,.45);box-shadow:0 8px 32px rgba(239,68,68,.12)}
                .dc.payable{border:1.5px solid rgba(34,197,94,.25);background:linear-gradient(145deg,#f0fdf4,#fff)}
                .dc.payable .dc-bg{background:linear-gradient(135deg,#22c55e,#15803d)}
                .dc.payable .dc-lbl{background:rgba(34,197,94,.12);color:#16a34a}
                .dc.payable .dc-ico{background:rgba(34,197,94,.1);color:#16a34a}
                .dc.payable .dc-amt{color:#16a34a}
                .dc.payable .dc-dot{background:#22c55e;box-shadow:0 0 8px rgba(34,197,94,.5)}
                .dc.payable .dc-st{color:#15803d}
                .dc.payable:hover{border-color:rgba(34,197,94,.45);box-shadow:0 8px 32px rgba(34,197,94,.12)}
                .dc.clear{border:1.5px solid rgba(100,116,139,.2);background:linear-gradient(145deg,#f8fafc,#fff)}
                .dc.clear .dc-bg{background:linear-gradient(135deg,#64748b,#334155)}
                .dc.clear .dc-lbl{background:rgba(100,116,139,.1);color:#475569}
                .dc.clear .dc-ico{background:rgba(100,116,139,.08);color:#475569}
                .dc.clear .dc-amt{color:#334155}
                .dc.clear .dc-dot{background:#94a3b8;box-shadow:0 0 8px rgba(148,163,184,.4);animation:none}
                .dc.clear .dc-st{color:#64748b}
                .dc.clear:hover{border-color:rgba(100,116,139,.35);box-shadow:0 8px 32px rgba(100,116,139,.1)}
                .dc-c{position:relative;z-index:1;padding:22px 24px}
                .dc-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
                .dc-lbl{font-size:12px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;padding:5px 12px;border-radius:20px;transition:all .4s}
                .dc-ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;transition:all .4s}
                .dc-amt{font-size:30px;font-weight:800;letter-spacing:-.5px;line-height:1.1;margin-bottom:6px;transition:color .4s}
                .dc-sub{font-size:13px;color:#94a3b8;margin-bottom:18px}
                .dc-ind{display:flex;align-items:center;gap:8px;padding-top:16px;border-top:1px solid rgba(0,0,0,.06)}
                .dc-dot{width:8px;height:8px;border-radius:50%;transition:all .4s;animation:pulse 2s ease-in-out infinite}
                @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
                .dc-st{font-size:12px;font-weight:500;transition:color .4s}
            `}</style>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Update Customer information</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                ID: <span className="font-semibold">#{employeeData?.id}</span>
                            </p>
                        </div>
                        <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h3>
                                    <ProfileImageUpload
                                        previewImage={previewImage}
                                        onImageChange={handleImageChange}
                                        onImageUpload={handleImageUpload}
                                        size="lg"
                                        editable={true}
                                    />
                                </div>

                                {/* ✅ DueCard এখানে বসেছে */}
                                <DueCard due_amount={Number(form.due_amount) || 0} />
                            </div>

                            {/* Right Column - Form Fields */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                            <input
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? "border-red-500" : "border-gray-300"}`}
                                                name="name"
                                                placeholder="John Doe"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                                    name="email"
                                                    placeholder="john@example.com"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                                                <select
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                                    name="role"
                                                    value={form.role}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    {ROLE_OPTIONS.map((option) => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                                            <input
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                name="phone_number"
                                                placeholder="+880 1X-XXXX-XXXX"
                                                value={form.phone_number}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
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
                                    <><LoadingSpinner size="sm" className="mr-2" /> Updating...</>
                                ) : (
                                    "Update Profile"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

UpdateEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    employeeData: PropTypes.object.isRequired,
};

export default UpdateEmployeeModal;