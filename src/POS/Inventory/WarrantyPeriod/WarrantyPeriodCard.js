import React, { useState, useRef, useEffect } from "react";
import UpdateWarrantyPeriodModal from "./UpdateWarrantyPeriodModal";
import SuccessPopup from "./SuccessPopup";
import { posWarrantyPeriodAPI } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";

const WarrantyPeriodCard = ({ warrantyPeriod, onEdit, onDelete }) => {
    const [selectedWarranty, setSelectedWarranty] = useState(null);
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

    const handleEdit = () => {
        setSelectedWarranty(warrantyPeriod);
        setShowEditModal(true);
        setShowDropdown(false);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${warrantyPeriod.name}"?`)) {
            return;
        }

        setLoadingId(warrantyPeriod.id);
        try {
            await posWarrantyPeriodAPI.delete(warrantyPeriod.id);
            setSuccessMessage(`${warrantyPeriod.name} deleted successfully!`);
            setShowSuccess(true);
            if (onDelete) onDelete();
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
        if (onEdit) onEdit();
    };

    const getPeriodTypeDisplay = (type) => {
        const types = { 'day': 'Day(s)', 'month': 'Month(s)', 'year': 'Year(s)' };
        return types[type] || type;
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setShowDropdown(!showDropdown)} className="text-white/80 hover:text-white p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>   
                                </svg>
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                    <button onClick={handleEdit} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit</button>
                                    <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{warrantyPeriod.name}</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-800">{warrantyPeriod.duration}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {getPeriodTypeDisplay(warrantyPeriod.period_type)}
                        </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className={`text-xs font-medium ${warrantyPeriod.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {warrantyPeriod.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-400">ID: #{warrantyPeriod.id}</span>
                    </div>
                </div>
            </div>

            {showEditModal && selectedWarranty && (
                <UpdateWarrantyPeriodModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleUpdateSuccess}
                    warrantyData={selectedWarranty}
                />
            )}

            {showSuccess && (
                <SuccessPopup message={successMessage} onClose={() => setShowSuccess(false)} duration={3000} />
            )}
        </>
    );
};

export default WarrantyPeriodCard;
