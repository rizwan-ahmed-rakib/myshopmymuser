


import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaTruck, FaMoneyBillWave, FaMobileAlt, FaUniversity,
    FaCalendarAlt, FaHashtag, FaStickyNote, FaCheckCircle,
    FaShieldAlt, FaClock, FaExchangeAlt
} from "react-icons/fa";
import { RefreshCcw } from 'lucide-react';
import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
import EditSupplierDuePaymentModal from "./EditSupplierDuePaymentModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getDuePaymentPrintLayout } from "./DuePaymentPrintLayout";
import SuccessModal from "../../components/SuccessModal";
import BASE_URL_of_POS from "../../../posConfig";

const buildImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${BASE_URL_of_POS}${url}`;
};

const num = (v) => parseFloat(v) || 0;

const parseNoteLogs = (noteText) => {
    if (!noteText) return [];
    const lines = noteText.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
        const match = line.match(/^\[(.*?)\]\s*(.*)$/);
        if (match) {
            return { id: index, timestamp: match[1], message: match[2] };
        }
        return { id: index, timestamp: null, message: line };
    });
};

const SupplierDuePaymentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [updatedData, setUpdatedData] = useState(null);

    const fetchItem = useCallback(async () => {
        try {
            const res = await posDuePaymentAPI.getById(id);
            setItem(res.data);
        } catch (err) {
            console.error("Error fetching payment details:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchItem(); }, [fetchItem]);

    const handleEditSuccess = (data) => {
        setItem(data);
        setUpdatedData(data);
        setEditOpen(false);
        setShowSuccessModal(true);
    };

    const handlePrint = () => {
        if (!item) return;
        const isRefund = item.transaction_type === 'refund';
        const tableContent = getDuePaymentPrintLayout(item);
        const title = isRefund ? "Refund Receipt" : "Payment Receipt";
        const color = isRefund ? "#3b82f6" : "#10b981";
        const fullHTML = getBrandedVoucher(title, tableContent, item.invoice_no, color);
        const printWindow = window.open("", "_blank", "width=850,height=900");
        if (printWindow) {
            printWindow.document.write(fullHTML);
            printWindow.document.close();
        }
    };

    const isRefund = item?.transaction_type === 'refund';
    const totalAmount = num(item?.amount);
    const parsedNotes = parseNoteLogs(item?.note);
    const accent = isRefund ? 'blue' : 'emerald';

    return (
        <GenericModuleDetails
            title={isRefund ? "Refund Voucher" : "Payment Voucher"}
            subtitle={`#${item?.invoice_no || ''}`}
            image={buildImageUrl(item?.supplier_image)}
            imageAlt={item?.supplier_name}
            imageFallback="https://via.placeholder.com/150"
            recordId={item?.invoice_no}
            amount={totalAmount.toLocaleString()}
            amountLabel={isRefund ? "Total Received" : "Total Settled"}
            isLoading={loading}
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            printText={isRefund ? "Print Refund Receipt" : "Print Voucher"}
            editText="Edit Record"
            accentColor={accent}
            infoItems={[
                {
                    icon: <FaCalendarAlt className={isRefund ? "text-blue-500" : "text-emerald-500"} />,
                    label: "Date",
                    value: item?.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"
                },
                {
                    icon: <FaTruck className={isRefund ? "text-blue-500" : "text-emerald-500"} />,
                    label: "Supplier",
                    value: item?.supplier_name || "N/A"
                },
                {
                    icon: <FaExchangeAlt className={isRefund ? "text-blue-500" : "text-emerald-500"} />,
                    label: "Type",
                    value: isRefund ? "Refund" : "Payment"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <DetailsInfoCard
                            variant="simple"
                            title={isRefund ? "Settlement Type" : "Linked Purchase"}
                            value={isRefund
                                ? "Advance Refund"
                                : item?.purchase_invoice_no ? `#${item.purchase_invoice_no}` : "General Payment"}
                            icon={<FaHashtag />}
                            color={isRefund ? "blue" : "blue"}
                        />
                        <DetailsInfoCard
                            variant="simple"
                            title="Status"
                            value={isRefund ? "Refund Credited" : "Verified & Settled"}
                            icon={isRefund ? <RefreshCcw /> : <FaCheckCircle />}
                            color={accent}
                        />
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-3">
                                <span className={`w-2.5 h-6 ${isRefund ? 'bg-blue-500' : 'bg-emerald-500'} rounded-full inline-block`}></span>
                                {isRefund ? 'Refund Breakdown' : 'Payment Method Breakdown'}
                            </h2>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                                isRefund
                                    ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                            }`}>
                                {isRefund ? 'Received' : 'Total'}: ৳{totalAmount.toLocaleString()}
                            </span>
                        </div>

                        <div className="grid gap-4">
                            {num(item?.paid_cash) > 0 && (
                                <DetailsInfoCard
                                    icon={<FaMoneyBillWave />}
                                    title="Cash"
                                    value={`৳${num(item.paid_cash).toLocaleString()}`}
                                    color="emerald"
                                />
                            )}
                            {num(item?.paid_mobile) > 0 && (
                                <DetailsInfoCard
                                    icon={<FaMobileAlt />}
                                    title={`Mobile Banking ${item?.mobile_operator ? `(${item.mobile_operator})` : ''}`}
                                    value={`৳${num(item.paid_mobile).toLocaleString()}`}
                                    subValue={item?.transaction_id ? `TxID: ${item.transaction_id}` : null}
                                    color="purple"
                                />
                            )}
                            {num(item?.paid_bank) > 0 && (
                                <DetailsInfoCard
                                    icon={<FaUniversity />}
                                    title={`Bank Transfer ${item?.bank_name ? `(${item.bank_name})` : ''}`}
                                    value={`৳${num(item.paid_bank).toLocaleString()}`}
                                    color="indigo"
                                />
                            )}
                            {num(item?.paid_cash) === 0 && num(item?.paid_mobile) === 0 && num(item?.paid_bank) === 0 && (
                                <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-sm font-medium text-center">
                                    No detailed breakdown specified.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    <div className={`p-6 sm:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden h-full flex flex-col justify-between ${
                        isRefund ? 'bg-blue-900' : 'bg-slate-900'
                    }`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 ${
                            isRefund ? 'bg-blue-500/10' : 'bg-emerald-500/10'
                        }`}></div>
                        <div>
                            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                                <FaShieldAlt className={`${isRefund ? 'text-blue-400' : 'text-emerald-400'} text-base`} /> Audit Log
                            </h2>
                            <div className="space-y-5">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-1 h-10 bg-blue-500 rounded-full mt-0.5 shrink-0"></div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Created By</p>
                                        <p className="text-sm font-bold text-slate-100 truncate">{item?.created_by_name || 'System User'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3.5">
                                    <div className={`w-1 h-10 rounded-full mt-0.5 shrink-0 ${isRefund ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Last Updated</p>
                                        <p className="text-sm font-bold text-slate-100">
                                            {item?.updated_at || item?.created_at
                                                ? new Date(item?.updated_at || item?.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
                                                : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
                            Status: <span className={`font-bold ${isRefund ? 'text-blue-400' : 'text-emerald-400'}`}>
                                {isRefund ? 'Refund Recorded' : 'Recorded & Verified'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight flex items-center gap-2.5">
                                <FaStickyNote className="text-amber-500 text-lg" />
                                {isRefund ? 'Refund Activity & Note History' : 'Payment Activity & Note History'}
                            </h2>
                            <span className="text-xs text-gray-400 font-medium">{parsedNotes.length} Log Entry(s)</span>
                        </div>

                        {parsedNotes.length > 0 ? (
                            <div className="space-y-4">
                                {parsedNotes.map((log) => (
                                    <div key={log.id}
                                        className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-50/80 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                            <p className="text-sm font-semibold text-gray-800 leading-relaxed">{log.message}</p>
                                        </div>
                                        {log.timestamp && (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-center">
                                                <FaClock className="text-amber-600 text-xs" />
                                                <span>{log.timestamp}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl">
                                No activity log available for this voucher.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {editOpen && (
                <EditSupplierDuePaymentModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    item={item}
                    onSuccess={handleEditSuccess}
                />
            )}

            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title={isRefund ? "Refund Updated Successfully" : "Payment Updated Successfully"}
                    subtitle={`${isRefund ? 'Refund' : 'Payment'} #${updatedData?.invoice_no}`}
                    details={[
                        { label: "Supplier", value: updatedData?.supplier_name || 'N/A' },
                        { label: isRefund ? "Refund Amount" : "Settled Amount", value: `৳${num(updatedData?.amount).toLocaleString()}` },
                        { label: "Payment Method", value: (updatedData?.payment_method || '').replace('_', ' ').toUpperCase() }
                    ]}
                    onPrint={handlePrint}
                    printText="Print Receipt"
                />
            )}
        </GenericModuleDetails>
    );
};

export default SupplierDuePaymentDetails;