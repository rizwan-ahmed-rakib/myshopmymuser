// //
// //
// // import React, { useState, useEffect, useMemo, useCallback } from 'react';
// // import ProductCard from "./ProductCard";
// // import ProductList from "./ProductList";
// // import AddProductModal from "./AddProductModal";
// // import { usePosProducts } from "../../../context_or_provider/pos/products/product_provider";
// // import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
// // import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
// // import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
// // import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
// // import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
// // import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";
// // import { Package, CheckCircle2, AlertTriangle, ShoppingCart, DollarSign, ArrowUpDown, Layers, Award } from 'lucide-react';
// // import useModuleData from "../../hooks/useModuleData";
// // import SuccessModal from "../../components/SuccessModal";
// // import LoadingSpinner from "../../components/LoadingSpinner";
// //
// // const ProductGrid = ({
// //     viewType,
// //     isAddOpen,
// //     setIsAddOpen,
// //     onStatsLoaded,
// //     searchQuery,
// //     filters,
// //     setFilterConfig
// // }) => {
// //     const { setPosProduct } = usePosProducts();
// //     const [successData, setSuccessData] = useState(null);
// //     const [successType, setSuccessType] = useState('create');
// //
// //     // Options for Dynamic Filters
// //     const [options, setOptions] = useState({
// //         categories: [],
// //         sub_categories: [],
// //         brands: [],
// //         units: [],
// //         sizes: []
// //     });
// //
// //     // 1. Fetch Dynamic Options on Mount
// //     useEffect(() => {
// //         const fetchOptions = async () => {
// //             try {
// //                 const [catRes, subCatRes, brandRes, unitRes, sizeRes] = await Promise.all([
// //                     posCategoryAPI.getAll(),
// //                     posSubCategoryAPI.getAll(),
// //                     posBrandAPI.getAll(),
// //                     posUnitAPI.getAll(),
// //                     posSizeAPI.getAll()
// //                 ]);
// //
// //                 setOptions({
// //                     categories: (catRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
// //                     sub_categories: (subCatRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
// //                     brands: (brandRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
// //                     units: (unitRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
// //                     sizes: (sizeRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
// //                 });
// //             } catch (error) {
// //                 console.error("Error fetching filter options:", error);
// //             }
// //         };
// //         fetchOptions();
// //     }, []);
// //
// //     // 2. Provide Filter Configuration to Parent Container
// //     useEffect(() => {
// //         if (setFilterConfig) {
// //             setFilterConfig({
// //                 searchPlaceholder: "Search by product name or code...",
// //                 filtersConfig: [
// //                     { key: "category", label: "Category", icon: <Layers className="w-3.5 h-3.5" />, options: [{ value: "all", label: "All Categories" }, ...options.categories] },
// //                     { key: "brand", label: "Brand", icon: <Award className="w-3.5 h-3.5" />, options: [{ value: "all", label: "All Brands" }, ...options.brands] },
// //                     { key: "status", label: "Stock Status", icon: <AlertTriangle className="w-3.5 h-3.5" />, options: [
// //                         { value: "all", label: "All Status" },
// //                         { value: "in-stock", label: "In Stock" },
// //                         { value: "out-of-stock", label: "Out of Stock" },
// //                         { value: "low-stock", label: "Low Stock" },
// //                         { value: "critical", label: "Critical Stock" }
// //                     ]},
// //                     { key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: [
// //                         { value: "name_asc", label: "Name (A-Z)" },
// //                         { value: "name_desc", label: "Name (Z-A)" },
// //                         { value: "price_asc", label: "Price (Low-High)" },
// //                         { value: "price_desc", label: "Price (High-Low)" },
// //                         { value: "stock_asc", label: "Stock (Low-High)" },
// //                         { value: "stock_desc", label: "Stock (High-Low)" }
// //                     ]}
// //                 ],
// //                 advancedConfig: [
// //                     { key: "priceRange", type: "range", label: "Price Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
// //                     { key: "sub_category", type: "select", label: "Sub Category", options: [{ value: "all", label: "All Sub Categories" }, ...options.sub_categories] },
// //                     { key: "unit", type: "select", label: "Unit", options: [{ value: "all", label: "All Units" }, ...options.units] },
// //                     { key: "size", type: "select", label: "Size", options: [{ value: "all", label: "All Sizes" }, ...options.sizes] },
// //                     { key: "warranty", type: "select", label: "Warranty", options: [{ value: "all", label: "All" }, { value: "has-warranty", label: "Has Warranty" }, { value: "no-warranty", label: "No Warranty" }] },
// //                     { key: "expiry", type: "select", label: "Expiry", options: [{ value: "all", label: "All" }, { value: "has-expiry", label: "Has Expiry" }, { value: "no-expiry", label: "No Expiry" }] }
// //                 ]
// //             });
// //         }
// //     }, [setFilterConfig, options]);
// //
// //     // 3. Stats Calculation Function
// //     const calculateStats = useCallback((data) => {
// //         const total = data.length;
// //         const inStock = data.filter(p => Number(p.stock) > 0).length;
// //         const outOfStock = total - inStock;
// //         const totalPurchaseValue = data.reduce((acc, p) => acc + (Number(p.purchase_price || 0) * Number(p.stock || 0)), 0);
// //         const totalSellingValue = data.reduce((acc, p) => acc + (Number(p.selling_price || 0) * Number(p.stock || 0)), 0);
// //
// //         return [
// //             { title: 'Total Products', count: total, bgColor: 'bg-blue-600', icon: <Package size={24} /> },
// //             { title: 'In Stock', count: inStock, bgColor: 'bg-green-500', icon: <CheckCircle2 size={24} /> },
// //             { title: 'Out of Stock', count: outOfStock, bgColor: 'bg-red-500', icon: <AlertTriangle size={24} /> },
// //             { title: 'Purchase Value', count: `৳ ${totalPurchaseValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bgColor: 'bg-yellow-600', icon: <ShoppingCart size={24} /> },
// //             { title: 'Selling Value', count: `৳ ${totalSellingValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, bgColor: 'bg-purple-600', icon: <DollarSign size={24} /> }
// //         ];
// //     }, []);
// //
// //     // 4. Centralized Module Data Hook Integration
// //     const {
// //         filteredData: filteredProducts,
// //         rawData: posProduct,
// //         loading,
// //         refresh
// //     } = useModuleData({
// //         apiFetch: posProductAPI.getAll,
// //         searchQuery,
// //         filters,
// //         searchFields: ['name', 'product_code'],
// //         onStatsLoaded,
// //         calculateStatsFn: calculateStats,
// //         filterFn: (data, f) => {
// //             let result = [...data];
// //
// //             // Stock Status Filter
// //             if (f.status && f.status !== "all") {
// //                 if (f.status === "in-stock") result = result.filter(p => Number(p.stock) > 0);
// //                 else if (f.status === "out-of-stock") result = result.filter(p => Number(p.stock) === 0);
// //                 else if (f.status === "low-stock") result = result.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto));
// //                 else if (f.status === "critical") result = result.filter(p => Number(p.stock) <= (Number(p.alarm_when_stock_is_lessthanOrEqualto) * 0.2));
// //             }
// //
// //             // Dropdown Relationships Filters
// //             const relationshipKeys = ['category', 'sub_category', 'brand', 'unit', 'size'];
// //             relationshipKeys.forEach(key => {
// //                 if (f[key] && f[key] !== "all") {
// //                     result = result.filter(p => String(p[key]) === String(f[key]));
// //                 }
// //             });
// //
// //             // Warranty Filter
// //             if (f.warranty && f.warranty !== "all") {
// //                 result = result.filter(p => p.warranty_status === (f.warranty === "has-warranty"));
// //             }
// //
// //             // Expiry Filter
// //             if (f.expiry && f.expiry !== "all") {
// //                 result = result.filter(p => p.has_expiry === (f.expiry === "has-expiry"));
// //             }
// //
// //             // Price Range Filter
// //             if (f.priceRange) {
// //                 result = result.filter(product => {
// //                     const price = parseFloat(product.selling_price || 0);
// //                     const passesMin = !f.priceRange.min || price >= f.priceRange.min;
// //                     const passesMax = !f.priceRange.max || price <= f.priceRange.max;
// //                     return passesMin && passesMax;
// //                 });
// //             }
// //
// //             // Sorting
// //             if (f.sortBy) {
// //                 result.sort((a, b) => {
// //                     switch (f.sortBy) {
// //                         case "name_asc": return a.name.localeCompare(b.name);
// //                         case "name_desc": return b.name.localeCompare(a.name);
// //                         case "price_asc": return parseFloat(a.selling_price || 0) - parseFloat(b.selling_price || 0);
// //                         case "price_desc": return parseFloat(b.selling_price || 0) - parseFloat(a.selling_price || 0);
// //                         case "stock_asc": return Number(a.stock || 0) - Number(b.stock || 0);
// //                         case "stock_desc": return Number(b.stock || 0) - Number(a.stock || 0);
// //                         default: return 0;
// //                     }
// //                 });
// //             }
// //
// //             return result;
// //         }
// //     });
// //
// //     // Sync context provider data
// //     useEffect(() => {
// //         if (posProduct) setPosProduct(posProduct);
// //     }, [posProduct, setPosProduct]);
// //
// //     const handleProductAdded = (newProd) => {
// //         setIsAddOpen(false);
// //         setSuccessType('create');
// //         setSuccessData(newProd);
// //         refresh();
// //     };
// //
// //     const handleProductUpdated = useCallback(() => {
// //         refresh();
// //     }, [refresh]);
// //
// //     if (loading) return (
// //         <div className="flex flex-col items-center justify-center py-20 w-full">
// //             <LoadingSpinner size="lg" />
// //             <p className="mt-4 text-gray-500 text-sm">Loading product records...</p>
// //         </div>
// //     );
// //
// //     return (
// //         <div className="space-y-4">
// //             <div className="p-1">
// //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
// //                     <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
// //                         <Package size={16} className="text-blue-600" />
// //                         {viewType === "grid" ? "Product Directory Grid" : "Product Directory List"}
// //                     </h2>
// //                     <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
// //                         SHOWING {filteredProducts.length} OF {posProduct?.length || 0} RECORDS
// //                     </div>
// //                 </div>
// //
// //                 {viewType === "grid" ? (
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //                         {filteredProducts.map(product => (
// //                             <ProductCard
// //                                 key={product.id}
// //                                 product={product}
// //                                 onEdit={handleProductUpdated}
// //                                 onDelete={handleProductUpdated}
// //                             />
// //                         ))}
// //                     </div>
// //                 ) : (
// //                     <ProductList products={filteredProducts} onUpdate={handleProductUpdated} />
// //                 )}
// //
// //                 {filteredProducts.length === 0 && (
// //                     <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
// //                         <Package className="w-8 h-8 text-gray-300 mx-auto mb-4" />
// //                         <h3 className="text-base font-bold text-gray-800 mb-1">No products found</h3>
// //                         <p className="text-gray-500 text-xs mb-4">Try changing your search or filter criteria</p>
// //                         <button
// //                             onClick={() => setIsAddOpen(true)}
// //                             className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md active:scale-95"
// //                         >
// //                             Add Product
// //                         </button>
// //                     </div>
// //                 )}
// //             </div>
// //
// //             <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleProductAdded} />
// //             <SuccessModal
// //                 isOpen={!!successData}
// //                 onClose={() => setSuccessData(null)}
// //                 title={successType === 'update' ? "Product Updated" : "Product Registered"}
// //                 subtitle="Database synchronized successfully"
// //                 details={[
// //                     { label: "Product Name", value: successData?.name },
// //                     { label: "Retail Price", value: `৳${parseFloat(successData?.selling_price || 0).toLocaleString()}` },
// //                     { label: "SKU / Code", value: successData?.product_code || "N/A" }
// //                 ]}
// //             />
// //         </div>
// //     );
// // };
// //
// // export default ProductGrid;
//
//
//
//
//
// import React, { useState, useEffect, useCallback } from 'react';
// import ProductCard from "./ProductCard";
// import ProductList from "./ProductList";
// import AddProductModal from "./AddProductModal";
// import { usePosProducts } from "../../../context_or_provider/pos/products/product_provider";
// import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
// import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
// import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
// import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
// import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
// import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";
// import {
//     Package, CheckCircle2, AlertTriangle, ShoppingCart, DollarSign,
//     ArrowUpDown, Layers, Award, ChevronLeft, ChevronRight,
// } from 'lucide-react';
// import SuccessModal from "../../components/SuccessModal";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import { useDebounce } from "../../hooks/useDebounce";
//
// const PAGE_SIZE = 20;
//
// const ProductGrid = ({
//     viewType,
//     isAddOpen,
//     setIsAddOpen,
//     onStatsLoaded,
//     searchQuery,
//     filters,
//     setFilterConfig,
// }) => {
//     const { setPosProduct } = usePosProducts();
//     const [successData, setSuccessData] = useState(null);
//     const [successType, setSuccessType] = useState('create');
//
//     /* ═══════════════════════════════════════════════════════════
//        🆕 Server-side pagination state
//        ═══════════════════════════════════════════════════════════ */
//     const [products, setProducts] = useState([]);
//     const [totalProducts, setTotalProducts] = useState(0);
//     const [page, setPage] = useState(1);
//     const [loadingProducts, setLoadingProducts] = useState(false);
//     const [refreshKey, setRefreshKey] = useState(0);
//
//     /* 🆕 Debounce search */
//     const debouncedSearch = useDebounce(searchQuery || "", 300);
//
//     /* ═══ Dynamic Filter Options ═══ */
//     const [options, setOptions] = useState({
//         categories: [],
//         sub_categories: [],
//         brands: [],
//         units: [],
//         sizes: [],
//     });
//
//     useEffect(() => {
//         const fetchOptions = async () => {
//             try {
//                 const [catRes, subCatRes, brandRes, unitRes, sizeRes] = await Promise.all([
//                     posCategoryAPI.getAll(),
//                     posSubCategoryAPI.getAll(),
//                     posBrandAPI.getAll(),
//                     posUnitAPI.getAll(),
//                     posSizeAPI.getAll(),
//                 ]);
//
//                 setOptions({
//                     categories: (catRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                     sub_categories: (subCatRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                     brands: (brandRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                     units: (unitRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                     sizes: (sizeRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                 });
//             } catch (error) {
//                 console.error("Error fetching filter options:", error);
//             }
//         };
//         fetchOptions();
//     }, []);
//
//     /* ═══ Filter Config → Parent ═══ */
//     useEffect(() => {
//         if (setFilterConfig) {
//             setFilterConfig({
//                 searchPlaceholder: "Search by product name or code...",
//                 filtersConfig: [
//                     {
//                         key: "category",
//                         label: "Category",
//                         icon: <Layers className="w-3.5 h-3.5" />,
//                         options: [{ value: "all", label: "All Categories" }, ...options.categories],
//                     },
//                     {
//                         key: "brand",
//                         label: "Brand",
//                         icon: <Award className="w-3.5 h-3.5" />,
//                         options: [{ value: "all", label: "All Brands" }, ...options.brands],
//                     },
//                     {
//                         key: "status",
//                         label: "Stock Status",
//                         icon: <AlertTriangle className="w-3.5 h-3.5" />,
//                         options: [
//                             { value: "all", label: "All Status" },
//                             { value: "in-stock", label: "In Stock" },
//                             { value: "out-of-stock", label: "Out of Stock" },
//                             { value: "low-stock", label: "Low Stock" },
//                             { value: "critical", label: "Critical Stock" },
//                         ],
//                     },
//                     {
//                         key: "sortBy",
//                         label: "Sort By",
//                         icon: <ArrowUpDown className="w-3.5 h-3.5" />,
//                         options: [
//                             { value: "name_asc", label: "Name (A-Z)" },
//                             { value: "name_desc", label: "Name (Z-A)" },
//                             { value: "price_asc", label: "Price (Low-High)" },
//                             { value: "price_desc", label: "Price (High-Low)" },
//                             { value: "stock_asc", label: "Stock (Low-High)" },
//                             { value: "stock_desc", label: "Stock (High-Low)" },
//                         ],
//                     },
//                 ],
//                 advancedConfig: [
//                     { key: "priceRange", type: "range", label: "Price Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
//                     {
//                         key: "sub_category", type: "select", label: "Sub Category",
//                         options: [{ value: "all", label: "All Sub Categories" }, ...options.sub_categories],
//                     },
//                     {
//                         key: "unit", type: "select", label: "Unit",
//                         options: [{ value: "all", label: "All Units" }, ...options.units],
//                     },
//                     {
//                         key: "size", type: "select", label: "Size",
//                         options: [{ value: "all", label: "All Sizes" }, ...options.sizes],
//                     },
//                     {
//                         key: "warranty", type: "select", label: "Warranty",
//                         options: [
//                             { value: "all", label: "All" },
//                             { value: "has-warranty", label: "Has Warranty" },
//                             { value: "no-warranty", label: "No Warranty" },
//                         ],
//                     },
//                     {
//                         key: "expiry", type: "select", label: "Expiry",
//                         options: [
//                             { value: "all", label: "All" },
//                             { value: "has-expiry", label: "Has Expiry" },
//                             { value: "no-expiry", label: "No Expiry" },
//                         ],
//                     },
//                 ],
//             });
//         }
//     }, [setFilterConfig, options]);
//
//     /* ═══ Stats calculation ═══ */
//     const calculateStats = useCallback((data) => {
//         const total = data.length;
//         const inStock = data.filter(p => Number(p.stock) > 0).length;
//         const outOfStock = total - inStock;
//         const totalPurchaseValue = data.reduce(
//             (acc, p) => acc + Number(p.purchase_price || 0) * Number(p.stock || 0),
//             0
//         );
//         const totalSellingValue = data.reduce(
//             (acc, p) => acc + Number(p.selling_price || 0) * Number(p.stock || 0),
//             0
//         );
//
//         return [
//             { title: 'Total Products', count: total, bgColor: 'bg-blue-600', icon: <Package size={24} /> },
//             { title: 'In Stock', count: inStock, bgColor: 'bg-green-500', icon: <CheckCircle2 size={24} /> },
//             { title: 'Out of Stock', count: outOfStock, bgColor: 'bg-red-500', icon: <AlertTriangle size={24} /> },
//             {
//                 title: 'Purchase Value',
//                 count: `৳ ${totalPurchaseValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 bgColor: 'bg-yellow-600',
//                 icon: <ShoppingCart size={24} />,
//             },
//             {
//                 title: 'Selling Value',
//                 count: `৳ ${totalSellingValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 bgColor: 'bg-purple-600',
//                 icon: <DollarSign size={24} />,
//             },
//         ];
//     }, []);
//
//     /* ═══════════════════════════════════════════════════════════
//        🆕 SERVER-SIDE FETCH: paginated products
//        ═══════════════════════════════════════════════════════════ */
//     useEffect(() => {
//         let cancelled = false;
//
//         const fetchProducts = async () => {
//             setLoadingProducts(true);
//             try {
//                 const res = await posProductAPI.search(debouncedSearch, {
//                     page,
//                     page_size: PAGE_SIZE,
//                     category_id:
//                         filters.category && filters.category !== 'all' ? filters.category : undefined,
//                     sub_category_id:
//                         filters.sub_category && filters.sub_category !== 'all' ? filters.sub_category : undefined,
//                     brand_id:
//                         filters.brand && filters.brand !== 'all' ? filters.brand : undefined,
//                     size_id:
//                         filters.size && filters.size !== 'all' ? filters.size : undefined,
//                     unit_id:
//                         filters.unit && filters.unit !== 'all' ? filters.unit : undefined,
//                     status: filters.status && filters.status !== 'all' ? filters.status : undefined,
//                     sort_by: filters.sortBy || undefined,
//                     min_price: filters.priceRange?.min || undefined,
//                     max_price: filters.priceRange?.max || undefined,
//                     warranty: filters.warranty && filters.warranty !== 'all' ? filters.warranty : undefined,
//                     expiry: filters.expiry && filters.expiry !== 'all' ? filters.expiry : undefined,
//                 });
//                 if (cancelled) return;
//
//                 const data = res.data.results || [];
//                 setProducts(data);
//                 setTotalProducts(res.data.count || 0);
//
//                 /* Sync context provider with current page data */
//                 setPosProduct(data);
//             } catch (err) {
//                 if (cancelled) return;
//                 console.error("Product fetch failed:", err);
//                 setProducts([]);
//                 setTotalProducts(0);
//             } finally {
//                 if (!cancelled) setLoadingProducts(false);
//             }
//         };
//
//         fetchProducts();
//         return () => {
//             cancelled = true;
//         };
//     }, [debouncedSearch, page, filters, refreshKey, setPosProduct]);
//
//     /* 🆕 Reset page whenever search/filters change */
//     useEffect(() => {
//         setPage(1);
//     }, [debouncedSearch, filters]);
//
//     /* ═══════════════════════════════════════════════════════════
//        🆕 STATS: fetch full dataset separately
//        (Ideally backend should expose a /stats endpoint)
//        ═══════════════════════════════════════════════════════════ */
//     useEffect(() => {
//         if (!onStatsLoaded) return;
//         let cancelled = false;
//
//         const fetchStats = async () => {
//             try {
//                 const res = await posProductAPI.getAll();
//                 if (cancelled) return;
//                 const allData = res.data || [];
//                 const stats = calculateStats(allData);
//                 onStatsLoaded(stats);
//             } catch (err) {
//                 if (cancelled) return;
//                 console.error("Stats fetch failed:", err);
//             }
//         };
//         fetchStats();
//         return () => {
//             cancelled = true;
//         };
//     }, [refreshKey, onStatsLoaded, calculateStats]);
//
//     /* ═══ Handlers ═══ */
//     const handleProductAdded = (newProd) => {
//         setIsAddOpen(false);
//         setSuccessType('create');
//         setSuccessData(newProd);
//         setRefreshKey(k => k + 1);
//     };
//
//     const handleProductUpdated = useCallback(() => {
//         setRefreshKey(k => k + 1);
//     }, []);
//
//     /* ═══ Loading State ═══ */
//     if (loadingProducts && products.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-20 w-full">
//                 <LoadingSpinner size="lg" />
//                 <p className="mt-4 text-gray-500 text-sm">Loading product records...</p>
//             </div>
//         );
//     }
//
//     const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
//
//     return (
//         <div className="space-y-4">
//             <div className="p-1">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1 gap-2">
//                     <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
//                         <Package size={16} className="text-blue-600" />
//                         {viewType === "grid" ? "Product Directory Grid" : "Product Directory List"}
//                     </h2>
//                     <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
//                         {loadingProducts ? (
//                             <>⏳ LOADING…</>
//                         ) : (
//                             <>
//                                 SHOWING {products.length} OF {totalProducts.toLocaleString()} RECORDS
//                                 <span className="text-gray-300 ml-1">
//                                     (PAGE {page}/{totalPages})
//                                 </span>
//                             </>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Grid / List View */}
//                 {viewType === "grid" ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {products.map(product => (
//                             <ProductCard
//                                 key={product.id}
//                                 product={product}
//                                 onEdit={handleProductUpdated}
//                                 onDelete={handleProductUpdated}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <ProductList products={products} onUpdate={handleProductUpdated} />
//                 )}
//
//                 {/* Empty State */}
//                 {!loadingProducts && products.length === 0 && (
//                     <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
//                         <Package className="w-8 h-8 text-gray-300 mx-auto mb-4" />
//                         <h3 className="text-base font-bold text-gray-800 mb-1">No products found</h3>
//                         <p className="text-gray-500 text-xs mb-4">
//                             Try changing your search or filter criteria
//                         </p>
//                         <button
//                             onClick={() => setIsAddOpen(true)}
//                             className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md active:scale-95"
//                         >
//                             Add Product
//                         </button>
//                     </div>
//                 )}
//
//                 {/* 🆕 Pagination UI */}
//                 {totalProducts > PAGE_SIZE && (
//                     <div className="flex justify-center items-center gap-3 py-4 border-t border-gray-200 bg-white mt-4">
//                         <button
//                             type="button"
//                             disabled={page <= 1 || loadingProducts}
//                             onClick={() => setPage(p => Math.max(1, p - 1))}
//                             className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-bold"
//                         >
//                             <ChevronLeft size={14}/> Prev
//                         </button>
//
//                         <span className="text-[11px] font-bold text-gray-700">
//                             Page {page} / {totalPages}
//                             <span className="ml-2 text-gray-400 font-normal">
//                                 ({totalProducts.toLocaleString()} total)
//                             </span>
//                         </span>
//
//                         <button
//                             type="button"
//                             disabled={page >= totalPages || loadingProducts}
//                             onClick={() => setPage(p => p + 1)}
//                             className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-bold"
//                         >
//                             Next <ChevronRight size={14}/>
//                         </button>
//                     </div>
//                 )}
//             </div>
//
//             <AddProductModal
//                 isOpen={isAddOpen}
//                 onClose={() => setIsAddOpen(false)}
//                 onSuccess={handleProductAdded}
//             />
//
//             <SuccessModal
//                 isOpen={!!successData}
//                 onClose={() => setSuccessData(null)}
//                 title={successType === 'update' ? "Product Updated" : "Product Registered"}
//                 subtitle="Database synchronized successfully"
//                 details={[
//                     { label: "Product Name", value: successData?.name },
//                     {
//                         label: "Retail Price",
//                         value: `৳${parseFloat(successData?.selling_price || 0).toLocaleString()}`,
//                     },
//                     { label: "SKU / Code", value: successData?.product_code || "N/A" },
//                 ]}
//             />
//         </div>
//     );
// };
//
// export default ProductGrid;




/////////////////////////////////////////////////////////////////////


// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import ProductCard from "./ProductCard";
// import ProductList from "./ProductList";
// import AddProductModal from "./AddProductModal";
// import { usePosProducts } from "../../../context_or_provider/pos/products/product_provider";
// import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
// import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
// import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
// import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
// import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
// import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";
// import {
//     Package, CheckCircle2, AlertTriangle, ShoppingCart, DollarSign,
//     ArrowUpDown, Layers, Award, ChevronLeft, ChevronRight,
// } from 'lucide-react';
// import SuccessModal from "../../components/SuccessModal";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import { useDebounce } from "../../hooks/useDebounce";
//
// const PAGE_SIZE = 20;
//
// const ProductGrid = ({
//     viewType,
//     isAddOpen,
//     setIsAddOpen,
//     onStatsLoaded,
//     searchQuery,
//     filters,
//     setFilterConfig,
// }) => {
//     const { setPosProduct } = usePosProducts();
//     const [successData, setSuccessData] = useState(null);
//     const [successType, setSuccessType] = useState('create');
//
//     /* ═══ Server-side pagination state ═══ */
//     const [products, setProducts] = useState([]);
//     const [totalProducts, setTotalProducts] = useState(0);
//     const [page, setPage] = useState(1);
//     const [loadingProducts, setLoadingProducts] = useState(false);
//     const [refreshKey, setRefreshKey] = useState(0);
//
//     const debouncedSearch = useDebounce(searchQuery || "", 300);
//
//     /* 🆕 Stable filters key — prevents infinite re-fetch loop */
//     const filtersKey = useMemo(() => JSON.stringify(filters || {}), [filters]);
//
//     /* ═══ Dynamic Filter Options ═══ */
//     const [options, setOptions] = useState({
//         categories: [],
//         sub_categories: [],
//         brands: [],
//         units: [],
//         sizes: [],
//     });
//
//     useEffect(() => {
//         const fetchOptions = async () => {
//             try {
//                 const [catRes, subCatRes, brandRes, unitRes, sizeRes] = await Promise.all([
//                     posCategoryAPI.getAll(),
//                     posSubCategoryAPI.getAll(),
//                     posBrandAPI.getAll(),
//                     posUnitAPI.getAll(),
//                     posSizeAPI.getAll(),
//                 ]);
//                 setOptions({
//                     categories: (catRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                     sub_categories: (subCatRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                     brands: (brandRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                     units: (unitRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                     sizes: (sizeRes.data || []).map(i => ({ value: String(i.id), label: i.title })),
//                 });
//             } catch (error) {
//                 console.error("Error fetching filter options:", error);
//             }
//         };
//         fetchOptions();
//     }, []);
//
//     /* ═══ Filter Config → Parent ═══ */
//     useEffect(() => {
//         if (setFilterConfig) {
//             setFilterConfig({
//                 searchPlaceholder: "Search by product name or code...",
//                 filtersConfig: [
//                     {
//                         key: "category", label: "Category",
//                         icon: <Layers className="w-3.5 h-3.5" />,
//                         options: [{ value: "all", label: "All Categories" }, ...options.categories],
//                     },
//                     {
//                         key: "brand", label: "Brand",
//                         icon: <Award className="w-3.5 h-3.5" />,
//                         options: [{ value: "all", label: "All Brands" }, ...options.brands],
//                     },
//                     {
//                         key: "status", label: "Stock Status",
//                         icon: <AlertTriangle className="w-3.5 h-3.5" />,
//                         options: [
//                             { value: "all", label: "All Status" },
//                             { value: "in-stock", label: "In Stock" },
//                             { value: "out-of-stock", label: "Out of Stock" },
//                             { value: "low-stock", label: "Low Stock" },
//                             { value: "critical", label: "Critical Stock" },
//                         ],
//                     },
//                     {
//                         key: "sortBy", label: "Sort By",
//                         icon: <ArrowUpDown className="w-3.5 h-3.5" />,
//                         options: [
//                             { value: "name_asc", label: "Name (A-Z)" },
//                             { value: "name_desc", label: "Name (Z-A)" },
//                             { value: "price_asc", label: "Price (Low-High)" },
//                             { value: "price_desc", label: "Price (High-Low)" },
//                             { value: "stock_asc", label: "Stock (Low-High)" },
//                             { value: "stock_desc", label: "Stock (High-Low)" },
//                         ],
//                     },
//                 ],
//                 advancedConfig: [
//                     { key: "priceRange", type: "range", label: "Price Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
//                     {
//                         key: "sub_category", type: "select", label: "Sub Category",
//                         options: [{ value: "all", label: "All Sub Categories" }, ...options.sub_categories],
//                     },
//                     {
//                         key: "unit", type: "select", label: "Unit",
//                         options: [{ value: "all", label: "All Units" }, ...options.units],
//                     },
//                     {
//                         key: "size", type: "select", label: "Size",
//                         options: [{ value: "all", label: "All Sizes" }, ...options.sizes],
//                     },
//                     {
//                         key: "warranty", type: "select", label: "Warranty",
//                         options: [
//                             { value: "all", label: "All" },
//                             { value: "has-warranty", label: "Has Warranty" },
//                             { value: "no-warranty", label: "No Warranty" },
//                         ],
//                     },
//                     {
//                         key: "expiry", type: "select", label: "Expiry",
//                         options: [
//                             { value: "all", label: "All" },
//                             { value: "has-expiry", label: "Has Expiry" },
//                             { value: "no-expiry", label: "No Expiry" },
//                         ],
//                     },
//                 ],
//             });
//         }
//     }, [setFilterConfig, options]);
//
//     /* ═══ Stats calculation ═══ */
//     const calculateStats = useCallback((data) => {
//         const total = data.length;
//         const inStock = data.filter(p => Number(p.stock) > 0).length;
//         const outOfStock = total - inStock;
//         const totalPurchaseValue = data.reduce(
//             (acc, p) => acc + Number(p.purchase_price || 0) * Number(p.stock || 0), 0
//         );
//         const totalSellingValue = data.reduce(
//             (acc, p) => acc + Number(p.selling_price || 0) * Number(p.stock || 0), 0
//         );
//
//         return [
//             { title: 'Total Products', count: total, bgColor: 'bg-blue-600', icon: <Package size={24} /> },
//             { title: 'In Stock', count: inStock, bgColor: 'bg-green-500', icon: <CheckCircle2 size={24} /> },
//             { title: 'Out of Stock', count: outOfStock, bgColor: 'bg-red-500', icon: <AlertTriangle size={24} /> },
//             {
//                 title: 'Purchase Value',
//                 count: `৳ ${totalPurchaseValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 bgColor: 'bg-yellow-600', icon: <ShoppingCart size={24} />,
//             },
//             {
//                 title: 'Selling Value',
//                 count: `৳ ${totalSellingValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//                 bgColor: 'bg-purple-600', icon: <DollarSign size={24} />,
//             },
//         ];
//     }, []);
//
//     /* ═══════════════════════════════════════════════════════════
//        🆕 SERVER-SIDE FETCH — backend handles all filters
//        ═══════════════════════════════════════════════════════════ */
//     useEffect(() => {
//         let cancelled = false;
//
//         const fetchProducts = async () => {
//             setLoadingProducts(true);
//             try {
//                 const f = filters || {};
//                 const res = await posProductAPI.search(debouncedSearch, {
//                     page,
//                     page_size: PAGE_SIZE,
//
//                     /* Relationships */
//                     category_id:
//                         f.category && f.category !== 'all' ? f.category : undefined,
//                     sub_category_id:
//                         f.sub_category && f.sub_category !== 'all' ? f.sub_category : undefined,
//                     brand_id:
//                         f.brand && f.brand !== 'all' ? f.brand : undefined,
//                     size_id:
//                         f.size && f.size !== 'all' ? f.size : undefined,
//                     unit_id:
//                         f.unit && f.unit !== 'all' ? f.unit : undefined,
//
//                     /* Status / price / warranty / expiry */
//                     status:
//                         f.status && f.status !== 'all' ? f.status : undefined,
//                     min_price:
//                         f.priceRange?.min !== '' && f.priceRange?.min != null
//                             ? f.priceRange.min : undefined,
//                     max_price:
//                         f.priceRange?.max !== '' && f.priceRange?.max != null
//                             ? f.priceRange.max : undefined,
//                     warranty:
//                         f.warranty && f.warranty !== 'all' ? f.warranty : undefined,
//                     expiry:
//                         f.expiry && f.expiry !== 'all' ? f.expiry : undefined,
//
//                     /* Sorting */
//                     sort_by: f.sortBy || undefined,
//                 });
//
//                 if (cancelled) return;
//
//                 const data = res.data.results || res.data || [];
//                 setProducts(data);
//                 setTotalProducts(res.data.count ?? data.length ?? 0);
//                 setPosProduct(data);
//             } catch (err) {
//                 if (cancelled) return;
//                 console.error("Product fetch failed:", err);
//                 setProducts([]);
//                 setTotalProducts(0);
//             } finally {
//                 if (!cancelled) setLoadingProducts(false);
//             }
//         };
//
//         fetchProducts();
//         return () => { cancelled = true; };
//         /* eslint-disable-next-line react-hooks/exhaustive-deps */
//     }, [debouncedSearch, page, filtersKey, refreshKey, setPosProduct]);
//
//     /* 🆕 Reset page when search/filters change */
//     useEffect(() => {
//         setPage(1);
//         /* eslint-disable-next-line react-hooks/exhaustive-deps */
//     }, [debouncedSearch, filtersKey]);
//
//     /* ═══════════════════════════════════════════════════════════
//        🆕 STATS — full dataset (separate call)
//        ═══════════════════════════════════════════════════════════ */
//     useEffect(() => {
//         if (!onStatsLoaded) return;
//         let cancelled = false;
//
//         const fetchStats = async () => {
//             try {
//                 const res = await posProductAPI.getAll();
//                 if (cancelled) return;
//                 const allData = res.data?.results || res.data || [];
//                 onStatsLoaded(calculateStats(allData));
//             } catch (err) {
//                 if (cancelled) return;
//                 console.error("Stats fetch failed:", err);
//             }
//         };
//         fetchStats();
//         return () => { cancelled = true; };
//     }, [refreshKey, onStatsLoaded, calculateStats]);
//
//     /* ═══ Handlers ═══ */
//     const handleProductAdded = (newProd) => {
//         setIsAddOpen(false);
//         setSuccessType('create');
//         setSuccessData(newProd);
//         setRefreshKey(k => k + 1);
//     };
//
//     const handleProductUpdated = useCallback(() => {
//         setRefreshKey(k => k + 1);
//     }, []);
//
//     /* ═══ Loading State ═══ */
//     if (loadingProducts && products.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-20 w-full">
//                 <LoadingSpinner size="lg" />
//                 <p className="mt-4 text-gray-500 text-sm">Loading product records...</p>
//             </div>
//         );
//     }
//
//     const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
//
//     return (
//         <div className="space-y-4">
//             <div className="p-1">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1 gap-2">
//                     <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
//                         <Package size={16} className="text-blue-600" />
//                         {viewType === "grid" ? "Product Directory Grid" : "Product Directory List"}
//                     </h2>
//                     <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
//                         {loadingProducts ? (
//                             <>⏳ LOADING…</>
//                         ) : (
//                             <>
//                                 SHOWING {products.length} OF {totalProducts.toLocaleString()} RECORDS
//                                 <span className="text-gray-300 ml-1">
//                                     (PAGE {page}/{totalPages})
//                                 </span>
//                             </>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Grid / List View */}
//                 {viewType === "grid" ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {products.map(product => (
//                             <ProductCard
//                                 key={product.id}
//                                 product={product}
//                                 onEdit={handleProductUpdated}
//                                 onDelete={handleProductUpdated}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <ProductList products={products} onUpdate={handleProductUpdated} />
//                 )}
//
//                 {/* Empty State */}
//                 {!loadingProducts && products.length === 0 && (
//                     <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
//                         <Package className="w-8 h-8 text-gray-300 mx-auto mb-4" />
//                         <h3 className="text-base font-bold text-gray-800 mb-1">No products found</h3>
//                         <p className="text-gray-500 text-xs mb-4">
//                             Try changing your search or filter criteria
//                         </p>
//                         <button
//                             onClick={() => setIsAddOpen(true)}
//                             className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md active:scale-95"
//                         >
//                             Add Product
//                         </button>
//                     </div>
//                 )}
//
//                 {/* Pagination UI */}
//                 {totalProducts > PAGE_SIZE && (
//                     <div className="flex justify-center items-center gap-3 py-4 border-t border-gray-200 bg-white mt-4">
//                         <button
//                             type="button"
//                             disabled={page <= 1 || loadingProducts}
//                             onClick={() => setPage(p => Math.max(1, p - 1))}
//                             className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-bold"
//                         >
//                             <ChevronLeft size={14}/> Prev
//                         </button>
//
//                         <span className="text-[11px] font-bold text-gray-700">
//                             Page {page} / {totalPages}
//                             <span className="ml-2 text-gray-400 font-normal">
//                                 ({totalProducts.toLocaleString()} total)
//                             </span>
//                         </span>
//
//                         <button
//                             type="button"
//                             disabled={page >= totalPages || loadingProducts}
//                             onClick={() => setPage(p => p + 1)}
//                             className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-bold"
//                         >
//                             Next <ChevronRight size={14}/>
//                         </button>
//                     </div>
//                 )}
//             </div>
//
//             <AddProductModal
//                 isOpen={isAddOpen}
//                 onClose={() => setIsAddOpen(false)}
//                 onSuccess={handleProductAdded}
//             />
//
//             <SuccessModal
//                 isOpen={!!successData}
//                 onClose={() => setSuccessData(null)}
//                 title={successType === 'update' ? "Product Updated" : "Product Registered"}
//                 subtitle="Database synchronized successfully"
//                 details={[
//                     { label: "Product Name", value: successData?.name },
//                     {
//                         label: "Retail Price",
//                         value: `৳${parseFloat(successData?.selling_price || 0).toLocaleString()}`,
//                     },
//                     { label: "SKU / Code", value: successData?.product_code || "N/A" },
//                 ]}
//             />
//         </div>
//     );
// };
//
// export default ProductGrid;



import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
    Package, CheckCircle2, AlertTriangle, ShoppingCart, DollarSign,
    ArrowUpDown, Layers, Award, ChevronLeft, ChevronRight, Search, X,
} from 'lucide-react';
import SuccessModal from "../../components/SuccessModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useDebounce } from "../../hooks/useDebounce";
import api from "../../../context_or_provider/pos/posApi";

const PAGE_SIZE = 20;

const ProductGrid = ({
    viewType,
    isAddOpen,
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig,
}) => {
    const { setPosProduct } = usePosProducts();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState('create');

    /* ═══════════════════════════════════════════════════════════
       🆕 LOCAL SEARCH — input inside this component
       ═══════════════════════════════════════════════════════════ */
    const [localSearch, setLocalSearch] = useState(searchQuery || "");

    /* Sync external prop changes (e.g., parent resets) */
    useEffect(() => {
        if (searchQuery !== undefined && searchQuery !== localSearch) {
            setLocalSearch(searchQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    /* ⭐ Debounce — 300ms after user stops typing */
    const debouncedSearch = useDebounce(localSearch, 300);

    /* ═══ Server-side pagination state ═══ */
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [page, setPage] = useState(1);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    /* Stable filters key — prevents infinite re-fetch loop */
    const filtersKey = useMemo(() => JSON.stringify(filters || {}), [filters]);

    /* ═══ Dynamic Filter Options ═══ */
    const [options, setOptions] = useState({
        categories: [],
        sub_categories: [],
        brands: [],
        units: [],
        sizes: [],
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [catRes, subCatRes, brandRes, unitRes, sizeRes] = await Promise.all([
                    posCategoryAPI.getAll(),
                    posSubCategoryAPI.getAll(),
                    posBrandAPI.getAll(),
                    posUnitAPI.getAll(),
                    posSizeAPI.getAll(),
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

    /* ═══ Filter Config → Parent ═══ */
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search by product name or code...",
                filtersConfig: [
                    {
                        key: "category", label: "Category",
                        icon: <Layers className="w-3.5 h-3.5" />,
                        options: [{ value: "all", label: "All Categories" }, ...options.categories],
                    },
                    {
                        key: "brand", label: "Brand",
                        icon: <Award className="w-3.5 h-3.5" />,
                        options: [{ value: "all", label: "All Brands" }, ...options.brands],
                    },
                    {
                        key: "status", label: "Stock Status",
                        icon: <AlertTriangle className="w-3.5 h-3.5" />,
                        options: [
                            { value: "all", label: "All Status" },
                            { value: "in-stock", label: "In Stock" },
                            { value: "out-of-stock", label: "Out of Stock" },
                            { value: "low-stock", label: "Low Stock" },
                            { value: "critical", label: "Critical Stock" },
                        ],
                    },
                    {
                        key: "sortBy", label: "Sort By",
                        icon: <ArrowUpDown className="w-3.5 h-3.5" />,
                        options: [
                            { value: "name_asc", label: "Name (A-Z)" },
                            { value: "name_desc", label: "Name (Z-A)" },
                            { value: "price_asc", label: "Price (Low-High)" },
                            { value: "price_desc", label: "Price (High-Low)" },
                            { value: "stock_asc", label: "Stock (Low-High)" },
                            { value: "stock_desc", label: "Stock (High-Low)" },
                        ],
                    },
                ],
                advancedConfig: [
                    { key: "priceRange", type: "range", label: "Price Range (৳)", minPlaceholder: "Min", maxPlaceholder: "Max" },
                    {
                        key: "sub_category", type: "select", label: "Sub Category",
                        options: [{ value: "all", label: "All Sub Categories" }, ...options.sub_categories],
                    },
                    {
                        key: "unit", type: "select", label: "Unit",
                        options: [{ value: "all", label: "All Units" }, ...options.units],
                    },
                    {
                        key: "size", type: "select", label: "Size",
                        options: [{ value: "all", label: "All Sizes" }, ...options.sizes],
                    },
                    {
                        key: "warranty", type: "select", label: "Warranty",
                        options: [
                            { value: "all", label: "All" },
                            { value: "has-warranty", label: "Has Warranty" },
                            { value: "no-warranty", label: "No Warranty" },
                        ],
                    },
                    {
                        key: "expiry", type: "select", label: "Expiry",
                        options: [
                            { value: "all", label: "All" },
                            { value: "has-expiry", label: "Has Expiry" },
                            { value: "no-expiry", label: "No Expiry" },
                        ],
                    },
                ],
            });
        }
    }, [setFilterConfig, options]);

    /* ═══════════════════════════════════════════════════════════
       🆕 SERVER-SIDE FETCH — debounced search + all filters
       ═══════════════════════════════════════════════════════════ */
    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const f = filters || {};
                const res = await posProductAPI.search(debouncedSearch, {
                    page,
                    page_size: PAGE_SIZE,

                    /* Relationships */
                    category_id:
                        f.category && f.category !== 'all' ? f.category : undefined,
                    sub_category_id:
                        f.sub_category && f.sub_category !== 'all' ? f.sub_category : undefined,
                    brand_id:
                        f.brand && f.brand !== 'all' ? f.brand : undefined,
                    size_id:
                        f.size && f.size !== 'all' ? f.size : undefined,
                    unit_id:
                        f.unit && f.unit !== 'all' ? f.unit : undefined,

                    /* Status / price / warranty / expiry */
                    status:
                        f.status && f.status !== 'all' ? f.status : undefined,
                    min_price:
                        f.priceRange?.min !== '' && f.priceRange?.min != null
                            ? f.priceRange.min : undefined,
                    max_price:
                        f.priceRange?.max !== '' && f.priceRange?.max != null
                            ? f.priceRange.max : undefined,
                    warranty:
                        f.warranty && f.warranty !== 'all' ? f.warranty : undefined,
                    expiry:
                        f.expiry && f.expiry !== 'all' ? f.expiry : undefined,

                    /* Sorting */
                    sort_by: f.sortBy || undefined,
                });

                if (cancelled) return;

                const data = res.data.results || [];
                setProducts(data);
                setTotalProducts(res.data.count ?? 0);
                setPosProduct(data);
            } catch (err) {
                if (cancelled) return;
                console.error("Product fetch failed:", err);
                setProducts([]);
                setTotalProducts(0);
            } finally {
                if (!cancelled) setLoadingProducts(false);
            }
        };

        fetchProducts();
        return () => { cancelled = true; };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [debouncedSearch, page, filtersKey, refreshKey, setPosProduct]);

    /* Reset page when search/filters change */
    useEffect(() => {
        setPage(1);
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [debouncedSearch, filtersKey]);

    /* ═══════════════════════════════════════════════════════════
       🆕 STATS — from dedicated /stats/ endpoint
       ═══════════════════════════════════════════════════════════ */
    useEffect(() => {
        if (!onStatsLoaded) return;
        let cancelled = false;

        const fetchStats = async () => {
            try {
                const res = await api.get("/api/products/product/stats/");
                if (cancelled) return;

                const s = res.data;
                const stats = [
                    { title: 'Total Products', count: s.total ?? 0, bgColor: 'bg-blue-600', icon: <Package size={24} /> },
                    { title: 'In Stock', count: s.in_stock ?? 0, bgColor: 'bg-green-500', icon: <CheckCircle2 size={24} /> },
                    { title: 'Out of Stock', count: s.out_of_stock ?? 0, bgColor: 'bg-red-500', icon: <AlertTriangle size={24} /> },
                    {
                        title: 'Purchase Value',
                        count: `৳ ${Number(s.purchase_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        bgColor: 'bg-yellow-600',
                        icon: <ShoppingCart size={24} />,
                    },
                    {
                        title: 'Selling Value',
                        count: `৳ ${Number(s.selling_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                        bgColor: 'bg-purple-600',
                        icon: <DollarSign size={24} />,
                    },
                ];
                onStatsLoaded(stats);
            } catch (err) {
                if (cancelled) return;
                console.error("Stats fetch failed:", err);
                // Fallback: শূন্য stats দিয়ে UI ভাঙবে না
                onStatsLoaded([
                    { title: 'Total Products', count: 0, bgColor: 'bg-blue-600', icon: <Package size={24} /> },
                    { title: 'In Stock', count: 0, bgColor: 'bg-green-500', icon: <CheckCircle2 size={24} /> },
                    { title: 'Out of Stock', count: 0, bgColor: 'bg-red-500', icon: <AlertTriangle size={24} /> },
                    { title: 'Purchase Value', count: '৳ 0.00', bgColor: 'bg-yellow-600', icon: <ShoppingCart size={24} /> },
                    { title: 'Selling Value', count: '৳ 0.00', bgColor: 'bg-purple-600', icon: <DollarSign size={24} /> },
                ]);
            }
        };
        fetchStats();
        return () => { cancelled = true; };
    }, [refreshKey, onStatsLoaded]);

    /* ═══ Handlers ═══ */
    const handleProductAdded = (newProd) => {
        setIsAddOpen(false);
        setSuccessType('create');
        setSuccessData(newProd);
        setRefreshKey(k => k + 1);
    };

    const handleProductUpdated = useCallback(() => {
        setRefreshKey(k => k + 1);
    }, []);

    /* ═══ Search input handlers ═══ */
    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
        // Page reset is handled by the effect above on `debouncedSearch` change
    };

    const handleSearchClear = () => {
        setLocalSearch("");
    };

    /* ═══ Loading state ═══ */
    if (loadingProducts && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 text-sm">Loading product records...</p>
            </div>
        );
    }

    const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

    return (
        <div className="space-y-4">
            <div className="p-1">
                {/* ═══════ Header ═══════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1 gap-2">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Package size={16} className="text-blue-600" />
                        {viewType === "grid" ? "Product Directory Grid" : "Product Directory List"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        {loadingProducts ? (
                            <>⏳ LOADING…</>
                        ) : (
                            <>
                                SHOWING {products.length} OF {totalProducts.toLocaleString()} RECORDS
                                <span className="text-gray-300 ml-1">
                                    (PAGE {page}/{totalPages})
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* ═══════ Local Search Bar ═══════ */}
                {/*<div className="mb-4 px-1">*/}
                {/*    <div className="relative">*/}
                {/*        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">*/}
                {/*            <Search size={16} />*/}
                {/*        </span>*/}
                {/*        <input*/}
                {/*            type="text"*/}
                {/*            value={localSearch}*/}
                {/*            onChange={handleSearchChange}*/}
                {/*            placeholder="Search by name, code, or brand… (type to filter)"*/}
                {/*            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"*/}
                {/*            autoComplete="off"*/}
                {/*            spellCheck="false"*/}
                {/*        />*/}
                {/*        {localSearch && (*/}
                {/*            <button*/}
                {/*                type="button"*/}
                {/*                onClick={handleSearchClear}*/}
                {/*                title="Clear search"*/}
                {/*                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-500 transition-colors"*/}
                {/*            >*/}
                {/*                <X size={16} />*/}
                {/*            </button>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*    {localSearch && localSearch !== debouncedSearch && (*/}
                {/*        <p className="text-[10px] text-gray-400 mt-1 pl-1">*/}
                {/*            ⏳ Waiting for you to finish typing…*/}
                {/*        </p>*/}
                {/*    )}*/}
                {/*</div>*/}

                {/* ═══════ Grid / List View ═══════ */}
                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={handleProductUpdated}
                                onDelete={handleProductUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <ProductList products={products} onUpdate={handleProductUpdated} />
                )}

                {/* ═══════ Empty State ═══════ */}
                {!loadingProducts && products.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <Package className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">
                            {localSearch ? "No products match your search" : "No products found"}
                        </h3>
                        <p className="text-gray-500 text-xs mb-4">
                            {localSearch
                                ? `"${localSearch}" এর জন্য কোনো product নেই। অন্য কিছু try করুন।`
                                : "Try changing your search or filter criteria"}
                        </p>
                        {localSearch ? (
                            <button
                                onClick={handleSearchClear}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg text-xs font-bold shadow-md active:scale-95"
                            >
                                Clear Search
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsAddOpen(true)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md active:scale-95"
                            >
                                Add Product
                            </button>
                        )}
                    </div>
                )}

                {/* ═══════ Pagination ═══════ */}
                {totalProducts > PAGE_SIZE && (
                    <div className="flex justify-center items-center gap-3 py-4 border-t border-gray-200 bg-white mt-4">
                        <button
                            type="button"
                            disabled={page <= 1 || loadingProducts}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-bold"
                        >
                            <ChevronLeft size={14} /> Prev
                        </button>

                        <span className="text-[11px] font-bold text-gray-700">
                            Page {page} / {totalPages}
                            <span className="ml-2 text-gray-400 font-normal">
                                ({totalProducts.toLocaleString()} total)
                            </span>
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages || loadingProducts}
                            onClick={() => setPage(p => p + 1)}
                            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-bold"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            <AddProductModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleProductAdded}
            />

            <SuccessModal
                isOpen={!!successData}
                onClose={() => setSuccessData(null)}
                title={successType === 'update' ? "Product Updated" : "Product Registered"}
                subtitle="Database synchronized successfully"
                details={[
                    { label: "Product Name", value: successData?.name },
                    {
                        label: "Retail Price",
                        value: `৳${parseFloat(successData?.selling_price || 0).toLocaleString()}`,
                    },
                    { label: "SKU / Code", value: successData?.product_code || "N/A" },
                ]}
            />
        </div>
    );
};

export default ProductGrid;