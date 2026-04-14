// 5. Dashboard Page (myshopPages/Dashboard.jsx)
import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Today's Sales</h3>
          <p className="text-2xl font-bold">৳ 25,430</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
          <p className="text-2xl font-bold">156</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Low Stock</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Pending Orders</h3>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Sales</h2>
        <p className="text-gray-600">Recent transactions will appear here...</p>
      </div>
    </div>
  );
};

export default Dashboard;