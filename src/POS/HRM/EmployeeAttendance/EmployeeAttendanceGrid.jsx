// // import React, {useState, useEffect, useMemo, useCallback} from 'react';
// // import EmployeeAttendanceHeader from "./EmployeeAttendanceHeader";
// // import EmployeeStats from "./EmployeeStats";
// // import EmployeeAttendanceSearchFilter from "./EmployeeAttendanceSearchFilter";
// // import EmployeeAttendanceCard from "./EmployeeAttendanceCard";
// // import EmployeeAttendanceList from "./EmployeeAttendanceList";
// // import AddEmployeeAttendanceModal from "./AddEmployeeAttendanceModal";
// // import SuccessModal from "./SuccessModal";
// // import LoadingSpinner from "./LoadingSpinner";
// // import {employeeAttendanceAPI} from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
// // import {useEmployeeAttendance} from "../../../context_or_provider/pos/EmployeeAttendance/employee_attendance_provider";
// //
// // const EmployeeAttendanceGrid = () => {
// //     const {employeeAttendance, setEmployeeAttendance} = useEmployeeAttendance();
// //     // const { userWith_profile, setUserWith_profile } = useUserWithProfile();
// //     const [viewType, setViewType] = useState("grid");
// //     const [isAddOpen, setIsAddOpen] = useState(false);
// //     const [successData, setSuccessData] = useState(null);
// //     const [successType, setSuccessType] = useState('create');
// //     const [loading, setLoading] = useState(true);
// //     const [stats, setStats] = useState({
// //         total: 0,
// //         active: 0,
// //         inactive: 0,
// //         newJoiners: 0
// //     });
// //
// //     // Search and filter states
// //     const [searchQuery, setSearchQuery] = useState("");
// //     const [filters, setFilters] = useState({
// //         designation: "all",
// //         status: "all",
// //         dateRange: "all",
// //         sortBy: "name_asc",
// //         salaryRange: null,
// //         customDateRange: null
// //     });
// //
// //     // Fetch employees on component mount
// //     useEffect(() => {
// //         fetchEmployeeAttendance();
// //     }, []);
// //
// //
// //     const fetchEmployeeAttendance = async (showLoading = true) => {
// //         if (showLoading) setLoading(true);
// //         try {
// //             const response = await employeeAttendanceAPI.getAll();
// //             setEmployeeAttendance(response.data.results);
// //             calculateStats(response.data.results);
// //         } catch (error) {
// //             console.error("Error fetching employees:", error);
// //         } finally {
// //             if (showLoading) setLoading(false);
// //         }
// //     };
// //
// //
// //     // স্ট্যাটস ক্যালকুলেশন পরিবর্তন
// //     const calculateStats = (data) => {
// //         const total = data.length;
// //         const present = data.filter(d => d.is_present).length;
// //         const absent = data.filter(d => !d.is_present).length;
// //         const totalWorkHours = data.reduce((sum, d) => sum + d.daily_work_time, 0);
// //
// //         setStats({total, present, absent, totalWorkHours});
// //     };
// //     // ✅ useCallback দিয়ে functions wrap করুন
// //     const handleSearch = useCallback((query) => {
// //         setSearchQuery(query);
// //     }, []);
// //
// //     const handleFilter = useCallback((newFilters) => {
// //         console.log("Filter updated:", newFilters);
// //         setFilters(prev => ({
// //             ...prev,
// //             ...newFilters
// //         }));
// //     }, []);
// //
// //
// //     // ফিল্টারিং লজিক পরিবর্তন
// //     const filteredAttendance = useMemo(() => {
// //         let result = [...employeeAttendance];
// //
// //         if (searchQuery.trim()) {
// //             const query = searchQuery.toLowerCase();
// //             result = result.filter(item =>
// //                 item.name?.toLowerCase().includes(query) ||
// //                 item.user_designation?.toLowerCase().includes(query)
// //             );
// //         }
// //
// //         // Date filter
// //         if (filters.dateRange !== "all") {
// //             const today = new Date();
// //             result = result.filter(item => {
// //                 const date = new Date(item.date);
// //                 if (filters.dateRange === "today") {
// //                     return date.toDateString() === today.toDateString();
// //                 }
// //                 // ... other date filters
// //             });
// //         }
// //
// //         return result;
// //     }, [employeeAttendance, searchQuery, filters]);
// //
// //     const handleEmployeeAdded = (newEmp) => {
// //         setEmployeeAttendance(prev => [...prev, newEmp]);
// //         setIsAddOpen(false);
// //         setSuccessType('create');
// //         setSuccessData(newEmp);
// //         fetchEmployeeAttendance();
// //     };
// //
// //     const handleEmployeeUpdated = useCallback((updatedData) => {
// //         fetchEmployeeAttendance(false);
// //         if (updatedData) {
// //             setSuccessType('update');
// //             setSuccessData(updatedData);
// //         }
// //     }, []);
// //
// //
// //     // const displayStats = [
// //     //     {
// //     //         title: 'Total Advances',
// //     //         count: stats.total,
// //     //         // count: stats.total.toString(),
// //     //         bgColor: 'bg-purple-600',
// //     //         textColor: 'text-white',
// //     //         icon: '💰'
// //     //     },
// //     //     {
// //     //         title: 'Approved',
// //     //         // count: stats.approved.toString(),
// //     //         count: stats.approved,
// //     //         bgColor: 'bg-green-500',
// //     //         textColor: 'text-white',
// //     //         icon: '✅'
// //     //     },
// //     //     {
// //     //         title: 'Pending',
// //     //         count: stats.pending,
// //     //         // count: stats.pending.toString(),
// //     //         bgColor: 'bg-yellow-500',
// //     //         textColor: 'text-white',
// //     //         icon: '⏳'
// //     //     },
// //     //     {
// //     //         title: 'Total Amount',
// //     //         count: `৳ ${stats.totalAmount || 0}`,
// //     //         bgColor: 'bg-blue-500',
// //     //         textColor: 'text-white',
// //     //         icon: '💵'
// //     //     }
// //     // ];
// //
// //     const displayStats = [
// //     { title: 'Total Records', count: stats.total, bgColor: 'bg-purple-600', icon: '📊' },
// //     { title: 'Present', count: stats.present, bgColor: 'bg-green-500', icon: '✅' },
// //     { title: 'Absent', count: stats.absent, bgColor: 'bg-red-500', icon: '❌' },
// //     { title: 'Total Hours', count: `${stats.totalWorkHours}h`, bgColor: 'bg-blue-500', icon: '⏱️' }
// // ];
// //
// //     if (loading) {
// //         return (
// //             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //                 <div className="text-center">
// //                     <LoadingSpinner size="lg"/>
// //                     <p className="mt-4 text-gray-600">Loading employees...</p>
// //                 </div>
// //             </div>
// //         );
// //     }
// //
// //     return (
// //         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
// //             {/* Header */}
// //             <EmployeeAttendanceHeader
// //                 viewType={viewType}
// //                 setViewType={setViewType}
// //                 onAddClick={() => setIsAddOpen(true)}
// //             />
// //
// //             {/* Stats */}
// //             <div className="mb-6">
// //                 <EmployeeStats stats={displayStats}/>
// //             </div>
// //
// //             {/* Search and Filter */}
// //             <div className="mb-6">
// //                 <EmployeeAttendanceSearchFilter
// //                     onSearch={handleSearch}
// //                     onFilter={handleFilter}
// //                 />
// //             </div>
// //
// //             {/* Main Content - Grid or List View */}
// //             <div className="bg-white rounded-xl shadow-sm p-4">
// //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
// //                     <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
// //                         {viewType === "grid" ? "Employee Grid" : "Employee List"}
// //                     </h2>
// //                     <div className="text-sm text-gray-500">
// //                         Showing {filteredAttendance.length} of {employeeAttendance?.length || 0} employees
// //                     </div>
// //                 </div>
// //
// //                 {viewType === "grid" ? (
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
// //                         {filteredAttendance.map(emp => (
// //
// //
// //                             <EmployeeAttendanceCard
// //                                 key={emp.id}
// //                                 // advance={emp}   // ✅ ONLY THIS
// //                                 attendance={emp}   // ✅ ONLY THIS
// //                                 onEdit={handleEmployeeUpdated}
// //                                 onDelete={handleEmployeeUpdated}
// //                             />
// //                         ))}
// //                     </div>
// //                 ) : (
// //                     <EmployeeAttendanceList
// //                         attendance={filteredAttendance}
// //                         onEdit={handleEmployeeUpdated}
// //                     />
// //                 )}
// //
// //                 {/* Empty State */}
// //                 {filteredAttendance.length === 0 && (
// //                     <div className="text-center py-12">
// //                         <div className="text-gray-400 mb-4">
// //                             <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
// //                                       d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.268A10.02 10.02 0 0122 12c0 3.22-1.64 6.065-4.14 7.8M3.86 19.8A10.02 10.02 0 012 12c0-3.22 1.64-6.065 4.14-7.8"/>
// //                             </svg>
// //                         </div>
// //                         <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
// //                         <p className="text-gray-600 mb-4">
// //                             {searchQuery || Object.values(filters).some(f => f !== "all" && f !== null)
// //                                 ? "Try changing your search or filter criteria"
// //                                 : "Add your first employee to get started"
// //                             }
// //                         </p>
// //                         <div className="flex flex-col sm:flex-row gap-3 justify-center">
// //                             {(searchQuery || Object.values(filters).some(f => f !== "all" && f !== null)) && (
// //                                 <button
// //                                     onClick={() => {
// //                                         setSearchQuery("");
// //                                         setFilters({
// //                                             designation: "all",
// //                                             status: "all",
// //                                             dateRange: "all",
// //                                             sortBy: "name_asc",
// //                                             salaryRange: null,
// //                                             customDateRange: null
// //                                         });
// //                                     }}
// //                                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
// //                                 >
// //                                     Clear Filters
// //                                 </button>
// //                             )}
// //                             <button
// //                                 onClick={() => setIsAddOpen(true)}
// //                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //                             >
// //                                 Add Salary Advanc
// //                             </button>
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //
// //             {/* Add Employee Modal */}
// //             <AddEmployeeAttendanceModal
// //                 isOpen={isAddOpen}
// //                 onClose={() => setIsAddOpen(false)}
// //                 onSuccess={handleEmployeeAdded}
// //             />
// //
// //             {/* Success Modal */}
// //             <SuccessModal
// //                 isOpen={!!successData}
// //                 employee={successData}
// //                 type={successType}
// //                 onClose={() => setSuccessData(null)}
// //             />
// //         </div>
// //     );
// // };
// //
// // export default EmployeeAttendanceGrid;
//
//
//
//
// // EmployeeAttendanceGrid.jsx - পেজিনেশন সহ আপডেটেড ভার্সন
//
// // EmployeeAttendanceGrid.jsx - সম্পূর্ণ সংশোধিত
//
// import React, {useState, useEffect, useMemo, useCallback} from 'react';
// import EmployeeAttendanceHeader from "./EmployeeAttendanceHeader";
// import EmployeeStats from "./EmployeeStats";
// import EmployeeAttendanceSearchFilter from "./EmployeeAttendanceSearchFilter";
// import EmployeeAttendanceCard from "./EmployeeAttendanceCard";
// import EmployeeAttendanceList from "./EmployeeAttendanceList";
// import AddEmployeeAttendanceModal from "./AddEmployeeAttendanceModal";
// import SuccessModal from "./SuccessModal";
// import LoadingSpinner from "./LoadingSpinner";
// import {employeeAttendanceAPI} from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
// import {useEmployeeAttendance} from "../../../context_or_provider/pos/EmployeeAttendance/employee_attendance_provider";
//
// const EmployeeAttendanceGrid = () => {
//     const { employeeAttendance, setEmployeeAttendance} = useEmployeeAttendance();
//     const [viewType, setViewType] = useState("grid");
//     const [isAddOpen, setIsAddOpen] = useState(false);
//     const [successData, setSuccessData] = useState(null);
//     const [successType, setSuccessType] = useState('create');
//     const [loading, setLoading] = useState(true);
//
//     // ✅ Pagination states
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalItems, setTotalItems] = useState(0);
//     const [nextPageUrl, setNextPageUrl] = useState(null);
//     const [prevPageUrl, setPrevPageUrl] = useState(null);
//
//     // Search and filter states
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filters, setFilters] = useState({
//         designation: "all",
//         status: "all",
//         dateRange: "all",
//         sortBy: "name_asc",
//     });
//
//     const [stats, setStats] = useState({
//         total: 0,
//         present: 0,
//         absent: 0,
//         totalWorkHours: 0
//     });
//
//     // ✅ Fetch attendance when page changes
//     useEffect(() => {
//         fetchAttendance();
//     }, [currentPage]); // currentPage পরিবর্তন হলে কল হবে
//
//     const fetchAttendance = async () => {
//         setLoading(true);
//         try {
//             console.log("Fetching page:", currentPage); // Debug log
//             const response = await employeeAttendanceAPI.getAll(currentPage);
//             console.log("API Response:", response.data);
//
//             // Extract data from paginated response
//             const attendanceData = response.data.results || response.data;
//             setEmployeeAttendance(attendanceData);
//
//             // Set pagination info
//             setTotalItems(response.data.count || 0);
//             const pages = Math.ceil((response.data.count || 0) / 10);
//             setTotalPages(pages);
//             setNextPageUrl(response.data.next);
//             setPrevPageUrl(response.data.previous);
//
//             calculateStats(attendanceData);
//         } catch (error) {
//             console.error("Error fetching attendance:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const calculateStats = (data) => {
//         const total = data?.length || 0;
//         const present = data?.filter(d => d.is_present).length || 0;
//         const absent = data?.filter(d => !d.is_present).length || 0;
//         const totalWorkHours = data?.reduce((sum, d) => sum + (d.daily_work_time || 0), 0) || 0;
//
//         setStats({ total, present, absent, totalWorkHours });
//     };
//
//     // ✅ Pagination handlers - এগুলো সঠিকভাবে কাজ করবে
//     const goToNextPage = () => {
//         if (nextPageUrl) {
//             console.log("Going to next page, current:", currentPage);
//             setCurrentPage(prev => prev + 1);
//         }
//     };
//
//     const goToPrevPage = () => {
//         if (prevPageUrl) {
//             console.log("Going to previous page, current:", currentPage);
//             setCurrentPage(prev => prev - 1);
//         }
//     };
//
//     const goToPage = (page) => {
//         if (page >= 1 && page <= totalPages) {
//             console.log("Going to page:", page);
//             setCurrentPage(page);
//         }
//     };
//
//     // Generate page numbers array
//     const getPageNumbers = () => {
//         const pages = [];
//         const maxVisible = 5;
//         let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//         let end = Math.min(totalPages, start + maxVisible - 1);
//
//         if (end - start + 1 < maxVisible) {
//             start = Math.max(1, end - maxVisible + 1);
//         }
//
//         for (let i = start; i <= end; i++) {
//             pages.push(i);
//         }
//         return pages;
//     };
//
//     const handleSearch = useCallback((query) => {
//         setSearchQuery(query);
//         setCurrentPage(1); // Reset to first page on search
//         // Search এর জন্য আলাদা API call needed
//         if (query) {
//             searchAttendance(query);
//         } else {
//             fetchAttendance();
//         }
//     }, []);
//
//     const searchAttendance = async (query) => {
//         setLoading(true);
//         try {
//             const response = await employeeAttendanceAPI.search(query);
//             setEmployeeAttendance(response.data.results || response.data);
//             setTotalItems(response.data.count || 0);
//         } catch (error) {
//             console.error("Search error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleFilter = useCallback((newFilters) => {
//         setFilters(prev => ({ ...prev, ...newFilters }));
//         setCurrentPage(1);
//         fetchAttendance(); // Refresh with filters
//     }, []);
//
//     // Filtered data for current page (already paginated from API)
//     const filteredAttendance = useMemo(() => {
//         if (!employeeAttendance) return [];
//
//         // Apply client-side filters on current page data
//         let result = [...employeeAttendance];
//
//         // Date Filter (client-side)
//         if (filters.dateRange !== "all") {
//             const today = new Date();
//             result = result.filter(item => {
//                 const date = new Date(item.date);
//                 if (filters.dateRange === "today") {
//                     return date.toDateString() === today.toDateString();
//                 }
//                 if (filters.dateRange === "week") {
//                     const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
//                     return date >= lastWeek;
//                 }
//                 if (filters.dateRange === "month") {
//                     const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
//                     return date >= lastMonth;
//                 }
//                 return true;
//             });
//         }
//
//         return result;
//     }, [employeeAttendance, filters.dateRange]);
//
//     const displayStats = [
//         { title: 'Total Records', count: totalItems, bgColor: 'bg-purple-600', icon: '📊' },
//         { title: 'Present', count: stats.present, bgColor: 'bg-green-500', icon: '✅' },
//         { title: 'Absent', count: stats.absent, bgColor: 'bg-red-500', icon: '❌' },
//         { title: 'Total Hours', count: `${stats.totalWorkHours}h`, bgColor: 'bg-blue-500', icon: '⏱️' }
//     ];
//
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <LoadingSpinner size="lg"/>
//                     <p className="mt-4 text-gray-600">Loading attendance records...</p>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//             <EmployeeAttendanceHeader
//                 viewType={viewType}
//                 setViewType={setViewType}
//                 onAddClick={() => setIsAddOpen(true)}
//             />
//
//             <div className="mb-6">
//                 <EmployeeStats stats={displayStats}/>
//             </div>
//
//             <div className="mb-6">
//                 <EmployeeAttendanceSearchFilter
//                     onSearch={handleSearch}
//                     onFilter={handleFilter}
//                 />
//             </div>
//
//             <div className="bg-white rounded-xl shadow-sm p-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
//                     <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
//                         {viewType === "grid" ? "Attendance Grid" : "Attendance List"}
//                     </h2>
//                     <div className="text-sm text-gray-500">
//                         Showing {filteredAttendance.length} of {totalItems} records
//                         {totalPages > 0 && ` | Page ${currentPage} of ${totalPages}`}
//                     </div>
//                 </div>
//
//                 {viewType === "grid" ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
//                         {filteredAttendance.map(att => (
//                             <EmployeeAttendanceCard
//                                 key={att.id}
//                                 attendance={att}
//                                 onEdit={() => fetchAttendance()}
//                                 onDelete={() => fetchAttendance()}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <EmployeeAttendanceList
//                         attendance={filteredAttendance}
//                         onEdit={() => fetchAttendance()}
//                         onDelete={() => fetchAttendance()}
//                     />
//                 )}
//
//                 {/* ✅ Pagination Component - Properly working */}
//                 {totalPages > 1 && (
//                     <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
//                         <button
//                             onClick={goToPrevPage}
//                             disabled={!prevPageUrl}
//                             className={`px-3 py-2 rounded-lg transition-colors ${
//                                 prevPageUrl
//                                     ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
//                                     : 'bg-gray-50 text-gray-400 cursor-not-allowed'
//                             }`}
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                             </svg>
//                         </button>
//
//                         <div className="flex gap-1">
//                             {getPageNumbers().map(page => (
//                                 <button
//                                     key={page}
//                                     onClick={() => goToPage(page)}
//                                     className={`px-3 py-2 rounded-lg transition-colors ${
//                                         currentPage === page
//                                             ? 'bg-blue-600 text-white'
//                                             : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
//                                     }`}
//                                 >
//                                     {page}
//                                 </button>
//                             ))}
//                         </div>
//
//                         <button
//                             onClick={goToNextPage}
//                             disabled={!nextPageUrl}
//                             className={`px-3 py-2 rounded-lg transition-colors ${
//                                 nextPageUrl
//                                     ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
//                                     : 'bg-gray-50 text-gray-400 cursor-not-allowed'
//                             }`}
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                             </svg>
//                         </button>
//                     </div>
//                 )}
//
//                 {/* Empty State */}
//                 {filteredAttendance.length === 0 && (
//                     <div className="text-center py-12">
//                         <div className="text-gray-400 mb-4">
//                             <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                       d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
//                             </svg>
//                         </div>
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
//                         <p className="text-gray-600">
//                             {searchQuery || Object.values(filters).some(f => f !== "all" && f !== null)
//                                 ? "Try changing your search or filter criteria"
//                                 : "Add your first attendance record to get started"
//                             }
//                         </p>
//                     </div>
//                 )}
//             </div>
//
//             <AddEmployeeAttendanceModal
//                 isOpen={isAddOpen}
//                 onClose={() => setIsAddOpen(false)}
//                 onSuccess={() => {
//                     setIsAddOpen(false);
//                     fetchAttendance(); // Refresh current page
//                 }}
//             />
//
//             <SuccessModal
//                 isOpen={!!successData}
//                 employee={successData}
//                 type={successType}
//                 onClose={() => setSuccessData(null)}
//             />
//         </div>
//     );
// };
//
// export default EmployeeAttendanceGrid;



import React, {useState, useEffect, useMemo, useCallback} from 'react';
import EmployeeAttendanceCard from "./EmployeeAttendanceCard";
import EmployeeAttendanceList from "./EmployeeAttendanceList";
import AddEmployeeAttendanceModal from "./AddEmployeeAttendanceModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {employeeAttendanceAPI} from "../../../context_or_provider/pos/EmployeeAttendance/employeeAttendanceAPI";
import { Activity, Calendar, UserCheck, UserX, Clock, ClipboardList, Search, ArrowUpDown } from 'lucide-react';

const EmployeeAttendanceGrid = ({ 
    viewType, 
    isAddOpen, 
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const [allAttendance, setAllAttendance] = useState([]); // সব ডাটা রাখার জন্য
    const [displayedAttendance, setDisplayedAttendance] = useState([]); // দেখানোর জন্য
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');
    const [loading, setLoading] = useState(true);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    // Provide filter configuration to parent on mount
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by employee name or designation...",
                filtersConfig: [
                    { 
                        key: "status", 
                        label: "Status", 
                        icon: <Activity className="w-3.5 h-3.5" />, 
                        options: [
                            { value: "all", label: "All Status" },
                            { value: "present", label: "Present" },
                            { value: "absent", label: "Absent" }
                        ] 
                    },
                    { 
                        key: "dateRange", 
                        label: "Quick Date", 
                        icon: <Calendar className="w-3.5 h-3.5" />, 
                        options: [
                            { value: "all", label: "All Records" },
                            { value: "today", label: "Today" },
                            { value: "week", label: "This Week" },
                            { value: "month", label: "This Month" }
                        ] 
                    }
                ],
                advancedConfig: [
                    { key: "workHours", type: "range", label: "Work Hours", minPlaceholder: "Min Hours", maxPlaceholder: "Max Hours" },
                    { key: "customDateRange", type: "date-range", label: "Custom Date Range" }
                ]
            });
        }
    }, [setFilterConfig]);

    // ✅ API থেকে ডাটা আনার ফাংশন
    const fetchAttendance = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await employeeAttendanceAPI.getAll(page);
            const results = response.data.results || [];
            setAllAttendance(results);
            setDisplayedAttendance(results);

            // পেজিনেশন ইনফো সেট করা
            setTotalItems(response.data.count || 0);
            const pages = Math.ceil((response.data.count || 0) / 10);
            setTotalPages(pages);
            setNextPage(response.data.next);
            setPreviousPage(response.data.previous);
            setCurrentPage(page);

            calculateStats(results, response.data.count || 0);
        } catch (error) {
            console.error("🔴 Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ পেজ চেঞ্জ হ্যান্ডলার
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchAttendance(newPage);
        }
    };

    const calculateStats = useCallback((data, totalCount) => {
        const present = data?.filter(d => d.is_present).length || 0;
        const absent = data?.filter(d => !d.is_present).length || 0;
        const totalWorkHours = data?.reduce((sum, d) => sum + (parseFloat(d.daily_work_time) || 0), 0) || 0;

        const displayStats = [
            { 
                title: 'Total Records', 
                count: totalCount, 
                bgColor: 'bg-brand-primary', 
                icon: <ClipboardList size={24} /> 
            },
            { 
                title: 'Present', 
                count: present, 
                bgColor: 'bg-emerald-500', 
                icon: <UserCheck size={24} /> 
            },
            { 
                title: 'Absent', 
                count: absent, 
                bgColor: 'bg-rose-500', 
                icon: <UserX size={24} /> 
            },
            { 
                title: 'Total Hours', 
                count: `${totalWorkHours.toFixed(1)}h`, 
                bgColor: 'bg-amber-500', 
                icon: <Clock size={24} /> 
            }
        ];

        if (onStatsLoaded) onStatsLoaded(displayStats);
    }, [onStatsLoaded]);

    // Initial load
    useEffect(() => {
        fetchAttendance(1);
    }, [fetchAttendance]);

    // Apply filtering and search
    useEffect(() => {
        let filtered = [...allAttendance];

        // Search
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.name?.toLowerCase().includes(query) ||
                item.user_designation?.toLowerCase().includes(query)
            );
        }

        // Quick Status Filter
        if (filters.status && filters.status !== "all") {
            filtered = filtered.filter(item =>
                filters.status === "present" ? item.is_present : !item.is_present
            );
        }

        // Quick Date Filter
        if (filters.dateRange && filters.dateRange !== "all") {
            const today = new Date();
            filtered = filtered.filter(item => {
                const date = new Date(item.date);
                if (filters.dateRange === "today") return date.toDateString() === today.toDateString();
                if (filters.dateRange === "week") return date >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (filters.dateRange === "month") return date >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                return true;
            });
        }

        // Advanced Work Hours Filter
        if (filters.workHours) {
            filtered = filtered.filter(item => {
                const hours = parseFloat(item.daily_work_time) || 0;
                const min = filters.workHours.min ? parseFloat(filters.workHours.min) : 0;
                const max = filters.workHours.max ? parseFloat(filters.workHours.max) : Infinity;
                return hours >= min && hours <= max;
            });
        }

        // Custom Date Range
        if (filters.customDateRange?.from && filters.customDateRange?.to) {
            const from = new Date(filters.customDateRange.from);
            const to = new Date(filters.customDateRange.to);
            filtered = filtered.filter(item => {
                const date = new Date(item.date);
                return date >= from && date <= to;
            });
        }

        setDisplayedAttendance(filtered);
    }, [allAttendance, searchQuery, filters]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 text-sm">Loading attendance records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            
            {/* Main Content Viewport */}
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <ClipboardList size={16} className="text-brand-primary" />
                        {viewType === "grid" ? "Attendance Grid" : "Attendance Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {displayedAttendance.length} OF {totalItems} RECORDS
                        {totalPages > 1 && ` | PAGE ${currentPage} OF ${totalPages}`}
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {displayedAttendance.map(att => (
                            <EmployeeAttendanceCard
                                key={att.id}
                                attendance={att}
                                onEdit={() => fetchAttendance(currentPage)}
                                onDelete={() => fetchAttendance(currentPage)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmployeeAttendanceList
                        attendance={displayedAttendance}
                        onEdit={() => fetchAttendance(currentPage)}
                        onDelete={() => fetchAttendance(currentPage)}
                    />
                )}

                {/* ✅ Pagination Component */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!previousPage}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                previousPage 
                                    ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' 
                                    : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                            }`}
                        >
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Simple page windowing
                                let pageNum = i + 1;
                                if (currentPage > 3 && totalPages > 5) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                }
                                if (pageNum < 1) return null;
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                            currentPage === pageNum
                                                ? 'bg-brand-primary text-white shadow-md'
                                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!nextPage}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                nextPage 
                                    ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' 
                                    : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}

                {displayedAttendance.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <ClipboardList className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800 mb-1">No attendance records found</h3>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
                            Try adjusting your filters or search query to find what you're looking for.
                        </p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                        >
                            Add Attendance Record
                        </button>
                    </div>
                )}
            </div>

            <AddEmployeeAttendanceModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={() => {
                    setIsAddOpen(false);
                    fetchAttendance(currentPage);
                }}
            />

            <SuccessModal
                isOpen={!!successData}
                employee={successData}
                type={successType}
                onClose={() => setSuccessData(null)}
            />
        </div>
    );
};

export default EmployeeAttendanceGrid;