


import React, { useState } from "react";
import { Edit, Trash2 } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import UpdateWarrantyPeriodModal from "./UpdateWarrantyPeriodModal";
import SuccessPopup from "./SuccessPopup";
import { posWarrantyPeriodAPI } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * WarrantyPeriodList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Warranty Periods.
 */
const WarrantyPeriodList = ({ warrantyPeriods, onUpdate }) => {
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedWarranty, setSelectedWarranty] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // --- Actions ---
    const handleEdit = (warranty) => {
        setSelectedWarranty(warranty);
        setShowEditModal(true);
    };

    const handleDelete = async (warranty) => {
        if (!window.confirm(`Are you sure you want to delete ${warranty.name}?`)) {
            return;
        }

        setLoadingId(warranty.id);
        try {
            await posWarrantyPeriodAPI.delete(warranty.id);
            setSuccessMessage(`${warranty.name} deleted successfully!`);
            setShowSuccess(true);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete warranty period.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = () => {
        setShowEditModal(false);
        setSuccessMessage("Warranty period updated successfully!");
        setShowSuccess(true);
        if (onUpdate) onUpdate();
    };

    // --- Helper for Duration Display ---
    const getPeriodTypeDisplay = (type) => {
        const types = { 'day': 'Days', 'month': 'Months', 'year': 'Years' };
        return types[type] || type;
    };

    // --- Table Column Configuration ---
    const columns = [
        {
            header: "Name",
            accessor: "name",
            render: (warranty) => (
                <span className="font-bold text-gray-900">
                    {warranty.name || "N/A"}
                </span>
            )
        },
        {
            header: "Duration",
            accessor: "duration",
            render: (warranty) => (
                <span className="text-sm text-gray-600 font-medium">
                    {warranty.duration} {getPeriodTypeDisplay(warranty.period_type)}
                </span>
            )
        },
        {
            header: "Status",
            accessor: "is_active",
            render: (warranty) => (
                <StatusBadge
                    type={warranty.is_active ? "success" : "danger"}
                    label={warranty.is_active ? "Active" : "Inactive"}
                />
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (warranty) => (
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => handleEdit(warranty)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit"
                        disabled={loadingId === warranty.id}
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(warranty)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                        disabled={loadingId === warranty.id}
                    >
                        {loadingId === warranty.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <BackboneTable
                columns={columns}
                data={warrantyPeriods}
            />

            {/* Modals & Popups */}
            {showEditModal && selectedWarranty && (
                <UpdateWarrantyPeriodModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedWarranty(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    warrantyData={selectedWarranty}
                />
            )}

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

export default WarrantyPeriodList;