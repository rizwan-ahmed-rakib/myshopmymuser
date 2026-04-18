import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import UpdateProductModal from "./UpdateProductModal";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import SuccessPopup from "./SuccessPopup";
import { Edit, Trash2, Eye, ShieldCheck, CalendarClock, Package, Tag, AlertCircle } from "lucide-react";

const ProductList = ({products, onUpdate}) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleViewDetails = (product) => {
        navigate(`/inventory/product/details/${product.id}`);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) {
            return;
        }

        setLoadingId(product.id);
        try {
            await posProductAPI.delete(product.id);
            setSuccessMessage(`${product.name} deleted successfully!`);
            setShowSuccess(true);
            if (onUpdate) onUpdate();
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
        if (onUpdate) onUpdate();
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Product Info</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Category & Brand</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pricing</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stock Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Settings</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products?.filter(p => p).map((product) => {
                                const isLowStock = Number(product.stock) <= Number(product.alarm_when_stock_is_lessthanOrEqualto);
                                return (
                                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-12 w-12 flex-shrink-0">
                                                    <img
                                                        className="h-full w-full rounded-xl object-cover border border-gray-100 shadow-sm"
                                                        src={product.image || "https://via.placeholder.com/150"}
                                                        alt={product.name}
                                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleViewDetails(product)}>
                                                        {product.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                                        <Package size={10} /> {product.product_code || '---'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wider">
                                                    <Tag size={10} /> {product.category_name || "N/A"}
                                                </span>
                                                <p className="text-[11px] text-gray-500 font-medium ml-1">
                                                    Brand: <span className="text-gray-700">{product.brand_name || "N/A"}</span>
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-black text-gray-800">৳{Number(product.selling_price).toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">Cost: ৳{Number(product.purchase_price).toLocaleString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? (isLowStock ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-rose-500'}`}></span>
                                                    <p className={`text-sm font-bold ${isLowStock ? 'text-amber-600' : 'text-gray-700'}`}>
                                                        {product.stock} <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{product.unit_name || 'pcs'}</span>
                                                    </p>
                                                </div>
                                                {isLowStock && product.stock > 0 && (
                                                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit uppercase">
                                                        <AlertCircle size={8} /> Low Stock
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {product.warranty_status && (
                                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="Warranty Available">
                                                        <ShieldCheck size={14} />
                                                    </div>
                                                )}
                                                {product.has_expiry && (
                                                    <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg" title="Expiry Tracking">
                                                        <CalendarClock size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button onClick={() => handleViewDetails(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors" title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => handleEdit(product)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors" title="Edit Product">
                                                    <Edit size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product)} 
                                                    className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors" 
                                                    title="Delete Product"
                                                    disabled={loadingId === product.id}
                                                >
                                                    {loadingId === product.id ? <LoadingSpinner size="xs"/> : <Trash2 size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {(!products || products.length === 0) && (
                    <div className="px-6 py-20 text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gray-50 text-gray-300 mb-4">
                            <Package size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No products found</h3>
                        <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                    </div>
                )}
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

export default ProductList;