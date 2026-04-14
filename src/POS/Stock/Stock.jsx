// myshopPages/Stock.jsx
import React, { useState } from 'react';
import ManageStock from './ManageStock';
import StockAdjustment from './StockAdjustment';
import StockTransfer from './StockTransfer';
import EmployeeGrid from "./EmployeeList/EmployeeGrid";

const Stock = () => {
  const [activeSection, setActiveSection] = useState('manage-stock');

  const menuItems = [
    { id: 'manage-stock', name: 'Manage Stock', icon: '📦' },
    { id: 'stock-adjustment', name: 'Stock Adjustment', icon: '📊' },
    { id: 'stock-transfer', name: 'Stock Transfer', icon: '🚚' },
    { id: 'EmployeeSalaryAdvanceGrid-category', name: 'EmployeeGrid-category', icon: '🚚' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'manage-stock':
        return <ManageStock />;
      case 'EmployeeSalaryAdvanceGrid-category':
        return <EmployeeGrid />;
      case 'stock-adjustment':
        return <StockAdjustment />;
      case 'stock-transfer':
        return <StockTransfer />;
      default:
        return <ManageStock />;
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Side Menu */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Stock Management</h2>
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

export default Stock;