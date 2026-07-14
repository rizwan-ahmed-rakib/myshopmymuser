import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useUserWithProfile } from "../../../context_or_provider/pos/profile/userWithProfile";
import AddEmployeeModal from "./AddEmployeeModal";
import SuccessModal from "../../components/SuccessModal";
import { employeeAPI } from "../../../context_or_provider/pos/profile/profileupdate";
import { Users, ShieldCheck, UserMinus, UserPlus, Briefcase, Activity, Calendar, ArrowUpDown } from 'lucide-react';
import { DESIGNATION_OPTIONS, STATUS_OPTIONS, DATE_FILTER_OPTIONS, SORT_OPTIONS } from "./constant/filters";
import useModuleData from "../../hooks/useModuleData";
import EmployeeCard from "./EmployeeCard";
import EmployeeList from "./EmployeeList";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * EmployeeGrid - Displays the list of employees in either grid or list view.
 * Fully integrated with ModuleShell backbone using the centralized useModuleData hook.
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
    const { setAllProfile } = useUserWithProfile();
    const [successData, setSuccessData] = useState(null);

    // 1. Provide filter configuration to parent on mount
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by name, email, phone, or ID...",
                filtersConfig: [
                    { key: "designation", label: "Designation", icon: <Briefcase className="w-3.5 h-3.5" />, options: DESIGNATION_OPTIONS },
                    { key: "status", label: "Status", icon: <Activity className="w-3.5 h-3.5" />, options: STATUS_OPTIONS },
                    { key: "dateRange", label: "Date Joined", icon: <Calendar className="w-3.5 h-3.5" />, options: DATE_FILTER_OPTIONS },
                    { key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: SORT_OPTIONS }
                ],
                advancedConfig: [
                    { key: "salaryRange", type: "range", label: "Salary Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
                    { key: "customDateRange", type: "date-range", label: "Custom Date Range" }
                ]
            });
        }
    }, [setFilterConfig]);

    // 2. Stats calculation logic (Centralized but customized for this module)
    const calculateStats = useCallback((employees) => {
        const today = new Date();
        const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return [
            { 
                title: 'Total Employee', 
                count: employees.length, 
                bgColor: 'bg-brand-primary', 
                icon: <Users size={24} /> 
            },
            { 
                title: 'Active', 
                count: employees.filter(emp => emp.user?.is_active !== false).length, 
                bgColor: 'bg-emerald-500', 
                icon: <ShieldCheck size={24} /> 
            },
            { 
                title: 'Inactive', 
                count: employees.filter(emp => emp.user?.is_active === false).length, 
                bgColor: 'bg-rose-500', 
                icon: <UserMinus size={24} /> 
            },
            { 
                title: 'New Joiners', 
                count: employees.filter(emp => new Date(emp.date_joined) >= last7Days).length, 
                bgColor: 'bg-amber-500', 
                icon: <UserPlus size={24} /> 
            }
        ];
    }, []);

    // 3. Using the Power of the Backbone Hook!
    const { 
        filteredData: filteredEmployees, 
        rawData, 
        loading, 
        refresh 
    } = useModuleData({
        apiFetch: employeeAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['name', 'email', 'phone_number', 'user.phone_number', 'role', 'id'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];
            
            // Designation
            if (f.designation && f.designation !== "all") {
                result = result.filter(e => e.role === f.designation);
            }
            
            // Status
            if (f.status && f.status !== "all") {
                if (f.status === "active") result = result.filter(e => e.user?.is_active !== false);
                else if (f.status === "inactive") result = result.filter(e => e.user?.is_active === false);
                else if (f.status === "present") result = result.filter(e => e.user?.is_present === true);
                else if (f.status === "absent") result = result.filter(e => e.user?.is_present === false);
            }

            // Date Range
            if (f.dateRange && f.dateRange !== "all") {
                const today = new Date();
                result = result.filter(e => {
                    const joinDate = new Date(e.date_joined);
                    if (f.dateRange === "today") return joinDate.toDateString() === today.toDateString();
                    if (f.dateRange === "week") return joinDate >= new Date(today - 7 * 86400000);
                    if (f.dateRange === "month") return joinDate >= new Date(today - 30 * 86400000);
                    return true;
                });
            }

            // Custom Range & Salary
            if (f.salaryRange) {
                result = result.filter(e => {
                    const salary = e.salary || 0;
                    return (!f.salaryRange.min || salary >= f.salaryRange.min) && (!f.salaryRange.max || salary <= f.salaryRange.max);
                });
            }

            // Sort
            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
                    if (f.sortBy === "salary_desc") return (b.salary || 0) - (a.salary || 0);
                    return 0;
                });
            }

            return result;
        }
    });

    // Update global profile list for sync across other components
    useEffect(() => {
        if (rawData) setAllProfile(rawData);
    }, [rawData, setAllProfile]);

    const handleEmployeeAdded = (newEmp) => {
        setIsAddOpen(false);
        setSuccessData(newEmp);
        refresh(); // Refresh via hook
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">Synchronizing data...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Users size={16} className="text-brand-primary" />
                        {viewType === "grid" ? "Employee Directory" : "Employee Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredEmployees.length} OF {rawData?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEmployees.map(emp => (
                            <EmployeeCard 
                                key={emp.id} 
                                employee={{...emp, designation: emp.role}} 
                                onEdit={refresh} 
                                onDelete={refresh} 
                            />
                        ))}
                    </div>
                ) : (
                    <EmployeeList employees={filteredEmployees} onUpdate={refresh} />
                )}

                {filteredEmployees.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800 mb-1">No employees found</h3>
                        <button onClick={() => setIsAddOpen(true)} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold mt-4 shadow-md active:scale-95 transition-all">Add New Employee</button>
                    </div>
                )}
            </div>

            <AddEmployeeModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleEmployeeAdded} />
            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title="Employee Registered"
                subtitle="New profile created successfully"
                details={[
                    { label: "Full Name", value: successData?.name },
                    { label: "Designation", value: successData?.role },
                    { label: "Employee ID", value: `#EMP-${successData?.id}` }
                ]}
            />
        </div>
    );
};

export default EmployeeGrid;
