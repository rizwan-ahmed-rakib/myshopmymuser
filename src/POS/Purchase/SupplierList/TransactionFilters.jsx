//
// // অথবা src/pages/sale/customer/SaleTransactionFilters.jsx - এও একই কোপি করে ব্যবহার করতে পারেন
//
// import React, { useState, useEffect } from 'react';
// import { FaSearch, FaCalendarAlt, FaFilter, FaTimes } from 'react-icons/fa';
//
// const TransactionFilters = ({ filters, onFilterChange, totalCount }) => {
//     const [localFilters, setLocalFilters] = useState(filters);
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//
//     useEffect(() => {
//         setLocalFilters(filters);
//     }, [filters]);
//
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setLocalFilters(prev => ({ ...prev, [name]: value }));
//     };
//
//     const handleApplyFilters = () => {
//         onFilterChange({ ...localFilters, offset: 0 });
//         setIsFilterOpen(false); // মোবাইলে মডাল বন্ধ
//     };
//
//     const handleReset = () => {
//         const resetFilters = {
//             start_date: '',
//             end_date: '',
//             transaction_type: '',
//             search: '',
//             order_by: 'date_desc',
//             offset: 0,
//             limit: 50
//         };
//         setLocalFilters(resetFilters);
//         onFilterChange(resetFilters);
//         setIsFilterOpen(false);
//     };
//
//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             handleApplyFilters();
//         }
//     };
//
//     // ফিল্ডগুলোর কমন JSX – বড় স্ক্রিন ও মডালে ব্যবহার হবে
//     const filterFields = (
//         <>
//             <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
//                 <div className="flex-1 min-w-[140px]">
//                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
//                         <FaCalendarAlt className="inline mr-1" /> From
//                     </label>
//                     <input
//                         type="date"
//                         name="start_date"
//                         value={localFilters.start_date || ''}
//                         onChange={handleInputChange}
//                         onKeyPress={handleKeyPress}
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     />
//                 </div>
//                 <div className="flex-1 min-w-[140px]">
//                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
//                         <FaCalendarAlt className="inline mr-1" /> To
//                     </label>
//                     <input
//                         type="date"
//                         name="end_date"
//                         value={localFilters.end_date || ''}
//                         onChange={handleInputChange}
//                         onKeyPress={handleKeyPress}
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     />
//                 </div>
//                 <div className="flex-1 min-w-[160px]">
//                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
//                         <FaFilter className="inline mr-1" /> Transaction Type
//                     </label>
//                     <select
//                         name="transaction_type"
//                         value={localFilters.transaction_type || ''}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     >
//                         <option value="">All Types</option>
//                         {/* সাপ্লায়ারের জন্য: */}
//                         <option value="purchase">Purchase Invoice</option>
//                         <option value="purchase_return">Purchase Return</option>
//                         <option value="due_payment">Due Payment</option>
//                         {/* সেলের জন্য আলাদা করবেন:
//                             <option value="sale">Sale Invoice</option>
//                             <option value="sale_return">Sale Return</option>
//                             <option value="due_receive">Due Receive</option>
//                         */}
//                     </select>
//                 </div>
//                 <div className="flex-1 min-w-[180px]">
//                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
//                         <FaSearch className="inline mr-1" /> Search
//                     </label>
//                     <input
//                         type="text"
//                         name="search"
//                         placeholder="Invoice or Note..."
//                         value={localFilters.search || ''}
//                         onChange={handleInputChange}
//                         onKeyPress={handleKeyPress}
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     />
//                 </div>
//             </div>
//             {/* অ্যাকশন বাটন */}
//             <div className="flex flex-wrap justify-end gap-3 mt-4 md:mt-0">
//                 <button
//                     onClick={handleReset}
//                     className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                     Reset
//                 </button>
//                 <button
//                     onClick={handleApplyFilters}
//                     className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                     Apply Filters
//                 </button>
//             </div>
//         </>
//     );
//
//     return (
//         <>
//             {/* ---------- বড় স্ক্রিনের জন্য ইনলাইন ফিল্টার ---------- */}
//             <div className="hidden md:block bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
//                 <div className="flex flex-wrap items-end gap-4">
//                     {filterFields}
//                 </div>
//             </div>
//
//             {/* ---------- ছোট স্ক্রিনের জন্য হেডার (ফিল্টার আইকন + কাউন্ট) ---------- */}
//             <div className="flex md:hidden items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-4">
//                 <span className="text-xs text-gray-400 font-medium">
//                     {totalCount || 0} records found
//                 </span>
//                 <button
//                     onClick={() => setIsFilterOpen(true)}
//                     className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
//                 >
//                     <FaFilter /> Filter
//                 </button>
//             </div>
//
//             {/* ---------- মোবাইলের জন্য মডাল (পপআপ) ---------- */}
//             {isFilterOpen && (
//                 <div className="fixed inset-0 z-50 flex items-end md:hidden">
//                     {/* ব্যাকড্রপ */}
//                     <div
//                         className="absolute inset-0 bg-black bg-opacity-40"
//                         onClick={() => setIsFilterOpen(false)}
//                     ></div>
//                     {/* মডাল কন্টেন্ট – নিচ থেকে স্লাইড আপ */}
//                     <div className="relative w-full bg-white rounded-t-2xl shadow-2xl p-5 pb-6 animate-slide-up">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-bold text-gray-800">Filter Transactions</h3>
//                             <button
//                                 onClick={() => setIsFilterOpen(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                             >
//                                 <FaTimes className="text-gray-500" />
//                             </button>
//                         </div>
//                         {/* ফিল্ডগুলো এখানে রেন্ডার */}
//                         <div className="space-y-4">
//                             {filterFields}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };
//
// export default TransactionFilters;


// src/pages/purchase/supplier/TransactionFilters.jsx
// (সেলের জন্যও একই ব্যবহার করতে পারেন, শুধু select অপশন পরিবর্তন করবেন)

import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaFilter, FaTimes } from 'react-icons/fa';

const TransactionFilters = ({ filters, onFilterChange, totalCount }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        onFilterChange({ ...localFilters, offset: 0 });
        setIsFilterOpen(false);
    };

    const handleReset = () => {
        const resetFilters = {
            start_date: '',
            end_date: '',
            transaction_type: '',
            search: '',
            order_by: 'date_desc',
            offset: 0,
            limit: 50
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
        setIsFilterOpen(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleApplyFilters();
        }
    };

    // ফিল্ডগুলোর JSX – বড় স্ক্রিন ও মডালে ব্যবহৃত হবে
    const filterFields = (
        <>
            {/* ডেট রেঞ্জ – From & To পাশাপাশি */}
            <div className="flex items-center gap-2 flex-nowrap">
                <div className="min-w-[130px]">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                        <FaCalendarAlt className="inline mr-1 text-xs" /> From
                    </label>
                    <input
                        type="date"
                        name="start_date"
                        value={localFilters.start_date || ''}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
                <div className="min-w-[130px]">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                        <FaCalendarAlt className="inline mr-1 text-xs" /> To
                    </label>
                    <input
                        type="date"
                        name="end_date"
                        value={localFilters.end_date || ''}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* টাইপ সিলেক্ট */}
            <div className="min-w-[150px]">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                    <FaFilter className="inline mr-1 text-xs" /> Type
                </label>
                <select
                    name="transaction_type"
                    value={localFilters.transaction_type || ''}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                    <option value="">All Types</option>
                    <option value="purchase">Purchase</option>
                    <option value="purchase_return">Purchase Return</option>
                    <option value="due_payment">Due Payment</option>
                    {/* সেলের জন্য: sale, sale_return, due_receive */}
                </select>
            </div>

            {/* সার্চ ইনপুট – বাকি জায়গা নেয় */}
            <div className="flex-1 min-w-[160px]">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                    <FaSearch className="inline mr-1 text-xs" /> Search
                </label>
                <input
                    type="text"
                    name="search"
                    placeholder="Invoice or Note..."
                    value={localFilters.search || ''}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
            </div>

            {/* অ্যাকশন বাটন – রেকর্ড কাউন্ট সহ */}
            <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-xs text-gray-400 font-medium">
                    {totalCount || 0} records
                </span>
                <button
                    onClick={handleReset}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={handleApplyFilters}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Apply
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* ---------- বড় স্ক্রিন (md+) : সবকিছু এক লাইনে ---------- */}
            <div className="hidden md:flex items-end gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-x-auto">
                {filterFields}
            </div>

            {/* ---------- ছোট স্ক্রিন : শুধু কাউন্ট + ফিল্টার আইকন (নন-ফ্লোটিং) ---------- */}
            <div className="flex md:hidden items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-4">
                <span className="text-xs text-gray-400 font-medium">
                    {totalCount || 0} records found
                </span>
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                    <FaFilter /> Filter
                </button>
            </div>

            {/* ---------- ফ্লোটিং ফিল্টার বাটন (মোবাইলের জন্য সর্বদা দৃশ্যমান) ---------- */}
            <div className="fixed bottom-6 right-6 z-40 md:hidden">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                >
                    <FaFilter size={24} />
                </button>
            </div>

            {/* ---------- মোবাইলের জন্য মডাল (পপআপ) ---------- */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex items-end md:hidden">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-40"
                        onClick={() => setIsFilterOpen(false)}
                    ></div>
                    <div className="relative w-full bg-white rounded-t-2xl shadow-2xl p-5 pb-6 animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Filter Transactions</h3>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FaTimes className="text-gray-500" />
                            </button>
                        </div>
                        {/* মডালের ভেতর ফিল্ডগুলো ভার্টিক্যালি সাজানো */}
                        <div className="space-y-4">
                            {filterFields}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransactionFilters;