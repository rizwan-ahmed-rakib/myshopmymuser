import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ProductHeader from "./SaleReturnHeader";
import SaleReturnStats from "./SaleReturnStats";
import SaleReturnSearchFilter from "./SaleReturnSearchFilter";
import SaleReturnCard from "./SaleReturnCard";
import SaleReturnList from "./SaleReturnList";
import AddPurchaseModal from "./AddSaleReturnModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import EditSaleReturnModal from "./EditSaleReturnModal";
import {posSaleReturnAPI} from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturnAPI";
import {usePosSaleReturn} from "../../../context_or_provider/pos/Sale/saleReturnProduct/PosSaleReturn_provider";

const SaleReturnGrid = () => {
    const {  posSaleReturn,   setPosSaleReturn} = usePosSaleReturn();
    const [viewType, setViewType] = useState("grid");

    // State for modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingPurchaseReturn, seteditingPurchaseReturn] = useState(null);
    
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
            const response = await posSaleReturnAPI.getAll();
            setPosSaleReturn(response.data);
            // You can add back calculateStats if needed
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [setPosSaleReturn]);

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
        if (!posSaleReturn || posSaleReturn.length === 0) return [];
        let result = [...posSaleReturn];
        
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
    }, [posSaleReturn, searchQuery, filters]);

    // --- Modal Handlers ---

    const handleAddSuccess = (newProduct) => {
        setIsAddOpen(false);
        setAddSuccessData(newProduct);
        fetchProducts();
    };
    
    const handleEditClick = (purchase) => {
        seteditingPurchaseReturn(purchase);
    };

    const handleUpdateSuccess = (updatedData) => {
        seteditingPurchaseReturn(null);
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
                <SaleReturnStats stats={displayStats}/>
            </div>
            <div className="mb-6">
                <SaleReturnSearchFilter
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
                        Showing {filteredProducts.length} of {posSaleReturn?.length || 0} products
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <SaleReturnCard
                                key={product.id}
                                product={product}
                                onEdit={() => handleEditClick(product)}
                                onDelete={handleDeleteSuccess}
                            />
                        ))}
                    </div>
                ) : (
                    <SaleReturnList
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

            {editingPurchaseReturn && (
                 <EditSaleReturnModal
                    open={!!editingPurchaseReturn}
                    onClose={() => seteditingPurchaseReturn(null)}
                    purchase={editingPurchaseReturn}
                    onUpdated={handleUpdateSuccess}
                />
            )}

            {/* Success modal for adding a product */}
            <SuccessModal
                isOpen={!!addSuccessData}
                purchase={addSuccessData}
                onClose={() => setAddSuccessData(null)}
                title="Sale Return Added!"
                successMessage="The Sale return has been successfully recorded."
            />

            {/* Success modal for updating a product */}
            {updateSuccessData && (
                 <SuccessModal
                    isOpen={!!updateSuccessData}
                    onClose={() => setUpdateSuccessData(null)}
                    purchase={updateSuccessData}
                    title="Sale Return Added!"
                    successMessage="The Sale return has been successfully recorded."
                />
            )}
        </div>
    );
};

export default SaleReturnGrid;