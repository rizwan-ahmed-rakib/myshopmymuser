import React, {useState, useEffect, useMemo, useCallback} from 'react';
import EmployeeLoanCard from "./EmployeeLoanCard";
import EmployeeLoanList from "./EmployeeLoanList";
import AddEmployeeLoanModal from "./AddEmployeeLoanModal";
// import SuccessModal from "./SuccessModal";
// import LoadingSpinner from "./LoadingSpinner";
import SuccessModal from "../../components/SuccessModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import {getBrandedVoucher} from "../../utils/printTemplates";
import {employeeLoanAPI} from "../../../context_or_provider/pos/EmployeeLoan/employee_loanAPI";
import {useEmployeeLoan} from "../../../context_or_provider/pos/EmployeeLoan/employee_loan_provider";
import {
    HandCoins,
    CheckCircle,
    Clock,
    Wallet,
    Briefcase,
    Activity,
    Calendar,
    ArrowUpDown,
    Banknote
} from 'lucide-react';
import {DESIGNATION_OPTIONS} from "../EmployeeList/constant/filters";
import useModuleData from "../../hooks/useModuleData";
import {getLoanPrintLayout} from "./LoanPrintLayout";

const EmployeeLoanGrid = ({
                              viewType,
                              isAddOpen,
                              setIsAddOpen,
                              onStatsLoaded,
                              searchQuery,
                              filters,
                              setFilterConfig
                          }) => {
    const {setEmployeeLoan} = useEmployeeLoan();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by employee name or reason...",
                filtersConfig: [
                    {
                        key: "designation",
                        label: "Designation",
                        icon: <Briefcase className="w-3.5 h-3.5"/>,
                        options: DESIGNATION_OPTIONS
                    },
                    {
                        key: "status", label: "Loan Status", icon: <Activity className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Status"}, {value: "paid", label: "Paid"}, {
                                value: "unpaid",
                                label: "Unpaid"
                            }
                        ]
                    },
                    {
                        key: "dateRange", label: "Loan Date", icon: <Calendar className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Time"}, {value: "today", label: "Today"}, {
                                value: "week",
                                label: "This Week"
                            }, {value: "month", label: "This Month"}
                        ]
                    },
                    {
                        key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5"/>, options: [
                            {value: "date_desc", label: "Newest First"}, {
                                value: "date_asc",
                                label: "Oldest First"
                            }, {value: "amount_desc", label: "Amount (High-Low)"}, {
                                value: "amount_asc",
                                label: "Amount (Low-High)"
                            }
                        ]
                    }
                ],
                advancedConfig: [
                    {
                        key: "amountRange",
                        type: "range",
                        label: "Loan Amount Range (৳)",
                        minPlaceholder: "Min",
                        maxPlaceholder: "Max"
                    },
                    {key: "customDateRange", type: "date-range", label: "Custom Date Range"}
                ]
            });
        }
    }, [setFilterConfig]);

    // 2. Stats calculation logic
    const calculateStats = useCallback((data) => {
        const total = data.length;
        const paid = data.filter(d => d.is_fully_paid).length;
        const unpaid = data.filter(d => !d.is_fully_paid).length;
        const totalAmount = data.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

        return [
            {title: 'Total Loans', count: total, bgColor: 'bg-brand-primary', icon: <HandCoins size={24}/>},
            {title: 'Paid', count: paid, bgColor: 'bg-emerald-500', icon: <CheckCircle size={24}/>},
            {title: 'Unpaid', count: unpaid, bgColor: 'bg-rose-500', icon: <Clock size={24}/>},
            {
                title: 'Total Amount',
                count: `৳ ${totalAmount.toLocaleString()}`,
                bgColor: 'bg-indigo-500',
                icon: <Wallet size={24}/>
            }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredEmployees,
        rawData: employeeLoan,
        loading,
        refresh
    } = useModuleData({
        apiFetch: employeeLoanAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['user_name', 'reason', 'amount'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];
            if (f.designation && f.designation !== "all") {
                result = result.filter(item => item.user_designation?.toLowerCase() === f.designation.toLowerCase());
            }
            if (f.status && f.status !== "all") {
                if (f.status === "paid") result = result.filter(item => item.is_fully_paid);
                else if (f.status === "unpaid") result = result.filter(item => !item.is_fully_paid);
            }
            if (f.dateRange && f.dateRange !== "all") {
                const today = new Date();
                result = result.filter(item => {
                    const date = new Date(item.loan_date);
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
                    if (f.sortBy === "date_desc") return new Date(b.loan_date) - new Date(a.loan_date);
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (employeeLoan) setEmployeeLoan(employeeLoan);
    }, [employeeLoan, setEmployeeLoan]);

    const handleAdded = (newItem) => {
        setIsAddOpen(false);
        setSuccessType("create");
        setSuccessData(newItem);
        refresh();
    };

    const handleUpdated = useCallback((data) => {
        refresh();
        if (data) {
            setSuccessType("update");
            setSuccessData(data);
        }
    }, [refresh]);

    const handlePrint = (employee) => {
        const tableContent = getLoanPrintLayout(employee);
        const fullHTML = getBrandedVoucher("Loan", tableContent, employee.id);
        const printWindow = window.open("", "_blank", "width=850,height=900");
        printWindow.document.write(fullHTML);
        printWindow.document.close();
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg"/>
            <p className="mt-4 text-gray-500 text-sm">Loading loan records...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <HandCoins size={16} className="text-brand-primary"/>
                        {viewType === "grid" ? "Loan Directory" : "Loan Table"}
                    </h2>
                    <div
                        className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredEmployees.length} OF {employeeLoan?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEmployees.map(emp => (
                            <EmployeeLoanCard key={emp?.id} advance={emp} onEdit={handleUpdated}
                                              onDelete={handleUpdated}/>
                        ))}
                    </div>
                ) : (
                    <EmployeeLoanList advance={filteredEmployees} onEdit={handleUpdated}/>
                )}

                {filteredEmployees.length === 0 && (
                    // <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                    //     <HandCoins className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                    //     <h3 className="text-base font-bold text-gray-800 mb-1">No loan records found</h3>
                    //     <button onClick={() => setIsAddOpen(true)} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold mt-4 shadow-md active:scale-95">Apply For Loan</button>
                    // </div>
                    <EmptyState
                        icon={<Banknote size={32}/>}
                        title="No loan records found"
                        description="There are no loan records to display at this time."
                        actionText="Apply For loan"
                        onAction={() => setIsAddOpen(true)}
                    />

                )}
            </div>

            <AddEmployeeLoanModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleAdded}/>
            {/*<SuccessModal isOpen={!!successData} employee={successData} type={successType}*/}
            {/*              onClose={() => setSuccessData(null)}/>*/}

            <SuccessModal
                isOpen={!!successData}
                onClose={() => setSuccessData(null)}
                title={successType === 'update' ? 'Loan Updated' : 'Loan Recorded'}
                subtitle="Transaction Completed Successfully"
                details={[
                    {label: "Employee", value: successData?.user_name},
                    {label: "Amount", value: `৳${Number(successData?.amount).toLocaleString()}`},
                    {
                        label: "Date",
                        value: new Date(successData?.request_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })
                    }
                ]}
                onPrint={() => handlePrint(successData)}
                printText="Print Voucher"
            />
        </div>
    );
};

export default EmployeeLoanGrid;
