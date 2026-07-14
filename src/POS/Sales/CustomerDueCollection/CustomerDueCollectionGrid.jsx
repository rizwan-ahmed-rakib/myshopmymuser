import React, {useState, useEffect, useCallback} from 'react';
import CustomerDueCollectionCard from "./CustomerDueCollectionCard";
import CustomerDueCollectionList from "./CustomerDueCollectionList";
// import LoadingSpinner from "./LoadingSpinner";
import {posDueCollectionAPI} from "../../../context_or_provider/pos/Sale/dueCollection/dueCollectionAPI";
import {usePosDueCollection} from "../../../context_or_provider/pos/Sale/dueCollection/DueCollectionProvider";
import AddCustomerDueCollectionModal from "../../Sales/CustomerList/AddCustomerDueCollectionModal";
import EditCustomerDueCollectionModal from "./EditCustomerDueCollectionModal";
import {usePosCustomers} from "../../../context_or_provider/pos/Sale/customer/PosCustomerProvider";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import {Receipt, Banknote, CreditCard, Wallet, Activity, Calendar, ArrowUpDown} from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";

const CustomerDueCollectionGrid = ({
                                       viewType,
                                       isAddOpen,
                                       setIsAddOpen,
                                       onStatsLoaded,
                                       searchQuery,
                                       filters,
                                       setFilterConfig
                                   }) => {
    const {setPosDueCollections} = usePosDueCollection();
    const {posCustomers, setPosCustomers} = usePosCustomers();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by Invoice or Customer...",
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
                        key: "dateRange", label: "Collection Date", icon: <Calendar className="w-3.5 h-3.5"/>, options: [
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
                        label: "Collection Amount Range (৳)",
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
            { title: 'Total Collections', count: total.toString(), bgColor: 'bg-blue-600', icon: <Receipt size={24}/> },
            { title: 'Total Collected', count: `৳${totalAmount.toLocaleString()}`, bgColor: 'bg-green-600', icon: <Banknote size={24}/> },
            { title: 'Cash Received', count: `৳${cashTotal.toLocaleString()}`, bgColor: 'bg-orange-600', icon: <Wallet size={24}/> },
            { title: 'Digital Received', count: `৳${digitalTotal.toLocaleString()}`, bgColor: 'bg-indigo-600', icon: <CreditCard size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredCollections,
        rawData: posDueCollections,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posDueCollectionAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['invoice_no', 'customer_name', 'sale_invoice_no'],
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
        if (posDueCollections) setPosDueCollections(posDueCollections);
    }, [posDueCollections, setPosDueCollections]);

    // Fetch customers once for the add modal
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await posCustomerAPI.getAll();
                setPosCustomers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCustomers();
    }, [setPosCustomers]);

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setIsEditOpen(true);
    };

    const handleAddSuccess = () => {
        setIsAddOpen(false);
        refresh();
    };

    const handleUpdateSuccess = () => {
        setIsEditOpen(false);
        refresh();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Loading collection records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Receipt size={16} className="text-brand-primary"/>
                        {viewType === "grid" ? "Collection Directory Grid" : "Collection Record Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredCollections.length} OF {posDueCollections?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCollections.map(item => (
                            <CustomerDueCollectionCard
                                key={item.id}
                                item={item}
                                onEdit={() => handleEditClick(item)}
                                onDelete={refresh}
                            />
                        ))}
                    </div>
                ) : (
                    <CustomerDueCollectionList
                        collections={filteredCollections}
                        onEdit={handleEditClick}
                        onDelete={refresh}
                    />
                )}

                {filteredCollections.length === 0 && (
                    <EmptyState
                        icon={<Receipt size={32}/>}
                        title="No collection records found"
                        description="There are no customer due collection records to display at this time."
                        actionText="Record New Collection"
                        onAction={() => setIsAddOpen(true)}
                    />
                )}
            </div>

            <AddCustomerDueCollectionModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
                customers={posCustomers}
            />

            {isEditOpen && selectedItem && (
                <EditCustomerDueCollectionModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSuccess={handleUpdateSuccess}
                    item={selectedItem}
                />
            )}
        </div>
    );
};

export default CustomerDueCollectionGrid;