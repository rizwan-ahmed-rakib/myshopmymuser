import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate, Outlet} from 'react-router-dom';
import {ChevronDown, Plus, LayoutGrid, List, RefreshCw, FileText, FileSpreadsheet} from 'lucide-react';
import StatCards from './StatCards';
import UniversalSearchFilter from './UniversalSearchFilter';

/**
 * ModuleShell - A centralized component that perfectly mimics the exact UI layout
 * and styles of Stock.jsx, while retaining the reusable logic and brand theme variables.
 */
const ModuleShell = ({
                         tabs = [],
                         activeTab,
                         setActiveTab,
                         basePath,
                         onAdd,
                         viewType,
                         setViewType,
                         stats = [],
                         // Search & Filter Props
                         onSearch,
                         onFilter,
                         searchPlaceholder,
                         filtersConfig,
                         advancedConfig,
                         onRefresh = () => window.location.reload(),
                         children
                     }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isActionOpen, setIsActionOpen] = useState(false);

    const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
    const isRootPath = location.pathname === basePath || location.pathname === `${basePath}/`;

    useEffect(() => {
        if (currentTab) {
            window.activeSubTabName = currentTab.name;
            window.dispatchEvent(new CustomEvent('subTabChange', { detail: currentTab.name }));
        }
    }, [currentTab]);

    return (
        <div className="h-full flex flex-col bg-gray-50">

            {/* 🔥 Top Navigation Bar (Identical in class names and layout to Stock.jsx) */}
            {/*<div*/}
            {/*    className="bg-white border-b px-4 py-3 flex flex-col md:flex-row md:items-start md:justify-between sticky top-0 z-30 shadow-sm gap-4 select-none">*/}

            {/*    /!* Left: Tabs Loop Container (Matches Stock.jsx perfectly, starting directly from the left) *!/*/}
            {/*    /!*<div className="flex flex-wrap gap-2 flex-1">*!/*/}
            {/*    /!*    {tabs.map((tab) => (*!/*/}
            {/*    /!*        <button*!/*/}
            {/*    /!*            key={tab.id}*!/*/}
            {/*    /!*            onClick={() => {*!/*/}
            {/*    /!*                if (activeTab !== tab.id) {*!/*/}
            {/*    /!*                    setActiveTab(tab.id);*!/*/}
            {/*    /!*                }*!/*/}
            {/*    /!*                // Redirect user to the base path if they are in a sub-route details view*!/*/}
            {/*    /!*                if (!isRootPath) {*!/*/}
            {/*    /!*                    navigate(basePath);*!/*/}
            {/*    /!*                }*!/*/}
            {/*    /!*            }}*!/*/}
            {/*    /!*            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 border-0*!/*/}
            {/*    /!*                ${activeTab === tab.id*!/*/}
            {/*    /!*                ? "bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white shadow-md"*!/*/}
            {/*    /!*                : "text-gray-600 hover:bg-gray-100 bg-gray-50"*!/*/}
            {/*    /!*            }`}*!/*/}
            {/*    /!*        >*!/*/}
            {/*    /!*            <span>{tab.icon}</span>*!/*/}
            {/*    /!*            <span>{tab.name}</span>*!/*/}
            {/*    /!*        </button>*!/*/}
            {/*    /!*    ))}*!/*/}
            {/*    /!*</div>*!/*/}


            {/*    /!* Left: Tabs Loop Container (Production Level Horizontal Scroll) *!/*/}
            {/*    /!* flex-wrap বাদ দিয়ে overflow-x-auto এবং whitespace-nowrap ব্যবহার করা হয়েছে *!/*/}
            {/*    <div*/}
            {/*        className="flex items-center flex-1 overflow-x-auto scrollbar-none gap-2 pb-1 -mb-1 max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">*/}
            {/*        {tabs.map((tab) => (*/}
            {/*            <button*/}
            {/*                key={tab.id}*/}
            {/*                onClick={() => {*/}
            {/*                    if (activeTab !== tab.id) {*/}
            {/*                        setActiveTab(tab.id);*/}
            {/*                    }*/}
            {/*                    if (!isRootPath) {*/}
            {/*                        navigate(basePath);*/}
            {/*                    }*/}
            {/*                }}*/}
            {/*                 // flex-shrink-0 এবং whitespace-nowrap এর কারণে টেক্সট কখনো নিচে ভাঙবে না*/}
            {/*                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 border-0 shrink-0 whitespace-nowrap*/}
            {/*    ${activeTab === tab.id*/}
            {/*                    ? "bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white shadow-sm"*/}
            {/*                    : "text-gray-600 hover:bg-gray-100 bg-gray-50"*/}
            {/*                }`}*/}
            {/*            >*/}
            {/*                <span className="text-sm sm:text-base">{tab.icon}</span>*/}
            {/*                <span>{tab.name}</span>*/}
            {/*            </button>*/}
            {/*        ))}*/}
            {/*    </div>*/}

            {/*    /!* Right: Dynamic Actions Group (Identical classes to Stock.jsx) *!/*/}
            {/*    <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-start">*/}
            {/*        /!* Primary Add Button (Desktop only) *!/*/}
            {/*        {isRootPath && onAdd && (*/}
            {/*            <button*/}
            {/*                onClick={onAdd}*/}
            {/*                className="hidden sm:flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap active:scale-95 duration-100"*/}
            {/*            >*/}
            {/*                <Plus size={18}/>*/}
            {/*                {currentTab.addLabel || 'Add New'}*/}
            {/*            </button>*/}
            {/*        )}*/}

            {/*        /!* Actions Trigger Dropdown Menu *!/*/}
            {/*        <div className="relative">*/}
            {/*            <button*/}
            {/*                onClick={() => setIsActionOpen(!isActionOpen)}*/}
            {/*                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"*/}
            {/*            >*/}
            {/*                <ChevronDown size={16}*/}
            {/*                             className={`transition-transform duration-200 ${isActionOpen ? 'rotate-180' : ''}`}/>*/}
            {/*            </button>*/}

            {/*            {isActionOpen && (*/}
            {/*                <>*/}
            {/*                    <div className="fixed inset-0 z-40" onClick={() => setIsActionOpen(false)}></div>*/}
            {/*                    <div*/}
            {/*                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">*/}
            {/*                        {isRootPath && (*/}
            {/*                            <>*/}
            {/*                                /!* Mobile Add Button inside dropdown *!/*/}
            {/*                                {onAdd && (*/}
            {/*                                    <button*/}
            {/*                                        onClick={() => {*/}
            {/*                                            onAdd();*/}
            {/*                                            setIsActionOpen(false);*/}
            {/*                                        }}*/}
            {/*                                        className="sm:hidden flex items-center gap-3 w-full px-4 py-2.5 text-sm text-brand-primary hover:bg-blue-50 font-semibold border-b border-gray-50"*/}
            {/*                                    >*/}
            {/*                                        <Plus size={18}/>*/}
            {/*                                        {currentTab.addLabel || 'Add New'}*/}
            {/*                                    </button>*/}
            {/*                                )}*/}

            {/*                                /!* View Mode controls *!/*/}
            {/*                                <div*/}
            {/*                                    className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">*/}
            {/*                                    View Mode*/}
            {/*                                </div>*/}
            {/*                                <button*/}
            {/*                                    onClick={() => {*/}
            {/*                                        setViewType('grid');*/}
            {/*                                        setIsActionOpen(false);*/}
            {/*                                    }}*/}
            {/*                                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${viewType === 'grid' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-gray-700 hover:bg-gray-100'}`}*/}
            {/*                                >*/}
            {/*                                    <LayoutGrid size={18}/>*/}
            {/*                                    Grid View*/}
            {/*                                </button>*/}
            {/*                                <button*/}
            {/*                                    onClick={() => {*/}
            {/*                                        setViewType('list');*/}
            {/*                                        setIsActionOpen(false);*/}
            {/*                                    }}*/}
            {/*                                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${viewType === 'list' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-gray-700 hover:bg-gray-100'}`}*/}
            {/*                                >*/}
            {/*                                    <List size={18}/>*/}
            {/*                                    List View*/}
            {/*                                </button>*/}
            {/*                                <div className="my-1 border-t border-gray-100"></div>*/}
            {/*                            </>*/}
            {/*                        )}*/}

            {/*                        /!* Export Controls *!/*/}
            {/*                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">*/}
            {/*                            Export Data*/}
            {/*                        </div>*/}
            {/*                        <button*/}
            {/*                            onClick={() => setIsActionOpen(false)}*/}
            {/*                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"*/}
            {/*                        >*/}
            {/*                            <FileText size={18} className="text-red-500"/>*/}
            {/*                            Export as PDF*/}
            {/*                        </button>*/}
            {/*                        <button*/}
            {/*                            onClick={() => setIsActionOpen(false)}*/}
            {/*                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"*/}
            {/*                        >*/}
            {/*                            <FileSpreadsheet size={18} className="text-green-600"/>*/}
            {/*                            Export as Excel*/}
            {/*                        </button>*/}

            {/*                        <div className="my-1 border-t border-gray-100"></div>*/}

            {/*                        /!* Refresh List button *!/*/}
            {/*                        <button*/}
            {/*                            onClick={() => {*/}
            {/*                                onRefresh();*/}
            {/*                                setIsActionOpen(false);*/}
            {/*                            }}*/}
            {/*                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"*/}
            {/*                        >*/}
            {/*                            <RefreshCw size={18} className="text-brand-primary"/>*/}
            {/*                            Refresh List*/}
            {/*                        </button>*/}
            {/*                    </div>*/}
            {/*                </>*/}
            {/*            )}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}


            {/* 🔥 Top Navigation Bar — Production Level Responsive Layout */}
            <div
                className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm gap-3 select-none">

                {/* Left: Scrollable Tabs Container */}
                {/* flex-1 দেওয়ার কারণে এটি ড্রপডাউন বাটনের জন্য জায়গা ছেড়ে দিয়ে বাকি পুরোটা জায়গা নেবে */}
                <div
                    className="flex items-center flex-1 overflow-x-auto scrollbar-none gap-2 pb-0.5 max-w-[calc(100%-60px)] sm:max-w-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (activeTab !== tab.id) {
                                    setActiveTab(tab.id);
                                }
                                if (!isRootPath) {
                                    navigate(basePath);
                                }
                            }}
                            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 border-0 shrink-0 whitespace-nowrap
                    ${activeTab === tab.id
                                ? "bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100 bg-gray-50"
                            }`}
                        >
                            <span className="text-sm sm:text-base">{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Right: Fixed Dynamic Actions Group (Elevated Dropdown Button) */}
                {/* shrink-0 এর কারণে এটি স্ক্রোলের ভেতরে ঢুকবে না, ডানপাশে ফিক্সড থাকবে */}
                <div className="flex items-center gap-2 shrink-0 pl-1">
                    {/* Primary Add Button (Desktop only) */}
                    {isRootPath && onAdd && (
                        <button
                            onClick={onAdd}
                            className="hidden sm:flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap active:scale-95 duration-100"
                        >
                            <Plus size={18}/>
                            {currentTab.addLabel || 'Add New'}
                        </button>
                    )}

                    {/* Actions Trigger Dropdown Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsActionOpen(!isActionOpen)}
                            className="flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
                        >
                            <ChevronDown size={16}
                                         className={`transition-transform duration-200 ${isActionOpen ? 'rotate-180' : ''}`}/>
                        </button>

                        {isActionOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsActionOpen(false)}></div>
                                <div
                                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                                    {isRootPath && (
                                        <>
                                            {/* Mobile Add Button inside dropdown */}
                                            {onAdd && (
                                                <button
                                                    onClick={() => {
                                                        onAdd();
                                                        setIsActionOpen(false);
                                                    }}
                                                    className="sm:hidden flex items-center gap-3 w-full px-4 py-2.5 text-sm text-brand-primary hover:bg-blue-50 font-semibold border-b border-gray-50"
                                                >
                                                    <Plus size={18}/>
                                                    {currentTab.addLabel || 'Add New'}
                                                </button>
                                            )}

                                            {/* View Mode controls */}
                                            <div
                                                className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                View Mode
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setViewType('grid');
                                                    setIsActionOpen(false);
                                                }}
                                                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${viewType === 'grid' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                <LayoutGrid size={18}/>
                                                Grid View
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setViewType('list');
                                                    setIsActionOpen(false);
                                                }}
                                                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${viewType === 'list' ? 'bg-blue-50 text-brand-primary font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                <List size={18}/>
                                                List View
                                            </button>
                                            <div className="my-1 border-t border-gray-100"></div>
                                        </>
                                    )}

                                    {/* Export Controls */}
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Export Data
                                    </div>
                                    <button
                                        onClick={() => setIsActionOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <FileText size={18} className="text-red-500"/>
                                        Export as PDF
                                    </button>
                                    <button
                                        onClick={() => setIsActionOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <FileSpreadsheet size={18} className="text-green-600"/>
                                        Export as Excel
                                    </button>

                                    <div className="my-1 border-t border-gray-100"></div>

                                    {/* Refresh List button */}
                                    <button
                                        onClick={() => {
                                            onRefresh();
                                            setIsActionOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <RefreshCw size={18} className="text-brand-primary"/>
                                        Refresh List
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔥 Content Area (Exactly matches Stock.jsx: flex-1 p-2 overflow-auto) */}
            <div className="flex-1 p-2 overflow-auto">

                {/*Render statistics dynamically if provided */}
                {/*{stats && stats.length > 0 && (*/}


                {/* Render statistics dynamically if provided and on root path */}
                {isRootPath && stats && stats.length > 0 && (
                    <div className="mb-4">
                        <StatCards stats={stats}/>
                    </div>
                )}

                {/* Render Search & Filter if provided and on root path */}
                {/* 🔥 Added key={activeTab} to force component remount and state reset when switching tabs */}
                {isRootPath && (onSearch || onFilter) && (
                    <div className="mb-4">
                        <UniversalSearchFilter
                            // key={activeTab}
                            key={activeTab}
                            onSearch={onSearch}
                            onFilter={onFilter}
                            searchPlaceholder={searchPlaceholder}
                            filtersConfig={filtersConfig}
                            advancedConfig={advancedConfig}
                        />
                    </div>
                )}

                {/* Classic white card container matching Stock.jsx exactly (bg-white rounded-md shadow-sm p-2) */}
                <div className="bg-white rounded-md shadow-sm p-2">
                    {isRootPath ? children : <Outlet/>}
                </div>
            </div>
        </div>
    );
};

export default ModuleShell;
