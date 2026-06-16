import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    FaUndo, FaUser, FaDollarSign, FaMoneyBillWave, 
    FaMobileAlt, FaUniversity, FaFilePdf, FaEdit, 
    FaInfoCircle, FaCalendarAlt, FaHashtag, FaStickyNote,
    FaArrowLeft, FaPrint, FaRegCalendarAlt, FaCheckCircle,
    FaWallet
} from "react-icons/fa";
import { posDueCollectionAPI } from "../../../context_or_provider/pos/Sale/dueCollection/dueCollectionAPI";
import EditCustomerDueCollectionModal from "./EditCustomerDueCollectionModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getDueCollectionPrintLayout } from "./DueCollectionPrintLayout";

/**
 * CustomerDueCollectionDetails - Refactored to use GenericModuleDetails and DetailsInfoCard.
 * Integrated with the standardized Backbone printing engine.
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

    const handlePrint = () => {
        if (!item) return;
        const tableContent = getDueCollectionPrintLayout(item);
        const fullHTML = getBrandedVoucher("Collection Voucher", tableContent, item.invoice_no, "#10b981");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    return (
        <GenericModuleDetails
            title="Due Collection Voucher"
            subtitle={`#${item?.invoice_no}`}
            image={null}
            imageAlt={item?.customer_name}
            imageFallback="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"
            recordId={item?.invoice_no}
            amount={parseFloat(item?.amount || 0).toLocaleString()}
            amountLabel="Total Amount Received"
            isLoading={loading}
            onPrint={handlePrint}
            onEdit={() => setEditOpen(true)}
            printText="Print Receipt"
            editText="Edit Record"
            accentColor="emerald"
            infoItems={[
                {
                    icon: <FaCalendarAlt />,
                    label: "Collection Date",
                    value: new Date(item?.created_at).toLocaleDateString()
                },
                { icon: <FaUser />, label: "Customer", value: item?.customer_name || "N/A" }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info Cards */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <DetailsInfoCard variant="simple" title="Linked Sale"
                                         value={item?.sale_invoice_no ? `#${item.sale_invoice_no}` : "General Collection"}
                                         icon={<FaHashtag />} color="blue"/>
                        <DetailsInfoCard variant="simple" title="Status"
                                         value="Verified & Received"
                                         icon={<FaCheckCircle />} color="emerald"/>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-emerald-600 rounded-full shadow-lg shadow-emerald-500/20"></div>
                            Payment Breakdown
                        </h2>

                        <div className="grid gap-4">
                            {Number(item?.paid_cash) > 0 && (
                                <DetailsInfoCard 
                                    icon={<FaMoneyBillWave />} 
                                    title="Cash Collection"
                                    value={`৳${parseFloat(item.paid_cash).toLocaleString()}`}
                                    color="emerald"
                                />
                            )}
                            {Number(item?.paid_mobile) > 0 && (
                                <DetailsInfoCard 
                                    icon={<FaMobileAlt />} 
                                    title={`Mobile Banking (${item.mobile_operator})`}
                                    value={`৳${parseFloat(item.paid_mobile).toLocaleString()}`}
                                    subValue={`TxID: ${item.transaction_id || 'N/A'}`}
                                    color="purple"
                                />
                            )}
                            {Number(item?.paid_bank) > 0 && (
                                <DetailsInfoCard 
                                    icon={<FaUniversity />} 
                                    title={`Bank Transfer (${item.bank_name})`}
                                    value={`৳${parseFloat(item.paid_bank).toLocaleString()}`}
                                    color="indigo"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Remarks Section */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <FaStickyNote className="text-amber-400 text-lg"/> Remarks
                        </h2>
                        <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-50/50 shadow-inner">
                            <p className="text-sm font-bold text-gray-600 italic leading-relaxed">
                                {item?.note || "No additional remarks provided for this transaction."}
                            </p>
                        </div>
                    </div>

                    {/* Audit Log Card */}
                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">Audit Log</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Processed By</p>
                                    <p className="text-base font-black uppercase tracking-widest">{item?.created_by_name || 'System'}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Timestamp</p>
                                    <p className="text-base font-black uppercase tracking-widest">{new Date(item?.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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