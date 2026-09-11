// src/context_or_provider/pos/reports/ReportsProvider.js
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { posReportsAPI } from './reportsAPI';
// ─── Cache settings (component-এর বাইরে — কারণ এটা constant) ───
const CACHE_TTL_MS = 60 * 1000;   // ৬০ সেকেন্ড

const ReportsContext = createContext();

/**
 * 📊 ReportsProvider — সব report data, filter, column preference একজায়গায়।
 *
 * Design goals:
 * - একবার data load হলে cache-এ রাখবে (period+range key দিয়ে)
 * - Filter change হলে auto re-fetch
 * - Business note PATCH করলে সাথে সাথে UI-তে reflect
 * - Column prefs localStorage-এ persist
 */
export const ReportsProvider = ({ children }) => {

    // ═══════════════════════════════════════════════════════════════
    // ১. DATA STATE
    // ═══════════════════════════════════════════════════════════════

    // Profit Summary — period_type অনুযায়ী
    // প্রতিটা entry: { results, count, aggregated, chart_data, range, next, previous }
    const [profitSummary, setProfitSummary] = useState({
        daily: null,
        monthly: null,
        yearly: null,
        all_time: null,
    });

    // Product Profit — cumulative, paginated
    const [productProfits, setProductProfits] = useState(null);

    // Inventory Valuation — monthly / yearly series
    const [inventoryValuation, setInventoryValuation] = useState({
        monthly: null,
        yearly: null,
    });

    // Business Growth — monthly / yearly / all_time
    const [businessGrowth, setBusinessGrowth] = useState({
        monthly: null,
        yearly: null,
        all_time: null,
    });

    // Support data (dropdown filter-এর জন্য)
    const [supportData, setSupportData] = useState({
        customers: [],
        suppliers: [],
        products: [],
        categories: [],
        subcategories: [],
        brands: [],
        specifications: [],
        dosageForms: [],
    });

    // ═══════════════════════════════════════════════════════════════
    // ২. FILTER STATE
    // ═══════════════════════════════════════════════════════════════

    // কোন section active? (Top-level)
    const [activeSection, setActiveSection] = useState('profit');
    // 'profit' | 'product' | 'inventory' | 'growth'

    // Profit section-এর ভেতরে period (daily/monthly/yearly/all_time)
    const [periodType, setPeriodType] = useState('daily');

    // Profit section-এর ভেতরে tab (profit/sale/purchase/cash/notes)
    const [sectionTab, setSectionTab] = useState('profit');

    // Date range / filter
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        start_month: '',
        end_month: '',
        start_year: '',
        end_year: '',
        search: '',
        ordering: '-period_key',
        compare: false,
        page: 1,
        page_size: 30,
    });

    // ═══════════════════════════════════════════════════════════════
    // ৩. COLUMN PREFERENCES (localStorage)
    // ═══════════════════════════════════════════════════════════════

    const [columnPrefs, setColumnPrefsState] = useState(() => {
        try {
            const raw = localStorage.getItem('report_column_prefs_v1');
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    // columnPrefs update + localStorage sync
    const setColumnPrefs = useCallback((updater) => {
        setColumnPrefsState((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            try {
                localStorage.setItem('report_column_prefs_v1', JSON.stringify(next));
            } catch (e) {
                console.warn('Failed to save column prefs:', e);
            }
            return next;
        });
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // ৪. UI STATE — loading, error
    // ═══════════════════════════════════════════════════════════════

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ═══════════════════════════════════════════════════════════════
    // ৫. CACHE — duplicate API call কমানোর জন্য
    // ═══════════════════════════════════════════════════════════════

    const cacheRef = useRef({});     // key → { data, timestamp }

    const getCacheKey = useCallback((type, params) => {
        return `${type}::${JSON.stringify(params || {})}`;
    }, []);

    const readCache = useCallback((key) => {
        const entry = cacheRef.current[key];
        if (!entry) return null;
        if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
            delete cacheRef.current[key];
            return null;
        }
        return entry.data;
    }, []);

    const writeCache = useCallback((key, data) => {
        cacheRef.current[key] = { data, timestamp: Date.now() };
    }, []);

    const invalidateCache = useCallback((prefix) => {
        if (!prefix) {
            cacheRef.current = {};
            return;
        }
        Object.keys(cacheRef.current).forEach((k) => {
            if (k.startsWith(prefix)) delete cacheRef.current[k];
        });
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // ৬. BUILD QUERY PARAMS — filter → API params
    // ═══════════════════════════════════════════════════════════════

    const buildParams = useCallback((overrides = {}) => {
        const p = { ...filters, ...overrides };
        const params = {};

        // Only include non-empty
        if (p.start_date) params.start_date = p.start_date;
        if (p.end_date) params.end_date = p.end_date;
        if (p.start_month) params.start_month = p.start_month;
        if (p.end_month) params.end_month = p.end_month;
        if (p.start_year) params.start_year = p.start_year;
        if (p.end_year) params.end_year = p.end_year;
        if (p.search) params.search = p.search;
        if (p.ordering) params.ordering = p.ordering;
        if (p.compare) params.compare = 'true';
        if (p.page) params.page = p.page;
        if (p.page_size) params.page_size = p.page_size;

        return params;
    }, [filters]);

    // ═══════════════════════════════════════════════════════════════
    // ৭. LOADERS — প্রতিটা section-এর API call
    // ═══════════════════════════════════════════════════════════════

    // Profit Summary (period-wise)
    const loadProfitSummary = useCallback(async (periodTypeOverride = null, paramsOverride = {}) => {
        const pt = periodTypeOverride || periodType;
        const params = buildParams(paramsOverride);
        const key = getCacheKey(`profit-${pt}`, params);

        // Cache hit
        const cached = readCache(key);
        if (cached) {
            setProfitSummary((prev) => ({ ...prev, [pt]: cached }));
            return cached;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await posReportsAPI.getProfitSummaryList(pt, params);
            const data = res.data;
            writeCache(key, data);
            setProfitSummary((prev) => ({ ...prev, [pt]: data }));
            return data;
        } catch (err) {
            console.error('loadProfitSummary error:', err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [periodType, buildParams, getCacheKey, readCache, writeCache]);

    // Product Profits
    const loadProductProfits = useCallback(async (paramsOverride = {}) => {
        const params = buildParams(paramsOverride);
        const key = getCacheKey('product-profit', params);

        const cached = readCache(key);
        if (cached) {
            setProductProfits(cached);
            return cached;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await posReportsAPI.getProductProfits(params);
            writeCache(key, res.data);
            setProductProfits(res.data);
            return res.data;
        } catch (err) {
            console.error('loadProductProfits error:', err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [buildParams, getCacheKey, readCache, writeCache]);

    // Inventory Valuation
    const loadInventoryValuation = useCallback(async (periodTypeOverride = 'monthly', paramsOverride = {}) => {
        const pt = periodTypeOverride;
        const params = buildParams(paramsOverride);
        const key = getCacheKey(`inventory-${pt}`, params);

        const cached = readCache(key);
        if (cached) {
            setInventoryValuation((prev) => ({ ...prev, [pt]: cached }));
            return cached;
        }

        setLoading(true);
        setError(null);
        try {
            const apiCall = pt === 'yearly'
                ? posReportsAPI.getInventoryYearly
                : posReportsAPI.getInventoryMonthly;
            const res = await apiCall(params);
            writeCache(key, res.data);
            setInventoryValuation((prev) => ({ ...prev, [pt]: res.data }));
            return res.data;
        } catch (err) {
            console.error('loadInventoryValuation error:', err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [buildParams, getCacheKey, readCache, writeCache]);

    // Business Growth
    const loadBusinessGrowth = useCallback(async (periodTypeOverride = 'monthly', paramsOverride = {}) => {
        const pt = periodTypeOverride;
        const params = buildParams(paramsOverride);
        const key = getCacheKey(`growth-${pt}`, params);

        const cached = readCache(key);
        if (cached) {
            setBusinessGrowth((prev) => ({ ...prev, [pt]: cached }));
            return cached;
        }

        setLoading(true);
        setError(null);
        try {
            let res;
            if (pt === 'all_time') {
                res = await posReportsAPI.getGrowthAllTime();
            } else if (pt === 'yearly') {
                res = await posReportsAPI.getGrowthYearly(params);
            } else {
                res = await posReportsAPI.getGrowthMonthly(params);
            }
            writeCache(key, res.data);
            setBusinessGrowth((prev) => ({ ...prev, [pt]: res.data }));
            return res.data;
        } catch (err) {
            console.error('loadBusinessGrowth error:', err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [buildParams, getCacheKey, readCache, writeCache]);

    // Support data load (dropdowns)
    const loadSupportData = useCallback(async () => {
        try {
            const [custRes, suppRes, prodRes, catRes, subRes, brandRes, specRes, dosRes] = await Promise.all([
                posReportsAPI.getCustomers().catch(() => ({ data: [] })),
                posReportsAPI.getSuppliers().catch(() => ({ data: [] })),
                posReportsAPI.getProducts().catch(() => ({ data: [] })),
                posReportsAPI.getCategories().catch(() => ({ data: [] })),
                posReportsAPI.getSubcategories().catch(() => ({ data: [] })),
                posReportsAPI.getBrands().catch(() => ({ data: [] })),
                posReportsAPI.getSpecifications().catch(() => ({ data: [] })),
                posReportsAPI.getDosageForms().catch(() => ({ data: [] })),
            ]);

            const unwrap = (r) => Array.isArray(r.data) ? r.data : (r.data?.results || []);

            setSupportData({
                customers: unwrap(custRes),
                suppliers: unwrap(suppRes),
                products: unwrap(prodRes),
                categories: unwrap(catRes),
                subcategories: unwrap(subRes),
                brands: unwrap(brandRes),
                specifications: unwrap(specRes),
                dosageForms: unwrap(dosRes),
            });
        } catch (err) {
            console.error('loadSupportData error:', err);
        }
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // ৮. ACTIONS — business note, PDF, recalculate
    // ═══════════════════════════════════════════════════════════════

    // Business note যোগ করা (নতুন note append হবে, পুরনো মুছবে না)
    const addBusinessNote = useCallback(async (periodType, periodKey, note) => {
        try {
            const res = await posReportsAPI.updateBusinessNote(periodType, periodKey, note);

            // Cache invalidate → পরবর্তী fetch fresh data আনবে
            invalidateCache(`profit-${periodType}`);

            // Optimistic update: response-এ already নতুন list থাকে
            setProfitSummary((prev) => {
                const current = prev[periodType];
                if (!current) return prev;
                const newResults = (current.results || []).map((row) =>
                    row.period_key === periodKey ? res.data : row
                );
                return {
                    ...prev,
                    [periodType]: { ...current, results: newResults },
                };
            });

            return res.data;
        } catch (err) {
            console.error('addBusinessNote error:', err);
            throw err;
        }
    }, [invalidateCache]);

    // PDF download
    const downloadPdf = useCallback(async (periodType, paramsOverride = {}) => {
        try {
            const params = buildParams(paramsOverride);
            const res = await posReportsAPI.downloadPdf(periodType, params);

            // Blob → download
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = `report_${periodType}_${params.start_date || params.start_month || params.start_year || 'all'}.pdf`;
            a.download = filename.replace(/:/g, '-');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            return true;
        } catch (err) {
            console.error('downloadPdf error:', err);
            throw err;
        }
    }, [buildParams]);

    // Recalculate (admin action)
    const recalculate = useCallback(async () => {
        setLoading(true);
        try {
            await posReportsAPI.recalculateProfit();
            invalidateCache();       // সব cache clear
            return true;
        } catch (err) {
            console.error('recalculate error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [invalidateCache]);

    // ═══════════════════════════════════════════════════════════════
    // ৯. UPDATE FILTERS — helper
    // ═══════════════════════════════════════════════════════════════

    const updateFilters = useCallback((patch) => {
        setFilters((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            start_date: '',
            end_date: '',
            start_month: '',
            end_month: '',
            start_year: '',
            end_year: '',
            search: '',
            ordering: '-period_key',
            compare: false,
            page: 1,
            page_size: 30,
        });
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // ১০. CONTEXT VALUE
    // ═══════════════════════════════════════════════════════════════

    const value = useMemo(() => ({
        // Data
        profitSummary,
        productProfits,
        inventoryValuation,
        businessGrowth,
        supportData,

        // Filters & UI
        activeSection,
        setActiveSection,
        periodType,
        setPeriodType,
        sectionTab,
        setSectionTab,
        filters,
        updateFilters,
        resetFilters,

        // Column prefs
        columnPrefs,
        setColumnPrefs,

        // Loaders
        loadProfitSummary,
        loadProductProfits,
        loadInventoryValuation,
        loadBusinessGrowth,
        loadSupportData,

        // Actions
        addBusinessNote,
        downloadPdf,
        recalculate,

        // Utils
        invalidateCache,

        // Status
        loading,
        error,
        setError,
    }), [
        profitSummary,
        productProfits,
        inventoryValuation,
        businessGrowth,
        supportData,
        activeSection,
        periodType,
        sectionTab,
        filters,
        updateFilters,
        resetFilters,
        columnPrefs,
        setColumnPrefs,
        loadProfitSummary,
        loadProductProfits,
        loadInventoryValuation,
        loadBusinessGrowth,
        loadSupportData,
        addBusinessNote,
        downloadPdf,
        recalculate,
        invalidateCache,
        loading,
        error,
    ]);

    return (
        <ReportsContext.Provider value={value}>
            {children}
        </ReportsContext.Provider>
    );
};

// Custom hook
export const usePosReports = () => {
    const ctx = useContext(ReportsContext);
    if (!ctx) {
        throw new Error('usePosReports must be used inside <ReportsProvider>');
    }
    return ctx;
};