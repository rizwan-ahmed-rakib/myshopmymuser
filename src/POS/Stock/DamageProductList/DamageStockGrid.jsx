import React, {useState, useEffect, useMemo, useCallback} from 'react';
import DamageStockStats from "./DamageStockStats";
import DamageStockSearchFilter from "./DamageStockSearchFilter";
import DamageStockCard from "./DamageStockCard";
import DamageStockList from "./DamageStockList";
import AddDamageStockModal from "./AddDamageStockModal";
import UpdateDamageStockModal from "./UpdateDamageStockModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {usePosDamageProducts} from "../../../context_or_provider/pos/damageProducts/damage_product_provider";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";
import GenericModuleLayout from "../../components/GenericModuleLayout";

const DamageStockGrid = ({ viewType, setViewType, isAddOpen, setIsAddOpen }) => {
    const { posDamageProduct, setPosDamageProduct} = usePosDamageProducts();
    const [successData, setSuccessData] = useState(null);
    const [successType, setSuccessType] = useState("create");
    const [loading, setLoading] = useState(true);
    
    const [editRecord, setEditRecord] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    
    const [stats, setStats] = useState({
        total: 0, totalQuantity: 0, totalLoss: 0,
        returnableCount: 0, nonReturnableCount: 0,
        compensatedCount: 0, uncompensatedCount: 0
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        damageType: "all", compensationStatus: "all", sortBy: "date_desc"
    });

    useEffect(() => { fetchDamageStock(); }, []);

    const fetchDamageStock = async () => {
        setLoading(true);
        try {
            const res = await posDamageProductAPI.getAll();
            setPosDamageProduct(res.data);
            calculateStats(res.data);
        } catch (e) {} finally { setLoading(false); }
    };

    const calculateStats = (records) => {
        if (!records) return;
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

    const filteredRecords = useMemo(() => {
        if (!posDamageProduct) return [];
        let result = [...posDamageProduct];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(r => r.product_name?.toLowerCase().includes(q) || r.reference_no?.toLowerCase().includes(q));
        }
        if (filters.damageType !== "all") result = result.filter(r => r.damage_type === filters.damageType);
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return result;
    }, [posDamageProduct, searchQuery, filters]);

    const displayStats = [
        { title: 'Total Records', count: stats.total, bgColor: 'bg-blue-600', icon: '📦' },
        { title: 'Total Quantity', count: stats.totalQuantity, bgColor: 'bg-orange-500', icon: '🔢' },
        { title: 'Total Loss', count: `৳${stats.totalLoss.toFixed(2)}`, bgColor: 'bg-red-600', icon: '💰' },
        { title: 'Compensated', count: stats.compensatedCount, bgColor: 'bg-green-600', icon: '✅' },
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg"/></div>;

    return (
        <GenericModuleLayout
            title="Damage Product Management"
            stats={displayStats}
            totalFilteredCount={filteredRecords.length}
            totalCount={posDamageProduct.length}
            viewType={viewType}
            setViewType={setViewType}
            onAdd={() => setIsAddOpen(true)}
            addText="Record Damage"
            filters={
                <DamageStockSearchFilter 
                    onSearch={(q) => setSearchQuery(q)} 
                    onFilter={(f) => setFilters(prev => ({...prev, ...f}))} 
                />
            }
        >
            {viewType === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredRecords.map(r => (
                        <DamageStockCard key={r.id} record={r} onEdit={() => { setEditRecord(r); setIsEditOpen(true); }} onDelete={fetchDamageStock} />
                    ))}
                </div>
            ) : (
                <DamageStockList records={filteredRecords} onEdit={(r) => { setEditRecord(r); setIsEditOpen(true); }} onUpdate={fetchDamageStock} />
            )}

            <AddDamageStockModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={(r) => { setSuccessData(r); setSuccessType("create"); fetchDamageStock(); }} />
            {isEditOpen && (
                <UpdateDamageStockModal isOpen={isEditOpen} recordData={editRecord} onClose={() => { setIsEditOpen(false); setEditRecord(null); }} onSuccess={(r) => { setSuccessData(r); setSuccessType("update"); fetchDamageStock(); }} />
            )}
            <SuccessModal isOpen={!!successData} data={successData} type={successType} onClose={() => setSuccessData(null)} />
        </GenericModuleLayout>
    );
};

export default DamageStockGrid;
