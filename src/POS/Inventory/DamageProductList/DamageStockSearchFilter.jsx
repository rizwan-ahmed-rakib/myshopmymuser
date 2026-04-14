import React, { useState } from 'react';

const DamageStockSearchFilter = ({ onSearch, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        damageType: 'all',
        compensationStatus: 'all',
        sortBy: 'date_desc',
        dateRange: null
    });

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const handleDateRangeChange = (type, value) => {
        const dateRange = filters.dateRange || { start: '', end: '' };
        const newDateRange = { ...dateRange, [type]: value };
        handleFilterChange('dateRange', newDateRange);
    };

    const clearFilters = () => {
        const defaultFilters = {
            damageType: 'all',
            compensationStatus: 'all',
            sortBy: 'date_desc',
            dateRange: null
        };
        setFilters(defaultFilters);
        onFilter(defaultFilters);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="প্রোডাক্টের নাম, কোড বা কারণে সার্চ করুন..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center px-4 py-2 border rounded-lg transition-colors ${
                        showFilters 
                            ? 'bg-blue-50 border-blue-300 text-blue-600' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    ফিল্টার
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Damage Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ড্যামেজ টাইপ
                            </label>
                            <select
                                value={filters.damageType}
                                onChange={(e) => handleFilterChange('damageType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">সব</option>
                                <option value="returnable">রিটার্নযোগ্য</option>
                                <option value="non_returnable">নন-রিটার্নযোগ্য</option>
                            </select>
                        </div>

                        {/* Compensation Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ক্ষতিপূরণ স্ট্যাটাস
                            </label>
                            <select
                                value={filters.compensationStatus}
                                onChange={(e) => handleFilterChange('compensationStatus', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">সব</option>
                                <option value="compensated">ক্ষতিপূরণ দেওয়া হয়েছে</option>
                                <option value="uncompensated">ক্ষতিপূরণ বাকি</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                সাজান
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="date_desc">তারিখ (নতুন প্রথম)</option>
                                <option value="date_asc">তারিখ (পুরাতন প্রথম)</option>
                                <option value="name_asc">নাম (ক-হ)</option>
                                <option value="name_desc">নাম (হ-ক)</option>
                                <option value="quantity_desc">পরিমাণ (বেশি প্রথম)</option>
                                <option value="quantity_asc">পরিমাণ (কম প্রথম)</option>
                                <option value="loss_desc">ক্ষতি (বেশি প্রথম)</option>
                                <option value="loss_asc">ক্ষতি (কম প্রথম)</option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                তারিখ রেঞ্জ
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="date"
                                    value={filters.dateRange?.start || ''}
                                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input
                                    type="date"
                                    value={filters.dateRange?.end || ''}
                                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            ফিল্টার ক্লিয়ার করুন
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DamageStockSearchFilter;