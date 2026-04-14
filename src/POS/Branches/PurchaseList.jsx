// components/purchase/PurchaseList.jsx
import React, { useState } from 'react';

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([
    { 
      id: 'PUR-001', 
      supplier: 'ABC Electronics', 
      products: ['iPhone 14', 'Samsung Galaxy'], 
      total: 210000, 
      date: '2024-01-15', 
      status: 'Completed',
      payment: 'Paid'
    },
    { 
      id: 'PUR-002', 
      supplier: 'XYZ Suppliers', 
      products: ['Dell Laptop', 'Sony Headphones'], 
      total: 135000, 
      date: '2024-01-14', 
      status: 'Pending',
      payment: 'Due'
    },
    { 
      id: 'PUR-003', 
      supplier: 'Tech World Ltd', 
      products: ['MacBook Pro', 'iPad Air'], 
      total: 330000, 
      date: '2024-01-13', 
      status: 'Completed',
      payment: 'Paid'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (payment) => {
    return payment === 'Paid' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchase List</h1>
        <p className="text-gray-600">View and manage all purchase orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by ID or supplier..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Export
        </button>
      </div>

      {/* Purchases Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Purchase ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Supplier</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Products</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Total Amount</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map(purchase => (
              <tr key={purchase.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-blue-600">{purchase.id}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{purchase.supplier}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-600">
                    {purchase.products.slice(0, 2).join(', ')}
                    {purchase.products.length > 2 && ` +${purchase.products.length - 2} more`}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">
                  ৳{purchase.total.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-600">{purchase.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(purchase.status)}`}>
                    {purchase.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${getPaymentColor(purchase.payment)}`}>
                    {purchase.payment}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPurchases.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No purchases found matching your search.
        </div>
      )}
    </div>
  );
};

export default PurchaseList;