// myshopPages/Sales.jsx (Updated with Tabs)
import React, { useState, useEffect } from 'react';
import SalesTab from './SalesTab';
import InvoicesTab from './InvoicesTab';
import SalesReturnTab from './SalesReturnTab';
import QuotationsTab from './QuotationsTab';
import Customers from "./Customers";
import SaleGrid from "./SaleProduct/SaleGrid";
import CustomerGrid from "./CustomerList/CustomerGrid";
import SaleReturnGrid from "./SaleReturn/SaleReturnGrid";
import CustomerDueCollectionGrid from "./CustomerDueCollection/CustomerDueCollectionGrid";
import { useNavbar } from '../../context_or_provider/pos/NavbarContext';

const Sales = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const { updateNavbar, resetNavbar } = useNavbar();

  const tabs = [
    { id: 'sales', name: 'Sales', icon: '🛒' },
    { id: 'sales-return', name: 'Sales Return', icon: '↩️' },
    { id: 'customers', name: 'Customers', icon: '👥' },
    { id: 'customers-due-collection', name: 'Due Collection', icon: '📄' },
  ];

  useEffect(() => {
    updateNavbar({
      title: 'SALES MANAGEMENT',
      subtitle: 'Manage transactions, customers and returns',
      extraActions: (
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl shadow-sm border border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 text-[10px] font-bold rounded-lg transition-all duration-200 ${
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
      case 'sales': return <SaleGrid />;
      case 'customers': return <CustomerGrid />;
      case 'sales-return': return <SaleReturnGrid />;
      case 'customers-due-collection': return <CustomerDueCollectionGrid />;
      default: return <SaleGrid />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
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