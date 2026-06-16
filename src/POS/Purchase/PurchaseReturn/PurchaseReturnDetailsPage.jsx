import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    FaBoxOpen, FaDollarSign, FaUndo, FaEdit, FaFilePdf, FaInfoCircle,
    FaShoppingCart, FaUser, FaMoneyBillWave, FaMobileAlt, FaUniversity,
    FaExclamationTriangle, FaTruck, FaCalendarAlt, FaReceipt, FaWallet
} from "react-icons/fa";
import api from '../../../context_or_provider/pos/posApi';

import EditPurchaseReturnModal from "./EditPurchaseReturnModal";
import SuccessModal from "./SuccessModal";
import {downloadPurchaseReturnPDF} from "./usePurchasePDF";
import {getBrandedVoucher} from "../../utils/printTemplates";
import {getPurchaseReturnPrintLayout} from "./PurchaseReturnPrintLayout";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";

/**
 * PurchaseReturnDetailsPage - Refactored to use GenericModuleDetails and DetailsInfoCard.
 * Integrated with the standardized Backbone printing and PDF engine.
 */
const PurchaseReturnDetailsPage = () => {
    const {id} = useParams();
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

    const handlePrint = () => {
        if (!purchaseReturn) return;
        const tableContent = getPurchaseReturnPrintLayout(purchaseReturn);
        const fullHTML = getBrandedVoucher("Purchase Return", tableContent, purchaseReturn.id, "#dc2626");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    return (
        <GenericModuleDetails
            title="Purchase Return"
            subtitle={`Original Inv: #${purchaseReturn?.purchase_invoice_no}`}
            image={purchaseReturn?.supplier_image}
            imageAlt={purchaseReturn?.supplier_name}
            imageFallback="https://via.placeholder.com/150"
            recordId={purchaseReturn?.id}
            amount={parseFloat(purchaseReturn?.net_return_amount || 0).toLocaleString()}
            amountLabel="Net Refund Amount"
            isLoading={loading}
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            printText="Print Return"
            editText="Edit Return"
            accentColor="rose"
            infoItems={[
                {
                    icon: <FaCalendarAlt />,
                    label: "Return Date",
                    value: new Date(purchaseReturn?.created_at).toLocaleDateString()
                },
                { icon: <FaTruck />, label: "Supplier", value: purchaseReturn?.supplier_name || "N/A" }
            ]}
            actions={[
                {
                    icon: <FaFilePdf size={16} />,
                    label: "Download PDF",
                    onClick: () => downloadPurchaseReturnPDF(purchaseReturn),
                    hoverColor: "hover:bg-orange-600 hover:text-white"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Summary */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        <DetailsInfoCard variant="simple" title="Gross Return"
                                         value={`৳${parseFloat(purchaseReturn?.total_return_amount || 0).toLocaleString()}`}
                                         icon={<FaShoppingCart />} color="blue"/>
                        <DetailsInfoCard variant="simple" title="Total Penalties"
                                         value={`৳${(parseFloat(purchaseReturn?.total_item_penalty || 0) + parseFloat(purchaseReturn?.global_penalty || 0)).toLocaleString()}`}
                                         icon={<FaExclamationTriangle />} color="rose"/>
                        <DetailsInfoCard variant="simple" title="Net Refund"
                                         value={`৳${parseFloat(purchaseReturn?.net_return_amount || 0).toLocaleString()}`}
                                         icon={<FaReceipt />} color="emerald"/>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-rose-600 rounded-full shadow-lg shadow-rose-500/20"></div>
                            Refund Breakdown
                        </h2>

                        <div className="grid gap-4">
                            <DetailsInfoCard 
                                icon={<FaWallet />} 
                                title="Received Amount"
                                value={`৳${parseFloat(purchaseReturn?.paid_amount || 0).toLocaleString()}`}
                                subValue={`Cash: ৳${purchaseReturn?.paid_cash || 0} | Mobile: ৳${purchaseReturn?.paid_mobile || 0} | Bank: ৳${purchaseReturn?.paid_bank || 0}`}
                                color="emerald"
                            />
                            <DetailsInfoCard 
                                icon={<FaInfoCircle />} 
                                title="Pending Refund"
                                value={`৳${parseFloat(purchaseReturn?.due_amount || 0).toLocaleString()}`}
                                subValue={parseFloat(purchaseReturn?.due_amount) > 0 ? "Awaiting supplier refund" : "Fully settled"}
                                color={parseFloat(purchaseReturn?.due_amount) > 0 ? "rose" : "emerald"}
                            />
                        </div>
                    </div>

                    {/* Return Items Table */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-8">
                            <div className="w-2 h-10 bg-gray-900 rounded-full shadow-lg shadow-gray-900/20"></div>
                            Returned Items
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-100">
                                        <th className="pb-4">Product</th>
                                        <th className="pb-4 text-center">Return Qty</th>
                                        <th className="pb-4 text-right">Unit Price</th>
                                        <th className="pb-4 text-right">Penalty</th>
                                        <th className="pb-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {purchaseReturn?.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                                            <td className="py-4">
                                                <p className="font-bold text-gray-800 text-sm">{item.product_name}</p>
                                                {item.reason && <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Reason: {item.reason}</span>}
                                            </td>
                                            <td className="py-4 text-center font-bold text-gray-600 text-sm">{item.purchase_return_quantity}</td>
                                            <td className="py-4 text-right text-gray-600 text-sm">৳{parseFloat(item.unit_price).toLocaleString()}</td>
                                            <td className="py-4 text-right text-rose-600 font-bold text-sm">৳{parseFloat(item.penalty_amount || 0).toLocaleString()}</td>
                                            <td className="py-4 text-right text-gray-900 font-black text-sm">৳{parseFloat(item.total_price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Reason Section */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <FaInfoCircle className="text-amber-400 text-lg"/> Return Reason
                        </h2>
                        <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-50/50 shadow-inner">
                            <p className="text-sm font-bold text-gray-600 italic leading-relaxed">
                                {purchaseReturn?.return_reason || "No specific reason provided."}
                            </p>
                        </div>
                    </div>

                    {/* Meta Card */}
                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Return Meta</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest mb-1">Payment Status</p>
                                    <p className="text-base font-black uppercase tracking-widest">{purchaseReturn?.payment_status?.toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    purchase={updatedData}
                    title="Purchase Return Updated"
                    successMessage="Purchase return updated successfully."
                />
            )}
        </GenericModuleDetails>
    );
};

export default PurchaseReturnDetailsPage;