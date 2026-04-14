// components/stock/StockTransfer.jsx
import React, { useState } from 'react';

const StockTransfer = () => {
  const [transfers, setTransfers] = useState([
    { id: 'TRF-001', product: 'iPhone 14', from: 'Main Store', to: 'Branch A', quantity: 3, date: '2024-01-15', status: 'Completed' },
    { id: 'TRF-002', product: 'Dell Laptop', from: 'Warehouse', to: 'Main Store', quantity: 5, date: '2024-01-14', status: 'Pending' },
  ]);

  const [newTransfer, setNewTransfer] = useState({
    product: '',
    from: '',
    to: '',
    quantity: ''
  });

  const products = [
    { id: 1, name: 'iPhone 14' },
    { id: 2, name: 'Samsung Galaxy' },
    { id: 3, name: 'Dell Laptop' },
    { id: 4, name: 'Sony Headphones' },
  ];

  const locations = ['Main Store', 'Branch A', 'Branch B', 'Warehouse'];

  const handleAddTransfer = () => {
    if (newTransfer.product && newTransfer.from && newTransfer.to && newTransfer.quantity) {
      const transfer = {
        id: `TRF-00${transfers.length + 1}`,
        ...newTransfer,
        quantity: parseInt(newTransfer.quantity),
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      setTransfers([...transfers, transfer]);
      setNewTransfer({ product: '', from: '', to: '', quantity: '' });
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stock Transfer</h1>
        <p className="text-gray-600">Transfer stock between locations</p>
      </div>

      {/* New Transfer Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">New Stock Transfer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTransfer.product}
            onChange={(e) => setNewTransfer({...newTransfer, product: e.target.value})}
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.name}>{product.name}</option>
            ))}
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTransfer.from}
            onChange={(e) => setNewTransfer({...newTransfer, from: e.target.value})}
          >
            <option value="">From Location</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTransfer.to}
            onChange={(e) => setNewTransfer({...newTransfer, to: e.target.value})}
          >
            <option value="">To Location</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          
          <input
            type="number"
            placeholder="Quantity"
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTransfer.quantity}
            onChange={(e) => setNewTransfer({...newTransfer, quantity: e.target.value})}
          />
        </div>
        <button 
          onClick={handleAddTransfer}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create Transfer
        </button>
      </div>

      {/* Transfer History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Transfer History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Transfer ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">From</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">To</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(transfer => (
                <tr key={transfer.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{transfer.id}</td>
                  <td className="px-4 py-3 text-gray-600">{transfer.product}</td>
                  <td className="px-4 py-3 text-gray-600">{transfer.from}</td>
                  <td className="px-4 py-3 text-gray-600">{transfer.to}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">{transfer.quantity}</td>
                  <td className="px-4 py-3 text-gray-600">{transfer.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      transfer.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      {transfer.status === 'Pending' && (
                        <button className="text-green-600 hover:text-green-800 text-sm">Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockTransfer;