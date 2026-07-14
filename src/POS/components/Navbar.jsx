import React, {useState, useRef, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import AddNewDropdown from "./AddNewDropdown";
import {useUserWithProfile} from "../../context_or_provider/pos/profile/userWithProfile";
import {usePosAuth} from "../../context_or_provider/pos/PosAuth/PosAuthContext";
import CalculatorModal from "../components/CalculatorModal"; // 🌟 Step 1 er modal import korun

// 'onMenuClick' প্রপ্সটি এখানে রিসিভ করা হয়েছে
const Navbar = ({pageTitle = "POS", breadcrumb = null, onMenuClick}) => {
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifCount] = useState(3);
    const dropdownRef = useRef(null);
    const userMenuRef = useRef(null);
    const {userWith_profile} = useUserWithProfile();
    const {logout} = usePosAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isFullscreen, setIsFullscreen] = useState(false); // ফুলস্ক্রিন স্টেট ট্র্যাক করার জন্য
    // 🌟 Conditional logic: Shudhu /pos-purchase ba /pos page-e thakle show korbe
    const showCalculator = location.pathname === "/pos-purchase" || location.pathname === "/pos-sale";

    // Calculator modal open/close handling state
    const [isCalcOpen, setIsCalcOpen] = useState(false);


    // ফুলস্ক্রিন হ্যান্ডল করার ফাংশন
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => setIsFullscreen(true))
                .catch((err) => console.error("Error enabling fullscreen:", err));
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // ব্রাউজারের Esc বা অন্য কোনো উপায়ে ফুলস্ক্রিন চেঞ্জ হলে স্টেট আপডেট রাখার জন্য
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const getSidebarAndActiveTab = (pathname) => {
        const mainPaths = {
            '/dashboard': {sidebar: 'Dashboard', sub: ''},
            '/cashbox': {sidebar: 'Cashbox', sub: ''},
            '/sales': {sidebar: 'Sales', sub: ''},
            '/purchase': {sidebar: 'Purchase', sub: ''},
            '/inventory': {sidebar: 'Inventory', sub: ''},
            '/stock': {sidebar: 'Stock', sub: ''},
            '/hrm': {sidebar: 'HRM', sub: ''},
            '/reports': {sidebar: 'Reports', sub: ''},
            '/settings': {sidebar: 'Settings', sub: ''},
            '/user-role': {sidebar: 'User Role', sub: ''},
            '/pos-user-profile': {sidebar: 'Profile', sub: 'My Profile'},
            '/crm': {sidebar: 'CRM', sub: ''},
            '/marketing': {sidebar: 'Marketing', sub: ''},
            '/branches': {sidebar: 'Branches', sub: ''},
            '/users': {sidebar: 'Users', sub: ''},
        };


        const normalizedPath = pathname.toLowerCase().replace(/\/$/, '');
        if (mainPaths[normalizedPath]) {
            return mainPaths[normalizedPath];
        }

        if (normalizedPath.startsWith('/sales')) {
            if (normalizedPath.includes('/details')) return {sidebar: 'Sales', sub: 'Details'};
            if (normalizedPath.includes('/sale-return')) return {sidebar: 'Sales', sub: 'Sale Return'};
            if (normalizedPath.includes('/due-collection')) return {sidebar: 'Sales', sub: 'Due Collection'};
            if (normalizedPath.includes('/customer/profile')) return {sidebar: 'Sales', sub: 'Customer Profile'};
            return {sidebar: 'Sales', sub: ''};
        }
        if (normalizedPath.startsWith('/purchase')) {
            if (normalizedPath.includes('/purchase/details')) return {sidebar: 'Purchase', sub: 'Purchase Details'};
            if (normalizedPath.includes('/purchase-return')) return {sidebar: 'Purchase', sub: 'Purchase Return'};
            if (normalizedPath.includes('/due-payment')) return {sidebar: 'Purchase', sub: 'Due Payment'};
            if (normalizedPath.includes('/supplier/profile')) return {sidebar: 'Purchase', sub: 'Supplier Profile'};
            return {sidebar: 'Purchase', sub: ''};
        }
        if (normalizedPath.startsWith('/stock')) {
            if (normalizedPath.includes('/details')) return {sidebar: 'Stock', sub: 'Details'};
            return {sidebar: 'Stock', sub: ''};
        }
        if (normalizedPath.startsWith('/inventory')) {
            if (normalizedPath.includes('/product/details')) return {sidebar: 'Inventory', sub: 'Product Details'};
            if (normalizedPath.includes('/damage-product/details')) return {
                sidebar: 'Inventory',
                sub: 'Damage Product Details'
            };
            if (normalizedPath.includes('/category/details')) return {sidebar: 'Inventory', sub: 'Category Details'};
            if (normalizedPath.includes('/subcategory/details')) return {
                sidebar: 'Inventory',
                sub: 'Subcategory Details'
            };
            if (normalizedPath.includes('/brand/details')) return {sidebar: 'Inventory', sub: 'Brand Details'};
            if (normalizedPath.includes('/unit/details')) return {sidebar: 'Inventory', sub: 'Unit Details'};
            if (normalizedPath.includes('/size/details')) return {sidebar: 'Inventory', sub: 'Size Details'};
            return {sidebar: 'Inventory', sub: ''};
        }
        if (normalizedPath.startsWith('/hrm')) {
            if (normalizedPath.includes('/employee/profile')) return {sidebar: 'HRM', sub: 'Employee Profile'};
            if (normalizedPath.includes('/loan/details')) return {sidebar: 'HRM', sub: 'Loan Details'};
            if (normalizedPath.includes('/advance/details')) return {sidebar: 'HRM', sub: 'Advance Details'};
            if (normalizedPath.includes('/payslip/details')) return {sidebar: 'HRM', sub: 'Payslip Details'};
            if (normalizedPath.includes('/attendance/details')) return {sidebar: 'HRM', sub: 'Attendance Details'};
            if (normalizedPath.includes('/leave-application/details')) return {
                sidebar: 'HRM',
                sub: 'Leave Application Details'
            };
            return {sidebar: 'HRM', sub: ''};
        }

        const segments = pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
            const sidebar = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
            const sub = segments.length > 1 ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1) : '';
            return {sidebar, sub};
        }

        return {sidebar: '', sub: ''};
    };

    const {sidebar, sub} = getSidebarAndActiveTab(location.pathname);
    const [subTabName, setSubTabName] = useState(window.activeSubTabName || "");


    useEffect(() => {
        const handleSubTabChange = (e) => {
            setSubTabName(e.detail);
        };
        window.addEventListener('subTabChange', handleSubTabChange);
        return () => window.removeEventListener('subTabChange', handleSubTabChange);
    }, []);

    useEffect(() => {
        window.activeSubTabName = "";
        setSubTabName("");
    }, [location.pathname]);

    const finalSub = sub || subTabName;
    const titleDisplay = pageTitle === "POS" && sidebar
        // ? `POS / ${sidebar}${finalSub ? ` / ${finalSub}` : ''}`
        ? `${sidebar}${finalSub ? ` / ${finalSub}` : ''}`
        : pageTitle;

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
        <header
            className="bg-white border-b border-slate-200 px-5 h-[60px] flex items-center justify-between sticky top-0 z-40 shadow-sm">

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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>

                {/*<div>*/}
                {/*  {breadcrumb && (*/}
                {/*    <p className="text-[10px] font-medium text-slate-400 mb-0.5">{breadcrumb}</p>*/}
                {/*  )}*/}
                {/*  <h1 className="text-[20px] font-bold text-slate-900 leading-none">{titleDisplay}</h1>*/}
                {/*</div>*/}

                {/*<div>*/}
                {/*    {breadcrumb && (*/}
                {/*        <p className="text-[9px] sm:text-[11px] font-medium tracking-wider text-slate-400 uppercase mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">*/}
                {/*            {breadcrumb.replace(/\s?\/\s?/g, ' • ')} /!* স্লাশ (/) এর বদলে ডট (•) দিলে আরও ক্লিন লাগে *!/*/}
                {/*        </p>*/}
                {/*    )}*/}
                {/*    <h3 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">*/}
                {/*        {titleDisplay}*/}
                {/*    </h3>*/}
                {/*</div>*/}

                <div className="flex flex-col min-w-0">
                    {/* মোবাইল স্ক্রিনের জন্য: ব্রেডক্রাম্ব এবং টাইটেল একসাথে এক লাইনে (যেমন: Inv • Product List) */}
                    <div
                        className="block sm:hidden text-[11px] font-bold text-slate-800 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] xs:max-w-[150px]">
                        {breadcrumb ? `${breadcrumb.split(' / ').pop()} • ` : ''}{titleDisplay}
                    </div>

                    {/* বড় স্ক্রিনের জন্য (Tablet & Desktop): আগের মতো স্ট্যান্ডার্ড লেআউট */}
                    <div className="hidden sm:block">
                        {breadcrumb && (
                            <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-0.5">
                                {breadcrumb.replace(/\s?\/\s?/g, ' • ')}
                            </p>
                        )}
                        <h3 className="text-base md:text-xl font-bold text-slate-900 tracking-tight leading-none">
                            {titleDisplay}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-1.5">

                {/* Add New */}

                {/*<div className="relative" ref={dropdownRef}>*/}
                {/*    <button*/}
                {/*        onClick={() => setOpen(!open)}*/}
                {/*        className="flex items-center gap-1.5 px-3.5 py-[7px] bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-[12px] font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200"*/}
                {/*    >*/}
                {/*        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor"*/}
                {/*             strokeWidth="2.2" strokeLinecap="round">*/}
                {/*            <line x1="8" y1="2" x2="8" y2="14"/>*/}
                {/*            <line x1="2" y1="8" x2="14" y2="8"/>*/}
                {/*        </svg>*/}
                {/*        Add New*/}
                {/*        <svg*/}
                {/*            className={`w-3 h-3 opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}*/}
                {/*            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"*/}
                {/*            strokeLinecap="round" strokeLinejoin="round">*/}
                {/*            <polyline points="4 6 8 10 12 6"/>*/}
                {/*        </svg>*/}
                {/*    </button>*/}
                {/*    {open && <AddNewDropdown onClose={() => setOpen(false)}/>}*/}
                {/*</div>*/}


                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-center gap-1.5 px-2.5 py-2 sm:px-3.5 sm:py-[7px] bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-[12px] font-medium rounded-lg transition-all shadow-sm shadow-indigo-200"
                    >
                        {/* প্লাস (+) আইকন - সবসময় দেখাবে */}
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                             strokeWidth="2.2" strokeLinecap="round">
                            <line x1="8" y1="2" x2="8" y2="14"/>
                            <line x1="2" y1="8" x2="14" y2="8"/>
                        </svg>

                        {/* "Add New" টেক্সট - মোবাইলে হাইড থাকবে, বড় স্ক্রিনে (sm:) দেখা যাবে */}
                        <span className="hidden sm:inline">Add New</span>

                        {/* ডাউন অ্যারো আইকন - এটিও মোবাইলে হাইড থাকবে, বড় স্ক্রিনে দেখা যাবে */}
                        <svg
                            className={`w-3 h-3 opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""} hidden sm:block`}
                            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 6 8 10 12 6"/>
                        </svg>
                    </button>
                    {open && <AddNewDropdown onClose={() => setOpen(false)}/>}
                </div>

                {/* Search */}
                <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                         strokeWidth="1.8" strokeLinecap="round">
                        <circle cx="7" cy="7" r="4.5"/>
                        <line x1="10.5" y1="10.5" x2="14" y2="14"/>
                    </svg>
                </button>

                {/* POS Dashboard Page Button */}

                {/*<button*/}
                {/*    onClick={() => navigate("/dashboard")}*/}
                {/*    className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"*/}
                {/*    title="Dashboard Page"*/}
                {/*>*/}
                {/*    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"*/}
                {/*         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">*/}
                {/*        <rect x="2" y="2" width="5" height="5" rx="1"/>*/}
                {/*        <rect x="9" y="2" width="5" height="5" rx="1"/>*/}
                {/*        <rect x="9" y="9" width="5" height="5" rx="1"/>*/}
                {/*        <rect x="2" y="9" width="5" height="5" rx="1"/>*/}
                {/*    </svg>*/}
                {/*</button>*/}

                <button
                    onClick={() => navigate("/dashboard")}
                    className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                    title="Dashboard Page"
                >
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 13a6 6 0 1 1 12 0"/>
                        <circle cx="8" cy="13" r="1"/>
                        <path d="M8 13l3.5-3.5"/>
                    </svg>
                </button>

                {/*<button*/}
                {/*    onClick={() => navigate("/dashboard")}*/}
                {/*    className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"*/}
                {/*    title="Dashboard Page"*/}
                {/*>*/}
                {/*    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"*/}
                {/*         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">*/}
                {/*        <path d="M2 6l6-4 6 4v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6z"/>*/}
                {/*        <path d="M6 14V8h4v6"/>*/}
                {/*    </svg>*/}
                {/*</button>*/}

                {/* POS  Sale Page Button */}
                <button
                    onClick={() => navigate("/pos-sale")} // আপনার POS বিক্রির আসল রাউটটি এখানে দিন
                    className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                    title="POS Page"
                >
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="12" height="8" rx="2"/>
                        <path d="M5 13h6"/>
                        <path d="M8 11v2"/>
                    </svg>
                </button>

                {/* POS Purchase Page Button */}
                <button
                    onClick={() => navigate("/pos-purchase")} // আপনার POS বিক্রির আসল রাউটটি এখানে দিন

                    className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                    title="POS Purchase Page"
                >
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="5" cy="14" r="1"/>
                        <circle cx="12" cy="14" r="1"/>
                        <path d="M1 1h2.5l1.5 8h7l1.5-6H4"/>
                    </svg>
                </button>
                {/* POS modal calculator Button */}


            {/* 🌟 CALCULATOR BUTTON CONDITIONAL START */}
                {showCalculator && (
                    <button
                        onClick={() => setIsCalcOpen(true)}
                        className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 transition-colors border border-transparent hover:border-indigo-200"
                        title="Open POS Calculator"
                    >
                        <svg className="w-[16px] h-[16px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                             strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="2" width="10" height="12" rx="2"/>
                            <path d="M5 5h6"/>
                            <circle cx="5.5" cy="9.5" r="0.5" fill="currentColor"/>
                            <circle cx="8.5" cy="9.5" r="0.5" fill="currentColor"/>
                            <circle cx="11.5" cy="9.5" r="0.5" fill="currentColor"/>
                            <circle cx="5.5" cy="12.5" r="0.5" fill="currentColor"/>
                            <circle cx="8.5" cy="12.5" r="0.5" fill="currentColor"/>
                            <circle cx="11.5" cy="12.5" r="0.5" fill="currentColor"/>
                        </svg>
                    </button>
                )}
                {/* 🌟 CALCULATOR BUTTON CONDITIONAL END */}


                {/*/!* Full Screen Button *!/*/}
                {/*<button*/}
                {/*    className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"*/}
                {/*    title="Toggle Fullscreen"*/}
                {/*>*/}
                {/*    /!* Full Screen Maximize Icon *!/*/}
                {/*    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"*/}
                {/*         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">*/}
                {/*        <path d="M2 5V2h3M11 2h3v3M14 11v3h-3M5 14H2v-3"/>*/}
                {/*    </svg>*/}
                {/*</button>*/}


                <button
                    onClick={toggleFullscreen}
                    className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                        isFullscreen
                            ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                    title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
                >
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {isFullscreen ? (
                            /* Exit Fullscreen Icon */
                            <path d="M4 1v3H1M12 1v3h3M1 12h3v3M15 12h-3v3"/>
                        ) : (
                            /* Maximize Fullscreen Icon */
                            <path d="M2 5V2h3M11 2h3v3M14 11v3h-3M5 14H2v-3"/>
                        )}
                    </svg>
                </button>


                {/* Notification */}
                <button
                    className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 2a5 5 0 0 1 5 5v2l1 2H2l1-2V7a5 5 0 0 1 5-5z"/>
                        <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
                    </svg>
                    {notifCount > 0 && (
                        <span
                            className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white leading-none">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
                    )}
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200 mx-1"/>

                {/* User Pill with Dropdown */}
                <div className="relative" ref={userMenuRef}>
                    <div
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all group"
                    >
                        <div
                            className="w-[28px] h-[28px] rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[11px] font-semibold text-white shrink-0 overflow-hidden">
                            {userWith_profile?.profile_picture ? (
                                <img src={userWith_profile.profile_picture} alt="Avatar"
                                     className="w-full h-full object-cover"/>
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
                        <svg
                            className={`w-3 h-3 text-slate-300 group-hover:text-slate-400 transition-transform duration-200 ml-0.5 ${userMenuOpen ? "rotate-180" : ""}`}
                            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 6 8 10 12 6"/>
                        </svg>
                    </div>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                        <div
                            className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-[60] py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Signed
                                    in as</p>
                                <p className="text-[13px] font-medium text-slate-700 truncate">{userWith_profile?.email || userWith_profile?.name}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigate("/pos-user-profile");
                                    setUserMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                My Profile
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/Settings");
                                    setUserMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"/>
                                    <path
                                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                </svg>
                                Settings
                            </button>
                            <div className="h-px bg-slate-100 my-1"/>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16 17 21 12 16 7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>

            </div>
            {/* 🌟 CALCULATOR COMPONENT MOUNT */}
            <CalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)}/>
        </header>
    );
};

export default Navbar;