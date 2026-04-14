import React, {useState, useRef, useEffect} from "react";
import AddNewDropdown from "./AddNewDropdown";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <div className="flex justify-between items-center px-6 py-4">

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome to your POS system</p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 relative">

          {/* Add New Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              ➕ Add New
            </button>

            {open && <AddNewDropdown />}
          </div>

          {/* Notification */}
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            🔔
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">A</span>
            </div>
            <div>
              <p className="font-semibold">Admin User</p>
              <p className="text-sm text-gray-500">Owner</p>
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