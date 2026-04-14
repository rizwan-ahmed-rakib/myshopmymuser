// components/sales/SalesReturnTab.jsx
import React, { useState } from 'react';

const SalesReturnTab = () => {
  const [returns, setReturns] = useState([
    { id: 'RET-001', invoiceId: 'INV-001', product: 'iPhone 14', quantity: 1, reason: 'Defective', date: '2024-01-16' },
    { id: 'RET-002', invoiceId: 'INV-002', product: 'Samsung Galaxy', quantity: 1, reason: 'Wrong Item', date: '2024-01-15' },
  ]);

  const [newReturn, setNewReturn] = useState({
    invoiceId: '',
    product: '',
    quantity: 1,
    reason: ''
  });

  const handleAddReturn = () => {
    if (newReturn.invoiceId && newReturn.product) {
      const returnItem = {
        id: `RET-00${returns.length + 1}`,
        ...newReturn,
        date: new Date().toISOString().split('T')[0]
      };
      setReturns([...returns, returnItem]);
      setNewReturn({ invoiceId: '', product: '', quantity: 1, reason: '' });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Sales Return</h2>

      {/* Add Return Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-4">Add New Return</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Invoice ID"
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newReturn.invoiceId}
            onChange={(e) => setNewReturn({...newReturn, invoiceId: e.target.value})}
          />
          <input
            type="text"
            placeholder="Product Name"
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newReturn.product}
            onChange={(e) => setNewReturn({...newReturn, product: e.target.value})}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newReturn.quantity}
            onChange={(e) => setNewReturn({...newReturn, quantity: parseInt(e.target.value)})}
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newReturn.reason}
            onChange={(e) => setNewReturn({...newReturn, reason: e.target.value})}
          >
            <option value="">Select Reason</option>
            <option value="Defective">Defective</option>
            <option value="Wrong Item">Wrong Item</option>
            <option value="Customer Change Mind">Customer Change Mind</option>
          </select>
        </div>
        <button 
          onClick={handleAddReturn}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Return
        </button>
      </div>

      {/* Returns List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left">Return ID</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Invoice ID</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Product</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Quantity</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Reason</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(returnItem => (
              <tr key={returnItem.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2 font-semibold">{returnItem.id}</td>
                <td className="border border-gray-200 px-4 py-2">{returnItem.invoiceId}</td>
                <td className="border border-gray-200 px-4 py-2">{returnItem.product}</td>
                <td className="border border-gray-200 px-4 py-2">{returnItem.quantity}</td>
                <td className="border border-gray-200 px-4 py-2">{returnItem.reason}</td>
                <td className="border border-gray-200 px-4 py-2">{returnItem.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReturnTab;