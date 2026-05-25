import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const SuccessModal = ({ isOpen, onClose, data, type = "create" }) => {
    if (!isOpen || !data) return null;

    const isDamage = !!data.damage_type;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-8 animate-scaleIn">
                
                <div className="mx-auto bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                    <FaCheckCircle className="text-green-600 text-5xl" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {type === "create" ? "Successfully Added!" : "Successfully Updated!"}
                </h2>

                <p className="text-gray-500 mb-6">
                    {isDamage 
                        ? `Damage record for ${data.product_name || 'the product'} has been ${type === "create" ? "recorded" : "updated"}.`
                        : "The information has been successfully saved to the system."
                    }
                </p>

                {isDamage && (
                    <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left border border-gray-100">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Product:</span>
                                <span className="font-bold text-gray-800">{data.product_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Quantity:</span>
                                <span className="font-bold text-red-600">{data.quantity} pcs</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Total Loss:</span>
                                <span className="font-bold text-red-700">৳{parseFloat(data.total_loss).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Reference:</span>
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded font-mono text-gray-600">
                                    {data.reference_no}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-200"
                    onClick={onClose}
                >
                    Great, thanks!
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
