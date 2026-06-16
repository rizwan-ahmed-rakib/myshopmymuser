import React from "react";
import BaseModal from "../../components/BaseModal";
import { CheckCircle, Receipt } from 'lucide-react';
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getDuePaymentPrintLayout } from "./DuePaymentPrintLayout";

/**
 * SuccessModal - Refactored to use BaseModal and standardized backbone success aesthetics.
 * Tailored for Supplier Due Payment success with unified printing engine.
 */
const SuccessModal = ({ isOpen, onClose, title, message, data }) => {
    if (!isOpen || !data) return null;

    const handlePrint = () => {
        if (!data) return;
        const tableContent = getDuePaymentPrintLayout(data);
        const fullHTML = getBrandedVoucher("Payment Receipt", tableContent, data.invoice_no, "#10b981");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title || "Payment Successful"}
            size="sm"
            variant="primary"
        >
            <div className="text-center space-y-6 py-2">
                <div className="w-20 h-20 bg-emerald-50 rounded-full mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle className="text-4xl text-emerald-500 animate-bounce" size={40} />
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">{title || "Success!"}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{message || `Payment #${data.invoice_no} Recorded`}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100 text-left">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Settled Amount</span>
                        <span className="font-black text-emerald-600 text-2xl font-mono">৳{parseFloat(data.amount).toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-bold">Supplier</span>
                            <span className="font-black text-gray-800">{data.supplier_name}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={handlePrint}
                        className="py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <Receipt size={14} /> Print Receipt
                    </button>
                    <button
                        onClick={onClose}
                        className="py-3.5 border-2 border-gray-100 text-gray-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default SuccessModal;