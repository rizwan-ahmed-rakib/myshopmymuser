import React, {useState, useEffect, useCallback} from 'react';
import SupplierCard from "./SupplierCard";
import SupplierList from "./SupplierList";
import AddSupplierModal from "./AddSupplierModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import {usePosSuppliers} from "../../../context_or_provider/pos/Purchase/suppliers/supplierProvider";
import {posSupplierAPI} from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import AddSupplierDuePaymentModal from "./AddSupplierDuePaymentModal";
import {Users, UserCheck, UserMinus, Wallet, ArrowUpDown, Calendar, Activity} from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";

const SupplierGrid = ({
                          viewType,
                          isAddOpen,
                          setIsAddOpen,
                          onStatsLoaded,
                          searchQuery,
                          filters,
                          setFilterConfig
                      }) => {
    const {setPosSuppliers} = usePosSuppliers();
    const [successData, setSuccessData] = useState(null);
    const [isDueCollectionOpen, setIsDueCollectionOpen] = useState(false);

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by Name, Email or Phone...",
                filtersConfig: [
                    {
                        key: "status", label: "Account Status", icon: <Activity className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Status"},
                            {value: "active", label: "Active"},
                            {value: "inactive", label: "Inactive"},
                            {value: "due", label: "With Due Balance"}
                        ]
                    },
                    {
                        key: "dateRange", label: "Joined Date", icon: <Calendar className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Time"},
                            {value: "today", label: "Today"},
                            {value: "week", label: "This Week"},
                            {value: "month", label: "This Month"}
                        ]
                    },
                    {
                        key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5"/>, options: [
                            {value: "name_asc", label: "Name (A-Z)"},
                            {value: "name_desc", label: "Name (Z-A)"},
                            {value: "date_desc", label: "Joined (Newest)"},
                            {value: "date_asc", label: "Joined (Oldest)"},
                            {value: "due_desc", label: "Highest Due"}
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
        const active = data.filter(emp => emp.user?.is_active !== false).length;
        const withDue = data.filter(emp => parseFloat(emp.due_amount || 0) !== 0).length;
        const totalDue = data.reduce((acc, curr) => acc + Math.abs(parseFloat(curr.due_amount || 0)), 0);

        return [
            { title: 'Total Suppliers', count: total.toString(), bgColor: 'bg-purple-600', icon: <Users size={24}/> },
            { title: 'Active Accounts', count: active.toString(), bgColor: 'bg-teal-500', icon: <UserCheck size={24}/> },
            { title: 'Outstanding Accounts', count: withDue.toString(), bgColor: 'bg-amber-500', icon: <Activity size={24}/> },
            { title: 'Total Due Balance', count: `৳${totalDue.toLocaleString()}`, bgColor: 'bg-blue-600', icon: <Wallet size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredEmployees,
        rawData: posSuppliers,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posSupplierAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['name', 'email', 'phone', 'user.phone'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];

            if (f.status && f.status !== "all") {
                if (f.status === "active") result = result.filter(item => item.user?.is_active !== false);
                if (f.status === "inactive") result = result.filter(item => item.user?.is_active === false);
                if (f.status === "due") result = result.filter(item => parseFloat(item.due_amount || 0) !== 0);
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
                    if (f.sortBy === "name_asc") return a.name.localeCompare(b.name);
                    if (f.sortBy === "name_desc") return b.name.localeCompare(a.name);
                    if (f.sortBy === "date_desc") return new Date(b.created_at) - new Date(a.created_at);
                    if (f.sortBy === "date_asc") return new Date(a.created_at) - new Date(b.created_at);
                    if (f.sortBy === "due_desc") return Math.abs(parseFloat(b.due_amount || 0)) - Math.abs(parseFloat(a.due_amount || 0));
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (posSuppliers) setPosSuppliers(posSuppliers);
    }, [posSuppliers, setPosSuppliers]);

    const handleEmployeeAdded = (newEmp) => {
        setIsAddOpen(false);
        setSuccessData(newEmp);
        refresh();
    };

    const handleEmployeeUpdated = useCallback(() => {
        refresh();
    }, [refresh]);

    const handleDueCollectionSuccess = () => {
        refresh();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Loading suppliers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Users size={16} className="text-brand-primary"/>
                        {viewType === "grid" ? "Supplier Directory Grid" : "Supplier List Table"}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsDueCollectionOpen(true)}
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[11px] font-bold uppercase tracking-tighter hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                        >
                            <Wallet size={12}/> Collect Payment
                        </button>
                        <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            SHOWING {filteredEmployees.length} OF {posSuppliers?.length || 0} RECORDS
                        </div>
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredEmployees.map(emp => (
                            <SupplierCard
                                key={emp.id}
                                employee={{
                                    ...emp,
                                    id: emp.id,
                                    name: emp.name,
                                    designation: emp.role,
                                    phone_number: emp.phone_number || "N/A",
                                    joinDate: emp.created_at?.split("T")[0],
                                    image: emp.image,
                                    user: emp.user
                                }}
                                onEdit={handleEmployeeUpdated}
                                onDelete={handleEmployeeUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <SupplierList
                        employees={filteredEmployees}
                        onUpdate={handleEmployeeUpdated}
                    />
                )}

                {filteredEmployees.length === 0 && (
                    <EmptyState
                        icon={<Users size={32}/>}
                        title="No suppliers found"
                        description="There are no supplier records to display at this time."
                        actionText="Add New Supplier"
                        onAction={() => setIsAddOpen(true)}
                    />
                )}
            </div>

            <AddSupplierModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleEmployeeAdded}
            />

            <AddSupplierDuePaymentModal
                isOpen={isDueCollectionOpen}
                onClose={() => setIsDueCollectionOpen(false)}
                onSuccess={handleDueCollectionSuccess}
                suppliers={posSuppliers}
            />

            <SuccessModal
                isOpen={!!successData}
                employee={successData}
                onClose={() => setSuccessData(null)}
            />
        </div>
    );
};

export default SupplierGrid;