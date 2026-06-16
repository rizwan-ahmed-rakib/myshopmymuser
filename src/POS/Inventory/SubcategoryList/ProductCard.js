import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import UpdateSubcategoryModal from "./UpdateSubcategoryModal";
import SuccessPopup from "./SuccessPopup";
import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";

const ProductCard = ({product, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
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

    const handleNameClick = () => {
        navigate(`/inventory/subcategory/details/${product.id}`);
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
            await posSubCategoryAPI.delete(product.id); // Corrected API object
            setSuccessMessage(`${product.name} deleted successfully!`);
            setShowSuccess(true);

            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete product.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        setSuccessMessage("Product updated successfully!");
        setShowSuccess(true);

        if (onEdit) {
            onEdit();
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="relative">
                    <img
                        src={product.image || "data:image/jpeg;base64,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"}
                        className="w-full h-48 object-cover"
                        alt={product.title}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300"; }}
                    />
                    <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-gray-500">Code: {product.product_code}</div>
                        
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
                                        onClick={() => handleEdit(product)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        disabled={loadingId === product.id}
                                    >
                                        Edit Product
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                        disabled={loadingId === product.id}
                                    >
                                        Delete Product
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={handleNameClick}
                                        className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                                    >
                                        View Details
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <h3
                        onClick={handleNameClick}
                        className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer truncate"
                    >
                        {product.title}
                    </h3>

                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-gray-800">
                            {formatPrice(product.selling_price)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.purchase_price)}
                        </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                        Category: {product.category} | Brand: {product.brand}
                    </div>
                </div>
            </div>

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

export default ProductCard;