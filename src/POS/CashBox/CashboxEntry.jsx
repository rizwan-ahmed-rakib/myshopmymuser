import React, { useState } from 'react';
import AddIncome from '../Income/AddIncome';
import AddExpense from '../Expense/AddExpense';

const CashboxEntry = () => {
    const [activeTab, setActiveTab] = useState('income');

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Cashbox Manual Entry</h1>
                <p className="text-sm text-gray-500">ম্যানুয়াল আয় অথবা ব্যয়ের লেনদেন ক্যাশ বক্সে এন্ট্রি করুন</p>
            </div>

            {/* Tab Switched */}
            <div className="flex gap-2 justify-center mb-6">
                <button
                    onClick={() => setActiveTab('income')}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 border-2 ${
                        activeTab === 'income'
                            ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-200'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                >
                    📈 Income Entry
                </button>
                <button
                    onClick={() => setActiveTab('expense')}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 border-2 ${
                        activeTab === 'expense'
                            ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                >
                    📉 Expense Entry
                </button>
            </div>

            {/* Form Containers */}
            <div className="bg-white rounded-2xl border border-gray-100 p-2">
                {activeTab === 'income' ? (
                    <AddIncome onSuccess={() => {}} />
                ) : (
                    <AddExpense onSuccess={() => {}} />
                )}
            </div>
        </div>
    );
};

export default CashboxEntry;