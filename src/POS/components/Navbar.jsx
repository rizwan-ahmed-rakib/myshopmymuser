import React, {useState, useRef, useEffect} from "react";
import AddNewDropdown from "./AddNewDropdown";
import Inventory from "../Inventory/Inventory";
import { useNavbar } from "../../context_or_provider/pos/NavbarContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { navbarContent } = useNavbar();

  // outside click handler
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
    <header className="bg-white shadow-sm border-b relative">
      <div className="flex justify-between items-start px-6 py-4"> {/* items-start keeping right side at top */}

        {/* Left Side: Title & Tabs Section */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 flex-1 min-w-0">

          {/* Page Title */}
          <div className="flex-shrink-0 pt-0.5">
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">{navbarContent.title}</h1>
            <p className="text-gray-600 text-xs mt-0.5">{navbarContent.subtitle}</p>
          </div>

          {/* Dynamic Tabs (Extra Actions) */}
          {navbarContent.extraActions && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {navbarContent.extraActions}
            </div>
          )}
        </div>

        {/* Right Side: Global Actions (Add New, Notification, User) */}
        <div className="flex items-center space-x-4 flex-shrink-0 ml-4 pt-1">

          {/* Add New Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
            >
              ➕ Add New
            </button>

            {open && <AddNewDropdown />}
          </div>

          {/* Notification */}
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-lg">
            🔔
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-3 pl-2 border-l border-gray-100">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm text-gray-800 leading-none">Admin User</p>
              <p className="text-[10px] text-gray-500 mt-1">Owner</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;


////////////////////////////////////////

// import React, { useEffect, useRef, useState } from "react";
// import { Bell, Plus } from "lucide-react";
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
//     <header className="bg-white border-b shadow-sm relative">
//       <div className="flex justify-between items-center px-6 py-4">
//
//         {/* Title */}
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//           <p className="text-gray-600">Welcome to your POS system</p>
//         </div>
//
//         {/* Right actions */}
//         <div className="flex items-center gap-4">
//
//           {/* Add New */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setOpen(!open)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               <Plus size={18} />
//               Add New
//             </button>
//
//             {open && <AddNewDropdown onClose={() => setOpen(false)} />}
//           </div>
//
//           {/* Notification */}
//           <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
//             <Bell size={18} />
//           </button>
//
//           {/* User */}
//           <div className="flex items-center gap-3">
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

///////////////////////////////////////