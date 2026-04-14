import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
import SuccessPopup from "./SuccessPopup";

const CategoryList = ({ categories, onUpdate }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleViewDetails = (category) => {
        // TODO: Update to category details page if it exists
        navigate(`/inventory/category/details/${category.id}`);
        console.log("View details for:", category);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const handleDelete = async (category) => {
        if (!window.confirm(`Are you sure you want to delete ${category.title}?`)) {
            return;
        }

        setLoadingId(category.id);
        try {
            await posCategoryAPI.delete(category.id);
            setSuccessMessage(`${category.title} deleted successfully!`);
            setShowSuccess(true);

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete category.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        setSuccessMessage("Category updated successfully!");
        setShowSuccess(true);

        if (onUpdate) {
            onUpdate();
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-8">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Category
                            </span>
                        </div>
                        <div className="col-span-4 text-right">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {categories?.filter(c => c).map((category) => (
                        <div
                            key={category.id}
                            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                        >
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-8">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-lg border border-gray-200"
                                                src={category.image || "https://ps.w.org/rdv-category-image/assets/icon-256x256.png?rev=2599260"}
                                                alt={category.title}
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/150";
                                                }}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {category.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ID: {category.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-4">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleViewDetails(category)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Edit"
                                            disabled={loadingId === category.id}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                            disabled={loadingId === category.id}
                                        >
                                            {loadingId === category.id ? (
                                                <LoadingSpinner size="xs"/>
                                            ) : (
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

                    {(!categories || categories.length === 0) && (
                        <div className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
                        </div>
                    )}
                </div>
            </div>

            {showEditModal && selectedCategory && (
                <UpdateCategoryModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedCategory(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    categoryData={selectedCategory}
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

export default CategoryList;