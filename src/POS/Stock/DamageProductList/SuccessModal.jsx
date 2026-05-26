import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import BaseModal from "../../components/BaseModal";

const SuccessModal = ({ isOpen, onClose, data, type = "create" }) => {
    if (!isOpen || !data) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={type === "create" ? "Successfully Recorded" : "Successfully Updated"}
            maxWidth="max-w-sm"
            headerColor="bg-green-600"
            icon={<FaCheckCircle className="text-white text-xl" />}
        >
            <div className="p-8 text-center">
                <div className="mx-auto bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                    <FaCheckCircle className="text-green-500 text-5xl" />
                </div>

                <p className="text-gray-500 mb-6">
                    Damage record for <span className="font-bold text-gray-800">{data.product_name}</span> has been saved.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100 space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-400 uppercase font-bold">Quantity:</span>
                        <span className="font-black text-gray-800">{data.quantity} pcs</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-400 uppercase font-bold">Loss:</span>
                        <span className="font-black text-red-600">৳{parseFloat(data.total_loss).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-400 uppercase font-bold">Reference:</span>
                        <span className="font-mono text-gray-500">{data.reference_no}</span>
                    </div>
                </div>

                <button
                    className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg active:scale-95"
                    onClick={onClose}
                >
                    Great, thanks!
                </button>
            </div>
        </BaseModal>
    );
};

export default SuccessModal;
