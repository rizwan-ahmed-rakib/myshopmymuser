// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//     FaWarehouse, FaInfoCircle, FaFilePdf, FaUndo,
//     FaCalendarAlt, FaWallet, FaShieldAlt, FaStickyNote, FaClock
// } from "react-icons/fa";
// import { AiFillDelete } from "react-icons/ai";
// import api from '../../../context_or_provider/pos/posApi';
//
// import EditPurchaseModal from "./EditPurchaseModal";
// import PurchaseReturnModal from "./PurchaseReturnModal";
// import PurchaseReturnSuccessModal from "./PurchaseReturnSuccessModal";
// import { downloadPurchasePDF } from "./usePurchasePDF";
// import { getBrandedVoucher } from "../../utils/printTemplates";
// import { getPurchasePrintLayout } from "./PurchasePrintLayout";
// import GenericModuleDetails from "../../components/GenericModuleDetails";
// import SuccessModal from "../../components/SuccessModal";
// import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
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
//  * Note Parsing Helper:
//  * [2026-09-18 11:30:00] Format-er text gulo ke split kore timestamp + message alada korbe
//  */
// const parseNoteLogs = (noteText) => {
//     if (!noteText) return [];
//
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
// /* ------------------------------------------------------------------ */
// /*  Page Component                                                    */
// /* ------------------------------------------------------------------ */
//
// const PurchaseDetailsPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//
//     const [purchase, setPurchase] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [editOpen, setEditOpen] = useState(false);
//     const [returnOpen, setReturnOpen] = useState(false);
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [updatedPurchaseData, setUpdatedPurchaseData] = useState(null);
//     const [returnSuccessData, setReturnSuccessData] = useState(null);
//
//     const fetchPurchaseDetails = useCallback(async () => {
//         try {
//             const res = await api.get(`/api/purchase/purchases/${id}/`);
//             setPurchase(res.data);
//         } catch (error) {
//             console.error("Error fetching purchase details:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [id]);
//
//     useEffect(() => {
//         fetchPurchaseDetails();
//     }, [fetchPurchaseDetails]);
//
//     const handleEditSuccess = (updatedData) => {
//         setPurchase(updatedData);
//         setUpdatedPurchaseData(updatedData);
//         setEditOpen(false);
//         setShowSuccessModal(true);
//     };
//
//     const handleReturnSuccess = (returnData) => {
//         setReturnOpen(false);
//         setReturnSuccessData(returnData);
//         fetchPurchaseDetails();
//     };
//
//     const handleDelete = async () => {
//         if (!window.confirm(`Are you sure you want to delete Invoice #${purchase?.invoice_no}?`)) return;
//         try {
//             await posPurchaseProductAPI.delete(id);
//             alert("Purchase deleted successfully!");
//             navigate("/purchase");
//         } catch (error) {
//             console.error(error);
//             alert("Failed to delete the purchase.");
//         }
//     };
//
//     const handlePrint = () => {
//         if (!purchase) return;
//         const tableContent = getPurchasePrintLayout(purchase);
//         const fullHTML = getBrandedVoucher("Purchase Invoice", tableContent, purchase.invoice_no, "#1d4ed8");
//         const printWindow = window.open("", "_blank", "width=850,height=900");
//         if (printWindow) {
//             printWindow.document.write(fullHTML);
//             printWindow.document.close();
//         }
//     };
//
//     /* ---------- Derived Financial Values ---------- */
//     const originalInvoiceDue = num(purchase?.due_amount);
//     const otherInvoicesDue = num(purchase?.supplier_due_amount) - originalInvoiceDue;
//     const totalSupplierDue = otherInvoicesDue + originalInvoiceDue;
//
//     const grossTotal = num(purchase?.total_amount);
//     const itemDiscount = num(purchase?.itemwise_total_discount);
//     const globalDiscount = num(purchase?.global_discount);
//     const subTotal = num(purchase?.subtotal);
//     const netTotal = num(purchase?.net_total);
//     const paidAmount = num(purchase?.paid_amount);
//
//     const parsedNotes = parseNoteLogs(purchase?.notes || purchase?.note);
//
//     return (
//         <GenericModuleDetails
//             title="Purchase Invoice"
//             subtitle={`#${purchase?.invoice_no}`}
//             image={buildImageUrl(purchase?.supplier_image)}
//             imageAlt={purchase?.supplier_name}
//             imageFallback="https://via.placeholder.com/150"
//             recordId={purchase?.invoice_no}
//             amount={netTotal.toLocaleString()}
//             amountLabel="Net Payable Amount"
//             isLoading={loading}
//             onPrint={handlePrint}
//             onEdit={() => setEditOpen(true)}
//             printText="Print Invoice"
//             editText="Edit Invoice"
//             accentColor="blue"
//             infoItems={[
//                 {
//                     icon: <FaCalendarAlt className="text-blue-500" />,
//                     label: "Purchase Date",
//                     value: purchase?.created_at
//                         ? new Date(purchase.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//                         : "—"
//                 },
//                 { icon: <FaWarehouse className="text-blue-500" />, label: "Supplier", value: purchase?.supplier_name || "N/A" }
//             ]}
//             actions={[
//                 {
//                     icon: <FaFilePdf size={16} />,
//                     label: "Download PDF",
//                     onClick: () => downloadPurchasePDF(purchase),
//                     hoverColor: "hover:bg-orange-600 hover:text-white"
//                 },
//                 {
//                     icon: <FaUndo size={16} />,
//                     label: "Return Items",
//                     onClick: () => setReturnOpen(true),
//                     hoverColor: "hover:bg-amber-600 hover:text-white"
//                 },
//                 {
//                     icon: <AiFillDelete size={16} />,
//                     label: "Delete",
//                     onClick: handleDelete,
//                     hoverColor: "hover:bg-red-600 hover:text-white"
//                 }
//             ]}
//         >
//             <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
//
//                 {/* -------------------- Main Left Section (2 Columns) -------------------- */}
//                 <div className="lg:col-span-2 space-y-6 sm:space-y-8">
//                     {/* Items Table Card */}
//                     <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100">
//                         <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
//                             <h2 className="font-bold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-3">
//                                 <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
//                                 Purchase Items
//                             </h2>
//                             <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
//                                 {purchase?.items?.length || 0} Items
//                             </span>
//                         </div>
//
//                         {/* Items Table */}
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-left border-collapse">
//                                 <thead>
//                                     <tr className="text-[11px] uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100">
//                                         <th className="pb-3 pl-2">Product Description</th>
//                                         <th className="pb-3 text-center">Qty</th>
//                                         <th className="pb-3 text-right">Price (৳)</th>
//                                         <th className="pb-3 text-right">Discount (৳)</th>
//                                         <th className="pb-3 text-right pr-2">Total (৳)</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100/60">
//                                     {purchase?.items?.map((item) => (
//                                         <tr key={item.id} className="even:bg-gray-50/50 hover:bg-blue-50/30 transition-colors">
//                                             <td className="py-3 pl-2 pr-4">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60 shrink-0">
//                                                         <img
//                                                             src={buildImageUrl(item.product_image) || "https://via.placeholder.com/80"}
//                                                             alt={item.product_name}
//                                                             className="w-full h-full object-cover"
//                                                             onError={(e) => {
//                                                                 e.target.onerror = null;
//                                                                 e.target.src = "https://via.placeholder.com/80";
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     <div className="min-w-0">
//                                                         <p className="font-bold text-gray-800 text-sm leading-tight">
//                                                             {item.product_name}
//                                                         </p>
//                                                         <div className="flex flex-wrap items-center gap-2 mt-1">
//                                                             {item.batch_no && (
//                                                                 <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
//                                                                     Batch: {item.batch_no}
//                                                                 </span>
//                                                             )}
//                                                             {item.expiry_status === "near_expiry" && (
//                                                                 <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
//                                                                     Near Expiry
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="py-3 text-center font-bold text-gray-700 text-sm tabular-nums">
//                                                 {item.quantity}
//                                             </td>
//                                             <td className="py-3 text-right text-gray-600 text-sm tabular-nums">
//                                                 ৳{num(item.unit_price).toLocaleString()}
//                                             </td>
//                                             <td className="py-3 text-right text-emerald-600 font-bold text-sm tabular-nums">
//                                                 ৳{num(item.discount_amount).toLocaleString()}
//                                             </td>
//                                             <td className="py-3 text-right text-blue-700 font-bold text-sm tabular-nums pr-2">
//                                                 ৳{num(item.net_total).toLocaleString()}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//
//                         {/* Financial Summary & Payment Breakdown inside Table Container */}
//                         <div className="mt-8 pt-6 border-t border-gray-100 grid md:grid-cols-12 gap-6 items-start">
//                             {/* Payment Breakdown Cards */}
//                             <div className="md:col-span-7 space-y-3">
//                                 <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 space-y-3">
//                                     <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
//                                         <FaWallet className="text-blue-600" /> Payment Breakdown
//                                     </h3>
//
//                                     <div className="grid sm:grid-cols-2 gap-2 text-xs">
//                                         <div className="bg-white p-3 rounded-xl border border-gray-100">
//                                             <span className="text-gray-400 font-medium block text-[10px] uppercase">Net Paid</span>
//                                             <span className="font-bold text-emerald-600 text-base">
//                                                 ৳{paidAmount.toLocaleString()}
//                                             </span>
//                                             <p className="text-[10px] text-gray-400 mt-0.5 truncate">
//                                                 Cash: ৳{purchase?.paid_cash || 0} | Mobile: ৳{purchase?.paid_mobile || 0} | Bank: ৳{purchase?.paid_bank || 0}
//                                             </p>
//                                         </div>
//
//                                         <div className="bg-white p-3 rounded-xl border border-gray-100">
//                                             <span className="text-gray-400 font-medium block text-[10px] uppercase">Invoice Due</span>
//                                             <span className={`font-bold text-base ${originalInvoiceDue > 0 ? "text-rose-600" : "text-gray-700"}`}>
//                                                 ৳{originalInvoiceDue.toLocaleString()}
//                                             </span>
//                                             <p className="text-[10px] text-gray-400 mt-0.5">
//                                                 {originalInvoiceDue > 0 ? "Awaiting settlement" : "Fully settled"}
//                                             </p>
//                                         </div>
//
//                                         <div className="bg-white p-3 rounded-xl border border-gray-100 sm:col-span-2">
//                                             <span className="text-gray-400 font-medium block text-[10px] uppercase">Total Supplier Balance</span>
//                                             <span className={`font-bold text-base ${totalSupplierDue > 0 ? "text-rose-600" : "text-gray-700"}`}>
//                                                 ৳{totalSupplierDue.toLocaleString()}
//                                             </span>
//                                             <p className="text-[10px] text-gray-400 mt-0.5">
//                                                 Previous Invoices Due: ৳{otherInvoicesDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {/* Right Invoice Calculations */}
//                             <div className="md:col-span-5 space-y-2.5 text-xs md:pl-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
//                                 <div className="flex justify-between items-center text-gray-600">
//                                     <span>Gross Total:</span>
//                                     <span className="font-bold text-gray-800">৳{grossTotal.toLocaleString()}</span>
//                                 </div>
//
//                                 {itemDiscount > 0 && (
//                                     <div className="flex justify-between items-center text-emerald-600">
//                                         <span>Item Discount:</span>
//                                         <span className="font-bold">- ৳{itemDiscount.toLocaleString()}</span>
//                                     </div>
//                                 )}
//
//                                 <div className="flex justify-between items-center text-gray-600 pt-1 border-t border-gray-100">
//                                     <span>Subtotal:</span>
//                                     <span className="font-bold text-gray-800">৳{subTotal.toLocaleString()}</span>
//                                 </div>
//
//                                 {globalDiscount > 0 && (
//                                     <div className="flex justify-between items-center text-emerald-600">
//                                         <span>Global Discount:</span>
//                                         <span className="font-bold">- ৳{globalDiscount.toLocaleString()}</span>
//                                     </div>
//                                 )}
//
//                                 <div className="flex justify-between items-center pt-2 border-t-2 border-gray-900 text-gray-900 font-bold text-sm">
//                                     <span className="uppercase text-[11px]">NET PAYABLE:</span>
//                                     <span className="text-base">৳{netTotal.toLocaleString()}</span>
//                                 </div>
//
//                                 <div className="flex justify-between items-center text-emerald-600 font-bold">
//                                     <span>Total Paid:</span>
//                                     <span>৳{paidAmount.toLocaleString()}</span>
//                                 </div>
//
//                                 <div className="flex justify-between items-center text-rose-600 font-bold pt-1 border-t border-dashed border-gray-200">
//                                     <span>Due Amount:</span>
//                                     <span>৳{originalInvoiceDue.toLocaleString()}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* -------------------- Audit Log Top Right (1 Column) -------------------- */}
//                 <div className="space-y-6 sm:space-y-8">
//                     <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden h-full flex flex-col justify-between">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
//                         <div>
//                             <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
//                                 <FaShieldAlt className="text-blue-400 text-base"/> Audit Log
//                             </h2>
//
//                             <div className="space-y-5">
//                                 <div className="flex items-start gap-3.5">
//                                     <div className="w-1 h-10 bg-blue-500 rounded-full mt-0.5 shrink-0"></div>
//                                     <div className="min-w-0">
//                                         <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Payment Status</p>
//                                         <p className="text-sm font-bold text-blue-400 uppercase tracking-wide">
//                                             {purchase?.payment_status || 'UNPAID'}
//                                         </p>
//                                     </div>
//                                 </div>
//
//                                 <div className="flex items-start gap-3.5">
//                                     <div className="w-1 h-10 bg-emerald-500 rounded-full mt-0.5 shrink-0"></div>
//                                     <div className="min-w-0">
//                                         <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Payment Method</p>
//                                         <p className="text-sm font-bold text-slate-100 uppercase">
//                                             {purchase?.payment_method?.replace('_', ' ') || 'CASH'}
//                                         </p>
//                                     </div>
//                                 </div>
//
//                                 <div className="flex items-start gap-3.5">
//                                     <div className="w-1 h-10 bg-indigo-500 rounded-full mt-0.5 shrink-0"></div>
//                                     <div className="min-w-0">
//                                         <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Created At</p>
//                                         <p className="text-sm font-bold text-slate-100">
//                                             {purchase?.created_at ? new Date(purchase.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
//                             Status: <span className="text-emerald-400 font-bold">Verified & Recorded</span>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* -------------------- FULL ROW (3 Columns Width): Invoice Notes & History -------------------- */}
//                 <div className="lg:col-span-3">
//                     <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100">
//                         <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
//                             <h2 className="font-bold text-base sm:text-lg text-gray-900 tracking-tight flex items-center gap-2.5">
//                                 <FaStickyNote className="text-amber-500 text-lg"/>
//                                 Invoice Activity & Note History
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
//                                 No additional remarks or log notes provided for this invoice.
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//             </div>
//
//             {/* Modals */}
//             {editOpen && (
//                 <EditPurchaseModal
//                     open={editOpen}
//                     onClose={() => setEditOpen(false)}
//                     purchase={purchase}
//                     onUpdated={handleEditSuccess}
//                 />
//             )}
//
//             {returnOpen && (
//                 <PurchaseReturnModal
//                     isOpen={returnOpen}
//                     onClose={() => setReturnOpen(false)}
//                     purchase={purchase}
//                     onSuccess={handleReturnSuccess}
//                 />
//             )}
//
//             {showSuccessModal && (
//                 <SuccessModal
//                     isOpen={showSuccessModal}
//                     onClose={() => setShowSuccessModal(false)}
//                     title="Purchase Updated Successfully"
//                     subtitle={`Invoice #${updatedPurchaseData?.invoice_no} Updated`}
//                     details={[
//                         {
//                             label: "Net Amount",
//                             value: `৳${parseFloat(updatedPurchaseData?.net_total || updatedPurchaseData?.netTotal || 0).toLocaleString()}`
//                         },
//                         {
//                             label: "Amount Paid",
//                             value: `৳${parseFloat(updatedPurchaseData?.paid_amount || 0).toLocaleString()}`
//                         },
//                         {
//                             label: "Current Due",
//                             value: `৳${parseFloat(updatedPurchaseData?.due_amount || 0).toLocaleString()}`
//                         },
//                         {
//                             label: "Total Combined Due",
//                             value: `৳${(Number(otherInvoicesDue) + Number(updatedPurchaseData?.due_amount || 0)).toLocaleString()}`
//                         }
//                     ]}
//                     onPrint={() => handlePrint()}
//                     printText="Print Slip"
//                 />
//             )}
//
//             {returnSuccessData && (
//                 <PurchaseReturnSuccessModal
//                     isOpen={!!returnSuccessData}
//                     onClose={() => setReturnSuccessData(null)}
//                     purchase={returnSuccessData}
//                     title="Purchase Return Successful!"
//                     successMessage="The purchase return has been processed."
//                 />
//             )}
//         </GenericModuleDetails>
//     );
// };
//
// export default PurchaseDetailsPage;


//////////////////////////////////////////////////////////////////////

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaWarehouse, FaInfoCircle, FaFilePdf, FaUndo,
    FaCalendarAlt, FaWallet, FaClock, FaStickyNote
} from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import api from '../../../context_or_provider/pos/posApi';

import EditPurchaseModal from "./EditPurchaseModal";
import PurchaseReturnModal from "./PurchaseReturnModal";
import PurchaseReturnSuccessModal from "./PurchaseReturnSuccessModal";
import { downloadPurchasePDF } from "./usePurchasePDF";
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getPurchasePrintLayout } from "./PurchasePrintLayout";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import SuccessModal from "../../components/SuccessModal";
import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
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

const PurchaseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [updatedPurchaseData, setUpdatedPurchaseData] = useState(null);
    const [returnSuccessData, setReturnSuccessData] = useState(null);

    const fetchPurchaseDetails = useCallback(async () => {
        try {
            const res = await api.get(`/api/purchase/purchases/${id}/`);
            setPurchase(res.data);
        } catch (error) {
            console.error("Error fetching purchase details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPurchaseDetails();
    }, [fetchPurchaseDetails]);

    const handleEditSuccess = (updatedData) => {
        setPurchase(updatedData);
        setUpdatedPurchaseData(updatedData);
        setEditOpen(false);
        setShowSuccessModal(true);
    };

    const handleReturnSuccess = (returnData) => {
        setReturnOpen(false);
        setReturnSuccessData(returnData);
        fetchPurchaseDetails();
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete Invoice #${purchase?.invoice_no}?`)) return;
        try {
            await posPurchaseProductAPI.delete(id);
            alert("Purchase deleted successfully!");
            navigate("/purchase");
        } catch (error) {
            console.error(error);
            alert("Failed to delete the purchase.");
        }
    };

    const handlePrint = () => {
        if (!purchase) return;
        const tableContent = getPurchasePrintLayout(purchase);
        const fullHTML = getBrandedVoucher("Purchase Invoice", tableContent, purchase.invoice_no, "#1d4ed8");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    /* ---------- Derived Financial Values ---------- */
    const num = (v) => parseFloat(v) || 0;

    const originalInvoiceDue = num(purchase?.due_amount);
    const otherInvoicesDue = num(purchase?.supplier_due_amount) - originalInvoiceDue;
    const totalSupplierDue = otherInvoicesDue + originalInvoiceDue;

    const grossTotal = num(purchase?.total_amount);
    const itemDiscount = num(purchase?.itemwise_total_discount);
    const globalDiscount = num(purchase?.global_discount);
    const subTotal = num(purchase?.subtotal);
    const netTotal = num(purchase?.net_total);
    const paidAmount = num(purchase?.paid_amount);

    const parsedNotes = parseNoteLogs(purchase?.notes);

    return (
        <GenericModuleDetails
            title="Purchase Invoice"
            subtitle={`#${purchase?.invoice_no}`}
            image={purchase?.supplier_image}
            imageAlt={purchase?.supplier_name}
            imageFallback="https://via.placeholder.com/150"
            recordId={purchase?.invoice_no}
            amount={num(purchase?.net_total).toLocaleString()}
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
                    label: "Purchase Date",
                    value: purchase?.created_at
                        ? new Date(purchase.created_at).toLocaleDateString()
                        : "—"
                },
                { icon: <FaWarehouse />, label: "Supplier", value: purchase?.supplier_name || "N/A" }
            ]}
            actions={[
                {
                    icon: <FaFilePdf size={16} />,
                    label: "Download PDF",
                    onClick: () => downloadPurchasePDF(purchase),
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
                    PURCHASE ITEMS TABLE + COMPACT SUMMARY & INFO
                ============================================================ */}
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <h2 className="font-black text-xl md:text-2xl uppercase tracking-tighter flex items-center gap-4">
                            <div className="w-2 h-8 md:h-10 bg-gray-900 rounded-full shadow-lg shadow-gray-900/20"></div>
                            Purchase Items
                        </h2>
                        <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            {purchase?.items?.length || 0} Items
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
                                {purchase?.items?.map((item) => (
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
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        {item.batch_no && (
                                                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                                                Batch: {item.batch_no}
                                                            </span>
                                                        )}
                                                        {item.expiry_status === "near_expiry" && (
                                                            <span className="text-[9px] font-black text-rose-600 uppercase tracking-tighter bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                                                                Near Expiry
                                                            </span>
                                                        )}
                                                    </div>
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
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Net Paid</span>
                                        <span className="font-black text-emerald-600 text-base tabular-nums">
                                            ৳{paidAmount.toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                            Cash: ৳{purchase?.paid_cash || 0} | Mobile: ৳{purchase?.paid_mobile || 0} | Bank: ৳{purchase?.paid_bank || 0}
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
                                        <span className="text-gray-400 font-medium block text-[10px] uppercase tracking-wider">Total Supplier Balance</span>
                                        <span className={`font-black text-base tabular-nums ${totalSupplierDue > 0 ? "text-rose-600" : "text-gray-700"}`}>
                                            ৳{totalSupplierDue.toLocaleString()}
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
                                        <span className="font-bold uppercase text-blue-400">{purchase?.payment_method?.replace('_', ' ') || 'CASH'}</span>
                                    </div>

                                    <div className="h-6 w-px bg-gray-800"></div>

                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Status</span>
                                        <span className="font-bold uppercase text-emerald-400">{purchase?.payment_status || 'UNPAID'}</span>
                                    </div>

                                    {purchase?.payment_proof && (
                                        <>
                                            <div className="h-6 w-px bg-gray-800"></div>
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Proof</span>
                                                <a href={buildImageUrl(purchase.payment_proof)} target="_blank" rel="noreferrer" className="text-xs text-blue-300 underline font-semibold">View</a>
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
                    INVOICE NOTE & ACTIVITY HISTORY (Beautiful log style)
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
                            No additional remarks or logs provided for this purchase.
                        </div>
                    )}
                </div>

            </div>

            {/* Modals */}
            {editOpen && (
                <EditPurchaseModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    purchase={purchase}
                    onUpdated={handleEditSuccess}
                />
            )}

            {returnOpen && (
                <PurchaseReturnModal
                    isOpen={returnOpen}
                    onClose={() => setReturnOpen(false)}
                    purchase={purchase}
                    onSuccess={handleReturnSuccess}
                />
            )}

            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title="Purchase Updated Successfully"
                    subtitle={`Invoice #${updatedPurchaseData?.invoice_no} Updated`}
                    details={[
                        { label: "Net Amount", value: `৳${parseFloat(updatedPurchaseData?.net_total || updatedPurchaseData?.netTotal || 0).toLocaleString()}` },
                        { label: "Amount Paid", value: `৳${parseFloat(updatedPurchaseData?.paid_amount || 0).toLocaleString()}` },
                        { label: "Current Due", value: `৳${parseFloat(updatedPurchaseData?.due_amount || 0).toLocaleString()}` },
                        { label: "Total Combined Due", value: `৳${(Number(otherInvoicesDue) + Number(updatedPurchaseData?.due_amount || 0)).toLocaleString()}` }
                    ]}
                    onPrint={() => handlePrint()}
                    printText="Print Slip"
                />
            )}

            {returnSuccessData && (
                <PurchaseReturnSuccessModal
                    isOpen={!!returnSuccessData}
                    onClose={() => setReturnSuccessData(null)}
                    purchase={returnSuccessData}
                    title="Purchase Return Successful!"
                    successMessage="The purchase return has been processed."
                />
            )}
        </GenericModuleDetails>
    );
};

export default PurchaseDetailsPage;