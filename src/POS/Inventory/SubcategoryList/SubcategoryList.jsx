

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import UpdateSubcategoryModal from "./UpdateSubcategoryModal";
import SuccessPopup from "./SuccessPopup";
import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * SubcategoryList - Refactored to use BackboneTable and StatusBadge.
 * Standardized list view for Subcategories.
 */
const SubcategoryList = ({ products, onUpdate }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // --- Actions ---
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleViewDetails = (product) => {
        navigate(`/inventory/subcategory/details/${product.id}`);
    };

    const handleDelete = async (product) => {
        const displayName = product.name || product.title || "this subcategory";
        if (!window.confirm(`Are you sure you want to delete ${displayName}?`)) return;

        setLoadingId(product.id);
        try {
            await posSubCategoryAPI.delete(product.id);
            setSuccessMessage(`${displayName} deleted successfully!`);
            setShowSuccess(true);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete subcategory.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = () => {
        setShowEditModal(false);
        setSuccessMessage("Subcategory updated successfully!");
        setShowSuccess(true);
        if (onUpdate) onUpdate();
    };

    // --- Table Column Configuration ---
    const columns = [
        {
            header: "Subcategory / Code",
            accessor: "name",
            render: (product) => (
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <img
                            className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                            src={product.image || "https://via.placeholder.com/150"}
                            alt={product.name || "Subcategory"}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">
                            {product.name || product.title || "N/A"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                            Code: {product.product_code || "N/A"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Parent Category",
            accessor: "category_name",
            render: (product) => (
                <StatusBadge
                    type="info"
                    label={product.category_name || "N/A"}
                />
            )
        },
        {
            header: "Selling Price",
            accessor: "selling_price",
            render: (product) => (
                <span className="font-bold text-gray-900">
                    ৳{parseFloat(product.selling_price || 0).toLocaleString()}
                </span>
            )
        },
        {
            header: "Stock",
            accessor: "stock",
            render: (product) => {
                const stockCount = Number(product.stock || 0);
                let badgeType = "success";

                if (stockCount === 0) badgeType = "danger";
                else if (stockCount <= 5) badgeType = "warning";

                return (
                    <StatusBadge
                        type={badgeType}
                        label={`${stockCount} Units`}
                    />
                );
            }
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (product) => (
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => handleViewDetails(product)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit"
                        disabled={loadingId === product.id}
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(product)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                        disabled={loadingId === product.id}
                    >
                        {loadingId === product.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <BackboneTable
                columns={columns}
                data={products}
            />

            {/* Modals & Popups */}
            {showEditModal && selectedProduct && (
                <UpdateSubcategoryModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    productData={selectedProduct}
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

export default SubcategoryList;