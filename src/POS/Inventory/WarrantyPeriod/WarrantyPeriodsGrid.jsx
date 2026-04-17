import React, { useState, useEffect, useMemo, useCallback } from "react";
import WarrantyPeriodHeader from "./WarrantyPeriodHeader";
import WarrantyPeriodStats from "./WarrantyPeriodStats";
import WarrantyPeriodSearchFilter from "./WarrantyPeriodSearchFilter";
import WarrantyPeriodCard from "./WarrantyPeriodCard";
import WarrantyPeriodList from "./WarrantyPeriodList";
import AddWarrantyPeriodModal from "./AddWarrantyPeriodModal";
import LoadingSpinner from "./LoadingSpinner";
import { usePosWarrantyPeriods } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodProvider";
import { posWarrantyPeriodAPI } from "../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI";

const WarrantyPeriodsGrid = () => {
    const { posWarrantyPeriods, setPosWarrantyPeriods } = usePosWarrantyPeriods();
    const [viewType, setViewType] = useState("grid");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        sortBy: "name_asc",
    });

    const fetchWarrantyPeriods = useCallback(async () => {
        setLoading(true);
        try {
            const response = await posWarrantyPeriodAPI.getAll();
            setPosWarrantyPeriods(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching warranty periods:", error);
        } finally {
            setLoading(false);
        }
    }, [setPosWarrantyPeriods]);

    useEffect(() => {
        fetchWarrantyPeriods();
    }, [fetchWarrantyPeriods]);

    const calculateStats = (data) => {
        const total = data.length;
        const active = data.filter(item => item.is_active).length;
        const inactive = total - active;

        setStats([
            { title: 'Total Periods', count: total.toString(), bgColor: 'bg-blue-600', icon: '📝' },
            { title: 'Active', count: active.toString(), bgColor: 'bg-green-500', icon: '✅' },
            { title: 'Inactive', count: inactive.toString(), bgColor: 'bg-red-500', icon: '❌' },
        ]);
    };

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleFilter = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const filteredPeriods = useMemo(() => {
        if (!posWarrantyPeriods) return [];
        let result = [...posWarrantyPeriods];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => item.name.toLowerCase().includes(query));
        }

        if (filters.status !== "all") {
            const isActive = filters.status === "active";
            result = result.filter(item => item.is_active === isActive);
        }

        result.sort((a, b) => {
            if (filters.sortBy === "name_asc") return (a.name || '').localeCompare(b.name || '');
            if (filters.sortBy === "name_desc") return (b.name || '').localeCompare(a.name || '');
            return 0;
        });

        return result;
    }, [posWarrantyPeriods, searchQuery, filters]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading warranty periods...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <WarrantyPeriodHeader
                viewType={viewType}
                setViewType={setViewType}
                onAddClick={() => setIsAddOpen(true)}
            />
            
            <div className="mb-6">
                <WarrantyPeriodStats stats={stats} />
            </div>

            <div className="mb-6">
                <WarrantyPeriodSearchFilter
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Warranty Periods ({filteredPeriods.length})
                    </h2>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPeriods.map(item => (
                            <WarrantyPeriodCard
                                key={item.id}
                                warrantyPeriod={item}
                                onEdit={fetchWarrantyPeriods}
                                onDelete={fetchWarrantyPeriods}
                            />
                        ))}
                    </div>
                ) : (
                    <WarrantyPeriodList
                        warrantyPeriods={filteredPeriods}
                        onUpdate={fetchWarrantyPeriods}
                    />
                )}

                {filteredPeriods.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No warranty periods found matching your criteria.
                    </div>
                )}
            </div>

            <AddWarrantyPeriodModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={fetchWarrantyPeriods}
            />
        </div>
    );
};

export default WarrantyPeriodsGrid;
