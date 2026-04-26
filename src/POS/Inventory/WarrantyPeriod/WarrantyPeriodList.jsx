import React, {useState} from "react";
import UpdateWarrantyPeriodModal from "./UpdateWarrantyPeriodModal";
import SuccessPopup from "./SuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import {posWarrantyPeriodAPI} from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";

const WarrantyPeriodList = ({warrantyPeriods, onUpdate}) => {
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedWarranty, setSelectedWarranty] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

    const getPeriodTypeDisplay = (type) => {
        const types = {'day': 'Days', 'month': 'Months', 'year': 'Years'};
        return types[type] || type;
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</span>
                        </div>
                        <div className="col-span-3">
                            <span
                                className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Duration</span>
                        </div>
                        <div className="col-span-3">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</span>
                        </div>
                        <div className="col-span-2 text-right">
                            <span
                                className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</span>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {warrantyPeriods?.map((warranty) => (
                        <div key={warranty.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-900">{warranty.name}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm text-gray-900">
                                        {warranty.duration} {getPeriodTypeDisplay(warranty.period_type)}
                                    </p>
                                </div>
                                <div className="col-span-3">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${warranty.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {warranty.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="col-span-2 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button onClick={() => handleEdit(warranty)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                        </button>
                                        <button onClick={() => handleDelete(warranty)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                disabled={loadingId === warranty.id}>
                                            {loadingId === warranty.id ? <LoadingSpinner size="xs"/> : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!warrantyPeriods || warrantyPeriods.length === 0) && (
                        <div className="px-6 py-12 text-center text-gray-500">No warranty periods found.</div>
                    )}
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
                <SuccessPopup message={successMessage} onClose={() => setShowSuccess(false)} duration={3000}/>
            )}
        </>
    );
};

export default WarrantyPeriodList;
