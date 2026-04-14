// myshopPages/Inventory.jsx
import React, { useState } from 'react';
import PurchaseList from './PurchaseList';
import AddPurchase from './AddPurchase';
import Suppliers from './Suppliers';

const Marketing = () => {
  const [activeSection, setActiveSection] = useState('purchase-list');

  const menuItems = [
    { id: 'market_visit_list', name: 'Market Visit', icon: '📋' },
    { id: 'marketing_plan', name: 'Marketing Plan', icon: '📋' },
    { id: 'ta_da', name: 'TA/DA', icon: '📋' },
    { id: 'add-purchase', name: 'Add Purchase', icon: '➕' },
    { id: 'purchase-return', name: 'Return Purchase', icon: '-' },
    { id: 'suppliers', name: 'Suppliers', icon: '👥' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'market_visit_list':
        return <PurchaseList />;
      case 'add-purchase':
        return <AddPurchase />;
      case 'marketing_plan':
        return <Suppliers />;
      case 'ta_da':
        return <Suppliers />;
      case 'suppliers':
        return <Suppliers />;

      default:
        return <PurchaseList />;
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
};

export default Marketing;