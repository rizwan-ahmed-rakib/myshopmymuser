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
    const [activeSection, setActiveSection] = useState('product_list');

    const menuItems = [
        // { id: 'create_product', name: 'Create Product', icon: '➕' },
        {id: 'product_list', name: 'Product List', icon: '📋'},
        {id: 'Categories', name: 'Categories', icon: '👥'},
        {id: 'SubCategories', name: 'SubCategories', icon: '👥'},
        {id: 'Brands', name: 'Brands', icon: '👥'},
        {id: 'Units', name: 'Units', icon: '👥'},
        {id: 'Size', name: 'Size', icon: '👥'},
        {id: 'WarrantyPeriods', name: 'Warranty', icon: '👥'},
        {id: 'Print_Barcode', name: 'Print Barcode', icon: '👥'},
        {id: 'Print_QRrcode', name: 'Print QR Code', icon: '👥'},
        {id: 'Expired_products', name: 'Expired Products', icon: '👥'},
        {id: 'Low_stocks', name: 'Low Stocks', icon: '👥'},
        {id: 'Damage', name: 'Damages', icon: '👥'},
        {id: 'DamageStock', name: 'DamagesStock', icon: '👥'},
        {id: 'Warranties', name: 'Warranties', icon: '👥'},

    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'product_list':
                return <ProductGrid/>;
            case 'Categories':
                return <CategoryGrid/>;
            case 'SubCategories':
                return <SubCateforyGrid/>;
            case 'Units':
                return <UnitGrid/>;
            case 'Size':
                return <SizeGrid/>;
            case 'Brands':
                return <BrandsGrid/>;
            case 'WarrantyPeriods':
                return <WarrantyPeriodsGrid/>;
            case 'create_product':
                return <AddPurchase/>;
            case 'suppliers':
                return <Suppliers/>;
            case 'Damage':
                return <DamageProductGrid/>;
            case 'DamageStock':
                return <DamageStockGrid/>;
            case 'Low_stocks':
                return <ProducLowstocktGrid/>;
            case 'Print_Barcode':
                return <BarcodeQRList type="barcode"/>;
            case 'Print_QRrcode':
                return <BarcodeQRList type="qr"/>;
            case 'Expired_products':
                return <ExpiredProducts type="expire"/>;
            case 'Warranties':
                return <Warranties type="warranties"/>;
            default:
                return <PurchaseList/>;
        }
    };

    return (
        <div className="flex h-full bg-gray-50">
            {/* Side Menu */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Inventory Management</h2>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                  onClick={() => setActiveSection(item.id)}
                                  className="w-full flex items-center px-2 py-2 rounded-lg transition-colors"
                                >
                                  <span className="mr-3 text-lg">{item.icon}</span>
                                  <span className="font-medium">{item.name}</span>
                                </button>

                                {/*<button*/}
                                {/*    onClick={() => setActiveSection(item.id)}*/}
                                {/*    // Ekhane double quotes use kora hoyeche*/}
                                {/*    className="w-full flex items-center px-2 py-2 rounded-lg transition-colors"*/}
                                {/*>*/}
                                {/*    <span className="mr-3 text-lg">{item.icon}</span>*/}
                                {/*    <span className="font-medium">{item.name}</span>*/}
                                {/*</button>*/}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="bg-white rounded-lg shadow-md">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
