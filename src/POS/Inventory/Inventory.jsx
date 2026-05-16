// myshopPages/Inventory.jsx
import React, {useState} from 'react';
import PurchaseList from './PurchaseList';
import AddPurchase from './AddPurchase';
import Suppliers from './Suppliers';
import ProductGrid from "./ProductList/ProductGrid";
import CategoryGrid from "./CategoryList/CategoryGrid";
import BrandsGrid from "./BrandList/BrandsGrid";
import SubCateforyGrid from "./SubcategoryList/SubCateforyGrid";
import UnitGrid from "./UnitList/UnitGrid";
import SizeGrid from "./SizeList/SizeGrid";
import DamageProductGrid from "./DamageProductList/DamageProductGrid"
import DamageStockGrid from "./DamageProductList/DamageStockGrid";
import BarcodeQRList from './BarcodeQRList';
import ProducLowstocktGrid from "./LowStock/ProducLowstocktGrid";
import ExpiredProducts from "./Expeired products/ExpiredProducts";
import Warranties from "./Warranties/Warranties";
import WarrantyPeriodsGrid from "./WarrantyPeriod/WarrantyPeriodsGrid";

const Inventory = () => {
    const [activeTab, setActiveTab] = useState('product_list');

    const tabs = [
        {id: 'product_list', name: 'Products', icon: '📦'},
        {id: 'Categories', name: 'Categories', icon: '📁'},
        {id: 'SubCategories', name: 'Sub-Cats', icon: '📂'},
        {id: 'Brands', name: 'Brands', icon: '🏷️'},
        {id: 'Units', name: 'Units', icon: '📏'},
        {id: 'Size', name: 'Size', icon: '📐'},
        {id: 'WarrantyPeriods', name: 'Warranty', icon: '🛡️'},
        {id: 'Print_Barcode', name: 'Barcode', icon: '🏷️'},
        {id: 'Print_QRrcode', name: 'QR Code', icon: '📱'},
        {id: 'Expired_products', name: 'Expired', icon: '⚠️'},
        {id: 'Low_stocks', name: 'Low Stock', icon: '📉'},
        {id: 'DamageStock', name: 'Damages', icon: '🛠️'},
        {id: 'Warranties', name: 'Warranties', icon: '📜'},
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'product_list': return <ProductGrid/>;
            case 'Categories': return <CategoryGrid/>;
            case 'SubCategories': return <SubCateforyGrid/>;
            case 'Units': return <UnitGrid/>;
            case 'Size': return <SizeGrid/>;
            case 'Brands': return <BrandsGrid/>;
            case 'WarrantyPeriods': return <WarrantyPeriodsGrid/>;
            case 'DamageStock': return <DamageStockGrid/>;
            case 'Low_stocks': return <ProducLowstocktGrid/>;
            case 'Print_Barcode': return <BarcodeQRList type="barcode"/>;
            case 'Print_QRrcode': return <BarcodeQRList type="qr"/>;
            case 'Expired_products': return <ExpiredProducts type="expire"/>;
            case 'Warranties': return <Warranties type="warranties"/>;
            default: return <ProductGrid/>;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Sticky Header Section */}
            <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm pt-6 px-6 pb-2 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Inventory Management</h1>
                        <p className="text-sm text-gray-500 font-medium">Stock control, categories and product metadata</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`flex items-center px-3 py-1.5 text-[9px] font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="mr-1">{tab.icon}</span>
                                {tab.name.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
