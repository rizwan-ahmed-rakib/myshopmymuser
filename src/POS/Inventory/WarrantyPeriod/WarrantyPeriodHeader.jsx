import React from "react";

const WarrantyPeriodHeader = ({ viewType, setViewType, onAddClick }) => (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div>
            <h4 className="text-xl font-bold text-gray-900">Warranty Periods</h4>
            <h6 className="text-gray-600">Manage your warranty terms</h6>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center border-r pr-4 space-x-2">
                <button
                    className={`p-2 rounded ${viewType === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                    onClick={() => setViewType("list")}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <button
                    className={`p-2 rounded ${viewType === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                    onClick={() => setViewType("grid")}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
                    </svg>
                </button>
            </div>

            <button
                onClick={onAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Warranty
            </button>
        </div>
    </div>
);

export default WarrantyPeriodHeader;
