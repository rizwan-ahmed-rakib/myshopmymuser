//
//
// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//     FaUser, FaMoneyBillWave, FaMobileAlt,
//     FaUniversity, FaCalendarAlt, FaHashtag,
//     FaStickyNote, FaCheckCircle, FaShieldAlt, FaClock
// } from "react-icons/fa";
// import { posDueCollectionAPI } from "../../../context_or_provider/pos/Sale/dueCollection/dueCollectionAPI";
// import EditCustomerDueCollectionModal from "./EditCustomerDueCollectionModal";
// import GenericModuleDetails from "../../components/GenericModuleDetails";
// import DetailsInfoCard from "../../components/DetailsInfoCard";
// import { getBrandedVoucher } from "../../utils/printTemplates";
// import { getDueCollectionPrintLayout } from "./DueCollectionPrintLayout";
// import BASE_URL_of_POS from "../../../posConfig";
//
// /* ------------------------------------------------------------------ */
// /*  Helper Functions                                                  */
// /* ------------------------------------------------------------------ */
//
// const buildImageUrl = (url) => {
//     if (!url) return null;
//     return url.startsWith("http") ? url : `${BASE_URL_of_POS}${url}`;
// };
//
// const num = (v) => parseFloat(v) || 0;
//
// /**
//  * Note Formatting Helper:
//  * [2026-09-17 21:38:26] Format er text gulo ke split kore timestamp + message alada kore
//  */
// const parseNoteLogs = (noteText) => {
//     if (!noteText) return [];
//
//     // Line breaks (\n) diye split kora
//     const lines = noteText.split('\n').filter(line => line.trim() !== '');
//
//     return lines.map((line, index) => {
//         const match = line.match(/^\[(.*?)\]\s*(.*)$/);
//         if (match) {
//             return {
//                 id: index,
//                 timestamp: match[1],
//                 message: match[2]
//             };
//         }
//         return {
//             id: index,
//             timestamp: null,
//             message: line
//         };
//     });
// };
//
// /**
//  * CustomerDueCollectionDetails - Full Row Notes & History Timeline
//  */
// const CustomerDueCollectionDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [item, setItem] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [editOpen, setEditOpen] = useState(false);
//
//     const fetchItem = useCallback(async () => {
//         try {
//             const res = await posDueCollectionAPI.getById(id);
//             setItem(res.data);
//         } catch (err) {
//             console.error("Error fetching collection details:", err);
//         } finally {
//             setLoading(false);
//         }
//     }, [id]);
//
//     useEffect(() => {
//         fetchItem();
//     }, [fetchItem]);
//
//     const handleEditSuccess = () => {
//         fetchItem();
//         setEditOpen(false);
//     };
//
//     const handlePrint = () => {
//         if (!item) return;
//         const tableContent = getDueCollectionPrintLayout(item);
//         const fullHTML = getBrandedVoucher("Collection Voucher", tableContent, item.invoice_no, "#10b981");
//         const printWindow = window.open("", "_blank", "width=850,height=900");
//         if (printWindow) {
//             printWindow.document.write(fullHTML);
//             printWindow.document.close();
//         }
//     };
//
//     const totalCollectedAmount = num(item?.amount);
//     const parsedNotes = parseNoteLogs(item?.note);
//
//     return (
//         <GenericModuleDetails
//             title="Due Collection Voucher"
//             subtitle={`#${item?.invoice_no || ''}`}
//             image={buildImageUrl(item?.customer_image)}
//             imageAlt={item?.customer_name}
//             imageFallback="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"
//             recordId={item?.invoice_no}
//             amount={totalCollectedAmount.toLocaleString()}
//             amountLabel="Total Received"
//             isLoading={loading}
//             onPrint={handlePrint}
//             onEdit={() => setEditOpen(true)}
//             printText="Print Receipt"
//             editText="Edit Record"
//             accentColor="emerald"
//             infoItems={[
//                 {
//                     icon: <FaCalendarAlt className="text-emerald-500" />,
//                     label: "Collection Date",
//                     value: item?.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"
//                 },
//                 {
//                     icon: <FaUser className="text-emerald-500" />,
//                     label: "Customer Name",
//                     value: item?.customer_name || "Walk-in Customer"
//                 }
//             ]}
//         >
//             <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
//                 {/* -------------------- Top Section (2 Columns) -------------------- */}
//                 <div className="lg:col-span-2 space-y-6 sm:space-y-8">
//                     {/* Summary Info */}
//                     <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
//                         <DetailsInfoCard
//                             variant="simple"
//                             title="Linked Sale Invoice"
//                             value={item?.sale_invoice_no ? `#${item.sale_invoice_no}` : "General Collection"}
//                             icon={<FaHashtag />}
//                             color="blue"
//                         />
//                         <DetailsInfoCard
//                             variant="simple"
//                             title="Collection Status"
//                             value="Completed & Verified"
//                             icon={<FaCheckCircle />}
//                             color="emerald"
//                         />
//                     </div>
//
//                     {/* Payment Method Breakdown */}
//                     <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100 relative overflow-hidden">
//                         <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
//                             <h2 className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-3">
//                                 <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
//                                 Payment Method Breakdown
//                             </h2>
//                             <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
//                                 Total: ৳{totalCollectedAmount.toLocaleString()}
//                             </span>
//                         </div>
//
//                         <div className="grid gap-4">
//                             {num(item?.paid_cash) > 0 && (
//                                 <DetailsInfoCard
//                                     icon={<FaMoneyBillWave />}
//                                     title="Cash Collection"
//                                     value={`৳${num(item.paid_cash).toLocaleString()}`}
//                                     color="emerald"
//                                 />
//                             )}
//                             {num(item?.paid_mobile) > 0 && (
//                                 <DetailsInfoCard
//                                     icon={<FaMobileAlt />}
//                                     title={`Mobile Banking ${item?.mobile_operator ? `(${item.mobile_operator})` : ''}`}
//                                     value={`৳${num(item.paid_mobile).toLocaleString()}`}
//                                     subValue={item?.transaction_id ? `TxID: ${item.transaction_id}` : null}
//                                     color="purple"
//                                 />
//                             )}
//                             {num(item?.paid_bank) > 0 && (
//                                 <DetailsInfoCard
//                                     icon={<FaUniversity />}
//                                     title={`Bank Transfer ${item?.bank_name ? `(${item.bank_name})` : ''}`}
//                                     value={`৳${num(item.paid_bank).toLocaleString()}`}
//                                     color="indigo"
//                                 />
//                             )}
//                             {num(item?.paid_cash) === 0 && num(item?.paid_mobile) === 0 && num(item?.paid_bank) === 0 && (
//                                 <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-sm font-medium text-center">
//                                     No detailed payment breakdown specified.
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* -------------------- Top Audit Log (1 Column) -------------------- */}
//                 <div className="space-y-6 sm:space-y-8">
//                     <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden h-full flex flex-col justify-between">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
//                         <div>
//                             <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
//                                 <FaShieldAlt className="text-emerald-400 text-base"/> Audit Log
//                             </h2>
//
//                             <div className="space-y-5">
//                                 <div className="flex items-start gap-3.5">
//                                     <div className="w-1 h-10 bg-blue-500 rounded-full mt-0.5 shrink-0"></div>
//                                     <div className="min-w-0">
//                                         <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Processed By</p>
//                                         <p className="text-sm font-bold text-slate-100 truncate">{item?.created_by_name || 'System User'}</p>
//                                     </div>
//                                 </div>
//
//                                 <div className="flex items-start gap-3.5">
//                                     <div className="w-1 h-10 bg-emerald-500 rounded-full mt-0.5 shrink-0"></div>
//                                     <div className="min-w-0">
//                                         <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Created At</p>
//                                         <p className="text-sm font-bold text-slate-100">
//                                             {item?.created_at ? new Date(item.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
//                             Status: <span className="text-emerald-400 font-bold">Recorded & Synchronized</span>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* -------------------- FULL ROW (3 Columns Width): Remarks / Activity History -------------------- */}
//                 <div className="lg:col-span-3">
//                     <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100">
//                         <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
//                             <h2 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight flex items-center gap-2.5">
//                                 <FaStickyNote className="text-amber-500 text-lg"/>
//                                 Collection Activity & Note History
//                             </h2>
//                             <span className="text-xs text-gray-400 font-medium">
//                                 {parsedNotes.length} Log Entry(s)
//                             </span>
//                         </div>
//
//                         {parsedNotes.length > 0 ? (
//                             <div className="space-y-4">
//                                 {parsedNotes.map((log) => (
//                                     <div
//                                         key={log.id}
//                                         className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-50/80 transition-colors"
//                                     >
//                                         <div className="flex items-start gap-3">
//                                             <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
//                                             <p className="text-sm font-semibold text-gray-800 leading-relaxed">
//                                                 {log.message}
//                                             </p>
//                                         </div>
//
//                                         {log.timestamp && (
//                                             <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-center">
//                                                 <FaClock className="text-amber-600 text-xs" />
//                                                 <span>{log.timestamp}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="p-6 text-center text-gray-400 text-sm font-medium bg-gray-50 rounded-2xl">
//                                 No activity log or remarks available for this voucher.
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//
//             {/* Edit Modal */}
//             {editOpen && (
//                 <EditCustomerDueCollectionModal
//                     isOpen={editOpen}
//                     onClose={() => setEditOpen(false)}
//                     item={item}
//                     onSuccess={handleEditSuccess}
//                 />
//             )}
//         </GenericModuleDetails>
//     );
// };
//
// export default CustomerDueCollectionDetails;



import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaUser, FaMoneyBillWave, FaMobileAlt,
    FaUniversity, FaCalendarAlt, FaHashtag,
    FaStickyNote, FaCheckCircle, FaShieldAlt, FaClock,
    FaExchangeAlt
} from "react-icons/fa";
import { RefreshCcw } from 'lucide-react';
import { posDueCollectionAPI } from "../../../context_or_provider/pos/Sale/dueCollection/dueCollectionAPI";
import EditCustomerDueCollectionModal from "./EditCustomerDueCollectionModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getDueCollectionPrintLayout } from "./DueCollectionPrintLayout";
import BASE_URL_of_POS from "../../../posConfig";

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                  */
/* ------------------------------------------------------------------ */

const buildImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${BASE_URL_of_POS}${url}`;
};

const num = (v) => parseFloat(v) || 0;

/**
 * Note Formatting Helper:
 * [2026-09-17 21:38:26] Format er text gulo ke split kore timestamp + message alada kore
 */
const parseNoteLogs = (noteText) => {
    if (!noteText) return [];

    const lines = noteText.split('\n').filter(line => line.trim() !== '');

    return lines.map((line, index) => {
        const match = line.match(/^\[(.*?)\]\s*(.*)$/);
        if (match) {
            return {
                id: index,
                timestamp: match[1],
                message: match[2]
            };
        }
        return {
            id: index,
            timestamp: null,
            message: line
        };
    });
};

/**
 * CustomerDueCollectionDetails - Full Row Notes & History Timeline
 * Supports both 'collection' (customer pays us) and 'refund' (we pay customer back)
 */
const CustomerDueCollectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);

    const fetchItem = useCallback(async () => {
        try {
            const res = await posDueCollectionAPI.getById(id);
            setItem(res.data);
        } catch (err) {
            console.error("Error fetching collection details:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    const handleEditSuccess = () => {
        fetchItem();
        setEditOpen(false);
    };

    const isRefund = item?.transaction_type === 'refund';
    const accent = isRefund ? 'blue' : 'emerald';
    const accentText = isRefund ? 'text-blue-500' : 'text-emerald-500';
    const accentTextDark = isRefund ? 'text-blue-400' : 'text-emerald-400';
    const accentBg = isRefund ? 'bg-blue-500' : 'bg-emerald-500';
    const accentBgFade = isRefund ? 'bg-blue-500/10' : 'bg-emerald-500/10';
    const accentRingBg = isRefund ? 'bg-blue-50 text-blue-700 border-blue-200/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200/60';

    const handlePrint = () => {
        if (!item) return;
        const tableContent = getDueCollectionPrintLayout(item);
        const title = isRefund ? "Refund Voucher" : "Collection Voucher";
        const color = isRefund ? "#3b82f6" : "#10b981";
        const fullHTML = getBrandedVoucher(title, tableContent, item.invoice_no, color);
        const printWindow = window.open("", "_blank", "width=850,height=900");
        if (printWindow) {
            printWindow.document.write(fullHTML);
            printWindow.document.close();
        }
    };

    const totalCollectedAmount = num(item?.amount);
    const parsedNotes = parseNoteLogs(item?.note);

    return (
        <GenericModuleDetails
            title={isRefund ? "Refund Voucher" : "Due Collection Voucher"}
            subtitle={`#${item?.invoice_no || ''}`}
            image={buildImageUrl(item?.customer_image)}
            imageAlt={item?.customer_name}
            imageFallback="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"
            recordId={item?.invoice_no}
            amount={totalCollectedAmount.toLocaleString()}
            amountLabel={isRefund ? "Total Refunded" : "Total Received"}
            isLoading={loading}
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            printText={isRefund ? "Print Refund Receipt" : "Print Receipt"}
            editText="Edit Record"
            accentColor={accent}
            infoItems={[
                {
                    icon: <FaCalendarAlt className={accentText} />,
                    label: isRefund ? "Refund Date" : "Collection Date",
                    value: item?.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"
                },
                {
                    icon: <FaUser className={accentText} />,
                    label: "Customer Name",
                    value: item?.customer_name || "Walk-in Customer"
                },
                {
                    icon: <FaExchangeAlt className={accentText} />,
                    label: "Type",
                    value: isRefund ? "Refund" : "Collection"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* -------------------- Top Section (2 Columns) -------------------- */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {/* Summary Info */}
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <DetailsInfoCard
                            variant="simple"
                            title={isRefund ? "Settlement Type" : "Linked Sale Invoice"}
                            value={
                                isRefund
                                    ? "Advance Refund"
                                    : item?.sale_invoice_no ? `#${item.sale_invoice_no}` : "General Collection"
                            }
                            icon={<FaHashtag />}
                            color="blue"
                        />
                        <DetailsInfoCard
                            variant="simple"
                            title="Status"
                            value={isRefund ? "Refund Credited" : "Completed & Verified"}
                            icon={isRefund ? <RefreshCcw /> : <FaCheckCircle />}
                            color={accent}
                        />
                    </div>

                    {/* Payment Method Breakdown */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-3">
                                <span className={`w-2.5 h-6 ${accentBg} rounded-full inline-block`}></span>
                                {isRefund ? 'Refund Breakdown' : 'Payment Method Breakdown'}
                            </h2>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${accentRingBg}`}>
                                {isRefund ? 'Refunded' : 'Total'}: ৳{totalCollectedAmount.toLocaleString()}
                            </span>
                        </div>

                        <div className="grid gap-4">
                            {num(item?.paid_cash) > 0 && (
                                <DetailsInfoCard
                                    icon={<FaMoneyBillWave />}
                                    title={isRefund ? "Cash Refunded" : "Cash Collection"}
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
                                    No detailed payment breakdown specified.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* -------------------- Top Audit Log (1 Column) -------------------- */}
                <div className="space-y-6 sm:space-y-8">
                    <div className={`${isRefund ? 'bg-blue-900' : 'bg-slate-900'} p-6 sm:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden h-full flex flex-col justify-between`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 ${accentBgFade} rounded-full -mr-16 -mt-16 pointer-events-none`}></div>
                        <div>
                            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                                <FaShieldAlt className={`${accentTextDark} text-base`} /> Audit Log
                            </h2>

                            <div className="space-y-5">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-1 h-10 bg-blue-500 rounded-full mt-0.5 shrink-0"></div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Processed By</p>
                                        <p className="text-sm font-bold text-slate-100 truncate">{item?.created_by_name || 'System User'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className={`w-1 h-10 ${accentBg} rounded-full mt-0.5 shrink-0`}></div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Created At</p>
                                        <p className="text-sm font-bold text-slate-100">
                                            {item?.created_at ? new Date(item.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
                            Status: <span className={`${accentTextDark} font-bold`}>
                                {isRefund ? 'Refund Recorded' : 'Recorded & Synchronized'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* -------------------- FULL ROW (3 Columns Width): Remarks / Activity History -------------------- */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight flex items-center gap-2.5">
                                <FaStickyNote className="text-amber-500 text-lg"/>
                                {isRefund ? 'Refund Activity & Note History' : 'Collection Activity & Note History'}
                            </h2>
                            <span className="text-xs text-gray-400 font-medium">
                                {parsedNotes.length} Log Entry(s)
                            </span>
                        </div>

                        {parsedNotes.length > 0 ? (
                            <div className="space-y-4">
                                {parsedNotes.map((log) => (
                                    <div
                                        key={log.id}
                                        className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-50/80 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                            <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                                                {log.message}
                                            </p>
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
                                No activity log or remarks available for this voucher.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <EditCustomerDueCollectionModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    item={item}
                    onSuccess={handleEditSuccess}
                />
            )}
        </GenericModuleDetails>
    );
};

export default CustomerDueCollectionDetails;