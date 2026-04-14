//////////////////////////****3***//////////////////////////////

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

const EmployeeLoanGrid = () => {
    const { employeeLoan, setEmployeeLoan} = useEmployeeLoan();
    // const { userWith_profile, setUserWith_profile } = useUserWithProfile();
    const [viewType, setViewType] = useState("grid");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        newJoiners: 0
    });

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        designation: "all",
        status: "all",
        dateRange: "all",
        sortBy: "name_asc",
        salaryRange: null,
        customDateRange: null
    });

    // Fetch employees on component mount
    useEffect(() => {
        fetchEmployeeSalaryAdvance();
    }, []);

    // const fetchEmployees = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await employeeAPI.getAll();
    //         setSalaryAdvance(response.data);
    //         calculateStats(response.data);
    //     } catch (error) {
    //         console.error("Error fetching employees:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchEmployeeSalaryAdvance = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const response = await employeeLoanAPI.getAll();
            setEmployeeLoan(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // const calculateStats = (employees) => {
    //     const today = new Date();
    //     const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    //
    //     const total = employees.length;
    //     const active = employees.filter(emp => emp.user?.is_active !== false).length;
    //     const inactive = employees.filter(emp => emp.user?.is_active === false).length;
    //     const newJoiners = employees.filter(emp => {
    //         const joinDate = new Date(emp.date_joined);
    //         return joinDate >= last7Days;
    //     }).length;
    //
    //     setStats({ total, active, inactive, newJoiners });
    // };

    const calculateStats = (data) => {
        const total = data.length;
        const approved = data.filter(d => d.is_approved).length;
        const pending = data.filter(d => !d.is_approved).length;

        const totalAmount = data.reduce((sum, d) => sum + parseFloat(d.amount), 0);

        setStats({
            total,
            approved,
            pending,
            totalAmount
        });
    };

    // ✅ useCallback দিয়ে functions wrap করুন
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleFilter = useCallback((newFilters) => {
        console.log("Filter updated:", newFilters);
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    // Filter employees based on search and filters

    // const filteredEmployees = useMemo(() => {
    //     if (!salaryAdvance || salaryAdvance.length === 0) return [];
    //
    //     let result = [...salaryAdvance];
    //     console.log("Total employees:", result.length);
    //
    //     // Apply search
    //     if (searchQuery.trim()) {
    //         const query = searchQuery.toLowerCase();
    //         result = result.filter(employee =>
    //             employee.name.toLowerCase().includes(query) ||
    //             employee.email.toLowerCase().includes(query) ||
    //             employee.phone_number?.toLowerCase().includes(query) ||
    //             employee.user?.phone_number?.toLowerCase().includes(query) ||
    //             employee.id.toString().includes(query) ||
    //             employee.role.toLowerCase().includes(query)
    //         );
    //         console.log("After search:", result.length);
    //     }
    //
    //     // Apply filters
    //     if (filters.designation !== "all") {
    //         result = result.filter(employee => employee.role === filters.designation);
    //         console.log("After designation filter:", result.length);
    //     }
    //
    //     if (filters.status !== "all") {
    //         if (filters.status === "active") {
    //             result = result.filter(employee => employee.user?.is_active !== false);
    //         } else if (filters.status === "inactive") {
    //             result = result.filter(employee => employee.user?.is_active === false);
    //         } else if (filters.status === "present") {
    //             result = result.filter(employee => employee.user?.is_present === true);
    //         } else if (filters.status === "absent") {
    //             result = result.filter(employee => employee.user?.is_present === false);
    //         }
    //         console.log("After status filter:", result.length);
    //     }
    //
    //     // Apply date range filter
    //     if (filters.dateRange !== "all") {
    //         const today = new Date();
    //         result = result.filter(employee => {
    //             const joinDate = new Date(employee.date_joined);
    //
    //             switch (filters.dateRange) {
    //                 case "today":
    //                     return joinDate.toDateString() === today.toDateString();
    //                 case "week":
    //                     const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    //                     return joinDate >= lastWeek;
    //                 case "month":
    //                     const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    //                     return joinDate >= lastMonth;
    //                 case "year":
    //                     const lastYear = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
    //                     return joinDate >= lastYear;
    //                 default:
    //                     return true;
    //             }
    //         });
    //         console.log("After date filter:", result.length);
    //     }
    //
    //     // Apply custom date range
    //     if (filters.customDateRange?.from && filters.customDateRange?.to) {
    //         const fromDate = new Date(filters.customDateRange.from);
    //         const toDate = new Date(filters.customDateRange.to);
    //
    //         result = result.filter(employee => {
    //             const joinDate = new Date(employee.date_joined);
    //             return joinDate >= fromDate && joinDate <= toDate;
    //         });
    //         console.log("After custom date filter:", result.length);
    //     }
    //
    //     // Apply salary range
    //     if (filters.salaryRange) {
    //         result = result.filter(employee => {
    //             const salary = employee.salary || 0;
    //             const passesMin = !filters.salaryRange.min || salary >= filters.salaryRange.min;
    //             const passesMax = !filters.salaryRange.max || salary <= filters.salaryRange.max;
    //             return passesMin && passesMax;
    //         });
    //         console.log("After salary filter:", result.length);
    //     }
    //
    //     // Apply sorting
    //     result.sort((a, b) => {
    //         switch (filters.sortBy) {
    //             case "name_asc":
    //                 return a.name.localeCompare(b.name);
    //             case "name_desc":
    //                 return b.name.localeCompare(a.name);
    //             case "date_asc":
    //                 return new Date(a.date_joined) - new Date(b.date_joined);
    //             case "date_desc":
    //                 return new Date(b.date_joined) - new Date(a.date_joined);
    //             case "salary_asc":
    //                 return (a.salary || 0) - (b.salary || 0);
    //             case "salary_desc":
    //                 return (b.salary || 0) - (a.salary || 0);
    //             default:
    //                 return 0;
    //         }
    //     });
    //
    //     console.log("Final filtered count:", result.length);
    //     return result;
    // }, [salaryAdvance, searchQuery, filters]);


    const filteredEmployees = useMemo(() => {
        if (!employeeLoan) return [];

        let result = [...employeeLoan];

        // 🔍 Search (by name, reason, or amount)
        if (searchQuery.trim()) {
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
                // Check both possible spellings just in case
                const designation = item.user_designation || item.user_drsignation;
                return designation?.toLowerCase() === filters.designation.toLowerCase();
            });
        }

        // ✅ Status Filter
        if (filters.status !== "all") {
            if (filters.status === "approved") {
                result = result.filter(item => item.is_approved);
            } else if (filters.status === "pending") {
                result = result.filter(item => !item.is_approved);
            }
        }

        // 📅 Date Filter (Quick options)
        if (filters.dateRange !== "all") {
            const today = new Date();
            result = result.filter(item => {
                const date = new Date(item.request_date);
                if (filters.dateRange === "today") {
                    return date.toDateString() === today.toDateString();
                }
                if (filters.dateRange === "week") {
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return date >= lastWeek;
                }
                if (filters.dateRange === "month") {
                    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return date >= lastMonth;
                }
                return true;
            });
        }

        // 📅 Custom Date Range Filter
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

        // 💰 Amount Range Filter
        if (filters.amountRange?.min || filters.amountRange?.max) {
            result = result.filter(item => {
                const amount = parseFloat(item.amount);
                const min = filters.amountRange.min ? parseFloat(filters.amountRange.min) : 0;
                const max = filters.amountRange.max ? parseFloat(filters.amountRange.max) : Infinity;
                return amount >= min && amount <= max;
            });
        }

        // 💰 Sorting
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "amount_asc":
                    return parseFloat(a.amount) - parseFloat(b.amount);
                case "amount_desc":
                    return parseFloat(b.amount) - parseFloat(a.amount);
                case "date_desc":
                    return new Date(b.request_date) - new Date(a.request_date);
                case "date_asc":
                    return new Date(a.request_date) - new Date(b.request_date);
                case "name_asc":
                    return a.user_name?.localeCompare(b.user_name);
                default:
                    return 0;
            }
        });

        return result;
    }, [employeeLoan, searchQuery, filters]);

    const handleEmployeeAdded = (newEmp) => {
        setEmployeeLoan(prev => [...prev, newEmp]);
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
    }, []);

    // const displayStats = [
    //     {
    //         title: 'Total Employee',
    //         count: stats.total.toString(),
    //         bgColor: 'bg-purple-600',
    //         textColor: 'text-white',
    //         icon: '👥',
    //         iconBg: 'bg-purple-800'
    //     },
    //     {
    //         title: 'Active',
    //         count: stats.active.toString(),
    //         bgColor: 'bg-teal-500',
    //         textColor: 'text-white',
    //         icon: '⭐',
    //         iconBg: 'bg-teal-700'
    //     },
    //     {
    //         title: 'Inactive',
    //         count: stats.inactive.toString(),
    //         bgColor: 'bg-gray-500',
    //         textColor: 'text-white',
    //         icon: '⚠️',
    //         iconBg: 'bg-gray-700'
    //     },
    //     {
    //         title: 'New Joiners',
    //         count: stats.newJoiners.toString(),
    //         bgColor: 'bg-blue-500',
    //         textColor: 'text-white',
    //         icon: '✅',
    //         iconBg: 'bg-blue-700'
    //     }
    // ];


    const displayStats = [
        {
            title: 'Total Advances',
            count: stats.total,
            // count: stats.total.toString(),
            bgColor: 'bg-purple-600',
            textColor: 'text-white',
            icon: '💰'
        },
        {
            title: 'Approved',
            // count: stats.approved.toString(),
            count: stats.approved,
            bgColor: 'bg-green-500',
            textColor: 'text-white',
            icon: '✅'
        },
        {
            title: 'Pending',
            count: stats.pending,
            // count: stats.pending.toString(),
            bgColor: 'bg-yellow-500',
            textColor: 'text-white',
            icon: '⏳'
        },
        {
            title: 'Total Amount',
            count: `৳ ${stats.totalAmount || 0}`,
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            icon: '💵'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg"/>
                    <p className="mt-4 text-gray-600">Loading employees...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <EmployeeLoanHeader
                viewType={viewType}
                setViewType={setViewType}
                onAddClick={() => setIsAddOpen(true)}
            />

            {/* Stats */}
            <div className="mb-6">
                <EmployeeStats stats={displayStats}/>
            </div>

            {/* Search and Filter */}
            <div className="mb-6">
                <EmployeeLoanSearchFilter
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                />
            </div>

            {/* Main Content - Grid or List View */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                        {viewType === "grid" ? "Employee Grid" : "Employee List"}
                    </h2>
                    <div className="text-sm text-gray-500">
                        Showing {filteredEmployees.length} of {employeeLoan?.length || 0} employees
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredEmployees.map(emp => (
                            // <EmployeeSalaryAdvanceCard
                            //     key={emp.id}
                            //     advance={{
                            //         ...emp,
                            //         id: emp.id,
                            //         name: emp.name,
                            //         designation: emp.role,
                            //         phone_number: emp.phone_number || "N/A",
                            //         joinDate: emp.date_joined?.split("T")[0],
                            //         image: emp.profile_picture,
                            //         user: emp.user
                            //     }}
                            //     onEdit={handleEmployeeUpdated}
                            //     onDelete={handleEmployeeUpdated}
                            // />


                            <EmployeeLoanCard
                                key={emp.id}
                                advance={emp}   // ✅ ONLY THIS
                                onEdit={handleEmployeeUpdated}
                                onDelete={handleEmployeeUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <EmployeeLoanList
                        advance={filteredEmployees}
                        onEdit={handleEmployeeUpdated}
                    />
                )}

                {/* Empty State */}
                {filteredEmployees.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.268A10.02 10.02 0 0122 12c0 3.22-1.64 6.065-4.14 7.8M3.86 19.8A10.02 10.02 0 012 12c0-3.22 1.64-6.065 4.14-7.8"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchQuery || Object.values(filters).some(f => f !== "all" && f !== null)
                                ? "Try changing your search or filter criteria"
                                : "Add your first employee to get started"
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {(searchQuery || Object.values(filters).some(f => f !== "all" && f !== null)) && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setFilters({
                                            designation: "all",
                                            status: "all",
                                            dateRange: "all",
                                            sortBy: "name_asc",
                                            salaryRange: null,
                                            customDateRange: null
                                        });
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Clear Filters
                                </button>
                            )}
                            <button
                                onClick={() => setIsAddOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add Salary Advanc
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Employee Modal */}
            <AddEmployeeLoanModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleEmployeeAdded}
            />

            {/* Success Modal */}
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