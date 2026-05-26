import React, {useState, useEffect, useMemo, useCallback} from 'react';
import EmployeeLeaveApplicationCard from "./EmployeeLeaveApplicationCard";
import EmployeeLeaveApplicationList from "./EmployeeLeaveApplicationList";
import AddEmployeeLeaveApplicationModal from "./AddEmployeeLeaveApplicationModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {leaveApplicationAPI} from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applicationAPI";
import {
    useLeaveApplications
} from "../../../context_or_provider/pos/EmployeeLeaveApplicaations/leave_applications_provider";
import { FileText, CheckCircle, Clock, Calendar, Briefcase, Activity, ArrowUpDown } from 'lucide-react';
import { DESIGNATION_OPTIONS } from "../EmployeeList/constant/filters";

/**
 * EmployeeLeaveApplicationGrid - Manages leave applications.
 * Integrated with ModuleShell backbone for a consistent POS experience.
 */
const EmployeeLeaveApplicationGrid = ({ 
    viewType, 
    isAddOpen, 
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { leaveApplication,  setLeaveApplication} = useLeaveApplications();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');
    const [loading, setLoading] = useState(true);

    // Provide filter configuration to parent on mount
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by employee name, reason, or leave type...",
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
                            { value: "pending", label: "Pending" },
                            { value: "rejected", label: "Rejected" }
                        ] 
                    },
                    { 
                        key: "dateRange", 
                        label: "Request Date", 
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
                            { value: "name_asc", label: "Name (A-Z)" }
                        ] 
                    }
                ],
                advancedConfig: [
                    { key: "customDateRange", type: "date-range", label: "Custom Date Range" }
                ]
            });
        }
    }, [setFilterConfig]);

    const fetchLeaveApplications = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const response = await leaveApplicationAPI.getAll();
            setLeaveApplication(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching leave applications:", error);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [setLeaveApplication]);

    useEffect(() => {
        fetchLeaveApplications();
    }, [fetchLeaveApplications]);

    const calculateStats = useCallback((data) => {
        const total = data.length;
        const approved = data.filter(d => d.status === "approved" || d.is_approved).length;
        const pending = data.filter(d => d.status === "pending" || (!d.is_approved && d.status !== "rejected")).length;
        const rejected = data.filter(d => d.status === "rejected").length;

        const displayStats = [
            {
                title: 'Total Applications',
                count: total,
                bgColor: 'bg-brand-primary',
                icon: <FileText size={24} />
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
                title: 'Rejected',
                count: rejected,
                bgColor: 'bg-rose-500',
                icon: <Activity size={24} />
            }
        ];

        if (onStatsLoaded) onStatsLoaded(displayStats);
    }, [onStatsLoaded]);

    const filteredEmployees = useMemo(() => {
        if (!leaveApplication) return [];

        let result = [...leaveApplication];

        // 🔍 Search
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.user_name?.toLowerCase().includes(query) ||
                item.reason?.toLowerCase().includes(query) ||
                item.leave_type?.toLowerCase().includes(query)
            );
        }

        // 🏢 Designation Filter
        if (filters.designation && filters.designation !== "all") {
            result = result.filter(item =>
                item.user_designation?.toLowerCase() === filters.designation.toLowerCase()
            );
        }

        // ✅ Status Filter
        if (filters.status && filters.status !== "all") {
            result = result.filter(item => {
                const status = item.status?.toLowerCase();
                if (filters.status === "approved") return status === "approved" || item.is_approved;
                if (filters.status === "pending") return status === "pending" || (!item.is_approved && status !== "rejected");
                if (filters.status === "rejected") return status === "rejected";
                return true;
            });
        }

        // 📅 Date Filter
        if (filters.dateRange && filters.dateRange !== "all") {
            const today = new Date();
            result = result.filter(item => {
                const date = new Date(item.request_date || item.applied_on);
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
                const date = new Date(item.request_date || item.applied_on);
                return date >= fromDate && date <= toDate;
            });
        }

        // 💰 Sorting
        if (filters.sortBy) {
            result.sort((a, b) => {
                const dateA = new Date(a.request_date || a.applied_on);
                const dateB = new Date(b.request_date || b.applied_on);
                switch (filters.sortBy) {
                    case "date_desc": return dateB - dateA;
                    case "date_asc": return dateA - dateB;
                    case "name_asc": return (a.user_name || "").localeCompare(b.user_name || "");
                    default: return 0;
                }
            });
        }

        return result;
    }, [leaveApplication, searchQuery, filters]);

    const handleEmployeeAdded = (newEmp) => {
        setLeaveApplication(prev => [...prev, newEmp]);
        setIsAddOpen(false);
        setSuccessType('create');
        setSuccessData(newEmp);
        fetchLeaveApplications();
    };

    const handleEmployeeUpdated = useCallback(() => {
        fetchLeaveApplications(false);
    }, [fetchLeaveApplications]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 text-sm">Loading leave applications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Content Viewport */}
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <FileText size={16} className="text-brand-primary" />
                        {viewType === "grid" ? "Leave Application Grid" : "Leave Application Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredEmployees.length} OF {leaveApplication?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEmployees.map(emp => (
                            <EmployeeLeaveApplicationCard
                                key={emp.id}
                                advance={emp}
                                onEdit={handleEmployeeUpdated}
                                onDelete={handleEmployeeUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <EmployeeLeaveApplicationList
                        advance={filteredEmployees}
                        onEdit={handleEmployeeUpdated}
                    />
                )}

                {/* Empty State Viewport */}
                {filteredEmployees.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <FileText className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800 mb-1">No applications found</h3>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
                            No leave applications match your current filtering criteria.
                        </p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                        >
                            Apply For Leave
                        </button>
                    </div>
                )}
            </div>

            <AddEmployeeLeaveApplicationModal
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

export default EmployeeLeaveApplicationGrid;
