import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import {posPurchaseReturnAPI} from "../../../context_or_provider/pos/Purchase/purchaseReturnProduct/purchaseReturnAPI";

const PurchaseReturnList = ({purchaseReturns, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = (item) => {
        navigate(`/purchase/purchase-return/details/${item.id}`);
    };

    // The handleEdit function now simply calls the onEdit prop passed from the parent
    const handleEdit = (item) => {
        if (onEdit) {
            onEdit(item);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete return for invoice #${item.purchase_invoice_no}?`)) {
            return;
        }

        setLoadingId(item.id);
        try {
            await posPurchaseReturnAPI.delete(item.id);
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete purchase return.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Invoice & Supplier
                            </span>
                    </div>
                    <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Amount
                            </span>
                    </div>
                    <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Paid/Due
                            </span>
                    </div>
                    <div className="col-span-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Status
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
                {purchaseReturns?.filter(p => p).map((item) => (
                    <div
                        key={item.id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                        <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-10 w-10 rounded-lg border border-gray-200"
                                            src={item.supplier_image}
                                            alt={item.supplier_name}
                                            onError={(e) => {
                                                e.target.src = "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg";
                                            }}
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">
                                            #{item.purchase_invoice_no}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Supplier: {item.supplier_name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <p className="text-sm text-gray-900 font-semibold">৳{item.total_return_amount}</p>
                            </div>

                            <div className="col-span-2">
                                <p className="text-xs text-green-600">P: ৳{item.paid_amount}</p>
                                <p className="text-xs text-red-600">D: ৳{item.due_amount}</p>
                            </div>

                            <div className="col-span-2">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            item.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                                            item.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {item.payment_status?.toUpperCase()}
                                    </span>
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => handleViewDetails(item)}
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
                                        onClick={() => handleEdit(item)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Edit"
                                        disabled={loadingId === item.id}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                        disabled={loadingId === item.id}
                                    >
                                        {loadingId === item.id ? (
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

                {(!purchaseReturns || purchaseReturns.length === 0) && (
                    <div className="px-6 py-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No returns found</h3>
                        <p className="mt-1 text-sm text-gray-500">Purchase returns will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseReturnList;