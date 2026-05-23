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

const PurchaseGrid = ({ viewType, isAddOpen, setIsAddOpen }) => {
    const {posPurchaseProduct, setPosPurchaseProduct} = usePosPurchaseProducts();
    // const [viewType, setViewType] = useState("grid");

    // State for modals
    // const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState(null);

    // State for success modals
    const [addSuccessData, setAddSuccessData] = useState(null);
    const [updateSuccessData, setUpdateSuccessData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        supplier: "all",
        status: "all",
        method: "all",
        sortBy: "date_desc",
        startDate: "",
        endDate: ""
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await posPurchaseProductAPI.getAll();
            setPosPurchaseProduct(response.data);
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

        // Search logic
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(purchase => 
                purchase.invoice_no?.toLowerCase().includes(query)
            );
        }

        // Supplier Filter
        if (filters.supplier && filters.supplier !== "all") {
            result = result.filter(purchase => purchase.supplier?.toString() === filters.supplier);
        }

        // Status Filter
        if (filters.status && filters.status !== "all") {
            result = result.filter(purchase => purchase.payment_status === filters.status);
        }

        // Method Filter
        if (filters.method && filters.method !== "all") {
            result = result.filter(purchase => purchase.payment_method === filters.method);
        }

        // Date Range Filter
        if (filters.startDate) {
            result = result.filter(purchase => new Date(purchase.created_at) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(purchase => new Date(purchase.created_at) <= end);
        }

        // Sorting logic
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "date_desc": return new Date(b.created_at) - new Date(a.created_at);
                case "date_asc": return new Date(a.created_at) - new Date(b.created_at);
                case "invoice_asc": return (a.invoice_no || '').localeCompare(b.invoice_no || '', undefined, {numeric: true});
                case "invoice_desc": return (b.invoice_no || '').localeCompare(a.invoice_no || '', undefined, {numeric: true});
                case "due_desc": return parseFloat(b.due_amount) - parseFloat(a.due_amount);
                default: return new Date(b.created_at) - new Date(a.created_at);
            }
        });
        return result;
    }, [posPurchaseProduct, searchQuery, filters]);

    // Calculate totals for stats cards
    const totals = useMemo(() => {
        return filteredProducts.reduce((acc, curr) => ({
            net_total: acc.net_total + parseFloat(curr.net_total || 0),
            paid_amount: acc.paid_amount + parseFloat(curr.paid_amount || 0),
            due_amount: acc.due_amount + parseFloat(curr.due_amount || 0),
        }), { net_total: 0, paid_amount: 0, due_amount: 0 });
    }, [filteredProducts]);

    const handleAddSuccess = (newPurchase) => {
        setIsAddOpen(false);
        setAddSuccessData(newPurchase);
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

    const displayStats = [
        { title: 'Total Invoices', count: filteredProducts.length.toString(), bgColor: 'bg-blue-600', icon: '🧾' },
        { title: 'Total Purchase', count: `৳${totals.net_total.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bgColor: 'bg-indigo-600', icon: '💰' },
        { title: 'Total Paid', count: `৳${totals.paid_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bgColor: 'bg-green-600', icon: '✅' },
        { title: 'Total Due', count: `৳${totals.due_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bgColor: 'bg-red-600', icon: '⏳' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-600">Loading purchases...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/*<ProductHeader*/}
            {/*    viewType={viewType}*/}
            {/*    setViewType={setViewType}*/}
            {/*    onAddClick={() => setIsAddOpen(true)}*/}
            {/*/>*/}
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
                        Purchase History
                    </h2>
                    <div className="text-sm text-gray-500 font-bold">
                        Showing {filteredProducts.length} of {posPurchaseProduct?.length || 0} invoices
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

            <SuccessModal
                isOpen={!!addSuccessData}
                invoice={addSuccessData}
                onClose={() => setAddSuccessData(null)}
            />

            {updateSuccessData && (
                 <SuccessModal
                    isOpen={!!updateSuccessData}
                    onClose={() => setUpdateSuccessData(null)}
                    invoice={updateSuccessData}
                />
            )}
        </div>
    );
};

export default PurchaseGrid;