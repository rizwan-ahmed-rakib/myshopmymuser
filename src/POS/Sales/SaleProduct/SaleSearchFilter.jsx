import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { posCustomerAPI } from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";

const SALE_STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "paid", label: "Paid" },
    { value: "partial", label: "Partial" },
    { value: "unpaid", label: "Unpaid" },
];

const SALE_SORT_OPTIONS = [
    { value: "date_desc", label: "Newest First" },
    { value: "date_asc", label: "Oldest First" },
    { value: "invoice_asc", label: "Invoice: Low to High" },
    { value: "invoice_desc", label: "Invoice: High to Low" },
    { value: "due_desc", label: "Due: High to Low" },
];

const METHOD_OPTIONS = [
    { value: "all", label: "All Methods" },
    { value: "cash", label: "Cash" },
    { value: "mobile_banking", label: "Mobile Banking" },
    { value: "bank", label: "Bank" },
    { value: "hybrid", label: "Hybrid" },
];

const FilterDropdown = ({ label, options, onSelect, selectedValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[180px]">
                <span className="text-sm font-medium">{label}</span>
                <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-1 w-64 bg-white rounded-lg shadow-lg border py-2 max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => { onSelect(option.value); setIsOpen(false); }}
                            className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 ${selectedValue === option.value ? "text-blue-600 font-bold" : "text-gray-700"}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const SaleSearchFilter = ({ onSearch, onFilter }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [customers, setCustomers] = useState([{ value: "all", label: "All Customers" }]);
    const [filters, setFilters] = useState({
        customer: "all",
        method: "all",
        status: "all",
        sortBy: "date_desc",
        startDate: "",
        endDate: ""
    });
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await posCustomerAPI.getAll();
                const options = res.data.map(c => ({ value: c.id.toString(), label: c.name }));
                setCustomers([{ value: "all", label: "All Customers" }, ...options]);
            } catch (err) { console.error(err); }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => onSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    useEffect(() => { onFilter(filters); }, [filters, onFilter]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetFilters = () => {
        setSearchQuery("");
        setFilters({ customer: "all", method: "all", status: "all", sortBy: "date_desc", startDate: "", endDate: "" });
        onSearch("");
    };

    const hasActiveFilters = React.useMemo(() => {
        return filters.customer !== "all" || filters.method !== "all" || filters.status !== "all" || filters.startDate || filters.endDate;
    }, [filters]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="w-full lg:flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by Invoice No..."
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 font-bold text-sm text-gray-600 transition-all">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Date Range
                    </button>
                    <button onClick={resetFilters} className="px-4 py-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 font-bold text-sm transition-all" disabled={!searchQuery && !hasActiveFilters}>Reset</button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
                <FilterDropdown label={customers.find(o => o.value === filters.customer)?.label || "Customer"} options={customers} onSelect={(val) => handleFilterChange("customer", val)} selectedValue={filters.customer} />
                <FilterDropdown label={METHOD_OPTIONS.find(o => o.value === filters.method)?.label || "Method"} options={METHOD_OPTIONS} onSelect={(val) => handleFilterChange("method", val)} selectedValue={filters.method} />
                <FilterDropdown label={SALE_STATUS_OPTIONS.find(o => o.value === filters.status)?.label || "Status"} options={SALE_STATUS_OPTIONS} onSelect={(val) => handleFilterChange("status", val)} selectedValue={filters.status} />
                <FilterDropdown label={SALE_SORT_OPTIONS.find(o => o.value === filters.sortBy)?.label || "Sort"} options={SALE_SORT_OPTIONS} onSelect={(val) => handleFilterChange("sortBy", val)} selectedValue={filters.sortBy} />
            </div>

            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-dashed grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From Date</label>
                        <input type="date" value={filters.startDate} onChange={(e) => handleFilterChange("startDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">To Date</label>
                        <input type="date" value={filters.endDate} onChange={(e) => handleFilterChange("endDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                </div>
            )}
        </div>
    );
};

SaleSearchFilter.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
};

export default SaleSearchFilter;