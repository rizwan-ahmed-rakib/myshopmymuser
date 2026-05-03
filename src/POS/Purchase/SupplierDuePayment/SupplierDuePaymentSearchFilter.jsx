import React, { useState, useEffect, useRef, useCallback } from "react";
import Select from "react-select";

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "cash", label: "Cash" },
    { value: "mobile_banking", label: "Mobile Banking" },
    { value: "bank", label: "Bank" },
    { value: "hybrid", label: "Hybrid" },
];

const SORT_OPTIONS = [
    { value: "date_desc", label: "Date: Newest First" },
    { value: "date_asc", label: "Date: Oldest First" },
    { value: "amount_desc", label: "Amount: High to Low" },
    { value: "amount_asc", label: "Amount: Low to High" },
];

const SupplierDuePaymentSearchFilter = ({ onSearch, onFilter }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        method: "all",
        sortBy: "date_desc"
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    useEffect(() => {
        onFilter(filters);
    }, [filters, onFilter]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            borderRadius: '0.75rem',
            padding: '0.1rem',
            borderWidth: '1px',
            borderColor: '#e5e7eb',
            '&:hover': { borderColor: '#3b82f6' }
        })
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Search by invoice # or supplier..."
                    />
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <div className="min-w-[180px]">
                        <Select
                            options={STATUS_OPTIONS}
                            onChange={(opt) => handleFilterChange("method", opt.value)}
                            value={STATUS_OPTIONS.find(o => o.value === filters.method)}
                            styles={customSelectStyles}
                            placeholder="Payment Method"
                        />
                    </div>
                    <div className="min-w-[180px]">
                        <Select
                            options={SORT_OPTIONS}
                            onChange={(opt) => handleFilterChange("sortBy", opt.value)}
                            value={SORT_OPTIONS.find(o => o.value === filters.sortBy)}
                            styles={customSelectStyles}
                            placeholder="Sort By"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDuePaymentSearchFilter;
