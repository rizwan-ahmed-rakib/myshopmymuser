// components/cashbox/CashboxTransactions.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CashboxTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  const API_URLS = {
    cashbox: "https://pos.myshopmym.com/api/cashbox/cashbox/",
    income: "https://pos.myshopmym.com/api/cashbox/income/",
    expense: "https://pos.myshopmym.com/api/cashbox/expenses/"
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [cashboxRes, incomeRes, expenseRes] = await Promise.all([
        axios.get(API_URLS.cashbox),
        axios.get(API_URLS.income),
        axios.get(API_URLS.expense)
      ]);

      // Combine all transactions
      const cashboxData = cashboxRes.data.map(item => ({
        ...item,
        source: 'cashbox'
      }));

      const incomeData = incomeRes.data.map(item => ({
        ...item,
        source: 'income',
        type: 'in'
      }));

      const expenseData = expenseRes.data.map(item => ({
        ...item,
        source: 'expense',
        type: 'out'
      }));

      const allTransactions = [...cashboxData, ...incomeData, ...expenseData]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setTransactions(allTransactions);

      // Calculate totals
      const totalInc = incomeRes.data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      const totalExp = expenseRes.data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      
      setTotalIncome(totalInc);
      setTotalExpense(totalExp);
      setBalance(totalInc - totalExp);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'in': return '📈';
      case 'out': return '📉';
      default: return '💰';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cashbox Transactions</h1>
        <p className="text-gray-600">View all cashbox activities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">৳{totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <span className="text-2xl">📉</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expense</p>
              <p className="text-2xl font-bold text-red-600">৳{totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ৳{balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg mr-4 ${
                      transaction.type === 'in' || transaction.source === 'income' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      <span className="text-xl">
                        {getTransactionIcon(transaction.type)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {transaction.title || transaction.reason || 'Transaction'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.created_at)} • {formatTime(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === 'in' || transaction.source === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'in' || transaction.source === 'income' ? '+' : '-'}৳{parseFloat(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {transaction.source === 'cashbox' ? 'Cashbox' : 
                       transaction.source === 'income' ? 'Income' : 'Expense'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashboxTransactions;