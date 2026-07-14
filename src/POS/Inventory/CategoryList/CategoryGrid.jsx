import React, { useState, useEffect, useCallback } from 'react';
import CategoryCard from "./CategoryCard";
import CategoryList from "./CategoryList";
import AddCategoryModal from "./AddCategoryModal";
import SuccessModal from "../../components/SuccessModal";
import { usePosCategory } from "../../../context_or_provider/pos/categories/CategoryProvider";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
import { Layers, CheckCircle2, ArrowUpDown } from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import LoadingSpinner from "../../components/LoadingSpinner";

const CategoryGrid = ({
    viewType,
    isAddOpen,
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { setPosCategories } = usePosCategory();
    const { successData, setSuccessData } = usePosCategory();
    const [successType, setSuccessType] = useState('create');

    // 1. Provide Filter Configuration to Parent Container
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by category name...",
                filtersConfig: [
                    { key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: [
                        { value: "name_asc", label: "Name (A-Z)" },
                        { value: "name_desc", label: "Name (Z-A)" }
                    ]}
                ],
                advancedConfig: []
            });
        }
    }, [setFilterConfig]);

    // 2. Stats Calculation
    const calculateStats = useCallback((data) => {
        const total = data.length;
        return [
            { title: 'Total Categories', count: total, bgColor: 'bg-blue-600', icon: <Layers size={24} /> }
        ];
    }, []);

    // 3. Centralized Hook Integration
    const {
        filteredData: filteredCategories,
        rawData: posCategories,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posCategoryAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['title', 'description'],
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

    // Sync context provider
    useEffect(() => {
        if (posCategories) setPosCategories(posCategories);
    }, [posCategories, setPosCategories]);

    const handleCategoryAdded = (newCat) => {
        setIsAddOpen(false);
        setSuccessType('create');
        setSuccessData(newCat);
        refresh();
    };

    const handleCategoryUpdated = useCallback(() => {
        refresh();
    }, [refresh]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">Loading category records...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Layers size={16} className="text-blue-600" />
                        {viewType === "grid" ? "Category Grid" : "Category List"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredCategories.length} OF {posCategories?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCategories.map(category => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onEdit={handleCategoryUpdated}
                                onDelete={handleCategoryUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <CategoryList categories={filteredCategories} onUpdate={handleCategoryUpdated} />
                )}

                {filteredCategories.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <Layers className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">No categories found</h3>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold mt-4 shadow-md active:scale-95"
                        >
                            Add Category
                        </button>
                    </div>
                )}
            </div>

            <AddCategoryModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleCategoryAdded} />
            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title={successType === 'update' ? 'Category Updated' : 'Category Created'}
                subtitle="Database synchronized successfully"
                details={[
                    { label: "Category Title", value: successData?.title },
                    { label: "Category ID", value: `#CAT-${successData?.id}` }
                ]}
            />
        </div>
    );
};

export default CategoryGrid;