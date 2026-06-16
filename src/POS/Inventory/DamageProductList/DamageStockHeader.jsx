// import React from 'react';

// const DamageStockHeader = ({ viewType, setViewType, onAddClick }) => {
//     return (
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-900">ড্যামেজ স্টক ম্যানেজমেন্ট</h1>
//                 <p className="text-sm text-gray-500 mt-1">ক্ষতিগ্রস্ত পণ্যের তালিকা দেখুন ও ব্যবস্থাপনা করুন</p>
//             </div>

//             <div className="flex items-center space-x-3 mt-4 sm:mt-0">
//                 {/* View Toggle */}
//                 <div className="flex items-center bg-gray-100 rounded-lg p-1">
//                     <button
//                         onClick={() => setViewType("grid")}
//                         className={`p-2 rounded-md transition-colors ${
//                             viewType === "grid" 
//                                 ? "bg-white shadow-sm text-blue-600" 
//                                 : "text-gray-500 hover:text-gray-700"
//                         }`}
//                         title="গ্রিড ভিউ"
//                     >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                 d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                         </svg>
//                     </button>
//                     <button
//                         onClick={() => setViewType("list")}
//                         className={`p-2 rounded-md transition-colors ${
//                             viewType === "list" 
//                                 ? "bg-white shadow-sm text-blue-600" 
//                                 : "text-gray-500 hover:text-gray-700"
//                         }`}
//                         title="লিস্ট ভিউ"
//                     >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                 d="M4 6h16M4 12h16M4 18h16" />
//                         </svg>
//                     </button>
//                 </div>

//                 {/* Add Button */}
//                 <button
//                     onClick={onAddClick}
//                     className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     নতুন ড্যামেজ রেকর্ড
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DamageStockHeader;

















// import React from "react";

// const DamageProductsHeader = ({ viewType, setViewType, onAddClick }) => (
//   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 px-5 py-4 bg-white rounded-xl border border-slate-200 shadow-sm">

//     {/* Left: Title */}
//     <div className="mb-4 lg:mb-0">
//       <div className="flex items-center gap-2.5">
//         <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
//           <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M12 2L2 7l10 5 10-5-10-5z"/>
//             <path d="M2 17l10 5 10-5"/>
//             <path d="M2 12l10 5 10-5"/>
//           </svg>
//         </div>
//         <div>
//           <h4 className="text-[15px] font-semibold text-slate-800 leading-none">Damage Products</h4>
//           <p className="text-[11px] text-slate-400 mt-0.5">Manage your damaged product inventory</p>
//         </div>
//       </div>
//     </div>

//     {/* Center: View toggle + tools */}
//     <div className="flex items-center gap-3 mb-4 lg:mb-0">
//       <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
//         <button
//           onClick={() => setViewType("list")}
//           title="List View"
//           className={`p-1.5 rounded-md transition-all ${viewType === "list" ? "bg-white shadow-sm text-rose-500" : "text-slate-400 hover:text-slate-600"}`}
//         >
//           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
//             <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
//           </svg>
//         </button>
//         <button
//           onClick={() => setViewType("grid")}
//           title="Grid View"
//           className={`p-1.5 rounded-md transition-all ${viewType === "grid" ? "bg-white shadow-sm text-rose-500" : "text-slate-400 hover:text-slate-600"}`}
//         >
//           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
//             <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
//           </svg>
//         </button>
//       </div>

//       <div className="w-px h-5 bg-slate-200" />

//       <button title="Export PDF" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200 hover:border-red-200">
//         <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
//         </svg>
//         PDF
//       </button>
//       <button title="Export Excel" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-slate-200 hover:border-green-200">
//         <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="3" width="18" height="18" rx="2"/>
//           <line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
//           <line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
//         </svg>
//         Excel
//       </button>
//       <button title="Refresh" className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200">
//         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
//           <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
//         </svg>
//       </button>
//     </div>

//     {/* Right: Add button */}
//     <button
//       onClick={onAddClick}
//       className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-medium rounded-lg transition-colors shadow-sm"
//     >
//       <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//         <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
//       </svg>
//       Add Damage Product
//     </button>
//   </div>
// );

// export default DamageProductsHeader;












import React from "react";

const DamageStockHeader = ({ viewType, setViewType, onAddClick }) => (
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 px-5 py-4 bg-white rounded-xl border border-slate-200 shadow-sm">

    {/* Left: Title */}
    <div className="mb-4 lg:mb-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-slate-800 leading-none">ড্যামেজ স্টক ম্যানেজমেন্ট</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">ক্ষতিগ্রস্ত পণ্যের তালিকা দেখুন ও ব্যবস্থাপনা করুন</p>
        </div>
      </div>
    </div>

    {/* Center: View toggle + tools */}
    <div className="flex items-center gap-3 mb-4 lg:mb-0">
      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
        <button
          onClick={() => setViewType("grid")}
          title="গ্রিড ভিউ"
          className={`p-1.5 rounded-md transition-all ${viewType === "grid" ? "bg-white shadow-sm text-orange-500" : "text-slate-400 hover:text-slate-600"}`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </button>
        <button
          onClick={() => setViewType("list")}
          title="লিস্ট ভিউ"
          className={`p-1.5 rounded-md transition-all ${viewType === "list" ? "bg-white shadow-sm text-orange-500" : "text-slate-400 hover:text-slate-600"}`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="w-px h-5 bg-slate-200" />

      <button title="PDF" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
        PDF
      </button>
      <button title="Excel" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-slate-200">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
          <line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
        </svg>
        Excel
      </button>
    </div>

    {/* Right: Add button */}
    <button
      onClick={onAddClick}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-medium rounded-lg transition-colors shadow-sm"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      নতুন ড্যামেজ রেকর্ড
    </button>
  </div>
);

export default DamageStockHeader;