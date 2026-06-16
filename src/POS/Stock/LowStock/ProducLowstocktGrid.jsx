import React, {useState, useEffect, useCallback} from 'react';
import ProductCard from "./ProductCard";
import ProductList from "./ProductList";
import AddProductModal from "./AddProductModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import UpdateProductModal from "./UpdateProductModal";
import EmptyState from "../../components/EmptyState";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {TrendingDown, Package, Activity, Wallet, Calendar, ArrowUpDown, Filter, AlertCircle} from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import {usePosProducts} from "../../../context_or_provider/pos/products/product_provider";

const ProducLowstocktGrid = ({
                                 viewType,
                                 isAddOpen,
                                 setIsAddOpen,
                                 onStatsLoaded,
                                 searchQuery,
                                 filters,
                                 setFilterConfig
                             }) => {
    const {setPosProduct} = usePosProducts();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState("create");
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // 1. Provide filter configuration
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search low stock items...",
                filtersConfig: [
                    {
                        key: "stockSeverity", label: "Stock Level", icon: <AlertCircle className="w-3.5 h-3.5"/>, options: [
                            {value: "all", label: "All Low Stock"},
                            {value: "out_of_stock", label: "Out of Stock (0)"},
                            {value: "critical", label: "Critical (< 5)"},
                            {value: "warning", label: "Warning (< 10)"}
                        ]
                    },
                    {
                        key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5"/>, options: [
                            {value: "stock_asc", label: "Stock (Low-High)"},
                            {value: "name_asc", label: "Name (A-Z)"},
                            {value: "price_desc", label: "Price (High-Low)"}
                        ]
                    }
                ],
                advancedConfig: []
            });
        }
    }, [setFilterConfig]);

    // 2. Stats calculation
    const calculateStats = useCallback((data) => {
        const total = data.length;
        const outOfStock = data.filter(p => Number(p.stock) === 0).length;
        const critical = data.filter(p => Number(p.stock) > 0 && Number(p.stock) < 5).length;
        const totalValue = data.reduce((acc, p) => acc + (Number(p.stock) * Number(p.purchase_price)), 0);

        return [
            { title: 'Low Stock Items', count: total.toString(), bgColor: 'bg-orange-600', icon: <TrendingDown size={24}/> },
            { title: 'Out of Stock', count: outOfStock.toString(), bgColor: 'bg-rose-700', icon: <Package size={24}/> },
            { title: 'Critical Items', count: critical.toString(), bgColor: 'bg-amber-600', icon: <AlertCircle size={24}/> },
            { title: 'Stock Value', count: `৳${totalValue.toLocaleString()}`, bgColor: 'bg-blue-600', icon: <Wallet size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredProducts,
        rawData: posProduct,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posProductAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['name', 'product_code', 'brand_name', 'category_name'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            // Initial filter: only show products with stock <= min_stock_level (or a default like 10)
            let result = data.filter(p => Number(p.stock) <= (p.min_stock_level || 10));

            if (f.stockSeverity && f.stockSeverity !== "all") {
                if (f.stockSeverity === "out_of_stock") result = result.filter(p => Number(p.stock) === 0);
                if (f.stockSeverity === "critical") result = result.filter(p => Number(p.stock) > 0 && Number(p.stock) < 5);
                if (f.stockSeverity === "warning") result = result.filter(p => Number(p.stock) >= 5 && Number(p.stock) < 10);
            }

            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "stock_asc") return Number(a.stock) - Number(b.stock);
                    if (f.sortBy === "name_asc") return a.name.localeCompare(b.name);
                    if (f.sortBy === "price_desc") return Number(b.sale_price) - Number(a.sale_price);
                    return 0;
                });
            }
            return result;
        }
    });

    useEffect(() => {
        if (posProduct) setPosProduct(posProduct);
    }, [posProduct, setPosProduct]);

    const handleAddSuccess = (newProduct) => {
        setIsAddOpen(false);
        setSuccessData(newProduct);
        setSuccessType("create");
        refresh();
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsEditOpen(true);
    };

    const handleUpdateSuccess = (updatedData) => {
        setIsEditOpen(false);
        setEditingProduct(null);
        setSuccessData(updatedData);
        setSuccessType("update");
        refresh();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Analyzing stock levels...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <TrendingDown size={16} className="text-brand-primary"/>
                        {viewType === "grid" ? "Low Stock Inventory Grid" : "Low Stock Inventory Table"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredProducts.length} AT-RISK ITEMS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={() => handleEditClick(product)}
                                onDelete={refresh}
                            />
                        ))}
                    </div>
                ) : (
                    <ProductList
                        products={filteredProducts}
                        onEdit={handleEditClick}
                        onDelete={refresh}
                    />
                )}

                {filteredProducts.length === 0 && (
                    <EmptyState
                        icon={<Package size={32}/>}
                        title="Stock levels are optimal"
                        description="There are no products currently matching the low stock criteria."
                        actionText="Refresh Analysis"
                        onAction={refresh}
                    />
                )}
            </div>

            <AddProductModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
            />

            {isEditOpen && (
                 <UpdateProductModal
                    isOpen={isEditOpen}
                    onClose={() => { setIsEditOpen(false); setEditingProduct(null); }}
                    productData={editingProduct}
                    onSuccess={handleUpdateSuccess}
                />
            )}

            <SuccessModal
                isOpen={!!successData}
                data={successData}
                type={successType}
                onClose={() => setSuccessData(null)}
            />
        </div>
    );
};

export default ProducLowstocktGrid;