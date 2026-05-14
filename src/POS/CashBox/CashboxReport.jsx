// components/cashbox/CashboxReport.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BASE_URL_of_POS from "../../posConfig";

const DEFAULT_ENDPOINT = `${BASE_URL_of_POS}/api/cashbox/cashbox/`;

const CashboxReport = ({ endpoints }) => {
  const reportEndpoint = endpoints?.cashbox || DEFAULT_ENDPOINT;

  const [reportData, setReportData] = useState({
    summary: {
      opening_balance: 0,
      total_income: 0,
      total_expense: 0,
      closing_balance: 0
    },
    daily_transactions: [],
    category_breakdown: {
      income: [],
      expense: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${reportEndpoint}report/`, {
        params: {
          start_date: dateRange.start_date,
          end_date: dateRange.end_date
        }
      });

      if (response.data.success) {
        setReportData(response.data.report);
      } else {
        setError('রিপোর্ট জেনারেট করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('সার্ভারের সাথে যোগাযোগ করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  }, [reportEndpoint, dateRange]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const formatCurrency = (amount) => `৳${parseFloat(amount || 0).toLocaleString()}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Report</h1>
        <p className="text-gray-500 mt-1">Detailed analysis of your store's cash flow</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">From Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all font-medium"
              value={dateRange.start_date}
              onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">To Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all font-medium"
              value={dateRange.end_date}
              onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
            />
          </div>
          <button
            onClick={fetchReport}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Generating...' : '📊 Generate Detailed Report'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500 font-bold animate-pulse">Analyzing Financial Records...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all group">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Opening</p>
              <p className="text-xl font-black text-gray-800 group-hover:text-indigo-600 transition-colors">
                {formatCurrency(reportData.summary.opening_balance)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-all group">
              <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Total Income</p>
              <p className="text-xl font-black text-green-600">
                +{formatCurrency(reportData.summary.total_income)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-red-200 transition-all group">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Total Expense</p>
              <p className="text-xl font-black text-red-600">
                -{formatCurrency(reportData.summary.total_expense)}
              </p>
            </div>
            <div className="bg-indigo-600 p-6 rounded-2xl shadow-xl shadow-indigo-100 text-white group">
              <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Net Closing</p>
              <p className="text-xl font-black">{formatCurrency(reportData.summary.closing_balance)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Income Breakdown */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                Top Income Sources
              </h2>
              <div className="space-y-6">
                {reportData.category_breakdown.income.length > 0 ? reportData.category_breakdown.income.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-gray-600 truncate max-w-[200px]">{item.category}</span>
                      <span className="text-sm font-black text-green-600">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                    <p className="text-[10px] text-right text-gray-400 font-bold uppercase">{item.percentage}% of total</p>
                  </div>
                )) : <p className="text-center text-gray-400 font-medium italic">No income data for this period</p>}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                Top Expense Categories
              </h2>
              <div className="space-y-6">
                {reportData.category_breakdown.expense.length > 0 ? reportData.category_breakdown.expense.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-gray-600 truncate max-w-[200px]">{item.category}</span>
                      <span className="text-sm font-black text-red-600">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                    <p className="text-[10px] text-right text-gray-400 font-bold uppercase">{item.percentage}% of total</p>
                  </div>
                )) : <p className="text-center text-gray-400 font-medium italic">No expense data for this period</p>}
              </div>
            </div>
          </div>

          {/* Daily Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-800">Daily Transaction Summary</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Income</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Expense</th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Net Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reportData.daily_transactions.length > 0 ? reportData.daily_transactions.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-bold text-gray-600">{formatDate(day.date)}</td>
                      <td className="px-8 py-5 text-sm font-black text-green-600">{formatCurrency(day.income)}</td>
                      <td className="px-8 py-5 text-sm font-black text-red-600">{formatCurrency(day.expense)}</td>
                      <td className={`px-8 py-5 text-sm font-black ${day.net_change >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                        {day.net_change >= 0 ? '+' : ''}{formatCurrency(day.net_change)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-10 text-center text-gray-400 font-medium italic">No activity recorded for this date range</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CashboxReport;