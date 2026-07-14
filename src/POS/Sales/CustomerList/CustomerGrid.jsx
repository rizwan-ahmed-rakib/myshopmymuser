import React, {useState, useEffect, useCallback} from 'react';
import CustomerCard from "./CustomerCard";
import CustomerList from "./CustomerList";
import AddCustomerModal from "./AddCustomerModal";
import SuccessModal from "../../components/SuccessModal";
// import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import {usePosCustomers} from "../../../context_or_provider/pos/Sale/customer/PosCustomerProvider";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import AddCustomerDueCollectionModal from "./AddCustomerDueCollectionModal";
import {Users, UserCheck, UserMinus, Wallet, ArrowUpDown, Calendar, Activity} from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import LoadingSpinner from "../../components/LoadingSpinner";

const CustomerGrid = ({
                          viewType,
                          isAddOpen,
                          setIsAddOpen,
                          onStatsLoaded,
                          searchQuery,
                          filters,
                          setFilterConfig
                      }) => {
    const {setPosCustomers} = usePosCustomers();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');
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
        const withDue = data.filter(emp => parseFloat(emp.due_amount || 0) > 0).length;
        const totalDue = data.reduce((acc, curr) => acc + Math.max(0, parseFloat(curr.due_amount || 0)), 0);

        return [
            { title: 'Total Customers', count: total.toString(), bgColor: 'bg-purple-600', icon: <Users size={24}/> },
            { title: 'Active Accounts', count: active.toString(), bgColor: 'bg-teal-500', icon: <UserCheck size={24}/> },
            { title: 'Pending Receivables', count: withDue.toString(), bgColor: 'bg-amber-500', icon: <Activity size={24}/> },
            { title: 'Total Due Balance', count: `৳${totalDue.toLocaleString()}`, bgColor: 'bg-rose-600', icon: <Wallet size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredEmployees,
        rawData: posCustomers,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posCustomerAPI.getAll,
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
                if (f.status === "due") result = result.filter(item => parseFloat(item.due_amount || 0) > 0);
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
        if (posCustomers) setPosCustomers(posCustomers);
    }, [posCustomers, setPosCustomers]);

    const handleEmployeeAdded = (newEmp) => {
        setIsAddOpen(false);
        setSuccessType('create');
        setSuccessData(newEmp);
        refresh();
    };

    const handleEmployeeUpdated = useCallback((updatedEmp) => {
        refresh();
        if (updatedEmp) {
            setSuccessType('update');
            setSuccessData(updatedEmp);
        }
    }, [refresh]);

    const handleDueCollectionSuccess = () => {
        refresh();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Loading customers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Users size={16} className="text-brand-primary"/>
                        {viewType === "grid" ? "Customer Directory Grid" : "Customer List Table"}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsDueCollectionOpen(true)}
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[11px] font-bold uppercase tracking-tighter hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                        >
                            <Wallet size={12}/> Collect Due
                        </button>
                        <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            SHOWING {filteredEmployees.length} OF {posCustomers?.length || 0} RECORDS
                        </div>
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredEmployees.map(emp => (
                            <CustomerCard
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
                    <CustomerList
                        employees={filteredEmployees}
                        onUpdate={handleEmployeeUpdated}
                    />
                )}

                {filteredEmployees.length === 0 && (
                    <EmptyState
                        icon={<Users size={32}/>}
                        title="No customers found"
                        description="There are no customer records to display at this time."
                        actionText="Add New Customer"
                        onAction={() => setIsAddOpen(true)}
                    />
                )}
            </div>

            <AddCustomerModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleEmployeeAdded}
            />

            <AddCustomerDueCollectionModal
                isOpen={isDueCollectionOpen}
                onClose={() => setIsDueCollectionOpen(false)}
                onSuccess={handleDueCollectionSuccess}
                customers={posCustomers}
            />

            <SuccessModal
                isOpen={!!successData}
                onClose={() => setSuccessData(null)}
                title={successType === 'update' ? "Customer Profile Updated" : "Customer Profile Created"}
                subtitle={successType === 'update' ? "Customer Account Updated" : "New Customer Account Active"}
                details={[
                    { label: "Customer Name", value: successData?.name },
                    { label: "Customer ID", value: `#${successData?.id}` },
                    { label: "Contact Info", value: successData?.phone || successData?.user?.phone || "N/A" }
                ]}
            />
        </div>
    );
};

export default CustomerGrid;