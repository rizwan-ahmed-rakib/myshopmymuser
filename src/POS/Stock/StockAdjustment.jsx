// components/stock/StockAdjustment.jsx
import React, { useState } from 'react';

const StockAdjustment = () => {
  const [adjustments, setAdjustments] = useState([
    { id: 'ADJ-001', product: 'iPhone 14', type: 'Addition', quantity: 5, reason: 'New Stock', date: '2024-01-15', user: 'Admin' },
    { id: 'ADJ-002', product: 'Sony Headphones', type: 'Subtraction', quantity: 2, reason: 'Damaged', date: '2024-01-14', user: 'Manager' },
  ]);

  const [newAdjustment, setNewAdjustment] = useState({
    product: '',
    type: 'Addition',
    quantity: '',
    reason: ''
  });

  const products = [
    { id: 1, name: 'iPhone 14' },
    { id: 2, name: 'Samsung Galaxy' },
    { id: 3, name: 'Dell Laptop' },
    { id: 4, name: 'Sony Headphones' },
  ];

  const handleAddAdjustment = () => {
    if (newAdjustment.product && newAdjustment.quantity && newAdjustment.reason) {
      const adjustment = {
        id: `ADJ-00${adjustments.length + 1}`,
        ...newAdjustment,
        quantity: parseInt(newAdjustment.quantity),
        date: new Date().toISOString().split('T')[0],
        user: 'Admin'
      };
      setAdjustments([...adjustments, adjustment]);
      setNewAdjustment({ product: '', type: 'Addition', quantity: '', reason: '' });
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stock Adjustment</h1>
        <p className="text-gray-600">Add or subtract stock quantities</p>
      </div>

      {/* New Adjustment Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">New Stock Adjustment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newAdjustment.product}
            onChange={(e) => setNewAdjustment({...newAdjustment, product: e.target.value})}
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.name}>{product.name}</option>
            ))}
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newAdjustment.type}
            onChange={(e) => setNewAdjustment({...newAdjustment, type: e.target.value})}
          >
            <option value="Addition">Addition</option>
            <option value="Subtraction">Subtraction</option>
          </select>
          
          <input
            type="number"
            placeholder="Quantity"
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newAdjustment.quantity}
            onChange={(e) => setNewAdjustment({...newAdjustment, quantity: e.target.value})}
          />
          
          <input
            type="text"
            placeholder="Reason"
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newAdjustment.reason}
            onChange={(e) => setNewAdjustment({...newAdjustment, reason: e.target.value})}
          />
        </div>
        <button 
          onClick={handleAddAdjustment}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Adjustment
        </button>
      </div>

      {/* Adjustments History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Adjustment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Adjustment ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Reason</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map(adj => (
                <tr key={adj.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{adj.id}</td>
                  <td className="px-4 py-3 text-gray-600">{adj.product}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      adj.type === 'Addition' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {adj.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${
                    adj.type === 'Addition' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {adj.type === 'Addition' ? '+' : '-'}{adj.quantity}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{adj.reason}</td>
                  <td className="px-4 py-3 text-gray-600">{adj.date}</td>
                  <td className="px-4 py-3 text-gray-600">{adj.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustment;