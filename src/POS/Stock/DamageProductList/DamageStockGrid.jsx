import React, {useState, useEffect, useCallback} from 'react';
import DamageStockCard from "./DamageStockCard";
import DamageStockList from "./DamageStockList";
import AddDamageStockModal from "./AddDamageStockModal";
import UpdateDamageStockModal from "./UpdateDamageStockModal";
import SuccessModal from "./SuccessModal";
import EmptyState from "../../components/EmptyState";
import {usePosDamageProducts} from "../../../context_or_provider/pos/damageProducts/damage_product_provider";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import { AlertTriangle, Package, Activity, Wallet, Calendar, ArrowUpDown, ShieldAlert, CheckCircle } from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import LoadingSpinner from "../../components/LoadingSpinner";

const DamageStockGrid = ({
                              viewType,
                              isAddOpen,
                              setIsAddOpen,
                              onStatsLoaded,
                              searchQuery,
                              filters,
                              setFilterConfig
                          }) => {
    const {setPosDamageProduct} = usePosDamageProducts();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState("create");
    const [editRecord, setEditRecord] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by Product or Ref...",
                filtersConfig: [
                    {
                        key: "damageType", label: "Damage Type", icon: <ShieldAlert className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Types"},
                            {value: "returnable", label: "Returnable"},
                            {value: "non_returnable", label: "Non-Returnable"}
                        ]
                    },
                    {
                        key: "status", label: "Status", icon: <CheckCircle className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Status"},
                            {value: "compensated", label: "Compensated"},
                            {value: "pending", label: "Pending"}
                        ]
                    },
                    {
                        key: "dateRange", label: "Date Range", icon: <Calendar className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Time"},
                            {value: "today", label: "Today"},
                            {value: "week", label: "This Week"},
                            {value: "month", label: "This Month"}
                        ]
                    },
                    {
                        key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5"/>, options: [
                            {value: "date_desc", label: "Newest First"},
                            {value: "date_asc", label: "Oldest First"},
                            {value: "qty_desc", label: "Qty (High-Low)"},
                            {value: "loss_desc", label: "Loss (High-Low)"}
                        ]
                    }
                ],
                advancedConfig: []
            });
        }
    }, [setFilterConfig]);

    // 2. Stats calculation
    const calculateStats = useCallback((data) => {
        const total = data.length;
        const totalQty = data.reduce((acc, r) => acc + (r.quantity || 0), 0);
        const totalLoss = data.reduce((acc, r) => acc + parseFloat(r.total_loss || 0), 0);
        const compensated = data.filter(r => r.is_compensated).length;

        return [
            { title: 'Total Incidents', count: total.toString(), bgColor: 'bg-rose-600', icon: <AlertTriangle size={24}/> },
            { title: 'Damaged Qty', count: totalQty.toString(), bgColor: 'bg-orange-500', icon: <Package size={24}/> },
            { title: 'Financial Loss', count: `৳${totalLoss.toLocaleString()}`, bgColor: 'bg-red-700', icon: <Wallet size={24}/> },
            { title: 'Compensated', count: compensated.toString(), bgColor: 'bg-emerald-600', icon: <CheckCircle size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredRecords,
        rawData: posDamageProduct,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posDamageProductAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['product_name', 'reference_no'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];

            if (f.damageType && f.damageType !== "all") {
                result = result.filter(item => item.damage_type === f.damageType);
            }

            if (f.status && f.status !== "all") {
                result = result.filter(item => f.status === "compensated" ? item.is_compensated : !item.is_compensated);
            }

            if (f.dateRange && f.dateRange !== "all") {
                const today = new Date();
                result = result.filter(item => {
                    const date = new Date(item.created_at);
                    if (f.dateRange === "today") return date.toDateString() === today.toDateString();
                    if (f.dateRange === "week") return date >= new Date(today - 7 * 86400000);
                    if (f.dateRange === "month") return date >= new Date(today - 30 * 86400000);
                    return true;
                });
            }

            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "date_desc") return new Date(b.created_at) - new Date(a.created_at);
                    if (f.sortBy === "date_asc") return new Date(a.created_at) - new Date(b.created_at);
                    if (f.sortBy === "qty_desc") return (b.quantity || 0) - (a.quantity || 0);
                    if (f.sortBy === "loss_desc") return parseFloat(b.total_loss || 0) - parseFloat(a.total_loss || 0);
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (posDamageProduct) setPosDamageProduct(posDamageProduct);
    }, [posDamageProduct, setPosDamageProduct]);

    const handleAddSuccess = (newRecord) => {
        setIsAddOpen(false);
        setSuccessData(newRecord);
        setSuccessType("create");
        refresh();
    };

    const handleEditClick = (record) => {
        setEditRecord(record);
        setIsEditOpen(true);
    };

    const handleUpdateSuccess = (updatedData) => {
        setIsEditOpen(false);
        setEditRecord(null);
        setSuccessData(updatedData);
        setSuccessType("update");
        refresh();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Loading damage stock records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <AlertTriangle size={16} className="text-rose-500"/>
                        {viewType === "grid" ? "Damage Stock Grid" : "Damage Stock Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredRecords.length} OF {posDamageProduct?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredRecords.map(r => (
                            <DamageStockCard key={r.id} record={r} onEdit={() => handleEditClick(r)} onDelete={refresh} />
                        ))}
                    </div>
                ) : (
                    <DamageStockList records={filteredRecords} onEdit={handleEditClick} onUpdate={refresh} />
                )}

                {filteredRecords.length === 0 && (
                    <EmptyState
                        icon={<AlertTriangle size={32}/>}
                        title="No damage records found"
                        description="There are no damage stock records to display at this time."
                        actionText="Record New Damage"
                        onAction={() => setIsAddOpen(true)}
                    />
                )}
            </div>

            <AddDamageStockModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleAddSuccess} />
            
            {isEditOpen && (
                <UpdateDamageStockModal isOpen={isEditOpen} recordData={editRecord} onClose={() => { setIsEditOpen(false); setEditRecord(null); }} onSuccess={handleUpdateSuccess} />
            )}
            
            <SuccessModal isOpen={!!successData} data={successData} type={successType} onClose={() => setSuccessData(null)} />
        </div>
    );
};

export default DamageStockGrid;