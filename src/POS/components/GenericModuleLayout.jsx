import React from 'react';
import StatCards from './StatCards';
import {FaPlus, FaThLarge, FaList} from 'react-icons/fa';

/**
 * GenericModuleLayout - Orchestrates the layout for POS modules.
 */
const GenericModuleLayout = ({
                                 title,
                                 stats,
                                 viewType,
                                 setViewType,
                                 onAdd,
                                 addText = "Add New",
                                 filters,
                                 children,
                                 totalCount = 0,
                                 totalFilteredCount = 0,
                             }) => {
    return (
        <div className="flex flex-col min-h-full bg-gray-50/50 p-4 md:p-6 space-y-6">
            {/* 1. Statistics Summary */}
            <StatCards stats={stats}/>

            {/* 2. Page Header & Actions */}

            {/*<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">*/}
            {/*    <div className="flex items-center gap-4">*/}
            {/*        <div className="bg-blue-600 w-2 h-8 rounded-full"></div>*/}
            {/*        <div>*/}
            {/*            <h1 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h1>*/}
            {/*            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">*/}
            {/*                {totalCount} Records Found*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className="flex items-center gap-3">*/}
            {/*        /!* View Switcher *!/*/}
            {/*        <div className="bg-gray-100 p-1.5 rounded-xl flex items-center mr-2 shadow-inner">*/}
            {/*            <button*/}
            {/*                onClick={() => setViewType('grid')}*/}
            {/*                className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}*/}
            {/*                title="Grid View"*/}
            {/*            >*/}
            {/*                <FaThLarge size={16} />*/}
            {/*            </button>*/}
            {/*            <button*/}
            {/*                onClick={() => setViewType('list')}*/}
            {/*                className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}*/}
            {/*                title="List View"*/}
            {/*            >*/}
            {/*                <FaList size={16} />*/}
            {/*            </button>*/}
            {/*        </div>*/}

            {/*        /!* Action Button *!/*/}
            {/*        <button*/}
            {/*            onClick={onAdd}*/}
            {/*            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95"*/}
            {/*        >*/}
            {/*            <FaPlus size={14} /> {addText}*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* 3. Search & Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Filter Controls</h3>
                </div>
                <div className="p-5">
                    {filters}
                </div>
            </div>

            {/* 4. Main Data Area */}
            <div className="flex-1">

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-white">
                        <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                            <span className="text-blue-500">{viewType === 'grid' ? '▦' : '☰'}</span>
                            {viewType === 'grid' ? 'Gallery View' : 'Table View'}
                        </h2>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {totalFilteredCount} Records Found of {totalCount}
                        </p>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-100"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-100"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-100"></div>
                        </div>
                    </div>
                    <div className="p-5 min-h-[400px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenericModuleLayout;


// import React from 'react';
// import StatCards from './StatCards';
// import {FaPlus, FaThLarge, FaList} from 'react-icons/fa';
//
// /**
//  6 -  * GenericModuleLayout - Orchestrates the layout for POS modules.
//  7 -  * @param {string} title - Page title
//  8 -  * @param {Array} stats - Statistics array for StatCards
//  9 -  * @param {string} viewType - Current view type ('grid' or 'list')
//  10 -  * @param {function} setViewType - Setter for view type
//  11 -  * @param {function} onAdd - Callback for the "Add New" button
//  12 -  * @param {string} addText - Text for the "Add New" button
//  13 -  * @param {React.ReactNode} filters - Filter/Search component
//  14 -  * @param {React.ReactNode} children - Main content (Grid or Lis5 -  * @param {number} totalCount - Total number of items
//  16 -  */
// const GenericModuleLayout = ({
//                                  title,
//                                  stats,
//                                  viewType,
//                                  setViewType,
//                                  onAdd,
//                                  addText = "Add New",
//                                  filters,
//                                  children,
//                                  totalCount = 0
//                              }) => {
//     return (
//         <div className="flex flex-col h-full bg-gray-50/50 p-4 md:p-6 space-y-6">
//             {/* 1. Statistics Summary */}
//             <StatCards stats={stats}/>
//
//             {/* 2. Page Header & Actions */}
//             <div
//                 className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-4">
//                     <h1 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h1>
//                     <span
//                         className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
//                                {totalCount} Total
//                            </span>
//                 </div>
//
//                 <div className="flex items-center gap-2">
//                     {/* View Switcher */}
//                     <div className="bg-gray-100 p-1 rounded-lg flex items-center mr-2">
//                         <button
//                             onClick={() => setViewType('grid')}
//                             className={`p-2 rounded-md transition-all ${viewType === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400over:text-gray-600'}`}
//                         >
//                             <FaThLarge size={16}/>
//                         </button>
//                         <button
//                             onClick={() => setViewType('list')}
//                             className={`p-2 rounded-md transition-all ${viewType === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400over:text-gray-600'}`}
//                         >
//                             <FaList size={16}/>
//                         </button>
//                     </div>
//
//                     {/* Action Button */}
//                     <button
//                         onClick={onAdd}
//                         className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:from-blue-700
//     over:to-indigo-700 transition-all flex items-center gap-2 active:scale-95"
//                     >
//                         <FaPlus size={14}/> {addText}
//                     </button>
//                 </div>
//             </div>
//
//             {/* 3. Search & Filters */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="p-4 border-b border-gray-50 bg-gray-50/30">
//                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Search & Filtering</h3>
//                 </div>
//                 <div className="p-4">
//                     {filters}
//                 </div>
//             </div>
//
//             {/* 4. Main Data Area */}
//             <div className="flex-1 min-h-0">
//                 <div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
//                     <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white">
//                         <h2 className="font-bold text-gray-700">
//                             {viewType === 'grid' ? 'Grid View' : 'List View'}
//                         </h2>
//                     </div>
//                     <div className="p-4 overflow-auto flex-1">
//                         {children}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
//         ;
// };
//
// export default GenericModuleLayout