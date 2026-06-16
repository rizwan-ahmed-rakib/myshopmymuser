import React, {useState, useEffect, useCallback} from 'react';
import PurchaseCard from "./PurchaseCard";
import PurchaseList from "./PurchaseList";
import AddPurchaseModal from "./AddPurchaseModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import EditPurchaseModal from "./EditPurchaseModal";
import EmptyState from "../../components/EmptyState";
import {posPurchaseProductAPI} from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import {
    usePosPurchaseProducts
} from "../../../context_or_provider/pos/Purchase/purchaseProduct/PurchaseProduct_provider";
import {Receipt, Banknote, CheckCircle, Clock, Wallet, Activity, Calendar, ArrowUpDown, User} from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";

const PurchaseGrid = ({
                          viewType,
                          isAddOpen,
                          setIsAddOpen,
                          onStatsLoaded,
                          searchQuery,
                          filters,
                          setFilterConfig
                      }) => {
    const {setPosPurchaseProduct} = usePosPurchaseProducts();
    const [addSuccessData, setAddSuccessData] = useState(null);
    const [updateSuccessData, setUpdateSuccessData] = useState(null);
    const [editingPurchase, setEditingPurchase] = useState(null);

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by Invoice No...",
                filtersConfig: [
                    {
                        key: "status", label: "Payment Status", icon: <Activity className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Status"}, 
                            {value: "paid", label: "Paid"}, 
                            {value: "partial", label: "Partial"},
                            {value: "due", label: "Due"}
                        ]
                    },
                    {
                        key: "method", label: "Method", icon: <Banknote className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Methods"},
                            {value: "cash", label: "Cash"},
                            {value: "bank", label: "Bank"},
                            {value: "mobile_banking", label: "Mobile Banking"}
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
                            {value: "amount_desc", label: "Total (High-Low)"}, 
                            {value: "amount_asc", label: "Total (Low-High)"},
                            {value: "due_desc", label: "Due (High-Low)"}
                        ]
                    }
                ],
                advancedConfig: [
                    {
                        key: "amountRange",
                        type: "range",
                        label: "Total Amount Range (৳)",
                        minPlaceholder: "Min",
                        maxPlaceholder: "Max"
                    }
                ]
            });
        }
    }, [setFilterConfig]);

    // 2. Stats calculation
    const calculateStats = useCallback((data) => {
        const totalInvoices = data.length;
        const totalPurchase = data.reduce((acc, curr) => acc + parseFloat(curr.net_total || 0), 0);
        const totalPaid = data.reduce((acc, curr) => acc + parseFloat(curr.paid_amount || 0), 0);
        const totalDue = data.reduce((acc, curr) => acc + parseFloat(curr.due_amount || 0), 0);

        return [
            { title: 'Total Invoices', count: totalInvoices.toString(), bgColor: 'bg-blue-600', icon: <Receipt size={24}/> },
            { title: 'Total Purchase', count: `৳${totalPurchase.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bgColor: 'bg-indigo-600', icon: <Banknote size={24}/> },
            { title: 'Total Paid', count: `৳${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bgColor: 'bg-green-600', icon: <CheckCircle size={24}/> },
            { title: 'Total Due', count: `৳${totalDue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bgColor: 'bg-red-600', icon: <Clock size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredProducts,
        rawData: posPurchaseProduct,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posPurchaseProductAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['invoice_no', 'supplier_name'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];
            
            if (f.status && f.status !== "all") {
                result = result.filter(item => item.payment_status === f.status);
            }
            
            if (f.method && f.method !== "all") {
                result = result.filter(item => item.payment_method === f.method);
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
                    const amount = parseFloat(item.net_total);
                    return (!f.amountRange.min || amount >= f.amountRange.min) && (!f.amountRange.max || amount <= f.amountRange.max);
                });
            }

            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "date_desc") return new Date(b.created_at) - new Date(a.created_at);
                    if (f.sortBy === "date_asc") return new Date(a.created_at) - new Date(b.created_at);
                    if (f.sortBy === "amount_desc") return parseFloat(b.net_total) - parseFloat(a.net_total);
                    if (f.sortBy === "amount_asc") return parseFloat(a.net_total) - parseFloat(b.net_total);
                    if (f.sortBy === "due_desc") return parseFloat(b.due_amount) - parseFloat(a.due_amount);
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (posPurchaseProduct) setPosPurchaseProduct(posPurchaseProduct);
    }, [posPurchaseProduct, setPosPurchaseProduct]);

    const handleAddSuccess = (newPurchase) => {
        setIsAddOpen(false);
        setAddSuccessData(newPurchase);
        refresh();
    };

    const handleEditClick = (purchase) => {
        setEditingPurchase(purchase);
    };

    const handleUpdateSuccess = (updatedData) => {
        setEditingPurchase(null);
        setUpdateSuccessData(updatedData);
        refresh();
    };

    const handleDeleteSuccess = () => {
        refresh();
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Loading purchases...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Receipt size={16} className="text-brand-primary"/>
                        {viewType === "grid" ? "Purchase History Grid" : "Purchase History Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredProducts.length} OF {posPurchaseProduct?.length || 0} INVOICES
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <PurchaseCard
                                key={product.id}
                                product={product}
                                onEdit={() => handleEditClick(product)}
                                onDelete={handleDeleteSuccess}
                            />
                        ))}
                    </div>
                ) : (
                    <PurchaseList
                        products={filteredProducts}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteSuccess}
                    />
                )}

                {filteredProducts.length === 0 && (
                    <EmptyState
                        icon={<Receipt size={32}/>}
                        title="No purchase records found"
                        description="There are no purchase records to display at this time."
                        actionText="Add New Purchase"
                        onAction={() => setIsAddOpen(true)}
                    />
                )}
            </div>

            <AddPurchaseModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
            />

            {editingPurchase && (
                 <EditPurchaseModal
                    open={!!editingPurchase}
                    onClose={() => setEditingPurchase(null)}
                    purchase={editingPurchase}
                    onUpdated={handleUpdateSuccess}
                />
            )}

            <SuccessModal
                isOpen={!!addSuccessData}
                invoice={addSuccessData}
                onClose={() => setAddSuccessData(null)}
            />

            {updateSuccessData && (
                 <SuccessModal
                    isOpen={!!updateSuccessData}
                    onClose={() => setUpdateSuccessData(null)}
                    invoice={updateSuccessData}
                />
            )}
        </div>
    );
};

export default PurchaseGrid;