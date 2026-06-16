import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Package, TrendingDown, LayoutGrid, Info } from 'lucide-react';
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";

/**
 * ProductList - Refactored to use BackboneTable and StatusBadge.
 * Specifically for the Low Stock submodule.
 */
const ProductList = ({ products, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = (item) => {
        navigate(`/inventory/product/details/${item.id}`);
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return;
        setLoadingId(item.id);
        try {
            await posProductAPI.delete(item.id);
            if (onDelete) onDelete();
        } catch (error) {
            console.error(error);
            alert("Failed to delete product.");
        } finally {
            setLoadingId(null);
        }
    };

    const columns = [
        {
            header: "Product & Code",
            accessor: "name",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 border border-orange-100">
                        <Package size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">{item.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {item.product_code}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Category & Brand",
            accessor: "category_name",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">{item.category_name || "Uncategorized"}</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter italic">
                        {item.brand_name || "No Brand"}
                    </span>
                </div>
            )
        },
        {
            header: "Stock Level",
            accessor: "stock",
            className: "text-center",
            render: (item) => {
                const stock = Number(item.stock);
                const min = Number(item.min_stock_level || 10);
                return (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5">
                            <span className={`font-black text-sm ${stock === 0 ? 'text-rose-600' : 'text-orange-600'}`}>
                                {stock}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">units</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div 
                                className={`h-full ${stock === 0 ? 'bg-rose-500' : 'bg-orange-500'}`} 
                                style={{ width: `${Math.min(100, (stock / min) * 100)}%` }}
                            />
                        </div>
                    </div>
                );
            }
        },
        {
            header: "Price (Sales)",
            accessor: "sale_price",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-black text-gray-900 text-xs">৳{parseFloat(item.sale_price).toLocaleString()}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                        Cost: ৳{parseFloat(item.purchase_price).toLocaleString()}
                    </span>
                </div>
            )
        },
        {
            header: "Alert Status",
            accessor: "stock_status",
            className: "text-center",
            render: (item) => (
                <StatusBadge 
                    type={Number(item.stock) === 0 ? 'danger' : 'warning'} 
                    label={Number(item.stock) === 0 ? 'Out of Stock' : 'Low Stock'} 
                />
            )
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right w-1 whitespace-nowrap",
            render: (item) => (
                <div className="flex justify-end gap-1">
                    <button onClick={() => handleViewDetails(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><Eye size={16} /></button>
                    <button onClick={() => onEdit(item)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                        {loadingId === item.id ? <LoadingSpinner size="xs" /> : <Trash2 size={16} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <BackboneTable 
            columns={columns} 
            data={products} 
        />
    );
};

export default ProductList;