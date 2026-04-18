import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import UpdateProductModal from "./UpdateProductModal";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import SuccessPopup from "./SuccessPopup";
import { MoreVertical, Edit, Trash2, Eye, ShieldCheck, CalendarClock, Package, Tag } from "lucide-react";

const ProductCard = ({product, onEdit, onDelete}) => {
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
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

    const handleViewDetails = () => {
        navigate(`/inventory/product/details/${product.id}`);
    };

    const handleEdit = () => {
        setSelectedProduct(product);
        setShowEditModal(true);
        setShowDropdown(false);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            return;
        }

        setLoadingId(product.id);
        try {
            await posProductAPI.delete(product.id);
            setSuccessMessage(`${product.name} deleted successfully!`);
            setShowSuccess(true);
            if (onDelete) onDelete();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete product.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateSuccess = (updatedData) => {
        setShowEditModal(false);
        setSuccessMessage("Product updated successfully!");
        setShowSuccess(true);
        if (onEdit) onEdit();
    };

    const isLowStock = Number(product.stock) <= Number(product.alarm_when_stock_is_lessthanOrEqualto);

    return (
        <>
            <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full relative">
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                        src={product.image || "https://assets.turbologo.com/blog/en/2021/09/10093610/photo-camera-958x575.png"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={product.name}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Error"; }}
                    />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.stock > 0 ? (
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${isLowStock ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                {isLowStock ? 'Low Stock' : 'In Stock'}
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {product.warranty_status && (
                            <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-blue-600 shadow-lg" title="Warranty Available">
                                <ShieldCheck size={16} />
                            </div>
                        )}
                        {product.has_expiry && (
                            <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-rose-600 shadow-lg" title="Expiry Date Tracking">
                                <CalendarClock size={16} />
                            </div>
                        )}
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                            onClick={handleViewDetails}
                            className="bg-white text-gray-900 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                            <Eye size={16} />
                            View Details
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                            <Tag size={10} />
                            {product.category_name || "Uncategorized"}
                        </div>
                        
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                                    <button onClick={handleEdit} className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors gap-3">
                                        <Edit size={16} />
                                        Edit Product
                                    </button>
                                    <button onClick={handleDelete} className="flex items-center w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors gap-3">
                                        <Trash2 size={16} />
                                        Delete Product
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 onClick={handleViewDetails} className="font-bold text-gray-800 mb-1 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mb-4 flex items-center gap-1">
                        <Package size={10} />
                        Code: {product.product_code || '---'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-400 font-medium uppercase">Selling Price</p>
                            <p className="text-lg font-black text-gray-900 leading-tight">৳{Number(product.selling_price).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-medium uppercase text-right">Stock</p>
                            <p className={`text-sm font-bold ${isLowStock ? 'text-amber-600' : 'text-gray-700'}`}>
                                {product.stock} <span className="text-[10px] font-medium text-gray-400">{product.unit_name || 'pcs'}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && selectedProduct && (
                <UpdateProductModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    productData={selectedProduct}
                />
            )}

            {showSuccess && (
                <SuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                    duration={3000}
                />
            )}
        </>
    );
};

export default ProductCard;