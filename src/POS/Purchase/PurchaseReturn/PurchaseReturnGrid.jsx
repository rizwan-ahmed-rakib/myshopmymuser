import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ProductHeader from "./ProductHeader";
import ProductStats from "./ProductStats";
import ProductSearchFilter from "./ProductSearchFilter";
import PurchaseReturnCard from "./PurchaseReturnCard";
import PurchaseReturnList from "./PurchaseReturnList";
import AddPurchaseModal from "./AddPurchaseReturnModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import EditPurchaseReturnModal from "./EditPurchaseReturnModal";
import {posPurchaseReturnAPI} from "../../../context_or_provider/pos/Purchase/purchaseReturnProduct/purchaseReturnAPI";
import {usePosPurchaseReturn} from "../../../context_or_provider/pos/Purchase/purchaseReturnProduct/PurchaseReturn_provider";

const PurchaseReturnGrid = ({ viewType, isAddOpen, setIsAddOpen }) => {
    const { posPurchaseReturn,  setPosPurchaseReturn} = usePosPurchaseReturn();
    // const [viewType, setViewType] = useState("grid");

    // State for modals
    // const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingPurchaseReturn, seteditingPurchaseReturn] = useState(null);
    
    // State for success modals
    const [addSuccessData, setAddSuccessData] = useState(null);
    const [updateSuccessData, setUpdateSuccessData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        sortBy: "date_desc",
    });

    const fetchReturns = useCallback(async () => {
        setLoading(true);
        try {
            const response = await posPurchaseReturnAPI.getAll();
            setPosPurchaseReturn(response.data);
        } catch (error) {
            console.error("Error fetching purchase returns:", error);
        } finally {
            setLoading(false);
        }
    }, [setPosPurchaseReturn]);

    useEffect(() => {
        fetchReturns();
    }, [fetchReturns]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleFilter = useCallback((newFilters) => {
        setFilters(prev => ({...prev, ...newFilters}));
    }, []);

    const filteredReturns = useMemo(() => {
        if (!posPurchaseReturn || posPurchaseReturn.length === 0) return [];
        let result = [...posPurchaseReturn];
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                (item.purchase_invoice_no?.toLowerCase().includes(query) ||
                item.supplier_name?.toLowerCase().includes(query))
            );
        }

        if (filters.status !== "all") {
            result = result.filter(item => item.payment_status === filters.status);
        }

        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "date_asc":
                    return new Date(a.created_at) - new Date(b.created_at);
                case "date_desc":
                    return new Date(b.created_at) - new Date(a.created_at);
                case "amount_asc":
                    return a.total_return_amount - b.total_return_amount;
                case "amount_desc":
                    return b.total_return_amount - a.total_return_amount;
                default:
                    return 0;
            }
        });
        return result;
    }, [posPurchaseReturn, searchQuery, filters]);

    const stats = useMemo(() => {
        if (!posPurchaseReturn) return { total: 0, totalAmount: 0, totalPaid: 0, totalDue: 0 };
        return posPurchaseReturn.reduce((acc, curr) => ({
            total: acc.total + 1,
            totalAmount: acc.totalAmount + Number(curr.total_return_amount || 0),
            totalPaid: acc.totalPaid + Number(curr.paid_amount || 0),
            totalDue: acc.totalDue + Number(curr.due_amount || 0),
        }), { total: 0, totalAmount: 0, totalPaid: 0, totalDue: 0 });
    }, [posPurchaseReturn]);

    const displayStats = [
        {
            title: 'Total Returns',
            count: stats.total.toString(),
            bgColor: 'bg-blue-600',
            icon: '📦'
        },
        {
            title: 'Total Return Amount',
            count: `৳${stats.totalAmount.toLocaleString()}`,
            bgColor: 'bg-green-600',
            icon: '💰'
        },
        {
            title: 'Total Paid',
            count: `৳${stats.totalPaid.toLocaleString()}`,
            bgColor: 'bg-indigo-600',
            icon: '✅'
        },
        {
            title: 'Total Due',
            count: `৳${stats.totalDue.toLocaleString()}`,
            bgColor: 'bg-red-600',
            icon: '⏳'
        }
    ];

    // --- Modal Handlers ---

    const handleAddSuccess = (newProduct) => {
        setIsAddOpen(false);
        setAddSuccessData(newProduct);
        fetchReturns();
    };
    
    const handleEditClick = (purchase) => {
        seteditingPurchaseReturn(purchase);
    };

    const handleUpdateSuccess = (updatedData) => {
        seteditingPurchaseReturn(null);
        setUpdateSuccessData(updatedData);
        fetchReturns();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-600">Loading purchase returns...</p>
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
                <ProductSearchFilter
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                        Purchase Return Directory
                    </h2>
                    <div className="text-sm text-gray-500">
                        Showing {filteredReturns.length} of {posPurchaseReturn?.length || 0} returns
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredReturns.map(item => (
                            <PurchaseReturnCard
                                key={item.id}
                                item={item}
                                onEdit={() => handleEditClick(item)}
                                onDelete={fetchReturns}
                            />
                        ))}
                    </div>
                ) : (
                    <PurchaseReturnList
                        purchaseReturns={filteredReturns}
                        onEdit={handleEditClick}
                        onDelete={fetchReturns}
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
                 <EditPurchaseReturnModal
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
                title="Purchase Return Added!"
                successMessage="The purchase return has been successfully recorded."
            />

            {/* Success modal for updating a product */}
            {updateSuccessData && (
                 <SuccessModal
                    isOpen={!!updateSuccessData}
                    onClose={() => setUpdateSuccessData(null)}
                    purchase={updateSuccessData}
                    title="Purchase Return Added!"
                    successMessage="The purchase return has been successfully recorded."
                />
            )}
        </div>
    );
};

export default PurchaseReturnGrid;