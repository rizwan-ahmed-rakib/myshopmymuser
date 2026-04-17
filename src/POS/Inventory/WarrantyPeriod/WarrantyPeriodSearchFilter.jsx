import React, { useState, useEffect, useCallback } from "react";

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

const SORT_OPTIONS = [
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
];

const WarrantyPeriodSearchFilter = ({ onSearch, onFilter }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        sortBy: "name_asc"
    });

    useEffect(() => {
        const timer = setTimeout(() => onSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    useEffect(() => {
        onFilter(filters);
    }, [filters, onFilter]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Search by name..."
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <button
                        onClick={() => { setSearchQuery(""); setFilters({ status: "all", sortBy: "name_asc" }); }}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarrantyPeriodSearchFilter;
