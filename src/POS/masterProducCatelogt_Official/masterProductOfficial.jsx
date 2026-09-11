// /**
//  * মাস্টার প্রোডাক্ট ক্যাটালগ (React Component)
//  * ==============================================
//  * - ডায়নামিক ফিল্টার (Category, SubCategory, Brand, Specification, DosageForm)
//  * - প্রতিটি ড্রপডাউন সার্চেবল
//  * - পেজিনেশন, Bulk Import, প্রোগ্রেস ট্র্যাকিং
//  * - সম্পূর্ণ রেসপনসিভ (মোবাইল-ফ্রেন্ডলি)
//  */
//
// import React, {useState, useEffect, useCallback, useRef} from 'react';
// import api from "../../context_or_provider/pos/posApi";
//
// // ========== সার্চেবল ড্রপডাউন ==========
// const SearchableDropdown = ({options, value, onChange, placeholder, disabled}) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef(null);
//
//     const filteredOptions = options.filter(opt =>
//         opt.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);
//
//     return (
//         <div className="relative w-full" ref={dropdownRef}>
//             <div className="relative">
//                 <input
//                     type="text"
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
//                     placeholder={placeholder}
//                     value={searchTerm}
//                     onChange={(e) => {
//                         setSearchTerm(e.target.value);
//                         setIsOpen(true);
//                     }}
//                     onFocus={() => setIsOpen(true)}
//                     disabled={disabled}
//                 />
//                 <button
//                     type="button"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
//                     onClick={() => setIsOpen(!isOpen)}
//                     disabled={disabled}
//                 >
//                     ▼
//                 </button>
//             </div>
//
//             {isOpen && !disabled && (
//                 <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg">
//                     <li
//                         className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${!value ? 'bg-blue-100 font-semibold' : ''}`}
//                         onClick={() => {
//                             onChange('');
//                             setSearchTerm('');
//                             setIsOpen(false);
//                         }}
//                     >
//                         সব
//                     </li>
//                     {filteredOptions.length === 0 ? (
//                         <li className="px-3 py-2 text-gray-400">কোনো অপশন নেই</li>
//                     ) : (
//                         filteredOptions.map((opt) => (
//                             <li
//                                 key={opt}
//                                 className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${value === opt ? 'bg-blue-100 font-semibold' : ''}`}
//                                 onClick={() => {
//                                     onChange(opt);
//                                     setSearchTerm(opt);
//                                     setIsOpen(false);
//                                 }}
//                             >
//                                 {opt}
//                             </li>
//                         ))
//                     )}
//                 </ul>
//             )}
//         </div>
//     );
// };
//
// // ========== মূল কম্পোনেন্ট ==========
// const MasterCatalog = () => {
//     const [products, setProducts] = useState([]);
//     const [filters, setFilters] = useState({
//         search: '',
//         category: '',
//         sub_category: '',
//         brand: '',
//         specification: '',
//         dosage_form: '',
//     });
//     const [filterOptions, setFilterOptions] = useState({
//         categories: [],
//         sub_categories: [],
//         brands: [],
//         specifications: [],
//         dosage_forms: [],
//     });
//
//     const [selectedIds, setSelectedIds] = useState(new Set());
//     const [loading, setLoading] = useState(false);
//     const [progress, setProgress] = useState(null);
//     const [isImporting, setIsImporting] = useState(false);
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [error, setError] = useState(null);
//     const [brokenImages, setBrokenImages] = useState(new Set());
//     const pollingInterval = useRef(null);
//
//     // ফিল্টার অপশন লোড
//     useEffect(() => {
//         const fetchFilterOptions = async () => {
//             try {
//                 const res = await api.get('/api/filter-options/');
//                 setFilterOptions({
//                     categories: res.data.categories || [],
//                     sub_categories: res.data.sub_categories || [],
//                     brands: res.data.brands || [],
//                     specifications: res.data.specifications || [],
//                     dosage_forms: res.data.dosage_forms || [],
//                 });
//             } catch (err) {
//                 console.error('ফিল্টার অপশন লোড করতে ব্যর্থ:', err);
//             }
//         };
//         fetchFilterOptions();
//     }, []);
//
//     // প্রোডাক্ট লোড
//     const fetchProducts = useCallback(async (pageNum) => {
//             console.log('Current filters:', filters);  // ← এই লাইন যোগ করুন
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await api.get('/api/master-products/', {
//                 params: {...filters, page: pageNum, page_size: 20}
//             });
//             setProducts(res.data.results || []);
//             setTotalPages(res.data.total_pages || 1);
//             setPage(pageNum);
//         } catch (err) {
//             setError('মাস্টার ক্যাটালগ প্রোডাক্ট লোড করতে ব্যর্থ হয়েছে।');
//             console.error(err);
//         }
//         setLoading(false);
//     }, [filters]);
//
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             fetchProducts(1);
//         }, 600);
//         return () => clearTimeout(timer);
//     }, [filters, fetchProducts]);
//
//     // সিলেক্ট / ডিসিলেক্ট
//     const toggleSelect = (id) => {
//         if (isImporting) return;
//         setSelectedIds(prev => {
//             const next = new Set(prev);
//             if (next.has(id)) next.delete(id);
//             else next.add(id);
//             return next;
//         });
//     };
//
//     const selectAllNew = () => {
//         if (isImporting) return;
//         const newIds = products.filter(p => !p.is_in_inventory).map(p => p.id);
//         setSelectedIds(new Set(newIds));
//     };
//
//     const clearSelection = () => {
//         if (isImporting) return;
//         setSelectedIds(new Set());
//     };
//
//     // Bulk Import
//     const startImport = async () => {
//         if (selectedIds.size === 0) return;
//         setIsImporting(true);
//         setProgress({
//             state: 'PROGRESS',
//             current: 0,
//             total: selectedIds.size,
//             status: 'টাস্ক কিউতে পাঠানো হচ্ছে...'
//         });
//         try {
//             const res = await api.post('/api/start-bulk-import/', {
//                 master_ids: Array.from(selectedIds),
//             });
//             startPolling(res.data.task_id);
//         } catch (err) {
//             alert('ইমপোর্ট প্রসেস রান করতে ব্যর্থ হয়েছে।');
//             setIsImporting(false);
//             setProgress(null);
//         }
//     };
//
//     // প্রোগ্রেস পোলিং
//     const startPolling = (taskId) => {
//         if (pollingInterval.current) {
//             clearInterval(pollingInterval.current);
//             pollingInterval.current = null;
//         }
//         pollingInterval.current = setInterval(async () => {
//             try {
//                 const res = await api.get(`/api/import-progress/${taskId}/`);
//                 const data = res.data;
//                 setProgress(data);
//                 if (data.state === 'SUCCESS' || data.state === 'FAILURE' || data.state === 'REVOKED') {
//                     if (pollingInterval.current) {
//                         clearInterval(pollingInterval.current);
//                         pollingInterval.current = null;
//                     }
//                     setIsImporting(false);
//                     if (data.state === 'SUCCESS') {
//                         alert(`✅ ইমপোর্ট সম্পন্ন!\nনতুন: ${data.imported} টি\nস্কিপ: ${data.skipped} টি`);
//                         fetchProducts(1);
//                         setSelectedIds(new Set());
//                     } else {
//                         alert('❌ টাস্ক এক্সিকিউট করতে সমস্যা হয়েছে।');
//                     }
//                     setProgress(null);
//                 }
//             } catch (err) {
//                 if (pollingInterval.current) {
//                     clearInterval(pollingInterval.current);
//                     pollingInterval.current = null;
//                 }
//                 setIsImporting(false);
//                 setProgress(null);
//                 console.error('Polling error:', err);
//             }
//         }, 1200);
//     };
//
//     useEffect(() => {
//         return () => {
//             if (pollingInterval.current) {
//                 clearInterval(pollingInterval.current);
//                 pollingInterval.current = null;
//             }
//         };
//     }, []);
//
//     // ---------- UI রেন্ডার (প্যাডিং/মার্জিন মুক্ত + রেসপনসিভ) ----------
//     return (
//         // 🔥 পরিবর্তন ১: container, max-w, px-4 সরিয়ে w-full + ছোট প্যাডিং
//         <div className="w-full px-0 sm:px-2 py-4">
//             {/* হেডার */}
//             <div className="flex justify-between items-center mb-4 px-2">
//                 <h1 className="text-xl md:text-2xl font-bold text-gray-800">📦 মাস্টার প্রোডাক্ট ক্যাটালগ</h1>
//                 <span className="text-sm text-gray-500">
//                     সিলেক্টেড: <span className="font-semibold text-blue-600">{selectedIds.size}</span> টি
//                 </span>
//             </div>
//
//             {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 mx-2">
//                     {error}
//                 </div>
//             )}
//
//             {/* ===== ফিল্টার বার (রেসপনসিভ গ্রিড) ===== */}
//             <div className="bg-white p-3 rounded-lg shadow mb-4 border border-gray-200 mx-2">
//                 {/* 🔥 পরিবর্তন ২: মোবাইলে 1, md-তে 2, lg-তে 3 কলাম */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                     <input
//                         type="text"
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
//                         placeholder="🔍 নাম দিয়ে খুঁজুন..."
//                         value={filters.search}
//                         onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
//                         disabled={isImporting}
//                     />
//                     <SearchableDropdown
//                         options={filterOptions.categories}
//                         value={filters.category}
//                         onChange={(val) => setFilters(prev => ({...prev, category: val}))}
//                         placeholder="ক্যাটাগরি"
//                         disabled={isImporting}
//                     />
//                     <SearchableDropdown
//                         options={filterOptions.sub_categories}
//                         value={filters.sub_category}
//                         onChange={(val) => setFilters(prev => ({...prev, sub_category: val}))}
//                         placeholder="সাব-ক্যাটাগরি"
//                         disabled={isImporting}
//                     />
//                     <SearchableDropdown
//                         options={filterOptions.brands}
//                         value={filters.brand}
//                         onChange={(val) => setFilters(prev => ({...prev, brand: val}))}
//                         placeholder="ব্র্যান্ড"
//                         disabled={isImporting}
//                     />
//                     <SearchableDropdown
//                         options={filterOptions.specifications}
//                         value={filters.specification}
//                         onChange={(val) => setFilters(prev => ({...prev, specification: val}))}
//                         placeholder="জেনেরিক নাম"
//                         disabled={isImporting}
//                     />
//                     <SearchableDropdown
//                         options={filterOptions.dosage_forms}
//                         value={filters.dosage_form}
//                         onChange={(val) => setFilters(prev => ({...prev, dosage_form: val}))}
//                         placeholder="ডোজ ফর্ম"
//                         disabled={isImporting}
//                     />
//                 </div>
//
//                 {/* অ্যাকশন বাটন */}
//                 <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
//                     <button
//                         onClick={selectAllNew}
//                         disabled={isImporting || products.length === 0}
//                         className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-1.5 px-3 rounded-md transition disabled:opacity-50 text-sm"
//                     >
//                         ⭐ সব নতুন সিলেক্ট
//                     </button>
//                     <button
//                         onClick={clearSelection}
//                         disabled={isImporting || selectedIds.size === 0}
//                         className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-3 rounded-md transition disabled:opacity-50 text-sm"
//                     >
//                         ✖️ ক্লিয়ার
//                     </button>
//                     <button
//                         onClick={startImport}
//                         disabled={selectedIds.size === 0 || isImporting}
//                         className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md transition flex items-center gap-2 disabled:opacity-50 text-sm"
//                     >
//                         {isImporting ? '⏳ প্রক্রিয়াকরণ...' : `⬇️ ইমপোর্ট (${selectedIds.size})`}
//                     </button>
//                 </div>
//             </div>
//
//             {/* প্রোগ্রেস বার */}
//             {progress && progress.state === 'PROGRESS' && (
//                 <div className="bg-white p-3 rounded-lg shadow mb-4 border border-blue-200 mx-2">
//                     <div className="flex flex-wrap justify-between text-sm text-gray-600 mb-1">
//                         <span>⏳ {progress.status}</span>
//                         <span>
//                             {progress.current} / {progress.total}
//                             {progress.imported !== undefined && <span className="ml-3 text-green-600">✅ {progress.imported} যোগ</span>}
//                             {progress.skipped !== undefined && <span className="ml-2 text-yellow-600">⏩ {progress.skipped} স্কিপ</span>}
//                         </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//                         <div
//                             className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                             style={{width: `${(progress.current / progress.total) * 100}%`}}
//                         ></div>
//                     </div>
//                 </div>
//             )}
//
//             {/* ===== প্রোডাক্ট টেবিল (Overflow-x + রেসপনসিভ কলাম) ===== */}
//             {loading ? (
//                 <div className="text-center py-20 text-gray-500 font-medium">⏳ ক্যাটালগ ডাটা সিঙ্ক হচ্ছে...</div>
//             ) : (
//                 <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mx-2">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="w-10 px-2 py-2"></th>
//                                     {/* 🔥 পরিবর্তন ৩: মোবাইলে লুকানোর জন্য hidden-md-down */}
//                                     <th className="hidden sm:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ছবি</th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">নাম</th>
//                                     <th className="hidden md:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ব্র্যান্ড</th>
//                                     <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">সাব-ক্যাট</th>
//                                     <th className="hidden xl:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">জেনেরিক</th>
//                                     <th className="hidden sm:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">সাইজ</th>
//                                     <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ডোজ</th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">দাম</th>
//                                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {products.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="10" className="px-4 py-10 text-center text-gray-400">😕 কোনো প্রোডাক্ট পাওয়া যায়নি</td>
//                                     </tr>
//                                 ) : (
//                                     products.map((product) => {
//                                         const isAdded = product.is_in_inventory;
//                                         const hasImageError = brokenImages.has(product.id);
//                                         const imageUrl = (product.image && !hasImageError) ? product.image : '/static/images/no-image.png';
//
//                                         return (
//                                             <tr key={product.id} className="hover:bg-gray-50 transition text-sm">
//                                                 <td className="px-2 py-2">
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={selectedIds.has(product.id)}
//                                                         onChange={() => toggleSelect(product.id)}
//                                                         disabled={isAdded || isImporting}
//                                                         className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-40"
//                                                     />
//                                                 </td>
//                                                 <td className="hidden sm:table-cell px-3 py-2">
//                                                     <img
//                                                         src={imageUrl}
//                                                         alt={product.name}
//                                                         className="w-10 h-10 object-cover rounded-md border border-gray-200 bg-gray-50"
//                                                         onError={() => setBrokenImages(prev => new Set(prev).add(product.id))}
//                                                     />
//                                                 </td>
//                                                 <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap max-w-[120px] truncate">{product.name}</td>
//                                                 <td className="hidden md:table-cell px-3 py-2 text-gray-600">{product.brand_name || '-'}</td>
//                                                 <td className="hidden lg:table-cell px-3 py-2 text-gray-600">{product.sub_category_name || '-'}</td>
//                                                 <td className="hidden xl:table-cell px-3 py-2 text-gray-600 max-w-[100px] truncate">{product.specification_name || '-'}</td>
//                                                 <td className="hidden sm:table-cell px-3 py-2 text-gray-600">{product.size_name+ product.unit_name || '-'}</td>
//                                                 <td className="hidden lg:table-cell px-3 py-2 text-gray-600">{product.dosage_form_name || '-'}</td>
//                                                 <td className="px-3 py-2 text-gray-900 font-medium whitespace-nowrap">৳{Number(product.selling_price)?.toFixed(2) || '0.00'}</td>
//                                                 <td className="px-3 py-2">
//                                                     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                                                         isAdded ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
//                                                     }`}>
//                                                         {isAdded ? '✅ আছে' : '🆕 যোগ'}
//                                                     </span>
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//
//                     {/* পেজিনেশন */}
//                     {totalPages > 1 && (
//                         <div className="flex justify-center items-center gap-3 p-3 border-t border-gray-200">
//                             <button
//                                 onClick={() => fetchProducts(page - 1)}
//                                 disabled={page <= 1 || loading || isImporting}
//                                 className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 transition text-sm"
//                             >
//                                 ← আগের
//                             </button>
//                             <span className="text-sm font-medium text-gray-600">পেজ {page} / {totalPages}</span>
//                             <button
//                                 onClick={() => fetchProducts(page + 1)}
//                                 disabled={page >= totalPages || loading || isImporting}
//                                 className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 transition text-sm"
//                             >
//                                 পরের →
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default MasterCatalog;


//////////////////////////////////////////////////////////////////////////////

/**
 * মাস্টার প্রোডাক্ট ক্যাটালগ (React Component)
 * ==============================================
 * - ডায়নামিক ফিল্টার (Category, SubCategory, Brand, Specification, DosageForm)
 * - প্রতিটি ড্রপডাউন সার্চেবল
 * - পেজিনেশন, Bulk Import
 * - Synchronous ও Celery (Async)—দুই মোড সাপোর্ট করে
 * - useCelery ফ্ল্যাগ দিয়ে মোড পরিবর্তন (ডিফল্ট: synchronous)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from "../../context_or_provider/pos/posApi";
import MasterProductList_url from  "../../posConfig"

// ========== সার্চেবল ড্রপডাউন ==========
const SearchableDropdown = ({ options, value, onChange, placeholder, disabled }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    ▼
                </button>
            </div>

            {isOpen && !disabled && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-auto shadow-lg">
                    <li
                        className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${!value ? 'bg-blue-100 font-semibold' : ''}`}
                        onClick={() => {
                            onChange('');
                            setSearchTerm('');
                            setIsOpen(false);
                        }}
                    >
                        সব
                    </li>
                    {filteredOptions.length === 0 ? (
                        <li className="px-3 py-2 text-gray-400">কোনো অপশন নেই</li>
                    ) : (
                        filteredOptions.map((opt) => (
                            <li
                                key={opt}
                                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${value === opt ? 'bg-blue-100 font-semibold' : ''}`}
                                onClick={() => {
                                    onChange(opt);
                                    setSearchTerm(opt);
                                    setIsOpen(false);
                                }}
                            >
                                {opt}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

// ========== মূল কম্পোনেন্ট ==========
const MasterCatalog = () => {
    // ---------- স্টেট ----------
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        sub_category: '',
        brand: '',
        specification: '',
        dosage_form: '',
    });
    const [filterOptions, setFilterOptions] = useState({
        categories: [],
        sub_categories: [],
        brands: [],
        specifications: [],
        dosage_forms: [],
    });

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [brokenImages, setBrokenImages] = useState(new Set());

    // 🚀 মোড সিলেক্টর—এটাই মূল ফ্ল্যাগ (true = Celery, false = Synchronous)
    const [useCelery, setUseCelery] = useState(false);   // ডিফল্ট Synchronous

    // Celery-র জন্য প্রোগ্রেস ও পোলিং
    const [progress, setProgress] = useState(null);
    const pollingInterval = useRef(null);

    // ---------- ফিল্টার অপশন লোড ----------
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const res = await api.get('/api/filter-options/');
                setFilterOptions({
                    categories: res.data.categories || [],
                    sub_categories: res.data.sub_categories || [],
                    brands: res.data.brands || [],
                    specifications: res.data.specifications || [],
                    dosage_forms: res.data.dosage_forms || [],
                });
            } catch (err) {
                console.error('ফিল্টার অপশন লোড করতে ব্যর্থ:', err);
            }
        };
        fetchFilterOptions();
    }, []);

    // ---------- প্রোডাক্ট লোড ----------
    const fetchProducts = useCallback(async (pageNum) => {
        console.log('Current filters:', filters);
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/api/master-products/', {
                params: { ...filters, page: pageNum, page_size: 20 }
            });
            setProducts(res.data.results || []);
            setTotalPages(res.data.total_pages || 1);
            setPage(pageNum);
        } catch (err) {
            setError('মাস্টার ক্যাটালগ প্রোডাক্ট লোড করতে ব্যর্থ হয়েছে।');
            console.error(err);
        }
        setLoading(false);
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(1);
        }, 600);
        return () => clearTimeout(timer);
    }, [filters, fetchProducts]);

    // ---------- সিলেক্ট / ডিসিলেক্ট ----------
    const toggleSelect = (id) => {
        if (isImporting) return;
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAllNew = () => {
        if (isImporting) return;
        const newIds = products.filter(p => !p.is_in_inventory).map(p => p.id);
        setSelectedIds(new Set(newIds));
    };

    const clearSelection = () => {
        if (isImporting) return;
        setSelectedIds(new Set());
    };

    // ============================================================
    // 🔥 পোলিং ফাংশন (শুধু Celery-র জন্য)
    // ============================================================
    const startPolling = (taskId) => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
        }
        pollingInterval.current = setInterval(async () => {
            try {
                const res = await api.get(`/api/import-progress/${taskId}/`);
                const data = res.data;
                setProgress(data);
                if (data.state === 'SUCCESS' || data.state === 'FAILURE' || data.state === 'REVOKED') {
                    if (pollingInterval.current) {
                        clearInterval(pollingInterval.current);
                        pollingInterval.current = null;
                    }
                    setIsImporting(false);
                    if (data.state === 'SUCCESS') {
                        alert(`✅ ইমপোর্ট সম্পন্ন!\nনতুন: ${data.imported} টি\nস্কিপ: ${data.skipped} টি`);
                        fetchProducts(1);
                        setSelectedIds(new Set());
                    } else {
                        alert('❌ টাস্ক এক্সিকিউট করতে সমস্যা হয়েছে।');
                    }
                    setProgress(null);
                }
            } catch (err) {
                if (pollingInterval.current) {
                    clearInterval(pollingInterval.current);
                    pollingInterval.current = null;
                }
                setIsImporting(false);
                setProgress(null);
                console.error('Polling error:', err);
            }
        }, 1200);
    };

    // ============================================================
    // 🚀 ইমপোর্ট ফাংশন (useCelery-র উপর ভিত্তি করে)
    // ============================================================
    const startImport = async () => {
        if (selectedIds.size === 0) return;

        setIsImporting(true);
        setLoading(true);

        if (useCelery) {
            // ---------- Celery মোড ----------
            setProgress({
                state: 'PROGRESS',
                current: 0,
                total: selectedIds.size,
                status: 'টাস্ক কিউতে পাঠানো হচ্ছে...'
            });
            try {
                const res = await api.post('/api/start-bulk-import/', {
                    master_ids: Array.from(selectedIds),
                });
                startPolling(res.data.task_id);
            } catch (err) {
                alert('ইমপোর্ট প্রসেস রান করতে ব্যর্থ হয়েছে।');
                setIsImporting(false);
                setProgress(null);
                setLoading(false);
            }
        } else {
            // ---------- Synchronous মোড ----------
            try {
                const res = await api.post('/api/start-bulk-import/', {
                    master_ids: Array.from(selectedIds),
                });
                const data = res.data;
                if (data.status === 'completed') {
                    alert(`✅ ইমপোর্ট সম্পন্ন!\nনতুন: ${data.imported} টি\nস্কিপ: ${data.skipped} টি`);
                    fetchProducts(1);
                    setSelectedIds(new Set());
                } else {
                    alert('❌ ইমপোর্ট ব্যর্থ হয়েছে: ' + (data.error || 'অজানা ত্রুটি'));
                }
            } catch (err) {
                alert('ইমপোর্ট প্রসেস রান করতে ব্যর্থ হয়েছে।');
                console.error(err);
            } finally {
                setIsImporting(false);
                setLoading(false);
            }
        }
    };

    // ---------- ক্লিনআপ ----------
    useEffect(() => {
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
                pollingInterval.current = null;
            }
        };
    }, []);

    // ============================================================
    // UI রেন্ডার
    // ============================================================
    return (
        <div className="w-full px-0 sm:px-2 py-4">
            {/* হেডার + মোড টগল */}
            <div className="flex justify-between items-center mb-4 px-2 flex-wrap gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">📦 মাস্টার প্রোডাক্ট ক্যাটালগ</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        সিলেক্টেড: <span className="font-semibold text-blue-600">{selectedIds.size}</span> টি
                    </span>
                    {/* মোড টগল বাটন */}
                    <button
                        onClick={() => setUseCelery(!useCelery)}
                        className={`px-3 py-1 text-sm rounded-md transition ${
                            useCelery
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                    >
                        {useCelery ? '☁️ Celery' : '⚡ Synchronous'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 mx-2">
                    {error}
                </div>
            )}

            {/* ===== ফিল্টার বার ===== */}
            <div className="bg-white p-3 rounded-lg shadow mb-4 border border-gray-200 mx-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="🔍 নাম দিয়ে খুঁজুন..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        disabled={isImporting}
                    />
                    <SearchableDropdown
                        options={filterOptions.categories}
                        value={filters.category}
                        onChange={(val) => setFilters(prev => ({ ...prev, category: val }))}
                        placeholder="ক্যাটাগরি"
                        disabled={isImporting}
                    />
                    <SearchableDropdown
                        options={filterOptions.sub_categories}
                        value={filters.sub_category}
                        onChange={(val) => setFilters(prev => ({ ...prev, sub_category: val }))}
                        placeholder="সাব-ক্যাটাগরি"
                        disabled={isImporting}
                    />
                    <SearchableDropdown
                        options={filterOptions.brands}
                        value={filters.brand}
                        onChange={(val) => setFilters(prev => ({ ...prev, brand: val }))}
                        placeholder="ব্র্যান্ড"
                        disabled={isImporting}
                    />
                    <SearchableDropdown
                        options={filterOptions.specifications}
                        value={filters.specification}
                        onChange={(val) => setFilters(prev => ({ ...prev, specification: val }))}
                        placeholder="জেনেরিক নাম"
                        disabled={isImporting}
                    />
                    <SearchableDropdown
                        options={filterOptions.dosage_forms}
                        value={filters.dosage_form}
                        onChange={(val) => setFilters(prev => ({ ...prev, dosage_form: val }))}
                        placeholder="ডোজ ফর্ম"
                        disabled={isImporting}
                    />
                </div>

                {/* অ্যাকশন বাটন */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                    <button
                        onClick={selectAllNew}
                        disabled={isImporting || products.length === 0}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-1.5 px-3 rounded-md transition disabled:opacity-50 text-sm"
                    >
                        ⭐ সব নতুন সিলেক্ট
                    </button>
                    <button
                        onClick={clearSelection}
                        disabled={isImporting || selectedIds.size === 0}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-3 rounded-md transition disabled:opacity-50 text-sm"
                    >
                        ✖️ ক্লিয়ার
                    </button>
                    <button
                        onClick={startImport}
                        disabled={selectedIds.size === 0 || isImporting}
                        className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md transition flex items-center gap-2 disabled:opacity-50 text-sm"
                    >
                        {isImporting ? '⏳ প্রক্রিয়াকরণ...' : `⬇️ ইমপোর্ট (${selectedIds.size})`}
                    </button>
                </div>
            </div>

            {/* ===== প্রোগ্রেস বার (শুধুমাত্র Celery মোডে) ===== */}
            {useCelery && progress && progress.state === 'PROGRESS' && (
                <div className="bg-white p-3 rounded-lg shadow mb-4 border border-blue-200 mx-2">
                    <div className="flex flex-wrap justify-between text-sm text-gray-600 mb-1">
                        <span>⏳ {progress.status}</span>
                        <span>
                            {progress.current} / {progress.total}
                            {progress.imported !== undefined && <span className="ml-3 text-green-600">✅ {progress.imported} যোগ</span>}
                            {progress.skipped !== undefined && <span className="ml-2 text-yellow-600">⏩ {progress.skipped} স্কিপ</span>}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* ===== প্রোডাক্ট টেবিল ===== */}
            {loading ? (
                <div className="text-center py-20 text-gray-500 font-medium">⏳ ক্যাটালগ ডাটা সিঙ্ক হচ্ছে...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mx-2">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-10 px-2 py-2"></th>
                                    <th className="hidden sm:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ছবি</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">নাম</th>
                                    <th className="hidden md:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ব্র্যান্ড</th>
                                    <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">সাব-ক্যাট</th>
                                    <th className="hidden xl:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">জেনেরিক</th>
                                    <th className="hidden sm:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">সাইজ</th>
                                    <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ডোজ</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">দাম</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="px-4 py-10 text-center text-gray-400">😕 কোনো প্রোডাক্ট পাওয়া যায়নি</td>
                                    </tr>
                                ) : (
                                    products.map((product) => {
                                        const isAdded = product.is_in_inventory;
                                        const hasImageError = brokenImages.has(product.id);
                                        const imageUrl = (product.image && !hasImageError) ? product.image : '/static/images/no-image.png';

                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50 transition text-sm">
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(product.id)}
                                                        onChange={() => toggleSelect(product.id)}
                                                        disabled={isAdded || isImporting}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-40"
                                                    />
                                                </td>
                                                <td className="hidden sm:table-cell px-3 py-2">
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-cover rounded-md border border-gray-200 bg-gray-50"
                                                        onError={() => setBrokenImages(prev => new Set(prev).add(product.id))}
                                                    />
                                                </td>
                                                <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap max-w-[120px] truncate">{product.name}</td>
                                                <td className="hidden md:table-cell px-3 py-2 text-gray-600">{product.brand_name || '-'}</td>
                                                <td className="hidden lg:table-cell px-3 py-2 text-gray-600">{product.sub_category_name || '-'}</td>
                                                <td className="hidden xl:table-cell px-3 py-2 text-gray-600 max-w-[100px] truncate">{product.specification_name || '-'}</td>
                                                <td className="hidden sm:table-cell px-3 py-2 text-gray-600">{product.size_name + product.unit_name || '-'}</td>
                                                <td className="hidden lg:table-cell px-3 py-2 text-gray-600">{product.dosage_form_name || '-'}</td>
                                                <td className="px-3 py-2 text-gray-900 font-medium whitespace-nowrap">৳{Number(product.selling_price)?.toFixed(2) || '0.00'}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        isAdded ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {isAdded ? '✅ আছে' : '🆕 যোগ'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* পেজিনেশন */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 p-3 border-t border-gray-200">
                            <button
                                onClick={() => fetchProducts(page - 1)}
                                disabled={page <= 1 || loading || isImporting}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 transition text-sm"
                            >
                                ← আগের
                            </button>
                            <span className="text-sm font-medium text-gray-600">পেজ {page} / {totalPages}</span>
                            <button
                                onClick={() => fetchProducts(page + 1)}
                                disabled={page >= totalPages || loading || isImporting}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 transition text-sm"
                            >
                                পরের →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MasterCatalog;