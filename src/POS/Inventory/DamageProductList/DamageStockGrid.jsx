import React, {useState, useEffect, useMemo, useCallback} from 'react';
import DamageStockHeader from "./DamageStockHeader";
import DamageStockStats from "./DamageStockStats";
import DamageStockSearchFilter from "./DamageStockSearchFilter";
import DamageStockCard from "./DamageStockCard";
import DamageStockList from "./DamageStockList";
import AddDamageStockModal from "./AddDamageStockModal";
import SuccessModal from "./SuccessModal";
import LoadingSpinner from "./LoadingSpinner";
import {usePosDamageProducts} from "../../../context_or_provider/pos/damageProducts/damage_product_provider";
import {posDamageProductAPI} from "../../../context_or_provider/pos/damageProducts/damage_productAPI";

const DamageStockGrid = () => {
    const { posDamageProduct, setPosDamageProduct} = usePosDamageProducts();
    const [viewType, setViewType] = useState("grid");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        totalQuantity: 0,
        totalLoss: 0,
        returnableCount: 0,
        nonReturnableCount: 0,
        compensatedCount: 0,
        uncompensatedCount: 0
    });

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        damageType: "all", // returnable, non_returnable
        compensationStatus: "all", // compensated, uncompensated
        sortBy: "date_desc",
        dateRange: null
    });

    // Fetch damage stock on component mount
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
        if (!records || records.length === 0) {
            setStats({
                total: 0,
                totalQuantity: 0,
                totalLoss: 0,
                returnableCount: 0,
                nonReturnableCount: 0,
                compensatedCount: 0,
                uncompensatedCount: 0
            });
            return;
        }

        const total = records.length;

        const totalQuantity = records.reduce((acc, record) => {
            return acc + (record.quantity || 0);
        }, 0);

        const totalLoss = records.reduce((acc, record) => {
            return acc + parseFloat(record.total_loss || 0);
        }, 0);

        const returnableCount = records.filter(r => r.damage_type === 'returnable').length;
        const nonReturnableCount = records.filter(r => r.damage_type === 'non_returnable').length;

        const compensatedCount = records.filter(r => r.is_compensated === true).length;
        const uncompensatedCount = records.filter(r => r.is_compensated === false).length;

        setStats({
            total,
            totalQuantity,
            totalLoss,
            returnableCount,
            nonReturnableCount,
            compensatedCount,
            uncompensatedCount
        });
    };

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleFilter = useCallback((newFilters) => {
        setFilters(prev => ({...prev, ...newFilters}));
    }, []);

    // Filter damage records based on search and filters
    const filteredRecords = useMemo(() => {
        if (!posDamageProduct || posDamageProduct.length === 0) return [];

        let result = [...posDamageProduct];

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(record =>
                record.product_name?.toLowerCase().includes(query) ||
                record.product_code?.toLowerCase().includes(query) ||
                record.reason?.toLowerCase().includes(query) ||
                record.notes?.toLowerCase().includes(query) ||
                record.reference_no?.toLowerCase().includes(query)
            );
        }

        // Apply damage type filter
        if (filters.damageType !== "all") {
            result = result.filter(record => record.damage_type === filters.damageType);
        }

        // Apply compensation status filter
        if (filters.compensationStatus !== "all") {
            if (filters.compensationStatus === "compensated") {
                result = result.filter(record => record.is_compensated === true);
            } else if (filters.compensationStatus === "uncompensated") {
                result = result.filter(record => record.is_compensated === false);
            }
        }

        // Apply date range filter
        if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
            const startDate = new Date(filters.dateRange.start);
            const endDate = new Date(filters.dateRange.end);
            result = result.filter(record => {
                const recordDate = new Date(record.created_at);
                return recordDate >= startDate && recordDate <= endDate;
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case "name_asc":
                    return (a.product_name || "").localeCompare(b.product_name || "");
                case "name_desc":
                    return (b.product_name || "").localeCompare(a.product_name || "");
                case "quantity_asc":
                    return (a.quantity || 0) - (b.quantity || 0);
                case "quantity_desc":
                    return (b.quantity || 0) - (a.quantity || 0);
                case "loss_asc":
                    return parseFloat(a.total_loss || 0) - parseFloat(b.total_loss || 0);
                case "loss_desc":
                    return parseFloat(b.total_loss || 0) - parseFloat(a.total_loss || 0);
                case "date_asc":
                    return new Date(a.created_at) - new Date(b.created_at);
                case "date_desc":
                    return new Date(b.created_at) - new Date(a.created_at);
                default:
                    return 0;
            }
        });

        return result;
    }, [posDamageProduct, searchQuery, filters]);

    const handleRecordAdded = (newRecord) => {
        setPosDamageProduct(prev => [newRecord, ...prev]);
        setIsAddOpen(false);
        setSuccessData(newRecord);
        fetchDamageStock(); // Re-fetch to ensure data consistency
    };

    const handleRecordUpdated = useCallback(() => {
        fetchDamageStock();
    }, []);

    const formatMoney = (value) => {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const displayStats = [
        {
            title: 'মোট ড্যামেজ রেকর্ড',
            count: stats.total?.toString() || "0",
            bgColor: 'bg-blue-600',
            icon: '📦'
        },
        {
            title: 'মোট পরিমাণ (পিস)',
            count: stats.totalQuantity?.toString() || "0",
            bgColor: 'bg-orange-500',
            icon: '🔢'
        },
        {
            title: 'রিটার্নযোগ্য',
            count: stats.returnableCount?.toString() || "0",
            bgColor: 'bg-green-500',
            icon: '↩️'
        },
        {
            title: 'নন-রিটার্নযোগ্য',
            count: stats.nonReturnableCount?.toString() || "0",
            bgColor: 'bg-red-500',
            icon: '❌'
        },
        {
            title: 'ক্ষতিপূরণ দেওয়া',
            count: stats.compensatedCount?.toString() || "0",
            bgColor: 'bg-teal-500',
            icon: '✅'
        },
        {
            title: 'ক্ষতিপূরণ বাকি',
            count: stats.uncompensatedCount?.toString() || "0",
            bgColor: 'bg-yellow-500',
            icon: '⏳'
        },
        {
            title: 'মোট আর্থিক ক্ষতি',
            count: `৳ ${formatMoney(stats.totalLoss || 0)}`,
            bgColor: 'bg-purple-600',
            icon: '💰'
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-600">ড্যামেজ স্টক লোড হচ্ছে...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <DamageStockHeader
                viewType={viewType}
                setViewType={setViewType}
                onAddClick={() => setIsAddOpen(true)}
            />

            <div className="mb-6">
                <DamageStockStats stats={displayStats}/>
            </div>

            <div className="mb-6">
                <DamageStockSearchFilter
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                        {viewType === "grid" ? "ড্যামেজ স্টক গ্রিড" : "ড্যামেজ স্টক লিস্ট"}
                    </h2>
                    <div className="text-sm text-gray-500">
                        {filteredRecords.length} টি রেকর্ড দেখানো হচ্ছে (মোট {posDamageProduct?.length || 0} টির মধ্যে)
                    </div>
                </div>

                {viewType === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRecords.map(record => (
                            <DamageStockCard
                                key={record.id}
                                record={record}
                                onEdit={handleRecordUpdated}
                                onDelete={handleRecordUpdated}
                            />
                        ))}
                    </div>
                ) : (
                    <DamageStockList
                        records={filteredRecords}
                        onUpdate={handleRecordUpdated}
                    />
                )}

                {filteredRecords.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো রেকর্ড পাওয়া যায়নি</h3>
                        <p className="text-gray-600 mb-4">
                            {searchQuery || filters.damageType !== "all" || filters.compensationStatus !== "all"
                                ? "অনুগ্রহ করে সার্চ বা ফিল্টার পরিবর্তন করুন"
                                : "প্রথম ড্যামেজ রেকর্ড যোগ করুন"
                            }
                        </p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            ড্যামেজ রেকর্ড যোগ করুন
                        </button>
                    </div>
                )}
            </div>

            <AddDamageStockModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleRecordAdded}
            />

            <SuccessModal
                isOpen={!!successData}
                data={successData}
                onClose={() => setSuccessData(null)}
                message="ড্যামেজ রেকর্ড সফলভাবে যোগ করা হয়েছে"
            />
        </div>
    );
};

export default DamageStockGrid;