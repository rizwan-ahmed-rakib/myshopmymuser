

import React, { useState, useEffect, useCallback } from 'react';
import UnitCard from "./UnitCard";
import UnitList from "./UnitList";
import AddUnitModal from "./AddUnitModal";
import SuccessModal from "../../components/SuccessModal";
import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
import { usePosUnits } from "../../../context_or_provider/pos/units/UnitProvider";
import { Weight, ArrowUpDown } from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import LoadingSpinner from "../../components/LoadingSpinner";

const UnitGrid = ({
    viewType,
    isAddOpen,
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { setPosUnits } = usePosUnits();
    const [successData, setSuccessData] = useState(null);

    // 1. Provide Filter Configuration to Parent Container
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search unit by title...",
                filtersConfig: [
                    { key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: [
                        { value: "name_asc", label: "Title (A-Z)" },
                        { value: "name_desc", label: "Title (Z-A)" }
                    ]}
                ],
                advancedConfig: []
            });
        }
    }, [setFilterConfig]);

    // 2. Stats Calculation
    const calculateStats = useCallback((data) => {
        return [
            { title: 'Total Units', count: data.length, bgColor: 'bg-indigo-600', icon: <Weight size={24} /> }
        ];
    }, []);

    // 3. Centralized Hook Integration
    const {
        filteredData: filteredUnits,
        rawData: posUnits,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posUnitAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['title'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];

            // Sorting
            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "name_asc") return (a.title || "").localeCompare(b.title || "");
                    if (f.sortBy === "name_desc") return (b.title || "").localeCompare(a.title || "");
                    return 0;
                });
            }
            return result;
        }
    });

    // Sync Context Provider
    useEffect(() => {
        if (posUnits) setPosUnits(posUnits);
    }, [posUnits, setPosUnits]);

    const handleProductAdded = (newUnit) => {
        setIsAddOpen(false);
        setSuccessData(newUnit);
        refresh();
    };

    const handleProductUpdated = useCallback(() => {
        refresh();
    }, [refresh]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">Loading unit records...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Weight size={16} className="text-indigo-600" />
                        {viewType === "grid" ? "Unit Grid" : "Unit List"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredUnits.length} OF {posUnits?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredUnits.map(unit => (
                            <UnitCard
                                key={unit.id}
                                product={unit}
                                onEdit={handleProductUpdated}
                                onDelete={handleProductUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <UnitList products={filteredUnits} onUpdate={handleProductUpdated} />
                )}

                {filteredUnits.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <Weight className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">No units found</h3>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold mt-4 shadow-md active:scale-95"
                        >
                            Add Unit
                        </button>
                    </div>
                )}
            </div>

            <AddUnitModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleProductAdded} />
            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title="Unit Registered"
                subtitle="Measurement standard updated"
                details={[
                    { label: "Unit Title", value: successData?.title },
                    { label: "Unit ID", value: `#UNT-${successData?.id}` }
                ]}
            />
        </div>
    );
};

export default UnitGrid;