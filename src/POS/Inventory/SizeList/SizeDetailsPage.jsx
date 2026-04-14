import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import SuccessPopup from "./SuccessPopup";
import UpdateSizeModal from "./UpdateSizeModal";

const SizeDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [size, setSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

const fetchSizeDetails = useCallback(async () => {
    setLoading(true); // ✅ শুরুতেই loading true
    try {
        const response = await axios.get(
            `${BASE_URL_of_POS}/api/products/size/${id}/`
        );
        setSize(response.data);
    } catch (error) {
        console.error("Error fetching size details:", error);
    } finally {
        setLoading(false); // ✅ API শেষ হলে false
    }
}, [id]);

    useEffect(() => {
        fetchSizeDetails();
    }, [fetchSizeDetails]);

    const handleEditSize = () => {
        setShowEditModal(true);
    };

    const handleUpdateSuccess = (updatedData) => {
        setSize(prev => ({ ...prev, ...updatedData }));
        setShowEditModal(false);
        setSuccessMessage("Size has been updated successfully!");
        setShowSuccessPopup(true);
        fetchSizeDetails();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-700">Loading size details...</p>
                </div>
            </div>
        );
    }

    if (!size) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Size Not Found</h2>
                    <button
                        onClick={() => navigate("/inventory/sizes")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Size List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/inventory/sizes")}
                        className="flex items-center text-gray-600 hover:text-blue-700 mb-4 font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Size List
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Category Image */}
                            <div className="md:w-1/3">
                                <div className="w-full h-64 rounded-lg bg-gray-200 shadow-inner flex items-center justify-center">
                                    <img
                                        src={size.image || "https://via.placeholder.com/300"}
                                        alt={size.title}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
                                    />
                                </div>
                            </div>

                            {/* Category Info */}
                            <div className="md:w-2/3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900">{size.title}</h1>
                                        <p className="text-gray-500 mt-2">ID: {size.id}</p>
                                        <p className="text-gray-500 mt-1">Created: {new Date(size.created).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={handleEditSize}
                                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <UpdateSizeModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleUpdateSuccess}
                    productData={size}
                />
            )}

            {showSuccessPopup && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccessPopup(false)}
                />
            )}
        </div>
    );
};

export default SizeDetailsPage;