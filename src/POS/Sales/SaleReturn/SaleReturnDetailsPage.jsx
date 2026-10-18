import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaFilePdf, FaInfoCircle, FaCalendarAlt, FaUser,
    FaWallet, FaClock, FaStickyNote, FaExclamationTriangle
} from "react-icons/fa";
import api from '../../../context_or_provider/pos/posApi';

import EditSaleReturnModal from "./EditSaleReturnModal";
import SuccessModal from "../../components/SuccessModal";
import { downloadSaleReturnPDF } from "./usePurchasePDF";
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getSaleReturnPrintLayout } from "./SaleReturnPrintLayout";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import BASE_URL_of_POS from "../../../posConfig";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

const SaleReturnDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [saleReturn, setSaleReturn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [updatedData, setUpdatedData] = useState(null);

    const fetchDetails = useCallback(async () => {
        try {
            const res = await api.get(`/api/sale/sale-returns/${id}/`);
            setSaleReturn(res.data);
        } catch (err) {
            console.error("Failed to fetch sale return:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleEditSuccess = (data) => {
        setSaleReturn(data);
        setUpdatedData(data);
        setEditOpen(false);
        setShowSuccessModal(true);
    };

    const handlePrint = (invoice) => {
        const target = invoice || saleReturn;
        if (!target) return;
        const tableContent = getSaleReturnPrintLayout(target);
        const fullHTML = getBrandedVoucher("Sale Return", tableContent, target.id, "#dc2626");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        if (printWindow) {
            printWindow.document.write(fullHTML);
            printWindow.document.close();
        }
    };

    /* ---------- Derived ---------- */
    const netRefundAmount = num(saleReturn?.net_return_amount);
    const grossReturnAmount = num(saleReturn?.total_return_amount);
    const itemPenalty = num(saleReturn?.total_item_penalty);
    const globalPenalty = num(saleReturn?.global_penalty);
    const totalPenalties = itemPenalty + globalPenalty;
    const paidBackAmount = num(saleReturn?.paid_amount);
    const pendingRefund = num(saleReturn?.due_amount);

    const parsedNotes = parseNoteLogs(saleReturn?.return_reason || saleReturn?.note);

    return (
        <GenericModuleDetails
            title="Sale Return"
            subtitle={
                saleReturn?.sale_invoice_no
                    ? `Original Inv: #${saleReturn.sale_invoice_no}`
                    : `Return ID: #${saleReturn?.id || ''}`
            }
            image={buildImageUrl(saleReturn?.customer_image)}
            imageAlt={saleReturn?.customer_name}
            imageFallback="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"
            recordId={saleReturn?.id}
            amount={netRefundAmount.toLocaleString()}
            amountLabel="Net Refund Amount"
            isLoading={loading}
            onPrint={() => handlePrint(saleReturn)}
            onEdit={() => setEditOpen(true)}
            printText="Print Return"
            editText="Edit Return"
            accentColor="rose"
            infoItems={[
                {
                    icon: <FaCalendarAlt className="text-rose-500" />,
                    label: "Return Date",
                    value: saleReturn?.created_at
                        ? new Date(saleReturn.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : "—"
                },
                {
                    icon: <FaUser className="text-rose-500" />,
                    label: "Customer",
                    value: saleReturn?.customer_name || "Walk-in Customer"
                }
            ]}
            actions={[
                {
                    icon: <FaFilePdf size={16} />,
                    label: "Download PDF",
                    onClick: () => downloadSaleReturnPDF(saleReturn),
                    hoverColor: "hover:bg-rose-600 hover:text-white"
                }
            ]}
        >
            <div className="space-y-8">

                {/* ============================================================
                    RETURNED ITEMS TABLE + SUMMARY
                ============================================================ */}
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <h2 className="font-black text-xl md:text-2xl uppercase tracking-tighter flex items-center gap-4">
                            <div className="w-2 h-8 md:h-10 bg-gray-900 rounded-full shadow-lg shadow-gray-900/20"></div>
                            Returned Items
                        </h2>
                        <span className="px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            {saleReturn?.items?.length || 0} Items
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-100">
                                    <th className="pb-4 pl-3">Product Description</th>
                                    <th className="pb-4 text-center">Return Qty</th>
                                    <th className="pb-4 text-right">Unit Price (৳)</th>
                                    <th className="pb-4 text-right">Penalty (৳)</th>
                                    <th className="pb-4 text-right pr-3">Total (৳)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/60">
                                {saleReturn?.items?.map((item) => (
                                    <tr key={item.id} className="even:bg-gray-50/70 hover:bg-rose-50/40 transition-colors">
                                        <td className="py-3.5 pl-3 pr-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/60 shrink-0 shadow-sm">
                                                    <img
                                                        src={buildImageUrl(item.product_image) || "https://via.placeholder.com/80"}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://via.placeholder.com/80";
                                                        }}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-800 text-sm leading-tight">
                                                        {item.product_name}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        {item.batch_no && (
                                                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                                                Batch: {item.batch_no}
                                                            </span>
                                                        )}
                                                        {item.reason && (
                                                            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                                                                {item.reason}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 text-center font-bold text-gray-700 text-sm tabular-nums">
                                            {item.sale_return_quantity}
                                        </td>
                                        <td className="py-3.5 text-right text-gray-600 text-sm tabular-nums">
                                            ৳{num(item.unit_price).toLocaleString()}
                                        </td>
                                        <td className="py-3.5 text-right text-rose-600 font-bold text-sm tabular-nums">
                                            ৳{num(item.penalty_amount).toLocaleString()}
                                        </td>
                                        <td className="py-3.5 text-right text-gray-900 font-black text-sm tabular-nums pr-3">
                                            ৳{num(item.total_price).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* BOTTOM: Breakdown + Summary */}
                    <div className="mt-8 pt-8 border-t border-gray-100 grid lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT (7 Cols) */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="bg-gray-50/80 p-5 rounded-3xl border border-gray-100 space-y-3">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <FaWallet className="text-rose-600" /> Refund Settlement Breakdown
                                </h3>

                                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Paid Back Amount</span>
                                        <span className="font-black text-emerald-600 text-base tabular-nums">
                                            ৳{paidBackAmount.toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                            Cash: ৳{num(saleReturn?.paid_cash).toLocaleString()} | Mobile: ৳{num(saleReturn?.paid_mobile).toLocaleString()} | Bank: ৳{num(saleReturn?.paid_bank).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Pending Refund (Due)</span>
                                        <span className={`font-black text-base tabular-nums ${pendingRefund > 0 ? "text-rose-600" : "text-gray-700"}`}>
                                            ৳{pendingRefund.toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {pendingRefund > 0 ? "Awaiting cash return" : "Fully settled"}
                                        </p>
                                    </div>

                                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs sm:col-span-2">
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Total Penalties Applied</span>
                                        <span className="font-black text-rose-600 text-base tabular-nums">
                                            ৳{totalPenalties.toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            Item Penalties: ৳{itemPenalty.toLocaleString()} | Global: ৳{globalPenalty.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* System Info Strip */}
                            <div className="bg-gray-900 text-white p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md">
                                <div className="flex items-center gap-6 text-xs">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Status</span>
                                        <span className="font-bold uppercase text-rose-400">
                                            {saleReturn?.payment_status || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="h-6 w-px bg-gray-800"></div>

                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Processed By</span>
                                        <span className="font-bold text-blue-400 truncate max-w-[120px]">
                                            {saleReturn?.created_by_name || 'System User'}
                                        </span>
                                    </div>

                                    <div className="h-6 w-px bg-gray-800"></div>

                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Created</span>
                                        <span className="font-bold text-slate-300">
                                            {saleReturn?.created_at
                                                ? new Date(saleReturn.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                                : '—'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    Verified
                                </div>
                            </div>
                        </div>

                        {/* RIGHT (5 Cols) */}
                        <div className="lg:col-span-5 space-y-3 text-sm pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0">
                            <div className="flex justify-between items-center text-gray-600 font-medium">
                                <span>Gross Return:</span>
                                <span className="font-bold text-gray-800 tabular-nums">
                                    ৳{grossReturnAmount.toLocaleString()}
                                </span>
                            </div>

                            {itemPenalty > 0 && (
                                <div className="flex justify-between items-center text-rose-600 font-medium">
                                    <span>Item Penalties:</span>
                                    <span className="font-bold tabular-nums">
                                        - ৳{itemPenalty.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {globalPenalty > 0 && (
                                <div className="flex justify-between items-center text-rose-600 font-medium">
                                    <span>Global Penalty:</span>
                                    <span className="font-bold tabular-nums">
                                        - ৳{globalPenalty.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900 text-gray-900 font-black">
                                <span className="uppercase text-xs tracking-wider">NET REFUND:</span>
                                <span className="text-xl tabular-nums">
                                    ৳{netRefundAmount.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-emerald-600 font-bold pt-2">
                                <span>Paid Back:</span>
                                <span className="tabular-nums">
                                    ৳{paidBackAmount.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-rose-600 font-bold pt-1 border-t border-dashed border-gray-200">
                                <span>Pending Refund:</span>
                                <span className="tabular-nums">
                                    ৳{pendingRefund.toLocaleString()}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ============================================================
                    RETURN REASON & ACTIVITY HISTORY
                ============================================================ */}
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                        <h2 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight flex items-center gap-2.5">
                            <FaStickyNote className="text-amber-500 text-lg" />
                            Return Reason &amp; Activity History
                        </h2>
                        <span className="text-xs text-gray-400 font-medium">
                            {parsedNotes.length} Entry(s)
                        </span>
                    </div>

                    {parsedNotes.length > 0 ? (
                        <div className="space-y-3">
                            {parsedNotes.map((log) => (
                                <div
                                    key={log.id}
                                    className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-50/80 transition-colors"
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                        <p className="text-sm font-semibold text-gray-800 leading-relaxed break-words">
                                            {log.message}
                                        </p>
                                    </div>

                                    {log.timestamp && (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-center whitespace-nowrap">
                                            <FaClock className="text-amber-600 text-xs" />
                                            <span>{log.timestamp}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl">
                            No specific return reason or log notes provided for this transaction.
                        </div>
                    )}
                </div>

            </div>

            {/* Modals */}
            {editOpen && (
                <EditSaleReturnModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    purchase={saleReturn}
                    onUpdated={handleEditSuccess}
                />
            )}

            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title="Sale Return Updated"
                    subtitle="Sale return updated successfully."
                    details={updatedData ? [
                        { label: "Net Refundable", value: `৳${num(updatedData.net_return_amount).toLocaleString()}` },
                        { label: "Paid Back", value: `৳${num(updatedData.paid_amount).toLocaleString()}` },
                        { label: "Pending Balance", value: `৳${num(updatedData.due_amount).toLocaleString()}` }
                    ] : []}
                    onPrint={updatedData ? () => handlePrint(updatedData) : null}
                    printText="Print Voucher"
                />
            )}
        </GenericModuleDetails>
    );
};

export default SaleReturnDetailsPage;