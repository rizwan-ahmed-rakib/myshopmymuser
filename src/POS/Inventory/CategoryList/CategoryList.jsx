



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import UpdateCategoryModal from "./UpdateCategoryModal";
import SuccessPopup from "./SuccessPopup";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * CategoryList - Refactored to use BackboneTable.
 * Standardized list view for Categories.
 */
const CategoryList = ({ categories, onUpdate }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // --- Actions ---
    const handleEdit = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const handleViewDetails = (category) => {
        navigate(`/inventory/category/details/${category.id}`);
    };

    const handleDelete = async (category) => {
        const displayName = category.title || "this category";
        if (!window.confirm(`Are you sure you want to delete ${displayName}?`)) return;

        setLoadingId(category.id);
        try {
            await posCategoryAPI.delete(category.id);
            setSuccessMessage(`${displayName} deleted successfully!`);
            setShowSuccess(true);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete category.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = () => {
        setShowEditModal(false);
        setSuccessMessage("Category updated successfully!");
        setShowSuccess(true);
        if (onUpdate) onUpdate();
    };

    // --- Table Column Configuration ---
    const columns = [
        {
            header: "Category / ID",
            accessor: "title",
            render: (category) => (
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <img
                            className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                            src={category.image || "https://ps.w.org/rdv-category-image/assets/icon-256x256.png?rev=2599260"}
                            alt={category.title || "Category"}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">
                            {category.title || "N/A"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                            ID: {category.id || "N/A"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (category) => (
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => handleViewDetails(category)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit"
                        disabled={loadingId === category.id}
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(category)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                        disabled={loadingId === category.id}
                    >
                        {loadingId === category.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <BackboneTable
                columns={columns}
                data={categories}
            />

            {/* Modals & Popups */}
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