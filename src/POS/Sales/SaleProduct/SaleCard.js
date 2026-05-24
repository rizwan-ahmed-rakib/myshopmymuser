import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {posSaleProductAPI} from "../../../context_or_provider/pos/Sale/saleProduct/productSaleAPI";

const SaleCard = ({product, onEdit, onDelete}) => {
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
        navigate(`/sales/details/${product.id}`);
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(product);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete Invoice #${product.invoice_no}?`)) {
            return;
        }

        setLoadingId(product.id);
        try {
            await posSaleProductAPI.delete(product.id);
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete sale.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="relative rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">
                <img
                    src={product.customer_image || "https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg?semt=ais_hybrid&w=740&q=80"}
                    alt={product.customer_name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300";
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"/>

                <div ref={dropdownRef} className="absolute top-3 right-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown((prev) => !prev);
                        }}
                        className="bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-white transition"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01"/>
                        </svg>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                            <button
                                onClick={handleNameClick}
                                className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 text-left font-bold"
                            >
                                View Details
                            </button>
                            <button
                                onClick={handleEdit}
                                disabled={loadingId === product.id}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left disabled:opacity-50"
                            >
                                Edit Sale
                            </button>
                            <div className="border-t my-1"/>
                            <button
                                onClick={handleDelete}
                                disabled={loadingId === product.id}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left disabled:opacity-50"
                            >
                                Delete Sale
                            </button>
                        </div>
                    )}
                </div>

                <div className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow
                    ${product.payment_status === 'paid' ? "bg-green-100 text-green-700" : 
                      product.payment_status === 'partial' ? "bg-yellow-100 text-yellow-700" : 
                      "bg-red-100 text-red-700"}`}
                >
                    {product.payment_status}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-blue-600 font-bold">INV: {product.invoice_no}</div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">
                        {new Date(product.created_at).toLocaleDateString()}
                    </div>
                </div>

                <h3
                    onClick={handleNameClick}
                    className="font-bold text-lg text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer truncate"
                >
                    {product.customer_name || "Walk-in Customer"}
                </h3>

                <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Net Total:</span>
                        <span className="font-bold text-gray-900">৳{Number(product.net_total || product.netTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Received:</span>
                        <span className="font-bold text-green-600">৳{Number(product.paid_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-dashed">
                        <span className="text-xs font-bold text-gray-600 uppercase">Invoice Due:</span>
                        <span className="font-black text-red-600">৳{Number(product.due_amount).toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">
                        {product.payment_method?.replace('_', ' ')}
                    </div>
                    <div className="text-[10px] font-bold text-blue-400 uppercase">
                        {product.items?.length} Items
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaleCard;