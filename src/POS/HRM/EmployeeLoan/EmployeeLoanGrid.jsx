import React, {useState, useEffect, useMemo, useCallback} from 'react';
import EmployeeLoanHeader from "./EmployeeLoanHeader";
import EmployeeStats from "./EmployeeStats";
import EmployeeLoanSearchFilter from "./EmployeeLoanSearchFilter";
import EmployeeLoanCard from "./EmployeeLoanCard";
import EmployeeLoanList from "./EmployeeLoanList";
import AddEmployeeLoanModal from "./AddEmployeeLoanModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {employeeLoanAPI} from "../../../context_or_provider/pos/EmployeeLoan/employee_loanAPI";
import {useEmployeeLoan} from "../../../context_or_provider/pos/EmployeeLoan/employee_loan_provider";

const EmployeeLoanGrid = ({ viewType, isAddOpen, setIsAddOpen }) => {
    const { employeeLoan, setEmployeeLoan } = useEmployeeLoan();

    // const [viewType, setViewType] = useState("grid");
    // const [isAddOpen, setIsAddOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        total: 0,
        paid: 0,
        unpaid: 0,
        totalAmount: 0
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        designation: "all",
        status: "all",
        dateRange: "all",
        sortBy: "date_desc",
        amountRange: null,
        customDateRange: null
    });

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async (showLoading = true) => {
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
    };

    // ✅ FIXED stats
    const calculateStats = (data) => {
        const total = data.length;
        const paid = data.filter(d => d.is_fully_paid).length;
        const unpaid = data.filter(d => !d.is_fully_paid).length;
        const totalAmount = data.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

        setStats({ total, paid, unpaid, totalAmount });
    };

    const handleSearch = useCallback((q) => setSearchQuery(q), []);
    const handleFilter = useCallback((f) => {
        setFilters(prev => ({ ...prev, ...f }));
    }, []);

    // ✅ FILTER UPDATED FOR LOAN
    const filteredEmployees = useMemo(() => {
        if (!employeeLoan) return [];

        let result = [...employeeLoan];

        // 🔍 search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.user_name?.toLowerCase().includes(q) ||
                item.reason?.toLowerCase().includes(q) ||
                item.amount?.toString().includes(q)
            );
        }

        // designation
        if (filters.designation !== "all") {
            result = result.filter(item =>
                item.user_designation?.toLowerCase() === filters.designation.toLowerCase()
            );
        }

        // ✅ status (paid/unpaid)
        if (filters.status !== "all") {
            if (filters.status === "paid") {
                result = result.filter(item => item.is_fully_paid);
            } else if (filters.status === "unpaid") {
                result = result.filter(item => !item.is_fully_paid);
            }
        }

        // 📅 loan_date filter
        if (filters.dateRange !== "all") {
            const today = new Date();
            result = result.filter(item => {
                const date = new Date(item.loan_date);

                if (filters.dateRange === "today") {
                    return date.toDateString() === today.toDateString();
                }
                if (filters.dateRange === "week") {
                    return date >= new Date(today - 7 * 86400000);
                }
                if (filters.dateRange === "month") {
                    return date >= new Date(today - 30 * 86400000);
                }
                return true;
            });
        }

        // sorting
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "amount_asc":
                    return parseFloat(a.amount) - parseFloat(b.amount);
                case "amount_desc":
                    return parseFloat(b.amount) - parseFloat(a.amount);
                case "date_asc":
                    return new Date(a.loan_date) - new Date(b.loan_date);
                case "date_desc":
                    return new Date(b.loan_date) - new Date(a.loan_date);
                default:
                    return 0;
            }
        });

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
    }, []);

    const displayStats = [
        { title: 'Total Loans', count: stats.total, bgColor: 'bg-purple-600', textColor: 'text-white', icon: '💰' },
        { title: 'Paid', count: stats.paid, bgColor: 'bg-green-500', textColor: 'text-white', icon: '✅' },
        { title: 'Unpaid', count: stats.unpaid, bgColor: 'bg-yellow-500', textColor: 'text-white', icon: '⏳' },
        { title: 'Total Amount', count: `৳ ${stats.totalAmount}`, bgColor: 'bg-blue-500', textColor: 'text-white', icon: '💵' }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg"/>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/*<EmployeeLoanHeader*/}
            {/*    viewType={viewType}*/}
            {/*    setViewType={setViewType}*/}
            {/*    onAddClick={() => setIsAddOpen(true)}*/}
            {/*/>*/}

            <div className="my-6">
                <EmployeeStats stats={displayStats}/>
            </div>

            <EmployeeLoanSearchFilter
                onSearch={handleSearch}
                onFilter={handleFilter}
            />

            <div className="bg-white p-4 rounded-xl shadow mt-4">

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {filteredEmployees.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No Loan Found
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