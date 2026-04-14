// components/purchase/Suppliers.jsx
import React, { useState } from 'react';

const Customers = () => {
  const [customer, setCustomer] = useState([
    { 
      id: 1, 
      name: 'ABC Electronics', 
      email: 'abc@email.com', 
      phone: '0123456789', 
      address: '123 Main Street, Dhaka',
      balance: 150000,
      status: 'Active'
    },
    { 
      id: 2, 
      name: 'XYZ Suppliers', 
      email: 'xyz@email.com', 
      phone: '0123456790', 
      address: '456 Commercial Area, Chittagong',
      balance: 75000,
      status: 'Active'
    },
    { 
      id: 3, 
      name: 'Tech World Ltd', 
      email: 'tech@email.com', 
      phone: '0123456791', 
      address: '789 Tech Zone, Sylhet',
      balance: 0,
      status: 'Inactive'
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  });

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const customer = {
        id: customer.length + 1,
        ...newCustomer,
        balance: 0
      };
      setCustomer([...customer, customer]);
      setNewCustomer({ name: '', email: '', phone: '', address: '', status: 'Active' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600">Manage your Custommers</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Add Customer
        </button>
      </div>

      {/* Add Customers Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Customer Name"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newCustomer.status}
              onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              type="text"
              placeholder="Address"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddCustomer}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Save Customer
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Custmer Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Contact Info</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Balance</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customer.map(customer => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-800">{customer.name}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <div className="text-gray-600">{customer.email}</div>
                    <div className="text-gray-500">{customer.phone}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.address}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${
                    customer.balance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ৳{customer.balance.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    customer.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">View</button>
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

export default Customers;