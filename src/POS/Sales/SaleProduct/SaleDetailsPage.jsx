import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaUser, FaInfoCircle, FaFilePdf, FaUndo,
    FaCalendarAlt, FaWallet, FaClock, FaStickyNote
} from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import api from '../../../context_or_provider/pos/posApi';

import EditSaleModal from "./EditSaleModal";
import SaleReturnModal from "./SaleReturnModal";
import SaleReturnSuccessModal from "./SaleReturnSuccessModal";
import { downloadSalePDF } from "./usePurchasePDF";
import { usePrintManager } from "../../utils/usePrintManager";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import SuccessModal from "../../components/SuccessModal";
import { posSaleProductAPI } from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import BASE_URL_of_POS from "../../../posConfig";

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                  */
/* ------------------------------------------------------------------ */

const buildImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${BASE_URL_of_POS}${url}`;
};

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

const SaleDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [updatedSaleData, setUpdatedSaleData] = useState(null);
    const [returnSuccessData, setReturnSuccessData] = useState(null);

    const fetchSaleDetails = useCallback(async () => {
        try {
            const res = await api.get(`/api/sale/sales/${id}/`);
            setSale(res.data);
        } catch (error) {
            console.error("Error fetching sale details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSaleDetails();
    }, [fetchSaleDetails]);

    const handleEditSuccess = (updatedData) => {
        setSale(updatedData);
        setUpdatedSaleData(updatedData);
        setEditOpen(false);
        setShowSuccessModal(true);
    };

    const handleReturnSuccess = (returnData) => {
        setReturnOpen(false);
        setReturnSuccessData(returnData);
        fetchSaleDetails();
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete Invoice #${sale?.invoice_no}?`)) return;
        try {
            await posSaleProductAPI.delete(id);
            alert("Sale record deleted successfully!");
            navigate("/sales");
        } catch (error) {
            console.error(error);
            alert("Failed to delete the sale record.");
        }
    };

    const { handlePrintInvoice } = usePrintManager();
    const handlePrint = () => handlePrintInvoice(sale);
    const handleSuccessPrint = () => handlePrintInvoice(updatedSaleData);

    /* ---------- Derived Financial Values ---------- */
    const num = (v) => parseFloat(v) || 0;

    const originalInvoiceDue = num(sale?.due_amount);
    const otherInvoicesDue = num(sale?.customer_due_amount) - originalInvoiceDue;
    const totalCustomerDue = otherInvoicesDue + originalInvoiceDue;

    const grossTotal = num(sale?.total_amount);
    const itemDiscount = num(sale?.itemwise_total_discount);
    const globalDiscount = num(sale?.global_discount);
    const subTotal = num(sale?.subtotal);
    const netTotal = num(sale?.net_total);
    const paidAmount = num(sale?.paid_amount);

    const successNetTotal = num(updatedSaleData?.net_total || updatedSaleData?.netTotal);
    const successPaidAmount = num(updatedSaleData?.paid_amount);
    const successCurrentInvoiceDue = num(updatedSaleData?.due_amount);
    const successTotalCustomerDue = otherInvoicesDue + successCurrentInvoiceDue;

    const parsedNotes = parseNoteLogs(sale?.notes);

    return (
        <GenericModuleDetails
            title="Sale Invoice"
            subtitle={`#${sale?.invoice_no}`}
            image={sale?.customer_image}
            imageAlt={sale?.customer_name}
            imageFallback="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"
            recordId={sale?.invoice_no}
            amount={netTotal.toLocaleString()}
            amountLabel="Net Payable Amount"
            isLoading={loading}
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            printText="Print Invoice"
            editText="Edit Invoice"
            accentColor="blue"
            infoItems={[
                {
                    icon: <FaCalendarAlt />,
                    label: "Sale Date",
                    value: sale?.created_at
                        ? new Date(sale.created_at).toLocaleDateString()
                        : "—"
                },
                { icon: <FaUser />, label: "Customer", value: sale?.customer_name || "Walk-in Customer" }
            ]}
            actions={[
                {
                    icon: <FaFilePdf size={16} />,
                    label: "Download PDF",
                    onClick: () => downloadSalePDF(sale),
                    hoverColor: "hover:bg-orange-600 hover:text-white"
                },
                {
                    icon: <FaUndo size={16} />,
                    label: "Return Items",
                    onClick: () => setReturnOpen(true),
                    hoverColor: "hover:bg-amber-600 hover:text-white"
                },
                {
                    icon: <AiFillDelete size={16} />,
                    label: "Delete",
                    onClick: handleDelete,
                    hoverColor: "hover:bg-red-600 hover:text-white"
                }
            ]}
        >
            <div className="space-y-8">

                {/* ============================================================
                    SALE ITEMS TABLE + COMPACT SUMMARY & INFO
                ============================================================ */}
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <h2 className="font-black text-xl md:text-2xl uppercase tracking-tighter flex items-center gap-4">
                            <div className="w-2 h-8 md:h-10 bg-gray-900 rounded-full shadow-lg shadow-gray-900/20"></div>
                            Sale Items
                        </h2>
                        <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            {sale?.items?.length || 0} Items
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-100">
                                    <th className="pb-4 pl-3">Product Description</th>
                                    <th className="pb-4 text-center">Qty</th>
                                    <th className="pb-4 text-right">Price (৳)</th>
                                    <th className="pb-4 text-right">Discount (৳)</th>
                                    <th className="pb-4 text-right pr-3">Total (৳)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/60">
                                {sale?.items?.map((item) => (
                                    <tr key={item.id} className="even:bg-gray-50/70 hover:bg-blue-50/40 transition-colors">
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
                                                    {item.product_code && (
                                                        <span className="text-[10px] font-semibold text-gray-400 block mt-0.5">
                                                            Code: {item.product_code}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 text-center font-bold text-gray-700 text-sm tabular-nums">
                                            {item.quantity}
                                        </td>
                                        <td className="py-3.5 text-right text-gray-600 text-sm tabular-nums">
                                            ৳{num(item.unit_price).toLocaleString()}
                                        </td>
                                        <td className="py-3.5 text-right text-emerald-600 font-bold text-sm tabular-nums">
                                            ৳{num(item.discount_amount).toLocaleString()}
                                        </td>
                                        <td className="py-3.5 text-right text-blue-700 font-black text-sm tabular-nums pr-3">
                                            ৳{num(item.net_total).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* BOTTOM SECTION */}
                    <div className="mt-8 pt-8 border-t border-gray-100 grid lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT (7 Cols) */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="bg-gray-50/80 p-5 rounded-3xl border border-gray-100 space-y-3">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <FaWallet className="text-blue-600" /> Payment Breakdown
                                </h3>

                                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Net Received</span>
                                        <span className="font-black text-emerald-600 text-base tabular-nums">
                                            ৳{paidAmount.toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                            Cash: ৳{sale?.paid_cash || 0} | Mobile: ৳{sale?.paid_mobile || 0} | Bank: ৳{sale?.paid_bank || 0}
                                        </p>
                                    </div>

                                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Invoice Due</span>
                                        <span className={`font-black text-base tabular-nums ${originalInvoiceDue > 0 ? "text-rose-600" : "text-gray-700"}`}>
                                            ৳{originalInvoiceDue.toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {originalInvoiceDue > 0 ? "Awaiting settlement" : "Fully settled"}
                                        </p>
                                    </div>

                                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs sm:col-span-2">
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Customer Total Balance</span>
                                        <span className={`font-black text-base tabular-nums ${totalCustomerDue > 0 ? "text-rose-600" : "text-gray-700"}`}>
                                            ৳{totalCustomerDue.toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            Previous Invoices Due: ৳{otherInvoicesDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* System Info Strip */}
                            <div className="bg-gray-900 text-white p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md">
                                <div className="flex items-center gap-6 text-xs">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Method</span>
                                        <span className="font-bold uppercase text-blue-400">{sale?.payment_method?.replace('_', ' ') || 'CASH'}</span>
                                    </div>

                                    <div className="h-6 w-px bg-gray-800"></div>

                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Status</span>
                                        <span className="font-bold uppercase text-emerald-400">{sale?.payment_status || 'UNPAID'}</span>
                                    </div>

                                    {sale?.payment_proof && (
                                        <>
                                            <div className="h-6 w-px bg-gray-800"></div>
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Proof</span>
                                                <a href={buildImageUrl(sale.payment_proof)} target="_blank" rel="noreferrer" className="text-xs text-blue-300 underline font-semibold">View</a>
                                            </div>
                                        </>
                                    )}
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
                                <span>Gross Total:</span>
                                <span className="font-bold text-gray-800 tabular-nums">৳{grossTotal.toLocaleString()}</span>
                            </div>

                            {itemDiscount > 0 && (
                                <div className="flex justify-between items-center text-emerald-600 font-medium">
                                    <span>Item Discount:</span>
                                    <span className="font-bold tabular-nums">- ৳{itemDiscount.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-gray-600 font-medium pt-1 border-t border-gray-100">
                                <span>Subtotal:</span>
                                <span className="font-bold text-gray-800 tabular-nums">৳{subTotal.toLocaleString()}</span>
                            </div>

                            {globalDiscount > 0 && (
                                <div className="flex justify-between items-center text-emerald-600 font-medium">
                                    <span>Global Discount:</span>
                                    <span className="font-bold tabular-nums">- ৳{globalDiscount.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900 text-gray-900 font-black">
                                <span className="uppercase text-xs tracking-wider">NET PAYABLE:</span>
                                <span className="text-xl tabular-nums">৳{netTotal.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center text-emerald-600 font-bold pt-2">
                                <span>Total Paid:</span>
                                <span className="tabular-nums">৳{paidAmount.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center text-rose-600 font-bold pt-1 border-t border-dashed border-gray-200">
                                <span>Due Amount:</span>
                                <span className="tabular-nums">৳{originalInvoiceDue.toLocaleString()}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ============================================================
                    INVOICE NOTE & ACTIVITY HISTORY
                ============================================================ */}
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                        <h2 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight flex items-center gap-2.5">
                            <FaStickyNote className="text-amber-500 text-lg" />
                            Invoice Note &amp; Activity History
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
                            No additional remarks or logs provided for this sale.
                        </div>
                    )}
                </div>

            </div>

            {/* Modals */}
            {editOpen && (
                <EditSaleModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    purchase={sale}
                    onUpdated={handleEditSuccess}
                />
            )}

            {returnOpen && (
                <SaleReturnModal
                    isOpen={returnOpen}
                    onClose={() => setReturnOpen(false)}
                    purchase={sale}
                    onSuccess={handleReturnSuccess}
                />
            )}

            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title="Sale Recorded Successfully"
                    subtitle={updatedSaleData ? `Invoice #${updatedSaleData.invoice_no} Generated` : "Transaction Completed Successfully"}
                    details={[
                        { label: "Net Payable", value: `৳${successNetTotal.toLocaleString()}` },
                        { label: "Total Received", value: `৳${successPaidAmount.toLocaleString()}` },
                        { label: "Current Due", value: `৳${successCurrentInvoiceDue.toLocaleString()}` },
                        { label: "Total Combined Due", value: `৳${successTotalCustomerDue.toLocaleString()}` }
                    ]}
                    onPrint={handleSuccessPrint}
                    printText="Print Slip"
                />
            )}

            {returnSuccessData && (
                <SaleReturnSuccessModal
                    isOpen={!!returnSuccessData}
                    onClose={() => setReturnSuccessData(null)}
                    purchase={returnSuccessData}
                    title="Sale Return Successful!"
                    successMessage="The sale return has been processed."
                />
            )}
        </GenericModuleDetails>
    );
};

export default SaleDetailsPage;