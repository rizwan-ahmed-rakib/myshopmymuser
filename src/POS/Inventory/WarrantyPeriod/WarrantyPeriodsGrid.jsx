

import React, { useState, useEffect, useCallback } from "react";
import WarrantyPeriodCard from "./WarrantyPeriodCard";
import WarrantyPeriodList from "./WarrantyPeriodList";
import AddWarrantyPeriodModal from "./AddWarrantyPeriodModal";
import SuccessModal from "../../components/SuccessModal";
import { usePosWarrantyPeriods } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodProvider";
import { posWarrantyPeriodAPI } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";
import { Shield, ArrowUpDown, ShieldAlert } from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import LoadingSpinner from "../../components/LoadingSpinner";

const WarrantyPeriodsGrid = ({
    viewType,
    isAddOpen,
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { setPosWarrantyPeriods } = usePosWarrantyPeriods();
    const [successData, setSuccessData] = useState(null);

    // 1. Provide Filter Configuration to Parent Container
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search warranty by name...",
                filtersConfig: [
                    { key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: [
                        { value: "name_asc", label: "Name (A-Z)" },
                        { value: "name_desc", label: "Name (Z-A)" },
                        { value: "duration_desc", label: "Duration (High-Low)" },
                        { value: "duration_asc", label: "Duration (Low-High)" }
                    ]}
                ],
                advancedConfig: []
            });
        }
    }, [setFilterConfig]);

    // 2. Stats Calculation
    const calculateStats = useCallback((data) => {
        return [
            { title: 'Total Warranties', count: data.length, bgColor: 'bg-emerald-600', icon: <Shield size={24} /> }
        ];
    }, []);

    // 3. Centralized Hook Integration
    const {
        filteredData: filteredPeriods,
        rawData: posWarrantyPeriods,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posWarrantyPeriodAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['name', 'duration', 'duration_type'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];

            // Sorting
            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
                    if (f.sortBy === "name_desc") return (b.name || "").localeCompare(a.name || "");
                    if (f.sortBy === "duration_desc") return Number(b.duration || 0) - Number(a.duration || 0);
                    if (f.sortBy === "duration_asc") return Number(a.duration || 0) - Number(b.duration || 0);
                    return 0;
                });
            }
            return result;
        }
    });

    // Sync context provider
    useEffect(() => {
        if (posWarrantyPeriods) setPosWarrantyPeriods(posWarrantyPeriods);
    }, [posWarrantyPeriods, setPosWarrantyPeriods]);

    const handleWarrantyAdded = (newWarranty) => {
        setIsAddOpen(false);
        setSuccessData(newWarranty);
        refresh();
    };

    const handleWarrantyUpdated = useCallback(() => {
        refresh();
    }, [refresh]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">Loading warranty records...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Shield size={16} className="text-emerald-600" />
                        {viewType === "grid" ? "Warranty Grid" : "Warranty List"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredPeriods.length} OF {posWarrantyPeriods?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPeriods.map(item => (
                            <WarrantyPeriodCard
                                key={item.id}
                                warrantyPeriod={item}
                                onEdit={handleWarrantyUpdated}
                                onDelete={handleWarrantyUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <WarrantyPeriodList warrantyPeriods={filteredPeriods} onUpdate={handleWarrantyUpdated} />
                )}

                {filteredPeriods.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <ShieldAlert className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">No warranty periods found</h3>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold mt-4 shadow-md active:scale-95"
                        >
                            Add Warranty
                        </button>
                    </div>
                )}
            </div>

            <AddWarrantyPeriodModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleWarrantyAdded} />
            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title="Warranty Plan Created"
                subtitle="Policy synchronized successfully"
                details={[
                    { label: "Plan Name", value: successData?.name },
                    { label: "Duration", value: `${successData?.duration} ${successData?.period_type}(s)` },
                    { label: "Status", value: successData?.is_active ? "Active" : "Inactive" }
                ]}
            />
        </div>
    );
};

export default WarrantyPeriodsGrid;