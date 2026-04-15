// import React from 'react'
//
// const Reports = () => {
//   return (
//     <div>
//       report
//     </div>
//   )
// }
//
// export default Reports


// myshopPages/Sales.jsx (Updated with Tabs)
import React, { useState } from 'react';
import SaleGrid from "../Sales/SaleProduct/SaleGrid";
import CustomerGrid from "../Sales/CustomerList/CustomerGrid";
import SaleReturnGrid from "../Sales/SaleReturn/SaleReturnGrid";



const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');

  const tabs = [
    { id: 'sales', name: 'Sales', icon: '🛒' },
    // { id: 'invoices', name: 'Invoices', icon: '🧾' },
    { id: 'sales-return', name: 'Sales Return', icon: '↩️' },
    { id: 'customers', name: 'Customers', icon: '↩️' },
    // { id: 'quotations', name: 'Quotations', icon: '📄' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sales':
        // return <SalesTab />;
        return <SaleGrid />;
      // case 'invoices':
      //   return <InvoicesTab />;
      case 'customers':
        // return <Customers />;
        return <CustomerGrid />;
      case 'sales-return':
        // return <SalesReturnTab />;
        return <SaleReturnGrid />;
      // case 'quotations':
      //   return <QuotationsTab />;
      default:
        // return <SalesTab />;
        return <SaleGrid />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Management</h1>
        <p className="text-gray-600">Manage all sales activities</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2 text-lg">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Reports;