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
        <div className="w-64 bg-white shadow-lg flex flex-col h-screen border-r border-gray-200">
            {/* Logo - Fixed at top */}
            <div className="p-6 border-b border-gray-100 shrink-0 bg-white">
                <h1 className="text-xl font-black text-blue-600 tracking-tighter">POS SYSTEM</h1>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Retail Management</p>
            </div>

            {/* Menu Items - Independent scroll */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-gray-50/30">
                <ul className="space-y-1.5">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    location.pathname === item.path
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-blue-600 border border-transparent hover:border-gray-200'
                                }`}
                            >
                                <span className={`mr-3 text-lg transition-transform group-hover:scale-110 ${location.pathname === item.path ? 'opacity-100' : 'opacity-70'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-bold text-xs uppercase tracking-wide">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Optional Sidebar Footer */}
            <div className="p-4 border-t border-gray-100 text-center shrink-0 bg-white">
                <p className="text-[10px] font-bold text-gray-400">v1.2.4 © 2026</p>
            </div>
        </div>
    );
};

export default Sidebar;