import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Filter, RotateCcw, Search, ChevronDown } from "lucide-react";

const PRODUCT_STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "in-stock", label: "In Stock" },
    { value: "low-stock", label: "Low Stock (Near Limit)" },
    { value: "critical", label: "Critical (Under 20%)" },
    { value: "out-of-stock", label: "Out of Stock" },
];

const PRODUCT_SORT_OPTIONS = [
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "stock_desc", label: "Stock: High to Low" },
    { value: "stock_asc", label: "Stock: Low to High" },
];

const FilterDropdown = ({ label, options = [], onSelect, selectedValue }) => {
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

    const selectedLabel = options.find(o => String(o.value) === String(selectedValue))?.label || label;

    return (
        <div ref={ref} className="relative">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)} 
                className={`flex items-center justify-between px-3 py-2 bg-white border rounded-xl hover:bg-gray-50 min-w-[140px] transition-all ${selectedValue !== 'all' ? 'border-blue-500 ring-1 ring-blue-100 text-blue-600 font-bold' : 'border-gray-200 text-gray-700 font-medium'}`}
            >
                <span className="text-sm truncate">{selectedLabel}</span>
                <ChevronDown size={14} className={`ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-[100] mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 max-h-64 overflow-y-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => { onSelect(option.value); setIsOpen(false); }}
                            className={`flex items-center w-full px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${String(selectedValue) === String(option.value) ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600"}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

const ProductSearchFilter = ({ onSearch, onFilter, dynamicOptions = {} }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        category: "all",
        sub_category: "all",
        brand: "all",
        unit: "all",
        size: "all",
        status: "all",
        sortBy: "name_asc"
    });

    const { categories = [], sub_categories = [], brands = [], units = [], sizes = [] } = dynamicOptions;

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => onSearch(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    // Apply filters
    useEffect(() => {
        onFilter(filters);
    }, [filters, onFilter]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setSearchQuery("");
        setFilters({
            category: "all",
            sub_category: "all",
            brand: "all",
            unit: "all",
            size: "all",
            status: "all",
            sortBy: "name_asc"
        });
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                    placeholder="Search products by name or SKU..."
                />
            </div>

            {/* Filter Buttons Group */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 mr-1">
                    <Filter size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quick Filters</span>
                </div>

                <FilterDropdown 
                    label="Status" 
                    options={PRODUCT_STATUS_OPTIONS} 
                    selectedValue={filters.status} 
                    onSelect={(v) => handleFilterChange("status", v)} 
                />

                <FilterDropdown 
                    label="Category" 
                    options={[{value: 'all', label: 'All Categories'}, ...categories]} 
                    selectedValue={filters.category} 
                    onSelect={(v) => handleFilterChange("category", v)} 
                />

                <FilterDropdown 
                    label="Sub-Category" 
                    options={[{value: 'all', label: 'All Sub-Categories'}, ...sub_categories]} 
                    selectedValue={filters.sub_category} 
                    onSelect={(v) => handleFilterChange("sub_category", v)} 
                />

                <FilterDropdown 
                    label="Brand" 
                    options={[{value: 'all', label: 'All Brands'}, ...brands]} 
                    selectedValue={filters.brand} 
                    onSelect={(v) => handleFilterChange("brand", v)} 
                />

                <FilterDropdown 
                    label="Unit" 
                    options={[{value: 'all', label: 'All Units'}, ...units]} 
                    selectedValue={filters.unit} 
                    onSelect={(v) => handleFilterChange("unit", v)} 
                />

                <FilterDropdown 
                    label="Size" 
                    options={[{value: 'all', label: 'All Sizes'}, ...sizes]} 
                    selectedValue={filters.size} 
                    onSelect={(v) => handleFilterChange("size", v)} 
                />

                <FilterDropdown 
                    label="Sort By" 
                    options={PRODUCT_SORT_OPTIONS} 
                    selectedValue={filters.sortBy} 
                    onSelect={(v) => handleFilterChange("sortBy", v)} 
                />

                <button 
                    onClick={resetFilters} 
                    type="button"
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Clear All Filters"
                >
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
    );
};

ProductSearchFilter.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    dynamicOptions: PropTypes.object,
};

export default ProductSearchFilter;
