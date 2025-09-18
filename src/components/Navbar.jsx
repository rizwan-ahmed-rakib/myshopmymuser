// import React, {useState} from "react";
// import {Link, useNavigate} from "react-router-dom";
// import {useCategory} from "../context_or_provider/CategoryContext";
//
// const Navbar = () => {
//     const {category} = useCategory();
//     const navigate = useNavigate();
//
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [activeMenu, setActiveMenu] = useState(null);
//
//     const handleMenuHover = (menu) => {
//         if (window.innerWidth >= 768) setActiveMenu(menu);
//     };
//
//     const handleMenuLeave = () => {
//         if (window.innerWidth >= 768) setActiveMenu(null);
//     };
//
//     const handleSubmenuClick = (menu) => {
//         if (window.innerWidth < 768) {
//             setActiveMenu(activeMenu === menu ? null : menu);
//         }
//     };
//
//     const handleParentClick = (cate) => {
//         navigate(`/products?category=${cate.title}`); // ✅ Navigate to category page
//         setIsMenuOpen(false); // close menu in mobile view
//     };
//
//     if (!category) return null;
//     const mainCategories = category.filter((cat) => !cat.parent);
//
//     return (
//         <nav className="max-w-7xl mx-auto top-30 left-0 w-full bg-orange-400 z-50 font-sans">
//             <div className="container mx-auto px-4 py-3 flex justify-between">
//                 {/* Mobile menu button */}
//                 <button
//                     className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
//                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                     aria-label="Toggle menu"
//                 >
//                     <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></span>
//                     <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
//                     <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></span>
//                 </button>
//
//                 {/* Menu */}
//                 <div className={`absolute md:static top-full left-0 w-full md:w-auto bg-orange-700 md:bg-transparent shadow-lg md:shadow-none ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
//                     <ul className="flex flex-col md:flex-row md:space-x-8 font-medium py-4 md:py-0">
//                         {mainCategories.map((cate) => (
//                             <li
//                                 key={cate.id}
//                                 className="relative group"
//                                 onMouseEnter={() => handleMenuHover(cate.title)}
//                                 onMouseLeave={handleMenuLeave}
//                             >
//                                 {/* Parent Category Click */}
//                                 <button
//                                     onClick={() => handleParentClick(cate)} // ✅ Navigate on click
//                                     className="w-full text-left px-6 py-3 md:py-4 text-white hover:text-blue-200 font-semibold text-lg md:w-auto"
//                                 >
//                                     {cate.title}
//                                 </button>
//
//                                 {/* Subcategories */}
//                                 {cate.children?.length > 0 && (
//                                     <ul
//                                         className={`md:absolute left-0 bg-white shadow-2xl rounded-lg mt-0 md:mt-1 w-full md:w-48 z-10 transition-all duration-300
//                                         ${activeMenu === cate.title ? "block" : "hidden"} md:group-hover:block`}
//                                     >
//                                         {cate.children.map((subcategory) => (
//                                             <li key={subcategory.id}>
//                                                 <Link
//                                                     to={`/products?category=${cate.title}&subcategory=${subcategory.title}`}
//                                                     className="block px-6 py-3 hover:bg-blue-50 text-gray-800 border-b"
//                                                     onClick={() => setIsMenuOpen(false)}
//                                                 >
//                                                     {subcategory.title}
//                                                 </Link>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     );
// };
//
// export default Navbar;

////////////////////////////////////////////

import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useCategory} from "../context_or_provider/CategoryContext";

const Navbar = () => {
    const {category} = useCategory(); // API থেকে আসা ডাটা
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const handleMenuHover = (menu) => {
        if (window.innerWidth >= 768) setActiveMenu(menu);
    };

    const handleMenuLeave = () => {
        if (window.innerWidth >= 768) setActiveMenu(null);
    };

    const handleSubmenuClick = (menu) => {
        if (window.innerWidth < 768) {
            setActiveMenu(activeMenu === menu ? null : menu);
        }
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
        setActiveMenu(null);
    };

    const handleParentClick = (cate) => {
        navigate(`/products?category=${cate.title}`);
        setIsMenuOpen(false);
    };

    if (!category) return null;

    const mainCategories = category.filter((cat) => !cat.parent);

    return (
        <nav className="max-w-7xl mx-auto sticky top-0 left-0 w-full bg-orange-400 shadow-xl z-40 font-sans">
            <div className="">
                <div className="px-4 py-3 flex justify-between items-center">
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
            <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen ? "transform rotate-45 translate-y-2" : ""
                }`}
            ></span>
                        <span
                            className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
                                isMenuOpen ? "opacity-0" : ""
                            }`}
                        ></span>
                        <span
                            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                                isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
                            }`}
                        ></span>
                    </button>

                    {/* Menu */}
                    <div
                        className={`absolute md:static top-full left-0 w-full md:w-auto bg-orange-600 md:bg-transparent shadow-lg md:shadow-none ${
                            isMenuOpen ? "block" : "hidden"
                        } md:block`}
                    >
                        <ul className="flex flex-col md:flex-row md:justify-center md:space-x-8 font-medium py-4 md:py-0">
                            {mainCategories.map((cate) => (
                                <li
                                    key={cate.id}
                                    className="relative group"
                                    onMouseEnter={() => handleMenuHover(cate)}
                                    onMouseLeave={handleMenuLeave}
                                >
                                    {/* Parent Category */}
                                    {/*<button*/}
                                    {/*  onClick={() => handleSubmenuClick(cate.title)}*/}
                                    {/*  // onClick={() => handleParentClick(cate)}*/}
                                    {/*  className="w-full text-left px-6 md:px-0 py-3 md:py-4 text-white hover:text-blue-200 font-semibold text-lg md:w-auto flex items-center justify-between md:justify-center"*/}
                                    {/*>*/}
                                    {/*  {cate.title}*/}
                                    {/*  {cate.children?.length > 0 && (*/}
                                    {/*    <svg*/}
                                    {/*      className={`ml-2 h-4 w-4 transform transition-transform md:hidden ${*/}
                                    {/*        activeMenu === cate.title ? "rotate-180" : ""*/}
                                    {/*      }`}*/}
                                    {/*      fill="none"*/}
                                    {/*      viewBox="0 0 24 24"*/}
                                    {/*      stroke="currentColor"*/}
                                    {/*    >*/}
                                    {/*      <path*/}
                                    {/*        strokeLinecap="round"*/}
                                    {/*        strokeLinejoin="round"*/}
                                    {/*        strokeWidth={2}*/}
                                    {/*        d="M19 9l-7 7-7-7"*/}
                                    {/*      />*/}
                                    {/*    </svg>*/}
                                    {/*  )}*/}
                                    {/*</button>*/}


                                    <button
                                        className="w-full text-left px-6 md:px-0 py-3 md:py-4 text-white hover:text-blue-200 font-semibold text-lg md:w-auto flex items-center justify-between md:justify-center"
                                    >
                                        {/* Parent Text */}
                                        <span
                                            onClick={() => handleParentClick(cate)} // ✅ শুধু টাইটেলে ক্লিক করলে যাবে Products পেজে
                                            className="cursor-pointer"
                                        >
    {cate.title}
  </span>

                                        {/* Arrow Icon (mobile only) */}
                                        {cate.children?.length > 0 && (
                                            <svg
                                                onClick={(e) => {
                                                    e.stopPropagation(); // parent click trigger হবে না
                                                    handleSubmenuClick(cate.title); // ✅ শুধু arrow-তে ক্লিক করলে submenu toggle হবে
                                                }}
                                                className={`ml-2 h-4 w-4 transform transition-transform md:hidden cursor-pointer ${
                                                    activeMenu === cate.title ? "rotate-180" : ""
                                                }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        )}
                                    </button>


                                    {/* Subcategories */}
                                    {cate.children?.length > 0 && (
                                        <ul
                                            className={`md:absolute left-0 bg-white shadow-2xl rounded-lg mt-0 md:mt-1 w-full md:w-52 z-10 transition-all duration-300
                        ${
                                                activeMenu === cate.title ? "block" : "hidden"
                                            } md:group-hover:block`}
                                        >
                                            {cate.children.map((sub) => (
                                                <li key={sub.id}>
                                                    <Link
                                                        to={`/products?category=${cate.title}&subcategory=${sub.title}`}
                                                        className="block px-6 py-3 hover:bg-orange-50 text-gray-800 border-b border-gray-100"
                                                        onClick={handleLinkClick}
                                                    >
                                                        {sub.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}

                            {/* Example extra static link */}
                            {/*<li>*/}
                            {/*  <Link*/}
                            {/*    to="/medicine"*/}
                            {/*    onClick={handleLinkClick}*/}
                            {/*    className="block px-6 md:px-0 py-3 md:py-4 text-white hover:text-blue-200 font-semibold text-lg text-center md:text-left"*/}
                            {/*  >*/}
                            {/*    ওষুধ*/}
                            {/*  </Link>*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
