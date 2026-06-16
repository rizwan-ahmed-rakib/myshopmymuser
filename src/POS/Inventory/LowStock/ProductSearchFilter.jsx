// import React, { useState, useEffect, useRef, useCallback } from "react";
// import PropTypes from "prop-types";
// import { Filter, RotateCcw, Search, ChevronDown } from "lucide-react";

// const PRODUCT_STATUS_OPTIONS = [
//     { value: "all", label: "All Statuses" },
//     { value: "in-stock", label: "In Stock" },
//     { value: "low-stock", label: "Low Stock (Near Limit)" },
//     { value: "critical", label: "Critical (Under 20%)" },
//     { value: "out-of-stock", label: "Out of Stock" },
// ];

// const PRODUCT_SORT_OPTIONS = [
//     { value: "stock_asc", label: "Stock: Low to High" },
//     { value: "stock_desc", label: "Stock: High to Low" },
//     { value: "name_asc", label: "Name: A to Z" },
//     { value: "name_desc", label: "Name: Z to A" },
//     { value: "price_asc", label: "Price: Low to High" },
//     { value: "price_desc", label: "Price: High to Low" },
// ];

// const FilterDropdown = ({ label, options = [], onSelect, selectedValue }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const ref = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (ref.current && !ref.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const selectedLabel = options.find(o => String(o.value) === String(selectedValue))?.label || label;

//     return (
//         <div ref={ref} className="relative">
//             <button 
//                 type="button"
//                 onClick={() => setIsOpen(!isOpen)} 
//                 className={`flex items-center justify-between px-3 py-2 bg-white border rounded-xl hover:bg-gray-50 min-w-[140px] transition-all ${selectedValue !== 'all' ? 'border-blue-500 ring-1 ring-blue-100 text-blue-600' : 'border-gray-200 text-gray-700'}`}
//             >
//                 <span className="text-sm font-semibold truncate">{selectedLabel}</span>
//                 <ChevronDown size={14} className={`ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//             </button>
//             {isOpen && (
//                 <div className="absolute z-[100] mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 max-h-64 overflow-y-auto">
//                     {options.map((option) => (
//                         <button
//                             key={option.value}
//                             onClick={() => { onSelect(option.value); setIsOpen(false); }}
//                             className={`flex items-center w-full px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${String(selectedValue) === String(option.value) ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600"}`}
//                         >
//                             {option.label}
//                         </button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// const ProductSearchFilter = ({ onSearch, onFilter, dynamicOptions = {} }) => {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filters, setFilters] = useState({
//         category: "all",
//         sub_category: "all",
//         brand: "all",
//         unit: "all",
//         size: "all",
//         status: "low-stock",
//         sortBy: "stock_asc"
//     });

//     const { categories = [], sub_categories = [], brands = [], units = [], sizes = [] } = dynamicOptions;

//     // Debounced search
//     useEffect(() => {
//         const timer = setTimeout(() => onSearch(searchQuery), 400);
//         return () => clearTimeout(timer);
//     }, [searchQuery, onSearch]);

//     // Apply filters
//     useEffect(() => {
//         onFilter(filters);
//     }, [filters, onFilter]);

//     const handleFilterChange = (key, value) => {
//         setFilters(prev => ({ ...prev, [key]: value }));
//     };

//     const resetFilters = () => {
//         setSearchQuery("");
//         setFilters({
//             category: "all",
//             sub_category: "all",
//             brand: "all",
//             unit: "all",
//             size: "all",
//             status: "all",
//             sortBy: "stock_asc"
//         });
//     };

//     return (
//         <div className="space-y-4">
//             {/* Search Bar */}
//             <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
//                     placeholder="Search by name, SKU or code..."
//                 />
//             </div>

//             {/* Filter Buttons Group */}
//             <div className="flex flex-wrap items-center gap-3">
//                 <div className="flex items-center gap-2 mr-2">
//                     <Filter size={16} className="text-gray-400" />
//                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filters:</span>
//                 </div>

//                 <FilterDropdown 
//                     label="Status" 
//                     options={PRODUCT_STATUS_OPTIONS} 
//                     selectedValue={filters.status} 
//                     onSelect={(v) => handleFilterChange("status", v)} 
//                 />

//                 <FilterDropdown 
//                     label="Category" 
//                     options={[{value: 'all', label: 'All Categories'}, ...categories]} 
//                     selectedValue={filters.category} 
//                     onSelect={(v) => handleFilterChange("category", v)} 
//                 />

//                 <FilterDropdown 
//                     label="Sub-Category" 
//                     options={[{value: 'all', label: 'All Sub-Categories'}, ...sub_categories]} 
//                     selectedValue={filters.sub_category} 
//                     onSelect={(v) => handleFilterChange("sub_category", v)} 
//                 />

//                 <FilterDropdown 
//                     label="Brand" 
//                     options={[{value: 'all', label: 'All Brands'}, ...brands]} 
//                     selectedValue={filters.brand} 
//                     onSelect={(v) => handleFilterChange("brand", v)} 
//                 />

//                 <FilterDropdown 
//                     label="Unit" 
//                     options={[{value: 'all', label: 'All Units'}, ...units]} 
//                     selectedValue={filters.unit} 
//                     onSelect={(v) => handleFilterChange("unit", v)} 
//                 />

//                 <FilterDropdown 
//                     label="Size" 
//                     options={[{value: 'all', label: 'All Sizes'}, ...sizes]} 
//                     selectedValue={filters.size} 
//                     onSelect={(v) => handleFilterChange("size", v)} 
//                 />

//                 <FilterDropdown 
//                     label="Sort By" 
//                     options={PRODUCT_SORT_OPTIONS} 
//                     selectedValue={filters.sortBy} 
//                     onSelect={(v) => handleFilterChange("sortBy", v)} 
//                 />

//                 <button 
//                     onClick={resetFilters} 
//                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
//                     title="Reset Filters"
//                 >
//                     <RotateCcw size={20} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ProductSearchFilter;















import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

const PRODUCT_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "critical", label: "Critical (< 20%)" },
  { value: "out-of-stock", label: "Out of Stock" },
];

const PRODUCT_SORT_OPTIONS = [
  { value: "stock_asc", label: "Stock: Low → High" },
  { value: "stock_desc", label: "Stock: High → Low" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "name_desc", label: "Name: Z → A" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const FilterDropdown = ({ label, options = [], onSelect, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const isActive = String(selectedValue) !== "all";
  const selectedLabel = options.find(o => String(o.value) === String(selectedValue))?.label || label;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-[12px] font-medium rounded-lg border transition-all whitespace-nowrap ${
          isActive
            ? "bg-indigo-50 border-indigo-300 text-indigo-700"
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <span className="truncate max-w-[120px]">{selectedLabel}</span>
        <svg className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 4l4 4 4-4"/>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-20 top-full mt-1 left-0 min-w-[180px] w-max max-w-[220px] bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 max-h-56 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onSelect(option.value); setIsOpen(false); }}
              className={`flex items-center justify-between w-full px-3.5 py-2 text-[12px] transition-colors text-left ${
                String(selectedValue) === String(option.value)
                  ? "text-indigo-600 bg-indigo-50 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {option.label}
              {String(selectedValue) === String(option.value) && (
                <svg className="w-3 h-3 text-indigo-500 shrink-0 ml-2" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductSearchFilter = ({ onSearch, onFilter, dynamicOptions = {} }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    sub_category: "all",
    brand: "all",
    unit: "all",
    size: "all",
    status: "low-stock",
    sortBy: "stock_asc",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const { categories = [], sub_categories = [], brands = [], units = [], sizes = [] } = dynamicOptions;

  useEffect(() => {
    const timer = setTimeout(() => onSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  useEffect(() => { onFilter(filters); }, [filters, onFilter]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const applyAdvancedFilters = () => {
    onFilter({
      ...filters,
      priceRange: (priceRange.min || priceRange.max)
        ? { min: priceRange.min ? parseInt(priceRange.min) : null, max: priceRange.max ? parseInt(priceRange.max) : null }
        : null,
    });
    setShowAdvanced(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    const def = { category: "all", sub_category: "all", brand: "all", unit: "all", size: "all", status: "all", sortBy: "stock_asc" };
    setFilters(def);
    onSearch("");
    onFilter({ ...def, priceRange: null });
  };

  const hasActiveFilters =
    searchQuery ||
    filters.status !== "all" ||
    filters.category !== "all" ||
    filters.brand !== "all" ||
    filters.sub_category !== "all" ||
    filters.unit !== "all" ||
    filters.size !== "all" ||
    priceRange.min ||
    priceRange.max;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="p-4 space-y-3">

        {/* Search + action row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU or code..."
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-slate-400 text-slate-700"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg border transition-colors ${
                showAdvanced ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Advanced
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Filter chips row */}
        <div className="flex flex-wrap gap-2">
          <FilterDropdown label="Status" options={PRODUCT_STATUS_OPTIONS} selectedValue={filters.status} onSelect={(v) => handleFilterChange("status", v)} />
          {categories.length > 0 && (
            <FilterDropdown label="Category" options={[{ value: "all", label: "All Categories" }, ...categories]} selectedValue={filters.category} onSelect={(v) => handleFilterChange("category", v)} />
          )}
          {sub_categories.length > 0 && (
            <FilterDropdown label="Sub-Category" options={[{ value: "all", label: "All Sub-Categories" }, ...sub_categories]} selectedValue={filters.sub_category} onSelect={(v) => handleFilterChange("sub_category", v)} />
          )}
          {brands.length > 0 && (
            <FilterDropdown label="Brand" options={[{ value: "all", label: "All Brands" }, ...brands]} selectedValue={filters.brand} onSelect={(v) => handleFilterChange("brand", v)} />
          )}
          {units.length > 0 && (
            <FilterDropdown label="Unit" options={[{ value: "all", label: "All Units" }, ...units]} selectedValue={filters.unit} onSelect={(v) => handleFilterChange("unit", v)} />
          )}
          {sizes.length > 0 && (
            <FilterDropdown label="Size" options={[{ value: "all", label: "All Sizes" }, ...sizes]} selectedValue={filters.size} onSelect={(v) => handleFilterChange("size", v)} />
          )}
          <FilterDropdown label="Sort By" options={PRODUCT_SORT_OPTIONS} selectedValue={filters.sortBy} onSelect={(v) => handleFilterChange("sortBy", v)} />
        </div>

        {/* Advanced: price range */}
        {showAdvanced && (
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Price Range</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))}
                placeholder="Min ৳"
                className="w-28 px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <span className="text-slate-400 text-sm">—</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))}
                placeholder="Max ৳"
                className="w-28 px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={applyAdvancedFilters}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-medium rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}
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