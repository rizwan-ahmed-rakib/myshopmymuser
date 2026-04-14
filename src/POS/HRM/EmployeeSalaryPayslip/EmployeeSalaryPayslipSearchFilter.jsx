
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

// Local Constants for Salary Advance
const ADVANCE_STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" }
];

const ADVANCE_SORT_OPTIONS = [
    { value: "date_desc", label: "Newest First" },
    { value: "date_asc", label: "Oldest First" },
    { value: "amount_desc", label: "Amount (High to Low)" },
    { value: "amount_asc", label: "Amount (Low to High)" },
    { value: "name_asc", label: "Name (A-Z)" }
];

const ADVANCE_DATE_FILTER_OPTIONS = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
];

const DESIGNATION_OPTIONS = [
    { value: "all", label: "All Designations" },
    { value: "admin", label: "Admin" },
    { value: "marketing_officer", label: "Marketing Officer" },
    { value: "accountant", label: "Accountant" },
    { value: "sales_person", label: "Sales Person" }
];

const EmployeeSalaryPayslipSearchFilter = ({ onSearch, onFilter, initialFilters = {} }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        designation: initialFilters.designation || "all",
        status: initialFilters.status || "all",
        dateRange: initialFilters.dateRange || "all",
        sortBy: initialFilters.sortBy || "date_desc"
    });

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [amountRange, setAmountRange] = useState({ min: "", max: "" });
    const [customDates, setCustomDates] = useState({ from: "", to: "" });

    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch?.(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Apply filters
    useEffect(() => {
        onFilter?.(filters);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setActiveDropdown(null);
    };

    const applyAdvancedFilters = () => {
        onFilter?.({
            ...filters,
            amountRange: (amountRange.min || amountRange.max) ? amountRange : null,
            customDateRange: (customDates.from || customDates.to) ? customDates : null
        });
        setShowAdvanced(false);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setFilters({
            designation: "all",
            status: "all",
            dateRange: "all",
            sortBy: "date_desc"
        });
        setAmountRange({ min: "", max: "" });
        setCustomDates({ from: "", to: "" });
        onSearch?.("");
        onFilter?.({
            designation: "all",
            status: "all",
            dateRange: "all",
            sortBy: "date_desc",
            amountRange: null,
            customDateRange: null
        });
    };

    const renderDropdown = (label, key, options, icon) => {
        const isOpen = activeDropdown === key;
        const selectedOption = options.find(opt => opt.value === filters[key]);

        return (
            <div className="relative">
                <button
                    onClick={() => setActiveDropdown(isOpen ? null : key)}
                    className={`flex items-center justify-between px-4 py-2.5 bg-white border ${isOpen ? 'border-blue-500 ring-2 ring-blue-50' : 'border-gray-300'} rounded-xl hover:bg-gray-50 transition-all min-w-[160px]`}
                >
                    <span className="flex items-center text-sm font-medium text-gray-700">
                        {icon}
                        <span className="ml-2">{selectedOption?.label || label}</span>
                    </span>
                    <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-[60] mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleFilterChange(key, option.value)}
                                className={`flex items-center w-full px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${
                                    filters[key] === option.value ? "text-blue-600 bg-blue-50 font-semibold" : "text-gray-600"
                                }`}
                            >
                                {option.label}
                                {filters[key] === option.value && (
                                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4" ref={dropdownRef}>
            {/* Search and Main Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, reason, or employee ID..."
                        className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`flex items-center px-5 py-3 rounded-2xl font-semibold transition-all ${
                            showAdvanced ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        } shadow-lg`}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                    </button>
                    <button
                        onClick={resetFilters}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-2xl border border-transparent hover:border-red-100 transition-all"
                        title="Reset all filters"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
                {renderDropdown("Status", "status", ADVANCE_STATUS_OPTIONS,
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
                )}

                {renderDropdown("Designation", "designation", DESIGNATION_OPTIONS,
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg>
                )}

                {renderDropdown("Sort By", "sortBy", ADVANCE_SORT_OPTIONS,
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" strokeWidth="2"/></svg>
                )}

                {renderDropdown("Date", "dateRange", ADVANCE_DATE_FILTER_OPTIONS,
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>
                )}
            </div>

            {/* Advanced Filters Panel */}
            {showAdvanced && (
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Amount Range */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Amount Range (৳)
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={amountRange.min}
                                        onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                                        className="w-full pl-3 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                    />
                                </div>
                                <span className="text-gray-400 font-bold">to</span>
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={amountRange.max}
                                        onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                                        className="w-full pl-3 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Custom Date Range */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Custom Date Range
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="date"
                                    value={customDates.from}
                                    onChange={(e) => setCustomDates(prev => ({ ...prev, from: e.target.value }))}
                                    className="flex-1 px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                />
                                <span className="text-gray-400 font-bold">to</span>
                                <input
                                    type="date"
                                    value={customDates.to}
                                    onChange={(e) => setCustomDates(prev => ({ ...prev, to: e.target.value }))}
                                    className="flex-1 px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 gap-4">
                        <button
                            onClick={() => {
                                setAmountRange({ min: "", max: "" });
                                setCustomDates({ from: "", to: "" });
                            }}
                            className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Clear Inputs
                        </button>
                        <button
                            onClick={applyAdvancedFilters}
                            className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Apply All Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

EmployeeSalaryPayslipSearchFilter.propTypes = {
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
    initialFilters: PropTypes.object
};

export default EmployeeSalaryPayslipSearchFilter;
