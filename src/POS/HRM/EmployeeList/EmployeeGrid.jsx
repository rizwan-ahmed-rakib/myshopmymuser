import { employeeAPI } from "../../../context_or_provider/pos/profile/profileupdate";
import LoadingSpinner from "./LoadingSpinner";
import { Users, ShieldCheck, UserMinus, UserPlus, Briefcase, Activity, Calendar, ArrowUpDown } from 'lucide-react';
import { DESIGNATION_OPTIONS, STATUS_OPTIONS, DATE_FILTER_OPTIONS, SORT_OPTIONS } from "./constant/filters";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useUserWithProfile} from "../../../context_or_provider/pos/profile/userWithProfile";
import EmployeeCard from "./EmployeeCard";
import EmployeeList from "./EmployeeList";
import AddEmployeeModal from "./AddEmployeeModal";
import SuccessModal from "./SuccessModal";

/**
 * EmployeeGrid - Displays the list of employees in either grid or list view.
 * Fully integrated with ModuleShell backbone for search, filter, and stats.
 */
const EmployeeGrid = ({ 
    viewType, 
    isAddOpen, 
    setIsAddOpen, 
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { userWith_profile, setUserWith_profile } = useUserWithProfile();
    const [successData, setSuccessData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Provide filter configuration to parent on mount
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by name, email, phone, or ID...",
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
                        options: STATUS_OPTIONS 
                    },
                    { 
                        key: "dateRange", 
                        label: "Date Joined", 
                        icon: <Calendar className="w-3.5 h-3.5" />, 
                        options: DATE_FILTER_OPTIONS 
                    },
                    { 
                        key: "sortBy", 
                        label: "Sort By", 
                        icon: <ArrowUpDown className="w-3.5 h-3.5" />, 
                        options: SORT_OPTIONS 
                    }
                ],
                advancedConfig: [
                    { key: "salaryRange", type: "range", label: "Salary Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
                    { key: "customDateRange", type: "date-range", label: "Custom Date Range" }
                ]
            });
        }
    }, [setFilterConfig]);

    // Stata calculation wrapped in useCallback to prevent render loops
    const calculateStats = useCallback((employees) => {
        const today = new Date();
        const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const total = employees.length;
        const active = employees.filter(emp => emp.user?.is_active !== false).length;
        const inactive = employees.filter(emp => emp.user?.is_active === false).length;
        const newJoiners = employees.filter(emp => {
            const joinDate = new Date(emp.date_joined);
            return joinDate >= last7Days;
        }).length;

        const displayStats = [
            {
                title: 'Total Employee',
                count: total.toString(),
                bgColor: 'bg-brand-primary',
                icon: <Users size={24} />
            },
            {
                title: 'Active',
                count: active.toString(),
                bgColor: 'bg-emerald-500',
                icon: <ShieldCheck size={24} />
            },
            {
                title: 'Inactive',
                count: inactive.toString(),
                bgColor: 'bg-rose-500',
                icon: <UserMinus size={24} />
            },
            {
                title: 'New Joiners',
                count: newJoiners.toString(),
                bgColor: 'bg-amber-500',
                icon: <UserPlus size={24} />
            }
        ];

        // Lift statistics up to the ModuleShell if the callback is provided
        if (onStatsLoaded) {
            onStatsLoaded(displayStats);
        }
    }, [onStatsLoaded]);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const response = await employeeAPI.getAll();
            setUserWith_profile(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    }, [setUserWith_profile, calculateStats]);

    // Fetch employees on component mount
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Filter employees based on search and filters
    const filteredEmployees = useMemo(() => {
        if (!userWith_profile || userWith_profile.length === 0) return [];

        let result = [...userWith_profile];

        // Apply search
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(employee =>
                employee.name?.toLowerCase().includes(query) ||
                employee.email?.toLowerCase().includes(query) ||
                employee.phone_number?.toLowerCase().includes(query) ||
                employee.user?.phone_number?.toLowerCase().includes(query) ||
                employee.id?.toString().includes(query) ||
                employee.role?.toLowerCase().includes(query)
            );
        }

        // Apply filters
        if (filters.designation && filters.designation !== "all") {
            result = result.filter(employee => employee.role === filters.designation);
        }

        if (filters.status && filters.status !== "all") {
            if (filters.status === "active") {
                result = result.filter(employee => employee.user?.is_active !== false);
            } else if (filters.status === "inactive") {
                result = result.filter(employee => employee.user?.is_active === false);
            } else if (filters.status === "present") {
                result = result.filter(employee => employee.user?.is_present === true);
            } else if (filters.status === "absent") {
                result = result.filter(employee => employee.user?.is_present === false);
            }
        }

        // Apply date range filter
        if (filters.dateRange && filters.dateRange !== "all") {
            const today = new Date();
            result = result.filter(employee => {
                const joinDate = new Date(employee.date_joined);

                switch (filters.dateRange) {
                    case "today":
                        return joinDate.toDateString() === today.toDateString();
                    case "week":
                        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return joinDate >= lastWeek;
                    case "month":
                        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return joinDate >= lastMonth;
                    case "year":
                        const lastYear = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
                        return joinDate >= lastYear;
                    default:
                        return true;
                }
            });
        }

        // Apply custom date range
        if (filters.customDateRange?.from && filters.customDateRange?.to) {
            const fromDate = new Date(filters.customDateRange.from);
            const toDate = new Date(filters.customDateRange.to);

            result = result.filter(employee => {
                const joinDate = new Date(employee.date_joined);
                return joinDate >= fromDate && joinDate <= toDate;
            });
        }

        // Apply salary range
        if (filters.salaryRange) {
            result = result.filter(employee => {
                const salary = employee.salary || 0;
                const passesMin = !filters.salaryRange.min || salary >= filters.salaryRange.min;
                const passesMax = !filters.salaryRange.max || salary <= filters.salaryRange.max;
                return passesMin && passesMax;
            });
        }

        // Apply sorting
        if (filters.sortBy) {
            result.sort((a, b) => {
                switch (filters.sortBy) {
                    case "name_asc":
                        return (a.name || "").localeCompare(b.name || "");
                    case "name_desc":
                        return (b.name || "").localeCompare(a.name || "");
                    case "date_asc":
                        return new Date(a.date_joined) - new Date(b.date_joined);
                    case "date_desc":
                        return new Date(b.date_joined) - new Date(a.date_joined);
                    case "salary_asc":
                        return (a.salary || 0) - (b.salary || 0);
                    case "salary_desc":
                        return (b.salary || 0) - (a.salary || 0);
                    default:
                        return 0;
                }
            });
        }

        return result;
    }, [userWith_profile, searchQuery, filters]);

    const handleEmployeeAdded = (newEmp) => {
        setUserWith_profile(prev => [...prev, newEmp]);
        setIsAddOpen(false);
        setSuccessData(newEmp);
        fetchEmployees();
    };

    const handleEmployeeUpdated = useCallback(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Localized content loader instead of taking over the full screen
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 text-sm">Loading employees...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            
            {/* Main Content Viewport */}
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Users size={16} className="text-brand-primary" />
                        {viewType === "grid" ? "Employee Directory" : "Employee Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredEmployees.length} OF {userWith_profile?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEmployees.map(emp => (
                            <EmployeeCard
                                key={emp.id}
                                employee={{
                                    ...emp,
                                    id: emp.id,
                                    name: emp.name,
                                    designation: emp.role,
                                    phone_number: emp.phone_number || "N/A",
                                    joinDate: emp.date_joined?.split("T")[0],
                                    image: emp.profile_picture,
                                    user: emp.user
                                }}
                                onEdit={handleEmployeeUpdated}
                                onDelete={handleEmployeeUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <EmployeeList
                        employees={filteredEmployees}
                        onUpdate={handleEmployeeUpdated}
                    />
                )}

                {/* Empty State Viewport */}
                {filteredEmployees.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800 mb-1">No employees found</h3>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
                            We couldn't find any employee matching your current search or filter criteria.
                        </p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                        >
                            Add New Employee
                        </button>
                    </div>
                )}
            </div>

            {/* Add Employee Modal */}
            <AddEmployeeModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleEmployeeAdded}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={!!successData}
                employee={successData}
                onClose={() => setSuccessData(null)}
            />
        </div>
    );
};

export default EmployeeGrid;