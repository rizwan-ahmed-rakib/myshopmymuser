import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../../context_or_provider/pos/posApi';

import UpdateDamageStockModal from "./UpdateDamageStockModal";
import { 
    FaBoxOpen, FaDollarSign, FaWarehouse, FaTag, FaInfoCircle, 
    FaCalendarAlt, FaExclamationTriangle, FaUser, FaBuilding, 
    FaClipboardList, FaWallet, FaCheckCircle, FaTrash
} from 'react-icons/fa';
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import SuccessModal from "./SuccessModal";
import { posDamageProductAPI } from "../../../context_or_provider/pos/damageProducts/damage_productAPI";

/**
 * DamageStockDetailsPage - Refactored to use GenericModuleDetails and DetailsInfoCard.
 * Standardized view for damage stock incidents.
 */
const DamageStockDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successType, setSuccessType] = useState("update");

    const fetchDetails = useCallback(async () => {
        try {
            const response = await api.get(`/api/products/damage-stock/${id}/`);
            setRecord(response.data);
        } catch (error) {
            console.error("Error fetching damage details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleUpdateSuccess = (updatedData) => {
        setRecord(updatedData);
        setEditOpen(false);
        setSuccessType("update");
        setShowSuccess(true);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete this damage record?`)) return;
        try {
            await posDamageProductAPI.delete(id);
            alert("Record deleted successfully!");
            navigate("/stock");
        } catch (error) {
            console.error(error);
            alert("Failed to delete record.");
        }
    };

    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
    };

    const netLoss = parseFloat(record?.total_loss || 0) - parseFloat(record?.compensated_amount || 0);

    return (
        <GenericModuleDetails
            title="Damage Incident"
            subtitle={`Ref: #${record?.reference_no}`}
            image={null}
            imageAlt={record?.product_name}
            imageFallback="https://cdn-icons-png.flaticon.com/512/3233/3233491.png"
            recordId={record?.id}
            amount={formatCurrency(record?.total_loss)}
            amountLabel="Total Financial Loss"
            isLoading={loading}
            onEdit={() => setEditOpen(true)}
            editText="Edit Incident"
            accentColor="rose"
            infoItems={[
                {
                    icon: <FaCalendarAlt />,
                    label: "Incident Date",
                    value: new Date(record?.created_at).toLocaleDateString()
                },
                { icon: <FaTag />, label: "Product", value: record?.product_name || "N/A" }
            ]}
            actions={[
                {
                    icon: <FaTrash size={16} />,
                    label: "Delete Record",
                    onClick: handleDelete,
                    hoverColor: "hover:bg-red-600 hover:text-white"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Incident Summary */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        <DetailsInfoCard variant="simple" title="Quantity"
                                         value={`${record?.quantity} pcs`}
                                         icon={<FaClipboardList />} color="blue"/>
                        <DetailsInfoCard variant="simple" title="Unit Cost"
                                         value={`৳${formatCurrency(record?.unit_cost)}`}
                                         icon={<FaDollarSign />} color="emerald"/>
                        <DetailsInfoCard variant="simple" title="Type"
                                         value={record?.damage_type?.replace('_', ' ').toUpperCase()}
                                         icon={<FaExclamationTriangle />} color="rose"/>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-rose-600 rounded-full shadow-lg shadow-rose-500/20"></div>
                            Financial Breakdown
                        </h2>

                        <div className="grid gap-4">
                            <DetailsInfoCard 
                                icon={<FaCheckCircle />} 
                                title="Compensated Amount"
                                value={`৳${formatCurrency(record?.compensated_amount)}`}
                                subValue={record?.is_compensated ? "Settled with stakeholder" : "Awaiting recovery"}
                                color={record?.is_compensated ? "emerald" : "amber"}
                            />
                            <DetailsInfoCard 
                                icon={<FaWallet />} 
                                title="Net Financial Loss"
                                value={`৳${formatCurrency(netLoss)}`}
                                subValue="Final business impact"
                                color="rose"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FaInfoCircle className="text-blue-500" /> Primary Reason
                            </h3>
                            <p className="text-gray-700 font-bold italic leading-relaxed">
                                {record?.reason || "No specific reason recorded."}
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FaInfoCircle className="text-gray-400" /> Stakeholder Info
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase">Customer</p>
                                    <p className="text-sm font-bold text-gray-800">{record?.customer_name || 'Walk-in / N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase">Supplier</p>
                                    <p className="text-sm font-bold text-gray-800">{record?.supplier_name || 'Internal Stock'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Remarks Section */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <FaClipboardList className="text-amber-400 text-lg"/> Internal Notes
                        </h2>
                        <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-50/50 shadow-inner">
                            <p className="text-sm font-bold text-gray-600 italic leading-relaxed">
                                {record?.notes || "No additional remarks provided."}
                            </p>
                        </div>
                    </div>

                    {/* Audit Card */}
                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">System Trace</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest mb-1">Status</p>
                                    <p className="text-base font-black uppercase tracking-widest">{record?.is_compensated ? 'Compensated' : 'Unsettled'}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">SKU Code</p>
                                    <p className="text-base font-black uppercase tracking-widest font-mono">{record?.product_code || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {editOpen && (
                <UpdateDamageStockModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    recordData={record}
                    onSuccess={handleUpdateSuccess}
                />
            )}

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                data={record}
                type={successType}
            />
        </GenericModuleDetails>
    );
};

export default DamageStockDetailsPage;