// components/cashbox/CashboxEntry.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CashboxEntry = () => {
  const [formData, setFormData] = useState({
    type: 'income', // 'income' or 'expense'
    title: '',
    amount: '',
    description: '',
    object_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URLS = {
    income: "https://pos.myshopmym.com/api/cashbox/income/",
    expense: "https://pos.myshopmym.com/api/cashbox/expenses/"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const url = formData.type === 'income' ? API_URLS.income : API_URLS.expense;
      
      const payload = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        object_id: parseInt(formData.object_id) || 0,
      };

      await axios.post(url, payload);

      setMessage(`${formData.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
      
      // Reset form
      setFormData({
        type: 'income',
        title: '',
        amount: '',
        description: '',
        object_id: '',
      });

    } catch (error) {
      console.error("Error adding entry:", error);
      setMessage("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Entry</h1>
        <p className="text-gray-600">Add income or expense to cashbox</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'income'})}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  formData.type === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📈 Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'expense'})}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📉 Expense
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Sale Invoice #1, Purchase Invoice #2"
            />
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (৳) *
            </label>
            <input
              type="number"
              name="amount"
              required
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Object ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice/Object ID
            </label>
            <input
              type="number"
              name="object_id"
              value={formData.object_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 123"
              min="0"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional details..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
              formData.type === 'income'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Processing...
              </>
            ) : (
              `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-1">💡 Information</h3>
          <p className="text-sm text-blue-600">
            • Income adds money to cashbox<br/>
            • Expense deducts money from cashbox<br/>
            • Object ID should match the actual invoice ID in your system
          </p>
        </div>
      </div>
    </div>
  );
};

export default CashboxEntry;