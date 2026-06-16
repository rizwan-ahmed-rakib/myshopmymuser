
// components/cashbox/CashboxTransactions.jsx
import React, { useState, useEffect } from 'react';
import { posCashboxAPI } from "../../context_or_provider/pos/cashbox/cashboxAPI";

const CashboxTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Totals
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    cash: 0,
    mobile: 0,
    bank: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [cashboxRes, incomeRes, expenseRes] = await Promise.all([
        posCashboxAPI.getAllCashbox(),
        posCashboxAPI.getAllIncome(),
        posCashboxAPI.getAllExpense()
      ]);

      // Process Transactions
      const cashboxData = cashboxRes.data.map(item => ({
        ...item,
        source: 'cashbox',
        resolvedType: item.type || 'cashbox'
      }));

      const incomeData = incomeRes.data.map(item => ({
        ...item,
        source: 'income',
        resolvedType: 'in'
      }));

      const expenseData = expenseRes.data.map(item => ({
        ...item,
        source: 'expense',
        resolvedType: 'out'
      }));

      const allTransactions = [...cashboxData, ...incomeData, ...expenseData]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setTransactions(allTransactions);

      // Calculate Summary with Breakdown
      let totalInc = 0;
      let totalExp = 0;
      let netCash = 0;
      let netMobile = 0;
      let netBank = 0;

      // We use only Cashbox entries for net liquidity because they are the "source of truth" for cashflow
      // Income/Expense records also sync to cashbox, so cashbox is exhaustive.
      cashboxRes.data.forEach(tx => {
        const amt = parseFloat(tx.amount || 0);
        const cash = parseFloat(tx.paid_cash || 0);
        const mobile = parseFloat(tx.paid_mobile || 0);
        const bank = parseFloat(tx.paid_bank || 0);

        if (tx.type === 'in') {
          totalInc += amt;
          netCash += cash;
          netMobile += mobile;
          netBank += bank;
        } else if (tx.type === 'out') {
          totalExp += amt;
          netCash -= cash;
          netMobile -= mobile;
          netBank -= bank;
        }
      });

      setSummary({
        income: totalInc,
        expense: totalExp,
        balance: totalInc - totalExp,
        cash: netCash,
        mobile: netMobile,
        bank: netBank
      });

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("লেনদেন লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => `৳${parseFloat(amount || 0).toLocaleString()}`;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const isIncome = (tx) => tx.resolvedType === 'in' || tx.source === 'income';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cashbox Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time overview of your store's finances</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-xl text-white">
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Net Balance</p>
            <h3 className="text-3xl font-bold mt-1">{formatCurrency(summary.balance)}</h3>
            <div className="mt-4 flex items-center text-indigo-100 text-xs">
              <span className="bg-white/20 px-2 py-1 rounded-md">Total Liquidity</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Income Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm font-medium">Total Income</p>
            <span className="p-2 bg-green-50 text-green-600 rounded-lg text-lg">📈</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summary.income)}</h3>
          <div className="mt-2 text-xs text-green-600 font-medium">Total cash in-flow</div>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm font-medium">Total Expense</p>
            <span className="p-2 bg-red-50 text-red-600 rounded-lg text-lg">📉</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summary.expense)}</h3>
          <div className="mt-2 text-xs text-red-600 font-medium">Total cash out-flow</div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-3 text-xl">💵</div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Cash In Hand</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(summary.cash)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 mr-3 text-xl">📱</div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Mobile Banking</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(summary.mobile)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 text-xl">🏛️</div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Bank Account</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(summary.bank)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">Live Feed</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500 font-medium">Processing records...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="inline-block p-4 bg-red-50 rounded-full text-red-500 mb-4">⚠️</div>
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-5xl mb-4">💨</p>
            <p className="font-medium italic">No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((transaction) => {
              const income = isIncome(transaction);
              return (
                <div key={`${transaction.source}-${transaction.id}`} className="p-5 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${
                        income ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {income ? '📈' : '📉'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {transaction.title || transaction.reason || 'Unnamed Transaction'}
                        </p>
                        <div className="flex items-center mt-1 space-x-2 text-xs text-gray-400">
                          <span className="font-medium">{formatDate(transaction.created_at)}</span>
                          <span>•</span>
                          <span>{formatTime(transaction.created_at)}</span>
                          {transaction.payment_method && (
                            <>
                              <span>•</span>
                              <span className="uppercase font-bold text-indigo-400">{transaction.payment_method}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-extrabold ${income ? 'text-green-600' : 'text-red-600'}`}>
                        {income ? '+' : '-'}{formatCurrency(transaction.amount || 0)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                        Via {transaction.source}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">Showing all records from synchronized channels</p>
        </div>
      </div>
    </div>
  );
};

export default CashboxTransactions;