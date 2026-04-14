import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL_of_POS from "../../../posConfig";
import SuccessPopup from "./SuccessPopup";
import UpdateSubcategoryModal from "./UpdateSubcategoryModal";
import { FaTag, FaWarehouse, FaInfoCircle } from "react-icons/fa";

const SubCategoryDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subcategory, setSubcategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // 🔹 Subcategory details fetch
    const fetchSubCategoryDetails = useCallback(async () => {
        try {
            const response = await axios.get(
                `${BASE_URL_of_POS}/api/products/subcategory/${id}/`
            );
            setSubcategory(response.data);
        } catch (error) {
            console.error("Error fetching subcategory details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSubCategoryDetails();
    }, [fetchSubCategoryDetails]);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleUpdateSuccess = (updatedData) => {
        setSubcategory((prev) => ({ ...prev, ...updatedData }));
        setShowEditModal(false);
        setSuccessMessage("Subcategory updated successfully!");
        setShowSuccessPopup(true);
    };

    // 🔹 Loader
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-700">
                        Loading subcategory details...
                    </p>
                </div>
            </div>
        );
    }

    // 🔹 Not Found
    if (!subcategory) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Subcategory Not Found
                    </h2>
                    <button
                        onClick={() => navigate("/inventory/subcategories")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Back to Subcategory List
                    </button>
                </div>
            </div>
        );
    }

    // 🔹 Info Card Component
    const InfoCard = ({ icon, title, value }) => (
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-lg font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* 🔙 Back Button */}
                <button
                    onClick={() => navigate("/inventory/subcategories")}
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
                >
                    ← Back to Subcategory List
                </button>

                {/* 🔹 Main Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Image */}
                        <div className="md:w-1/3">
                            <div className="h-72 bg-gray-200 rounded-lg flex items-center justify-center">
                                <img
                                    src={
                                        subcategory.image ||
                                        "https://via.placeholder.com/300"
                                    }
                                    alt={subcategory.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="md:w-2/3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900">
                                        {subcategory.title}
                                    </h1>
                                    <p className="text-gray-500 mt-2">
                                        Subcategory ID: {subcategory.id}
                                    </p>
                                </div>

                                <button
                                    onClick={handleEdit}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                            </div>

                            <div className="mt-8 border-t pt-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Subcategory Details
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <InfoCard
                                        icon={
                                            <FaTag className="text-blue-500" />
                                        }
                                        title="Subcategory Name"
                                        value={subcategory.title}
                                    />

                                    <InfoCard
                                        icon={
                                            <FaWarehouse className="text-purple-500" />
                                        }
                                        title="Category ID"
                                        value={subcategory.category}
                                    />

                                    <InfoCard
                                        icon={
                                            <FaInfoCircle className="text-green-500" />
                                        }
                                        title="Created Date"
                                        value={new Date(
                                            subcategory.created
                                        ).toLocaleDateString()}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Edit Modal */}
            {showEditModal && (
                <UpdateSubcategoryModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleUpdateSuccess}
                    productData={subcategory}
                    // subcategoryData={subcategory}
                />
            )}

            {/* 🔹 Success Popup */}
            {showSuccessPopup && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccessPopup(false)}
                />
            )}
        </div>
    );
};

export default SubCategoryDetailsPage;
