import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

// Define product-specific filter options
const PRODUCT_STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "in-stock", label: "In Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
];

const PRODUCT_SORT_OPTIONS = [
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "stock_desc", label: "Stock: High to Low" },
];

// Placeholder for categories - this should be fetched from an API
const CATEGORY_OPTIONS = [
    { value: "all", label: "All Categories" },
    // Example categories - replace with dynamic data
    { value: "1", label: "Category 1" },
    { value: "2", label: "Category 2" },
    { value: "3", label: "Category 3" },
];


// A helper component for dropdowns to reduce repetition
const FilterDropdown = ({ label, options, onSelect, selectedValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[180px]">
                <span>{label}</span>
                <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-64 bg-white rounded-lg shadow-lg border py-2">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => { onSelect(option.value); setIsOpen(false); }}
                            className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 ${selectedValue === option.value ? "text-blue-600" : "text-gray-700"}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

FilterDropdown.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const SaleSearchFilter = ({ onSearch, onFilter }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        category: "all",
        status: "all",
        sortBy: "name_asc"
    });
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

    // Refs for dropdowns
    const categoryRef = useRef(null);
    const statusRef = useRef(null);
    const sortRef = useRef(null);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    // Apply filters effect
    useEffect(() => {
        onFilter(filters);
    }, [filters, onFilter]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handlePriceRangeChange = (e, type) => {
        setPriceRange(prev => ({ ...prev, [type]: e.target.value }));
    };

    const applyAdvancedFilters = () => {
        const advancedFilters = {
            priceRange: (priceRange.min || priceRange.max) ? {
                min: priceRange.min ? parseInt(priceRange.min) : null,
                max: priceRange.max ? parseInt(priceRange.max) : null
            } : null
        };
        onFilter({ ...filters, ...advancedFilters });
        setShowAdvanced(false);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setFilters({ category: "all", status: "all", sortBy: "name_asc" });
        setPriceRange({ min: "", max: "" });
        // Trigger parent components to reset
        onSearch("");
        onFilter({ category: "all", status: "all", sortBy: "name_asc", priceRange: null });
    };

    const hasActiveFilters = React.useMemo(() => {
        return filters.category !== "all" ||
               filters.status !== "all" ||
               priceRange.min ||
               priceRange.max;
    }, [filters, priceRange]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="p-4 md:p-6">
                {/* Main Search Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <div className="w-full lg:flex-1">
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Search by product name or code..."
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Advanced
                        </button>
                        <button onClick={resetFilters} className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50" disabled={!searchQuery && !hasActiveFilters}>
                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Reset
                        </button>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-3">
                    {/* Category Filter */}
                    <div className="relative" ref={categoryRef}>
                        <FilterDropdown label={CATEGORY_OPTIONS.find(o => o.value === filters.category)?.label || "Category"} options={CATEGORY_OPTIONS} onSelect={(value) => handleFilterChange("category", value)} selectedValue={filters.category} />
                    </div>

                    {/* Status Filter */}
                    <div className="relative" ref={statusRef}>
                        <FilterDropdown label={PRODUCT_STATUS_OPTIONS.find(o => o.value === filters.status)?.label || "Status"} options={PRODUCT_STATUS_OPTIONS} onSelect={(value) => handleFilterChange("status", value)} selectedValue={filters.status} />
                    </div>

                    {/* Sort By */}
                    <div className="relative" ref={sortRef}>
                         <FilterDropdown label={PRODUCT_SORT_OPTIONS.find(o => o.value === filters.sortBy)?.label || "Sort By"} options={PRODUCT_SORT_OPTIONS} onSelect={(value) => handleFilterChange("sortBy", value)} selectedValue={filters.sortBy} />
                    </div>
                </div>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" value={priceRange.min} onChange={(e) => handlePriceRangeChange(e, "min")} className="w-full px-3 py-2 border rounded-lg" placeholder="Min" />
                                    <input type="number" value={priceRange.max} onChange={(e) => handlePriceRangeChange(e, "max")} className="w-full px-3 py-2 border rounded-lg" placeholder="Max" />
                                 </div>
                            </div>
                            <div className="flex items-end">
                                <button onClick={applyAdvancedFilters} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

SaleSearchFilter.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
};

export default SaleSearchFilter;
