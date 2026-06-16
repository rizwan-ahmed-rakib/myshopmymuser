// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AddNewDropdown from "./AddNewDropdown";
// import { useUserWithProfile } from "../../context_or_provider/pos/profile/userWithProfile";
// import { usePosAuth } from "../../context_or_provider/pos/PosAuth/PosAuthContext";
//
// const Navbar = ({ pageTitle = "POSt", breadcrumb = null }) => {
//   const [open, setOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [notifCount] = useState(3);
//   const dropdownRef = useRef(null);
//   const userMenuRef = useRef(null);
//   const { userWith_profile } = useUserWithProfile();
//   const { logout } = usePosAuth();
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         const isModalClick = e.target.closest('[role="dialog"]') ||
//                              e.target.closest('.modal') ||
//                              e.target.closest('.fixed');
//         if (!isModalClick) setOpen(false);
//       }
//       if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
//         setUserMenuOpen(false);
//       }
//     };
//
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//
//   const handleLogout = () => {
//     logout();
//     navigate("/poslogin");
//   };
//
//
//   return (
//     <header className="bg-white border-b border-slate-200 px-5 h-[60px] flex items-center justify-between sticky top-0 z-50 shadow-sm">
//
//       {/* Left — Page Title */}
//       <div>
//         {breadcrumb && (
//           <p className="text-[10px] font-medium text-slate-400 mb-0.5">{breadcrumb}</p>
//         )}
//         <h1 className="text-[20px] font-bold text-slate-900 leading-none">{pageTitle}</h1>
//       </div>
//
//       {/* Right — Actions */}
//       <div className="flex items-center gap-1.5">
//
//         {/* Add New */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setOpen(!open)}
//             className="flex items-center gap-1.5 px-3.5 py-[7px] bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-[12px] font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200"
//           >
//             <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
//               <line x1="8" y1="2" x2="8" y2="14"/>
//               <line x1="2" y1="8" x2="14" y2="8"/>
//             </svg>
//             Add New
//             <svg className={`w-3 h-3 opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <polyline points="4 6 8 10 12 6"/>
//             </svg>
//           </button>
//           {open && <AddNewDropdown onClose={() => setOpen(false)} />}
//         </div>
//
//         {/* Search */}
//         <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
//           <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
//             <circle cx="7" cy="7" r="4.5"/>
//             <line x1="10.5" y1="10.5" x2="14" y2="14"/>
//           </svg>
//         </button>
//
//         {/* Notification */}
//         <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
//           <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M8 2a5 5 0 0 1 5 5v2l1 2H2l1-2V7a5 5 0 0 1 5-5z"/>
//             <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
//           </svg>
//           {notifCount > 0 && (
//             <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white leading-none">
//               {notifCount > 9 ? '9+' : notifCount}
//             </span>
//           )}
//         </button>
//
//         {/* Divider */}
//         <div className="w-px h-6 bg-slate-200 mx-1" />
//
//         {/* User Pill with Dropdown */}
//         <div className="relative" ref={userMenuRef}>
//           <div
//             onClick={() => setUserMenuOpen(!userMenuOpen)}
//             className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all group"
//           >
//             <div className="w-[28px] h-[28px] rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[11px] font-semibold text-white shrink-0 overflow-hidden">
//               {userWith_profile?.profile_picture ? (
//                 <img src={userWith_profile.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
//               ) : (
//                 userWith_profile?.name?.substring(0, 2).toUpperCase() || "US"
//               )}
//             </div>
//             <div className="hidden sm:block">
//               <p className="text-[12px] font-medium text-slate-800 leading-tight">
//                 {userWith_profile?.name || "User"}
//               </p>
//               <p className="text-[10px] text-slate-400 capitalize">
//                 {userWith_profile?.role || "Member"}
//               </p>
//             </div>
//             <svg className={`w-3 h-3 text-slate-300 group-hover:text-slate-400 transition-transform duration-200 ml-0.5 ${userMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <polyline points="4 6 8 10 12 6"/>
//             </svg>
//           </div>
//
//           {/* User Dropdown */}
//           {userMenuOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-[60] py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
//               <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
//                 <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
//                 <p className="text-[13px] font-medium text-slate-700 truncate">{userWith_profile?.email || userWith_profile?.name}</p>
//               </div>
//               <button
//                 onClick={() => { navigate("/pos-user-profile"); setUserMenuOpen(false); }}
//                 className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
//               >
//                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
//                 </svg>
//                 My Profile
//               </button>
//               <button
//                 onClick={() => { navigate("/Settings"); setUserMenuOpen(false); }}
//                 className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
//               >
//                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
//                 </svg>
//                 Settings
//               </button>
//               <div className="h-px bg-slate-100 my-1" />
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-500 hover:bg-rose-50 transition-colors"
//               >
//                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
//                 </svg>
//                 Sign Out
//               </button>
//             </div>
//           )}
//         </div>
//
//       </div>
//     </header>
//   );
// };
//
// export default Navbar;



import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddNewDropdown from "./AddNewDropdown";
import { useUserWithProfile } from "../../context_or_provider/pos/profile/userWithProfile";
import { usePosAuth } from "../../context_or_provider/pos/PosAuth/PosAuthContext";

// 'onMenuClick' প্রপ্সটি এখানে রিসিভ করা হয়েছে
const Navbar = ({ pageTitle = "POS", breadcrumb = null, onMenuClick }) => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifCount] = useState(3);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const { userWith_profile } = useUserWithProfile();
  const { logout } = usePosAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        const isModalClick = e.target.closest('[role="dialog"]') ||
                             e.target.closest('.modal') ||
                             e.target.closest('.fixed');
        if (!isModalClick) setOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/poslogin");
  };

  return (
    <header className="bg-white border-b border-slate-200 px-5 h-[60px] flex items-center justify-between sticky top-0 z-40 shadow-sm">

      {/* Left — Hamburger Button & Page Title */}
      <div className="flex items-center gap-2.5">

        {/* --- HAMBURGER BUTTON --- */}
        {/* এটি বড় স্ক্রিনে লুকানো থাকবে (lg:hidden), ছোট স্ক্রিনে টাইটেলের বামে আসবে */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
          aria-label="Open Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          {breadcrumb && (
            <p className="text-[10px] font-medium text-slate-400 mb-0.5">{breadcrumb}</p>
          )}
          <h1 className="text-[20px] font-bold text-slate-900 leading-none">{pageTitle}</h1>
        </div>
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

        {/* User Pill with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all group"
          >
            <div className="w-[28px] h-[28px] rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[11px] font-semibold text-white shrink-0 overflow-hidden">
              {userWith_profile?.profile_picture ? (
                <img src={userWith_profile.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userWith_profile?.name?.substring(0, 2).toUpperCase() || "US"
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-[12px] font-medium text-slate-800 leading-tight">
                {userWith_profile?.name || "User"}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {userWith_profile?.role || "Member"}
              </p>
            </div>
            <svg className={`w-3 h-3 text-slate-300 group-hover:text-slate-400 transition-transform duration-200 ml-0.5 ${userMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 6 8 10 12 6"/>
            </svg>
          </div>

          {/* User Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-[60] py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                <p className="text-[13px] font-medium text-slate-700 truncate">{userWith_profile?.email || userWith_profile?.name}</p>
              </div>
              <button
                onClick={() => { navigate("/pos-user-profile"); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                My Profile
              </button>
              <button
                onClick={() => { navigate("/Settings"); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Settings
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;