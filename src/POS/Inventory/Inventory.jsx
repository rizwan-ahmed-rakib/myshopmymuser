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
    // const [activeSection, setActiveSection] = useState('product_list');
    const [activeTab, setActiveTab] = useState('product_list');

    // const menuItems = [
    const tabs = [

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

    // const renderContent = () => {
        const renderTabContent = () => {

        // switch (activeSection) {
                    switch (activeTab) {

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

    // return (
    //     <div className="flex h-full bg-gray-50">
    //         {/* Side Menu */}
    //         <div className="w-64 bg-white shadow-lg">
    //             <div className="p-4 border-b">
    //                 <h2 className="text-lg font-bold text-gray-800">Inventory Management</h2>
    //             </div>
    //             <nav className="p-4">
    //                 <ul className="space-y-2">
    //                     {menuItems.map((item) => (
    //                         <li key={item.id}>
    //                             <button
    //                               onClick={() => setActiveSection(item.id)}
    //                               className="w-full flex items-center px-2 py-2 rounded-lg transition-colors"
    //                             >
    //                               <span className="mr-3 text-lg">{item.icon}</span>
    //                               <span className="font-medium">{item.name}</span>
    //                             </button>
    //
    //                             {/*<button*/}
    //                             {/*    onClick={() => setActiveSection(item.id)}*/}
    //                             {/*    // Ekhane double quotes use kora hoyeche*/}
    //                             {/*    className="w-full flex items-center px-2 py-2 rounded-lg transition-colors"*/}
    //                             {/*>*/}
    //                             {/*    <span className="mr-3 text-lg">{item.icon}</span>*/}
    //                             {/*    <span className="font-medium">{item.name}</span>*/}
    //                             {/*</button>*/}
    //                         </li>
    //                     ))}
    //                 </ul>
    //             </nav>
    //         </div>
    //
    //         {/* Main Content */}
    //         <div className="flex-1 p-6 overflow-auto">
    //             <div className="bg-white rounded-lg shadow-md">
    //                 {renderContent()}
    //             </div>
    //         </div>
    //     </div>
    // );


    return (
        <div className="h-full flex flex-col bg-gray-50">

            {/* 🔥 Top Tabs */}
            <div className="bg-white border-b px-3 py-2">
                <div className="flex gap-2 overflow-x-auto">

                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 text-sm rounded-md whitespace-nowrap transition

              ${
                                activeTab === tab.id
                                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}

                </div>
            </div>

            {/* 🔥 Content */}
            <div className="flex-1 p-2 overflow-auto">
                <div className="bg-white rounded-md shadow-sm p-2">
                    {renderTabContent()}
                </div>
            </div>

        </div>
    );
};

export default Inventory;



// import React, { useState, useEffect } from "react";
// import PurchaseList from "./PurchaseList";
// import AddPurchase from "./AddPurchase";
// import Suppliers from "./Suppliers";
// import ProductGrid from "./ProductList/ProductGrid";
// import CategoryGrid from "./CategoryList/CategoryGrid";
// import BrandsGrid from "./BrandList/BrandsGrid";
// import SubCateforyGrid from "./SubcategoryList/SubCateforyGrid";
// import UnitGrid from "./UnitList/UnitGrid";
// import SizeGrid from "./SizeList/SizeGrid";
// import DamageProductGrid from "./DamageProductList/DamageProductGrid";
// import DamageStockGrid from "./DamageProductList/DamageStockGrid";
// import BarcodeQRList from "./BarcodeQRList";
// import ProducLowstocktGrid from "./LowStock/ProducLowstocktGrid";
// import ExpiredProducts from "./Expeired products/ExpiredProducts";
// import Warranties from "./Warranties/Warranties";
// import WarrantyPeriodsGrid from "./WarrantyPeriod/WarrantyPeriodsGrid";
//
// const Inventory = () => {
//   const [activeSection, setActiveSection] = useState(
//     () => localStorage.getItem("inventory_active_section") || "product_list"
//   );
//
//   useEffect(() => {
//     localStorage.setItem("inventory_active_section", activeSection);
//   }, [activeSection]);
//
//   const menuItems = [
//     { id: "product_list", name: "Products", icon: "📦" },
//     { id: "Categories", name: "Categories", icon: "📂" },
//     { id: "SubCategories", name: "SubCats", icon: "🗂️" },
//     { id: "Brands", name: "Brands", icon: "🏷️" },
//     { id: "Units", name: "Units", icon: "⚖️" },
//     { id: "Size", name: "Sizes", icon: "📏" },
//     { id: "WarrantyPeriods", name: "Warranty", icon: "🛡️" },
//     { id: "Print_Barcode", name: "Barcode", icon: "🔳" },
//     // { id: "Print_QRrcode", name: "QR Code", icon: "🔲" },
//     { id: "Expired_products", name: "Expired", icon: "⏳" },
//     { id: "Low_stocks", name: "Low Stock", icon: "⚠️" },
//     // { id: "Damage", name: "Damage", icon: "💥" },
//     { id: "DamageStock", name: "Damage Stock", icon: "📉" },
//     // { id: "Warranties", name: "Warranties", icon: "📜" },
//   ];
//
//   const renderContent = () => {
//     switch (activeSection) {
//       case "product_list":
//         return <ProductGrid />;
//       case "Categories":
//         return <CategoryGrid />;
//       case "SubCategories":
//         return <SubCateforyGrid />;
//       case "Units":
//         return <UnitGrid />;
//       case "Size":
//         return <SizeGrid />;
//       case "Brands":
//         return <BrandsGrid />;
//       case "WarrantyPeriods":
//         return <WarrantyPeriodsGrid />;
//       case "create_product":
//         return <AddPurchase />;
//       case "suppliers":
//         return <Suppliers />;
//       case "Damage":
//         return <DamageProductGrid />;
//       case "DamageStock":
//         return <DamageStockGrid />;
//       case "Low_stocks":
//         return <ProducLowstocktGrid />;
//       case "Print_Barcode":
//         return <BarcodeQRList type="barcode" />;
//       case "Print_QRrcode":
//         return <BarcodeQRList type="qr" />;
//       case "Expired_products":
//         return <ExpiredProducts type="expire" />;
//       case "Warranties":
//         return <Warranties type="warranties" />;
//       default:
//         return <PurchaseList />;
//     }
//   };
//
//   return (
//     <div className="h-full flex flex-col bg-gray-100">
//
//       <style>{`
//         .inv-tab-btn {
//           transition: all 0.2s ease;
//         }
//         .inv-tab-btn:hover {
//           transform: translateY(-1px);
//         }
//         .inv-tab-btn.active {
//           box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
//         }
//         .inv-scrollbar::-webkit-scrollbar {
//           height: 0px;
//         }
//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .inv-content {
//           animation: fadeSlideUp 0.25s ease both;
//         }
//       `}</style>
//
//       {/* Top Navbar */}
//       <div className="bg-white px-4 pt-3 pb-2" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
//         <div className="flex items-center gap-2 mb-3">
//           <span style={{ fontSize: "1.2rem" }}>🗃️</span>
//           <h2 className="text-base font-bold text-gray-800" style={{ letterSpacing: "-0.01em" }}>
//             Inventory
//           </h2>
//           <span className="ml-auto text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-500">
//             {menuItems.find(m => m.id === activeSection)?.name}
//           </span>
//         </div>
//
//         <div className="flex gap-1.5 overflow-x-auto inv-scrollbar pb-1">
//           {menuItems.map((item) => {
//             const isActive = activeSection === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveSection(item.id)}
//                 className={`inv-tab-btn flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg whitespace-nowrap font-medium ${
//                   isActive ? "active" : ""
//                 }`}
//                 style={
//                   isActive
//                     ? {
//                         background: "linear-gradient(135deg, #6366f1, #4f46e5)",
//                         color: "#fff",
//                       }
//                     : {
//                         background: "#f1f5f9",
//                         color: "#64748b",
//                       }
//                 }
//               >
//                 <span style={{ fontSize: "0.85rem" }}>{item.icon}</span>
//                 {item.name}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//
//       {/* Content Area */}
//       <div className="flex-1 overflow-auto">
//         <div key={activeSection} className="inv-content bg-white rounded-xl " style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)" }}>
//           {renderContent()}
//         </div>
//       </div>
//
//     </div>
//   );
// };
//
// export default Inventory;