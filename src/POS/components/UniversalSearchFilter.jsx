import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { Search, Filter, X, RotateCcw, ChevronDown, Check, Calendar, ArrowUpDown } from "lucide-react";

/**
 * UniversalSearchFilter - A highly reusable search and filter component
 * that follows the POS branding and UI backbone.
 */
const UniversalSearchFilter = ({ 
    onSearch, 
    onFilter, 
    searchPlaceholder = "Search...",
    filtersConfig = [], // Array of { key, label, icon, options: [{value, label}] }
    advancedConfig = [], // Array of { key, type: 'range' | 'date-range', label, minPlaceholder, maxPlaceholder }
    initialFilters = {},
    className = ""
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        ...initialFilters,
        sortBy: initialFilters.sortBy || "all"
    });
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); // stores the key of the active dropdown
    
    // Advanced filter local states
    const [rangeStates, setRangeStates] = useState({}); // stores { [key]: { min, max } or { from, to } }

    const dropdownRef = useRef(null);

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearch) onSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    // Apply filters when they change
    useEffect(() => {
        if (onFilter) onFilter(filters);
    }, [filters, onFilter]);

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setActiveDropdown(null);
    }, []);

    const handleRangeChange = (key, field, value) => {
        setRangeStates(prev => ({
            ...prev,
            [key]: {
                ...(prev[key] || {}),
                [field]: value
            }
        }));
    };

    const applyAdvancedFilters = () => {
        const advancedFilters = {};
        Object.keys(rangeStates).forEach(key => {
            const state = rangeStates[key];
            if (state && (state.min || state.max || state.from || state.to)) {
                advancedFilters[key] = state;
            }
        });

        if (onFilter) {
            onFilter({ ...filters, ...advancedFilters });
        }
        setShowAdvanced(false);
    };

    const resetFilters = () => {
        setSearchQuery("");
        const resetObj = { sortBy: "all" };
        filtersConfig.forEach(f => resetObj[f.key] = "all");
        setFilters(resetObj);
        setRangeStates({});

        if (onSearch) onSearch("");
        if (onFilter) onFilter(resetObj);
    };

    const hasActiveFilters = useMemo(() => {
        const hasQuickFilters = filtersConfig.some(f => filters[f.key] && filters[f.key] !== "all");
        const hasRangeFilters = Object.values(rangeStates).some(s => s && (s.min || s.max || s.from || s.to));
        return hasQuickFilters || hasRangeFilters;
    }, [filters, rangeStates, filtersConfig]);

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
            <div className="p-4">
                {/* Top Row: Search & Action Buttons */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-sm"
                            placeholder={searchPlaceholder}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {advancedConfig.length > 0 && (
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className={`flex items-center px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                                    showAdvanced ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Advanced
                            </button>
                        )}

                        <button
                            onClick={resetFilters}
                            className={`flex items-center px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                                (searchQuery || hasActiveFilters) 
                                    ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                    : 'border-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                            disabled={!searchQuery && !hasActiveFilters}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Quick Filters Row */}
                <div className="flex flex-wrap gap-2 mb-4" ref={dropdownRef}>
                    {filtersConfig.map((config) => (
                        <div key={config.key} className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === config.key ? null : config.key)}
                                className={`flex items-center justify-between px-3 py-2 border rounded-lg text-xs font-medium transition-all min-w-[140px] ${
                                    filters[config.key] && filters[config.key] !== "all"
                                        ? "border-brand-primary bg-blue-50 text-brand-primary"
                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    {config.icon || <Filter className="w-3.5 h-3.5" />}
                                    {config.options.find(opt => opt.value === filters[config.key])?.label || config.label}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 ml-2 transition-transform ${activeDropdown === config.key ? 'rotate-180' : ''}`} />
                            </button>

                            {activeDropdown === config.key && (
                                <div className="absolute z-50 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {config.options.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleFilterChange(config.key, option.value)}
                                            className={`flex items-center w-full px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${
                                                filters[config.key] === option.value 
                                                    ? "text-brand-primary bg-blue-50 font-bold" 
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {option.label}
                                            {filters[config.key] === option.value && <Check className="w-3.5 h-3.5 ml-auto text-brand-primary" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Active Filters Badges */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 mb-2 pt-2 border-t border-dashed border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Active Filters:</span>
                        
                        {filtersConfig.map(config => (
                            filters[config.key] && filters[config.key] !== "all" && (
                                <span key={config.key} className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-brand-primary border border-blue-100 animate-in zoom-in-95 duration-200">
                                    {config.label}: {config.options.find(opt => opt.value === filters[config.key])?.label}
                                    <button
                                        onClick={() => handleFilterChange(config.key, "all")}
                                        className="ml-1.5 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )
                        ))}

                        {Object.keys(rangeStates).map(key => {
                            const state = rangeStates[key];
                            const config = advancedConfig.find(c => c.key === key);
                            if (!config) return null;

                            if (config.type === 'range' && (state.min || state.max)) {
                                return (
                                    <span key={key} className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                                        {config.label}: {state.min || 0} - {state.max || '∞'}
                                        <button
                                            onClick={() => {
                                                const newState = { ...rangeStates };
                                                delete newState[key];
                                                setRangeStates(newState);
                                                if (onFilter) onFilter({ ...filters, [key]: null });
                                            }}
                                            className="ml-1.5 hover:bg-amber-100 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                );
                            }

                            if (config.type === 'date-range' && (state.from || state.to)) {
                                return (
                                    <span key={key} className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {config.label}: {state.from || '...'} to {state.to || '...'}
                                        <button
                                            onClick={() => {
                                                const newState = { ...rangeStates };
                                                delete newState[key];
                                                setRangeStates(newState);
                                                if (onFilter) onFilter({ ...filters, [key]: null });
                                            }}
                                            className="ml-1.5 hover:bg-indigo-100 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}

                {/* Advanced Filters Panel */}
                {showAdvanced && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {advancedConfig.map((config) => (
                                <div key={config.key}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                        {config.label}
                                    </label>
                                    
                                    {config.type === 'range' ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="number"
                                                value={rangeStates[config.key]?.min || ""}
                                                onChange={(e) => handleRangeChange(config.key, "min", e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                                                placeholder={config.minPlaceholder || "Min"}
                                            />
                                            <input
                                                type="number"
                                                value={rangeStates[config.key]?.max || ""}
                                                onChange={(e) => handleRangeChange(config.key, "max", e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                                                placeholder={config.maxPlaceholder || "Max"}
                                            />
                                        </div>
                                    ) : config.type === 'date-range' ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                value={rangeStates[config.key]?.from || ""}
                                                onChange={(e) => handleRangeChange(config.key, "from", e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                                            />
                                            <input
                                                type="date"
                                                value={rangeStates[config.key]?.to || ""}
                                                onChange={(e) => handleRangeChange(config.key, "to", e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ))}

                            <div className="flex items-end">
                                <button
                                    onClick={applyAdvancedFilters}
                                    className="w-full px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg transition-all font-semibold text-sm shadow-md active:scale-95"
                                >
                                    Apply All Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

UniversalSearchFilter.propTypes = {
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    filtersConfig: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.node,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })).isRequired
    })),
    advancedConfig: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['range', 'date-range']).isRequired,
        label: PropTypes.string.isRequired,
        minPlaceholder: PropTypes.string,
        maxPlaceholder: PropTypes.string
    })),
    initialFilters: PropTypes.object,
    className: PropTypes.string
};

export default UniversalSearchFilter;
