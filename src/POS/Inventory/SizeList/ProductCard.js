import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import UpdateSizeModal from "./UpdateSizeModal";
import SuccessPopup from "./SuccessPopup";
import {posSizeAPI} from "../../../context_or_provider/pos/sizes/sizeAPI";

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
        navigate(`/inventory/size/details/${product.id}`);
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
            await posSizeAPI.delete(product.id); // Corrected API object
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
                        src={product.image || "https://m.sizeofficial.nl/skins/sizev1-mobile/public/img/logos/logo.png"}
                        className="w-full h-48 object-cover"
                        alt={product.name}
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
                <UpdateSizeModal
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