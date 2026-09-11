import React, {useState} from 'react';
import CashboxEntry from './CashboxEntry';
// import IncomeList from './IncomeList';
// import ExpenseList from './ExpenseList';
import CashboxTransactions from './CashboxTransactions';
import CashboxReport from './CashboxReport';
import IncomeList from "../Income/IncomeList";
import ExpenseList from "../Expense/ExpenseList";
import FundTransfer from "./FundTransfer";

const Cashbox = () => {
    const [activeSection, setActiveSection] = useState('transactions');

    const menuItems = [
        {id: 'transactions', name: 'Cashbox'},
        {id: 'transfer', name: 'Fund Transfer'},

        {id: 'income', name: 'Income'},
        {id: 'expense', name: 'Expense'},
        {id: 'add', name: 'Add Entry'},
        {id: 'report', name: 'Report'},
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'transactions':
                return <CashboxTransactions/>;
            case 'transfer':
                return <FundTransfer/>;
            case 'income':
                return <IncomeList/>;
            case 'expense':
                return <ExpenseList/>;
            case 'add':
                return <CashboxEntry/>;
            case 'report':
                return <CashboxReport/>;
            default:
                return <CashboxTransactions/>;
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">

            {/* 🔥 Top Tabs */}
            <div className="bg-white border-b px-3 py-2">
                <div className="flex gap-2 overflow-x-auto">

                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`px-4 py-1.5 text-sm rounded-md whitespace-nowrap transition
              
              ${
                                activeSection === item.id
                                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {item.name}
                        </button>
                    ))}

                </div>
            </div>

            {/* 🔥 Content */}
            <div className="flex-1 p-4 overflow-auto">
                {renderContent()}
            </div>

        </div>
    );
};

export default Cashbox;