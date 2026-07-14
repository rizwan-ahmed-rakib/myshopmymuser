import React, {useState, useEffect, useCallback} from 'react';
import SaleCard from "./SaleCard";
import SaleList from "./SaleList";
import AddSaleModal from "./AddSaleModal";
import EditSaleModal from "./EditSaleModal";
import EmptyState from "../../components/EmptyState";
import {posSaleProductAPI} from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";
import {usePosSaleProducts} from "../../../context_or_provider/pos/Sale/saleProduct/PosSaleProduct_provider";
import {Receipt, Banknote, CheckCircle, Clock, ShoppingCart, Activity, Calendar, ArrowUpDown} from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import LoadingSpinner from "../../components/LoadingSpinner";
import SuccessModal from "../../components/SuccessModal";
import { usePrintManager } from "../../utils/usePrintManager";

const SaleGrid = ({
                       viewType,
                       isAddOpen,
                       setIsAddOpen,
                       onStatsLoaded,
                       searchQuery,
                       filters,
                       setFilterConfig
                   }) => {
    const {setPosSaleProduct} = usePosSaleProducts();
    const [successData, setSuccessData] = useState(null);
    const [previousDue, setPreviousDue] = useState(0);
    const [successType, setSuccessType] = useState('create');
    const [editingSale, setEditingSale] = useState(null);

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
        const totalSales = data.reduce((acc, curr) => acc + parseFloat(curr.net_total || curr.netTotal || 0), 0);
        const totalReceived = data.reduce((acc, curr) => acc + parseFloat(curr.paid_amount || 0), 0);
        const totalDue = data.reduce((acc, curr) => acc + parseFloat(curr.due_amount || 0), 0);

        return [
            { title: 'Total Invoices', count: totalInvoices.toString(), bgColor: 'bg-blue-600', icon: <Receipt size={24}/> },
            { title: 'Total Sales', count: `৳${totalSales.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bgColor: 'bg-indigo-600', icon: <ShoppingCart size={24}/> },
            { title: 'Total Received', count: `৳${totalReceived.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bgColor: 'bg-green-600', icon: <CheckCircle size={24}/> },
            { title: 'Total Due', count: `৳${totalDue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bgColor: 'bg-red-600', icon: <Clock size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredSales,
        rawData: posSaleProduct,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posSaleProductAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['invoice_no', 'customer_name'],
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
                    const amount = parseFloat(item.net_total || item.netTotal);
                    return (!f.amountRange.min || amount >= f.amountRange.min) && (!f.amountRange.max || amount <= f.amountRange.max);
                });
            }

            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "date_desc") return new Date(b.created_at) - new Date(a.created_at);
                    if (f.sortBy === "date_asc") return new Date(a.created_at) - new Date(b.created_at);
                    if (f.sortBy === "amount_desc") return parseFloat(b.net_total || b.netTotal) - parseFloat(a.net_total || a.netTotal);
                    if (f.sortBy === "amount_asc") return parseFloat(a.net_total || a.netTotal) - parseFloat(b.net_total || b.netTotal);
                    if (f.sortBy === "due_desc") return parseFloat(b.due_amount) - parseFloat(a.due_amount);
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (posSaleProduct) setPosSaleProduct(posSaleProduct);
    }, [posSaleProduct, setPosSaleProduct]);

    const handleAddSuccess = (newSale) => {
        setIsAddOpen(false);
        if (newSale) {
            setPreviousDue(parseFloat(newSale.previousDue || 0));
            setSuccessType('create');
            setSuccessData(newSale);
        }
        refresh();
    };

    const handleEditClick = (sale) => {
        setEditingSale(sale);
    };

    const handleUpdateSuccess = (updatedData) => {
        setEditingSale(null);
        if (updatedData) {
            setPreviousDue(parseFloat(updatedData.previousDue || 0));
            setSuccessType('update');
            setSuccessData(updatedData);
        }
        refresh();
    };

    const handleDeleteSuccess = () => {
        refresh();
    };

    const { handlePrintInvoice } = usePrintManager();
    const handlePrint = (invoice) => handlePrintInvoice(invoice);

    const netTotal = parseFloat(successData?.net_total || successData?.netTotal || 0);
    const paidAmount = parseFloat(successData?.paid_amount || 0);
    const currentInvoiceDue = parseFloat(successData?.due_amount || 0);
    const totalCustomerDue = Number(previousDue) + Number(currentInvoiceDue);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Loading sales history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <ShoppingCart size={16} className="text-brand-primary"/>
                        {viewType === "grid" ? "Sales History Grid" : "Sales History Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredSales.length} OF {posSaleProduct?.length || 0} INVOICES
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredSales.map(sale => (
                            <SaleCard
                                key={sale.id}
                                product={sale}
                                onEdit={() => handleEditClick(sale)}
                                onDelete={handleDeleteSuccess}
                            />
                        ))}
                    </div>
                ) : (
                    <SaleList
                        products={filteredSales}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteSuccess}
                    />
                )}

                {filteredSales.length === 0 && (
                    <EmptyState
                        icon={<ShoppingCart size={32}/>}
                        title="No sale records found"
                        description="There are no sale records to display at this time."
                        actionText="Create New Sale"
                        onAction={() => setIsAddOpen(true)}
                    />
                )}
            </div>

            <AddSaleModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
            />

            {editingSale && (
                 <EditSaleModal
                    open={!!editingSale}
                    onClose={() => setEditingSale(null)}
                    purchase={editingSale}
                    onUpdated={handleUpdateSuccess}
                />
            )}

            <SuccessModal
                isOpen={!!successData}
                onClose={() => setSuccessData(null)}
                title={successType === 'update' ? 'Sale Updated Successfully' : 'Sale Recorded Successfully'}
                subtitle={
                    successData 
                        ? `Invoice #${successData.invoice_no} ${successType === 'update' ? 'Updated' : 'Generated'}` 
                        : `Transaction ${successType === 'update' ? 'Updated' : 'Completed'} Successfully`
                }
                details={[
                    { label: "Net Payable", value: `৳${netTotal.toLocaleString()}` },
                    { label: "Total Received", value: `৳${paidAmount.toLocaleString()}` },
                    { label: "Current Due", value: `৳${currentInvoiceDue.toLocaleString()}` },
                    { label: "Total Combined Due", value: `৳${totalCustomerDue.toLocaleString()}` }
                ]}
                onPrint={() => handlePrint(successData)}
                printText="Print Slip"
            />
        </div>
    );
};

export default SaleGrid;