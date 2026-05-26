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
import useModuleData from "../../hooks/useModuleData";

const EmployeeLeaveApplicationGrid = ({ 
    viewType, 
    isAddOpen, 
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { setLeaveApplication } = useLeaveApplications();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by employee name, reason, or leave type...",
                filtersConfig: [
                    { key: "designation", label: "Designation", icon: <Briefcase className="w-3.5 h-3.5" />, options: DESIGNATION_OPTIONS },
                    { key: "status", label: "Status", icon: <Activity className="w-3.5 h-3.5" />, options: [
                        { value: "all", label: "All Status" }, { value: "approved", label: "Approved" }, { value: "pending", label: "Pending" }, { value: "rejected", label: "Rejected" }
                    ]},
                    { key: "dateRange", label: "Request Date", icon: <Calendar className="w-3.5 h-3.5" />, options: [
                        { value: "all", label: "All Time" }, { value: "today", label: "Today" }, { value: "week", label: "This Week" }, { value: "month", label: "This Month" }
                    ]},
                    { key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: [
                        { value: "date_desc", label: "Newest First" }, { value: "date_asc", label: "Oldest First" }, { value: "name_asc", label: "Name (A-Z)" }
                    ]}
                ],
                advancedConfig: [
                    { key: "customDateRange", type: "date-range", label: "Custom Date Range" }
                ]
            });
        }
    }, [setFilterConfig]);

    // 2. Stats calculation logic
    const calculateStats = useCallback((data) => {
        const total = data.length;
        const approved = data.filter(d => d.status === "approved" || d.is_approved).length;
        const pending = data.filter(d => d.status === "pending" || (!d.is_approved && d.status !== "rejected")).length;
        const rejected = data.filter(d => d.status === "rejected").length;

        return [
            { title: 'Total Applications', count: total, bgColor: 'bg-brand-primary', icon: <FileText size={24} /> },
            { title: 'Approved', count: approved, bgColor: 'bg-emerald-500', icon: <CheckCircle size={24} /> },
            { title: 'Pending', count: pending, bgColor: 'bg-amber-500', icon: <Clock size={24} /> },
            { title: 'Rejected', count: rejected, bgColor: 'bg-rose-500', icon: <Activity size={24} /> }
        ];
    }, []);

    // 3. Centralized Hook
    const { 
        filteredData: filteredEmployees, 
        rawData: leaveApplication, 
        loading, 
        refresh 
    } = useModuleData({
        apiFetch: leaveApplicationAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['user_name', 'reason', 'leave_type'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];
            if (f.designation && f.designation !== "all") {
                result = result.filter(item => item.user_designation?.toLowerCase() === f.designation.toLowerCase());
            }
            if (f.status && f.status !== "all") {
                result = result.filter(item => {
                    const status = item.status?.toLowerCase();
                    if (f.status === "approved") return status === "approved" || item.is_approved;
                    if (f.status === "pending") return status === "pending" || (!item.is_approved && status !== "rejected");
                    if (f.status === "rejected") return status === "rejected";
                    return true;
                });
            }
            if (f.dateRange && f.dateRange !== "all") {
                const today = new Date();
                result = result.filter(item => {
                    const date = new Date(item.request_date || item.applied_on);
                    if (f.dateRange === "today") return date.toDateString() === today.toDateString();
                    if (f.dateRange === "week") return date >= new Date(today - 7 * 86400000);
                    if (f.dateRange === "month") return date >= new Date(today - 30 * 86400000);
                    return true;
                });
            }
            if (f.sortBy) {
                result.sort((a, b) => {
                    const dateA = new Date(a.request_date || a.applied_on);
                    const dateB = new Date(b.request_date || b.applied_on);
                    if (f.sortBy === "date_desc") return dateB - dateA;
                    if (f.sortBy === "date_asc") return dateA - dateB;
                    if (f.sortBy === "name_asc") return (a.user_name || "").localeCompare(b.user_name || "");
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (leaveApplication) setLeaveApplication(leaveApplication);
    }, [leaveApplication, setLeaveApplication]);

    const handleEmployeeAdded = (newEmp) => {
        setIsAddOpen(false);
        setSuccessType('create');
        setSuccessData(newEmp);
        refresh();
    };

    const handleEmployeeUpdated = useCallback(() => {
        refresh();
    }, [refresh]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">Loading leave applications...</p>
        </div>
    );

    return (
        <div className="space-y-4">
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
                            <EmployeeLeaveApplicationCard key={emp.id} advance={emp} onEdit={handleEmployeeUpdated} onDelete={handleEmployeeUpdated} />
                        ))}
                    </div>
                ) : (
                    <EmployeeLeaveApplicationList advance={filteredEmployees} onEdit={handleEmployeeUpdated} />
                )}

                {filteredEmployees.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <FileText className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">No applications found</h3>
                        <button onClick={() => setIsAddOpen(true)} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold mt-4 shadow-md active:scale-95">Apply For Leave</button>
                    </div>
                )}
            </div>

            <AddEmployeeLeaveApplicationModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleEmployeeAdded} />
            <SuccessModal isOpen={!!successData} employee={successData} type={successType} onClose={() => setSuccessData(null)} />
        </div>
    );
};

export default EmployeeLeaveApplicationGrid;
