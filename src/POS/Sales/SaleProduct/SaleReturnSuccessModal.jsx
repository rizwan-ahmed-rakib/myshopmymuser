import React from "react";
import BaseModal from "../../components/BaseModal";
import { CheckCircle, Receipt, Undo2 } from 'lucide-react';
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getSaleReturnPrintLayout } from "../SaleReturn/SaleReturnPrintLayout";

/**
 * SaleReturnSuccessModal - Refactored to use BaseModal and standardized backbone success aesthetics.
 * Specifically for returns triggered from a Sale record.
 */
const SaleReturnSuccessModal = ({ isOpen, onClose, purchase, title, successMessage }) => {
    if (!isOpen || !purchase) return null;

    const handlePrint = () => {
        if (!purchase) return;
        const tableContent = getSaleReturnPrintLayout(purchase);
        const fullHTML = getBrandedVoucher("Sale Return", tableContent, purchase.id, "#dc2626");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title || "Return Processed Successfully"}
            size="sm"
            variant="primary"
        >
            <div className="text-center space-y-6 py-2">
                <div className="w-20 h-20 bg-rose-50 rounded-full mx-auto flex items-center justify-center shadow-inner">
                    <Undo2 className="text-4xl text-rose-500 animate-pulse" size={40} />
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">{title || "Success!"}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{`Return Record #${purchase.id} Created`}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100 text-left">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Net Refundable</span>
                        <span className="font-black text-rose-600">৳{parseFloat(purchase.net_return_amount).toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Paid Back</span>
                            <span className="font-black text-emerald-600 text-base">৳{parseFloat(purchase.paid_amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Pending Balance</span>
                            <span className="font-black text-amber-600">৳{parseFloat(purchase.due_amount).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={handlePrint}
                        className="py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <Receipt size={14} /> Print Voucher
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

export default SaleReturnSuccessModal;