
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, ShieldCheck, CalendarClock, Package, Tag, AlertTriangle } from "lucide-react";
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import UpdateProductModal from "./UpdateProductModal";
// import SuccessPopup from "./SuccessPopup";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import SuccessPopup from "../../components/SuccessPopup";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * ProductList - Refactored to use BackboneTable and StatusBadge.
 * Centralized list view for all products in the POS system.
 */
const ProductList = ({ products, onUpdate }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // --- Actions ---
    const handleViewDetails = (product) => {
        navigate(`/inventory/product/details/${product.id}`);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            return;
        }

        setLoadingId(product.id);
        try {
            await posProductAPI.delete(product.id);
            setSuccessMessage(`${product.name} deleted successfully!`);
            setShowSuccess(true);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete product.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = () => {
        setShowEditModal(false);
        setSuccessMessage("Product updated successfully!");
        setShowSuccess(true);
        if (onUpdate) onUpdate();
    };

    // --- Table Column Configuration ---
    const columns = [
        {
            header: "Product Info",
            accessor: "name",
            render: (product) => (
                <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0">
                        <img
                            className="h-full w-full rounded-xl object-cover border border-gray-100 shadow-sm"
                            src={product.image || "https://via.placeholder.com/150"}
                            alt={product.name}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                        />
                    </div>
                    <div>
                        <span
                            onClick={() => handleViewDetails(product)}
                            className="text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer block"
                        >
                            {product.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1 mt-0.5">
                            <Package size={10} /> {product.product_code || '---'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Category & Brand",
            accessor: "category_name",
            render: (product) => (
                <div className="flex flex-col gap-1 items-start">
                    <StatusBadge
                        type="info"
                        label={product.category_name || "N/A"}
                        icon={Tag}
                    />
                    <span className="text-[11px] text-gray-500 font-medium ml-1">
                        Brand: <span className="text-gray-700 font-semibold">{product.brand_name || "N/A"}</span>
                    </span>
                </div>
            )
        },
        {
            header: "Pricing",
            accessor: "selling_price",
            render: (product) => (
                <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-800">
                        ৳{Number(product.selling_price || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                        Cost: ৳{Number(product.purchase_price || 0).toLocaleString()}
                    </span>
                </div>
            )
        },
        {
            header: "Stock Status",
            accessor: "stock",
            render: (product) => {
                const currentStock = Number(product.stock || 0);
                const alarmLimit = Number(product.alarm_when_stock_is_lessthanOrEqualto || 0);
                const isLowStock = currentStock <= alarmLimit;

                let stockBadgeType = "success";
                if (currentStock === 0) stockBadgeType = "danger";
                else if (isLowStock) stockBadgeType = "warning";

                return (
                    <div className="flex flex-col gap-1 items-start">
                        <StatusBadge
                            type={stockBadgeType}
                            label={`${currentStock} ${product.unit_name || 'Units'}`}
                        />
                        {isLowStock && currentStock > 0 && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                <AlertTriangle size={8} /> Low Stock
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Settings",
            accessor: "id",
            render: (product) => (
                <div className="flex gap-1.5">
                    {product.warranty_status && (
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shadow-2xs border border-blue-100" title="Warranty Available">
                            <ShieldCheck size={14} />
                        </div>
                    )}
                    {product.has_expiry && (
                        <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg shadow-2xs border border-rose-100" title="Expiry Tracking">
                            <CalendarClock size={14} />
                        </div>
                    )}
                    {!product.warranty_status && !product.has_expiry && (
                        <span className="text-xs text-gray-400 font-medium">—</span>
                    )}
                </div>
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (product) => (
                /* HOVER_EFFECT_NOTE:
                  Jodi action button gulo sudhu HOVER e dekhate chan, tahole nicher <div> e ei class gulo add korben:
                  "flex justify-end gap-0.5 md:opacity-0 group-hover:opacity-100 transition-opacity duration-150"

                  Ebong obosshoi nich_er BackboneTable er 'rowClassName' property te "group" thakte hobe (ja niche dewa ache).
                */
                <div className="flex justify-end gap-0.5">
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
                        title="Edit Product"
                        disabled={loadingId === product.id}
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(product)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
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
                rowClassName="group hover:bg-blue-50/20"
            />

            {/* Modals & Popups */}
            {showEditModal && selectedProduct && (
                <UpdateProductModal
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

export default ProductList;