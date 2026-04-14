import React from "react";

const SupplierHeader = ({viewType, setViewType, onAddClick}) => (
    <div
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4 lg:mb-0">
            <div className="mr-6">
                <h4 className="text-xl font-bold text-gray-900">Employees</h4>
                <h6 className="text-gray-600">Manage your employees</h6>
            </div>
        </div>

        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="flex items-center border-r border-gray-300 pr-4">
                {/*<button className="p-2 text-gray-500 hover:text-blue-600 transition-colors"*/}
                <button className={`p-2 ${viewType === "list" ? "text-blue-600" : "text-gray-500"}`}
                        onClick={() => setViewType("list")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>

                    {/*employee list*/}
                    {/*📋 employee list*/}
                </button>
                <button
                    className={`p-2 ml-2 rounded ${viewType === "grid" ? "bg-blue-600 text-white" : "text-gray-500"}`}
                    onClick={() => setViewType("grid")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>

                    {/*employee grid*/}
                    {/*⬜ employee grid*/}
                </button>
            </div>

            <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="PDF">
                    <span className="text-sm font-medium">PDF</span>
                </button>
                <button className="p-2 text-gray-500 hover:text-green-600 transition-colors" title="Excel">
                    <span className="text-sm font-medium">Excel</span>
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Refresh">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <path d="M23 4v6h-6"></path>
                        <path d="M1 20v-6h6"></path>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" title="Collapse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                </button>
            </div>
        </div>

        <div>
            <button
                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                onClick={onAddClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Add Supplier
            </button>
        </div>
    </div>
);

export default SupplierHeader;
