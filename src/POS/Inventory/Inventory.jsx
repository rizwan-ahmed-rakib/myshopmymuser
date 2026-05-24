// myshopPages/Inventory.jsx
import React, {useState} from 'react';
// import {Outlet, useLocation} from 'react-router-dom';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import PurchaseList from './PurchaseList';
import AddPurchase from './AddPurchase';
import Suppliers from './Suppliers';
import ProductGrid from "./ProductList/ProductGrid";
import CategoryGrid from "./CategoryList/CategoryGrid";
import BrandsGrid from "./BrandList/BrandsGrid";
import SubCateforyGrid from "./SubcategoryList/SubCateforyGrid";
import UnitGrid from "./UnitList/UnitGrid";
import SizeGrid from "./SizeList/SizeGrid";
// import DamageProductGrid from "./DamageProductList/DamageProductGrid"
// import DamageStockGrid from "./DamageProductList/DamageStockGrid";
import BarcodeQRList from './BarcodeQRList';
// import ProducLowstocktGrid from "./LowStock/ProducLowstocktGrid";
// import ExpiredProducts from "./Expeired products/ExpiredProducts";
import Warranties from "./Warranties/Warranties";
import WarrantyPeriodsGrid from "./WarrantyPeriod/WarrantyPeriodsGrid";
import {ChevronDown, FileSpreadsheet, FileText, LayoutGrid, List, Plus, RefreshCw} from "lucide-react";
// import DamageStockGrid from "../Stock/DamageProductList/DamageStockGrid";

const Inventory = () => {
    // const [activeSection, setActiveSection] = useState('product_list');
    const [activeTab, setActiveTab] = useState('product_list');
    const [viewType, setViewType] = useState('grid');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const navigate = useNavigate(); // 💡 নেভিগেশন ইনিশিয়ালাইজ করা হলো

    // const menuItems = [
    const tabs = [

        // { id: 'create_product', name: 'Create Product', icon: '➕' },
        {id: 'product_list', name: 'Product List', icon: '📋', addLabel: 'Add Product'},
        {id: 'Categories', name: 'Categories', icon: '👥', addLabel: 'Add Categorie'},
        {id: 'SubCategories', name: 'SubCategories', icon: '👥', addLabel: 'Add SubCategory'},
        {id: 'Brands', name: 'Brands', icon: '👥', addLabel: 'Add Brand'},
        {id: 'Units', name: 'Units', icon: '👥', addLabel: 'Add Unit'},
        {id: 'Size', name: 'Size', icon: '👥', addLabel: 'Add Size'},
        {id: 'WarrantyPeriods', name: 'Warranty', icon: '👥', addLabel: 'Add Warranty'},
        // {id: 'Print_Barcode', name: 'Print Barcode', icon: '👥', addLabel: 'Add Barcode'},
        // {id: 'Print_QRrcode', name: 'Print QR Code', icon: '👥', addLabel: 'Add QR Code'},
        // {id: 'Expired_products', name: 'Expired Products', icon: '👥', addLabel: 'Add Low_stocks'},
        // {id: 'Low_stocks', name: 'Low Stocks', icon: '👥', addLabel: 'Add Purchase'},
        // {id: 'Damage', name: 'Damages', icon: '👥', addLabel: 'Damage'},
        // {id: 'DamageStock', name: 'DamagesStock', icon: '👥', addLabel: 'Add DamageStock'},
        // {id: 'Warranties', name: 'Warranties', icon: '👥', addLabel: 'Add Warranties'},

    ];

    const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

    // const renderContent = () => {
    const renderTabContent = () => {

        const commonProps = {
            viewType,
            isAddOpen,
            setIsAddOpen,
        };

        // switch (activeSection) {
        switch (activeTab) {

            case 'product_list':
                return <ProductGrid {...commonProps} />;
            case 'Categories':
                return <CategoryGrid {...commonProps} />;
            case 'SubCategories':
                return <SubCateforyGrid {...commonProps} />;
            case 'Units':
                return <UnitGrid {...commonProps} />;
            case 'Size':
                return <SizeGrid {...commonProps} />;
            case 'Brands':
                return <BrandsGrid {...commonProps} />;
            case 'WarrantyPeriods':
                return <WarrantyPeriodsGrid {...commonProps} />;
            case 'create_product':
                return <AddPurchase {...commonProps} />;
            case 'suppliers':
                return <Suppliers {...commonProps} />;
            // case 'Damage':
            //     return <DamageProductGrid {...commonProps} />;
            // case 'DamageStock':
            //     return <DamageStockGrid {...commonProps} />;
            // case 'Low_stocks':
            //     return <ProducLowstocktGrid {...commonProps} />;
            case 'Print_Barcode':
                return <BarcodeQRList type="barcode" {...commonProps} />;
            case 'Print_QRrcode':
                return <BarcodeQRList type="qr" {...commonProps} />;
            // case 'Expired_products':
            // return <ExpiredProducts type="expire" {...commonProps} />;
            case 'Warranties':
                return <Warranties type="warranties" {...commonProps} />;
            default:
                return <PurchaseList {...commonProps} />;
        }
    };


    const location = useLocation();
    const isRootInventoryPath = location.pathname === '/inventory' || location.pathname === '/inventory/';

    return (
        <div className="h-full flex flex-col bg-gray-50">

            {/* 🔥 Top Navigation Bar (ট্যাব বেশি হলে ভেঙে নিচে নামবে, বাটন পজিশন ঠিক থাকবে) */}
            <div
                className="bg-white border-b px-4 py-3 flex flex-col md:flex-row md:items-start md:justify-between sticky top-0 z-30 shadow-sm gap-4">

                {/* Left: Tabs Loop Container (`flex-wrap` ব্যবহারের কারণে স্ক্রলবার লাগবে না, অটো নিচে নামবে) */}
                <div className="flex flex-wrap gap-2 flex-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsAddOpen(false);

                                // 💡 ম্যাজিক লাইন: ট্যাবে ক্লিক করলে যদি আমরা কোনো সাব-রুটে (ডিটেইলস পেজে) থাকি,
                                // তবে সেটিকে রিডাইরেক্ট করে মেইন স্টক পাথে নিয়ে আসবে।
                                if (!isRootInventoryPath) {
                                    navigate('/inventory');
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

                {/* Right: Dynamic Actions Group (কখনোই ভাঙবে না বা সাইজ ছোট হবে name) */}
                <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-start">
                    {/* Primary Add Button */}
                    {isRootInventoryPath && (
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
                                    {isRootInventoryPath && (
                                        <>
                                            {/* Mobile only Add button */}
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
                    {isRootInventoryPath ? renderTabContent() : <Outlet/>}
                </div>
            </div>
        </div>
    );

};

export default Inventory;



