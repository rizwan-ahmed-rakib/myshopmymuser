import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    FaBoxOpen, FaDollarSign, FaShoppingCart, FaWarehouse,
    FaInfoCircle, FaFilePdf, FaEdit, FaUndo, FaTag,
    FaPrint, FaCalendarAlt, FaBarcode, FaImage, FaWallet, FaReceipt
} from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import api from '../../../context_or_provider/pos/posApi';

import EditPurchaseModal from "./EditPurchaseModal";
import PurchaseReturnModal from "./PurchaseReturnModal";
import PurchaseReturnSuccessModal from "./PurchaseReturnSuccessModal";
import {downloadPurchasePDF} from "./usePurchasePDF";
import {getBrandedVoucher} from "../../utils/printTemplates";
import {getPurchasePrintLayout} from "./PurchasePrintLayout";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import SuccessModal from "../../components/SuccessModal";
import { posPurchaseProductAPI } from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import BASE_URL_of_POS from "../../../posConfig";

/**
 * PurchaseDetailsPage - Refactored to use GenericModuleDetails and DetailsInfoCard.
 * Integrated with the standardized Backbone printing and PDF engine.
 */
const PurchaseDetailsPage = () => {
    const {id} = useParams();
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

    const originalInvoiceDue = parseFloat(purchase?.due_amount) || 0;
    const otherInvoicesDue = (parseFloat(purchase?.supplier_due_amount) || 0) - originalInvoiceDue;
    const totalSupplierDue = otherInvoicesDue + originalInvoiceDue;

    return (
        <GenericModuleDetails
            title="Purchase Invoice"
            subtitle={`#${purchase?.invoice_no}`}
            image={purchase?.supplier_image}
            imageAlt={purchase?.supplier_name}
            imageFallback="https://via.placeholder.com/150"
            recordId={purchase?.invoice_no}
            amount={parseFloat(purchase?.net_total || 0).toLocaleString()}
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
                    value: new Date(purchase?.created_at).toLocaleDateString()
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
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Summary */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        <DetailsInfoCard variant="simple" title="Gross Total"
                                         value={`৳${parseFloat(purchase?.total_amount || 0).toLocaleString()}`}
                                         icon={<FaShoppingCart />} color="blue"/>
                        <DetailsInfoCard variant="simple" title="Total Discount (-)"
                                         value={`৳${parseFloat(purchase?.total_discount || 0).toLocaleString()}`}
                                         icon={<FaTag />} color="emerald"/>
                        <DetailsInfoCard variant="simple" title="Subtotal"
                                         value={`৳${parseFloat(purchase?.subtotal || 0).toLocaleString()}`}
                                         icon={<FaReceipt />} color="indigo"/>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20"></div>
                            Payment Breakdown
                        </h2>

                        <div className="grid gap-4">
                            <DetailsInfoCard 
                                icon={<FaWallet />} 
                                title="Net Paid Amount"
                                value={`৳${parseFloat(purchase?.paid_amount || 0).toLocaleString()}`}
                                subValue={`Cash: ৳${purchase?.paid_cash || 0} | Mobile: ৳${purchase?.paid_mobile || 0} | Bank: ৳${purchase?.paid_bank || 0}`}
                                color="emerald"
                            />
                            <DetailsInfoCard 
                                icon={<FaInfoCircle />} 
                                title="Invoice Due"
                                value={`৳${parseFloat(purchase?.due_amount || 0).toLocaleString()}`}
                                subValue={parseFloat(purchase?.due_amount) > 0 ? "Awaiting settlement" : "Fully settled"}
                                color={parseFloat(purchase?.due_amount) > 0 ? "rose" : "emerald"}
                            />
                            <DetailsInfoCard 
                                icon={<FaDollarSign />} 
                                title="Total Supplier Balance"
                                value={`৳${totalSupplierDue.toLocaleString()}`}
                                subValue={`Previous Due: ৳${otherInvoicesDue.toFixed(2)}`}
                                color="blue"
                            />
                        </div>
                    </div>

                    {/* Purchase Items Table */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-8">
                            <div className="w-2 h-10 bg-gray-900 rounded-full shadow-lg shadow-gray-900/20"></div>
                            Purchase Items
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-100">
                                        <th className="pb-4">Product</th>
                                        <th className="pb-4 text-center">Qty</th>
                                        <th className="pb-4 text-right">Unit Price</th>
                                        <th className="pb-4 text-right">Discount</th>
                                        <th className="pb-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {purchase?.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="py-4">
                                                <p className="font-bold text-gray-800 text-sm">{item.product_name}</p>
                                                {item.batch_no && <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Batch: {item.batch_no}</span>}
                                            </td>
                                            <td className="py-4 text-center font-bold text-gray-600 text-sm">{item.quantity}</td>
                                            <td className="py-4 text-right text-gray-600 text-sm">৳{parseFloat(item.unit_price).toLocaleString()}</td>
                                            <td className="py-4 text-right text-emerald-600 font-bold text-sm">৳{parseFloat(item.discount_amount || 0).toLocaleString()}</td>
                                            <td className="py-4 text-right text-blue-700 font-black text-sm">৳{parseFloat(item.net_total).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Note Section */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <FaInfoCircle className="text-amber-400 text-lg"/> Invoice Note
                        </h2>
                        <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-50/50 shadow-inner">
                            <p className="text-sm font-bold text-gray-600 italic leading-relaxed">
                                {purchase?.note || "No additional remarks provided for this purchase."}
                            </p>
                        </div>
                    </div>

                    {/* Meta Info Card */}
                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">System Info</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Payment Method</p>
                                    <p className="text-base font-black uppercase tracking-widest">{purchase?.payment_method?.replace('_', ' ')}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Payment Status</p>
                                    <p className="text-base font-black uppercase tracking-widest">{purchase?.payment_status}</p>
                                </div>
                            </div>
                        </div>
                            {purchase?.payment_proof && (
                                <div className="flex gap-5">
                                    <div className="w-1.5 h-14 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">Payment Proof</p>
                                        <a
                                            href={purchase.payment_proof.startsWith('http') ? purchase.payment_proof : `${BASE_URL_of_POS}${purchase.payment_proof}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-black uppercase text-blue-400 underline hover:text-blue-300 block"
                                        >
                                            View Attachment
                                        </a>
                                    </div>
                                </div>
                            )}
                        <div className="mt-10 flex items-center gap-3 text-[10px] font-black text-green-400 uppercase tracking-[0.2em] border-2 border-green-400/20 bg-green-400/5 p-5 rounded-2xl justify-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                            Verified Transaction
                        </div>
                    </div>
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