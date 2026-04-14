// components/cashbox/CashboxReport.jsx
import React, { useState, useEffect } from 'react';

const CashboxReport = ({ endpoints }) => {
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
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  // Fetch report data
  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${endpoints.cashbox}report/?start_date=${dateRange.start_date}&end_date=${dateRange.end_date}`);
      const data = await response.json();
      
      if (data.success) {
        setReportData(data.report);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const downloadPDF = () => {
    alert('PDF download functionality would be implemented here');
    // In production, you would generate a PDF using a library like jsPDF or make an API call
  };

  const formatCurrency = (amount) => {
    return `৳${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cashbox Report</h1>
        <p className="text-gray-600">View detailed cashbox reports and analytics</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="start_date"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.start_date}
              onChange={handleDateChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="end_date"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.end_date}
              onChange={handleDateChange}
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={fetchReport}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Generate Report
            </button>
            <button
              onClick={downloadPDF}
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
            >
              📄 Download PDF
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Generating report...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Opening Balance</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(reportData.summary.opening_balance)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-xl font-bold text-green-600">+{formatCurrency(reportData.summary.total_income)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Expense</p>
              <p className="text-xl font-bold text-red-600">-{formatCurrency(reportData.summary.total_expense)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Closing Balance</p>
              <p className="text-xl font-bold text-purple-600">{formatCurrency(reportData.summary.closing_balance)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Category Breakdown - Income */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4 text-green-600">Income by Category</h2>
              <div className="space-y-3">
                {reportData.category_breakdown.income.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{item.category}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-green-600">{formatCurrency(item.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown - Expense */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4 text-red-600">Expense by Category</h2>
              <div className="space-y-3">
                {reportData.category_breakdown.expense.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{item.category}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-red-600">{formatCurrency(item.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Transactions */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Daily Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Income</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Expense</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Net Change</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.daily_transactions.map((day, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{formatDate(day.date)}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">
                        {formatCurrency(day.income)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-red-600">
                        {formatCurrency(day.expense)}
                      </td>
                      <td className={`px-4 py-3 font-semibold ${
                        day.net_change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {day.net_change >= 0 ? '+' : ''}{formatCurrency(day.net_change)}
                      </td>
                    </tr>
                  ))}
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