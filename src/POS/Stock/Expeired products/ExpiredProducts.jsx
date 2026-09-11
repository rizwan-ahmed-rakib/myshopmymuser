import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Package, Calendar, Activity, ArrowUpDown, Filter, AlertTriangle, ShieldAlert, Clock3, BarChart3, Building2 } from 'lucide-react';
import { posSizeAPI as uniqueInstanceAPI } from '../../../context_or_provider/pos/UniqueProductInstance/unique_product_instanceApi';
import { posCategoryAPI } from '../../../context_or_provider/pos/categories/categoryAPI';
import { posSubCategoryAPI } from '../../../context_or_provider/pos/subcategories/subCategoryApi';
import { posBrandAPI } from '../../../context_or_provider/pos/brands/brandAPI';
import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
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
    const [suppliers, setSuppliers] = useState([]);

    const fetchAllInstances = useCallback(async () => {
        const firstResponse = await uniqueInstanceAPI.getAll();
        const isPaginated = firstResponse.data && firstResponse.data.results !== undefined;

        if (!isPaginated) return firstResponse;

        let allResults = [...(firstResponse.data.results || [])];
        let nextUrl = firstResponse.data.next;

        while (nextUrl) {
            const nextResponse = await uniqueInstanceAPI.getAll(nextUrl);
            allResults = allResults.concat(nextResponse.data?.results || []);
            nextUrl = nextResponse.data?.next;
        }

        return {
            ...firstResponse,
            data: {
                ...firstResponse.data,
                results: allResults,
                count: allResults.length,
                next: null,
                previous: null
            }
        };
    }, []);

    const getDaysDifference = useCallback((dateStr) => {
        if (!dateStr) return null;
        const today = new Date();
        const target = new Date(dateStr);
        if (Number.isNaN(target.getTime())) return null;

        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        return Math.round((target - today) / (1000 * 60 * 60 * 24));
    }, []);

    // 1. Provide filter configuration
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [catRes, subCatRes, brandRes, supplierRes] = await Promise.all([
                    posCategoryAPI.getAll(),
                    posSubCategoryAPI.getAll(),
                    posBrandAPI.getAll(),
                    posSupplierAPI.getAll()
                ]);
                setCategories(catRes.data);
                setAllSubCategories(subCatRes.data);
                setBrands(brandRes.data);
                setSuppliers(supplierRes.data);

                if (setFilterConfig) {
                    setFilterConfig({
                        searchPlaceholder: "Search by Product, Serial, Batch...",
                        filtersConfig: [
                            {
                                key: "status", label: "Type / Expiry Status", icon: <ShieldAlert className="w-3.5 h-3.5"/>, options: [
                                    {value: "all", label: "All Stock Types"},
                                    {value: "expired", label: "Expired"},
                                    {value: "near_expiry", label: "Near Expiry"},
                                    {value: "fresh", label: "Fresh"},
                                    {value: "not_applicable", label: "Not Applicable"}
                                ]
                            },
                            {
                                key: "category", label: "Category", icon: <Filter className="w-3.5 h-3.5"/>, options: [
                                    {value: "all", label: "All Categories"},
                                    ...catRes.data.map(c => ({value: String(c.id), label: c.title}))
                                ]
                            },
                            {
                                key: "subCategory", label: "Sub Category", icon: <Filter className="w-3.5 h-3.5"/>, options: [
                                    {value: "all", label: "All Sub Categories"},
                                    ...subCatRes.data.map(sc => ({value: String(sc.id), label: sc.title}))
                                ]
                            },
                            {
                                key: "brand", label: "Brand", icon: <Activity className="w-3.5 h-3.5"/>, options: [
                                    {value: "all", label: "All Brands"},
                                    ...brandRes.data.map(b => ({value: String(b.id), label: b.name || b.title}))
                                ]
                            },
                            {
                                key: "supplier", label: "Supplier", icon: <Building2 className="w-3.5 h-3.5"/>, options: [
                                    {value: "all", label: "All Suppliers"},
                                    ...supplierRes.data.map(s => ({value: String(s.id), label: s.name}))
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
                        advancedConfig: [
                            {
                                key: "expiryDateRange",
                                type: "date-range",
                                label: "Expiry Date Range",
                                fromPlaceholder: "From date",
                                toPlaceholder: "To date"
                            }
                        ]
                    });
                }
            } catch (err) { console.error(err); }
        };
        fetchFilterOptions();
    }, [setFilterConfig]);

    // 2. Stats calculation
    const calculateStats = useCallback((data) => {
        const inStock = data.filter(item => item.status === 'in_stock');
        const total = inStock.length;
        const expired = data.filter(item => item.expiry_status === 'expired').length;
        const nearExpiry = data.filter(item => item.expiry_status === 'near_expiry').length;
        const fresh = data.filter(item => item.expiry_status === 'fresh').length;
        const notApplicable = data.filter(item => item.expiry_status === 'not_applicable').length;

        return [
            { title: 'In-Stock Units', count: total.toString(), bgColor: 'bg-blue-600', icon: <Package size={24}/> },
            { title: 'Expired Now', count: expired.toString(), bgColor: 'bg-red-700', icon: <ShieldAlert size={24}/> },
            { title: 'Expiring Soon', count: nearExpiry.toString(), bgColor: 'bg-amber-500', icon: <Activity size={24}/> },
            { title: 'Healthy / Fresh', count: fresh.toString(), bgColor: 'bg-emerald-600', icon: <BarChart3 size={24}/> },
            { title: 'No Expiry Track', count: notApplicable.toString(), bgColor: 'bg-slate-600', icon: <Clock3 size={24}/> }
        ];
    }, []);

    // 3. Centralized Hook
    const {
        filteredData: filteredInstances,
        rawData: allInstances,
        loading,
        refresh
    } = useModuleData({
        apiFetch: fetchAllInstances,
        searchQuery,
        filters,
        searchFields: ['product_name', 'unique_serial', 'batch_no', 'product.name'],
        onStatsLoaded,
        calculateStatsFn: calculateStats,
        filterFn: (data, f) => {
            // Initial filter: all in-stock lifecycle statuses

            let result = data.filter(item => item.status === 'in_stock');

            // let result = data; // in_stock filter বাদ দেওয়া হয়েছে

            if (f.status && f.status !== "all") {
                result = result.filter(item => item.expiry_status === f.status);
            }

            if (f.category && f.category !== "all") {
                result = result.filter(item => String(item.category ?? item.product?.category) === f.category);
            }

            if (f.subCategory && f.subCategory !== "all") {
                result = result.filter(item => String(item.sub_category ?? item.product?.sub_category) === f.subCategory);
            }

            if (f.brand && f.brand !== "all") {
                result = result.filter(item => String(item.brand ?? item.product?.brand) === f.brand);
            }

            if (f.supplier && f.supplier !== "all") {
                result = result.filter(item => String(item.supplier) === f.supplier);
            }

            if (f.expiryDateRange) {
                const { from, to } = f.expiryDateRange;
                if (from) {
                    const fromDate = new Date(from);
                    fromDate.setHours(0, 0, 0, 0);
                    result = result.filter(item => {
                        if (!item.expiry_date) return false;
                        const expiry = new Date(item.expiry_date);
                        if (Number.isNaN(expiry.getTime())) return false;
                        expiry.setHours(0, 0, 0, 0);
                        return expiry >= fromDate;
                    });
                }

                if (to) {
                    const toDate = new Date(to);
                    toDate.setHours(23, 59, 59, 999);
                    result = result.filter(item => {
                        if (!item.expiry_date) return false;
                        const expiry = new Date(item.expiry_date);
                        if (Number.isNaN(expiry.getTime())) return false;
                        expiry.setHours(0, 0, 0, 0);
                        return expiry <= toDate;
                    });
                }
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

    const enrichedInstances = useMemo(() => {
        return filteredInstances.map((item) => {
            const daysToExpiry = getDaysDifference(item.expiry_date);
            const quantity = Number(item.quantity || 1);
            const urgencyScore = item.expiry_status === 'expired'
                ? 1000 + (Math.abs(daysToExpiry || 0) * 3) + quantity
                : Math.max(0, 300 - (daysToExpiry ?? 999)) + quantity;

            return {
                ...item,
                quantity,
                daysToExpiry,
                urgencyScore
            };
        }).sort((a, b) => b.urgencyScore - a.urgencyScore);
    }, [filteredInstances, getDaysDifference]);

    const dashboardSummary = useMemo(() => {
        const expiredItems = enrichedInstances.filter(item => item.expiry_status === 'expired');
        const nearExpiryItems = enrichedInstances.filter(item => item.expiry_status === 'near_expiry');
        const freshItems = enrichedInstances.filter(item => item.expiry_status === 'fresh');
        const notApplicableItems = enrichedInstances.filter(item => item.expiry_status === 'not_applicable');

        const expiredQty = expiredItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
        const nearExpiryQty = nearExpiryItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

        const highPriorityCount = enrichedInstances.filter(item => {
            if (item.expiry_status === 'expired') return true;
            return item.daysToExpiry !== null && item.daysToExpiry <= 7;
        }).length;

        return {
            expiredItems: expiredItems.length,
            nearExpiryItems: nearExpiryItems.length,
            freshItems: freshItems.length,
            notApplicableItems: notApplicableItems.length,
            expiredQty,
            nearExpiryQty,
            highPriorityCount,
            totalImpactedQty: expiredQty + nearExpiryQty
        };
    }, [enrichedInstances]);

    const topPriorityItems = useMemo(() => enrichedInstances.slice(0, 3), [enrichedInstances]);

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
                    <span className="text-[10px] text-gray-500 font-semibold mt-1">
                        {item.daysToExpiry === null
                            ? 'Expiry day unknown'
                            : item.daysToExpiry < 0
                                ? `${Math.abs(item.daysToExpiry)} days overdue`
                                : `${item.daysToExpiry} days left`}
                    </span>
                </div>
            )
        },
        {
            header: "Impact",
            accessor: "quantity",
            className: "text-center",
            render: (item) => (
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-gray-900">{item.quantity}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">units</span>
                </div>
            )
        },
        {
            header: "Batch / Supplier",
            accessor: "batch_no",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">Batch: {item.batch_no || 'N/A'}</span>
                    <span className="text-[10px] text-gray-400">{item.supplier_name || 'No supplier'}</span>
                    <span className="text-[10px] text-gray-500 font-medium">{item.supplier_phone || 'Phone N/A'}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: "expiry_status",
            className: "text-center",
            render: (item) => (
                <StatusBadge 
                    type={item.expiry_status === 'expired'
                        ? 'danger'
                        : item.expiry_status === 'near_expiry'
                            ? 'warning'
                            : item.expiry_status === 'fresh'
                                ? 'success'
                                : 'info'} 
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
                        Inventory Expiry & Freshness Monitor
                    </h2>
                    <div className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        SHOWING {enrichedInstances.length} IN-STOCK ITEMS
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 px-1">
                    <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-rose-700 font-semibold flex items-center gap-1"><ShieldAlert size={13}/> Expired Lots</p>
                        <p className="text-xl font-black text-rose-700 mt-1">{dashboardSummary.expiredItems}</p>
                        <p className="text-[11px] text-rose-600">{dashboardSummary.expiredQty} units impacted</p>
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-amber-700 font-semibold flex items-center gap-1"><Clock3 size={13}/> Near Expiry</p>
                        <p className="text-xl font-black text-amber-700 mt-1">{dashboardSummary.nearExpiryItems}</p>
                        <p className="text-[11px] text-amber-600">{dashboardSummary.nearExpiryQty} units at risk</p>
                    </div>
                    <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-violet-700 font-semibold flex items-center gap-1"><BarChart3 size={13}/> Urgent Decisions</p>
                        <p className="text-xl font-black text-violet-700 mt-1">{dashboardSummary.highPriorityCount}</p>
                        <p className="text-[11px] text-violet-600">expired or within 7 days</p>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-blue-700 font-semibold flex items-center gap-1"><Package size={13}/> Total Impact Qty</p>
                        <p className="text-xl font-black text-blue-700 mt-1">{dashboardSummary.totalImpactedQty}</p>
                        <p className="text-[11px] text-blue-600">for immediate planning</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 px-1">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-emerald-700 font-semibold">Fresh Stock</p>
                        <p className="text-xl font-black text-emerald-700 mt-1">{dashboardSummary.freshItems}</p>
                        <p className="text-[11px] text-emerald-600">healthy items with safe shelf life</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-700 font-semibold">Non-Expiry Items</p>
                        <p className="text-xl font-black text-slate-700 mt-1">{dashboardSummary.notApplicableItems}</p>
                        <p className="text-[11px] text-slate-600">serial/warranty based lifecycle items</p>
                    </div>
                </div>

                {topPriorityItems.length > 0 && (
                    <div className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={13} className="text-rose-500" />
                            Top Priority Actions
                        </p>
                        <div className="space-y-2">
                            {topPriorityItems.map((item, idx) => (
                                <div key={`${item.id || idx}-${item.unique_serial || 'no-serial'}-${item.batch_no || 'no-batch'}`} className="flex items-start justify-between gap-3 text-xs">
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{item.product_name || item.product?.name}</p>
                                        <p className="text-gray-500 truncate">Batch {item.batch_no || 'N/A'} • {item.quantity} units</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className={`font-extrabold ${item.expiry_status === 'expired' ? 'text-rose-600' : 'text-amber-600'}`}>
                                            {item.daysToExpiry === null
                                                ? 'Unknown date'
                                                : item.daysToExpiry < 0
                                                    ? `${Math.abs(item.daysToExpiry)}d overdue`
                                                    : `${item.daysToExpiry}d left`}
                                        </p>
                                        <p className="text-gray-400 flex items-center justify-end gap-1"><Building2 size={11}/> {item.supplier_name || 'No supplier'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <BackboneTable columns={columns} data={enrichedInstances} keyField="id" />

                {enrichedInstances.length === 0 && (
                    <EmptyState
                        icon={<Package size={32}/>}
                        title="Inventory looks healthy"
                        description="No in-stock products match the current filters. Adjust status filters to review fresh, expiring, or non-expiry inventory."
                        actionText="Refresh Inventory Scan"
                        onAction={refresh}
                    />
                )}
            </div>
        </div>
    );
};

export default ExpiredProducts;