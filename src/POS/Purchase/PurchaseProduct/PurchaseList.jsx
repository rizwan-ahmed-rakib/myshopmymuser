import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import {posPurchaseProductAPI} from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";

const PurchaseList = ({products, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = (product) => {
        navigate(`/purchase/purchase/details/${product.id}`);
    };

    const handleEdit = (product) => {
        if (onEdit) {
            onEdit(product);
        }
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Are you sure you want to delete Invoice #${product.invoice_no}?`)) {
            return;
        }

        setLoadingId(product.id);
        try {
            await posPurchaseProductAPI.delete(product.id);
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete purchase.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Invoice & Method
                            </span>
                    </div>
                    <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Date & Supplier
                            </span>
                    </div>
                    <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Net Total
                            </span>
                    </div>
                    <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Paid Amount
                            </span>
                    </div>
                    <div className="col-span-1">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Due
                            </span>
                    </div>
                    <div className="col-span-1 text-center">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </span>
                    </div>
                    <div className="col-span-1 text-right">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Action
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
                            <div className="col-span-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-10 w-10 rounded-lg border border-gray-200"
                                            src={product.supplier_image || "https://via.placeholder.com/150"}
                                            alt={product.supplier_name}
                                            onError={(e) => {
                                                e.target.src = "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80";
                                            }}
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-bold text-gray-900">
                                            {product.invoice_no}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                            {product.payment_method?.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium truncate">
                                        {product.supplier_name}
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <p className="text-sm font-bold text-gray-900">৳{Number(product.net_total).toFixed(2)}</p>
                            </div>

                            <div className="col-span-2">
                                <p className="text-sm font-bold text-green-600">৳{Number(product.paid_amount).toFixed(2)}</p>
                            </div>

                            <div className="col-span-1">
                                <p className="text-sm font-bold text-red-600">৳{Number(product.due_amount).toFixed(2)}</p>
                            </div>

                            <div className="col-span-1 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    product.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                                    product.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {product.payment_status}
                                </span>
                            </div>

                            <div className="col-span-1">
                                <div className="flex items-center justify-end space-x-1">
                                    <button
                                        onClick={() => handleViewDetails(product)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Edit"
                                        disabled={loadingId === product.id}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                        disabled={loadingId === product.id}
                                    >
                                        {loadingId === product.id ? (
                                            <LoadingSpinner size="xs"/>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
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
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No purchase records</h3>
                        <p className="mt-1 text-sm text-gray-500">Your purchase history will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseList;