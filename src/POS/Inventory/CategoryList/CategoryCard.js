import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
import SuccessPopup from "./SuccessPopup";

const CategoryCard = ({ category, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
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

    const handleTitleClick = () => {
        // TODO: Navigate to category details page when it exists
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

            if (onDelete) {
                onDelete();
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

        if (onEdit) {
            onEdit();
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="relative">
                    <img
                        src={category.image || "https://via.placeholder.com/400x300"}
                        className="w-full h-48 object-cover"
                        alt={category.title}
                        onError={(e) => { e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt0Pzr8Wi3eb2OUKnxlK1X2zqcmCmiEXAIGw&s"; }}
                    />
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3
                            onClick={handleTitleClick}
                            className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
                        >
                            {category.title}
                        </h3>
                        
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
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        disabled={loadingId === category.id}
                                    >
                                        Edit Category
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                        disabled={loadingId === category.id}
                                    >
                                        Delete Category
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
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

export default CategoryCard;