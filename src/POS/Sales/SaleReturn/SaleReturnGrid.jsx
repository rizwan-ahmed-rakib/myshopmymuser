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
        totalCount: 0,
        totalNetAmount: 0,
        totalDueAmount: 0,
        paidCount: 0
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        payment_method: "all",
        status: "all",
        sortBy: "date_desc",
        priceRange: null
    });

    const formatMoney = (value) =>
        (Number(value) || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const calculateStats = useCallback((data) => {
        const totalCount = data.length;
        const totalNetAmount = data.reduce((sum, item) => sum + Number(item.net_return_amount || 0), 0);
        const totalDueAmount = data.reduce((sum, item) => sum + Number(item.due_amount || 0), 0);
        const paidCount = data.filter(item => item.payment_status === 'paid').length;

        setStats({
            totalCount,
            totalNetAmount,
            totalDueAmount,
            paidCount
        });
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await posSaleReturnAPI.getAll();
            setPosSaleReturn(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [setPosSaleReturn, calculateStats]);

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
            result = result.filter(item =>
                (item.customer_name?.toLowerCase().includes(query) ||
                item.sale_invoice_no?.toLowerCase().includes(query))
            );
        }

        if (filters.status !== "all") {
            result = result.filter(item => item.payment_status === filters.status);
        }

        if (filters.payment_method && filters.payment_method !== "all") {
            result = result.filter(item => {
                if (filters.payment_method === 'cash') return Number(item.paid_cash) > 0;
                if (filters.payment_method === 'bkash') return item.mobile_operator?.toLowerCase() === 'bkash';
                if (filters.payment_method === 'nagad') return item.mobile_operator?.toLowerCase() === 'nagad';
                if (filters.payment_method === 'bank') return Number(item.paid_bank) > 0;
                return true;
            });
        }

        if (filters.priceRange) {
            const { min, max } = filters.priceRange;
            if (min !== null) result = result.filter(item => Number(item.net_return_amount) >= min);
            if (max !== null) result = result.filter(item => Number(item.net_return_amount) <= max);
        }

        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "date_desc":
                    return new Date(b.created_at) - new Date(a.created_at);
                case "date_asc":
                    return new Date(a.created_at) - new Date(b.created_at);
                case "amount_desc":
                    return Number(b.net_return_amount) - Number(a.net_return_amount);
                case "amount_asc":
                    return Number(a.net_return_amount) - Number(b.net_return_amount);
                case "customer_asc":
                    return (a.customer_name || '').localeCompare(b.customer_name || '');
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
    
    const displayStats = [
        {
            title: 'Total Returns',
            count: stats.totalCount?.toString() || "0",
            bgColor: 'bg-blue-600',
            icon: '📄'
        },
        {
            title: 'Net Return Amount',
            count: `৳${formatMoney(stats.totalNetAmount)}`,
            bgColor: 'bg-green-600',
            icon: '💰'
        },
        {
            title: 'Total Due',
            count: `৳${formatMoney(stats.totalDueAmount)}`,
            bgColor: 'bg-red-600',
            icon: '📉'
        },
        {
            title: 'Paid Returns',
            count: stats.paidCount?.toString() || "0",
            bgColor: 'bg-purple-600',
            icon: '✅'
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-600">Loading returns...</p>
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
                        Sale Return Directory
                    </h2>
                    <div className="text-sm text-gray-500">
                        Showing {filteredProducts.length} of {posSaleReturn?.length || 0} returns
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