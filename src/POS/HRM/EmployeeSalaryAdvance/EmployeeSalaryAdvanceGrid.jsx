import React, {useState, useEffect, useMemo, useCallback} from 'react';
import EmployeeSalaryAdvanceCard from "./EmployeeSalaryAdvanceCard";
import EmployeeSalaryAdvanceList from "./EmployeeSalaryAdvanceList";
import AddEmployeeSalaryAdvanceModal from "./AddEmployeeSalaryAdvanceModal";
import SuccessModal from "../../components/SuccessModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import {salaryAdvanceAPI} from "../../../context_or_provider/pos/EmployeeSalaryAdvance/salary_advanceAPI";
import {useSalaryAdvances} from "../../../context_or_provider/pos/EmployeeSalaryAdvance/salary_advance_provider";
import { Banknote, CheckCircle, Clock, Wallet, Briefcase, Activity, Calendar, ArrowUpDown } from 'lucide-react';
import { DESIGNATION_OPTIONS } from "../EmployeeList/constant/filters";
import useModuleData from "../../hooks/useModuleData";
import { getBrandedVoucher } from "../../utils/printTemplates";
import { getAdvancePrintLayout } from "./AdvancePrintLayout";

const EmployeeSalaryAdvanceGrid = ({ 
    viewType, 
    isAddOpen, 
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { setSalaryAdvance } = useSalaryAdvances();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by name, reason, or amount...",
                filtersConfig: [
                    { key: "designation", label: "Designation", icon: <Briefcase className="w-3.5 h-3.5" />, options: DESIGNATION_OPTIONS },
                    { key: "status", label: "Status", icon: <Activity className="w-3.5 h-3.5" />, options: [
                        { value: "all", label: "All Status" }, { value: "approved", label: "Approved" }, { value: "pending", label: "Pending" }
                    ]},
                    { key: "dateRange", label: "Date Range", icon: <Calendar className="w-3.5 h-3.5" />, options: [
                        { value: "all", label: "All Time" }, { value: "today", label: "Today" }, { value: "week", label: "This Week" }, { value: "month", label: "This Month" }
                    ]},
                    { key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: [
                        { value: "date_desc", label: "Newest First" }, { value: "date_asc", label: "Oldest First" }, { value: "amount_desc", label: "Amount (High-Low)" }, { value: "amount_asc", label: "Amount (Low-High)" }
                    ]}
                ],
                advancedConfig: [
                    { key: "amountRange", type: "range", label: "Amount Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
                    { key: "customDateRange", type: "date-range", label: "Custom Date Range" }
                ]
            });
        }
    }, [setFilterConfig]);

    // 2. Stats calculation logic
    const calculateStats = useCallback((data) => {
        const total = data.length;
        const approved = data.filter(d => d.is_approved).length;
        const pending = data.filter(d => !d.is_approved).length;
        const totalAmount = data.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

        return [
            { title: 'Total Requests', count: total, bgColor: 'bg-brand-primary', icon: <Banknote size={24} /> },
            { title: 'Approved', count: approved, bgColor: 'bg-emerald-500', icon: <CheckCircle size={24} /> },
            { title: 'Pending', count: pending, bgColor: 'bg-amber-500', icon: <Clock size={24} /> },
            { title: 'Total Amount', count: `৳ ${totalAmount.toLocaleString()}`, bgColor: 'bg-indigo-500', icon: <Wallet size={24} /> }
        ];
    }, []);

    // 3. Centralized Hook
    const { 
        filteredData: filteredEmployees, 
        rawData: salaryAdvance, 
        loading, 
        refresh 
    } = useModuleData({
        apiFetch: salaryAdvanceAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['user_name', 'reason', 'amount'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];
            if (f.designation && f.designation !== "all") {
                result = result.filter(item => (item.user_designation || item.user_drsignation)?.toLowerCase() === f.designation.toLowerCase());
            }
            if (f.status && f.status !== "all") {
                if (f.status === "approved") result = result.filter(item => item.is_approved);
                else if (f.status === "pending") result = result.filter(item => !item.is_approved);
            }
            if (f.dateRange && f.dateRange !== "all") {
                const today = new Date();
                result = result.filter(item => {
                    const date = new Date(item.request_date);
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
                    if (f.sortBy === "amount_asc") return parseFloat(a.amount) - parseFloat(b.amount);
                    if (f.sortBy === "amount_desc") return parseFloat(b.amount) - parseFloat(a.amount);
                    if (f.sortBy === "date_desc") return new Date(b.request_date) - new Date(a.request_date);
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (salaryAdvance) setSalaryAdvance(salaryAdvance);
    }, [salaryAdvance, setSalaryAdvance]);

    const handleEmployeeAdded = (newEmp) => {
        setIsAddOpen(false);
        setSuccessType('create');
        setSuccessData(newEmp);
        refresh();
    };

    const handleEmployeeUpdated = useCallback((updatedData) => {
        refresh();
        if (updatedData) {
            setSuccessType('update');
            setSuccessData(updatedData);
        }
    }, [refresh]);

    const handlePrint = (employee) => {
        const tableContent = getAdvancePrintLayout(employee);
        const fullHTML = getBrandedVoucher("Salary Advance", tableContent, employee.id);
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">Loading advance records...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Banknote size={16} className="text-brand-primary" />
                        {viewType === "grid" ? "Salary Advance Grid" : "Salary Advance Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredEmployees.length} OF {salaryAdvance?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEmployees.map(emp => (
                            <EmployeeSalaryAdvanceCard key={emp.id} advance={emp} onEdit={handleEmployeeUpdated} onDelete={handleEmployeeUpdated} />
                        ))}
                    </div>
                ) : (
                    <EmployeeSalaryAdvanceList advance={filteredEmployees} onEdit={handleEmployeeUpdated} />
                )}

                {filteredEmployees.length === 0 && (
                    <EmptyState 
                        icon={<Banknote size={32} />}
                        title="No advance records found"
                        description="There are no salary advance records to display at this time."
                        actionText="Apply For Advance"
                        onAction={() => setIsAddOpen(true)}
                    />
                )}
            </div>

            <AddEmployeeSalaryAdvanceModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleEmployeeAdded} />
            
            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)}
                title={successType === 'update' ? 'Advance Updated' : 'Advance Recorded'}
                subtitle="Transaction Completed Successfully"
                details={[
                    { label: "Employee", value: successData?.user_name },
                    { label: "Amount", value: `৳${Number(successData?.amount).toLocaleString()}` },
                    { label: "Date", value: new Date(successData?.request_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
                ]}
                onPrint={() => handlePrint(successData)}
                printText="Print Voucher"
            />
        </div>
    );
};

export default EmployeeSalaryAdvanceGrid;
