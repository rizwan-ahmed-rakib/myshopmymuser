import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {posPurchaseReturnAPI} from "../../../context_or_provider/pos/Purchase/purchaseReturnProduct/purchaseReturnAPI";

const PurchaseReturnCard = ({item, onEdit, onDelete}) => {
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
        navigate(`/Purchase/purchase-return/details/${item.id}`);
    };

    // The handleEdit function now simply calls the onEdit prop passed from the parent
    const handleEdit = () => {
        if (onEdit) {
            onEdit(item);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete return for invoice #${item.purchase_invoice_no}?`)) {
            return;
        }

        setLoadingId(item.id);
        try {
            await posPurchaseReturnAPI.delete(item.id);
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete purchase return.");
        } finally {
            setLoadingId(null);
        }
    };

    const formatPrice = (price) => {
        const numericPrice = Number(price)
        if (isNaN(numericPrice)) {
            return new Intl.NumberFormat('en-BD', {style: 'currency', currency: 'BDT'}).format(0);
        }
        return new Intl.NumberFormat('en-BD', {style: 'currency', currency: 'BDT'}).format(numericPrice);
    }

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            
            <div className="relative rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">

                {/* Image */}
                <img
                    src={
                        item.supplier_image ||
                        "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"
                    }
                    alt={item.supplier_name}
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
                                disabled={loadingId === item.id}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left disabled:opacity-50"
                            >
                                Edit Return
                            </button>

                            <div className="border-t my-1"/>

                            <button
                                onClick={handleDelete}
                                disabled={loadingId === item.id}
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
                    ${item.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 
                      item.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}
                >
                    {item.payment_status?.toUpperCase()}
                </div>
            </div>


            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500">Invoice: #{item.purchase_invoice_no}</div>
                </div>

                <h3
                    onClick={handleNameClick}
                    className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer truncate"
                >
                    {item.supplier_name}
                </h3>

                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">
                        ৳{item.total_return_amount}
                    </div>
                    <div className="text-sm text-red-500">
                        Due: ৳{item.due_amount}
                    </div>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                    Method: {item.payment_method || 'N/A'} | Date: {new Date(item.created_at).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default PurchaseReturnCard;
