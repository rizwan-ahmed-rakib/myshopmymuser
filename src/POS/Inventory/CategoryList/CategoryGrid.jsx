import React, {useState, useEffect, useMemo, useCallback} from 'react';
import CategoryHeader from "./CategoryHeader";
import CategoryStats from "./CategoryStats";
import CategorySearchFilter from "./CategorySearchFilter";
import CategoryCard from "./CategoryCard";
import CategoryList from "./CategoryList";
import AddCategoryModal from "./AddCategoryModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {usePosCategory} from "../../../context_or_provider/pos/categories/CategoryProvider";
import {posCategoryAPI} from "../../../context_or_provider/pos/categories/categoryAPI";

const CategoryGrid = () => {
    const {posCategories, setPosCategories} = usePosCategory();
    const [viewType, setViewType] = useState("grid");
    const [isAddOpen, setIsAddOpen] = useState(false);
    // const [successData, setSuccessData] = useState(null);
    const {successData, setSuccessData} = usePosCategory();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({total: 0});

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        category: "all",
        status: "all", // e.g., 'in-stock', 'out-of-stock'
        sortBy: "name_asc",
        priceRange: null
    });


    // Fetch categories on component mount
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await posCategoryAPI.getAll();
            setPosCategories(response.data);
            setStats({total: response.data.length});
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, [setPosCategories]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleFilter = useCallback((newFilters) => {
        setFilters(prev => ({...prev, ...newFilters}));
    }, []);


    // Filter categories based on search

    // const filteredCategories = useMemo(() => {
    //     if (!posCategories) return [];
    //     let result = [...posCategories];
    //     if (searchQuery.trim()) {
    //         const query = searchQuery.toLowerCase();
    //         result = result.filter(category =>
    //             category.title.toLowerCase().includes(query)
    //         );
    //     }
    //     return result;
    // }, [posCategories, searchQuery]);


    const filteredCategories = useMemo(() => {
        if (!posCategories || posCategories.length === 0) return [];

        let result = [...posCategories];

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.product_code?.toLowerCase().includes(query)
            );
        }

        // Apply filters
        if (filters.category !== "all") {
            result = result.filter(product => product.category.toString() === filters.category);
        }

        if (filters.status !== "all") {
            if (filters.status === "in-stock") {
                result = result.filter(product => product.stock > 0);
            } else if (filters.status === "out-of-stock") {
                result = result.filter(product => product.stock === 0);
            }
        }

        if (filters.priceRange) {
            result = result.filter(product => {
                const price = parseFloat(product.selling_price);
                const passesMin = !filters.priceRange.min || price >= filters.priceRange.min;
                const passesMax = !filters.priceRange.max || price <= filters.priceRange.max;
                return passesMin && passesMax;
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "name_asc":
                    // return a.name.localeCompare(b.name);
                    return (a.name || '').localeCompare(b.name || '');
                case "name_desc":
                    // return b.name.localeCompare(a.name);
                    return (b.name || '').localeCompare(a.name || '');
                case "price_asc":
                    return parseFloat(a.selling_price) - parseFloat(b.selling_price);
                case "price_desc":
                    return parseFloat(b.selling_price) - parseFloat(a.selling_price);
                case "stock_asc":
                    return a.stock - b.stock;
                case "stock_desc":
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });

        return result;
    }, [posCategories, searchQuery, searchQuery]);


    const handleCategoryAdded = (newCategory) => {
        setPosCategories(prev => [newCategory, ...prev]);
        setIsAddOpen(false);
        setSuccessData(newCategory);
        fetchCategories(); // Re-fetch to ensure data consistency
    };

    const handleCategoryUpdated = useCallback(() => {
        fetchCategories();
    }, [fetchCategories]);

    const displayStats = [
        {title: 'Total Categories', count: stats.total.toString(), bgColor: 'bg-blue-600', icon: '📦'},
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
        );
    }

    return (
        // The PosCategoryProvider should wrap this component in the main App/Router file
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <CategoryHeader
                viewType={viewType}
                setViewType={setViewType}
                onAddClick={() => setIsAddOpen(true)}
            />
            <div className="mb-6">
                <CategoryStats stats={displayStats}/>
            </div>
            <div className="mb-6">
                <CategorySearchFilter
                    onSearch={handleSearch}
                    onFilter={handleFilter}

                />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                        {viewType === "grid" ? "Category Directory" : "Category List"}
                    </h2>
                    <div className="text-sm text-gray-500">
                        Showing {filteredCategories.length} of {posCategories?.length || 0} categories
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCategories.map(category => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onEdit={handleCategoryUpdated}
                                onDelete={handleCategoryUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <CategoryList
                        categories={filteredCategories}
                        onUpdate={handleCategoryUpdated}
                    />
                )}

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchQuery ? "Try changing your search criteria" : "Add your first category to get started"}
                        </p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add Category
                        </button>
                    </div>
                )}
            </div>

            <AddCategoryModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleCategoryAdded}
            />

            <SuccessModal
                isOpen={!!successData}
                employee={successData} // This should be updated to a generic 'item' if reused
                onClose={() => setSuccessData(null)}
            />
        </div>
    );
};

export default CategoryGrid;
