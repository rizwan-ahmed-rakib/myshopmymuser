import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ProductHeader from "./ProductHeader";
import ProductStats from "./ProductStats";
import PurchaseSearchFilter from "./PurchaseSearchFilter";
import PurchaseCard from "./PurchaseCard";
import PurchaseList from "./PurchaseList";
import AddPurchaseModal from "./AddPurchaseModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import EditPurchaseModal from "./EditPurchaseModal";
import {posPurchaseProductAPI} from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import {
    usePosPurchaseProducts
} from "../../../context_or_provider/pos/Purchase/purchaseProduct/PurchaseProduct_provider";

const PurchaseGrid = () => {
    const {posPurchaseProduct, setPosPurchaseProduct} = usePosPurchaseProducts();
    const [viewType, setViewType] = useState("grid");

    // State for modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState(null);

    // State for success modals
    const [addSuccessData, setAddSuccessData] = useState(null);
    const [updateSuccessData, setUpdateSuccessData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        inStock: 0,
        outOfStock: 0,
        totalValue: 0
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        category: "all",
        status: "all",
        sortBy: "name_asc",
        priceRange: null
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await posPurchaseProductAPI.getAll();
            setPosPurchaseProduct(response.data);
            // You can add back calculateStats if needed
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [setPosPurchaseProduct]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleFilter = useCallback((newFilters) => {
        setFilters(prev => ({...prev, ...newFilters}));
    }, []);

    const filteredProducts = useMemo(() => {
        if (!posPurchaseProduct || posPurchaseProduct.length === 0) return [];
        let result = [...posPurchaseProduct];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product =>
                (product.name?.toLowerCase().includes(query) ||
                product.product_code?.toLowerCase().includes(query))
            );
        }

        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "name_asc":
                    return (a.name || '').localeCompare(b.name || '');
                case "name_desc":
                    return (b.name || '').localeCompare(a.name || '');
                default:
                    return 0;
            }
        });
        return result;
    }, [posPurchaseProduct, searchQuery, filters]);

    // --- Modal Handlers ---

    const handleAddSuccess = (newProduct) => {
        setIsAddOpen(false);
        setAddSuccessData(newProduct);
        fetchProducts();
    };

    const handleEditClick = (purchase) => {
        setEditingPurchase(purchase);
    };

    const handleUpdateSuccess = (updatedData) => {
        setEditingPurchase(null);
        setUpdateSuccessData(updatedData);
        fetchProducts();
    };

    const handleDeleteSuccess = () => {
        fetchProducts();
    }

    const formatMoney = (value) =>
        (value || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const displayStats = [
        {
            title: 'Total Products',
            count: stats.total?.toString() || "0",
            bgColor: 'bg-blue-600',
            icon: '📦'
        },
        // Other stats can be added here
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
            <ProductHeader
                viewType={viewType}
                setViewType={setViewType}
                onAddClick={() => setIsAddOpen(true)}
            />
            <div className="mb-6">
                <ProductStats stats={displayStats}/>
            </div>
            <div className="mb-6">
                <PurchaseSearchFilter
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                        Product Directory
                    </h2>
                    <div className="text-sm text-gray-500">
                        Showing {filteredProducts.length} of {posPurchaseProduct?.length || 0} products
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <PurchaseCard
                                key={product.id}
                                product={product}
                                onEdit={() => handleEditClick(product)}
                                onDelete={handleDeleteSuccess}
                            />
                        ))}
                    </div>
                ) : (
                    <PurchaseList
                        products={filteredProducts}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteSuccess}
                    />
                )}
            </div>

            {/* --- Modals --- */}

            <AddPurchaseModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
            />

            {editingPurchase && (
                 <EditPurchaseModal
                    open={!!editingPurchase}
                    onClose={() => setEditingPurchase(null)}
                    purchase={editingPurchase}
                    onUpdated={handleUpdateSuccess}
                />
            )}

            {/* Success modal for adding a product */}
            <SuccessModal
                isOpen={!!addSuccessData}
                purchase={addSuccessData}
                onClose={() => setAddSuccessData(null)}
            />

            {/* Success modal for updating a product */}
            {updateSuccessData && (
                 <SuccessModal
                    isOpen={!!updateSuccessData}
                    onClose={() => setUpdateSuccessData(null)}
                    purchase={updateSuccessData}
                    title="Purchase Updated!"
                    successMessage="The purchase details have been updated."
                />
            )}
        </div>
    );
};

export default PurchaseGrid;