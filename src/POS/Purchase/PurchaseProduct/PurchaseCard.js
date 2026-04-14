import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {posPurchaseProductAPI} from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";

const PurchaseCard = ({product, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNameClick = () => {
        navigate(`/Purchase/purchase/details/${product.id}`);
    };

    // The handleEdit function now simply calls the onEdit prop passed from the parent
    const handleEdit = () => {
        if (onEdit) {
            onEdit(product);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            return;
        }

        setLoadingId(product.id);
        try {
            await posPurchaseProductAPI.delete(product.id);
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete product.");
        } finally {
            setLoadingId(null);
        }
    };

    const formatPrice = (price) => {
        const numericPrice = Number(price)
        if (isNaN(numericPrice)) {
            return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(0);
        }
        return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(numericPrice);
    }

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/*<div className="relative">*/}
            {/*    <img*/}
            {/*        src={product.supplier_image || "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"}*/}
            {/*        className="w-full h-48 object-cover"*/}
            {/*        alt={product.supplier_name}*/}
            {/*        onError={(e) => {*/}
            {/*            e.target.src = "https://via.placeholder.com/400x300";*/}
            {/*        }}*/}
            {/*    />*/}

            {/*    <div className="relative" ref={dropdownRef}>*/}
            {/*        <button*/}
            {/*            onClick={() => setShowDropdown(!showDropdown)}*/}
            {/*            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"*/}
            {/*        >*/}
            {/*            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
            {/*                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
            {/*                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>*/}
            {/*            </svg>*/}
            {/*        </button>*/}

            {/*        {showDropdown && (*/}
            {/*            <div*/}
            {/*                className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">*/}

            {/*                <button*/}
            {/*                    onClick={handleNameClick}*/}
            {/*                    className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"*/}
            {/*                >*/}
            {/*                    View Details*/}
            {/*                </button>*/}

            {/*                /!*<button*!/*/}
            {/*                /!*    onClick={handleEdit}*!/*/}
            {/*                /!*    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"*!/*/}
            {/*                /!*    disabled={loadingId === product.id}*!/*/}
            {/*                /!*>*!/*/}
            {/*                /!*    Edit Product*!/*/}
            {/*                /!*</button>*!/*/}
            {/*                <button*/}
            {/*                    onClick={handleDelete}*/}
            {/*                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"*/}
            {/*                    disabled={loadingId === product.id}*/}
            {/*                >*/}
            {/*                    Delete Product*/}
            {/*                </button>*/}
            {/*                <div className="border-t border-gray-100 my-1"></div>*/}
            {/*                /!*<button*!/*/}
            {/*                /!*    onClick={handleNameClick}*!/*/}
            {/*                /!*    className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"*!/*/}
            {/*                /!*>*!/*/}
            {/*                /!*    View Details*!/*/}
            {/*                /!*</button>*!/*/}

            {/*                <button*/}
            {/*                    onClick={handleEdit}*/}
            {/*                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"*/}
            {/*                    disabled={loadingId === product.id}*/}
            {/*                >*/}
            {/*                    Edit Product*/}
            {/*                </button>*/}

            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}


            {/*    <div*/}
            {/*        className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}>*/}
            {/*        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}*/}
            {/*    </div>*/}


            {/*</div>*/}


            <div className="relative rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">

                {/* Image */}
                <img
                    src={
                        product.supplier_image ||
                        "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"
                    }
                    alt={product.supplier_name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300";
                    }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"/>

                {/* Dropdown wrapper (IMPORTANT) */}
                <div
                    ref={dropdownRef}
                    className="absolute top-3 right-3"
                >
                    {/* Toggle button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // 👈 IMPORTANT
                            setShowDropdown((prev) => !prev);
                        }}
                        className="bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-white transition"
                    >
                        <svg
                            className="w-5 h-5 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01"
                            />
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {showDropdown && (
                        <div
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1">
                            <button
                                onClick={handleNameClick}
                                className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 text-left"
                            >
                                View Details
                            </button>

                            <button
                                onClick={handleEdit}
                                disabled={loadingId === product.id}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left disabled:opacity-50"
                            >
                                Edit Product
                            </button>

                            <div className="border-t my-1"/>

                            <button
                                onClick={handleDelete}
                                disabled={loadingId === product.id}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left disabled:opacity-50"
                            >
                                Delete Product
                            </button>
                        </div>
                    )}
                </div>

                {/* Stock badge */}
                <div
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow
        ${product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"}`}
                >
                    {product.stock > 0 ? `In Stock · ${product.stock}` : "Out of Stock"}
                </div>
            </div>


            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500">Code: {product.supplier_name}</div>

                    {/*<div className="relative" ref={dropdownRef}>*/}
                    {/*    <button*/}
                    {/*        onClick={() => setShowDropdown(!showDropdown)}*/}
                    {/*        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"*/}
                    {/*    >*/}
                    {/*        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                    {/*            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
                    {/*                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>*/}
                    {/*        </svg>*/}
                    {/*    </button>*/}

                    {/*    {showDropdown && (*/}
                    {/*        <div*/}
                    {/*            className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">*/}

                    {/*            <button*/}
                    {/*                onClick={handleNameClick}*/}
                    {/*                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"*/}
                    {/*            >*/}
                    {/*                View Details*/}
                    {/*            </button>*/}

                    {/*            /!*<button*!/*/}
                    {/*            /!*    onClick={handleEdit}*!/*/}
                    {/*            /!*    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"*!/*/}
                    {/*            /!*    disabled={loadingId === product.id}*!/*/}
                    {/*            /!*>*!/*/}
                    {/*            /!*    Edit Product*!/*/}
                    {/*            /!*</button>*!/*/}
                    {/*            <button*/}
                    {/*                onClick={handleDelete}*/}
                    {/*                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"*/}
                    {/*                disabled={loadingId === product.id}*/}
                    {/*            >*/}
                    {/*                Delete Product*/}
                    {/*            </button>*/}
                    {/*            <div className="border-t border-gray-100 my-1"></div>*/}
                    {/*            /!*<button*!/*/}
                    {/*            /!*    onClick={handleNameClick}*!/*/}
                    {/*            /!*    className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"*!/*/}
                    {/*            /!*>*!/*/}
                    {/*            /!*    View Details*!/*/}
                    {/*            /!*</button>*!/*/}

                    {/*            <button*/}
                    {/*                onClick={handleEdit}*/}
                    {/*                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"*/}
                    {/*                disabled={loadingId === product.id}*/}
                    {/*            >*/}
                    {/*                Edit Product*/}
                    {/*            </button>*/}

                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                </div>

                <h3
                    onClick={handleNameClick}
                    className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer truncate"
                >
                    {product.name}
                </h3>

                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">
                        {formatPrice(product.total_amount)}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                        {formatPrice(product.due_amount)}
                    </div>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                    Category: {product.supplier_name} | Brand: {product.brand}
                </div>
            </div>
        </div>
    );
};

export default PurchaseCard;
