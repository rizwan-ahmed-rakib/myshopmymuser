import React, {useState, useEffect, useMemo, useCallback} from 'react';
import EmployeeAttendanceCard from "./EmployeeAttendanceCard";
import EmployeeAttendanceList from "./EmployeeAttendanceList";
import AddEmployeeAttendanceModal from "./AddEmployeeAttendanceModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {employeeAttendanceAPI} from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
import { Activity, Calendar, UserCheck, UserX, Clock, ClipboardList, Search, ArrowUpDown } from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";

const EmployeeAttendanceGrid = ({ 
    viewType, 
    isAddOpen, 
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');

    // 1. Provide filter configuration to parent on mount
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by employee name or designation...",
                filtersConfig: [
                    { key: "status", label: "Status", icon: <Activity className="w-3.5 h-3.5" />, options: [
                        { value: "all", label: "All Status" }, { value: "present", label: "Present" }, { value: "absent", label: "Absent" }
                    ]},
                    { key: "dateRange", label: "Quick Date", icon: <Calendar className="w-3.5 h-3.5" />, options: [
                        { value: "all", label: "All Records" }, { value: "today", label: "Today" }, { value: "week", label: "This Week" }, { value: "month", label: "This Month" }
                    ]}
                ],
                advancedConfig: [
                    { key: "workHours", type: "range", label: "Work Hours", minPlaceholder: "Min Hours", maxPlaceholder: "Max Hours" },
                    { key: "customDateRange", type: "date-range", label: "Custom Date Range" }
                ]
            });
        }
    }, [setFilterConfig]);

    // 2. Stats calculation logic
    const calculateStats = useCallback((data, totalCount) => {
        const present = data?.filter(d => d.is_present).length || 0;
        const absent = data?.filter(d => !d.is_present).length || 0;
        const totalWorkHours = data?.reduce((sum, d) => sum + (parseFloat(d.daily_work_time) || 0), 0) || 0;

        return [
            { title: 'Total Records', count: totalCount, bgColor: 'bg-brand-primary', icon: <ClipboardList size={24} /> },
            { title: 'Present', count: present, bgColor: 'bg-emerald-500', icon: <UserCheck size={24} /> },
            { title: 'Absent', count: absent, bgColor: 'bg-rose-500', icon: <UserX size={24} /> },
            { title: 'Total Hours', count: `${totalWorkHours.toFixed(1)}h`, bgColor: 'bg-amber-500', icon: <Clock size={24} /> }
        ];
    }, []);

    // 3. Centralized Data Hook
    const { 
        filteredData: displayedAttendance, 
        rawData: allAttendance, 
        loading, 
        pagination,
        changePage,
        refresh 
    } = useModuleData({
        apiFetch: employeeAttendanceAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['name', 'user_designation'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let filtered = [...data];
            
            if (f.status && f.status !== "all") {
                filtered = filtered.filter(item => f.status === "present" ? item.is_present : !item.is_present);
            }

            if (f.dateRange && f.dateRange !== "all") {
                const today = new Date();
                filtered = filtered.filter(item => {
                    const date = new Date(item.date);
                    if (f.dateRange === "today") return date.toDateString() === today.toDateString();
                    if (f.dateRange === "week") return date >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (f.dateRange === "month") return date >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return true;
                });
            }

            if (f.workHours) {
                filtered = filtered.filter(item => {
                    const hours = parseFloat(item.daily_work_time) || 0;
                    const min = f.workHours.min ? parseFloat(f.workHours.min) : 0;
                    const max = f.workHours.max ? parseFloat(f.workHours.max) : Infinity;
                    return hours >= min && hours <= max;
                });
            }

            if (f.customDateRange?.from && f.customDateRange?.to) {
                const from = new Date(f.customDateRange.from);
                const to = new Date(f.customDateRange.to);
                filtered = filtered.filter(item => {
                    const date = new Date(item.date);
                    return date >= from && date <= to;
                });
            }
            return filtered;
        }
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">Loading attendance records...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <ClipboardList size={16} className="text-brand-primary" />
                        {viewType === "grid" ? "Attendance Grid" : "Attendance Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {displayedAttendance.length} OF {pagination.count} RECORDS
                        {pagination.totalPages > 1 && ` | PAGE ${pagination.current} OF ${pagination.totalPages}`}
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {displayedAttendance.map(att => (
                            <EmployeeAttendanceCard key={att.id} attendance={att} onEdit={refresh} onDelete={refresh} />
                        ))}
                    </div>
                ) : (
                    <EmployeeAttendanceList attendance={displayedAttendance} onEdit={refresh} onDelete={refresh} />
                )}

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-100">
                        <button onClick={() => changePage(pagination.current - 1)} disabled={!pagination.previous} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pagination.previous ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'}`}>Previous</button>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum = i + 1;
                                if (pagination.current > 3 && pagination.totalPages > 5) {
                                    pageNum = pagination.current - 2 + i;
                                    if (pageNum > pagination.totalPages) pageNum = pagination.totalPages - (4 - i);
                                }
                                if (pageNum < 1) return null;
                                return (
                                    <button key={pageNum} onClick={() => changePage(pageNum)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${pagination.current === pageNum ? 'bg-brand-primary text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{pageNum}</button>
                                );
                            })}
                        </div>
                        <button onClick={() => changePage(pagination.current + 1)} disabled={!pagination.next} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pagination.next ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'}`}>Next</button>
                    </div>
                )}

                {displayedAttendance.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">No attendance records found</h3>
                        <button onClick={() => setIsAddOpen(true)} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold mt-4 shadow-md active:scale-95">Add Attendance Record</button>
                    </div>
                )}
            </div>

            <AddEmployeeAttendanceModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={() => { setIsAddOpen(false); refresh(); }} />
            <SuccessModal isOpen={!!successData} employee={successData} type={successType} onClose={() => setSuccessData(null)} />
        </div>
    );
};

export default EmployeeAttendanceGrid;
