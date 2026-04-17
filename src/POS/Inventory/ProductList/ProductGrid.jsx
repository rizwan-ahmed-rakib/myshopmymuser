import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ProductHeader from "./ProductHeader";
import ProductStats from "./ProductStats";
import ProductSearchFilter from "./ProductSearchFilter";
import ProductCard from "./ProductCard";
import ProductList from "./ProductList";
import AddProductModal from "./AddProductModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {usePosProducts} from "../../../context_or_provider/pos/products/product_provider";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posUnitAPI} from "../../../context_or_provider/pos/units/unitAPI";
import {posBrandAPI} from "../../../context_or_provider/pos/brands/brandAPI";
import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import {posCategoryAPI} from "../../../context_or_provider/pos/categories/categoryAPI";
import {posSizeAPI} from "../../../context_or_provider/pos/sizes/sizeAPI";

const ProductGrid = () => {
    const {posProduct, setPosProduct} = usePosProducts();
    const [viewType, setViewType] = useState("grid");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        inStock: 0,
        outOfStock: 0,
        totalPurchaseValue: 0,
        totalSellingValue: 0
    });

    // Options for Filters
    const [options, setOptions] = useState({
        categories: [],
        sub_categories: [],
        brands: [],
        units: [],
        sizes: []
    });

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        category: "all",
        sub_category: "all",
        brand: "all",
        unit: "all",
        size: "all",
        status: "all",
        sortBy: "name_asc",
        priceRange: null
    });

    // Fetch products and filter options on component mount
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [
                prodRes, 
                catRes, 
                subCatRes, 
                brandRes, 
                unitRes, 
                sizeRes
            ] = await Promise.all([
                posProductAPI.getAll(),
                posCategoryAPI.getAll(),
                posSubCategoryAPI.getAll(),
                posBrandAPI.getAll(),
                posUnitAPI.getAll(),
                posSizeAPI.getAll()
            ]);

            setPosProduct(prodRes.data);
            calculateStats(prodRes.data);

            setOptions({
                categories: catRes.data.map(i => ({ value: i.id, label: i.title })),
                sub_categories: subCatRes.data.map(i => ({ value: i.id, label: i.title })),
                brands: brandRes.data.map(i => ({ value: i.id, label: i.title })),
                units: unitRes.data.map(i => ({ value: i.id, label: i.title })),
                sizes: sizeRes.data.map(i => ({ value: i.id, label: i.title })),
            });
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsOnly = async () => {
        try {
            const response = await posProductAPI.getAll();
            setPosProduct(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const calculateStats = (products) => {
        if (!products || products.length === 0) return;
        const total = products.length;
        const inStock = products.filter(p => Number(p.stock) > 0).length;
        const outOfStock = total - inStock;
        const totalPurchaseValue = products.reduce((acc, p) => acc + (Number(p.purchase_price || 0) * Number(p.stock || 0)), 0);
        const totalSellingValue = products.reduce((acc, p) => acc + (Number(p.selling_price || 0) * Number(p.stock || 0)), 0);

        setStats({ total, inStock, outOfStock, totalPurchaseValue, totalSellingValue });
    };

    const handleSearch = useCallback((query) => setSearchQuery(query), []);
    const handleFilter = useCallback((newFilters) => setFilters(prev => ({...prev, ...newFilters})), []);

    const filteredProducts = useMemo(() => {
        if (!posProduct || posProduct.length === 0) return [];

        let result = [...posProduct];

        // 1. Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.product_code?.toLowerCase().includes(query)
            );
        }

        // 2. Status Filter
        if (filters.status !== "all") {
            if (filters.status === "in-stock") {
                result = result.filter(p => Number(p.stock) > 0);
            } else if (filters.status === "out-of-stock") {
                result = result.filter(p => Number(p.stock) === 0);
            } else if (filters.status === "low-stock") {
                result = result.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto));
            } else if (filters.status === "critical") {
                result = result.filter(p => Number(p.stock) <= (Number(p.alarm_when_stock_is_lessthanOrEqualto) * 0.2));
            }
        }

        // 3. Dropdown Filters (Category, Sub-Category, Brand, Unit, Size)
        const keys = ['category', 'sub_category', 'brand', 'unit', 'size'];
        keys.forEach(key => {
            if (filters[key] !== "all") {
                result = result.filter(p => String(p[key]) === String(filters[key]));
            }
        });

        // 4. Price Range Filter
        if (filters.priceRange) {
            result = result.filter(product => {
                const price = parseFloat(product.selling_price);
                const passesMin = !filters.priceRange.min || price >= filters.priceRange.min;
                const passesMax = !filters.priceRange.max || price <= filters.priceRange.max;
                return passesMin && passesMax;
            });
        }

        // 5. Sorting
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "name_asc": return a.name.localeCompare(b.name);
                case "name_desc": return b.name.localeCompare(a.name);
                case "price_asc": return parseFloat(a.selling_price) - parseFloat(b.selling_price);
                case "price_desc": return parseFloat(b.selling_price) - parseFloat(a.selling_price);
                case "stock_asc": return a.stock - b.stock;
                case "stock_desc": return b.stock - a.stock;
                default: return 0;
            }
        });

        return result;
    }, [posProduct, searchQuery, filters]);

    const handleProductAdded = (newProduct) => {
        setPosProduct(prev => [newProduct, ...prev]);
        setIsAddOpen(false);
        setSuccessData(newProduct);
        fetchProductsOnly();
    };

    const formatMoney = (value) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const displayStats = [
        { title: 'Total Products', count: stats.total.toString(), bgColor: 'bg-blue-600', icon: '📦' },
        { title: 'In Stock', count: stats.inStock.toString(), bgColor: 'bg-green-500', icon: '✅' },
        { title: 'Out of Stock', count: stats.outOfStock.toString(), bgColor: 'bg-red-500', icon: '⚠️' },
        { title: 'Purchase Value', count: `৳ ${formatMoney(stats.totalPurchaseValue)}`, bgColor: 'bg-yellow-600', icon: '🛒' },
        { title: 'Selling Value', count: `৳ ${formatMoney(stats.totalSellingValue)}`, bgColor: 'bg-purple-600', icon: '💰' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <ProductHeader viewType={viewType} setViewType={setViewType} onAddClick={() => setIsAddOpen(true)} />
            <div className="mb-6">
                <ProductStats stats={displayStats}/>
            </div>
            <div className="mb-6">
                <ProductSearchFilter onSearch={handleSearch} onFilter={handleFilter} dynamicOptions={options} />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                        {viewType === "grid" ? "Product Directory" : "Product List"}
                    </h2>
                    <div className="text-sm text-gray-500">
                        Showing {filteredProducts.length} of {posProduct?.length || 0} products
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} onEdit={fetchProductsOnly} onDelete={fetchProductsOnly} />
                        ))}
                    </div>
                ) : (
                    <ProductList products={filteredProducts} onUpdate={fetchProductsOnly} />
                )}

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-4">Try changing your search or filter criteria</p>
                        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Product</button>
                    </div>
                )}
            </div>

            <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleProductAdded} />
            <SuccessModal isOpen={!!successData} employee={successData} onClose={() => setSuccessData(null)} />
        </div>
    );
};

export default ProductGrid;
