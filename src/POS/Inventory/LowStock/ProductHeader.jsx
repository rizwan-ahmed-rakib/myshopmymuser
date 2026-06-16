// import React from "react";

// const ProductsHeader = ({viewType, setViewType, onAddClick}) => (
//     <div
//         className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="flex items-center mb-4 lg:mb-0">
//             <div className="mr-6">
//                 <h4 className="text-xl font-bold text-gray-900">Products</h4>
//                 <h6 className="text-gray-600">Manage your Products</h6>
//             </div>
//         </div>

//         <div className="flex items-center space-x-4 mb-4 lg:mb-0">
//             <div className="flex items-center border-r border-gray-300 pr-4">
//                 {/*<button className="p-2 text-gray-500 hover:text-blue-600 transition-colors"*/}
//                 <button className={`p-2 ${viewType === "list" ? "text-blue-600" : "text-gray-500"}`}
//                         onClick={() => setViewType("list")}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
//                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
//                          strokeLinejoin="round">
//                         <line x1="8" y1="6" x2="21" y2="6"></line>
//                         <line x1="8" y1="12" x2="21" y2="12"></line>
//                         <line x1="8" y1="18" x2="21" y2="18"></line>
//                         <line x1="3" y1="6" x2="3.01" y2="6"></line>
//                         <line x1="3" y1="12" x2="3.01" y2="12"></line>
//                         <line x1="3" y1="18" x2="3.01" y2="18"></line>
//                     </svg>

//                     {/*Products list*/}
//                     {/*📋 Products list*/}
//                 </button>
//                 <button
//                     className={`p-2 ml-2 rounded ${viewType === "grid" ? "bg-blue-600 text-white" : "text-gray-500"}`}
//                     onClick={() => setViewType("grid")}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
//                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
//                          strokeLinejoin="round">
//                         <rect x="3" y="3" width="7" height="7"></rect>
//                         <rect x="14" y="3" width="7" height="7"></rect>
//                         <rect x="14" y="14" width="7" height="7"></rect>
//                         <rect x="3" y="14" width="7" height="7"></rect>
//                     </svg>

//                     {/*Products grid*/}
//                     {/*⬜ Products grid*/}
//                 </button>
//             </div>

//             <div className="flex items-center space-x-2">
//                 <button className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="PDF">
//                     <span className="text-sm font-medium">PDF</span>
//                 </button>
//                 <button className="p-2 text-gray-500 hover:text-green-600 transition-colors" title="Excel">
//                     <span className="text-sm font-medium">Excel</span>
//                 </button>
//                 <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Refresh">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
//                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
//                          strokeLinejoin="round">
//                         <path d="M23 4v6h-6"></path>
//                         <path d="M1 20v-6h6"></path>
//                         <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
//                     </svg>
//                 </button>
//                 <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" title="Collapse">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
//                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
//                          strokeLinejoin="round">
//                         <polyline points="18 15 12 9 6 15"></polyline>
//                     </svg>
//                 </button>
//             </div>
//         </div>

//         <div>
//             <button
//                 className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
//                 onClick={onAddClick}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
//                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//                      className="mr-2">
//                     <circle cx="12" cy="12" r="10"></circle>
//                     <line x1="12" y1="8" x2="12" y2="16"></line>
//                     <line x1="8" y1="12" x2="16" y2="12"></line>
//                 </svg>
//                 Add Products
//             </button>
//         </div>
//     </div>
// );

// export default ProductsHeader;















import React from "react";

const ProductsHeader = ({ viewType, setViewType, onAddClick }) => (
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 px-5 py-4 bg-white rounded-xl border border-slate-200 shadow-sm">

    {/* Left: Title */}
    <div className="mb-4 lg:mb-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-slate-800 leading-none">Products</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage your product inventory</p>
        </div>
      </div>
    </div>

    {/* Center: View toggle + tools */}
    <div className="flex items-center gap-3 mb-4 lg:mb-0">
      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
        <button
          onClick={() => setViewType("list")}
          title="List View"
          className={`p-1.5 rounded-md transition-all ${viewType === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
        <button
          onClick={() => setViewType("grid")}
          title="Grid View"
          className={`p-1.5 rounded-md transition-all ${viewType === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </button>
      </div>

      <div className="w-px h-5 bg-slate-200" />

      <button title="Export PDF" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200 hover:border-red-200">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
        PDF
      </button>
      <button title="Export Excel" className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-slate-200 hover:border-green-200">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
          <line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
        </svg>
        Excel
      </button>
      <button title="Refresh" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 hover:border-indigo-200">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
        </svg>
      </button>
    </div>

    {/* Right: Add button */}
    <button
      onClick={onAddClick}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium rounded-lg transition-colors shadow-sm"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Add Product
    </button>
  </div>
);

export default ProductsHeader;