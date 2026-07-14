import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, User, Phone, Mail } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import UpdateEmployeeModal from "./UpdateProfileModal";

/**
 * SupplierList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Supplier records.
 */
const SupplierList = ({ employees, onUpdate }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleViewProfile = (item) => {
        navigate(`/purchase/supplier/profile/${item.id}`);
    };

    const handleEdit = (item) => {
        setSelectedEmployee(item);
        setShowEditModal(true);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return;
        setLoadingId(item.id);
        try {
            await posSupplierAPI.delete(item.id);
            alert(`${item.name} deleted successfully!`);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error(error);
            alert("Failed to delete supplier.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        if (onUpdate) onUpdate(updatedData);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const columns = [
        {
            header: "Supplier",
            accessor: "name",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                        {item.image ? (
                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <User size={18} className="text-gray-400" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">{item.name}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            <Mail size={10} />
                            <span className="truncate">{item.email || "No Email"}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Contact Info",
            accessor: "phone",
            render: (item) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                        <Phone size={12} className="text-gray-400" />
                        <span className="text-xs">{item.phone || "N/A"}</span>
                    </div>
                    {item.user?.phone && (
                        <span className="text-[10px] text-gray-400 font-medium">Sec: {item.user.phone}</span>
                    )}
                </div>
            )
        },
        {
            header: "Joined Date",
            accessor: "created_at",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">{formatDate(item.created_at)}</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: #{item.id}</span>
                </div>
            )
        },
        {
            header: "Due Status",
            accessor: "due_amount",
            className: "text-center",
            render: (item) => {
                const due = parseFloat(item.due_amount || 0);
                let type = "default";
                let label = "Clear";
                
                if (due > 0) {
                    type = "success";
                    label = `Payable ৳${due.toLocaleString()}`;
                } else if (due < 0) {
                    type = "danger";
                    label = `Receivable ৳${Math.abs(due).toLocaleString()}`;
                }
                
                return <StatusBadge type={type} label={label} />;
            }
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => handleViewProfile(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile"><Eye size={16} /></button>
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                        {loadingId === item.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
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
        </>
    );
};

export default SupplierList;