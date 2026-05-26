import React, {useState, useEffect, useMemo, useCallback} from 'react';
import EmployeeSalaryPayslipCard from "./EmployeeSalaryPayslipCard";
import EmployeeSalaryPayslipList from "./EmployeeSalaryPayslipList";
import AddEmployeeSalaryPayslipModal from "./AddEmployeeSalaryPayslipModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {salaryPayslipAPI} from "../../../context_or_provider/pos/EmployeeSalaryPayslip/salary_payslipAPI";
import {useSalaryPaySlip} from "../../../context_or_provider/pos/EmployeeSalaryPayslip/salary_payslip_provider";
import { Banknote, CheckCircle, Clock, Wallet, Search, Filter, Calendar, Briefcase, Activity, ArrowUpDown } from 'lucide-react';
import { DESIGNATION_OPTIONS } from "../EmployeeList/constant/filters";

const EmployeeSalaryPayslipGrid = ({ 
    viewType, 
    isAddOpen, 
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { salaryPaySlip, setSalaryPaySlip} = useSalaryPaySlip();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');
    const [loading, setLoading] = useState(true);

    // Provide filter configuration to parent on mount
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by name, reason, or amount...",
                filtersConfig: [
                    { 
                        key: "designation", 
                        label: "Designation", 
                        icon: <Briefcase className="w-3.5 h-3.5" />, 
                        options: DESIGNATION_OPTIONS 
                    },
                    { 
                        key: "status", 
                        label: "Status", 
                        icon: <Activity className="w-3.5 h-3.5" />, 
                        options: [
                            { value: "all", label: "All Status" },
                            { value: "approved", label: "Approved" },
                            { value: "pending", label: "Pending" }
                        ] 
                    },
                    { 
                        key: "dateRange", 
                        label: "Date Range", 
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
                    { key: "amountRange", type: "range", label: "Amount Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
                    { key: "customDateRange", type: "date-range", label: "Custom Date Range" }
                ]
            });
        }
    }, [setFilterConfig]);

    const fetchEmployeeSalaryAdvance = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const response = await salaryPayslipAPI.getAll();
            setSalaryPaySlip(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching salary payslips:", error);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [setSalaryPaySlip]);

    useEffect(() => {
        fetchEmployeeSalaryAdvance();
    }, [fetchEmployeeSalaryAdvance]);

    const calculateStats = useCallback((data) => {
        const total = data.length;
        const approved = data.filter(d => d.is_approved).length;
        const pending = data.filter(d => !d.is_approved).length;
        const totalAmount = data.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

        const displayStats = [
            {
                title: 'Total Requests',
                count: total,
                bgColor: 'bg-brand-primary',
                icon: <Banknote size={24} />
            },
            {
                title: 'Approved',
                count: approved,
                bgColor: 'bg-emerald-500',
                icon: <CheckCircle size={24} />
            },
            {
                title: 'Pending',
                count: pending,
                bgColor: 'bg-amber-500',
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
        if (!salaryPaySlip) return [];

        let result = [...salaryPaySlip];

        // 🔍 Search
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.user_name?.toLowerCase().includes(query) ||
                item.reason?.toLowerCase().includes(query) ||
                item.amount?.toString().includes(query)
            );
        }

        // 🏢 Designation Filter
        if (filters.designation && filters.designation !== "all") {
            result = result.filter(item => {
                const designation = item.user_designation || item.user_drsignation;
                return designation?.toLowerCase() === filters.designation.toLowerCase();
            });
        }

        // ✅ Status Filter
        if (filters.status && filters.status !== "all") {
            if (filters.status === "approved") result = result.filter(item => item.is_approved);
            else if (filters.status === "pending") result = result.filter(item => !item.is_approved);
        }

        // 📅 Date Filter
        if (filters.dateRange && filters.dateRange !== "all") {
            const today = new Date();
            result = result.filter(item => {
                const date = new Date(item.request_date);
                if (filters.dateRange === "today") return date.toDateString() === today.toDateString();
                if (filters.dateRange === "week") return date >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (filters.dateRange === "month") return date >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                return true;
            });
        }

        // 📅 Custom Date Range
        if (filters.customDateRange?.from && filters.customDateRange?.to) {
            const fromDate = new Date(filters.customDateRange.from);
            fromDate.setHours(0, 0, 0, 0);
            const toDate = new Date(filters.customDateRange.to);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter(item => {
                const date = new Date(item.request_date);
                return date >= fromDate && date <= toDate;
            });
        }

        // 💰 Amount Range
        if (filters.amountRange) {
            result = result.filter(item => {
                const amount = parseFloat(item.amount);
                const min = filters.amountRange.min ? parseFloat(filters.amountRange.min) : 0;
                const max = filters.amountRange.max ? parseFloat(filters.amountRange.max) : Infinity;
                return amount >= min && amount <= max;
            });
        }

        // 💰 Sorting
        if (filters.sortBy) {
            result.sort((a, b) => {
                switch (filters.sortBy) {
                    case "amount_asc": return parseFloat(a.amount) - parseFloat(b.amount);
                    case "amount_desc": return parseFloat(b.amount) - parseFloat(a.amount);
                    case "date_desc": return new Date(b.request_date) - new Date(a.request_date);
                    case "date_asc": return new Date(a.request_date) - new Date(b.request_date);
                    case "name_asc": return (a.user_name || "").localeCompare(b.user_name || "");
                    default: return 0;
                }
            });
        }

        return result;
    }, [salaryPaySlip, searchQuery, filters]);

    const handleEmployeeAdded = (newEmp) => {
        setSalaryPaySlip(prev => [...prev, newEmp]);
        setIsAddOpen(false);
        setSuccessType('create');
        setSuccessData(newEmp);
        fetchEmployeeSalaryAdvance();
    };

    const handleEmployeeUpdated = useCallback((updatedData) => {
        fetchEmployeeSalaryAdvance(false);
        if (updatedData) {
            setSuccessType('update');
            setSuccessData(updatedData);
        }
    }, [fetchEmployeeSalaryAdvance, setSalaryPaySlip]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 text-sm">Loading payslip records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Content Viewport */}
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Banknote size={16} className="text-brand-primary" />
                        {viewType === "grid" ? "Salary Payslip Grid" : "Salary Payslip Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredEmployees.length} OF {salaryPaySlip?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEmployees.map(emp => (
                            <EmployeeSalaryPayslipCard
                                key={emp.id}
                                advance={emp}
                                onEdit={handleEmployeeUpdated}
                                onDelete={handleEmployeeUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <EmployeeSalaryPayslipList
                        advance={filteredEmployees}
                        onEdit={handleEmployeeUpdated}
                    />
                )}

                {/* Empty State Viewport */}
                {filteredEmployees.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <Banknote className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800 mb-1">No payslip records found</h3>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
                            No records match your current filtering criteria. Try resetting the filters.
                        </p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                        >
                            Create New Payslip
                        </button>
                    </div>
                )}
            </div>

            <AddEmployeeSalaryPayslipModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleEmployeeAdded}
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

export default EmployeeSalaryPayslipGrid;