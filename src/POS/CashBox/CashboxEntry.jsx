// components/cashbox/CashboxEntry.jsx
import React, { useState, useEffect } from 'react';
import { posCashboxAPI } from "../../context_or_provider/pos/cashbox/cashboxAPI";

const CashboxEntry = () => {
  const [formData, setFormData] = useState({
    type: 'income',
    title: '',
    amount: '',
    payment_method: 'cash',
    mobile_operator: '',
    paid_cash: '',
    paid_mobile: '',
    paid_bank: '',
    description: '',
    object_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Auto-calculate total for hybrid
  useEffect(() => {
    if (formData.payment_method === 'hybrid') {
      const total = (parseFloat(formData.paid_cash) || 0) + 
                    (parseFloat(formData.paid_mobile) || 0) + 
                    (parseFloat(formData.paid_bank) || 0);
      setFormData(prev => ({ ...prev, amount: total.toString() }));
    }
  }, [formData.paid_cash, formData.paid_mobile, formData.paid_bank, formData.payment_method]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const payload = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        description: formData.description || null,
        object_id: formData.object_id ? parseInt(formData.object_id) : null,
      };

      if (formData.payment_method === 'mobile_banking') {
        payload.mobile_operator = formData.mobile_operator;
      }

      if (formData.payment_method === 'hybrid') {
        payload.paid_cash = parseFloat(formData.paid_cash) || 0;
        payload.paid_mobile = parseFloat(formData.paid_mobile) || 0;
        payload.paid_bank = parseFloat(formData.paid_bank) || 0;
        payload.mobile_operator = formData.mobile_operator;
      }

      if (formData.type === 'income') {
        await posCashboxAPI.createIncome(payload);
      } else {
        await posCashboxAPI.createExpense(payload);
      }

      setMessage(`${formData.type === 'income' ? 'Income' : 'Expense'} সফলভাবে যোগ হয়েছে!`);
      setIsError(false);

      setFormData({
        type: formData.type, // keep type
        title: '',
        amount: '',
        payment_method: 'cash',
        mobile_operator: '',
        paid_cash: '',
        paid_mobile: '',
        paid_bank: '',
        description: '',
        object_id: '',
      });

    } catch (error) {
      console.error("Error adding entry:", error);
      setIsError(true);
      const errData = error.response?.data;
      if (errData && typeof errData === 'object') {
        const messages = Object.entries(errData)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
        setMessage(messages);
      } else {
        setMessage("Error: " + (error.message || "অজানা সমস্যা হয়েছে"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Add New Entry</h1>
        <p className="text-gray-500">Record a manual income or expense transaction</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <span className="mr-2">{isError ? '⚠️' : '✅'}</span>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              className={`py-4 rounded-xl font-bold flex items-center justify-center transition-all ${
                formData.type === 'income' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2 text-xl">📈</span> Income
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              className={`py-4 rounded-xl font-bold flex items-center justify-center transition-all ${
                formData.type === 'expense' ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2 text-xl">📉</span> Expense
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all"
                placeholder="e.g., Office Rent, Daily Sales"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method *</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all"
              >
                <option value="cash">Cash</option>
                <option value="mobile_banking">Mobile Banking</option>
                <option value="bank">Bank</option>
                <option value="hybrid">Hybrid (Mixed)</option>
              </select>
            </div>

            {(formData.payment_method === 'mobile_banking' || formData.payment_method === 'hybrid') && (
              <div className="col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Operator</label>
                <select
                  name="mobile_operator"
                  value={formData.mobile_operator}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all"
                >
                  <option value="">Select Operator</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="upay">Upay</option>
                </select>
              </div>
            )}

            {formData.payment_method !== 'hybrid' ? (
              <div className="col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Amount (৳) *</label>
                <input
                  type="number"
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all font-bold text-lg"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div>
                  <label className="block text-xs font-bold text-indigo-600 mb-1">Cash Part (৳)</label>
                  <input
                    type="number"
                    name="paid_cash"
                    value={formData.paid_cash}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-transparent rounded-lg focus:border-indigo-500 focus:ring-0 transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-600 mb-1">Mobile Part (৳)</label>
                  <input
                    type="number"
                    name="paid_mobile"
                    value={formData.paid_mobile}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-transparent rounded-lg focus:border-indigo-500 focus:ring-0 transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-600 mb-1">Bank Part (৳)</label>
                  <input
                    type="number"
                    name="paid_bank"
                    value={formData.paid_bank}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-transparent rounded-lg focus:border-indigo-500 focus:ring-0 transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-full pt-2 border-t border-indigo-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-400 uppercase">Calculated Total</span>
                  <span className="text-lg font-black text-indigo-700">৳ {formData.amount}</span>
                </div>
              </div>
            )}

            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Invoice ID (Optional)</label>
              <input
                type="number"
                name="object_id"
                value={formData.object_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all"
                placeholder="ID"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all"
                placeholder="Details about this transaction..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-extrabold text-white transition-all transform active:scale-[0.98] ${
              formData.type === 'income' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-xl shadow-indigo-100'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                Processing...
              </span>
            ) : (
              `Complete ${formData.type === 'income' ? 'Income' : 'Expense'} Entry`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CashboxEntry;