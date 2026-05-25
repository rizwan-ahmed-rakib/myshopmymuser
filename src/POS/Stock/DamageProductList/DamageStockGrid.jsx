import React, {useState, useEffect, useMemo, useCallback} from 'react';
import DamageStockHeader from "./DamageStockHeader";
import DamageStockStats from "./DamageStockStats";
import DamageStockSearchFilter from "./DamageStockSearchFilter";
import DamageStockCard from "./DamageStockCard";
import DamageStockList from "./DamageStockList";
import AddDamageStockModal from "./AddDamageStockModal";
import UpdateDamageStockModal from "./UpdateDamageStockModal";
import SuccessModal from "./SuccessModal";
import SuccessPopup from "./SuccessPopup";
import LoadingSpinner from "./LoadingSpinner";
import {usePosDamageProducts} from "../../../context_or_provider/pos/damageProducts/damage_product_provider";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";

const DamageStockGrid = ({ viewType, isAddOpen, setIsAddOpen }) => {
    const { posDamageProduct, setPosDamageProduct} = usePosDamageProducts();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState("create");
    const [loading, setLoading] = useState(true);
    
    // Edit States
    const [editRecord, setEditRecord] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    
    const [stats, setStats] = useState({
        total: 0, totalQuantity: 0, totalLoss: 0,
        returnableCount: 0, nonReturnableCount: 0,
        compensatedCount: 0, uncompensatedCount: 0
    });

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        damageType: "all",
        compensationStatus: "all",
        sortBy: "date_desc",
        dateRange: null
    });

    useEffect(() => {
        fetchDamageStock();
    }, []);

    const fetchDamageStock = async () => {
        setLoading(true);
        try {
            const response = await posDamageProductAPI.getAll();
            setPosDamageProduct(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error("Error fetching damage stock:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (records) => {
        if (!records || records.length === 0) return;
        setStats({
            total: records.length,
            totalQuantity: records.reduce((acc, r) => acc + (r.quantity || 0), 0),
            totalLoss: records.reduce((acc, r) => acc + parseFloat(r.total_loss || 0), 0),
            returnableCount: records.filter(r => r.damage_type === 'returnable').length,
            nonReturnableCount: records.filter(r => r.damage_type === 'non_returnable').length,
            compensatedCount: records.filter(r => r.is_compensated === true).length,
            uncompensatedCount: records.filter(r => r.is_compensated === false).length
        });
    };

    const handleSearch = useCallback((query) => setSearchQuery(query), []);
    const handleFilter = useCallback((newFilters) => setFilters(prev => ({...prev, ...newFilters})), []);

    const filteredRecords = useMemo(() => {
        if (!posDamageProduct) return [];
        let result = [...posDamageProduct];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(r => 
                r.product_name?.toLowerCase().includes(q) || 
                r.product_code?.toLowerCase().includes(q) ||
                r.reference_no?.toLowerCase().includes(q)
            );
        }
        if (filters.damageType !== "all") result = result.filter(r => r.damage_type === filters.damageType);
        if (filters.compensationStatus !== "all") {
            result = result.filter(r => r.is_compensated === (filters.compensationStatus === "compensated"));
        }
        // Sorting logic (kept as is)
        result.sort((a, b) => {
            if (filters.sortBy === "date_desc") return new Date(b.created_at) - new Date(a.created_at);
            return 0;
        });
        return result;
    }, [posDamageProduct, searchQuery, filters]);

    // Handlers for Success
    const handleRecordAdded = (newRecord) => {
        setSuccessType("create");
        setSuccessData(newRecord);
        setIsAddOpen(false);
        fetchDamageStock();
    };

    const handleRecordUpdated = (updatedRecord) => {
        setSuccessType("update");
        setSuccessData(updatedRecord);
        setIsEditOpen(false);
        setEditRecord(null);
        fetchDamageStock();
    };

    const handleEditClick = (record) => {
        setEditRecord(record);
        setIsEditOpen(true);
    };

    const formatMoney = (v) => v.toLocaleString(undefined, { minimumFractionDigits: 2 });

    const displayStats = [
        { title: 'Total Records', count: stats.total.toString(), bgColor: 'bg-blue-600', icon: '📦' },
        { title: 'Total Qty', count: stats.totalQuantity.toString(), bgColor: 'bg-orange-500', icon: '🔢' },
        { title: 'Returnable', count: stats.returnableCount.toString(), bgColor: 'bg-green-500', icon: '↩️' },
        { title: 'Non-Returnable', count: stats.nonReturnableCount.toString(), bgColor: 'bg-red-500', icon: '❌' },
        { title: 'Compensated', count: stats.compensatedCount.toString(), bgColor: 'bg-teal-500', icon: '✅' },
        { title: 'Un Compensated', count: stats.uncompensatedCount.toString(), bgColor: 'bg-blue-500', icon: '✅' },
        { title: 'Total Loss', count: `৳ ${formatMoney(stats.totalLoss)}`, bgColor: 'bg-purple-600', icon: '💰' },
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg"/></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mb-6"><DamageStockStats stats={displayStats}/></div>
            <div className="mb-6"><DamageStockSearchFilter onSearch={handleSearch} onFilter={handleFilter}/></div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRecords.map(record => (
                            <DamageStockCard 
                                key={record.id} 
                                record={record} 
                                onEdit={() => handleEditClick(record)} 
                                onDelete={fetchDamageStock} 
                            />
                        ))}
                    </div>
                ) : (
                    <DamageStockList records={filteredRecords} onEdit={handleEditClick} onUpdate={fetchDamageStock} />
                )}
            </div>

            {/* Global Modals */}
            <AddDamageStockModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={handleRecordAdded} />
            
            {isEditOpen && editRecord && (
                <UpdateDamageStockModal 
                    isOpen={isEditOpen} 
                    onClose={() => { setIsEditOpen(false); setEditRecord(null); }} 
                    onSuccess={handleRecordUpdated} 
                    recordData={editRecord} 
                />
            )}

            <SuccessModal 
                isOpen={!!successData} 
                data={successData} 
                type={successType}
                onClose={() => setSuccessData(null)} 
            />
        </div>
    );
};

export default DamageStockGrid;
