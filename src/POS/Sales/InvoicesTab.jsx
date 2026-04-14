// components/sales/InvoicesTab.jsx
import React, { useState } from 'react';

const InvoicesTab = () => {
  const [invoices, setInvoices] = useState([
    { id: 'INV-001', customer: 'John Doe', amount: 25000, date: '2024-01-15', status: 'Paid' },
    { id: 'INV-002', customer: 'Jane Smith', amount: 18000, date: '2024-01-14', status: 'Pending' },
    { id: 'INV-003', customer: 'Mike Johnson', amount: 32000, date: '2024-01-13', status: 'Paid' },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Invoices</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          + Create New Invoice
        </button>
      </div>

      {/* Invoice List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left">Invoice ID</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Customer</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Amount</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2 font-semibold">{invoice.id}</td>
                <td className="border border-gray-200 px-4 py-2">{invoice.customer}</td>
                <td className="border border-gray-200 px-4 py-2">৳{invoice.amount.toLocaleString()}</td>
                <td className="border border-gray-200 px-4 py-2">{invoice.date}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    invoice.status === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Print</button>
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

export default InvoicesTab;