import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    FaBoxOpen, FaDollarSign, FaShoppingCart, FaWarehouse,
    FaInfoCircle, FaFilePdf, FaEdit, FaUndo, FaTag,
    FaPrint, FaCalendarAlt, FaBarcode, FaUser, FaWallet, FaReceipt
} from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import api from '../../../context_or_provider/pos/posApi';

import EditSaleModal from "./EditSaleModal";
import SaleReturnModal from "./SaleReturnModal";
import SaleReturnSuccessModal from "./SaleReturnSuccessModal";
import {downloadSalePDF} from "./usePurchasePDF";
import { usePrintManager } from "../../utils/usePrintManager";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
// import SuccessModal from "./SuccessModal";
import { posSaleProductAPI } from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import SuccessModal from "../../components/SuccessModal";
import BASE_URL_of_POS from "../../../posConfig";

/**
 * SaleDetailsPage - Refactored to use GenericModuleDetails and DetailsInfoCard.
 * Integrated with the standardized Backbone printing and PDF engine.
 */
const SaleDetailsPage = () => {
    const {id} = useParams();
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

    const originalInvoiceDue = parseFloat(sale?.due_amount) || 0;
    const otherInvoicesDue = (parseFloat(sale?.customer_due_amount) || 0) - originalInvoiceDue;
    const totalCustomerDue = otherInvoicesDue + originalInvoiceDue;

    const successNetTotal = parseFloat(updatedSaleData?.net_total || updatedSaleData?.netTotal || 0);
    const successPaidAmount = parseFloat(updatedSaleData?.paid_amount || 0);
    const successCurrentInvoiceDue = parseFloat(updatedSaleData?.due_amount || 0);
    const successTotalCustomerDue = Number(otherInvoicesDue) + Number(successCurrentInvoiceDue);

    return (
        <GenericModuleDetails
            title="Sale Invoice"
            subtitle={`#${sale?.invoice_no}`}
            image={sale?.customer_image}
            imageAlt={sale?.customer_name}
            imageFallback="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"
            recordId={sale?.invoice_no}
            amount={parseFloat(sale?.net_total || sale?.netTotal || 0).toLocaleString()}
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
                    value: new Date(sale?.created_at).toLocaleDateString()
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
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Summary */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        <DetailsInfoCard variant="simple" title="Gross Total"
                                         value={`৳${parseFloat(sale?.total_amount || 0).toLocaleString()}`}
                                         icon={<FaShoppingCart />} color="blue"/>
                        <DetailsInfoCard variant="simple" title="Total Discount (-)"
                                         value={`৳${parseFloat(sale?.total_discount || sale?.totalDiscount || 0).toLocaleString()}`}
                                         icon={<FaTag />} color="emerald"/>
                        <DetailsInfoCard variant="simple" title="Subtotal"
                                         value={`৳${parseFloat(sale?.subtotal || 0).toLocaleString()}`}
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
                                title="Net Received Amount"
                                value={`৳${parseFloat(sale?.paid_amount || 0).toLocaleString()}`}
                                subValue={`Cash: ৳${sale?.paid_cash || 0} | Mobile: ৳${sale?.paid_mobile || 0} | Bank: ৳${sale?.paid_bank || 0}`}
                                color="emerald"
                            />
                            <DetailsInfoCard 
                                icon={<FaInfoCircle />} 
                                title="Invoice Due"
                                value={`৳${parseFloat(sale?.due_amount || 0).toLocaleString()}`}
                                subValue={parseFloat(sale?.due_amount) > 0 ? "Awaiting settlement" : "Fully settled"}
                                color={parseFloat(sale?.due_amount) > 0 ? "rose" : "emerald"}
                            />
                            <DetailsInfoCard 
                                icon={<FaDollarSign />} 
                                title="Customer Total Balance"
                                value={`৳${totalCustomerDue.toLocaleString()}`}
                                subValue={`Other Due: ৳${otherInvoicesDue.toFixed(2)}`}
                                color="blue"
                            />
                        </div>
                    </div>

                    {/* Sale Items Table */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-8">
                            <div className="w-2 h-10 bg-gray-900 rounded-full shadow-lg shadow-gray-900/20"></div>
                            Sale Items
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
                                    {sale?.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="py-4">
                                                <p className="font-bold text-gray-800 text-sm">{item.product_name}</p>
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
                                {sale?.note || "Thank you for shopping with MY SHOP POS."}
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
                                    <p className="text-base font-black uppercase tracking-widest">{sale?.payment_method?.replace('_', ' ')}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Payment Status</p>
                                    <p className="text-base font-black uppercase tracking-widest">{sale?.payment_status}</p>
                                </div>
                            </div>
                            {sale?.payment_proof && (
                                <div className="flex gap-5">
                                    <div className="w-1.5 h-14 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">Payment Proof</p>
                                        <a
                                            href={sale.payment_proof.startsWith('http') ? sale.payment_proof : `${BASE_URL_of_POS}${sale.payment_proof}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-black uppercase text-blue-400 underline hover:text-blue-300 block"
                                        >
                                            View Attachment
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-10 flex items-center gap-3 text-[10px] font-black text-green-400 uppercase tracking-[0.2em] border-2 border-green-400/20 bg-green-400/5 p-5 rounded-2xl justify-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                            Verified Transaction
                        </div>
                    </div>
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