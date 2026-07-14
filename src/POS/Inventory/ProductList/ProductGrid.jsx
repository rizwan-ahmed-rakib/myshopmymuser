// import React, {useState, useEffect, useMemo, useCallback} from 'react';
// import ProductHeader from "./ProductHeader";
// import ProductStats from "./ProductStats";
// import ProductSearchFilter from "./ProductSearchFilter";
// import ProductCard from "./ProductCard";
// import ProductList from "./ProductList";
// import AddProductModal from "./AddProductModal";
// import SuccessModal from "./SuccessModal";
// import LoadingSpinner from "./LoadingSpinner";
// import {usePosProducts} from "../../../context_or_provider/pos/products/product_provider";
// import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
// import {posUnitAPI} from "../../../context_or_provider/pos/units/unitAPI";
// import {posBrandAPI} from "../../../context_or_provider/pos/brands/brandAPI";
// import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";
// import {posCategoryAPI} from "../../../context_or_provider/pos/categories/categoryAPI";
// import {posSizeAPI} from "../../../context_or_provider/pos/sizes/sizeAPI";
//
// const ProductGrid = ({viewType, isAddOpen, setIsAddOpen}) => {
//     const {posProduct, setPosProduct} = usePosProducts();
//     // const [viewType, setViewType] = useState("grid");
//     // const [isAddOpen, setIsAddOpen] = useState(false);
//     const [successData, setSuccessData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState({
//         total: 0,
//         inStock: 0,
//         outOfStock: 0,
//         totalPurchaseValue: 0,
//         totalSellingValue: 0
//     });
//
//     // Options for Filters
//     const [options, setOptions] = useState({
//         categories: [],
//         sub_categories: [],
//         brands: [],
//         units: [],
//         sizes: []
//     });
//
//     // Search and filter states
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filters, setFilters] = useState({
//         category: "all",
//         sub_category: "all",
//         brand: "all",
//         unit: "all",
//         size: "all",
//         status: "all",
//         warranty: "all",
//         expiry: "all",
//         sortBy: "name_asc",
//         priceRange: null
//     });
//
//     // Fetch products and filter options on component mount
//     useEffect(() => {
//         fetchInitialData();
//     }, []);
//
//     const fetchInitialData = async () => {
//         setLoading(true);
//         try {
//             const [
//                 prodRes,
//                 catRes,
//                 subCatRes,
//                 brandRes,
//                 unitRes,
//                 sizeRes
//             ] = await Promise.all([
//                 posProductAPI.getAll(),
//                 posCategoryAPI.getAll(),
//                 posSubCategoryAPI.getAll(),
//                 posBrandAPI.getAll(),
//                 posUnitAPI.getAll(),
//                 posSizeAPI.getAll()
//             ]);
//
//             setPosProduct(prodRes.data);
//             calculateStats(prodRes.data);
//
//             setOptions({
//                 categories: catRes.data.map(i => ({value: i.id, label: i.title})),
//                 sub_categories: subCatRes.data.map(i => ({value: i.id, label: i.title})),
//                 brands: brandRes.data.map(i => ({value: i.id, label: i.title})),
//                 units: unitRes.data.map(i => ({value: i.id, label: i.title})),
//                 sizes: sizeRes.data.map(i => ({value: i.id, label: i.title})),
//             });
//         } catch (error) {
//             console.error("Error fetching initial data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const fetchProductsOnly = async () => {
//         try {
//             const response = await posProductAPI.getAll();
//             setPosProduct(response.data);
//             calculateStats(response.data);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         }
//     };
//
//     const calculateStats = (products) => {
//         if (!products || products.length === 0) return;
//         const total = products.length;
//         const inStock = products.filter(p => Number(p.stock) > 0).length;
//         const outOfStock = total - inStock;
//         const totalPurchaseValue = products.reduce((acc, p) => acc + (Number(p.purchase_price || 0) * Number(p.stock || 0)), 0);
//         const totalSellingValue = products.reduce((acc, p) => acc + (Number(p.selling_price || 0) * Number(p.stock || 0)), 0);
//
//         setStats({total, inStock, outOfStock, totalPurchaseValue, totalSellingValue});
//     };
//
//     const handleSearch = useCallback((query) => setSearchQuery(query), []);
//     const handleFilter = useCallback((newFilters) => setFilters(prev => ({...prev, ...newFilters})), []);
//
//     const filteredProducts = useMemo(() => {
//         if (!posProduct || posProduct.length === 0) return [];
//
//         let result = [...posProduct];
//
//         // 1. Apply search
//         if (searchQuery.trim()) {
//             const query = searchQuery.toLowerCase();
//             result = result.filter(product =>
//                 product.name.toLowerCase().includes(query) ||
//                 product.product_code?.toLowerCase().includes(query)
//             );
//         }
//
//         // 2. Status Filter
//         if (filters.status !== "all") {
//             if (filters.status === "in-stock") {
//                 result = result.filter(p => Number(p.stock) > 0);
//             } else if (filters.status === "out-of-stock") {
//                 result = result.filter(p => Number(p.stock) === 0);
//             } else if (filters.status === "low-stock") {
//                 result = result.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto));
//             } else if (filters.status === "critical") {
//                 result = result.filter(p => Number(p.stock) <= (Number(p.alarm_when_stock_is_lessthanOrEqualto) * 0.2));
//             }
//         }
//
//         // 3. Dropdown Filters (Category, Sub-Category, Brand, Unit, Size)
//         const keys = ['category', 'sub_category', 'brand', 'unit', 'size'];
//         keys.forEach(key => {
//             if (filters[key] !== "all") {
//                 result = result.filter(p => String(p[key]) === String(filters[key]));
//             }
//         });
//
//         // 3.1 Warranty Filter
//         if (filters.warranty !== "all") {
//             const hasWarranty = filters.warranty === "has-warranty";
//             result = result.filter(p => p.warranty_status === hasWarranty);
//         }
//
//         // 3.2 Expiry Filter
//         if (filters.expiry !== "all") {
//             const hasExpiry = filters.expiry === "has-expiry";
//             result = result.filter(p => p.has_expiry === hasExpiry);
//         }
//
//         // 4. Price Range Filter
//         if (filters.priceRange) {
//             result = result.filter(product => {
//                 const price = parseFloat(product.selling_price);
//                 const passesMin = !filters.priceRange.min || price >= filters.priceRange.min;
//                 const passesMax = !filters.priceRange.max || price <= filters.priceRange.max;
//                 return passesMin && passesMax;
//             });
//         }
//
//         // 5. Sorting
//         result.sort((a, b) => {
//             switch (filters.sortBy) {
//                 case "name_asc":
//                     return a.name.localeCompare(b.name);
//                 case "name_desc":
//                     return b.name.localeCompare(a.name);
//                 case "price_asc":
//                     return parseFloat(a.selling_price) - parseFloat(b.selling_price);
//                 case "price_desc":
//                     return parseFloat(b.selling_price) - parseFloat(a.selling_price);
//                 case "stock_asc":
//                     return a.stock - b.stock;
//                 case "stock_desc":
//                     return b.stock - a.stock;
//                 default:
//                     return 0;
//             }
//         });
//
//         return result;
//     }, [posProduct, searchQuery, filters]);
//
//     const handleProductAdded = (newProduct) => {
//         setPosProduct(prev => [newProduct, ...prev]);
//         setIsAddOpen(false);
//         setSuccessData(newProduct);
//         fetchProductsOnly();
//     };
//
//     const formatMoney = (value) => value.toLocaleString(undefined, {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//     });
//
//     const displayStats = [
//         {title: 'Total Products', count: stats.total.toString(), bgColor: 'bg-blue-600', icon: '📦'},
//         {title: 'In Stock', count: stats.inStock.toString(), bgColor: 'bg-green-500', icon: '✅'},
//         {title: 'Out of Stock', count: stats.outOfStock.toString(), bgColor: 'bg-red-500', icon: '⚠️'},
//         {
//             title: 'Purchase Value',
//             count: `৳ ${formatMoney(stats.totalPurchaseValue)}`,
//             bgColor: 'bg-yellow-600',
//             icon: '🛒'
//         },
//         {
//             title: 'Selling Value',
//             count: `৳ ${formatMoney(stats.totalSellingValue)}`,
//             bgColor: 'bg-purple-600',
//             icon: '💰'
//         },
//     ];
//
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <LoadingSpinner size="lg"/>
//                 <p className="mt-4 text-gray-600">Loading products...</p>
//             </div>
//         );
//     }
//
//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//             {/*<ProductHeader viewType={viewType} setViewType={setViewType} onAddClick={() => setIsAddOpen(true)}/>*/}
//             <div className="mb-6">
//                 <ProductStats stats={displayStats}/>
//             </div>
//             <div className="mb-6">
//                 <ProductSearchFilter onSearch={handleSearch} onFilter={handleFilter} dynamicOptions={options}/>
//             </div>
//             <div className="bg-white rounded-xl shadow-sm p-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
//                     <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
//                         {viewType === "grid" ? "Product Directory" : "Product List"}
//                     </h2>
//                     <div className="text-sm text-gray-500">
//                         Showing {filteredProducts.length} of {posProduct?.length || 0} products
//                     </div>
//                 </div>
//
//                 {viewType === "grid" ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {filteredProducts.map(product => (
//                             <ProductCard key={product.id} product={product} onEdit={fetchProductsOnly}
//                                          onDelete={fetchProductsOnly}/>
//                         ))}
//                     </div>
//                 ) : (
//                     <ProductList products={filteredProducts} onUpdate={fetchProductsOnly}/>
//                 )}
//
//                 {filteredProducts.length === 0 && (
//                     <div className="text-center py-12">
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//                         <p className="text-gray-600 mb-4">Try changing your search or filter criteria</p>
//                         <button onClick={() => setIsAddOpen(true)}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Product
//                         </button>
//                     </div>
//                 )}
//             </div>
//
//             <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleProductAdded}/>
//             <SuccessModal isOpen={!!successData} employee={successData} onClose={() => setSuccessData(null)}/>
//         </div>
//     );
// };
//
// export default ProductGrid;


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from "./ProductCard";
import ProductList from "./ProductList";
import AddProductModal from "./AddProductModal";
import { usePosProducts } from "../../../context_or_provider/pos/products/product_provider";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";
import { Package, CheckCircle2, AlertTriangle, ShoppingCart, DollarSign, ArrowUpDown, Layers, Award } from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import SuccessModal from "../../components/SuccessModal";
import LoadingSpinner from "../../components/LoadingSpinner";

const ProductGrid = ({
    viewType,
    isAddOpen,
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { setPosProduct } = usePosProducts();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');

    // Options for Dynamic Filters
    const [options, setOptions] = useState({
        categories: [],
        sub_categories: [],
        brands: [],
        units: [],
        sizes: []
    });

    // 1. Fetch Dynamic Options on Mount
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [catRes, subCatRes, brandRes, unitRes, sizeRes] = await Promise.all([
                    posCategoryAPI.getAll(),
                    posSubCategoryAPI.getAll(),
                    posBrandAPI.getAll(),
                    posUnitAPI.getAll(),
                    posSizeAPI.getAll()
                ]);

                setOptions({
                    categories: (catRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
                    sub_categories: (subCatRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
                    brands: (brandRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
                    units: (unitRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
                    sizes: (sizeRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
                });
            } catch (error) {
                console.error("Error fetching filter options:", error);
            }
        };
        fetchOptions();
    }, []);

    // 2. Provide Filter Configuration to Parent Container
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by product name or code...",
                filtersConfig: [
                    { key: "category", label: "Category", icon: <Layers className="w-3.5 h-3.5" />, options: [{ value: "all", label: "All Categories" }, ...options.categories] },
                    { key: "brand", label: "Brand", icon: <Award className="w-3.5 h-3.5" />, options: [{ value: "all", label: "All Brands" }, ...options.brands] },
                    { key: "status", label: "Stock Status", icon: <AlertTriangle className="w-3.5 h-3.5" />, options: [
                        { value: "all", label: "All Status" },
                        { value: "in-stock", label: "In Stock" },
                        { value: "out-of-stock", label: "Out of Stock" },
                        { value: "low-stock", label: "Low Stock" },
                        { value: "critical", label: "Critical Stock" }
                    ]},
                    { key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: [
                        { value: "name_asc", label: "Name (A-Z)" },
                        { value: "name_desc", label: "Name (Z-A)" },
                        { value: "price_asc", label: "Price (Low-High)" },
                        { value: "price_desc", label: "Price (High-Low)" },
                        { value: "stock_asc", label: "Stock (Low-High)" },
                        { value: "stock_desc", label: "Stock (High-Low)" }
                    ]}
                ],
                advancedConfig: [
                    { key: "priceRange", type: "range", label: "Price Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
                    { key: "sub_category", type: "select", label: "Sub Category", options: [{ value: "all", label: "All Sub Categories" }, ...options.sub_categories] },
                    { key: "unit", type: "select", label: "Unit", options: [{ value: "all", label: "All Units" }, ...options.units] },
                    { key: "size", type: "select", label: "Size", options: [{ value: "all", label: "All Sizes" }, ...options.sizes] },
                    { key: "warranty", type: "select", label: "Warranty", options: [{ value: "all", label: "All" }, { value: "has-warranty", label: "Has Warranty" }, { value: "no-warranty", label: "No Warranty" }] },
                    { key: "expiry", type: "select", label: "Expiry", options: [{ value: "all", label: "All" }, { value: "has-expiry", label: "Has Expiry" }, { value: "no-expiry", label: "No Expiry" }] }
                ]
            });
        }
    }, [setFilterConfig, options]);

    // 3. Stats Calculation Function
    const calculateStats = useCallback((data) => {
        const total = data.length;
        const inStock = data.filter(p => Number(p.stock) > 0).length;
        const outOfStock = total - inStock;
        const totalPurchaseValue = data.reduce((acc, p) => acc + (Number(p.purchase_price || 0) * Number(p.stock || 0)), 0);
        const totalSellingValue = data.reduce((acc, p) => acc + (Number(p.selling_price || 0) * Number(p.stock || 0)), 0);

        return [
            { title: 'Total Products', count: total, bgColor: 'bg-blue-600', icon: <Package size={24} /> },
            { title: 'In Stock', count: inStock, bgColor: 'bg-green-500', icon: <CheckCircle2 size={24} /> },
            { title: 'Out of Stock', count: outOfStock, bgColor: 'bg-red-500', icon: <AlertTriangle size={24} /> },
            { title: 'Purchase Value', count: `৳ ${totalPurchaseValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bgColor: 'bg-yellow-600', icon: <ShoppingCart size={24} /> },
            { title: 'Selling Value', count: `৳ ${totalSellingValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bgColor: 'bg-purple-600', icon: <DollarSign size={24} /> }
        ];
    }, []);

    // 4. Centralized Module Data Hook Integration
    const {
        filteredData: filteredProducts,
        rawData: posProduct,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posProductAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['name', 'product_code'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];

            // Stock Status Filter
            if (f.status && f.status !== "all") {
                if (f.status === "in-stock") result = result.filter(p => Number(p.stock) > 0);
                else if (f.status === "out-of-stock") result = result.filter(p => Number(p.stock) === 0);
                else if (f.status === "low-stock") result = result.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto));
                else if (f.status === "critical") result = result.filter(p => Number(p.stock) <= (Number(p.alarm_when_stock_is_lessthanOrEqualto) * 0.2));
            }

            // Dropdown Relationships Filters
            const relationshipKeys = ['category', 'sub_category', 'brand', 'unit', 'size'];
            relationshipKeys.forEach(key => {
                if (f[key] && f[key] !== "all") {
                    result = result.filter(p => String(p[key]) === String(f[key]));
                }
            });

            // Warranty Filter
            if (f.warranty && f.warranty !== "all") {
                result = result.filter(p => p.warranty_status === (f.warranty === "has-warranty"));
            }

            // Expiry Filter
            if (f.expiry && f.expiry !== "all") {
                result = result.filter(p => p.has_expiry === (f.expiry === "has-expiry"));
            }

            // Price Range Filter
            if (f.priceRange) {
                result = result.filter(product => {
                    const price = parseFloat(product.selling_price || 0);
                    const passesMin = !f.priceRange.min || price >= f.priceRange.min;
                    const passesMax = !f.priceRange.max || price <= f.priceRange.max;
                    return passesMin && passesMax;
                });
            }

            // Sorting
            if (f.sortBy) {
                result.sort((a, b) => {
                    switch (f.sortBy) {
                        case "name_asc": return a.name.localeCompare(b.name);
                        case "name_desc": return b.name.localeCompare(a.name);
                        case "price_asc": return parseFloat(a.selling_price || 0) - parseFloat(b.selling_price || 0);
                        case "price_desc": return parseFloat(b.selling_price || 0) - parseFloat(a.selling_price || 0);
                        case "stock_asc": return Number(a.stock || 0) - Number(b.stock || 0);
                        case "stock_desc": return Number(b.stock || 0) - Number(a.stock || 0);
                        default: return 0;
                    }
                });
            }

            return result;
        }
    });

    // Sync context provider data
    useEffect(() => {
        if (posProduct) setPosProduct(posProduct);
    }, [posProduct, setPosProduct]);

    const handleProductAdded = (newProd) => {
        setIsAddOpen(false);
        setSuccessType('create');
        setSuccessData(newProd);
        refresh();
    };

    const handleProductUpdated = useCallback(() => {
        refresh();
    }, [refresh]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">Loading product records...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Package size={16} className="text-blue-600" />
                        {viewType === "grid" ? "Product Directory Grid" : "Product Directory List"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredProducts.length} OF {posProduct?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={handleProductUpdated}
                                onDelete={handleProductUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <ProductList products={filteredProducts} onUpdate={handleProductUpdated} />
                )}

                {filteredProducts.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <Package className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">No products found</h3>
                        <p className="text-gray-500 text-xs mb-4">Try changing your search or filter criteria</p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md active:scale-95"
                        >
                            Add Product
                        </button>
                    </div>
                )}
            </div>

            <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleProductAdded} />
            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title={successType === 'update' ? "Product Updated" : "Product Registered"}
                subtitle="Database synchronized successfully"
                details={[
                    { label: "Product Name", value: successData?.name },
                    { label: "Retail Price", value: `৳${parseFloat(successData?.selling_price || 0).toLocaleString()}` },
                    { label: "SKU / Code", value: successData?.product_code || "N/A" }
                ]}
            />
        </div>
    );
};

export default ProductGrid;