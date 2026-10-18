// import React, {useState, useEffect, useCallback} from "react";
// import {useParams, useNavigate} from "react-router-dom";
// import {
//     FaBoxOpen, FaDollarSign, FaUndo, FaEdit, FaFilePdf, FaInfoCircle,
//     FaShoppingCart, FaUser, FaMoneyBillWave, FaMobileAlt, FaUniversity,
//     FaExclamationTriangle, FaTruck, FaCalendarAlt, FaReceipt, FaWallet
// } from "react-icons/fa";
// import api from '../../../context_or_provider/pos/posApi';
//
// import EditPurchaseReturnModal from "./EditPurchaseReturnModal";
// import SuccessModal from "../../components/SuccessModal";
// import {downloadPurchaseReturnPDF} from "./usePurchasePDF";
// import {getBrandedVoucher} from "../../utils/printTemplates";
// import {getPurchaseReturnPrintLayout} from "./PurchaseReturnPrintLayout";
// import GenericModuleDetails from "../../components/GenericModuleDetails";
// import DetailsInfoCard from "../../components/DetailsInfoCard";
//
// /**
//  * PurchaseReturnDetailsPage - Refactored to use GenericModuleDetails and DetailsInfoCard.
//  * Integrated with the standardized Backbone printing and PDF engine.
//  */
// const PurchaseReturnDetailsPage = () => {
//     const {id} = useParams();
//     const navigate = useNavigate();
//
//     const [purchaseReturn, setPurchaseReturn] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [editOpen, setEditOpen] = useState(false);
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [updatedData, setUpdatedData] = useState(null);
//
//     const fetchDetails = useCallback(async () => {
//         try {
//             const res = await api.get(`/api/purchase/purchase-returns/${id}/`);
//             setPurchaseReturn(res.data);
//         } catch (err) {
//             console.error("Failed to fetch purchase return:", err);
//         } finally {
//             setLoading(false);
//         }
//     }, [id]);
//
//     useEffect(() => {
//         fetchDetails();
//     }, [fetchDetails]);
//
//     const handleEditSuccess = (updatedData) => {
//         setPurchaseReturn(updatedData);
//         setUpdatedData(updatedData);
//         setEditOpen(false);
//         setShowSuccessModal(true);
//     };
//
//     const handlePrint = (invoice) => {
//         if (!invoice) return;
//         const tableContent = getPurchaseReturnPrintLayout(invoice);
//         const fullHTML = getBrandedVoucher("Purchase Return", tableContent, invoice.id, "#e11d48");
//         const printWindow = window.open("", "_blank", "width=850,height=900");
//         printWindow.document.write(fullHTML);
//         printWindow.document.close();
//     };
//
//     return (
//         <GenericModuleDetails
//             title="Purchase Return"
//             subtitle={`Original Inv: #${purchaseReturn?.purchase_invoice_no}`}
//             image={purchaseReturn?.supplier_image}
//             imageAlt={purchaseReturn?.supplier_name}
//             imageFallback="https://via.placeholder.com/150"
//             recordId={purchaseReturn?.id}
//             amount={parseFloat(purchaseReturn?.net_return_amount || 0).toLocaleString()}
//             amountLabel="Net Refund Amount"
//             isLoading={loading}
//             onPrint={handlePrint}
//             onEdit={() => setEditOpen(true)}
//             printText="Print Return"
//             editText="Edit Return"
//             accentColor="rose"
//             infoItems={[
//                 {
//                     icon: <FaCalendarAlt />,
//                     label: "Return Date",
//                     value: new Date(purchaseReturn?.created_at).toLocaleDateString()
//                 },
//                 { icon: <FaTruck />, label: "Supplier", value: purchaseReturn?.supplier_name || "N/A" }
//             ]}
//             actions={[
//                 {
//                     icon: <FaFilePdf size={16} />,
//                     label: "Download PDF",
//                     onClick: () => downloadPurchaseReturnPDF(purchaseReturn),
//                     hoverColor: "hover:bg-orange-600 hover:text-white"
//                 }
//             ]}
//         >
//             <div className="grid lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-2 space-y-8">
//                     {/* Financial Summary */}
//                     <div className="grid sm:grid-cols-3 gap-6">
//                         <DetailsInfoCard variant="simple" title="Gross Return"
//                                          value={`৳${parseFloat(purchaseReturn?.total_return_amount || 0).toLocaleString()}`}
//                                          icon={<FaShoppingCart />} color="blue"/>
//                         <DetailsInfoCard variant="simple" title="Total Penalties"
//                                          value={`৳${(parseFloat(purchaseReturn?.total_item_penalty || 0) + parseFloat(purchaseReturn?.global_penalty || 0)).toLocaleString()}`}
//                                          icon={<FaExclamationTriangle />} color="rose"/>
//                         <DetailsInfoCard variant="simple" title="Net Refund"
//                                          value={`৳${parseFloat(purchaseReturn?.net_return_amount || 0).toLocaleString()}`}
//                                          icon={<FaReceipt />} color="emerald"/>
//                     </div>
//
//                     <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16"></div>
//                         <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
//                             <div className="w-2 h-10 bg-rose-600 rounded-full shadow-lg shadow-rose-500/20"></div>
//                             Refund Breakdown
//                         </h2>
//
//                         <div className="grid gap-4">
//                             <DetailsInfoCard
//                                 icon={<FaWallet />}
//                                 title="Received Amount"
//                                 value={`৳${parseFloat(purchaseReturn?.paid_amount || 0).toLocaleString()}`}
//                                 subValue={`Cash: ৳${purchaseReturn?.paid_cash || 0} | Mobile: ৳${purchaseReturn?.paid_mobile || 0} | Bank: ৳${purchaseReturn?.paid_bank || 0}`}
//                                 color="emerald"
//                             />
//                             <DetailsInfoCard
//                                 icon={<FaInfoCircle />}
//                                 title="Pending Refund"
//                                 value={`৳${parseFloat(purchaseReturn?.due_amount || 0).toLocaleString()}`}
//                                 subValue={parseFloat(purchaseReturn?.due_amount) > 0 ? "Awaiting supplier refund" : "Fully settled"}
//                                 color={parseFloat(purchaseReturn?.due_amount) > 0 ? "rose" : "emerald"}
//                             />
//                         </div>
//                     </div>
//
//                     {/* Return Items Table */}
//                     <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
//                         <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-8">
//                             <div className="w-2 h-10 bg-gray-900 rounded-full shadow-lg shadow-gray-900/20"></div>
//                             Returned Items
//                         </h2>
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-left">
//                                 <thead>
//                                     <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-100">
//                                         <th className="pb-4">Product</th>
//                                         <th className="pb-4 text-center">Return Qty</th>
//                                         <th className="pb-4 text-right">Unit Price</th>
//                                         <th className="pb-4 text-right">Penalty</th>
//                                         <th className="pb-4 text-right">Total</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-50">
//                                     {purchaseReturn?.items.map((item) => (
//                                         <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
//                                             <td className="py-4">
//                                                 <p className="font-bold text-gray-800 text-sm">{item.product_name}</p>
//                                                 {item.reason && <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Reason: {item.reason}</span>}
//                                             </td>
//                                             <td className="py-4 text-center font-bold text-gray-600 text-sm">{item.purchase_return_quantity}</td>
//                                             <td className="py-4 text-right text-gray-600 text-sm">৳{parseFloat(item.unit_price).toLocaleString()}</td>
//                                             <td className="py-4 text-right text-rose-600 font-bold text-sm">৳{parseFloat(item.penalty_amount || 0).toLocaleString()}</td>
//                                             <td className="py-4 text-right text-gray-900 font-black text-sm">৳{parseFloat(item.total_price).toLocaleString()}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="space-y-8">
//                     {/* Reason Section */}
//                     <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
//                         <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
//                             <FaInfoCircle className="text-amber-400 text-lg"/> Return Reason
//                         </h2>
//                         <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-50/50 shadow-inner">
//                             <p className="text-sm font-bold text-gray-600 italic leading-relaxed">
//                                 {purchaseReturn?.return_reason || "No specific reason provided."}
//                             </p>
//                         </div>
//                     </div>
//
//                     {/* Meta Card */}
//                     <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
//                         <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Return Meta</h2>
//                         <div className="space-y-8">
//                             <div className="flex gap-5">
//                                 <div className="w-1.5 h-14 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50"></div>
//                                 <div>
//                                     <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest mb-1">Payment Status</p>
//                                     <p className="text-base font-black uppercase tracking-widest">{purchaseReturn?.payment_status?.toUpperCase()}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Modals */}
//             {editOpen && (
//                 <EditPurchaseReturnModal
//                     open={editOpen}
//                     onClose={() => setEditOpen(false)}
//                     purchase={purchaseReturn}
//                     onUpdated={handleEditSuccess}
//                 />
//             )}
//
//             {showSuccessModal && (
//                 <SuccessModal
//                     isOpen={showSuccessModal}
//                     onClose={() => setShowSuccessModal(false)}
//                     title="Purchase Return Updated Successfully"
//                     subtitle={`Return ID #${updatedData?.id} Updated`}
//                     details={[
//                         { label: "Supplier", value: updatedData?.supplier_name || 'N/A' },
//                         { label: "Return Amount", value: `৳${parseFloat(updatedData?.return_amount || 0).toLocaleString()}` },
//                         { label: "Received Amount", value: `৳${parseFloat(updatedData?.received_amount || 0).toLocaleString()}` }
//                     ]}
//                     onPrint={() => handlePrint(updatedData)}
//                     printText="Print Slip"
//                 />
//             )}
//         </GenericModuleDetails>
//     );
// };
//
// export default PurchaseReturnDetailsPage;


import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaFilePdf, FaInfoCircle, FaCalendarAlt, FaTruck,
    FaWallet, FaClock, FaStickyNote, FaExclamationTriangle, FaReceipt
} from "react-icons/fa";
import api from '../../../context_or_provider/pos/posApi';

import EditPurchaseReturnModal from "./EditPurchaseReturnModal";
import SuccessModal from "../../components/SuccessModal";
import { downloadPurchaseReturnPDF } from "./usePurchasePDF";
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getPurchaseReturnPrintLayout } from "./PurchaseReturnPrintLayout";
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

const PurchaseReturnDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [purchaseReturn, setPurchaseReturn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [updatedData, setUpdatedData] = useState(null);

    const fetchDetails = useCallback(async () => {
        try {
            const res = await api.get(`/api/purchase/purchase-returns/${id}/`);
            setPurchaseReturn(res.data);
        } catch (err) {
            console.error("Failed to fetch purchase return:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleEditSuccess = (data) => {
        setPurchaseReturn(data);
        setUpdatedData(data);
        setEditOpen(false);
        setShowSuccessModal(true);
    };

    const handlePrint = (invoice) => {
        const target = invoice || purchaseReturn;
        if (!target) return;
        const tableContent = getPurchaseReturnPrintLayout(target);
        const fullHTML = getBrandedVoucher("Purchase Return", tableContent, target.id, "#e11d48");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        if (printWindow) {
            printWindow.document.write(fullHTML);
            printWindow.document.close();
        }
    };

    /* ---------- Derived ---------- */
    const netRefundAmount = num(purchaseReturn?.net_return_amount);
    const grossReturnAmount = num(purchaseReturn?.total_return_amount);
    const itemPenalty = num(purchaseReturn?.total_item_penalty);
    const globalPenalty = num(purchaseReturn?.global_penalty);
    const totalPenalties = itemPenalty + globalPenalty;
    const receivedAmount = num(purchaseReturn?.paid_amount);
    const pendingRefund = num(purchaseReturn?.due_amount);

    const parsedNotes = parseNoteLogs(purchaseReturn?.return_reason || purchaseReturn?.note);

    return (
        <GenericModuleDetails
            title="Purchase Return"
            subtitle={purchaseReturn?.purchase_invoice_no ? `Original Inv: #${purchaseReturn.purchase_invoice_no}` : `Return ID: #${purchaseReturn?.id || ''}`}
            image={buildImageUrl(purchaseReturn?.supplier_image)}
            imageAlt={purchaseReturn?.supplier_name}
            imageFallback="https://via.placeholder.com/150"
            recordId={purchaseReturn?.id}
            amount={netRefundAmount.toLocaleString()}
            amountLabel="Net Refund Amount"
            isLoading={loading}
            onPrint={() => handlePrint(purchaseReturn)}
            onEdit={() => setEditOpen(true)}
            printText="Print Return"
            editText="Edit Return"
            accentColor="rose"
            infoItems={[
                {
                    icon: <FaCalendarAlt className="text-rose-500" />,
                    label: "Return Date",
                    value: purchaseReturn?.created_at
                        ? new Date(purchaseReturn.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : "—"
                },
                {
                    icon: <FaTruck className="text-rose-500" />,
                    label: "Supplier",
                    value: purchaseReturn?.supplier_name || "N/A"
                }
            ]}
            actions={[
                {
                    icon: <FaFilePdf size={16} />,
                    label: "Download PDF",
                    onClick: () => downloadPurchaseReturnPDF(purchaseReturn),
                    hoverColor: "hover:bg-rose-600 hover:text-white"
                }
            ]}
        >
            <div className="space-y-8">

                {/* ============================================================
                    RETURNED ITEMS TABLE + SUMMARY (Identical to Purchase)
                ============================================================ */}
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <h2 className="font-black text-xl md:text-2xl uppercase tracking-tighter flex items-center gap-4">
                            <div className="w-2 h-8 md:h-10 bg-gray-900 rounded-full shadow-lg shadow-gray-900/20"></div>
                            Returned Items
                        </h2>
                        <span className="px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            {purchaseReturn?.items?.length || 0} Items
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
                                {purchaseReturn?.items?.map((item) => (
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
                                            {item.purchase_return_quantity}
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
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Received Amount</span>
                                        <span className="font-black text-emerald-600 text-base tabular-nums">
                                            ৳{receivedAmount.toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                            Cash: ৳{num(purchaseReturn?.paid_cash).toLocaleString()} | Mobile: ৳{num(purchaseReturn?.paid_mobile).toLocaleString()} | Bank: ৳{num(purchaseReturn?.paid_bank).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Pending Refund (Due)</span>
                                        <span className={`font-black text-base tabular-nums ${pendingRefund > 0 ? "text-rose-600" : "text-gray-700"}`}>
                                            ৳{pendingRefund.toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {pendingRefund > 0 ? "Awaiting supplier refund" : "Fully settled"}
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
                                            {purchaseReturn?.payment_status || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="h-6 w-px bg-gray-800"></div>

                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Processed By</span>
                                        <span className="font-bold text-blue-400 truncate max-w-[120px]">
                                            {purchaseReturn?.created_by_name || 'System User'}
                                        </span>
                                    </div>

                                    <div className="h-6 w-px bg-gray-800"></div>

                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Created</span>
                                        <span className="font-bold text-slate-300">
                                            {purchaseReturn?.created_at
                                                ? new Date(purchaseReturn.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
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
                                <span>Received:</span>
                                <span className="tabular-nums">
                                    ৳{receivedAmount.toLocaleString()}
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
                <EditPurchaseReturnModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    purchase={purchaseReturn}
                    onUpdated={handleEditSuccess}
                />
            )}

            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title="Purchase Return Updated Successfully"
                    subtitle={`Return ID #${updatedData?.id} Updated`}
                    details={[
                        { label: "Supplier", value: updatedData?.supplier_name || 'N/A' },
                        { label: "Return Amount", value: `৳${num(updatedData?.net_return_amount || updatedData?.return_amount).toLocaleString()}` },
                        { label: "Received Amount", value: `৳${num(updatedData?.paid_amount || updatedData?.received_amount).toLocaleString()}` }
                    ]}
                    onPrint={() => handlePrint(updatedData)}
                    printText="Print Slip"
                />
            )}
        </GenericModuleDetails>
    );
};

export default PurchaseReturnDetailsPage;