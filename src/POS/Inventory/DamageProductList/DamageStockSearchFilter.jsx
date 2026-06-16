// import React, { useState } from 'react';

// const DamageStockSearchFilter = ({ onSearch, onFilter }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showFilters, setShowFilters] = useState(false);
//     const [filters, setFilters] = useState({
//         damageType: 'all',
//         compensationStatus: 'all',
//         sortBy: 'date_desc',
//         dateRange: null
//     });

//     const handleSearchChange = (e) => {
//         const value = e.target.value;
//         setSearchTerm(value);
//         onSearch(value);
//     };

//     const handleFilterChange = (key, value) => {
//         const newFilters = { ...filters, [key]: value };
//         setFilters(newFilters);
//         onFilter(newFilters);
//     };

//     const handleDateRangeChange = (type, value) => {
//         const dateRange = filters.dateRange || { start: '', end: '' };
//         const newDateRange = { ...dateRange, [type]: value };
//         handleFilterChange('dateRange', newDateRange);
//     };

//     const clearFilters = () => {
//         const defaultFilters = {
//             damageType: 'all',
//             compensationStatus: 'all',
//             sortBy: 'date_desc',
//             dateRange: null
//         };
//         setFilters(defaultFilters);
//         onFilter(defaultFilters);
//     };

//     return (
//         <div className="bg-white rounded-xl shadow-sm p-4">
//             {/* Search Bar */}
//             <div className="flex flex-col sm:flex-row gap-3">
//                 <div className="flex-1 relative">
//                     <input
//                         type="text"
//                         placeholder="প্রোডাক্টের নাম, কোড বা কারণে সার্চ করুন..."
//                         value={searchTerm}
//                         onChange={handleSearchChange}
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                     <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                 </div>

//                 <button
//                     onClick={() => setShowFilters(!showFilters)}
//                     className={`flex items-center justify-center px-4 py-2 border rounded-lg transition-colors ${
//                         showFilters 
//                             ? 'bg-blue-50 border-blue-300 text-blue-600' 
//                             : 'border-gray-300 text-gray-600 hover:bg-gray-50'
//                     }`}
//                 >
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                     </svg>
//                     ফিল্টার
//                 </button>
//             </div>

//             {/* Filters */}
//             {showFilters && (
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                         {/* Damage Type Filter */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 ড্যামেজ টাইপ
//                             </label>
//                             <select
//                                 value={filters.damageType}
//                                 onChange={(e) => handleFilterChange('damageType', e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             >
//                                 <option value="all">সব</option>
//                                 <option value="returnable">রিটার্নযোগ্য</option>
//                                 <option value="non_returnable">নন-রিটার্নযোগ্য</option>
//                             </select>
//                         </div>

//                         {/* Compensation Status Filter */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 ক্ষতিপূরণ স্ট্যাটাস
//                             </label>
//                             <select
//                                 value={filters.compensationStatus}
//                                 onChange={(e) => handleFilterChange('compensationStatus', e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             >
//                                 <option value="all">সব</option>
//                                 <option value="compensated">ক্ষতিপূরণ দেওয়া হয়েছে</option>
//                                 <option value="uncompensated">ক্ষতিপূরণ বাকি</option>
//                             </select>
//                         </div>

//                         {/* Sort By */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 সাজান
//                             </label>
//                             <select
//                                 value={filters.sortBy}
//                                 onChange={(e) => handleFilterChange('sortBy', e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             >
//                                 <option value="date_desc">তারিখ (নতুন প্রথম)</option>
//                                 <option value="date_asc">তারিখ (পুরাতন প্রথম)</option>
//                                 <option value="name_asc">নাম (ক-হ)</option>
//                                 <option value="name_desc">নাম (হ-ক)</option>
//                                 <option value="quantity_desc">পরিমাণ (বেশি প্রথম)</option>
//                                 <option value="quantity_asc">পরিমাণ (কম প্রথম)</option>
//                                 <option value="loss_desc">ক্ষতি (বেশি প্রথম)</option>
//                                 <option value="loss_asc">ক্ষতি (কম প্রথম)</option>
//                             </select>
//                         </div>

//                         {/* Date Range */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 তারিখ রেঞ্জ
//                             </label>
//                             <div className="flex space-x-2">
//                                 <input
//                                     type="date"
//                                     value={filters.dateRange?.start || ''}
//                                     onChange={(e) => handleDateRangeChange('start', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                                 <input
//                                     type="date"
//                                     value={filters.dateRange?.end || ''}
//                                     onChange={(e) => handleDateRangeChange('end', e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Clear Filters */}
//                     <div className="mt-3 flex justify-end">
//                         <button
//                             onClick={clearFilters}
//                             className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
//                         >
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                             ফিল্টার ক্লিয়ার করুন
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DamageStockSearchFilter;

















import React, { useState, useEffect, useRef } from "react";

const SelectFilter = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-slate-700 bg-white"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const DamageStockSearchFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    damageType: "all",
    compensationStatus: "all",
    sortBy: "date_desc",
    dateRange: null,
  });

  useEffect(() => {
    const timer = setTimeout(() => onSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilter(updated);
  };

  const handleDateRangeChange = (type, value) => {
    const dateRange = filters.dateRange || { start: "", end: "" };
    handleFilterChange("dateRange", { ...dateRange, [type]: value });
  };

  const clearFilters = () => {
    const def = { damageType: "all", compensationStatus: "all", sortBy: "date_desc", dateRange: null };
    setFilters(def);
    setSearchTerm("");
    onSearch("");
    onFilter(def);
  };

  const hasActiveFilters =
    searchTerm ||
    filters.damageType !== "all" ||
    filters.compensationStatus !== "all" ||
    filters.dateRange?.start ||
    filters.dateRange?.end;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="p-4">
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="প্রোডাক্টের নাম, কোড বা কারণে সার্চ করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-slate-400 text-slate-700"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg border transition-colors ${
              showFilters ? "bg-orange-50 border-orange-300 text-orange-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            ফিল্টার
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              ক্লিয়ার
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SelectFilter
              label="ড্যামেজ টাইপ"
              value={filters.damageType}
              onChange={(v) => handleFilterChange("damageType", v)}
              options={[
                { value: "all", label: "সব" },
                { value: "returnable", label: "রিটার্নযোগ্য" },
                { value: "non_returnable", label: "নন-রিটার্নযোগ্য" },
              ]}
            />
            <SelectFilter
              label="ক্ষতিপূরণ স্ট্যাটাস"
              value={filters.compensationStatus}
              onChange={(v) => handleFilterChange("compensationStatus", v)}
              options={[
                { value: "all", label: "সব" },
                { value: "compensated", label: "ক্ষতিপূরণ দেওয়া হয়েছে" },
                { value: "uncompensated", label: "ক্ষতিপূরণ বাকি" },
              ]}
            />
            <SelectFilter
              label="সাজান"
              value={filters.sortBy}
              onChange={(v) => handleFilterChange("sortBy", v)}
              options={[
                { value: "date_desc", label: "তারিখ (নতুন প্রথম)" },
                { value: "date_asc", label: "তারিখ (পুরাতন প্রথম)" },
                { value: "name_asc", label: "নাম (ক-হ)" },
                { value: "name_desc", label: "নাম (হ-ক)" },
                { value: "quantity_desc", label: "পরিমাণ (বেশি প্রথম)" },
                { value: "loss_desc", label: "ক্ষতি (বেশি প্রথম)" },
              ]}
            />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">তারিখ রেঞ্জ</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateRange?.start || ""}
                  onChange={(e) => handleDateRangeChange("start", e.target.value)}
                  className="flex-1 px-2 py-2 text-[11px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="date"
                  value={filters.dateRange?.end || ""}
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                  className="flex-1 px-2 py-2 text-[11px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DamageStockSearchFilter;