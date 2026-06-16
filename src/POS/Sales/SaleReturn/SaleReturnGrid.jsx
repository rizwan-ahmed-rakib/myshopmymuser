import React, {useState, useEffect, useCallback} from 'react';
import SaleReturnCard from "./SaleReturnCard";
import SaleReturnList from "./SaleReturnList";
import AddPurchaseModal from "./AddSaleReturnModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import EditSaleReturnModal from "./EditSaleReturnModal";
import EmptyState from "../../components/EmptyState";
import {posSaleReturnAPI} from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";
import {usePosSaleReturn} from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturn_provider";
import {Undo2, Banknote, CheckCircle, Clock, ShoppingCart, Activity, Calendar, ArrowUpDown} from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";

const SaleReturnGrid = ({
                            viewType,
                            isAddOpen,
                            setIsAddOpen,
                            onStatsLoaded,
                            searchQuery,
                            filters,
                            setFilterConfig
                        }) => {
    const {setPosSaleReturn} = usePosSaleReturn();
    const [addSuccessData, setAddSuccessData] = useState(null);
    const [updateSuccessData, setUpdateSuccessData] = useState(null);
    const [editingPurchaseReturn, seteditingPurchaseReturn] = useState(null);

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by Invoice or Customer...",
                filtersConfig: [
                    {
                        key: "status", label: "Payment Status", icon: <Activity className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Status"},
                            {value: "paid", label: "Paid"},
                            {value: "partial", label: "Partial"},
                            {value: "unpaid", label: "Unpaid"}
                        ]
                    },
                    {
                        key: "dateRange", label: "Return Date", icon: <Calendar className="w-3.5 h-3.5"/>, options: [
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
                            {value: "amount_desc", label: "Amount (High-Low)"},
                            {value: "amount_asc", label: "Amount (Low-High)"}
                        ]
                    }
                ],
                advancedConfig: [
                    {
                        key: "amountRange",
                        type: "range",
                        label: "Return Amount Range (৳)",
                        minPlaceholder: "Min",
                        maxPlaceholder: "Max"
                    }
                ]
            });
        }
    }, [setFilterConfig]);

    // 2. Stats calculation
    const calculateStats = useCallback((data) => {
        const total = data.length;
        const totalAmount = data.reduce((acc, curr) => acc + parseFloat(curr.net_return_amount || 0), 0);
        const totalPaid = data.reduce((acc, curr) => acc + (parseFloat(curr.paid_cash || 0) + parseFloat(curr.paid_mobile || 0) + parseFloat(curr.paid_bank || 0)), 0);
        const totalDue = data.reduce((acc, curr) => acc + parseFloat(curr.due_amount || 0), 0);

        return [
            { title: 'Total Returns', count: total.toString(), bgColor: 'bg-blue-600', icon: <Undo2 size={24}/> },
            { title: 'Return Amount', count: `৳${totalAmount.toLocaleString()}`, bgColor: 'bg-green-600', icon: <Banknote size={24}/> },
            { title: 'Paid Back', count: `৳${totalPaid.toLocaleString()}`, bgColor: 'bg-indigo-600', icon: <CheckCircle size={24}/> },
            { title: 'Pending Due', count: `৳${totalDue.toLocaleString()}`, bgColor: 'bg-red-600', icon: <Clock size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredReturns,
        rawData: posSaleReturn,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posSaleReturnAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['sale_invoice_no', 'customer_name', 'return_reason'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];

            if (f.status && f.status !== "all") {
                result = result.filter(item => item.payment_status === f.status);
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

            if (f.amountRange) {
                result = result.filter(item => {
                    const amount = parseFloat(item.net_return_amount);
                    return (!f.amountRange.min || amount >= f.amountRange.min) && (!f.amountRange.max || amount <= f.amountRange.max);
                });
            }

            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "date_desc") return new Date(b.created_at) - new Date(a.created_at);
                    if (f.sortBy === "date_asc") return new Date(a.created_at) - new Date(b.created_at);
                    if (f.sortBy === "amount_desc") return parseFloat(b.net_return_amount) - parseFloat(a.net_return_amount);
                    if (f.sortBy === "amount_asc") return parseFloat(a.net_return_amount) - parseFloat(b.net_return_amount);
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (posSaleReturn) setPosSaleReturn(posSaleReturn);
    }, [posSaleReturn, setPosSaleReturn]);

    const handleAddSuccess = (newProduct) => {
        setIsAddOpen(false);
        setAddSuccessData(newProduct);
        refresh();
    };

    const handleEditClick = (purchase) => {
        seteditingPurchaseReturn(purchase);
    };

    const handleUpdateSuccess = (updatedData) => {
        seteditingPurchaseReturn(null);
        setUpdateSuccessData(updatedData);
        refresh();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Loading sale returns...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Undo2 size={16} className="text-brand-primary"/>
                        {viewType === "grid" ? "Sale Return Grid" : "Sale Return Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredReturns.length} OF {posSaleReturn?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredReturns.map(item => (
                            <SaleReturnCard
                                key={item.id}
                                product={item}
                                onEdit={() => handleEditClick(item)}
                                onDelete={refresh}
                            />
                        ))}
                    </div>
                ) : (
                    <SaleReturnList
                        products={filteredReturns}
                        onEdit={handleEditClick}
                        onDelete={refresh}
                    />
                )}

                {filteredReturns.length === 0 && (
                    <EmptyState
                        icon={<Undo2 size={32}/>}
                        title="No returns found"
                        description="There are no sale return records to display at this time."
                        actionText="Record New Return"
                        onAction={() => setIsAddOpen(true)}
                    />
                )}
            </div>

            <AddPurchaseModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
            />

            {editingPurchaseReturn && (
                 <EditSaleReturnModal
                    open={!!editingPurchaseReturn}
                    onClose={() => seteditingPurchaseReturn(null)}
                    purchase={editingPurchaseReturn}
                    onUpdated={handleUpdateSuccess}
                />
            )}

            <SuccessModal
                isOpen={!!addSuccessData}
                purchase={addSuccessData}
                onClose={() => setAddSuccessData(null)}
                title="Sale Return Added!"
                successMessage="The sale return has been successfully recorded."
            />

            {updateSuccessData && (
                 <SuccessModal
                    isOpen={!!updateSuccessData}
                    onClose={() => setUpdateSuccessData(null)}
                    purchase={updateSuccessData}
                    title="Sale Return Updated!"
                    successMessage="The sale return has been successfully updated."
                />
            )}
        </div>
    );
};

export default SaleReturnGrid;