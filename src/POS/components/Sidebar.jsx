// 3. Sidebar Component (components/Sidebar.jsx)
import React from 'react';
import {Link, useLocation} from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        {path: '/dashboard', name: 'Dashboard', icon: '📊'},
        {path: '/cashbox', name: 'Cashbox', icon: '📊'},
        {path: '/sales', name: 'Sales', icon: '🛒'},
        {path: '/purchase', name: 'Purchase', icon: '🛍️'},
        {path: '/inventory', name: 'Inventory', icon: '📦'},
        {path: '/stock', name: 'Stock', icon: '📋'},
        {path: '/hrm', name: 'HRM', icon: '📋'},
        {path: '/crm', name: 'CRM', icon: '📋'},
        {path: '/marketing', name: 'Marketing', icon: '📋'},
        {path: '/reports', name: 'Reports', icon: '📈'},
        {path: '/branches', name: 'Branches', icon: '📈'},
        {path: '/users', name: 'Users', icon: '📈'},
        {path: '/Settings', name: 'Settings', icon: '📈'},
    ];

    return (
        <div className="w-64 bg-white shadow-lg">
            {/* Logo */}
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-blue-600">POS System</h1>
                <p className="text-sm text-gray-500">Retail Management</p>
            </div>

            {/* Menu Items */}
            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname === item.path
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;