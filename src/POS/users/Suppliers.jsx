// components/purchase/Suppliers.jsx
import React, { useState } from 'react';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([
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
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  });

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.phone) {
      const supplier = {
        id: suppliers.length + 1,
        ...newSupplier,
        balance: 0
      };
      setSuppliers([...suppliers, supplier]);
      setNewSupplier({ name: '', email: '', phone: '', address: '', status: 'Active' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-gray-600">Manage your suppliers and vendors</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Add Supplier
        </button>
      </div>

      {/* Add Supplier Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Supplier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Supplier Name"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newSupplier.status}
              onChange={(e) => setNewSupplier({...newSupplier, status: e.target.value})}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              type="text"
              placeholder="Address"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              value={newSupplier.address}
              onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddSupplier}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Save Supplier
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

      {/* Suppliers Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Supplier Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Contact Info</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Balance</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-800">{supplier.name}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <div className="text-gray-600">{supplier.email}</div>
                    <div className="text-gray-500">{supplier.phone}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{supplier.address}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${
                    supplier.balance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ৳{supplier.balance.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    supplier.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {supplier.status}
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

export default Suppliers;