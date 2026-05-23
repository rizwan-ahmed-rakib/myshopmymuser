import React, { useState, useRef, useEffect } from "react";
import AddNewDropdown from "./AddNewDropdown";

const Navbar = ({ pageTitle = "POS", breadcrumb = null }) => {
  const [open, setOpen] = useState(false);
  const [notifCount] = useState(3);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // 1. ড্রপডাউন রেফারেন্স চেক
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {

        // 🔥 ম্যাজিক ট্রিক: ক্লিকটি যদি কোনো মডাল, ডায়ালগ বা মডালের ব্যাকড্রপের ভেতরে হয়, তবে ড্রপডাউন বন্ধ করা যাবে না
        const isModalClick = e.target.closest('[role="dialog"]') ||
                             e.target.closest('.modal') ||
                             e.target.closest('.fixed'); // মডালের ব্যাকড্রপ সাধারণত fixed ক্লাসের হয়

        if (isModalClick) return;

        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-5 h-[60px] flex items-center justify-between sticky top-0 z-50 shadow-sm">

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

          {/* এখানে onClose-এ সরাসরি বন্ধ না করে মডাল বন্ধ করার কন্ট্রোল AddNewDropdown কে দিচ্ছি */}
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