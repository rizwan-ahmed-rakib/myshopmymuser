import React, { useState } from 'react';
import IncomeList from './IncomeList';
import AddIncome from './AddIncome';
import IncomeCategory from './IncomeCategory';

const TAB_LIST = [
    { key: 'list', label: '📋 Income List', icon: '📋' },
    { key: 'add', label: '➕ Add Income', icon: '➕' },
    { key: 'category', label: '🏷️ Categories', icon: '🏷️' },
];

const Income = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleIncomeAdded = () => {
        setActiveTab('list');
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xl shadow-md">
                        💰
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Income Management</h1>
                        <p className="text-sm text-gray-500">সকল আয়ের তথ্য পরিচালনা করুন</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 mt-4">
                    {TAB_LIST.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                activeTab === tab.key
                                    ? 'bg-green-500 text-white shadow-md shadow-green-200'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label.split(' ').slice(1).join(' ')}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === 'list' && (
                    <IncomeList key={refreshKey} />
                )}
                {activeTab === 'add' && (
                    <AddIncome onSuccess={handleIncomeAdded} />
                )}
                {activeTab === 'category' && (
                    <IncomeCategory />
                )}
            </div>
        </div>
    );
};

export default Income;
