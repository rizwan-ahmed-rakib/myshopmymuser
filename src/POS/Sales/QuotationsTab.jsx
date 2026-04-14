// components/sales/QuotationsTab.jsx
import React, { useState } from 'react';

const QuotationsTab = () => {
  const [quotations, setQuotations] = useState([
    { id: 'QUO-001', customer: 'ABC Corporation', total: 150000, validUntil: '2024-02-15', status: 'Sent' },
    { id: 'QUO-002', customer: 'XYZ Ltd', total: 85000, validUntil: '2024-02-10', status: 'Draft' },
  ]);

  const [newQuotation, setNewQuotation] = useState({
    customer: '',
    total: '',
    validUntil: '',
    status: 'Draft'
  });

  const handleAddQuotation = () => {
    if (newQuotation.customer && newQuotation.total) {
      const quotation = {
        id: `QUO-00${quotations.length + 1}`,
        ...newQuotation,
        total: parseInt(newQuotation.total)
      };
      setQuotations([...quotations, quotation]);
      setNewQuotation({ customer: '', total: '', validUntil: '', status: 'Draft' });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quotations</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          + Create Quotation
        </button>
      </div>

      {/* Quotations List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left">Quotation ID</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Customer</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Total Amount</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Valid Until</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map(quotation => (
              <tr key={quotation.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2 font-semibold">{quotation.id}</td>
                <td className="border border-gray-200 px-4 py-2">{quotation.customer}</td>
                <td className="border border-gray-200 px-4 py-2">৳{quotation.total.toLocaleString()}</td>
                <td className="border border-gray-200 px-4 py-2">{quotation.validUntil}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    quotation.status === 'Sent' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {quotation.status}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Send</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationsTab;