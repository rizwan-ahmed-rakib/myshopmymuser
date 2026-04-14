import React from 'react';

const DamageStockHeader = ({ viewType, setViewType, onAddClick }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">ড্যামেজ স্টক ম্যানেজমেন্ট</h1>
                <p className="text-sm text-gray-500 mt-1">ক্ষতিগ্রস্ত পণ্যের তালিকা দেখুন ও ব্যবস্থাপনা করুন</p>
            </div>

            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewType("grid")}
                        className={`p-2 rounded-md transition-colors ${
                            viewType === "grid" 
                                ? "bg-white shadow-sm text-blue-600" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        title="গ্রিড ভিউ"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewType("list")}
                        className={`p-2 rounded-md transition-colors ${
                            viewType === "list" 
                                ? "bg-white shadow-sm text-blue-600" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        title="লিস্ট ভিউ"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Add Button */}
                <button
                    onClick={onAddClick}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    নতুন ড্যামেজ রেকর্ড
                </button>
            </div>
        </div>
    );
};

export default DamageStockHeader;