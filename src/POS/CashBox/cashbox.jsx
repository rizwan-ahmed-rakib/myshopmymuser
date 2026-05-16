// // myshopPages/Cashbox.jsx
// import React, { useState } from 'react';
// import CashboxEntry from './CashboxEntry';
// import IncomeList from './IncomeList';
// import ExpenseList from './ExpenseList';
// import CashboxTransactions from './CashboxTransactions';

// const Cashbox = () => {
//   const [activeSection, setActiveSection] = useState('transactions');

//   const menuItems = [
//     { id: 'transactions', name: 'Cashbox', icon: '💰' },
//     { id: 'income', name: 'Income', icon: '📈' },
//     { id: 'expense', name: 'Expense', icon: '📉' },
//     { id: 'add', name: 'Add Entry', icon: '➕' },
//   ];

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'transactions':
//         return <CashboxTransactions />;
//       case 'income':
//         return <IncomeList />;
//       case 'expense':
//         return <ExpenseList />;
//       case 'add':
//         return <CashboxEntry />;
//       default:
//         return <CashboxTransactions />;
//     }
//   };

//   return (
//     <div className="flex h-full bg-gray-50">
//       {/* Side Menu */}
//       <div className="w-64 bg-white shadow-lg">
//         <div className="p-4 border-b">
//           <h2 className="text-lg font-bold text-gray-800">Cashbox</h2>
//           <p className="text-sm text-gray-600">Manage all transactions</p>
//         </div>
//         <nav className="p-4">
//           <ul className="space-y-2">
//             {menuItems.map((item) => (
//               <li key={item.id}>
//                 <button
//                   onClick={() => setActiveSection(item.id)}
//                   className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
//                     activeSection === item.id
//                       ? 'bg-blue-500 text-white'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   <span className="mr-3 text-lg">{item.icon}</span>
//                   <span className="font-medium">{item.name}</span>
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-auto">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default Cashbox;








// myshopPages/Cashbox.jsx
import React, {useEffect, useState} from 'react';
import CashboxEntry from './CashboxEntry';
import IncomeList from './IncomeList';
import ExpenseList from './ExpenseList';
import CashboxTransactions from './CashboxTransactions';
import CashboxReport from './CashboxReport';
import {useNavbar} from '../../context_or_provider/pos/NavbarContext';

import BASE_URL_of_POS  from "../../posConfig";


const ENDPOINTS = {
  cashbox: `${BASE_URL_of_POS}/api/cashbox/cashbox/`,
  income: `${BASE_URL_of_POS}/api/cashbox/income/`,
  expense: `${BASE_URL_of_POS}/api/cashbox/expenses/`,
  report: `${BASE_URL_of_POS}/api/cashbox/`,
};

const Cashbox = () => {
  const [activeTab, setActiveTab] = useState('transactions');
    const {updateNavbar, resetNavbar} = useNavbar();

  const tabs = [
    { id: 'transactions', name: 'Transactions', icon: '💰' },
    { id: 'income', name: 'Income', icon: '📈' },
    { id: 'expense', name: 'Expense', icon: '📉' },
    { id: 'add', name: 'Add Entry', icon: '➕' },
    { id: 'report', name: 'Report', icon: '📄' },
  ];
    useEffect(() => {
        updateNavbar({
            title: 'cashbox MANAGEMENT',
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
      case 'transactions': return <CashboxTransactions endpoints={ENDPOINTS} />;
      case 'income': return <IncomeList endpoints={ENDPOINTS} />;
      case 'expense': return <ExpenseList endpoints={ENDPOINTS} />;
      case 'add': return <CashboxEntry />;
      case 'report': return <CashboxReport endpoints={ENDPOINTS} />;
      default: return <CashboxTransactions endpoints={ENDPOINTS} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
        {/* Sticky Header Section */}
        {/*<div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm pt-6 px-6 pb-2 border-b border-gray-200">*/}
        {/*    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">*/}
        {/*        <div>*/}
        {/*            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Cashbox Management</h1>*/}
        {/*            <p className="text-sm text-gray-500 font-medium">Monitor cash flow, income and expenses</p>*/}
        {/*        </div>*/}
        {/*        <div className="flex flex-wrap items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">*/}
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
        <div className="p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {renderTabContent()}
            </div>
        </div>
    </div>
  );
};

export default Cashbox;