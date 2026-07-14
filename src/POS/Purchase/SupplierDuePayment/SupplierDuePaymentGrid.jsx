import React, {useState, useEffect, useCallback} from 'react';
import SupplierDuePaymentCard from "./SupplierDuePaymentCard";
import SupplierDuePaymentList from "./SupplierDuePaymentList";
import {posDuePaymentAPI} from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
import {usePosDuePayment} from "../../../context_or_provider/pos/Purchase/duePayment/DuePaymentProvider";
import AddSupplierDuePaymentModal from "../../Purchase/SupplierList/AddSupplierDuePaymentModal";
import EditSupplierDuePaymentModal from "./EditSupplierDuePaymentModal";
import {usePosSuppliers} from "../../../context_or_provider/pos/Purchase/suppliers/supplierProvider";
import {posSupplierAPI} from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import {Receipt, Banknote, CreditCard, Wallet, Activity, Calendar, ArrowUpDown} from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import EmptyState from "../../components/EmptyState";
import SuccessModal from "../../components/SuccessModal";
import { getDuePaymentPrintLayout } from "./DuePaymentPrintLayout";
import { getBrandedVoucher } from "../../utils/printTemplates";
import LoadingSpinner from "../../components/LoadingSpinner";

const SupplierDuePaymentGrid = ({
                                    viewType,
                                    isAddOpen,
                                    setIsAddOpen,
                                    onStatsLoaded,
                                    searchQuery,
                                    filters,
                                    setFilterConfig
                                }) => {
    const {setPosDuePayments} = usePosDuePayment();
    const {posSuppliers, setPosSuppliers} = usePosSuppliers();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [successType, setSuccessType] = useState(null);
    const [successData, setSuccessData] = useState(null);

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by Invoice or Supplier...",
                filtersConfig: [
                    {
                        key: "method", label: "Payment Method", icon: <Banknote className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Methods"},
                            {value: "cash", label: "Cash"},
                            {value: "bank", label: "Bank"},
                            {value: "mobile", label: "Mobile Banking"}
                        ]
                    },
                    {
                        key: "dateRange", label: "Payment Date", icon: <Calendar className="w-3.5 h-3.5"/>, options: [
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
                        label: "Payment Amount Range (৳)",
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
        const totalAmount = data.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const cashTotal = data.reduce((sum, p) => sum + Number(p.paid_cash || 0), 0);
        const digitalTotal = data.reduce((sum, p) => sum + Number(p.paid_mobile || 0) + Number(p.paid_bank || 0), 0);

        return [
            { title: 'Total Payments', count: total.toString(), bgColor: 'bg-blue-600', icon: <Receipt size={24}/> },
            { title: 'Total Amount', count: `৳${totalAmount.toLocaleString()}`, bgColor: 'bg-green-600', icon: <Banknote size={24}/> },
            { title: 'Cash Payout', count: `৳${cashTotal.toLocaleString()}`, bgColor: 'bg-orange-600', icon: <Wallet size={24}/> },
            { title: 'Digital Payout', count: `৳${digitalTotal.toLocaleString()}`, bgColor: 'bg-indigo-600', icon: <CreditCard size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredPayments,
        rawData: posDuePayments,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posDuePaymentAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['invoice_no', 'supplier_name', 'purchase_invoice_no'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];

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
                    const amount = parseFloat(item.amount);
                    return (!f.amountRange.min || amount >= f.amountRange.min) && (!f.amountRange.max || amount <= f.amountRange.max);
                });
            }

            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "date_desc") return new Date(b.created_at) - new Date(a.created_at);
                    if (f.sortBy === "date_asc") return new Date(a.created_at) - new Date(b.created_at);
                    if (f.sortBy === "amount_desc") return parseFloat(b.amount) - parseFloat(a.amount);
                    if (f.sortBy === "amount_asc") return parseFloat(a.amount) - parseFloat(b.amount);
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (posDuePayments) setPosDuePayments(posDuePayments);
    }, [posDuePayments, setPosDuePayments]);

    // Fetch suppliers once for the add modal
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await posSupplierAPI.getAll();
                setPosSuppliers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSuppliers();
    }, [setPosSuppliers]);

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setIsEditOpen(true);
    };

    const handleAddSuccess = (newPayment) => {
        setIsAddOpen(false);
        setSuccessType('add');
        setSuccessData(newPayment);
        refresh();
    };

    const handleUpdateSuccess = (updatedPayment) => {
        setIsEditOpen(false);
        setSuccessType('update');
        setSuccessData(updatedPayment);
        refresh();
    };

    const handlePrint = (invoice) => {
        if (!invoice) return;
        const tableContent = getDuePaymentPrintLayout(invoice);
        const fullHTML = getBrandedVoucher("Payment Receipt", tableContent, invoice.invoice_no, "#10b981");
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Loading payment records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Receipt size={16} className="text-brand-primary"/>
                        {viewType === "grid" ? "Payment Directory Grid" : "Payment Record Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredPayments.length} OF {posDuePayments?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPayments.map(item => (
                            <SupplierDuePaymentCard
                                key={item.id}
                                item={item}
                                onEdit={() => handleEditClick(item)}
                                onDelete={refresh}
                            />
                        ))}
                    </div>
                ) : (
                    <SupplierDuePaymentList
                        payments={filteredPayments}
                        onEdit={handleEditClick}
                        onDelete={refresh}
                    />
                )}

                {filteredPayments.length === 0 && (
                    <EmptyState
                        icon={<Receipt size={32}/>}
                        title="No payment records found"
                        description="There are no supplier due payment records to display at this time."
                        actionText="Record New Payment"
                        onAction={() => setIsAddOpen(true)}
                    />
                )}
            </div>

            <AddSupplierDuePaymentModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
                suppliers={posSuppliers}
            />

            {isEditOpen && selectedItem && (
                <EditSupplierDuePaymentModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSuccess={handleUpdateSuccess}
                    item={selectedItem}
                />
            )}

            <SuccessModal
                isOpen={!!successData}
                onClose={() => { setSuccessData(null); setSuccessType(null); }}
                title={successType === 'update' ? "Payment Updated Successfully" : "Payment Recorded Successfully"}
                subtitle={`Payment #${successData?.invoice_no}`}
                details={[
                    { label: "Supplier", value: successData?.supplier_name || 'N/A' },
                    { label: "Settled Amount", value: `৳${parseFloat(successData?.amount || 0).toLocaleString()}` },
                    { label: "Payment Method", value: (successData?.payment_method || '').replace('_', ' ').toUpperCase() }
                ]}
                onPrint={() => handlePrint(successData)}
                printText="Print Receipt"
            />
        </div>
    );
};

export default SupplierDuePaymentGrid;