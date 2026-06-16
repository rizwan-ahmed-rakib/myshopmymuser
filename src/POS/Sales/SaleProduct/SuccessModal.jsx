import React from "react";
import BaseModal from "../../components/BaseModal";
import { CheckCircle, Receipt } from 'lucide-react';
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getSalePrintLayout } from "./SalePrintLayout";

/**
 * SuccessModal - Refactored to use BaseModal and standardized backbone success aesthetics.
 * Specifically tailored for Sale success with unified printing engine.
 */
const SuccessModal = ({ isOpen, onClose, invoice, previousDue = 0 }) => {
    if (!isOpen || !invoice) return null;

    const netTotal = parseFloat(invoice.net_total || invoice.netTotal || 0);
    const paidAmount = parseFloat(invoice.paid_amount || 0);
    const currentInvoiceDue = parseFloat(invoice.due_amount || 0);
    const totalCustomerDue = Number(previousDue) + Number(currentInvoiceDue);

    const handlePrint = () => {
        if (!invoice) return;
        const tableContent = getSalePrintLayout(invoice);
        const fullHTML = getBrandedVoucher("Sale Invoice", tableContent, invoice.invoice_no, "#1d4ed8");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Sale Recorded Successfully"
            size="sm"
            variant="primary"
        >
            <div className="text-center space-y-6 py-2">
                <div className="w-20 h-20 bg-emerald-50 rounded-full mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle className="text-4xl text-emerald-500 animate-bounce" size={40} />
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Success!</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Invoice #{invoice.invoice_no} Generated</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100 text-left">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Net Payable</span>
                        <span className="font-black text-gray-900">৳{netTotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Total Received</span>
                            <span className="font-black text-blue-600 text-base">৳{paidAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Current Due</span>
                            <span className="font-black text-rose-600">৳{currentInvoiceDue.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="pt-3 border-t-2 border-gray-200 mt-1">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Combined Due</span>
                            <span className="font-black text-rose-700 text-xl font-mono">৳{totalCustomerDue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={handlePrint}
                        className="py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <Receipt size={14} /> Print Slip
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