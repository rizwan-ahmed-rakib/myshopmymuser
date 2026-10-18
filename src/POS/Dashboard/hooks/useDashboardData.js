// src/POS/Dashboard/hooks/useDashboardData.js
import {useState, useEffect, useCallback} from 'react';
import {posReportsAPI} from '../../../context_or_provider/pos/reports/reportsAPI';
import {posCashboxAPI} from '../../../context_or_provider/pos/cashbox/cashboxAPI';
import {
    calculateHealthScore,
    generateInsights,
    getMonthlyGoal,
    calculateGoalProgress,
} from '../utils/dashboardUtils';

/**
 * Dashboard data hook।
 *
 * 🚀 Progressive Loading:
 * - সব API একসাথে parallel-এ fire হয়
 * - প্রতিটা response আসলেই তার state update হয়
 * - Loading skeleton চলে যায় first response আসলেই
 * - Silent refresh-এ সব শেষ হলে refreshing শেষ হয়
 */
export function useDashboardData(period) {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const [data, setData] = useState({
        profit: null,
        growth: null,
        inventory: null,
        balances: null,   // 👈 ADD — cashbox balances
        kpiOverview: null, // 👈 🆕 Total customers (reg/walkin), suppliers, purchase/sale invoices
        // ─── Product Intelligence-এর 4 tab ───
        topProducts: [],
        mostPurchasedProducts: [],
        mostSoldProducts: [],
        starProducts: [],
        slowProducts: [],
        // ─── Activity ───
        activity: [],
        recentNotes: [],
        // ─── Support ───
        alerts: {lowStock: [], outOfStock: [], dueCustomers: []},
        supportData: {customers: [], suppliers: [], products: []},
    });

    // ─── Period → API params ───────────────────────────────────
    const getPeriodParams = useCallback(() => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const thisMonth = todayStr.slice(0, 7);
        const thisYear = String(today.getFullYear());

        switch (period) {
            case 'today':
                return {
                    periodType: 'daily',
                    params: {start_date: todayStr, end_date: todayStr},
                };
            case 'week': {
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 6);
                return {
                    periodType: 'daily',
                    params: {
                        start_date: weekAgo.toISOString().split('T')[0],
                        end_date: todayStr,
                    },
                };
            }
            case 'month':
                return {
                    periodType: 'daily',
                    params: {
                        start_date: thisMonth + '-01',
                        end_date: todayStr,
                    },
                };
            case 'year':
                return {
                    periodType: 'monthly',
                    params: {
                        start_month: thisYear + '-01',
                        end_month: thisMonth,
                    },
                };
            default:
                return {periodType: 'all_time', params: {}};
        }
    }, [period]);

    // ─── Main fetch (progressive) ───────────────────────────────
    const load = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        setError(null);

        const {periodType, params} = getPeriodParams();
        const thisMonth = new Date().toISOString().slice(0, 7);

        // ─── Safe wrapper — error দিলে null ফেরত ───
        const safe = (promise) =>
            promise.catch((err) => {
                console.warn('Dashboard API failed:', err?.message || err);
                return {data: null};
            });

        // ─── Utils ───
        const unwrap = (r) =>
            Array.isArray(r?.data) ? r.data : (r?.data?.results || []);

        // ═══════════════════════════════════════════════════════════
        // ALL REQUESTS — parallel-এ fire
        // ═══════════════════════════════════════════════════════════
        const profitP = safe(posReportsAPI.getProfitSummaryList(
            periodType, {...params, compare: 'true'}
        ));
        const growthP = safe(posReportsAPI.getGrowthMonthly({
            start_month: thisMonth, end_month: thisMonth,
        }));
        const inventoryP = safe(posReportsAPI.getInventoryLatest());

        // ─── Product Intelligence — 4 tabs ───
        const topProfitP = safe(posReportsAPI.getProductProfitTop({
            limit: 6, by: 'total_net_profit',
        }));
        const mostPurchP = safe(posReportsAPI.getProductProfitTop({
            limit: 6, by: 'total_units_purchased',
        }));
        const mostSoldP = safe(posReportsAPI.getProductProfitTop({
            limit: 6, by: 'total_units_sold',
        }));
        const starP = safe(posReportsAPI.getStarProducts({limit: 6}));
        const slowP = safe(posReportsAPI.getSlowMovingProducts({limit: 6}));

        // ─── Activity ───
        const salesP = safe(posReportsAPI.getSales({
            ordering: '-created_at', page_size: 5,
        }));
        const purchasesP = safe(posReportsAPI.getPurchases({
            ordering: '-created_at', page_size: 5,
        }));

        // ─── Support ───
        const custP = safe(posReportsAPI.getCustomers());
        const suppP = safe(posReportsAPI.getSuppliers());
        const prodP = safe(posReportsAPI.getProducts());
        // 👇 ADD cashbox balance fetch
        const balancesP = safe(posCashboxAPI.getBalances());
        // 🆕 Dashboard KPI Overview fetch
        const kpisP = safe(posReportsAPI.getDashboardKPIs());

        // ─── All promises array (for race/settle) ───
        const allP = [
            profitP, growthP, inventoryP,
            topProfitP, mostPurchP, mostSoldP, starP, slowP,
            salesP, purchasesP,
            custP, suppP, prodP, balancesP, kpisP,
        ];

        // ═══════════════════════════════════════════════════════════
        // 🎯 LOADING CONTROL
        // ═══════════════════════════════════════════════════════════

        // 👇 ADD progressive update
        balancesP.then((r) => {
            setData((prev) => ({...prev, balances: r?.data || null}));
        });
        kpisP.then((r) => {
            setData((prev) => ({...prev, kpiOverview: r?.data || null}));
        });

        // First response আসলেই loading off
        Promise.race(allP).finally(() => {
            setLoading(false);
        });

        // সব শেষ হলে refreshing off
        Promise.allSettled(allP).finally(() => {
            setRefreshing(false);
        });

        // ═══════════════════════════════════════════════════════════
        // 🚀 PROGRESSIVE STATE UPDATES
        // প্রতিটা response আসলেই তার slice update
        // ═══════════════════════════════════════════════════════════

        // ─── Main sections ───
        profitP.then((r) => {
            setData((prev) => ({...prev, profit: r?.data || null}));
        });

        growthP.then((r) => {
            setData((prev) => ({...prev, growth: r?.data || null}));
        });

        inventoryP.then((r) => {
            setData((prev) => ({...prev, inventory: r?.data || null}));
        });

        // ─── Product Intelligence (4 tabs) ───
        topProfitP.then((r) => {
            setData((prev) => ({
                ...prev,
                topProducts: unwrap(r).slice(0, 6),
            }));
        });

        mostPurchP.then((r) => {
            setData((prev) => ({
                ...prev,
                mostPurchasedProducts: unwrap(r).slice(0, 6),
            }));
        });

        mostSoldP.then((r) => {
            setData((prev) => ({
                ...prev,
                mostSoldProducts: unwrap(r).slice(0, 6),
            }));
        });

        starP.then((r) => {
            setData((prev) => ({
                ...prev,
                starProducts: unwrap(r).slice(0, 6),
            }));
        });

        slowP.then((r) => {
            setData((prev) => ({
                ...prev,
                slowProducts: unwrap(r).slice(0, 6),
            }));
        });

        // ─── Recent Notes (from profit summary) ───
        profitP.then((r) => {
            const notes = [];
            (r?.data?.results || []).forEach((row) => {
                (row.business_notes || []).forEach((n) => {
                    notes.push({...n, period_key: row.period_key});
                });
            });
            notes.sort((a, b) => (b.at || '').localeCompare(a.at || ''));
            setData((prev) => ({...prev, recentNotes: notes.slice(0, 3)}));
        });

        // ─── Alerts (products + customers একসাথে লাগে) ───
        Promise.all([prodP, custP, suppP]).then(([prodRes, custRes, suppRes]) => {
            const products = unwrap(prodRes);
            const customers = unwrap(custRes);
            const suppliers = unwrap(suppRes);

            const outOfStock = products.filter((p) => (p.stock || 0) <= 0);
            const lowStock = products.filter((p) => {
                const s = p.stock || 0;
                const alert = p.alarm_when_stock_is_lessthanOrEqualto || 10;
                return s > 0 && s <= alert;
            });
            const dueCustomers = customers
                .filter((c) => parseFloat(c.due_amount || 0) > 0)
                .sort((a, b) =>
                    parseFloat(b.due_amount || 0) - parseFloat(a.due_amount || 0)
                );

            setData((prev) => ({
                ...prev,
                alerts: {lowStock, outOfStock, dueCustomers},
                supportData: {customers, suppliers, products},
            }));
        });

        // ─── Activity Feed (sales + purchases merged) ───
        Promise.all([salesP, purchasesP]).then(([salesRes, purchasesRes]) => {
            const sales = unwrap(salesRes);
            const purchases = unwrap(purchasesRes);

            const activity = [
                ...sales.map((s) => ({
                    type: 'sale',
                    id: s.id,
                    invoice: s.invoice_no,
                    party: s.customer_name || 'Walk-in',
                    amount: parseFloat(s.total_amount || 0),
                    date: s.created_at,
                    status: s.payment_status,
                    method: s.payment_method,
                })),
                ...purchases.map((p) => ({
                    type: 'purchase',
                    id: p.id,
                    invoice: p.invoice_no,
                    party: p.supplier_name || 'Supplier',
                    amount: parseFloat(p.total_amount || 0),
                    date: p.created_at,
                    status: p.payment_status,
                    method: p.payment_method,
                })),
            ]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 8);

            setData((prev) => ({...prev, activity}));
        });
    }, [getPeriodParams]);

    useEffect(() => {
        load();
    }, [load]);

    // ─── Derived ────────────────────────────────
    const health = !loading ? calculateHealthScore(data) : null;
    const insights = !loading ? generateInsights(data) : [];

    const monthlyRevenue = parseFloat(
        data.growth?.net_profit
        || data.profit?.aggregated?.total_revenue
        || 0
    );
    const goal = calculateGoalProgress(monthlyRevenue, getMonthlyGoal());

    return {
        data,
        loading,
        refreshing,
        error,
        refresh: () => load(true),
        health,
        insights,
        goal,
    };
}