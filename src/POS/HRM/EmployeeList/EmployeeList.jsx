import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Edit, Trash2, Eye, User, Phone, Calendar} from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import {employeeAPI} from "../../../context_or_provider/pos/profile/profileupdate";
import UpdateEmployeeModal from "./UpdateProfileModal";
import SuccessPopup from "./UpdateProfileSuccessPopup";
import {ROLE_OPTIONS} from "./roles";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * EmployeeList - Refactored to use BackboneTable and StatusBadge.
 * Centralized logic for the Employee sub-module list view.
 */
const EmployeeList = ({employees, onUpdate}) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // --- Actions ---
    const handleViewProfile = (employee) => {
        navigate(`/hrm/employee/profile/${employee.id}`);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowEditModal(true);
    };

    const handleDelete = async (employee) => {
        if (!window.confirm(`Are you sure you want to delete ${employee.name}?`)) return;
        setLoadingId(employee.id);
        try {
            await employeeAPI.delete(employee.id);
            setSuccessMessage(`${employee.name} deleted successfully!`);
            setShowSuccess(true);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete employee.");
        } finally {
            setLoadingId(null);
        }
    };

    // --- Helpers ---
    const getRoleLabel = (roleValue) => {
        const role = ROLE_OPTIONS.find(r => r.value === roleValue);
        return role ? role.label : roleValue;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
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

    // --- Table Configuration ---
    const columns = [
        {
            header: "Employee Info",
            accessor: "name",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        <img
                            className="h-10 w-10 rounded-xl border-2 border-white shadow-sm object-cover"
                            src={item.profile_picture || "https://via.placeholder.com/150?text=User"}
                            alt={item.name}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150?text=User";
                            }}
                        />
                        <span
                            className={`absolute -bottom-1 -right-1 block h-3.5 w-3.5 rounded-full border-2 border-white ${
                                item.user?.is_present ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}/>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 truncate">{item.name}</span>
                            {item.user?.is_active === false && (
                                <StatusBadge type="inactive" label="Inactive" className="scale-75 origin-left"/>
                            )}
                        </div>
                        <span className="text-xs text-gray-400 truncate">{item.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Designation",
            accessor: "role",
            render: (item) => (
                <StatusBadge
                    type="info"
                    label={getRoleLabel(item.role)}
                    className="bg-blue-50 text-blue-700 border-blue-100"
                />
            )
        },
        {
            header: "Contact",
            accessor: "phone_number",
            hiddenMobile: true,
            render: (item) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <Phone size={12} className="text-gray-400"/> {item.phone_number || "N/A"}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium pl-4">{item.user?.phone_number}</span>
                </div>
            )
        },
        {
            header: "Joining Details",
            accessor: "date_joined",
            hiddenMobile: true,
            render: (item) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <Calendar size={12} className="text-gray-400"/> {formatDate(item.date_joined)}
                    </div>
                    <span
                        className="text-[10px] text-gray-400 font-black uppercase tracking-widest pl-4">ID: #{item.id}</span>
                </div>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => handleViewProfile(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye
                        size={16}/></button>
                    <button onClick={() => handleEdit(item)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Edit
                        size={16}/></button>
                    <button onClick={() => handleDelete(item)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        {loadingId === item.id ? <LoadingSpinner size="xs"/> : <Trash2 size={16}/>}
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <BackboneTable
                columns={columns}
                data={employees}
            />

            {/* Modals & Popups */}
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

            {showSuccess && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default EmployeeList;
