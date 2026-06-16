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
// import { AlertCircle, Package, TrendingDown, CheckCircle } from "lucide-react";
// import {posUnitAPI} from "../../../context_or_provider/pos/units/unitAPI";
// import {posBrandAPI} from "../../../context_or_provider/pos/brands/brandAPI";
// import {posSubCategoryAPI} from "../../../context_or_provider/pos/subcategories/subCategoryApi";
// import {posCategoryAPI} from "../../../context_or_provider/pos/categories/categoryAPI";
// import {posSizeAPI} from "../../../context_or_provider/pos/sizes/sizeAPI";

// const ProducLowstocktGrid = () => {
//     const {posProduct, setPosProduct} = usePosProducts();
//     const [viewType, setViewType] = useState("list");
//     const [isAddOpen, setIsAddOpen] = useState(false);
//     const [successData, setSuccessData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState({
//         total: 0,
//         lowStock: 0,
//         outOfStock: 0,
//         criticalItems: 0
//     });

//     // Options for Filters
//     const [options, setOptions] = useState({
//         categories: [],
//         sub_categories: [],
//         brands: [],
//         units: [],
//         sizes: []
//     });

//     const [searchQuery, setSearchQuery] = useState("");
//     const [filters, setFilters] = useState({
//         category: "all",
//         sub_category: "all",
//         brand: "all",
//         unit: "all",
//         size: "all",
//         status: "low-stock",
//         sortBy: "stock_asc",
//     });

//     useEffect(() => {
//         fetchInitialData();
//     }, []);

//     const fetchInitialData = async () => {
//         setLoading(true);
//         try {
//             // Fetch Products and Filter Options in parallel
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

//             setPosProduct(prodRes.data);
//             calculateStats(prodRes.data);

//             // Update filter options
//             setOptions({
//                 categories: catRes.data.map(i => ({ value: i.id, label: i.title })),
//                 sub_categories: subCatRes.data.map(i => ({ value: i.id, label: i.title })),
//                 brands: brandRes.data.map(i => ({ value: i.id, label: i.title })),
//                 units: unitRes.data.map(i => ({ value: i.id, label: i.title })),
//                 sizes: sizeRes.data.map(i => ({ value: i.id, label: i.title })),
//             });

//         } catch (error) {
//             console.error("Error fetching initial data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchProducts = async () => {
//         try {
//             const response = await posProductAPI.getAll();
//             setPosProduct(response.data);
//             calculateStats(response.data);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         }
//     };

//     const calculateStats = (products) => {
//         if (!products || products.length === 0) return;
//         const total = products.length;
//         const lowStockItems = products.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto) && Number(p.stock) > 0);
//         const outOfStock = products.filter(p => Number(p.stock) === 0).length;
//         const criticalItems = products.filter(p => Number(p.stock) <= (Number(p.alarm_when_stock_is_lessthanOrEqualto) * 0.2)).length;

//         setStats({ total, lowStock: lowStockItems.length, outOfStock, criticalItems });
//     };

//     const handleSearch = useCallback((query) => setSearchQuery(query), []);
//     const handleFilter = useCallback((newFilters) => setFilters(prev => ({...prev, ...newFilters})), []);

//     const filteredProducts = useMemo(() => {
//         if (!posProduct || posProduct.length === 0) return [];

//         let result = [...posProduct];

//         // 1. Status Based Filtering
//         if (filters.status === "low-stock") {
//             result = result.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto));
//         } else if (filters.status === "critical") {
//             result = result.filter(p => Number(p.stock) <= (Number(p.alarm_when_stock_is_lessthanOrEqualto) * 0.2));
//         } else if (filters.status === "out-of-stock") {
//             result = result.filter(p => Number(p.stock) === 0);
//         } else if (filters.status === "in-stock") {
//             result = result.filter(p => Number(p.stock) > Number(p.alarm_when_stock_is_lessthanOrEqualto));
//         }

//         // 2. Search
//         if (searchQuery.trim()) {
//             const query = searchQuery.toLowerCase();
//             result = result.filter(p => 
//                 p.name.toLowerCase().includes(query) || 
//                 p.product_code?.toLowerCase().includes(query)
//             );
//         }

//         // 3. Dropdown Filters (Category, Brand, etc.)
//         const keys = ['category', 'sub_category', 'brand', 'unit', 'size'];
//         keys.forEach(key => {
//             if (filters[key] !== "all") {
//                 result = result.filter(p => String(p[key]) === String(filters[key]));
//             }
//         });

//         // 4. Sorting
//         result.sort((a, b) => {
//             switch (filters.sortBy) {
//                 case "stock_asc": return a.stock - b.stock;
//                 case "stock_desc": return b.stock - a.stock;
//                 case "name_asc": return a.name.localeCompare(b.name);
//                 case "price_asc": return parseFloat(a.selling_price) - parseFloat(b.selling_price);
//                 case "price_desc": return parseFloat(b.selling_price) - parseFloat(a.selling_price);
//                 default: return 0;
//             }
//         });

//         return result;
//     }, [posProduct, searchQuery, filters]);

//     const displayStats = [
//         { title: 'Items to Reorder', count: filteredProducts.length.toString(), bgColor: 'bg-red-600', icon: <AlertCircle className="text-white" size={24} /> },
//         { title: 'Critical Stock', count: stats.criticalItems.toString(), bgColor: 'bg-orange-600', icon: <TrendingDown className="text-white" size={24} /> },
//         { title: 'Out of Stock', count: stats.outOfStock.toString(), bgColor: 'bg-gray-800', icon: <Package className="text-white" size={24} /> },
//         { title: 'Total Items', count: stats.total.toString(), bgColor: 'bg-blue-600', icon: <CheckCircle className="text-white" size={24} /> },
//     ];

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
//                 <LoadingSpinner size="lg"/>
//                 <p className="mt-4 text-gray-600 font-medium">Analyzing stock levels...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//             <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                         <AlertCircle className="text-red-500" size={28} />
//                         Low Stock Inventory
//                     </h1>
//                     <p className="text-gray-500 text-sm mt-1">Manage products reaching minimum stock levels</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <button onClick={() => setViewType(viewType === "grid" ? "list" : "grid")} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
//                         {viewType === "grid" ? "List View" : "Grid View"}
//                     </button>
//                     <button onClick={fetchInitialData} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
//                          Refresh Data
//                     </button>
//                 </div>
//             </div>

//             <div className="mb-8">
//                 <ProductStats stats={displayStats}/>
//             </div>

//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="p-6 border-b border-gray-50 bg-gray-50/30">
//                     <ProductSearchFilter
//                         onSearch={handleSearch}
//                         onFilter={handleFilter}
//                         dynamicOptions={options}
//                     />
//                 </div>

//                 <div className="p-4">
//                     {viewType === "grid" ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                             {filteredProducts.map(product => (
//                                 <ProductCard key={product.id} product={product} onEdit={fetchProducts} onDelete={fetchProducts} />
//                             ))}
//                         </div>
//                     ) : (
//                         <ProductList products={filteredProducts} onUpdate={fetchProducts} />
//                     )}

//                     {filteredProducts.length === 0 && (
//                         <div className="text-center py-20 bg-green-50/30 rounded-2xl border-2 border-dashed border-green-100">
//                             <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
//                             <h3 className="text-lg font-bold text-gray-900 mb-1">Stock Level Healthy!</h3>
//                             <p className="text-gray-500 max-w-xs mx-auto text-sm">No items found matching your filter criteria.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={fetchProducts} />
//             <SuccessModal isOpen={!!successData} employee={successData} onClose={() => setSuccessData(null)} />
//         </div>
//     );
// };

// export default ProducLowstocktGrid;



















import React, { useState, useEffect, useMemo, useCallback } from "react";
import ProductStats from "./ProductStats";
import ProductSearchFilter from "./ProductSearchFilter";
import ProductCard from "./ProductCard";
import ProductList from "./ProductList";
import LoadingSpinner from "./LoadingSpinner";
import { usePosProducts } from "../../../context_or_provider/pos/products/product_provider";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import { posUnitAPI } from "../../../context_or_provider/pos/units/unitAPI";
import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import { posCategoryAPI } from "../../../context_or_provider/pos/categories/categoryAPI";
import { posSizeAPI } from "../../../context_or_provider/pos/sizes/sizeAPI";

const ProducLowstocktGrid = () => {
  const { posProduct, setPosProduct } = usePosProducts();
  const [viewType, setViewType] = useState("list");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0, criticalItems: 0 });
  const [options, setOptions] = useState({ categories: [], sub_categories: [], brands: [], units: [], sizes: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all", sub_category: "all", brand: "all",
    unit: "all", size: "all", status: "low-stock", sortBy: "stock_asc",
  });

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, subCatRes, brandRes, unitRes, sizeRes] = await Promise.all([
        posProductAPI.getAll(), posCategoryAPI.getAll(), posSubCategoryAPI.getAll(),
        posBrandAPI.getAll(), posUnitAPI.getAll(), posSizeAPI.getAll(),
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

  const fetchProducts = async () => {
    try {
      const response = await posProductAPI.getAll();
      setPosProduct(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const calculateStats = (products) => {
    if (!products?.length) return;
    const total = products.length;
    const lowStock = products.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto) && Number(p.stock) > 0).length;
    const outOfStock = products.filter(p => Number(p.stock) === 0).length;
    const criticalItems = products.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto) * 0.2).length;
    setStats({ total, lowStock, outOfStock, criticalItems });
  };

  const handleSearch = useCallback((query) => setSearchQuery(query), []);
  const handleFilter = useCallback((newFilters) => setFilters(prev => ({ ...prev, ...newFilters })), []);

  const filteredProducts = useMemo(() => {
    if (!posProduct?.length) return [];
    let result = [...posProduct];

    // Status filter
    if (filters.status === "low-stock") result = result.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto));
    else if (filters.status === "critical") result = result.filter(p => Number(p.stock) <= Number(p.alarm_when_stock_is_lessthanOrEqualto) * 0.2);
    else if (filters.status === "out-of-stock") result = result.filter(p => Number(p.stock) === 0);
    else if (filters.status === "in-stock") result = result.filter(p => Number(p.stock) > Number(p.alarm_when_stock_is_lessthanOrEqualto));

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.product_code?.toLowerCase().includes(q));
    }

    // Dropdown filters
    ["category", "sub_category", "brand", "unit", "size"].forEach(key => {
      if (filters[key] !== "all") result = result.filter(p => String(p[key]) === String(filters[key]));
    });

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "stock_asc": return a.stock - b.stock;
        case "stock_desc": return b.stock - a.stock;
        case "name_asc": return a.name.localeCompare(b.name);
        case "price_asc": return parseFloat(a.selling_price) - parseFloat(b.selling_price);
        case "price_desc": return parseFloat(b.selling_price) - parseFloat(a.selling_price);
        default: return 0;
      }
    });

    return result;
  }, [posProduct, searchQuery, filters]);

  const displayStats = [
    { title: "Items to Reorder", count: filteredProducts.length.toString(), icon: "🔴" },
    { title: "Critical Stock", count: stats.criticalItems.toString(), icon: "⚠️" },
    { title: "Out of Stock", count: stats.outOfStock.toString(), icon: "📦" },
    { title: "Total Products", count: stats.total.toString(), icon: "✅" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <LoadingSpinner size="lg" className="text-indigo-500" />
        <p className="text-[13px] text-slate-500 font-medium">Analyzing stock levels...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-slate-800">Low Stock Inventory</h1>
            <p className="text-[11px] text-slate-400">Products reaching minimum stock levels</p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {/* View toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setViewType("list")}
              className={`p-1.5 rounded-md transition-all ${viewType === "list" ? "bg-slate-100 text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
            <button
              onClick={() => setViewType("grid")}
              className={`p-1.5 rounded-md transition-all ${viewType === "grid" ? "bg-slate-100 text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
          </div>

          <button
            onClick={fetchInitialData}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-medium rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <ProductStats stats={displayStats} />

      {/* Search & Filter */}
      <ProductSearchFilter onSearch={handleSearch} onFilter={handleFilter} dynamicOptions={options} />

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-[13px] font-semibold text-slate-700">
            {viewType === "grid" ? "Product Grid" : "Product List"}
          </h2>
          <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredProducts.length} / {posProduct?.length || 0} products
          </span>
        </div>

        <div className="p-4">
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onEdit={fetchProducts} onDelete={fetchProducts} />
              ))}
            </div>
          ) : (
            <ProductList products={filteredProducts} onUpdate={fetchProducts} />
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-emerald-50/40 rounded-xl border-2 border-dashed border-emerald-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-slate-700 mb-1">Stock Level Healthy!</p>
              <p className="text-[12px] text-slate-400">No items match your current filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducLowstocktGrid;