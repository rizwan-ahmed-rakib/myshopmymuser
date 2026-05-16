// myshopPages/Sales.jsx (Updated with Tabs)
import React, { useState } from 'react';
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
    { id: 'sales', name: 'Sales', icon: '🛒' },
    { id: 'sales-return', name: 'Sales Return', icon: '↩️' },
    { id: 'customers', name: 'Customers', icon: '👥' },
    { id: 'customers-due-collection', name: 'Due Collection', icon: '📄' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sales': return <SaleGrid />;
      case 'customers': return <CustomerGrid />;
      case 'sales-return': return <SaleReturnGrid />;
      case 'customers-due-collection': return <CustomerDueCollectionGrid />;
      default: return <SaleGrid />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm pt-6 px-6 pb-2 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">SALES MANAGEMENT</h1>
            <p className="text-sm text-gray-500 font-medium">Manage transactions, customers and returns</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
             {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-2">{tab.icon}</span>
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

export default Sales;