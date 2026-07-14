// import React, {useState, useEffect, useMemo, useCallback} from 'react';
// import ProductHeader from "./ProductHeader";
// import ProductStats from "./ProductStats"; // Assuming a generic stats component, can be renamed
// import ProductSearchFilter from "./ProductSearchFilter";
// import ProductCard from "./ProductCard";
// import ProductList from "./ProductList";
// import AddBrandModal from "./AddBrandModal";
// import SuccessModal from "./SuccessModal";
// import LoadingSpinner from "./LoadingSpinner";
// import {posBrandAPI} from "../../../context_or_provider/pos/brands/brandAPI";
// import {usePosBrands} from "../../../context_or_provider/pos/brands/BrandProvider";
//
// const BrandsGrid = ({ viewType, isAddOpen, setIsAddOpen }) => {
//     const {posBrands, setPosBrands} = usePosBrands();
//     // const [viewType, setViewType] = useState("grid");
//     // const [isAddOpen, setIsAddOpen] = useState(false);
//     const [successData, setSuccessData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState({
//         total: 0,
//         inStock: 0,
//         outOfStock: 0,
//         totalValue: 0
//     });
//
//     // Search and filter states
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filters, setFilters] = useState({
//         category: "all",
//         status: "all", // e.g., 'in-stock', 'out-of-stock'
//         sortBy: "name_asc",
//         priceRange: null
//     });
//
//     // Fetch products on component mount
//     useEffect(() => {
//         fetchProducts();
//     }, []);
//
//
//     const fetchProducts = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await posBrandAPI.getAll();
//             setPosBrands(response.data);
//             setStats({total: response.data.length});
//         } catch (error) {
//             console.error("Error fetching categories:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [setPosBrands]);
//
//
//     // const fetchProducts = async () => {
//     //     setLoading(true);
//     //     try {
//     //         const response = await posBrandAPI.getAll();
//     //         setPosBrands(response.data);
//     //         calculateStats(response.data);
//     //     } catch (error) {
//     //         console.error("Error fetching products:", error);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//
//
//     const calculateStats = (products) => {
//         if (!products || products.length === 0) return;
//
//         const total = products.length;
//
//         const inStock = products.filter(p => Number(p.stock) > 0).length;
//         const outOfStock = total - inStock;
//
//         const totalPurchaseValue = products.reduce((acc, p) => {
//             return acc + (Number(p.purchase_price || 0) * Number(p.stock || 0));
//         }, 0);
//
//         const totalSellingValue = products.reduce((acc, p) => {
//             return acc + (Number(p.selling_price || 0) * Number(p.stock || 0));
//         }, 0);
//
//         setStats({
//             total,
//             inStock,
//             outOfStock,
//             totalPurchaseValue,
//             totalSellingValue,
//         });
//     };
//
//     const handleSearch = useCallback((query) => {
//         setSearchQuery(query);
//     }, []);
//
//     const handleFilter = useCallback((newFilters) => {
//         setFilters(prev => ({...prev, ...newFilters}));
//     }, []);
//
//     // Filter products based on search and filters
//     const filteredProducts = useMemo(() => {
//         if (!posBrands || posBrands.length === 0) return [];
//
//         let result = [...posBrands];
//
//         // Apply search
//         if (searchQuery.trim()) {
//             const query = searchQuery.toLowerCase();
//             result = result.filter(product =>
//                 product.name.toLowerCase().includes(query) ||
//                 product.product_code?.toLowerCase().includes(query)
//             );
//         }
//
//         // Apply filters
//         if (filters.category !== "all") {
//             result = result.filter(product => product.category.toString() === filters.category);
//         }
//
//         if (filters.status !== "all") {
//             if (filters.status === "in-stock") {
//                 result = result.filter(product => product.stock > 0);
//             } else if (filters.status === "out-of-stock") {
//                 result = result.filter(product => product.stock === 0);
//             }
//         }
//
//         if (filters.priceRange) {
//             result = result.filter(product => {
//                 const price = parseFloat(product.selling_price);
//                 const passesMin = !filters.priceRange.min || price >= filters.priceRange.min;
//                 const passesMax = !filters.priceRange.max || price <= filters.priceRange.max;
//                 return passesMin && passesMax;
//             });
//         }
//
//         // Apply sorting
//         result.sort((a, b) => {
//             switch (filters.sortBy) {
//                 case "name_asc":
//                     // return a.name.localeCompare(b.name);
//                     return (a.name || '').localeCompare(b.name || '');
//                 case "name_desc":
//                     // return b.name.localeCompare(a.name);
//                     return (b.name || '').localeCompare(a.name || '');
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
//     }, [posBrands, searchQuery, filters]);
//
//     const handleProductAdded = (newProduct) => {
//         setPosBrands(prev => [newProduct, ...prev]);
//         setIsAddOpen(false);
//         setSuccessData(newProduct);
//         fetchProducts(); // Re-fetch to ensure data consistency
//     };
//
//     const handleProductUpdated = useCallback(() => {
//         fetchProducts();
//     }, []);
//
//     // const displayStats = [
//     //     {title: 'Total Products', count: stats.total.toString(), bgColor: 'bg-blue-600', icon: '📦'},
//     //     {title: 'In Stock', count: stats.inStock.toString(), bgColor: 'bg-green-500', icon: '✅'},
//     //     {title: 'Out of Stock', count: stats.outOfStock.toString(), bgColor: 'bg-red-500', icon: '❌'},
//     //     {
//     //         title: 'Total Stock Value',
//     //         count: `$${Math.round(stats.totalValue).toLocaleString()}`,
//     //         bgColor: 'bg-purple-600',
//     //         icon: '💰'
//     //     }
//     // ];
//
//
//     const formatMoney = (value) =>
//         value.toLocaleString(undefined, {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//         });
//
//
//     const displayStats = [
//         {
//             title: 'Total Products',
//             count: stats.total?.toString() || "0",
//             bgColor: 'bg-blue-600',
//             icon: '📦'
//         },
//         {
//             title: 'In Stock',
//             count: stats.inStock?.toString() || "0",
//             bgColor: 'bg-green-500',
//             icon: '✅'
//         },
//         {
//             title: 'Out of Stock',
//             count: stats.outOfStock?.toString() || "0",
//             bgColor: 'bg-red-500',
//             icon: '❌'
//         },
//         {
//             title: 'Total Purchase Stock Value',
//             count: `৳ ${formatMoney(stats.totalPurchaseValue || 0)}`,
//             bgColor: 'bg-yellow-600',
//             icon: '🛒'
//         },
//         {
//             title: 'Total Selling Stock Value',
//             count: `৳ ${formatMoney(stats.totalSellingValue || 0)}`,
//             bgColor: 'bg-purple-600',
//             icon: '💰'
//         },
//     ];
//
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
//             {/*<ProductHeader*/}
//             {/*    viewType={viewType}*/}
//             {/*    setViewType={setViewType}*/}
//             {/*    onAddClick={() => setIsAddOpen(true)}*/}
//             {/*/>*/}
//             <div className="mb-6">
//                 <ProductStats stats={displayStats}/>
//             </div>
//             <div className="mb-6">
//                 <ProductSearchFilter
//                     onSearch={handleSearch}
//                     onFilter={handleFilter}
//                 />
//             </div>
//             <div className="bg-white rounded-xl shadow-sm p-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
//                     <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
//                         {viewType === "grid" ? "Product Directory" : "Product List"}
//                     </h2>
//                     <div className="text-sm text-gray-500">
//                         Showing {filteredProducts.length} of {posBrands?.length || 0} products
//                     </div>
//                 </div>
//
//                 {viewType === "grid" ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {filteredProducts.map(product => (
//                             <ProductCard
//                                 key={product.id}
//                                 product={product}
//                                 onEdit={handleProductUpdated}
//                                 onDelete={handleProductUpdated}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <ProductList
//                         products={filteredProducts}
//                         onUpdate={handleProductUpdated}
//                     />
//                 )}
//
//                 {filteredProducts.length === 0 && (
//                     <div className="text-center py-12">
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//                         <p className="text-gray-600 mb-4">
//                             {searchQuery || Object.values(filters).some(f => f !== "all" && f !== null)
//                                 ? "Try changing your search or filter criteria"
//                                 : "Add your first product to get started"
//                             }
//                         </p>
//                         <button
//                             onClick={() => setIsAddOpen(true)}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                             Add Product
//                         </button>
//                     </div>
//                 )}
//             </div>
//
//             <AddBrandModal
//                 isOpen={isAddOpen}
//                 onClose={() => setIsAddOpen(false)}
//                 onSuccess={handleProductAdded}
//             />
//
//             <SuccessModal
//                 isOpen={!!successData}
//                 employee={successData} // This should be updated to a generic 'item' if reused
//                 onClose={() => setSuccessData(null)}
//             />
//         </div>
//     );
// };
//
// export default BrandsGrid;


import React, { useState, useEffect, useCallback } from 'react';
import ProductBrandCard from "./ProductBrandCard";
import ProductBrandList from "./ProductBrandList";
import AddBrandModal from "./AddBrandModal";
import SuccessModal from "../../components/SuccessModal";
import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
import { usePosBrands } from "../../../context_or_provider/pos/brands/BrandProvider";
import { Award, ArrowUpDown } from 'lucide-react';
import useModuleData from "../../hooks/useModuleData";
import LoadingSpinner from "../../components/LoadingSpinner";

const BrandsGrid = ({
    viewType,
    isAddOpen,
    setIsAddOpen,
    onStatsLoaded,
    searchQuery,
    filters,
    setFilterConfig
}) => {
    const { posBrands, setPosBrands } = usePosBrands();
    const [successData, setSuccessData] = useState(null);

    // 1. Provide Filter Configuration to Parent Container
    useEffect(() => {
        if (setFilterConfig) {
            setFilterConfig({
                searchPlaceholder: "Search brand by title...",
                filtersConfig: [
                    { key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5" />, options: [
                        { value: "name_asc", label: "Title (A-Z)" },
                        { value: "name_desc", label: "Title (Z-A)" }
                    ]}
                ],
                advancedConfig: []
            });
        }
    }, [setFilterConfig]);

    // 2. Stats Calculation
    const calculateStats = useCallback((data) => {
        return [
            { title: 'Total Brands', count: data.length, bgColor: 'bg-purple-600', icon: <Award size={24} /> }
        ];
    }, []);

    // 3. Centralized Hook Integration
    const {
        filteredData: filteredBrands,
        rawData: posBrandsData,
        loading,
        refresh
    } = useModuleData({
        apiFetch: posBrandAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['title'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            let result = [...data];

            // Sorting
            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "name_asc") return (a.title || "").localeCompare(b.title || "");
                    if (f.sortBy === "name_desc") return (b.title || "").localeCompare(a.title || "");
                    return 0;
                });
            }
            return result;
        }
    });

    // Sync Context Provider
    useEffect(() => {
        if (posBrandsData) setPosBrands(posBrandsData);
    }, [posBrandsData, setPosBrands]);

    const handleProductAdded = (newBrand) => {
        setIsAddOpen(false);
        setSuccessData(newBrand);
        refresh();
    };

    const handleProductUpdated = useCallback(() => {
        refresh();
    }, [refresh]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 w-full">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500 text-sm">Loading brand records...</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <Award size={16} className="text-purple-600" />
                        {viewType === "grid" ? "Brand Grid" : "Brand List"}
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredBrands.length} OF {posBrandsData?.length || 0} RECORDS
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBrands.map(brand => (
                            <ProductBrandCard
                                key={brand.id}
                                product={brand}
                                onEdit={handleProductUpdated}
                                onDelete={handleProductUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <ProductBrandList products={filteredBrands} onUpdate={handleProductUpdated} />
                )}

                {filteredBrands.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 mt-4">
                        <Award className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base font-bold text-gray-800 mb-1">No brands found</h3>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold mt-4 shadow-md active:scale-95"
                        >
                            Add Brand
                        </button>
                    </div>
                )}
            </div>

            <AddBrandModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleProductAdded} />
            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title="Brand Registered"
                subtitle="New brand entry created successfully"
                details={[
                    { label: "Brand Title", value: successData?.title },
                    { label: "Brand ID", value: `#BRD-${successData?.id}` }
                ]}
            />
        </div>
    );
};

export default BrandsGrid;