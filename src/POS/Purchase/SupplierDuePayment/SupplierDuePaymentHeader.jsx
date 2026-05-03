import React from 'react';
import { FaPlus, FaThLarge, FaList } from 'react-icons/fa';

const SupplierDuePaymentHeader = ({ viewType, setViewType, onAddClick }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Supplier Due Payment</h1>
                <p className="text-gray-500 mt-1 font-medium">Manage and record supplier outstanding balance payments.</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
                    <button
                        onClick={() => setViewType("grid")}
                        className={`p-2 rounded-lg transition-all ${
                            viewType === "grid" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        <FaThLarge size={18} />
                    </button>
                    <button
                        onClick={() => setViewType("list")}
                        className={`p-2 rounded-lg transition-all ${
                            viewType === "list" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        <FaList size={18} />
                    </button>
                </div>

                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                >
                    <FaPlus size={14} />
                    <span>Record Payment</span>
                </button>
            </div>
        </div>
    );
};

export default SupplierDuePaymentHeader;
