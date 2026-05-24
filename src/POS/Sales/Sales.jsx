// myshopPages/Sales.jsx (Updated with Tabs)
import React, {useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {ChevronDown, Plus, LayoutGrid, List, FileText, FileSpreadsheet, RefreshCw} from 'lucide-react';
import SaleGrid from "./SaleProduct/SaleGrid";
import CustomerGrid from "./CustomerList/CustomerGrid";
import SaleReturnGrid from "./SaleReturn/SaleReturnGrid";
import CustomerDueCollectionGrid from "./CustomerDueCollection/CustomerDueCollectionGrid";

const Sales = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('sales');
    const [viewType, setViewType] = useState('grid');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const navigate = useNavigate(); // 💡 নেভিগেশন ইনিশিয়ালাইজ করা হলো

    const tabs = [
        {id: 'sales', name: 'Sales', icon: '🛒', addLabel: 'Add Sale'},
        {id: 'sales-return', name: 'Sales Return', icon: '↩️', addLabel: 'Add Return'},
        {id: 'customers', name: 'Customers', icon: '👥', addLabel: 'Add Customer'},
        {id: 'customers-due-collection', name: 'Customers Due Collection', icon: '📄', addLabel: 'Collect Due'},
    ];

    const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

    const renderTabContent = () => {
        const commonProps = {
            viewType,
            isAddOpen,
            setIsAddOpen,
        };

        switch (activeTab) {
            case 'sales':
                return <SaleGrid {...commonProps} />;
            case 'customers':
                return <CustomerGrid {...commonProps} />;
            case 'sales-return':
                return <SaleReturnGrid {...commonProps} />;
            case 'customers-due-collection':
                return <CustomerDueCollectionGrid {...commonProps} />;
            default:
                return <SaleGrid {...commonProps} />;
        }
    };

    // Check if we are on the root sales path or a sub-route (like details)
    const isRootSalesPath = location.pathname === '/sales' || location.pathname === '/sales/';

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* 🔥 Top Navigation Bar (ট্যাব বেশি হলে ভেঙে নিচে নামবে, বাটন পজিশন ঠিক থাকবে) */}
            {/* 🔥 Top Navigation Bar */}
            <div
                className="bg-white border-b px-4 py-3 flex flex-col md:flex-row md:items-start md:justify-between sticky top-0 z-30 shadow-sm gap-4">
                {/* Left: Tabs Loop Container (`flex-wrap` ব্যবহারের কারণে স্ক্রলবার লাগবে না, অটো নিচে নামবে) */}
                {/* Left: Tabs Loop Container */}
                <div className="flex flex-wrap gap-2 flex-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsAddOpen(false);
                                // 💡 ম্যাজিক লাইন: ট্যাবে ক্লিক করলে যদি আমরা কোনো সাব-রুটে (ডিটেইলস পেজে) থাকি,
                                // তবে সেটিকে রিডাইরেক্ট করে মেইন স্টক পাথে নিয়ে আসবে।
                                if (!isRootSalesPath) {
                                    navigate('/sales');
                                }
                            }}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2
                                ${activeTab === tab.id
                                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100 bg-gray-50"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Right: Dynamic Actions Group */}
                <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-start">
                    {/* Primary Add Button (Only show if we are on root path where tabs are relevant) */}
                    {isRootSalesPath && (
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
                        >
                            <Plus size={18}/>
                            {currentTab.addLabel}
                        </button>
                    )}

                    {/* Actions Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsActionOpen(!isActionOpen)}
                            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm"
                        >
                            <ChevronDown size={16}
                                         className={`transition-transform duration-200 ${isActionOpen ? 'rotate-180' : ''}`}/>
                        </button>

                        {isActionOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsActionOpen(false)}></div>
                                <div
                                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-200">

                                    {isRootSalesPath && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setIsAddOpen(true);
                                                    setIsActionOpen(false);
                                                }}
                                                className="sm:hidden flex items-center gap-3 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 font-semibold border-b"
                                            >
                                                <Plus size={18}/>
                                                {currentTab.addLabel}
                                            </button>

                                            <div
                                                className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                View Mode
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setViewType('grid');
                                                    setIsActionOpen(false);
                                                }}
                                                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${viewType === 'grid' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                <LayoutGrid size={18}/>
                                                Grid View
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setViewType('list');
                                                    setIsActionOpen(false);
                                                }}
                                                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${viewType === 'list' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                <List size={18}/>
                                                List View
                                            </button>
                                            <div className="my-1 border-t border-gray-100"></div>
                                        </>
                                    )}

                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Export Data
                                    </div>
                                    <button
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <FileText size={18} className="text-red-500"/>
                                        Export as PDF
                                    </button>
                                    <button
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <FileSpreadsheet size={18} className="text-green-600"/>
                                        Export as Excel
                                    </button>

                                    <div className="my-1 border-t border-gray-100"></div>
                                    <button
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <RefreshCw size={18} className="text-blue-500"/>
                                        Refresh List
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔥 Content Area */}
            <div className="flex-1 p-2 overflow-auto">
                <div className="bg-white rounded-md shadow-sm p-2">
                    {/* Render Outlet for sub-routes, or Tab Content if at root */}
                    {isRootSalesPath ? renderTabContent() : <Outlet/>}
                </div>
            </div>
        </div>
    );
};

export default Sales;