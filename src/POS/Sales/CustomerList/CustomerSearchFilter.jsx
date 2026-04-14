import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {DATE_FILTER_OPTIONS, DESIGNATION_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS} from "./constant/filters";


const CustomerSearchFilter = ({ onSearch, onFilter, onSort, initialFilters = {} }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        designation: initialFilters.designation || "all",
        status: initialFilters.status || "all",
        dateRange: initialFilters.dateRange || "all",
        sortBy: initialFilters.sortBy || "name_asc"
    });
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [salaryRange, setSalaryRange] = useState({
        min: "",
        max: ""
    });
    const [dateRange, setDateRange] = useState({
        from: "",
        to: ""
    });

    const designationRef = useRef(null);
    const statusRef = useRef(null);
    const dateRef = useRef(null);
    const sortRef = useRef(null);

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (designationRef.current && !designationRef.current.contains(event.target)) {
                setShowDesignationDropdown(false);
            }
            if (statusRef.current && !statusRef.current.contains(event.target)) {
                setShowStatusDropdown(false);
            }
            if (dateRef.current && !dateRef.current.contains(event.target)) {
                setShowDateDropdown(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce search - FIXED
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearch) {
                console.log("🔍 Search query:", searchQuery);
                onSearch(searchQuery);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]); // ✅ onSearch বাদ দিন

    // Apply filters when they change - FIXED
    useEffect(() => {
        if (onFilter) {
            console.log("⚙️ Filters changed:", filters);
            onFilter(filters);
        }
    }, [filters]); // ✅ onFilter বাদ দিন

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = useCallback((key, value) => {
        console.log(`🔄 Filter change: ${key} = ${value}`);
        setFilters(prev => ({ ...prev, [key]: value }));

        // Close dropdown after selection
        if (key === "designation") setShowDesignationDropdown(false);
        if (key === "status") setShowStatusDropdown(false);
        if (key === "dateRange") setShowDateDropdown(false);
        if (key === "sortBy") setShowSortDropdown(false);
    }, []); // ✅ useCallback ব্যবহার করুন

    const handleSalaryRangeChange = (e, type) => {
        const value = e.target.value;
        setSalaryRange(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleDateRangeChange = (e, type) => {
        const value = e.target.value;
        setDateRange(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const applyAdvancedFilters = () => {
        const advancedFilters = {};

        if (salaryRange.min || salaryRange.max) {
            advancedFilters.salaryRange = {
                min: salaryRange.min ? parseInt(salaryRange.min) : null,
                max: salaryRange.max ? parseInt(salaryRange.max) : null
            };
        }

        if (dateRange.from || dateRange.to) {
            advancedFilters.customDateRange = { // ✅ এখানে dateRange না, customDateRange
                from: dateRange.from,
                to: dateRange.to
            };
        }

        if (onFilter) {
            console.log("🎯 Applying advanced filters:", advancedFilters);
            onFilter({ ...filters, ...advancedFilters });
        }

        setShowAdvanced(false);
    };

    const resetFilters = () => {
        console.log("🔄 Resetting all filters");
        setSearchQuery("");
        setFilters({
            designation: "all",
            status: "all",
            dateRange: "all",
            sortBy: "name_asc"
        });
        setSalaryRange({ min: "", max: "" });
        setDateRange({ from: "", to: "" });

        if (onSearch) onSearch("");
        if (onFilter) onFilter({
            designation: "all",
            status: "all",
            dateRange: "all",
            sortBy: "name_asc",
            salaryRange: null,
            customDateRange: null
        });
    };

    const getSelectedDesignationLabel = () => {
        const option = DESIGNATION_OPTIONS.find(opt => opt.value === filters.designation);
        return option?.label || "Designation";
    };

    const getSelectedStatusLabel = () => {
        const option = STATUS_OPTIONS.find(opt => opt.value === filters.status);
        return option?.label || "Status";
    };

    const getSelectedDateLabel = () => {
        const option = DATE_FILTER_OPTIONS.find(opt => opt.value === filters.dateRange);
        return option?.label || "Date";
    };

    const getSelectedSortLabel = () => {
        const option = SORT_OPTIONS.find(opt => opt.value === filters.sortBy);
        return option?.label || "Sort By";
    };

    // Render active filter badges
    const hasActiveFilters = React.useMemo(() => {
        return filters.designation !== "all" ||
               filters.status !== "all" ||
               filters.dateRange !== "all" ||
               salaryRange.min ||
               salaryRange.max ||
               dateRange.from ||
               dateRange.to;
    }, [filters, salaryRange, dateRange]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="p-4 md:p-6">
                {/* Main Search Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    {/* Search Input */}
                    <div className="w-full lg:flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Search by name, email, phone, or employee ID..."
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Advanced Filter Toggle */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Advanced Filters
                        </button>

                        <button
                            onClick={resetFilters}
                            className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            disabled={!searchQuery && !hasActiveFilters}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset
                        </button>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {/* Designation Filter */}
                    <div className="relative" ref={designationRef}>
                        <button
                            onClick={() => setShowDesignationDropdown(!showDesignationDropdown)}
                            className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[180px]"
                        >
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {getSelectedDesignationLabel()}
                            </span>
                            <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showDesignationDropdown && (
                            <div className="absolute z-10 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                {DESIGNATION_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleFilterChange("designation", option.value)}
                                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 ${
                                            filters.designation === option.value 
                                                ? "text-blue-600 bg-blue-50" 
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {option.label}
                                        {filters.designation === option.value && (
                                            <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div className="relative" ref={statusRef}>
                        <button
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[180px]"
                        >
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {getSelectedStatusLabel()}
                            </span>
                            <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showStatusDropdown && (
                            <div className="absolute z-10 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                {STATUS_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleFilterChange("status", option.value)}
                                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 ${
                                            filters.status === option.value 
                                                ? "text-blue-600 bg-blue-50" 
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {option.label}
                                        {filters.status === option.value && (
                                            <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Date Filter */}
                    <div className="relative" ref={dateRef}>
                        <button
                            onClick={() => setShowDateDropdown(!showDateDropdown)}
                            className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[180px]"
                        >
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {getSelectedDateLabel()}
                            </span>
                            <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showDateDropdown && (
                            <div className="absolute z-10 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                {DATE_FILTER_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleFilterChange("dateRange", option.value)}
                                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 ${
                                            filters.dateRange === option.value 
                                                ? "text-blue-600 bg-blue-50" 
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {option.label}
                                        {filters.dateRange === option.value && (
                                            <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort By */}
                    <div className="relative" ref={sortRef}>
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[180px]"
                        >
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                                </svg>
                                {getSelectedSortLabel()}
                            </span>
                            <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showSortDropdown && (
                            <div className="absolute z-10 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleFilterChange("sortBy", option.value)}
                                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 ${
                                            filters.sortBy === option.value 
                                                ? "text-blue-600 bg-blue-50" 
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {option.label}
                                        {filters.sortBy === option.value && (
                                            <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Filters Badges */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-sm text-gray-600 mr-2">Active filters:</span>

                        {filters.designation !== "all" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {getSelectedDesignationLabel()}
                                <button
                                    onClick={() => handleFilterChange("designation", "all")}
                                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {filters.status !== "all" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {getSelectedStatusLabel()}
                                <button
                                    onClick={() => handleFilterChange("status", "all")}
                                    className="ml-1.5 text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {filters.dateRange !== "all" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {getSelectedDateLabel()}
                                <button
                                    onClick={() => handleFilterChange("dateRange", "all")}
                                    className="ml-1.5 text-purple-600 hover:text-purple-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {(salaryRange.min || salaryRange.max) && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Salary: {salaryRange.min || "0"} - {salaryRange.max || "∞"}
                                <button
                                    onClick={() => {
                                        setSalaryRange({ min: "", max: "" });
                                        if (onFilter) onFilter({ ...filters, salaryRange: null });
                                    }}
                                    className="ml-1.5 text-yellow-600 hover:text-yellow-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {(dateRange.from || dateRange.to) && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                Custom Date
                                <button
                                    onClick={() => {
                                        setDateRange({ from: "", to: "" });
                                        if (onFilter) onFilter({ ...filters, customDateRange: null });
                                    }}
                                    className="ml-1.5 text-indigo-600 hover:text-indigo-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Salary Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Salary Range (৳)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="number"
                                            value={salaryRange.min}
                                            onChange={(e) => handleSalaryRangeChange(e, "min")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Min"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            value={salaryRange.max}
                                            onChange={(e) => handleSalaryRangeChange(e, "max")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Max"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Date Range (Custom) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date Range
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="date"
                                            value={dateRange.from}
                                            onChange={(e) => handleDateRangeChange(e, "from")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="date"
                                            value={dateRange.to}
                                            onChange={(e) => handleDateRangeChange(e, "to")}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <div className="flex items-end">
                                <button
                                    onClick={applyAdvancedFilters}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

CustomerSearchFilter.propTypes = {
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
    onSort: PropTypes.func,
    initialFilters: PropTypes.object
};

export default CustomerSearchFilter;