// // 3. Sidebar Component (components/Sidebar.jsx)
// import React from 'react';
// import {Link, useLocation} from 'react-router-dom';
//
// const Sidebar = () => {
//     const location = useLocation();
//
//     const menuItems = [
//         {path: '/dashboard', name: 'Dashboard', icon: '📊'},
//         {path: '/cashbox', name: 'Cashbox', icon: '📊'},
//         {path: '/sales', name: 'Sales', icon: '🛒'},
//         {path: '/purchase', name: 'Purchase', icon: '🛍️'},
//         {path: '/inventory', name: 'Inventory', icon: '📦'},
//         {path: '/stock', name: 'Stock', icon: '📋'},
//         {path: '/hrm', name: 'HRM', icon: '📋'},
//         {path: '/crm', name: 'CRM', icon: '📋'},
//         {path: '/marketing', name: 'Marketing', icon: '📋'},
//         {path: '/reports', name: 'Reports', icon: '📈'},
//         {path: '/branches', name: 'Branches', icon: '📈'},
//         {path: '/users', name: 'Users', icon: '📈'},
//         {path: '/Settings', name: 'Settings', icon: '📈'},
//     ];
//
//     return (
//         <div className="w-64 bg-white shadow-lg">
//             {/* Logo */}
//             <div className="p-4 border-b">
//                 <h1 className="text-xl font-bold text-blue-600">POS System</h1>
//                 <p className="text-sm text-gray-500">Retail Management</p>
//             </div>
//
//             {/* Menu Items */}
//             <nav className="p-4">
//                 <ul className="space-y-2">
//                     {menuItems.map((item) => (
//                         <li key={item.path}>
//                             <Link
//                                 to={item.path}
//                                 className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
//                                     location.pathname === item.path
//                                         ? 'bg-blue-500 text-white'
//                                         : 'text-gray-700 hover:bg-gray-100'
//                                 }`}
//                             >
//                                 <span className="mr-3 text-lg">{item.icon}</span>
//                                 <span className="font-medium">{item.name}</span>
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>
//         </div>
//     );
// };
//
// export default Sidebar;


// components/Sidebar.jsx
import React from 'react';
import {Link, useLocation} from 'react-router-dom';

const menuSections = [
    {
        label: 'Main',
        items: [
            {path: '/dashboard', name: 'Dashboard', icon: '📊'},
            {path: '/cashbox', name: 'Cashbox', icon: '💵'},
            {path: '/sales', name: 'Sales', icon: '🛒', badge: '12'},
            {path: '/purchase', name: 'Purchase', icon: '🛍️'},
        ],
    },
    {
        label: 'Manage',
        items: [
            // {path: '/crm', name: 'CRM', icon: '📋'},
            // {path: '/marketing', name: 'Marketing', icon: '📋'},
            // {path: '/branches', name: 'Branches', icon: '📈'},
            // {path: '/users', name: 'Users', icon: '📈'},


            {path: '/inventory', name: 'Inventory', icon: '📦'},
            {path: '/stock', name: 'Stock', icon: '📋'},
            {path: '/hrm', name: 'HRM', icon: '📋'},


            {path: '/reports', name: 'Reports', icon: '📈'},
            {path: '/Settings', name: 'Settings', icon: '⚙️'},
        ],
    },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col w-56 h-screen bg-slate-900 text-slate-400 shrink-0">

            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.08]">
                <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm">
                    🏪
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-100 leading-none">POS System</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Retail Management</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
                {menuSections.map((section) => (
                    <div key={section.label}>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-slate-600 px-2 mb-1">
                            {section.label}
                        </p>
                        <ul className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path} className="relative">
                                        {isActive && (
                                            <span
                                                className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-indigo-500"/>
                                        )}
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors duration-150 ${
                                                isActive
                                                    ? 'bg-indigo-500/[0.18] text-indigo-300'
                                                    : 'hover:bg-white/[0.06] hover:text-slate-200'
                                            }`}
                                        >
                      <span
                          className={`w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0 transition-colors ${
                              isActive ? 'bg-indigo-500/30' : 'bg-white/5'
                          }`}>
                        {item.icon}
                      </span>
                                            <span className="flex-1">{item.name}</span>
                                            {item.badge && (
                                                <span
                                                    className="text-[10px] bg-indigo-500 text-indigo-100 px-1.5 py-0.5 rounded-full font-medium">
                          {item.badge}
                        </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* User footer */}
            <div className="px-2.5 py-3 border-t border-white/[0.08]">
                <div
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors">
                    <div
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-xs font-medium text-white shrink-0">
                        AR
                    </div>
                    <div>
                        <p className="text-xs text-slate-200 font-medium leading-none">Admin User</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Super Admin</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;