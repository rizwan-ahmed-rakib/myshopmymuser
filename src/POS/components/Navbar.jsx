// import React, {useState, useRef, useEffect} from "react";
// import AddNewDropdown from "./AddNewDropdown";
//
// const Navbar = () => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);
//
//   // outside click handler
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//
//   return (
//     <header className="bg-white shadow-sm border-b relative">
//       <div className="flex justify-between items-center px-6 py-4">
//
//         {/* Page Title */}
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//           <p className="text-gray-600">Welcome to your POS system</p>
//         </div>
//
//         {/* Actions */}
//         <div className="flex items-center space-x-4 relative">
//
//           {/* Add New Button */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setOpen(!open)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
//             >
//               ➕ Add New
//             </button>
//
//             {open && <AddNewDropdown />}
//           </div>
//
//           {/* Notification */}
//           <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
//             🔔
//           </button>
//
//           {/* User Info */}
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
//               <span className="text-white font-semibold">A</span>
//             </div>
//             <div>
//               <p className="font-semibold">Admin User</p>
//               <p className="text-sm text-gray-500">Owner</p>
//             </div>
//           </div>
//
//         </div>
//       </div>
//     </header>
//   );
// };
//
// export default Navbar;
//
//
// ////////////////////////////////////////
//


// components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import AddNewDropdown from "./AddNewDropdown";

const Navbar = ({ pageTitle = "POS", breadcrumb = null }) => {
  const [open, setOpen] = useState(false);
  const [notifCount] = useState(3);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-200 border-b border-slate-200 px-5 h-[60px] flex items-center justify-between relative z-20">

      {/* Left — Page Title */}
      <div>
        {breadcrumb && (
          <p className="text-[10px] font-medium text-slate-400 mb-0.5">{breadcrumb}</p>
        )}
        <h1 className="text-[20px] font-bold text-slate-900 leading-none">{pageTitle}</h1>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1.5">

        {/* Add New */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 px-3.5 py-[7px] bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-[12px] font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="8" y1="2" x2="8" y2="14"/>
              <line x1="2" y1="8" x2="14" y2="8"/>
            </svg>
            Add New
            <svg className={`w-3 h-3 opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 6 8 10 12 6"/>
            </svg>
          </button>

          {open && <AddNewDropdown onClose={() => setOpen(false)} />}
        </div>

        {/* Search */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5"/>
            <line x1="10.5" y1="10.5" x2="14" y2="14"/>
          </svg>
        </button>

        {/* Notification */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2a5 5 0 0 1 5 5v2l1 2H2l1-2V7a5 5 0 0 1 5-5z"/>
            <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
          </svg>
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white leading-none">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* User Pill */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all group">
          <div className="w-[28px] h-[28px] rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
            AR
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-medium text-slate-800 leading-tight">Admin User</p>
            <p className="text-[10px] text-slate-400">Owner</p>
          </div>
          <svg className="w-3 h-3 text-slate-300 group-hover:text-slate-400 transition-colors ml-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 6 8 10 12 6"/>
          </svg>
        </div>

      </div>
    </header>
  );
};

export default Navbar;