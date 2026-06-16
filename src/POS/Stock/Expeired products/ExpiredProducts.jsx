import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Package, Search, Calendar, Activity, ArrowUpDown, Filter, AlertTriangle, ShieldAlert } from 'lucide-react';
import { posSizeAPI as uniqueInstanceAPI } from '../../../context_or_provider/pos/UniqueProductInstance/unique_product_instanceApi';
import { posCategoryAPI } from '../../../context_or_provider/pos/categories/categoryAPI';
import { posSubCategoryAPI } from '../../../context_or_provider/pos/subcategories/subCategoryApi';
import { posBrandAPI } from '../../../context_or_provider/pos/brands/brandAPI';
import useModuleData from "../../hooks/useModuleData";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import BackboneTable from "../../components/BackboneTable";
import StatusBadge from "../../components/StatusBadge";

/**
 * ExpiredProducts - Refactored to integrate with ModuleShell and use backbone architecture.
 * Displays expired and near-expiry product instances.
 */
const ExpiredProducts = ({
                             viewType,
                             onStatsLoaded,
                             searchQuery,
                             filters,
                             setFilterConfig
                         }) => {
    const [categories, setCategories] = useState([]);
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // 1. Provide filter configuration
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [catRes, subCatRes, brandRes] = await Promise.all([
                    posCategoryAPI.getAll(),
                    posSubCategoryAPI.getAll(),
                    posBrandAPI.getAll()
                ]);
                setCategories(catRes.data);
                setAllSubCategories(subCatRes.data);
                setBrands(brandRes.data);

                if (setFilterConfig) {
                    setFilterConfig({
                        searchPlaceholder: "Search by Product, Serial, Batch...",
                        filtersConfig: [
                            {
                                key: "status", label: "Expiry Status", icon: <ShieldAlert className="w-3.5 h-3.5"/>, options: [
                                    {value: "all", label: "All Alert Types"},
                                    {value: "expired", label: "Expired"},
                                    {value: "near_expiry", label: "Near Expiry"}
                                ]
                            },
                            {
                                key: "category", label: "Category", icon: <Filter className="w-3.5 h-3.5"/>, options: [
                                    {value: "all", label: "All Categories"},
                                    ...catRes.data.map(c => ({value: String(c.id), label: c.title}))
                                ]
                            },
                            {
                                key: "brand", label: "Brand", icon: <Activity className="w-3.5 h-3.5"/>, options: [
                                    {value: "all", label: "All Brands"},
                                    ...brandRes.data.map(b => ({value: String(b.id), label: b.name || b.title}))
                                ]
                            },
                            {
                                key: "sortBy", label: "Sort By", icon: <ArrowUpDown className="w-3.5 h-3.5"/>, options: [
                                    {value: "expiry_asc", label: "Expiry (Soonest)"},
                                    {value: "expiry_desc", label: "Expiry (Latest)"},
                                    {value: "name_asc", label: "Name (A-Z)"}
                                ]
                            }
                        ],
                        advancedConfig: []
                    });
                }
            } catch (err) { console.error(err); }
        };
        fetchFilterOptions();
    }, [setFilterConfig]);

    // 2. Stats calculation
    const calculateStats = useCallback((data) => {
        const total = data.length;
        const expired = data.filter(item => item.expiry_status === 'expired').length;
        const nearExpiry = data.filter(item => item.expiry_status === 'near_expiry').length;

        return [
            { title: 'Total Alerts', count: total.toString(), bgColor: 'bg-rose-600', icon: <AlertTriangle size={24}/> },
            { title: 'Expired Now', count: expired.toString(), bgColor: 'bg-red-700', icon: <ShieldAlert size={24}/> },
            { title: 'Expiring Soon', count: nearExpiry.toString(), bgColor: 'bg-amber-500', icon: <Activity size={24}/> },
            { title: 'Total Tracked', count: total.toString(), bgColor: 'bg-blue-600', icon: <Package size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredInstances,
        rawData: allInstances,
        loading,
        refresh
    } = useModuleData({
        apiFetch: uniqueInstanceAPI.getAll,
        searchQuery,
        filters,
        searchFields: ['product_name', 'unique_serial', 'batch_no', 'product.name'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            // Initial filter: only in-stock and alert statuses
            let result = data.filter(item => 
                item.status === 'in_stock' && 
                (item.expiry_status === 'expired' || item.expiry_status === 'near_expiry')
            );

            if (f.status && f.status !== "all") {
                result = result.filter(item => item.expiry_status === f.status);
            }

            if (f.category && f.category !== "all") {
                result = result.filter(item => String(item.product?.category) === f.category);
            }

            if (f.brand && f.brand !== "all") {
                result = result.filter(item => String(item.product?.brand) === f.brand);
            }

            if (f.sortBy) {
                result.sort((a, b) => {
                    if (f.sortBy === "expiry_asc") return new Date(a.expiry_date) - new Date(b.expiry_date);
                    if (f.sortBy === "expiry_desc") return new Date(b.expiry_date) - new Date(a.expiry_date);
                    if (f.sortBy === "name_asc") return (a.product_name || a.product?.name).localeCompare(b.product_name || b.product?.name);
                    return 0;
                });
            }
            return result;
        }
    });

    const columns = [
        {
            header: "Product & Code",
            accessor: "product_name",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0 border border-gray-100">
                        <Package size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">{item.product_name || item.product?.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            CODE: {item.product?.product_code}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Batch & Serial",
            accessor: "unique_serial",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">Batch: {item.batch_no || 'N/A'}</span>
                    <span className="text-[10px] text-gray-400 font-mono">SN: {item.unique_serial}</span>
                </div>
            )
        },
        {
            header: "Dates",
            accessor: "expiry_date",
            render: (item) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase font-bold">
                        <Calendar size={10} />
                        <span>Mfg: {item.manufacturing_date || 'N/A'}</span>
                    </div>
                    <span className={`text-xs font-black mt-0.5 ${item.expiry_status === 'expired' ? 'text-rose-600' : 'text-amber-600'}`}>
                        Exp: {item.expiry_date || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: "expiry_status",
            className: "text-center",
            render: (item) => (
                <StatusBadge 
                    type={item.expiry_status === 'expired' ? 'danger' : 'warning'} 
                    label={item.expiry_status?.replace('_', ' ')} 
                />
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 w-full">
                <LoadingSpinner size="lg"/>
                <p className="mt-4 text-gray-500 text-sm">Scanning stock for expiration alerts...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-1">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
                        <AlertTriangle size={16} className="text-rose-500"/>
                        Expired & Near Expiry Inventory
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {filteredInstances.length} CRITICAL ALERTS
                    </div>
                </div>

                <BackboneTable columns={columns} data={filteredInstances} />

                {filteredInstances.length === 0 && (
                    <EmptyState
                        icon={<Package size={32}/>}
                        title="Inventory is healthy"
                        description="No expired or near-expiry items found in current stock."
                        actionText="Refresh Scan"
                        onAction={refresh}
                    />
                )}
            </div>
        </div>
    );
};

export default ExpiredProducts;