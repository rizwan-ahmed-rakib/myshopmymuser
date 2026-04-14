import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {ROLE_COLORS, ROLE_OPTIONS} from "./roles";
import UpdateEmployeeModal from "./UpdateProfileModal";
import SuccessPopup from "./UpdateProfileSuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";

const CustomerList = ({ employees, onUpdate }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleViewProfile = (employee) => {
        navigate(`/customer/profile/${employee.id}`);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowEditModal(true);
    };

    const handleDelete = async (employee) => {
        if (!window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
            return;
        }

        setLoadingId(employee.id);
        try {
            await posCustomerAPI.delete(employee.id);
            setSuccessMessage(`${employee.name} deleted successfully!`);
            setShowSuccess(true);

            // Refresh employee list
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete employee.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        setSuccessMessage("Employee updated successfully!");
        setShowSuccess(true);

        // Refresh employee list
        if (onUpdate) {
            onUpdate();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleLabel = (roleValue) => {
        const role = ROLE_OPTIONS.find(r => r.value === roleValue);
        return role ? role.label : roleValue;
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Employee
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Role
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Contact
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Joined
                            </span>
                        </div>
                        <div className="col-span-2 text-right">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                    {employees?.map((employee) => (
                        <div
                            key={employee.id}
                            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                        >
                            <div className="grid grid-cols-12 gap-4 items-center">
                                {/* Employee Info */}
                                <div className="col-span-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                                <img
                                                    className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                                                    src={employee.image || "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"}
                                                    alt={employee.name}
                                                    onError={(e) => {
                                                        e.target.src = "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80";
                                                    }}
                                                />
                                                <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                                                    employee.user?.is_present ? 'bg-green-400' : 'bg-gray-300'
                                                }`} />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {employee.name}
                                                </p>
                                                {employee.user?.is_active === false && (
                                                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {employee.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="col-span-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        ROLE_COLORS[employee.role] || 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {getRoleLabel(employee.role)}
                                    </span>
                                </div>

                                {/* Contact */}
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-900">
                                        {employee.phone_number || "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {employee.user?.phone_number}
                                    </div>
                                </div>

                                {/* Joined Date */}
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-900">
                                        {formatDate(employee.date_joined)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        ID: #{employee.id}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2">
                                    <div className="flex items-center justify-end space-x-2">
                                        {/* View Button */}
                                        <button
                                            onClick={() => handleViewProfile(employee)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Profile"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEdit(employee)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Edit"
                                            disabled={loadingId === employee.id}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(employee)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                            disabled={loadingId === employee.id}
                                        >
                                            {loadingId === employee.id ? (
                                                <LoadingSpinner size="xs" />
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {(!employees || employees.length === 0) && (
                        <div className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.268A10.02 10.02 0 0122 12c0 3.22-1.64 6.065-4.14 7.8M3.86 19.8A10.02 10.02 0 012 12c0-3.22 1.64-6.065 4.14-7.8" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new employee.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedEmployee && (
                <UpdateEmployeeModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedEmployee(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    employeeData={selectedEmployee}
                />
            )}

            {/* Success Popup */}
            {showSuccess && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default CustomerList;