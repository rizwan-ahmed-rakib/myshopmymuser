import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Search, User, ShoppingBag, X, Moon, Sun} from "lucide-react";
import Cart from "../pages/Cart";
import logo from "../assetes/logo.jpg";
import {useAbout} from "../context_or_provider/AboutContext";
import {useCart} from "../context_or_provider/CartContext";



const Header = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const {cart} = useCart();
    const {about} = useAbout();


    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);

        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <header className="max-w-7xl mx-auto bg-gray-100 w-full dark:bg-gray-800 dark:text-white">
            <div className="px-4 sm:px-6 py-1">
                <div className="flex items-center justify-between">

                    {/* Left: Search - Hidden on mobile */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Search className="text-orange-500 w-5 h-5 dark:text-orange-400"/>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 w-40 lg:w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Mobile Search Icon - Visible only on mobile */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="md:hidden"
                    >
                        <Search className="text-orange-500 w-6 h-6 dark:text-orange-400"/>
                    </button>

                    {/* Middle: Logo */}
                    <div className="flex items-center mx-2">
                        <Link to="/">
                            <img
                                src={about?.brand_logo}
                                alt="MyShop Logo"
                                className="h-16 w-auto sm:h-18 md:h-24"
                            />
                        </Link>
                    </div>

                    {/* Right: Dark Mode, Profile & Cart */}
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        {/* Dark Mode Toggle Button */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun className="text-orange-500 w-5 h-5 dark:text-orange-400"/>
                            ) : (
                                <Moon className="text-orange-500 w-5 h-5 dark:text-orange-400"/>
                            )}
                        </button>

                        <Link to="/profile" className="flex flex-col items-center group">
                            <User className="text-orange-500 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 dark:text-orange-400"/>
                            <span
                                className="hidden md:block text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition dark:text-orange-400">
                Account
              </span>
                        </Link>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="flex flex-col items-center group relative"
                        >
                            <ShoppingBag
                                className="text-orange-500 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 dark:text-orange-400"/>
                            {/* Cart Item Count Badge */}
                            {cart.length > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
                            )}
                            <span
                                className="hidden md:block text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition dark:text-orange-400">
                Cart
              </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="md:hidden mt-3 flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="border flex-1 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="text-orange-500 p-2 dark:text-orange-400"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                )}
            </div>

            {/* Cart Sidebar */}
            <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}/>
        </header>
    );
};

export default Header;