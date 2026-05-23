import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SupplierDuePaymentHeader from "./SupplierDuePaymentHeader";
import SupplierDuePaymentStats from "./SupplierDuePaymentStats";
import SupplierDuePaymentSearchFilter from "./SupplierDuePaymentSearchFilter";
import SupplierDuePaymentCard from "./SupplierDuePaymentCard";
import SupplierDuePaymentList from "./SupplierDuePaymentList";
import LoadingSpinner from "./LoadingSpinner";
import { posDuePaymentAPI } from "../../../context_or_provider/pos/Purchase/duePayment/duePaymentAPI";
import { usePosDuePayment } from "../../../context_or_provider/pos/Purchase/duePayment/DuePaymentProvider";
import AddSupplierDuePaymentModal from "../../Purchase/SupplierList/AddSupplierDuePaymentModal";
import EditSupplierDuePaymentModal from "./EditSupplierDuePaymentModal";
import { usePosSuppliers } from "../../../context_or_provider/pos/Purchase/suppliers/supplierProvider";
import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";

const SupplierDuePaymentGrid = ({ viewType, isAddOpen, setIsAddOpen }) => {
    const { posDuePayments, setPosDuePayments } = usePosDuePayment();
    const { posSuppliers, setPosSuppliers } = usePosSuppliers(); 
    // const [viewType, setViewType] = useState("grid");
    // const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ method: "all", sortBy: "date_desc" });

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [paymentsRes, suppliersRes] = await Promise.all([
                posDuePaymentAPI.getAll(),
                posSupplierAPI.getAll()
            ]);
            
            const paymentsData = Array.isArray(paymentsRes.data) ? paymentsRes.data : (paymentsRes.data.results || []);
            setPosDuePayments(paymentsData);
            setPosSuppliers(suppliersRes.data);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    }, [setPosDuePayments, setPosSuppliers]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const fetchPayments = useCallback(async () => {
        try {
            const response = await posDuePaymentAPI.getAll();
            const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
            setPosDuePayments(data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    }, [setPosDuePayments]);

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setIsEditOpen(true);
    };

    const filteredPayments = useMemo(() => {
        let result = [...posDuePayments];
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => 
                item.invoice_no?.toLowerCase().includes(query) ||
                item.supplier_name?.toLowerCase().includes(query)
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
    }, [posDuePayments, searchQuery, filters]);

    const stats = useMemo(() => {
        const total = posDuePayments.length;
        const totalAmount = posDuePayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const cashTotal = posDuePayments.reduce((sum, p) => sum + Number(p.paid_cash || 0), 0);
        const digitalTotal = posDuePayments.reduce((sum, p) => sum + Number(p.paid_mobile || 0) + Number(p.paid_bank || 0), 0);

        return [
            { title: 'Total Payments', count: total.toString(), bgColor: 'bg-blue-600', icon: '📝' },
            { title: 'Total Paid', count: `৳${totalAmount.toLocaleString()}`, bgColor: 'bg-green-600', icon: '💰' },
            { title: 'Cash Payout', count: `৳${cashTotal.toLocaleString()}`, bgColor: 'bg-orange-600', icon: '💵' },
            { title: 'Digital Payout', count: `৳${digitalTotal.toLocaleString()}`, bgColor: 'bg-indigo-600', icon: '💳' }
        ];
    }, [posDuePayments]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500 font-bold animate-pulse">Loading records...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/*<SupplierDuePaymentHeader */}
            {/*    viewType={viewType} */}
            {/*    setViewType={setViewType} */}
            {/*    onAddClick={() => setIsAddOpen(true)} */}
            {/*/>*/}

            <div className="mb-8">
                <SupplierDuePaymentStats stats={stats} />
            </div>

            <SupplierDuePaymentSearchFilter 
                onSearch={setSearchQuery} 
                onFilter={setFilters} 
            />

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-gray-900">Payment Directory</h2>
                    <p className="text-sm text-gray-400 font-bold">Showing {filteredPayments.length} of {posDuePayments.length} records</p>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPayments.map(item => (
                            <SupplierDuePaymentCard 
                                key={item.id} 
                                item={item} 
                                onEdit={handleEditClick} 
                                onDelete={fetchPayments} 
                            />
                        ))}
                    </div>
                ) : (
                    <SupplierDuePaymentList 
                        payments={filteredPayments} 
                        onEdit={handleEditClick} 
                        onDelete={fetchPayments} 
                    />
                )}
            </div>

            <AddSupplierDuePaymentModal 
                isOpen={isAddOpen} 
                onClose={() => setIsAddOpen(false)} 
                onSuccess={fetchPayments} 
                suppliers={posSuppliers} 
            />
            
            <EditSupplierDuePaymentModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSuccess={fetchPayments}
                item={selectedItem}
            />
        </div>
    );
};

export default SupplierDuePaymentGrid;
