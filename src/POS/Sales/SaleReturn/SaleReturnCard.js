import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {posSaleReturnAPI} from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";

const SaleReturnCard = ({product, onEdit, onDelete}) => {
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
        navigate(`/sales/sale-return/details/${product.id}`);
    };

    // The handleEdit function now simply calls the onEdit prop passed from the parent
    const handleEdit = () => {
        if (onEdit) {
            onEdit(product);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete return for invoice ${product.sale_invoice_no}?`)) {
            return;
        }

        setLoadingId(product.id);
        try {
            await posSaleReturnAPI.delete(product.id);
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete sale return.");
        } finally {
            setLoadingId(null);
        }
    };

    const formatPrice = (price) => {
        const numericPrice = Number(price)
        if (isNaN(numericPrice)) {
            return `৳0.00`;
        }
        return `৳${numericPrice.toFixed(2)}`;
    }

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">

            <div className="relative rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">

                {/* Placeholder Image / Customer Initials */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
                    {product.customer_name?.charAt(0) || 'C'}
                </div>

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
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20">
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
                                Edit Return
                            </button>

                            <div className="border-t my-1"/>

                            <button
                                onClick={handleDelete}
                                disabled={loadingId === product.id}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left disabled:opacity-50"
                            >
                                Delete Return
                            </button>
                        </div>
                    )}
                </div>

                {/* Status badge */}
                <div
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow
        ${product.payment_status === 'paid'
                        ? "bg-green-100 text-green-700"
                        : product.payment_status === 'partial'
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"}`}
                >
                    {product.payment_status || "unpaid"}
                </div>
            </div>


            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500 font-medium">Inv: #{product.sale_invoice_no}</div>
                </div>

                <h3
                    onClick={handleNameClick}
                    className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer truncate"
                >
                    {product.customer_name || "Walk-in Customer"}
                </h3>

                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">
                        {formatPrice(product.net_return_amount)}
                    </div>
                    <div className="text-sm text-red-500 font-semibold">
                        Due: {formatPrice(product.due_amount)}
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 italic truncate">
                    Reason: {product.return_reason || "Not specified"}
                </div>
            </div>
        </div>
    );
};

export default SaleReturnCard;
