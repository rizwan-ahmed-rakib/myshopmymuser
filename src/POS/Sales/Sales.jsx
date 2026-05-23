// myshopPages/Sales.jsx (Updated with Tabs)
import React, {useState} from 'react';
import SalesTab from './SalesTab';
import InvoicesTab from './InvoicesTab';
import SalesReturnTab from './SalesReturnTab';
import QuotationsTab from './QuotationsTab';
import Customers from "./Customers";
import SaleGrid from "./SaleProduct/SaleGrid";
import CustomerGrid from "./CustomerList/CustomerGrid";
import SaleReturnGrid from "./SaleReturn/SaleReturnGrid";
import CustomerDueCollectionGrid from "./CustomerDueCollection/CustomerDueCollectionGrid";

const Sales = () => {
    const [activeTab, setActiveTab] = useState('sales');


    const tabs = [
        {id: 'sales', name: 'Sales', icon: '🛒'},
        // { id: 'invoices', name: 'Invoices', icon: '🧾' },
        {id: 'sales-return', name: 'Sales Return', icon: '↩️'},
        {id: 'customers', name: 'Customers', icon: '↩️'},
        {id: 'customers-due-collection', name: 'Customers Due Colection', icon: '📄'},
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'sales':
                // return <SalesTab />;
                return <SaleGrid/>;
            // case 'invoices':
            //   return <InvoicesTab />;
            case 'customers':
                // return <Customers />;
                return <CustomerGrid/>;
            case 'sales-return':
                // return <SalesReturnTab />;
                return <SaleReturnGrid/>;
            case 'customers-due-collection':
                return <CustomerDueCollectionGrid/>;
            default:
                // return <SalesTab />;
                return <SaleGrid/>;
        }
    };


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

export default Sales;