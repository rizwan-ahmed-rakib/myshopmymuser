// myshopPages/Inventory.jsx
import React, {useState, useEffect} from 'react';
import PurchaseList from './PurchaseList';
import AddPurchase from './AddPurchase';
import Suppliers from './Suppliers';
import PurchaseGrid from "./PurchaseProduct/PurchaseGrid";
import SupplierGrid from "./SupplierList/SupplierGrid";
import PurchaseReturnGrid from "./PurchaseReturn/PurchaseReturnGrid";
import SupplierDuePaymentGrid from "./SupplierDuePayment/SupplierDuePaymentGrid"
import {useNavbar} from '../../context_or_provider/pos/NavbarContext';

const Purchase = () => {
    const [activeTab, setActiveTab] = useState('posPurchase-list');
    const {updateNavbar, resetNavbar} = useNavbar();
    const tabs = [
        {id: 'posPurchase-list', name: 'Purchase List', icon: '📋'},
        {id: 'purchase-return-list', name: 'Returns', icon: '↩️'},
        {id: 'Supplier-list', name: 'Suppliers', icon: '👥'},
        {id: 'Supplier-due-payment-list', name: 'Due Payments', icon: '📄'},
    ];

    useEffect(() => {
        updateNavbar({
            title: 'PURCHASE MANAGEMENT',
            subtitle: 'Inventory replenishment and supplier relations',
            extraActions: (
                <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 p-1 rounded-xl shadow-sm border border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`flex items-center px-4 py-2 text-[10px] font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="mr-1.5">{tab.icon}</span>
                            {tab.name.toUpperCase()}
                        </button>
                    ))}
                </div>
            )
        });
        return () => resetNavbar();
    }, [activeTab]);


    const renderTabContent = () => {
        switch (activeTab) {
            case 'posPurchase-list':
                return <PurchaseGrid/>;
            case 'Supplier-list':
                return <SupplierGrid/>;
            case 'purchase-return-list':
                return <PurchaseReturnGrid/>;
            case 'Supplier-due-payment-list':
                return <SupplierDuePaymentGrid/>;
            default:
                return <PurchaseGrid/>;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Sticky Header Section */}
            {/*<div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm pt-6 px-6 pb-2 border-b border-gray-200">*/}
            {/*    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">*/}
            {/*        <div>*/}
            {/*            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Purchase*/}
            {/*                Management</h1>*/}
            {/*            <p className="text-sm text-gray-500 font-medium">Inventory replenishment and supplier*/}
            {/*                relations</p>*/}
            {/*        </div>*/}
            {/*        <div*/}
            {/*            className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">*/}
            {/*            {tabs.map((tab) => (*/}
            {/*                <button*/}
            {/*                    key={tab.id}*/}
            {/*                    className={`flex items-center px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${*/}
            {/*                        activeTab === tab.id*/}
            {/*                            ? 'bg-blue-600 text-white shadow-md'*/}
            {/*                            : 'text-gray-600 hover:bg-gray-100'*/}
            {/*                    }`}*/}
            {/*                    onClick={() => setActiveTab(tab.id)}*/}
            {/*                >*/}
            {/*                    <span className="mr-2">{tab.icon}</span>*/}
            {/*                    {tab.name.toUpperCase()}*/}
            {/*                </button>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Content Area */}
            {/*<div className="p-6">*/}
            <div className="p-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Purchase;