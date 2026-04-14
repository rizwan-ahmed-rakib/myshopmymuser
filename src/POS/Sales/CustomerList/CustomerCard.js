import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {ROLE_COLORS} from "./roles";
import UpdateEmployeeModal from "./UpdateProfileModal";
import SuccessPopup from "./UpdateProfileSuccessPopup";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";

const CustomerCard = ({employee, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [loadingId, setLoadingId] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNameClick = () => {
        navigate(`/customer/profile/${employee.id}`);
    };

    // const handleEdit = (e) => {
    //     e.stopPropagation();
    //     setShowDropdown(false);
    //     if (onEdit) onEdit(employee);
    // };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowEditModal(true);
    };


    // const handleDelete = (e) => {
    //     e.stopPropagation();
    //     setShowDropdown(false);
    //     if (onDelete) onDelete(employee);
    // };

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
            if (onEdit) {
                onEdit();
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
        if (onEdit) {
            onEdit();
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
                    <div className="p-4">
                        {/* Card Header with Actions */}
                        <div className="flex justify-between items-start mb-4">
                            {/* Status Badge */}
                            <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            employee.user?.is_active !== false ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                                <span className="text-xs text-gray-500">
                            {employee.user?.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                            </div>

                            {/* Actions Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                                    </svg>
                                </button>

                                {showDropdown && (
                                    <div
                                        className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                        <button
                                            // onClick={handleEdit}
                                            onClick={() => handleEdit(employee)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            disabled={loadingId === employee.id}

                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                            Edit Profile
                                        </button>
                                        <button
                                            // onClick={handleDelete}
                                            onClick={() => handleDelete(employee)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                            disabled={loadingId === employee.id}

                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                            Delete
                                        </button>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={() => navigate(`/customer/profile/${employee.id}`)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                            </svg>
                                            View Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Image and Basic Info */}
                        <div className="text-center mb-4">
                            <div className="relative inline-block">
                                <div
                                    onClick={handleNameClick}
                                    className="cursor-pointer"
                                >
                                    <img
                                        src={employee.image || employee.image || "https://via.placeholder.com/150"}
                                        className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-md"
                                        alt={employee.name}
                                        onError={(e) => {
                                            // e.target.src = "https://via.placeholder.com/150";
                                            e.target.src = "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80";
                                        }}
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                        ROLE_COLORS[employee.role] || 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {employee.role?.[0]?.toUpperCase() || 'E'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employee Info */}
                        <div className="text-center mb-4">
                            <p className="text-blue-600 text-xs font-medium mb-1">EMP ID: {employee.id}</p>
                            <h3
                                onClick={handleNameClick}
                                className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                            >
                                {employee.name}
                            </h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                ROLE_COLORS[employee.role] || 'bg-gray-100 text-gray-800'
                            }`}>
                        {employee.role || employee.designation}
                    </span>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                <span className="truncate">{employee.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                <span>{employee.phone_number || employee.user?.phone_number || "N/A"}</span>
                            </div>
                        </div>

                        {/* Footer Stats */}
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <div className="text-xs text-gray-600 mb-1">Joined</div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatDate(employee.date_joined)}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-600 mb-1">Status</div>
                                    <div className={`text-sm font-medium ${
                                        employee.user?.is_present ? 'text-green-600' : 'text-gray-600'
                                    }`}>
                                        {employee.user?.is_present ? 'Present' : 'Absent'}
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default CustomerCard;