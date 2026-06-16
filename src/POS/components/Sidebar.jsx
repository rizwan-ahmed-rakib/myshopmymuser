// // components/Sidebar.jsx
// import React from 'react';
// import {Link, useLocation} from 'react-router-dom';
// import { usePosSettings } from '../../context_or_provider/pos/PosSettings/pos_settings_provider';
// import { useUserWithProfile } from '../../context_or_provider/pos/profile/userWithProfile';
//
// const menuSections = [
//     {
//         label: 'Main',
//         items: [
//             {path: '/dashboard', name: 'Dashboard', icon: '📊'},
//             {path: '/cashbox', name: 'Cashbox', icon: '💵'},
//             {path: '/sales', name: 'Sales', icon: '🛒', badge: '12'},
//             {path: '/purchase', name: 'Purchase', icon: '🛍️'},
//         ],
//     },
//     {
//         label: 'Manage',
//         items: [
//             {path: '/inventory', name: 'Inventory', icon: '📦'},
//             {path: '/stock', name: 'Stock', icon: '📋'},
//             {path: '/hrm', name: 'HRM', icon: '📋'},
//             {path: '/reports', name: 'Reports', icon: '📈'},
//             {path: '/Settings', name: 'Settings', icon: '⚙️'},
//             {path: '/user-role', name: 'User Role', icon: '⚙️'},
//         ],
//     },
// ];
//
// const Sidebar = () => {
//     const location = useLocation();
//     const { settings } = usePosSettings();
//     const { userWith_profile } = useUserWithProfile();
//
//     return (
//         <div className="flex flex-col w-56 h-screen bg-slate-900 text-slate-400 shrink-0">
//
//             {/* Logo */}
//             <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.08]">
//                 <div
//                     className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm overflow-hidden">
//                     {settings?.company_logo ? (
//                         <img src={settings.company_logo} alt="Logo" className="w-full h-full object-cover" />
//                     ) : (
//                         "🏪"
//                     )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-slate-100 leading-none truncate">
//                         {settings?.company_name || "POS System"}
//                     </p>
//                     <p className="text-[10px] text-slate-500 mt-1 truncate">
//                         {settings?.company_email || "Retail Management"}
//                     </p>
//                 </div>
//             </div>
//
//             {/* Nav */}
//             <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 custom-scrollbar">
//                 {menuSections.map((section) => (
//                     <div key={section.label}>
//                         <p className="text-[10px] font-medium uppercase tracking-widest text-slate-600 px-2 mb-1.5">
//                             {section.label}
//                         </p>
//                         <ul className="space-y-0.5">
//                             {section.items.map((item) => {
//                                 const isActive = location.pathname === item.path;
//                                 return (
//                                     <li key={item.path} className="relative">
//                                         {isActive && (
//                                             <span
//                                                 className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-indigo-500"/>
//                                         )}
//                                         <Link
//                                             to={item.path}
//                                             className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors duration-150 ${
//                                                 isActive
//                                                     ? 'bg-indigo-500/[0.18] text-indigo-300'
//                                                     : 'hover:bg-white/[0.06] hover:text-slate-200'
//                                             }`}
//                                         >
//                       <span
//                           className={`w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0 transition-colors ${
//                               isActive ? 'bg-indigo-500/30' : 'bg-white/5'
//                           }`}>
//                         {item.icon}
//                       </span>
//                                             <span className="flex-1">{item.name}</span>
//                                             {item.badge && (
//                                                 <span
//                                                     className="text-[10px] bg-indigo-500 text-indigo-100 px-1.5 py-0.5 rounded-full font-medium">
//                           {item.badge}
//                         </span>
//                                             )}
//                                         </Link>
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     </div>
//                 ))}
//             </nav>
//
//             {/* User footer */}
//             <div className="px-2.5 py-3 border-t border-white/[0.08]">
//                 <div
//                     className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors group">
//                     <div
//                         className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-xs font-medium text-white shrink-0 overflow-hidden ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
//                         {userWith_profile?.profile_picture ? (
//                             <img src={userWith_profile.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
//                         ) : (
//                             userWith_profile?.name?.substring(0, 2).toUpperCase() || "US"
//                         )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                         <p className="text-xs text-slate-200 font-medium leading-none truncate">
//                             {userWith_profile?.name || "User"}
//                         </p>
//                         <p className="text-[10px] text-slate-500 mt-1 truncate capitalize">
//                             {userWith_profile?.role || "Member"}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//
//         </div>
//     );
// };
//
// export default Sidebar;


// // components/Sidebar.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { usePosSettings } from '../../context_or_provider/pos/PosSettings/pos_settings_provider';
// import { useUserWithProfile } from '../../context_or_provider/pos/profile/userWithProfile';
//
// const menuSections = [
//     {
//         label: 'Main',
//         items: [
//             { path: '/dashboard', name: 'Dashboard', icon: '📊' },
//             { path: '/cashbox', name: 'Cashbox', icon: '💵' },
//             { path: '/sales', name: 'Sales', icon: '🛒', badge: '12' },
//             { path: '/purchase', name: 'Purchase', icon: '🛍️' },
//         ],
//     },
//     {
//         label: 'Manage',
//         items: [
//             { path: '/inventory', name: 'Inventory', icon: '📦' },
//             { path: '/stock', name: 'Stock', icon: '📋' },
//             { path: '/hrm', name: 'HRM', icon: '📋' },
//             { path: '/reports', name: 'Reports', icon: '📈' },
//             { path: '/Settings', name: 'Settings', icon: '⚙️' },
//             { path: '/user-role', name: 'User Role', icon: '⚙️' },
//         ],
//     },
// ];
//
// const Sidebar = () => {
//     const location = useLocation();
//     const { settings } = usePosSettings();
//     const { userWith_profile } = useUserWithProfile();
//
//     // Mobile Drawer State
//     const [isOpen, setIsOpen] = useState(false);
//
//     // কোনো লিংকে ক্লিক করে পেজ চেঞ্জ হলে মোবাইল ড্রয়ারটি অটোমেটিক বন্ধ হয়ে যাবে
//     useEffect(() => {
//         setIsOpen(false);
//     }, [location.pathname]);
//
//     return (
//         <>
//             {/* --- MOBILE HAMBURGER BUTTON --- */}
//             {/* এই বাটনটি শুধুমাত্র ছোট স্ক্রিনে (lg স্ক্রিনের নিচে) দেখা যাবে */}
//             <div className="lg:hidden fixed top-3 left-4 z-50">
//                 <button
//                     onClick={() => setIsOpen(!isOpen)}
//                     className="p-2 rounded-lg bg-slate-900 text-slate-100 hover:bg-slate-800 focus:outline-none shadow-md border border-slate-700"
//                 >
//                     {isOpen ? (
//                         // Close Icon (X)
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                     ) : (
//                         // Hamburger Icon
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                         </svg>
//                     )}
//                 </button>
//             </div>
//
//             {/* --- BACKDROP FOR MOBILE --- */}
//             {/* মোবাইলে ড্রয়ার ওপেন থাকলে পেছনের ব্যাকগ্রাউন্ড আবছা করার জন্য */}
//             {isOpen && (
//                 <div
//                     className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
//                     onClick={() => setIsOpen(false)}
//                 />
//             )}
//
//             {/* --- SIDEBAR CONTAINER --- */}
//             {/* বড় স্ক্রিনে (`lg:flex`) সব সময় থাকবে, ছোট স্ক্রিনে ড্রয়ারের মতো আচরণ করবে */}
//             <div className={`
//                 fixed inset-y-0 left-0 z-40 lg:relative lg:flex flex-col w-56 h-screen bg-slate-900 text-slate-400 shrink-0
//                 transform transition-transform duration-300 ease-in-out
//                 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//             `}>
//
//                 {/* Logo */}
//                 <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.08] pl-16 lg:pl-4">
//                     <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm overflow-hidden">
//                         {settings?.company_logo ? (
//                             <img src={settings.company_logo} alt="Logo" className="w-full h-full object-cover" />
//                         ) : (
//                             "🏪"
//                         )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-slate-100 leading-none truncate">
//                             {settings?.company_name || "POS System"}
//                         </p>
//                         <p className="text-[10px] text-slate-500 mt-1 truncate">
//                             {settings?.company_email || "Retail Management"}
//                         </p>
//                     </div>
//                 </div>
//
//                 {/* Nav */}
//                 <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 custom-scrollbar">
//                     {menuSections.map((section) => (
//                         <div key={section.label}>
//                             <p className="text-[10px] font-medium uppercase tracking-widest text-slate-600 px-2 mb-1.5">
//                                 {section.label}
//                             </p>
//                             <ul className="space-y-0.5">
//                                 {menuSections && section.items.map((item) => {
//                                     const isActive = location.pathname === item.path;
//                                     return (
//                                         <li key={item.path} className="relative">
//                                             {isActive && (
//                                                 <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-indigo-500" />
//                                             )}
//                                             <Link
//                                                 to={item.path}
//                                                 className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors duration-150 ${
//                                                     isActive
//                                                         ? 'bg-indigo-500/[0.18] text-indigo-300'
//                                                         : 'hover:bg-white/[0.06] hover:text-slate-200'
//                                                 }`}
//                                             >
//                                                 <span className={`w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0 transition-colors ${
//                                                     isActive ? 'bg-indigo-500/30' : 'bg-white/5'
//                                                 }`}>
//                                                     {item.icon}
//                                                 </span>
//                                                 <span className="flex-1">{item.name}</span>
//                                                 {item.badge && (
//                                                     <span className="text-[10px] bg-indigo-500 text-indigo-100 px-1.5 py-0.5 rounded-full font-medium">
//                                                         {item.badge}
//                                                     </span>
//                                                 )}
//                                             </Link>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
//                         </div>
//                     ))}
//                 </nav>
//
//                 {/* User footer */}
//                 <div className="px-2.5 py-3 border-t border-white/[0.08]">
//                     <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors group">
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-xs font-medium text-white shrink-0 overflow-hidden ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
//                             {userWith_profile?.profile_picture ? (
//                                 <img src={userWith_profile.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
//                             ) : (
//                                 userWith_profile?.name?.substring(0, 2).toUpperCase() || "US"
//                             )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                             <p className="text-xs text-slate-200 font-medium leading-none truncate">
//                                 {userWith_profile?.name || "User"}
//                             </p>
//                             <p className="text-[10px] text-slate-500 mt-1 truncate capitalize">
//                                 {userWith_profile?.role || "Member"}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//
//             </div>
//         </>
//     );
// };
//
// export default Sidebar;


import React, {useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {usePosSettings} from '../../context_or_provider/pos/PosSettings/pos_settings_provider';
import {useUserWithProfile} from '../../context_or_provider/pos/profile/userWithProfile';

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
            {path: '/inventory', name: 'Inventory', icon: '📦'},
            {path: '/stock', name: 'Stock', icon: '📋'},
            {path: '/hrm', name: 'HRM', icon: '📋'},
            {path: '/reports', name: 'Reports', icon: '📈'},
            {path: '/Settings', name: 'Settings', icon: '⚙️'},
            {path: '/user-role', name: 'User Role', icon: '⚙️'},
        ],
    },
];

// 'isOpen' এবং 'setIsOpen' প্রপ্স এখানে রিসিভ করা হয়েছে
const Sidebar = ({isOpen, setIsOpen}) => {
    const location = useLocation();
    const {settings} = usePosSettings();
    const {userWith_profile} = useUserWithProfile();

    // কোনো লিংকে ক্লিক করে পেজ চেঞ্জ হলে মোবাইল ড্রয়ারটি অটোমেটিক বন্ধ হয়ে যাবে
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname, setIsOpen]);

    return (
        <>
            {/* --- BACKDROP FOR MOBILE --- */}
            {/* মোবাইলে ড্রয়ার ওপেন থাকলে পেছনের ব্যাকগ্রাউন্ড আবছা করার জন্য */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300"
                    // className="lg:hidden fixed inset-0 bg-white/60 z-50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* --- SIDEBAR CONTAINER --- */}
            {/* বড় স্ক্রিনে ফিক্সড থাকবে (lg:relative), ছোট স্ক্রিনে স্লাইড ইন ড্রয়ার হবে */}

            {/*<div className={`*/}
            {/*    fixed inset-y-0 left-0 z-50 lg:relative lg:flex flex-col w-56 h-screen bg-slate-900 text-slate-400 shrink-0 shadow-2xl lg:shadow-none*/}
            {/*    transform transition-transform duration-300 ease-in-out*/}
            {/*    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}*/}
            {/*`}> */}
            <div className={`
                fixed inset-y-0 left-0 z-50 lg:relative lg:flex flex-col w-56 h-screen bg-slate-900 text-slate-400 shrink-0 shadow-2xl lg:shadow-none
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.08]">
                    <div
                        className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm overflow-hidden">
                        {settings?.company_logo ? (
                            <img src={settings.company_logo} alt="Logo" className="w-full h-full object-cover"/>
                        ) : (
                            "🏪"
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-100 leading-none truncate">
                            {settings?.company_name || "POS System"}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 truncate">
                            {settings?.company_email || "Retail Management"}
                        </p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 custom-scrollbar">
                    {menuSections.map((section) => (
                        <div key={section.label}>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-600 px-2 mb-1.5">
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
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors group">
                        <div
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-xs font-medium text-white shrink-0 overflow-hidden ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                            {userWith_profile?.profile_picture ? (
                                <img src={userWith_profile.profile_picture} alt="Avatar"
                                     className="w-full h-full object-cover"/>
                            ) : (
                                userWith_profile?.name?.substring(0, 2).toUpperCase() || "US"
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-200 font-medium leading-none truncate">
                                {userWith_profile?.name || "User"}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1 truncate capitalize">
                                {userWith_profile?.role || "Member"}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Sidebar;