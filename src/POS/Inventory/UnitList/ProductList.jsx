import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import UpdateUnitModal from "./UpdateUnitModal";
import SuccessPopup from "./SuccessPopup";
import {posUnitAPI} from "../../../context_or_provider/pos/units/unitAPI";

const ProductList = ({products, onUpdate}) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleViewDetails = (product) => {
        navigate(`/inventory/unit/details/${product.id}`);
        // navigate(`/inventory/products/${product.id}`);

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
            await posUnitAPI.delete(product.id);
            setSuccessMessage(`${product.name} deleted successfully!`);
            setShowSuccess(true);

            if (onUpdate) {
                onUpdate();
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

        if (onUpdate) {
            onUpdate();
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Product
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Category
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Price
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Stock
                            </span>
                        </div>
                        <div className="col-span-2 text-right">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {products?.filter(p => p).map((product) => (
                        <div
                            key={product.id}
                            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                        >
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-lg border border-gray-200"
                                                src={product.image || "data:image/jpeg;base64,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"}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/150";
                                                }}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {product.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Code: {product.product_code}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <span
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {product.category_name || "N/A"}
                                    </span>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-sm text-gray-900">৳{product.selling_price}</p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-sm text-gray-900">{product.stock}</p>
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleViewDetails(product)}
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
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Edit"
                                            disabled={loadingId === product.id}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => handleDelete(product)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                            disabled={loadingId === product.id}
                                        >
                                            {loadingId === product.id ? (
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

                    {(!products || products.length === 0) && (
                        <div className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                        </div>
                    )}
                </div>
            </div>

            {showEditModal && selectedProduct && (
                <UpdateUnitModal
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