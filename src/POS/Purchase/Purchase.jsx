// myshopPages/Inventory.jsx
import React, {useState} from 'react';
import PurchaseList from './PurchaseList';
import AddPurchase from './AddPurchase';
import Suppliers from './Suppliers';
import PurchaseGrid from "./PurchaseProduct/PurchaseGrid";
import SupplierGrid from "./SupplierList/SupplierGrid";
import PurchaseReturnGrid from "./PurchaseReturn/PurchaseReturnGrid";

const Purchase = () => {
    const [activeSection, setActiveSection] = useState('posPurchase-list');
    // const [activeTab, setActiveTab] = useState('posPurchase-list');


    const menuItems = [
    // const tabs = [
        {id: 'posPurchase-list', name: 'Purchase List', icon: '📋'},
        {id: 'purchase-return-list', name: 'Purchase Return List', icon: '📋'},
        {id: 'Supplier-list', name: 'Supplier List', icon: '👥'},

    ];

    const renderContent = () => {
    // const renderTabContent = () => {
        switch (activeSection) {
        // switch (activeTab) {
            case 'posPurchase-list':
                return <PurchaseGrid/>;
            case 'Supplier-list':
                return <SupplierGrid/>;
            case 'purchase-return-list':
                return <PurchaseReturnGrid/>;
            case 'suppliers':
                return <Suppliers/>;
            default:
                return <PurchaseList/>;
        }
    };

    return (
        <div className="flex h-full bg-gray-50">
            {/* Side Menu */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Purchase Management</h2>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        activeSection === item.id
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </button>
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


    ////////// for nav bar code ////////////////

    // return (
    //     <div className="p-6">
    //         {/* Header */}
    //         <div className="mb-6">
    //             <h1 className="text-3xl font-bold text-gray-800">Sales Management</h1>
    //             <p className="text-gray-600">Manage all sales activities</p>
    //         </div>
    //
    //         {/* Tabs */}
    //         <div className="bg-white rounded-lg shadow-md mb-6">
    //             <div className="flex border-b">
    //                 {tabs.map((tab) => (
    //                     <button
    //                         key={tab.id}
    //                         className={`flex items-center px-6 py-4 font-medium border-b-2 transition-colors ${
    //                             activeTab === tab.id
    //                                 ? 'border-blue-500 text-blue-600 bg-blue-50'
    //                                 : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    //                         }`}
    //                         onClick={() => setActiveTab(tab.id)}
    //                     >
    //                         <span className="mr-2 text-lg">{tab.icon}</span>
    //                         {tab.name}
    //                     </button>
    //                 ))}
    //             </div>
    //         </div>
    //
    //         {/* Tab Content */}
    //         <div className="bg-white rounded-lg shadow-md">
    //             {renderTabContent()}
    //         </div>
    //     </div>
    // );
};

export default Purchase;