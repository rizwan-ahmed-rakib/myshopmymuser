// components/cashbox/IncomeList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const API_URL = "https://pos.myshopmym.com/api/cashbox/income/";

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setIncomes(response.data);
      
      // Calculate total
      const totalAmount = response.data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      setTotal(totalAmount);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const deleteIncome = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        alert("Income deleted successfully!");
        fetchIncomes(); // Refresh list
      } catch (error) {
        alert("Error deleting income");
        console.error(error);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income Records</h1>
          <p className="text-gray-600">All income transactions</p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-xl font-bold text-green-600">৳{total.toLocaleString()}</p>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading incomes...</p>
                  </td>
                </tr>
              ) : incomes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No income records found
                  </td>
                </tr>
              ) : (
                incomes.map((income) => (
                  <tr key={income.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{income.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{income.title}</div>
                      <div className="text-xs text-gray-500">
                        Invoice ID: {income.object_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                        ৳{parseFloat(income.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(income.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {income.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteIncome(income.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomeList;