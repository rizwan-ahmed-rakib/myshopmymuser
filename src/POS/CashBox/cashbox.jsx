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
import React, { useState } from 'react';
import CashboxEntry from './CashboxEntry';
import IncomeList from './IncomeList';
import ExpenseList from './ExpenseList';
import CashboxTransactions from './CashboxTransactions';
import CashboxReport from './CashboxReport';

import BASE_URL_of_POS  from "../../posConfig";


const ENDPOINTS = {
  cashbox: `${BASE_URL_of_POS}/api/cashbox/cashbox/`,
  income: `${BASE_URL_of_POS}/api/cashbox/income/`,
  expense: `${BASE_URL_of_POS}/api/cashbox/expenses/`,
  report: `${BASE_URL_of_POS}/api/cashbox/`,
};

const Cashbox = () => {
  const [activeSection, setActiveSection] = useState('transactions');

  const menuItems = [
    { id: 'transactions', name: 'Cashbox', icon: '💰' },
    { id: 'income', name: 'Income', icon: '📈' },
    { id: 'expense', name: 'Expense', icon: '📉' },
    { id: 'add', name: 'Add Entry', icon: '➕' },
    { id: 'report', name: 'Report', icon: '📄' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'transactions':
        return <CashboxTransactions endpoints={ENDPOINTS} />;
      case 'income':
        return <IncomeList endpoints={ENDPOINTS} />;
      case 'expense':
        return <ExpenseList endpoints={ENDPOINTS} />;
      case 'add':
        return <CashboxEntry />;
      case 'report':
        return <CashboxReport endpoints={ENDPOINTS} />;
      default:
        return <CashboxTransactions endpoints={ENDPOINTS} />;
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Side Menu */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Cashbox</h2>
          <p className="text-sm text-gray-600">Manage all transactions</p>
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
        {renderContent()}
      </div>
    </div>
  );
};

export default Cashbox;