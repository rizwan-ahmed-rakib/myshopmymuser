import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CustomerDueCollectionHeader from "./CustomerDueCollectionHeader";
import CustomerDueCollectionStats from "./CustomerDueCollectionStats";
import CustomerDueCollectionSearchFilter from "./CustomerDueCollectionSearchFilter";
import CustomerDueCollectionCard from "./CustomerDueCollectionCard";
import CustomerDueCollectionList from "./CustomerDueCollectionList";
import LoadingSpinner from "./LoadingSpinner";
import { posDueCollectionAPI } from "../../../context_or_provider/pos/Sale/dueCollection/dueCollectionAPI";
import { usePosDueCollection } from "../../../context_or_provider/pos/Sale/dueCollection/DueCollectionProvider";
import AddCustomerDueCollectionModal from "../../Sales/CustomerList/AddCustomerDueCollectionModal";
import EditCustomerDueCollectionModal from "./EditCustomerDueCollectionModal";
import { usePosCustomers } from "../../../context_or_provider/pos/Sale/customer/PosCustomerProvider";
import { posCustomerAPI } from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";

const CustomerDueCollectionGrid = () => {
    const { posDueCollections, setPosDueCollections } = usePosDueCollection();
    const { posCustomers, setPosCustomers } = usePosCustomers();
    const [viewType, setViewType] = useState("grid");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ method: "all", sortBy: "date_desc" });

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [collectionsRes, customersRes] = await Promise.all([
                posDueCollectionAPI.getAll(),
                posCustomerAPI.getAll()
            ]);
            
            const collectionsData = Array.isArray(collectionsRes.data) ? collectionsRes.data : (collectionsRes.data.results || []);
            setPosDueCollections(collectionsData);
            setPosCustomers(customersRes.data);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    }, [setPosDueCollections, setPosCustomers]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const fetchCollections = useCallback(async () => {
        try {
            const response = await posDueCollectionAPI.getAll();
            const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
            setPosDueCollections(data);
        } catch (error) {
            console.error("Error fetching collections:", error);
        }
    }, [setPosDueCollections]);

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setIsEditOpen(true);
    };

    const filteredCollections = useMemo(() => {
        let result = [...posDueCollections];
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => 
                item.invoice_no?.toLowerCase().includes(query) ||
                item.customer_name?.toLowerCase().includes(query)
            );
        }

        if (filters.method !== "all") {
            result = result.filter(item => item.payment_method === filters.method);
        }

        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "date_asc": return new Date(a.created_at) - new Date(b.created_at);
                case "date_desc": return new Date(b.created_at) - new Date(a.created_at);
                case "amount_asc": return a.amount - b.amount;
                case "amount_desc": return b.amount - a.amount;
                default: return 0;
            }
        });

        return result;
    }, [posDueCollections, searchQuery, filters]);

    const stats = useMemo(() => {
        const total = posDueCollections.length;
        const totalAmount = posDueCollections.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const cashTotal = posDueCollections.reduce((sum, p) => sum + Number(p.paid_cash || 0), 0);
        const digitalTotal = posDueCollections.reduce((sum, p) => sum + Number(p.paid_mobile || 0) + Number(p.paid_bank || 0), 0);

        return [
            { title: 'Total Collections', count: total.toString(), bgColor: 'bg-blue-600', icon: '📥' },
            { title: 'Total Collected', count: `৳${totalAmount.toLocaleString()}`, bgColor: 'bg-green-600', icon: '💰' },
            { title: 'Cash Received', count: `৳${cashTotal.toLocaleString()}`, bgColor: 'bg-orange-600', icon: '💵' },
            { title: 'Digital Received', count: `৳${digitalTotal.toLocaleString()}`, bgColor: 'bg-indigo-600', icon: '💳' }
        ];
    }, [posDueCollections]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 font-bold animate-pulse">Loading collection history...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <CustomerDueCollectionHeader 
                viewType={viewType} 
                setViewType={setViewType} 
                onAddClick={() => setIsAddOpen(true)} 
            />

            <div className="mb-8">
                <CustomerDueCollectionStats stats={stats} />
            </div>

            <CustomerDueCollectionSearchFilter 
                onSearch={setSearchQuery} 
                onFilter={setFilters} 
            />

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-gray-900">Collection History</h2>
                    <p className="text-sm text-gray-400 font-bold">Showing {filteredCollections.length} of {posDueCollections.length} records</p>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCollections.map(item => (
                            <CustomerDueCollectionCard 
                                key={item.id} 
                                item={item} 
                                onEdit={handleEditClick} 
                                onDelete={fetchCollections} 
                            />
                        ))}
                    </div>
                ) : (
                    <CustomerDueCollectionList 
                        collections={filteredCollections} 
                        onEdit={handleEditClick} 
                        onDelete={fetchCollections} 
                    />
                )}
            </div>

            <AddCustomerDueCollectionModal 
                isOpen={isAddOpen} 
                onClose={() => setIsAddOpen(false)} 
                onSuccess={fetchCollections} 
                customers={posCustomers} 
            />
            
            <EditCustomerDueCollectionModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSuccess={fetchCollections}
                item={selectedItem}
            />
        </div>
    );
};

export default CustomerDueCollectionGrid;
