import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { posWarrantyPeriodAPI } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";
import SuccessPopup from "./SuccessPopup";
import UpdateWarrantyPeriodModal from "./UpdateWarrantyPeriodModal";
import { FaClock, FaCheckCircle, FaTimesCircle, FaHashtag } from "react-icons/fa";

const WarrantyPeriodDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warranty, setWarranty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchDetails = useCallback(async () => {
        try {
            const response = await posWarrantyPeriodAPI.getById(id);
            setWarranty(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleUpdateSuccess = (updatedData) => {
        setWarranty(updatedData);
        setShowEditModal(false);
        setSuccessMessage("Warranty period has been updated successfully!");
        setShowSuccessPopup(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!warranty) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Warranty Period Not Found</h2>
                    <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Go Back</button>
                </div>
            </div>
        );
    }

    const getPeriodTypeDisplay = (type) => {
        const types = { 'day': 'Days', 'month': 'Months', 'year': 'Years' };
        return types[type] || type;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 mb-6 font-medium transition-colors">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold">{warranty.name}</h1>
                                <p className="opacity-80 mt-1">Warranty Period Details</p>
                            </div>
                            <button onClick={() => setShowEditModal(true)} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                Edit
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-50 p-3 rounded-xl"><FaHashtag className="text-blue-600 text-xl" /></div>
                                <div><p className="text-sm text-gray-500">ID</p><p className="text-lg font-semibold">#{warranty.id}</p></div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="bg-indigo-50 p-3 rounded-xl"><FaClock className="text-indigo-600 text-xl" /></div>
                                <div><p className="text-sm text-gray-500">Duration</p><p className="text-lg font-semibold">{warranty.duration} {getPeriodTypeDisplay(warranty.period_type)}</p></div>
                            </div>
                            <div className="flex items-start space-x-4">
                                {warranty.is_active ? (
                                    <>
                                        <div className="bg-green-50 p-3 rounded-xl"><FaCheckCircle className="text-green-600 text-xl" /></div>
                                        <div><p className="text-sm text-gray-500">Status</p><p className="text-lg font-semibold text-green-600">Active</p></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-red-50 p-3 rounded-xl"><FaTimesCircle className="text-red-600 text-xl" /></div>
                                        <div><p className="text-sm text-gray-500">Status</p><p className="text-lg font-semibold text-red-600">Inactive</p></div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <UpdateWarrantyPeriodModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleUpdateSuccess}
                    warrantyData={warranty}
                />
            )}

            {showSuccessPopup && <SuccessPopup message={successMessage} onClose={() => setShowSuccessPopup(false)} />}
        </div>
    );
};

export default WarrantyPeriodDetailsPage;
