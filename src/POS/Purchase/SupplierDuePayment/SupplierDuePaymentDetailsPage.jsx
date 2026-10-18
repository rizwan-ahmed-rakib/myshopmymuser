// import React, {useState, useEffect, useCallback} from "react";
// import {useParams, useNavigate} from "react-router-dom";
// import {
//     FaTruck, FaMoneyBillWave, FaMobileAlt, FaUniversity,
//     FaFilePdf, FaEdit, FaInfoCircle, FaCalendarAlt, FaHashtag,
//     FaStickyNote, FaCheckCircle, FaWallet, FaReceipt
// } from "react-icons/fa";
// import {posDuePaymentAPI} from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
// import EditSupplierDuePaymentModal from "./EditSupplierDuePaymentModal";
// import GenericModuleDetails from "../../components/GenericModuleDetails";
// import DetailsInfoCard from "../../components/DetailsInfoCard";
// import {getBrandedVoucher} from "../../utils/printTemplates";
// import {getDuePaymentPrintLayout} from "./DuePaymentPrintLayout";
// import SuccessModal from "../../components/SuccessModal";
//
// /**
//  * SupplierDuePaymentDetails - Refactored to use GenericModuleDetails and DetailsInfoCard.
//  * Integrated with standardized Backbone printing engine.
//  */
// const SupplierDuePaymentDetails = () => {
//     const {id} = useParams();
//     const navigate = useNavigate();
//     const [item, setItem] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [editOpen, setEditOpen] = useState(false);
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [updatedData, setUpdatedData] = useState(null);
//
//     const fetchItem = useCallback(async () => {
//         try {
//             const res = await posDuePaymentAPI.getById(id);
//             setItem(res.data);
//         } catch (err) {
//             console.error("Error fetching payment details:", err);
//         } finally {
//             setLoading(false);
//         }
//     }, [id]);
//
//     useEffect(() => {
//         fetchItem();
//     }, [fetchItem]);
//
//     const handleEditSuccess = (data) => {
//         setItem(data);
//         setUpdatedData(data);
//         setEditOpen(false);
//         setShowSuccessModal(true);
//     };
//
//     const handlePrint = () => {
//         if (!item) return;
//         const tableContent = getDuePaymentPrintLayout(item);
//         const fullHTML = getBrandedVoucher("Payment Receipt", tableContent, item.invoice_no, "#10b981");
//         const printWindow = window.open("", "_blank", "width=850,height=900");
//         printWindow.document.write(fullHTML);
//         printWindow.document.close();
//     };
//
//     return (
//         <GenericModuleDetails
//             title="Due Payment Voucher"
//             subtitle={`#${item?.invoice_no}`}
//             image={null}
//             imageAlt={item?.supplier_name}
//             imageFallback="https://via.placeholder.com/150"
//             recordId={item?.invoice_no}
//             amount={parseFloat(item?.amount || 0).toLocaleString()}
//             amountLabel="Total Amount Settled"
//             isLoading={loading}
//             onPrint={handlePrint}
//             onEdit={() => setEditOpen(true)}
//             printText="Print Voucher"
//             editText="Edit Record"
//             accentColor="emerald"
//             infoItems={[
//                 {
//                     icon: <FaCalendarAlt />,
//                     label: "Payment Date",
//                     value: new Date(item?.created_at).toLocaleDateString()
//                 },
//                 { icon: <FaTruck />, label: "Supplier", value: item?.supplier_name || "N/A" }
//             ]}
//         >
//             <div className="grid lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-2 space-y-8">
//                     {/* Basic Info Cards */}
//                     <div className="grid sm:grid-cols-2 gap-6">
//                         <DetailsInfoCard variant="simple" title="Linked Purchase"
//                                          value={item?.purchase_invoice_no ? `#${item.purchase_invoice_no}` : "General Payment"}
//                                          icon={<FaHashtag />} color="blue"/>
//                         <DetailsInfoCard variant="simple" title="Status"
//                                          value="Verified & Settled"
//                                          icon={<FaCheckCircle />} color="emerald"/>
//                     </div>
//
//                     <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16"></div>
//                         <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
//                             <div className="w-2 h-10 bg-emerald-600 rounded-full shadow-lg shadow-emerald-500/20"></div>
//                             Payment Breakdown
//                         </h2>
//
//                         <div className="grid gap-4">
//                             {Number(item?.paid_cash) > 0 && (
//                                 <DetailsInfoCard
//                                     icon={<FaMoneyBillWave />}
//                                     title="Cash Payment"
//                                     value={`৳${parseFloat(item.paid_cash).toLocaleString()}`}
//                                     color="emerald"
//                                 />
//                             )}
//                             {Number(item?.paid_mobile) > 0 && (
//                                 <DetailsInfoCard
//                                     icon={<FaMobileAlt />}
//                                     title={`Mobile Banking (${item.mobile_operator})`}
//                                     value={`৳${parseFloat(item.paid_mobile).toLocaleString()}`}
//                                     subValue={`TxID: ${item.transaction_id || 'N/A'}`}
//                                     color="purple"
//                                 />
//                             )}
//                             {Number(item?.paid_bank) > 0 && (
//                                 <DetailsInfoCard
//                                     icon={<FaUniversity />}
//                                     title={`Bank Transfer (${item.bank_name})`}
//                                     value={`৳${parseFloat(item.paid_bank).toLocaleString()}`}
//                                     color="indigo"
//                                 />
//                             )}
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="space-y-8">
//                     {/* Remarks Section */}
//                     <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
//                         <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
//                             <FaStickyNote className="text-amber-400 text-lg"/> Remarks
//                         </h2>
//                         <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-50/50 shadow-inner">
//                             <p className="text-sm font-bold text-gray-600 italic leading-relaxed">
//                                 {item?.note || "No additional remarks provided for this transaction."}
//                             </p>
//                         </div>
//                     </div>
//
//                     {/* Audit Log Card */}
//                     <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
//                         <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Audit Log</h2>
//                         <div className="space-y-8">
//                             <div className="flex gap-5">
//                                 <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
//                                 <div>
//                                     <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Created By</p>
//                                     <p className="text-base font-black uppercase tracking-widest">{item?.created_by_name || 'System'}</p>
//                                 </div>
//                             </div>
//                             <div className="flex gap-5">
//                                 <div className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
//                                 <div>
//                                     <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Last Updated</p>
//                                     <p className="text-base font-black uppercase tracking-widest">{new Date(item?.updated_at || item?.created_at).toLocaleDateString()}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {editOpen && (
//                 <EditSupplierDuePaymentModal
//                     isOpen={editOpen}
//                     onClose={() => setEditOpen(false)}
//                     item={item}
//                     onSuccess={handleEditSuccess}
//                 />
//             )}
//
//             {showSuccessModal && (
//                 <SuccessModal
//                     isOpen={showSuccessModal}
//                     onClose={() => setShowSuccessModal(false)}
//                     title="Payment Updated Successfully"
//                     subtitle={`Payment #${updatedData?.invoice_no}`}
//                     details={[
//                         { label: "Supplier", value: updatedData?.supplier_name || 'N/A' },
//                         { label: "Settled Amount", value: `৳${parseFloat(updatedData?.amount || 0).toLocaleString()}` },
//                         { label: "Payment Method", value: (updatedData?.payment_method || '').replace('_', ' ').toUpperCase() }
//                     ]}
//                     onPrint={handlePrint}
//                     printText="Print Receipt"
//                 />
//             )}
//         </GenericModuleDetails>
//     );
// };
//
// export default SupplierDuePaymentDetails;



import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaTruck, FaMoneyBillWave, FaMobileAlt, FaUniversity,
    FaCalendarAlt, FaHashtag, FaStickyNote, FaCheckCircle,
    FaShieldAlt, FaClock
} from "react-icons/fa";
import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
import EditSupplierDuePaymentModal from "./EditSupplierDuePaymentModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getDuePaymentPrintLayout } from "./DuePaymentPrintLayout";
import SuccessModal from "../../components/SuccessModal";
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
 * Note Parsing Helper:
 * [2026-09-17 21:38:26] Format-er text gulo ke split kore timestamp + message alada korbe
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
 * SupplierDuePaymentDetails - Redesigned UI with Full Row Notes & History Timeline.
 */
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

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    const handleEditSuccess = (data) => {
        setItem(data);
        setUpdatedData(data);
        setEditOpen(false);
        setShowSuccessModal(true);
    };

    const handlePrint = () => {
        if (!item) return;
        const tableContent = getDuePaymentPrintLayout(item);
        const fullHTML = getBrandedVoucher("Payment Receipt", tableContent, item.invoice_no, "#10b981");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        if (printWindow) {
            printWindow.document.write(fullHTML);
            printWindow.document.close();
        }
    };

    const totalSettledAmount = num(item?.amount);
    const parsedNotes = parseNoteLogs(item?.note);

    return (
        <GenericModuleDetails
            title="Due Payment Voucher"
            subtitle={`#${item?.invoice_no || ''}`}
            image={buildImageUrl(item?.supplier_image)}
            imageAlt={item?.supplier_name}
            imageFallback="https://via.placeholder.com/150"
            recordId={item?.invoice_no}
            amount={totalSettledAmount.toLocaleString()}
            amountLabel="Total Settled"
            isLoading={loading}
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            printText="Print Voucher"
            editText="Edit Record"
            accentColor="emerald"
            infoItems={[
                {
                    icon: <FaCalendarAlt className="text-emerald-500" />,
                    label: "Payment Date",
                    value: item?.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"
                },
                {
                    icon: <FaTruck className="text-emerald-500" />,
                    label: "Supplier",
                    value: item?.supplier_name || "N/A"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* -------------------- Main Left Section (2 Columns) -------------------- */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {/* Basic Info Cards */}
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        <DetailsInfoCard
                            variant="simple"
                            title="Linked Purchase"
                            value={item?.purchase_invoice_no ? `#${item.purchase_invoice_no}` : "General Payment"}
                            icon={<FaHashtag />}
                            color="blue"
                        />
                        <DetailsInfoCard
                            variant="simple"
                            title="Status"
                            value="Verified & Settled"
                            icon={<FaCheckCircle />}
                            color="emerald"
                        />
                    </div>

                    {/* Payment Method Breakdown */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-3">
                                <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                                Payment Method Breakdown
                            </h2>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                Total: ৳{totalSettledAmount.toLocaleString()}
                            </span>
                        </div>

                        <div className="grid gap-4">
                            {num(item?.paid_cash) > 0 && (
                                <DetailsInfoCard
                                    icon={<FaMoneyBillWave />}
                                    title="Cash Payment"
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

                {/* -------------------- Audit Log Top Right (1 Column) -------------------- */}
                <div className="space-y-6 sm:space-y-8">
                    <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden h-full flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                        <div>
                            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                                <FaShieldAlt className="text-emerald-400 text-base"/> Audit Log
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
                                    <div className="w-1 h-10 bg-emerald-500 rounded-full mt-0.5 shrink-0"></div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Last Updated</p>
                                        <p className="text-sm font-bold text-slate-100">
                                            {item?.updated_at || item?.created_at ? new Date(item?.updated_at || item?.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
                            Status: <span className="text-emerald-400 font-bold">Recorded & Verified</span>
                        </div>
                    </div>
                </div>

                {/* -------------------- FULL ROW (3 Columns Width): Remarks / Activity Timeline -------------------- */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight flex items-center gap-2.5">
                                <FaStickyNote className="text-amber-500 text-lg"/>
                                Payment Activity & Note History
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
                                No activity log or remarks available for this payment voucher.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <EditSupplierDuePaymentModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    item={item}
                    onSuccess={handleEditSuccess}
                />
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title="Payment Updated Successfully"
                    subtitle={`Payment #${updatedData?.invoice_no}`}
                    details={[
                        { label: "Supplier", value: updatedData?.supplier_name || 'N/A' },
                        { label: "Settled Amount", value: `৳${num(updatedData?.amount).toLocaleString()}` },
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