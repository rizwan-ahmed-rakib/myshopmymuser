import React, {useState, useEffect, useMemo, useCallback} from 'react';
import EmployeeLoanCard from "./EmployeeLoanCard";
import EmployeeLoanList from "./EmployeeLoanList";
import AddEmployeeLoanModal from "./AddEmployeeLoanModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {employeeLoanAPI} from "../../../context_or_provider/pos/EmployeeLoan/employee_loanAPI";
import {useEmployeeLoan} from "../../../context_or_provider/pos/EmployeeLoan/employee_loan_provider";
import { HandCoins, CheckCircle, Clock, Wallet, Briefcase, Activity, Calendar, ArrowUpDown } from 'lucide-react';
import { DESIGNATION_OPTIONS } from "../EmployeeList/constant/filters";

const EmployeeLoanGrid = ({ 
    viewType, 
    isAddOpen, 
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { employeeLoan, setEmployeeLoan } = useEmployeeLoan();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');
    const [loading, setLoading] = useState(true);

    // Provide filter configuration to parent on mount
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by employee name or reason...",
                filtersConfig: [
                    { 
                        key: "designation", 
                        label: "Designation", 
                        icon: <Briefcase className="w-3.5 h-3.5" />, 
                        options: DESIGNATION_OPTIONS 
                    },
                    { 
                        key: "status", 
                        label: "Loan Status", 
                        icon: <Activity className="w-3.5 h-3.5" />, 
                        options: [
                            { value: "all", label: "All Status" },
                            { value: "paid", label: "Paid" },
                            { value: "unpaid", label: "Unpaid" }
                        ] 
                    },
                    { 
                        key: "dateRange", 
                        label: "Loan Date", 
                        icon: <Calendar className="w-3.5 h-3.5" />, 
                        options: [
                            { value: "all", label: "All Time" },
                            { value: "today", label: "Today" },
                            { value: "week", label: "This Week" },
                            { value: "month", label: "This Month" }
                        ] 
                    },
                    { 
                        key: "sortBy", 
                        label: "Sort By", 
                        icon: <ArrowUpDown className="w-3.5 h-3.5" />, 
                        options: [
                            { value: "date_desc", label: "Newest First" },
                            { value: "date_asc", label: "Oldest First" },
                            { value: "amount_desc", label: "Amount (High-Low)" },
                            { value: "amount_asc", label: "Amount (Low-High)" }
                        ] 
                    }
                ],
                advancedConfig: [
                    { key: "amountRange", type: "range", label: "Loan Amount Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
                    { key: "customDateRange", type: "date-range", label: "Custom Date Range" }
                ]
            });
        }
    }, [setFilterConfig]);

    const fetchLoans = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const res = await employeeLoanAPI.getAll();
            setEmployeeLoan(res.data);
            calculateStats(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [setEmployeeLoan]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const calculateStats = useCallback((data) => {
        const total = data.length;
        const paid = data.filter(d => d.is_fully_paid).length;
        const unpaid = data.filter(d => !d.is_fully_paid).length;
        const totalAmount = data.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

        const displayStats = [
            {
                title: 'Total Loans',
                count: total,
                bgColor: 'bg-brand-primary',
                icon: <HandCoins size={24} />
            },
            {
                title: 'Paid',
                count: paid,
                bgColor: 'bg-emerald-500',
                icon: <CheckCircle size={24} />
            },
            {
                title: 'Unpaid',
                count: unpaid,
                bgColor: 'bg-rose-500',
                icon: <Clock size={24} />
            },
            {
                title: 'Total Amount',
                count: `৳ ${totalAmount.toLocaleString()}`,
                bgColor: 'bg-indigo-500',
                icon: <Wallet size={24} />
            }
        ];

        if (onStatsLoaded) onStatsLoaded(displayStats);
    }, [onStatsLoaded]);

    const filteredEmployees = useMemo(() => {
        if (!employeeLoan) return [];

        let result = [...employeeLoan];

        // 🔍 search
        if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.user_name?.toLowerCase().includes(q) ||
                item.reason?.toLowerCase().includes(q) ||
                item.amount?.toString().includes(q)
            );
        }

        // designation
        if (filters.designation && filters.designation !== "all") {
            result = result.filter(item =>
                item.user_designation?.toLowerCase() === filters.designation.toLowerCase()
            );
        }

        // status (paid/unpaid)
        if (filters.status && filters.status !== "all") {
            if (filters.status === "paid") result = result.filter(item => item.is_fully_paid);
            else if (filters.status === "unpaid") result = result.filter(item => !item.is_fully_paid);
        }

        // loan_date filter
        if (filters.dateRange && filters.dateRange !== "all") {
            const today = new Date();
            result = result.filter(item => {
                const date = new Date(item.loan_date);
                if (filters.dateRange === "today") return date.toDateString() === today.toDateString();
                if (filters.dateRange === "week") return date >= new Date(today - 7 * 86400000);
                if (filters.dateRange === "month") return date >= new Date(today - 30 * 86400000);
                return true;
            });
        }

        // Custom Date Range
        if (filters.customDateRange?.from && filters.customDateRange?.to) {
            const fromDate = new Date(filters.customDateRange.from);
            fromDate.setHours(0, 0, 0, 0);
            const toDate = new Date(filters.customDateRange.to);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter(item => {
                const date = new Date(item.loan_date);
                return date >= fromDate && date <= toDate;
            });
        }

        // Amount Range
        if (filters.amountRange) {
            result = result.filter(item => {
                const amount = parseFloat(item.amount);
                const min = filters.amountRange.min ? parseFloat(filters.amountRange.min) : 0;
                const max = filters.amountRange.max ? parseFloat(filters.amountRange.max) : Infinity;
                return amount >= min && amount <= max;
            });
        }

        // sorting
        if (filters.sortBy) {
            result.sort((a, b) => {
                switch (filters.sortBy) {
                    case "amount_asc": return parseFloat(a.amount) - parseFloat(b.amount);
                    case "amount_desc": return parseFloat(b.amount) - parseFloat(a.amount);
                    case "date_asc": return new Date(a.loan_date) - new Date(b.loan_date);
                    case "date_desc": return new Date(b.loan_date) - new Date(a.loan_date);
                    default: return 0;
                }
            });
        }

        return result;
    }, [employeeLoan, searchQuery, filters]);

    const handleAdded = (newItem) => {
        setEmployeeLoan(prev => [...prev, newItem]);
        setIsAddOpen(false);
        setSuccessType("create");
        setSuccessData(newItem);
        fetchLoans();
    };

    const handleUpdated = useCallback((data) => {
        fetchLoans(false);
        if (data) {
            setSuccessType("update");
            setSuccessData(data);
        }
    }, [fetchLoans, setEmployeeLoan]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 text-sm">Loading loan records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Content Viewport */}
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <HandCoins size={16} className="text-brand-primary" />
                        {viewType === "grid" ? "Loan Directory" : "Loan Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredEmployees.length} OF {employeeLoan?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEmployees.map(emp => (
                            <EmployeeLoanCard
                                key={emp?.id}
                                advance={emp}
                                onEdit={handleUpdated}
                                onDelete={handleUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <EmployeeLoanList
                        advance={filteredEmployees}
                        onEdit={handleUpdated}
                    />
                )}

                {/* Empty State Viewport */}
                {filteredEmployees.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <HandCoins className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800 mb-1">No loan records found</h3>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
                            Try adjusting your filters to find what you're looking for.
                        </p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                        >
                            Apply For Loan
                        </button>
                    </div>
                )}
            </div>

            <AddEmployeeLoanModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAdded}
            />

            <SuccessModal
                isOpen={!!successData}
                employee={successData}
                type={successType}
                onClose={() => setSuccessData(null)}
            />
        </div>
    );
};

export default EmployeeLoanGrid;