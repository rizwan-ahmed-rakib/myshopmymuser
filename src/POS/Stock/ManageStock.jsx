// components/stock/ManageStock.jsx
import React, { useState } from 'react';

const ManageStock = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'iPhone 14', category: 'Electronics', currentStock: 15, lowStockAlert: 5, cost: 100000, price: 120000 },
    { id: 2, name: 'Samsung Galaxy', category: 'Electronics', currentStock: 8, lowStockAlert: 3, cost: 80000, price: 90000 },
    { id: 3, name: 'Dell Laptop', category: 'Computers', currentStock: 25, lowStockAlert: 5, cost: 60000, price: 75000 },
    { id: 4, name: 'Sony Headphones', category: 'Accessories', currentStock: 2, lowStockAlert: 10, cost: 8000, price: 12000 },
    { id: 5, name: 'MacBook Pro', category: 'Computers', currentStock: 12, lowStockAlert: 3, cost: 150000, price: 180000 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Electronics', 'Computers', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock, alertLevel) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= alertLevel) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Stock</h1>
        <p className="text-gray-600">View and manage your inventory</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Product Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Current Stock</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Low Stock Alert</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Cost Price</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Selling Price</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.currentStock, product.lowStockAlert);
              return (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{product.name}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${
                      product.currentStock <= product.lowStockAlert ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {product.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.lowStockAlert}</td>
                  <td className="px-4 py-3 text-gray-600">৳{product.cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">৳{product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${stockStatus.color}`}>
                      {stockStatus.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button className="text-green-600 hover:text-green-800 text-sm">Update Stock</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your search.
        </div>
      )}
    </div>
  );
};

export default ManageStock;