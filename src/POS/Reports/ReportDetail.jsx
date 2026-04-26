import {useLocation, useNavigate} from 'react-router-dom';
import {ArrowLeft, Download, Printer, X, TrendingUp, TrendingDown, Package, Users, Truck, Box, AlertTriangle, DollarSign, RefreshCw, ShoppingCart, Wallet,} from 'lucide-react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,} from  'recharts';
import {useCallback, useEffect, useMemo, useState} from "react";

// ─── API ──────────────────────────────────────────────────────────────────────
const BASE = 'https://pos.myshopmym.com/api';
const EP = {
    sales: `${BASE}/sale/sales/`,
    customers: `${BASE}/sale/customers/`,
    salesReturn: `${BASE}/sale/sale-returns/`,
    purchases: `${BASE}/purchase/purchases/`,
    suppliers: `${BASE}/purchase/suppliers/`,
    purchaseReturn: `${BASE}/purchase/purchase-returns/`,
    products: `${BASE}/products/product/`,
    categories: `${BASE}/products/category/`,
    subcategories: `${BASE}/products/subcategory/`,
    brands: `${BASE}/products/brand/`,
    damageStock: `${BASE}/products/damage-stock/`,
    expenses: `${BASE}/cashbox/expenses/`,
    incomes: `${BASE}/cashbox/income/`,
    cashbox: `${BASE}/cashbox/cashbox/`,
};

const fetchAll = async (url) => {
    try {
        const r = await fetch(url);
        if (!r.ok) return [];
        const j = await r.json();
        return Array.isArray(j) ? j : j.results || [];
    } catch {
        return [];
    }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const toDate = (s) => (s ? s.split('T')[0] : '');
const fmt = (n) =>
    `৳ ${parseFloat(n || 0).toLocaleString('en-BD', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
const fmtN = (n) => parseFloat(n || 0).toLocaleString('en-BD');
const inRange = (dateStr, s, e) => {
    const d = toDate(dateStr);
    if (!d) return true;
    if (s && d < s) return false;
    if (e && d > e) return false;
    return true;
};

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CAT_META = {
    sales: {label: 'Sales', color: '#3b82f6', icon: ShoppingCart},
    purchase: {label: 'Purchase', color: '#f59e0b', icon: Truck},
    inventory: {label: 'Inventory', color: '#8b5cf6', icon: Package},
    financial: {label: 'Financial', color: '#10b981', icon: Wallet},
};

const REPORT_TYPES = {
    sales: ['All Sales', 'By Customer', 'By Product', 'By Category', 'By Subcategory', 'By Brand', 'By Payment Method', 'By Due', 'Sales Return'],
    purchase: ['All Purchases', 'By Supplier', 'By Product', 'By Category', 'By Brand', 'By Payment Method', 'By Due', 'Purchase Return', 'Pending Payment'],
    inventory: ['Current Stock', 'Low Stock', 'By Category', 'By Subcategory', 'By Brand', 'Damage Stock', 'Stock Value'],
    financial: ['Income', 'Expense', 'Cash in Hand', 'Profit & Loss'],
};

const PAYMENT_METHODS = ['cash', 'hand cash', 'bcash', 'bkash', 'nagad', 'card', 'bank transfer'];
const fStyle = {
    flexShrink: 0,
    border: '1px solid #e2e8f0',
    borderRadius: 7,
    padding: '5px 8px',
    fontSize: 12,
    color: '#1e293b',
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
    minWidth: 120
};
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const Spinner = () => (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200}}>
        <div style={{
            width: 32,
            height: 32,
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin .7s linear infinite'
        }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
);

const Empty = ({msg = 'No data found'}) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 160,
        color: '#94a3b8',
        gap: 8
    }}>
        <Box size={28} color="#cbd5e1"/>
        <span style={{fontSize: 14}}>{msg}</span>
    </div>
);

const Badge = ({status}) => {
    const m = {
        paid: {bg: '#dcfce7', c: '#15803d'},
        partial: {bg: '#fef9c3', c: '#854d0e'},
        unpaid: {bg: '#fee2e2', c: '#b91c1c'},
        partia: {bg: '#fef9c3', c: '#854d0e'}
    };
    const s = m[status] || {bg: '#f1f5f9', c: '#475569'};
    return <span style={{
        padding: '2px 10px',
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        background: s.bg,
        color: s.c
    }}>{status || '—'}</span>;
};

const StatCard = ({label, value, isMoney = false, color = '#3b82f6', icon: Icon}) => (
    <div style={{
        background: 'white',
        borderRadius: 12,
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
            <p style={{
                margin: 0,
                fontSize: 11,
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>{label}</p>
            {Icon && <div style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: color + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}><Icon size={13} color={color}/></div>}
        </div>
        <p style={{margin: 0, fontSize: 21, fontWeight: 700, color: '#0f172a'}}>{isMoney ? fmt(value) : fmtN(value)}</p>
    </div>
);

const DataTable = ({headers, rows}) => (
    <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
            <thead>
            <tr style={{background: '#f8fafc'}}>
                {headers.map((h, i) => (
                    <th key={i} style={{
                        padding: '10px 14px',
                        textAlign: i >= 3 ? 'right' : 'left',
                        fontWeight: 600,
                        color: '#475569',
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        borderBottom: '1px solid #e2e8f0',
                        whiteSpace: 'nowrap'
                    }}>{h}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, ri) => (
                <tr key={ri} style={{borderBottom: '1px solid #f1f5f9'}}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {row.map((cell, ci) => (
                        <td key={ci} style={{
                            padding: '10px 14px',
                            color: '#1e293b',
                            textAlign: ci >= 3 ? 'right' : 'left',
                            whiteSpace: 'nowrap'
                        }}>{cell}</td>
                    ))}
                </tr>
            ))}
            {rows.length === 0 && (
                <tr>
                    <td colSpan={headers.length} style={{textAlign: 'center', padding: 32, color: '#94a3b8'}}>No records
                        found
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    </div>
);

const FSelect = ({label, value, onChange, options, placeholder = 'All'}) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 4, minWidth: 130}}>
        <label style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
        }}>{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)}
                style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '7px 10px',
                    fontSize: 13,
                    color: '#1e293b',
                    background: 'white',
                    cursor: 'pointer',
                    outline: 'none'
                }}>
            <option value=''>{placeholder}</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

const FDate = ({label, value, onChange}) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <label style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
        }}>{label}</label>
        <input type='date' value={value} onChange={e => onChange(e.target.value)}
               style={{
                   border: '1px solid #e2e8f0',
                   borderRadius: 8,
                   padding: '7px 10px',
                   fontSize: 13,
                   color: '#1e293b',
                   background: 'white',
                   outline: 'none'
               }}/>
    </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const ReportDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {reportCategory = 'sales'} = location.state || {};

    const today = new Date().toISOString().split('T')[0];
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const [activeTab, setActiveTab] = useState(reportCategory);
    const [activeReport, setActiveReport] = useState(REPORT_TYPES[reportCategory][0]);
    const [loading, setLoading] = useState(true);

    // All raw data
    const [D, setD] = useState({
        sales: [], purchases: [], products: [], salesReturn: [], purchaseReturn: [],
        damage: [], expenses: [], incomes: [], cashbox: [],
        customers: [], suppliers: [], categories: [], subcategories: [], brands: [],
    });

    // Filters
    const [filters, setFilters] = useState({
        startDate: firstOfMonth, endDate: today,
        customerId: '', supplierId: '', categoryId: '', subcategoryId: '', brandId: '',
        paymentMethod: '', paymentStatus: '', dueOnly: false,
    });
    const sf = (k, v) => setFilters(f => ({...f, [k]: v}));
    const clearFilters = () => setFilters({
        startDate: firstOfMonth,
        endDate: today,
        customerId: '',
        supplierId: '',
        categoryId: '',
        subcategoryId: '',
        brandId: '',
        paymentMethod: '',
        paymentStatus: '',
        dueOnly: false
    });

    // ── Load everything once ──────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            setLoading(true);
            const [sales, purchases, products, salesReturn, purchaseReturn, damage, expenses, incomes, cashbox, customers, suppliers, categories, subcategories, brands] = await Promise.all([
                fetchAll(EP.sales), fetchAll(EP.purchases), fetchAll(EP.products),
                fetchAll(EP.salesReturn), fetchAll(EP.purchaseReturn), fetchAll(EP.damageStock),
                fetchAll(EP.expenses), fetchAll(EP.incomes), fetchAll(EP.cashbox),
                fetchAll(EP.customers), fetchAll(EP.suppliers), fetchAll(EP.categories),
                fetchAll(EP.subcategories), fetchAll(EP.brands),
            ]);
            setD({
                sales,
                purchases,
                products,
                salesReturn,
                purchaseReturn,
                damage,
                expenses,
                incomes,
                cashbox,
                customers,
                suppliers,
                categories,
                subcategories,
                brands
            });
            setLoading(false);
        })();
    }, []);

    // Product lookup: id -> { category, sub_category, brand }
    const productMap = useMemo(() => {
        const m = {};
        D.products.forEach(p => {
            m[p.id] = {cat: p.category, sub: p.sub_category, brand: p.brand};
        });
        return m;
    }, [D.products]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setActiveReport(REPORT_TYPES[tab][0]);
        clearFilters();
    };

    // ── Filter helpers ────────────────────────────────────────────────────────
    const itemMatchesProductFilters = useCallback((item) => {
        const pm = productMap[item.product] || {};
        if (filters.categoryId && pm.cat !== Number(filters.categoryId)) return false;
        if (filters.subcategoryId && pm.sub !== Number(filters.subcategoryId)) return false;
        if (filters.brandId && pm.brand !== Number(filters.brandId)) return false;
        return true;
    }, [productMap, filters.categoryId, filters.subcategoryId, filters.brandId]);

    const hasProductFilter = filters.categoryId || filters.subcategoryId || filters.brandId;

    const filteredSales = useMemo(() => {
        let d = D.sales.filter(s => inRange(s.created_at, filters.startDate, filters.endDate));
        if (filters.customerId) d = d.filter(s => s.customer === Number(filters.customerId));
        if (filters.paymentMethod) d = d.filter(s => s.payment_method === filters.paymentMethod);
        if (filters.paymentStatus) d = d.filter(s => s.payment_status === filters.paymentStatus);
        if (filters.dueOnly) d = d.filter(s => parseFloat(s.due_amount || 0) > 0);
        if (hasProductFilter) d = d.filter(s => (s.items || []).some(itemMatchesProductFilters));
        return d;
    }, [D.sales, filters, hasProductFilter, itemMatchesProductFilters]);

    const filteredPurchases = useMemo(() => {
        let d = D.purchases.filter(p => inRange(p.created_at, filters.startDate, filters.endDate));
        if (filters.supplierId) d = d.filter(p => p.supplier === Number(filters.supplierId));
        if (filters.paymentMethod) d = d.filter(p => p.payment_method === filters.paymentMethod);
        if (filters.paymentStatus) d = d.filter(p => p.payment_status === filters.paymentStatus);
        if (filters.dueOnly) d = d.filter(p => parseFloat(p.due_amount || 0) > 0);
        if (hasProductFilter) d = d.filter(p => (p.items || []).some(itemMatchesProductFilters));
        return d;
    }, [D.purchases, filters, hasProductFilter, itemMatchesProductFilters]);

    const filteredProducts = useMemo(() => {
        let d = [...D.products];
        if (filters.categoryId) d = d.filter(p => p.category === Number(filters.categoryId));
        if (filters.subcategoryId) d = d.filter(p => p.sub_category === Number(filters.subcategoryId));
        if (filters.brandId) d = d.filter(p => p.brand === Number(filters.brandId));
        return d;
    }, [D.products, filters.categoryId, filters.subcategoryId, filters.brandId]);

    const filteredExpenses = useMemo(() => D.expenses.filter(e => inRange(e.created_at, filters.startDate, filters.endDate)), [D.expenses, filters.startDate, filters.endDate]);
    const filteredIncomes = useMemo(() => D.incomes.filter(i => inRange(i.created_at, filters.startDate, filters.endDate)), [D.incomes, filters.startDate, filters.endDate]);
    const filteredSalesRet = useMemo(() => D.salesReturn.filter(r => inRange(r.created_at, filters.startDate, filters.endDate)), [D.salesReturn, filters.startDate, filters.endDate]);
    const filteredPurchRet = useMemo(() => D.purchaseReturn.filter(r => inRange(r.created_at, filters.startDate, filters.endDate)), [D.purchaseReturn, filters.startDate, filters.endDate]);

    // ── Compute display data ──────────────────────────────────────────────────
    const {displayData, summary, chartData} = useMemo(() => {
        if (loading) return {displayData: [], summary: {}, chartData: []};

        // ── SALES ──────────────────────────────────────────────────────────────
        if (activeTab === 'sales') {
            if (activeReport === 'Sales Return') {
                const d = filteredSalesRet;
                return {
                    displayData: d,
                    summary: {
                        returnCount: d.length,
                        totalReturn: d.reduce((s, x) => s + parseFloat(x.total_return_amount || 0), 0)
                    },
                    chartData: d.map(r => ({
                        date: toDate(r.created_at),
                        amount: parseFloat(r.total_return_amount || 0)
                    }))
                };
            }
            if (activeReport === 'By Customer') {
                const map = {};
                filteredSales.forEach(s => {
                    const k = s.customer_name || `Customer ${s.customer}`;
                    if (!map[k]) map[k] = {name: k, orders: 0, value: 0, due: 0};
                    map[k].orders++;
                    map[k].value += parseFloat(s.total_amount || 0);
                    map[k].due += parseFloat(s.due_amount || 0);
                });
                const agg = Object.values(map).sort((a, b) => b.value - a.value);
                return {
                    displayData: agg,
                    summary: {
                        customers: agg.length,
                        totalSales: agg.reduce((s, x) => s + x.value, 0),
                        totalDue: agg.reduce((s, x) => s + x.due, 0)
                    },
                    chartData: agg.slice(0, 8)
                };
            }
            if (['By Product', 'By Category', 'By Subcategory', 'By Brand'].includes(activeReport)) {
                const map = {};
                filteredSales.forEach(sale => {
                    (sale.items || []).filter(itemMatchesProductFilters).forEach(item => {
                        const pm = productMap[item.product] || {};
                        let k;
                        if (activeReport === 'By Product') k = item.product_name || `P${item.product}`;
                        else if (activeReport === 'By Category') k = D.categories.find(c => c.id === pm.cat)?.name || 'Unknown';
                        else if (activeReport === 'By Subcategory') k = D.subcategories.find(c => c.id === pm.sub)?.title || 'Unknown';
                        else k = D.brands.find(b => b.id === pm.brand)?.title || 'Unknown';
                        if (!map[k]) map[k] = {name: k, qty: 0, value: 0};
                        map[k].qty += item.quantity || 0;
                        map[k].value += parseFloat(item.total_price || 0);
                    });
                });
                const agg = Object.values(map).sort((a, b) => b.value - a.value);
                return {
                    displayData: agg,
                    summary: {
                        groups: agg.length,
                        totalValue: agg.reduce((s, x) => s + x.value, 0),
                        totalQty: agg.reduce((s, x) => s + x.qty, 0)
                    },
                    chartData: agg.slice(0, 8)
                };
            }
            if (activeReport === 'By Payment Method') {
                const map = {};
                filteredSales.forEach(s => {
                    const k = s.payment_method || 'unknown';
                    if (!map[k]) map[k] = {name: k, orders: 0, total: 0};
                    map[k].orders++;
                    map[k].total += parseFloat(s.total_amount || 0);
                });
                const agg = Object.values(map).sort((a, b) => b.total - a.total);
                return {
                    displayData: agg,
                    summary: {methods: agg.length, totalSales: agg.reduce((s, x) => s + x.total, 0)},
                    chartData: agg
                };
            }
            if (activeReport === 'By Due') {
                const d = filteredSales.filter(s => parseFloat(s.due_amount || 0) > 0);
                return {
                    displayData: d,
                    summary: {
                        totalOrders: d.length,
                        totalDue: d.reduce((s, x) => s + parseFloat(x.due_amount || 0), 0),
                        totalSales: d.reduce((s, x) => s + parseFloat(x.total_amount || 0), 0)
                    },
                    chartData: d.map(s => ({date: toDate(s.created_at), due: parseFloat(s.due_amount || 0)}))
                };
            }
            // All Sales
            const d = filteredSales;
            const cd = [...d].sort((a, b) => toDate(a.created_at).localeCompare(toDate(b.created_at))).map(s => ({
                date: toDate(s.created_at),
                amount: parseFloat(s.total_amount || 0)
            }));
            return {
                displayData: d,
                summary: {
                    totalOrders: d.length,
                    totalSales: d.reduce((s, x) => s + parseFloat(x.total_amount || 0), 0),
                    totalDue: d.reduce((s, x) => s + parseFloat(x.due_amount || 0), 0)
                },
                chartData: cd
            };
        }

        // ── PURCHASE ───────────────────────────────────────────────────────────
        if (activeTab === 'purchase') {
            if (activeReport === 'Purchase Return') {
                const d = filteredPurchRet;
                return {
                    displayData: d,
                    summary: {
                        returnCount: d.length,
                        totalReturn: d.reduce((s, x) => s + parseFloat(x.total_amount || 0), 0)
                    },
                    chartData: []
                };
            }
            if (activeReport === 'Pending Payment') {
                const d = filteredPurchases.filter(p => p.payment_status !== 'paid');
                return {
                    displayData: d,
                    summary: {
                        pendingCount: d.length,
                        totalPending: d.reduce((s, x) => s + parseFloat(x.due_amount || 0), 0)
                    },
                    chartData: []
                };
            }
            if (activeReport === 'By Supplier') {
                const map = {};
                filteredPurchases.forEach(p => {
                    const k = p.supplier_name || `Supplier ${p.supplier}`;
                    if (!map[k]) map[k] = {name: k, orders: 0, value: 0, due: 0};
                    map[k].orders++;
                    map[k].value += parseFloat(p.total_amount || 0);
                    map[k].due += parseFloat(p.due_amount || 0);
                });
                const agg = Object.values(map).sort((a, b) => b.value - a.value);
                return {
                    displayData: agg,
                    summary: {
                        suppliers: agg.length,
                        totalPurchase: agg.reduce((s, x) => s + x.value, 0),
                        totalDue: agg.reduce((s, x) => s + x.due, 0)
                    },
                    chartData: agg.slice(0, 8)
                };
            }
            if (['By Product', 'By Category', 'By Brand'].includes(activeReport)) {
                const map = {};
                filteredPurchases.forEach(pur => {
                    (pur.items || []).filter(itemMatchesProductFilters).forEach(item => {
                        const pm = productMap[item.product] || {};
                        let k;
                        if (activeReport === 'By Product') k = item.product_name || `P${item.product}`;
                        else if (activeReport === 'By Category') k = D.categories.find(c => c.id === pm.cat)?.name || 'Unknown';
                        else k = D.brands.find(b => b.id === pm.brand)?.title || 'Unknown';
                        if (!map[k]) map[k] = {name: k, qty: 0, value: 0};
                        map[k].qty += item.quantity || 0;
                        map[k].value += parseFloat(item.total_price || 0);
                    });
                });
                const agg = Object.values(map).sort((a, b) => b.value - a.value);
                return {
                    displayData: agg,
                    summary: {groups: agg.length, totalValue: agg.reduce((s, x) => s + x.value, 0)},
                    chartData: agg.slice(0, 8)
                };
            }
            if (activeReport === 'By Payment Method') {
                const map = {};
                filteredPurchases.forEach(p => {
                    const k = p.payment_method || 'unknown';
                    if (!map[k]) map[k] = {name: k, orders: 0, total: 0};
                    map[k].orders++;
                    map[k].total += parseFloat(p.total_amount || 0);
                });
                const agg = Object.values(map).sort((a, b) => b.total - a.total);
                return {
                    displayData: agg,
                    summary: {methods: agg.length, totalPurchase: agg.reduce((s, x) => s + x.total, 0)},
                    chartData: agg
                };
            }
            if (activeReport === 'By Due') {
                const d = filteredPurchases.filter(p => parseFloat(p.due_amount || 0) > 0);
                return {
                    displayData: d,
                    summary: {
                        totalOrders: d.length,
                        totalDue: d.reduce((s, x) => s + parseFloat(x.due_amount || 0), 0)
                    },
                    chartData: d.map(p => ({date: toDate(p.created_at), due: parseFloat(p.due_amount || 0)}))
                };
            }
            // All Purchases
            const d = filteredPurchases;
            const cd = [...d].sort((a, b) => toDate(a.created_at).localeCompare(toDate(b.created_at))).map(p => ({
                date: toDate(p.created_at),
                amount: parseFloat(p.total_amount || 0)
            }));
            return {
                displayData: d,
                summary: {
                    totalOrders: d.length,
                    totalPurchase: d.reduce((s, x) => s + parseFloat(x.total_amount || 0), 0),
                    totalDue: d.reduce((s, x) => s + parseFloat(x.due_amount || 0), 0)
                },
                chartData: cd
            };
        }

        // ── INVENTORY ──────────────────────────────────────────────────────────
        if (activeTab === 'inventory') {
            if (activeReport === 'Damage Stock') {
                return {displayData: D.damage, summary: {damagedItems: D.damage.length}, chartData: []};
            }
            if (activeReport === 'Low Stock') {
                const d = filteredProducts.filter(p => (p.stock || 0) <= (p.alarm_when_stock_is_lessthanOrEqualto || 10));
                return {
                    displayData: d,
                    summary: {lowStockCount: d.length},
                    chartData: d.slice(0, 10).map(p => ({name: p.name, stock: p.stock || 0}))
                };
            }
            if (['By Category', 'By Subcategory', 'By Brand'].includes(activeReport)) {
                const map = {};
                filteredProducts.forEach(p => {
                    const k = activeReport === 'By Category' ? p.category_name : activeReport === 'By Subcategory' ? p.sub_category_name : p.brand_name;
                    const key = k || 'Unknown';
                    if (!map[key]) map[key] = {name: key, products: 0, totalStock: 0, totalValue: 0};
                    map[key].products++;
                    map[key].totalStock += p.stock || 0;
                    map[key].totalValue += parseFloat(p.purchase_price || 0) * (p.stock || 0);
                });
                const agg = Object.values(map);
                return {
                    displayData: agg,
                    summary: {
                        groups: agg.length,
                        totalProducts: filteredProducts.length,
                        totalStockValue: agg.reduce((s, x) => s + x.totalValue, 0)
                    },
                    chartData: agg
                };
            }
            // Current Stock / Stock Value
            const totalValue = filteredProducts.reduce((s, p) => s + parseFloat(p.purchase_price || 0) * (p.stock || 0), 0);
            return {
                displayData: filteredProducts,
                summary: {totalProducts: filteredProducts.length, totalStockValue: totalValue},
                chartData: filteredProducts.slice(0, 10).map(p => ({
                    name: p.name,
                    stock: p.stock || 0,
                    value: parseFloat(p.purchase_price || 0) * (p.stock || 0)
                }))
            };
        }

        // ── FINANCIAL ──────────────────────────────────────────────────────────
        if (activeTab === 'financial') {
            if (activeReport === 'Income') {
                const d = filteredIncomes;
                return {
                    displayData: d,
                    summary: {incomeCount: d.length, totalIncome: d.reduce((s, x) => s + parseFloat(x.amount || 0), 0)},
                    chartData: d.slice(0, 8).map(x => ({
                        name: (x.title || '').slice(0, 18),
                        amount: parseFloat(x.amount || 0)
                    }))
                };
            }
            if (activeReport === 'Expense') {
                const d = filteredExpenses;
                return {
                    displayData: d,
                    summary: {
                        expenseCount: d.length,
                        totalExpense: d.reduce((s, x) => s + parseFloat(x.amount || 0), 0)
                    },
                    chartData: d.slice(0, 8).map(x => ({
                        name: (x.title || '').slice(0, 18),
                        amount: parseFloat(x.amount || 0)
                    }))
                };
            }
            if (activeReport === 'Cash in Hand') {
                const d = D.cashbox;
                return {
                    displayData: d,
                    summary: {totalCash: d.reduce((s, x) => s + parseFloat(x.amount || 0), 0)},
                    chartData: []
                };
            }
            // P&L
            const salesTotal = filteredSales.reduce((s, x) => s + parseFloat(x.total_amount || 0), 0);
            const expenseTotal = filteredExpenses.reduce((s, x) => s + parseFloat(x.amount || 0), 0);
            const incomeTotal = filteredIncomes.reduce((s, x) => s + parseFloat(x.amount || 0), 0);
            const profit = salesTotal + incomeTotal - expenseTotal;
            const mmap = {};
            filteredSales.forEach(s => {
                const m = toDate(s.created_at).slice(0, 7);
                if (!mmap[m]) mmap[m] = {month: m, sales: 0, expense: 0};
                mmap[m].sales += parseFloat(s.total_amount || 0);
            });
            filteredExpenses.forEach(e => {
                const m = toDate(e.created_at).slice(0, 7);
                if (!mmap[m]) mmap[m] = {month: m, sales: 0, expense: 0};
                mmap[m].expense += parseFloat(e.amount || 0);
            });
            const cd = Object.values(mmap).sort((a, b) => a.month.localeCompare(b.month));
            return {displayData: [], summary: {salesTotal, expenseTotal, incomeTotal, profit}, chartData: cd};
        }

        return {displayData: [], summary: {}, chartData: []};
    }, [loading, activeTab, activeReport, filteredSales, filteredPurchases, filteredProducts, filteredExpenses, filteredIncomes, filteredSalesRet, filteredPurchRet, D, productMap, itemMatchesProductFilters]);

    // ── Summary Cards ─────────────────────────────────────────────────────────
    const meta = CAT_META[activeTab];
    const renderSummary = () => {
        const s = summary, cards = [];
        const add = (label, value, icon, isMoney = false, color) => cards.push({
            label,
            value,
            icon,
            isMoney,
            color: color || meta.color
        });
        if ('totalOrders' in s) add('Total Orders', s.totalOrders, ShoppingCart);
        if ('totalSales' in s) add('Total Sales', s.totalSales, TrendingUp, true);
        if ('totalPurchase' in s) add('Total Purchase', s.totalPurchase, Truck, true);
        if ('totalDue' in s) add('Total Due', s.totalDue, AlertTriangle, true, '#ef4444');
        if ('returnCount' in s) add('Returns', s.returnCount, RefreshCw);
        if ('totalReturn' in s) add('Return Amount', s.totalReturn, RefreshCw, true, '#ef4444');
        if ('customers' in s) add('Customers', s.customers, Users);
        if ('suppliers' in s) add('Suppliers', s.suppliers, Truck);
        if ('groups' in s) add('Groups', s.groups, Box);
        if ('totalQty' in s) add('Total Qty', s.totalQty, Package);
        if ('totalValue' in s) add('Total Value', s.totalValue, DollarSign, true);
        if ('methods' in s) add('Methods', s.methods, Wallet);
        if ('pendingCount' in s) add('Pending Orders', s.pendingCount, AlertTriangle, false, '#f59e0b');
        if ('totalPending' in s) add('Pending Amount', s.totalPending, AlertTriangle, true, '#f59e0b');
        if ('totalProducts' in s) add('Products', s.totalProducts, Package);
        if ('totalStockValue' in s) add('Stock Value', s.totalStockValue, DollarSign, true);
        if ('lowStockCount' in s) add('Low Stock', s.lowStockCount, AlertTriangle, false, '#ef4444');
        if ('damagedItems' in s) add('Damaged', s.damagedItems, AlertTriangle, false, '#ef4444');
        if ('incomeCount' in s) add('Income Entries', s.incomeCount, TrendingUp);
        if ('totalIncome' in s) add('Total Income', s.totalIncome, TrendingUp, true, '#10b981');
        if ('expenseCount' in s) add('Expense Entries', s.expenseCount, TrendingDown);
        if ('totalExpense' in s) add('Total Expense', s.totalExpense, TrendingDown, true, '#ef4444');
        if ('totalCash' in s) add('Cash in Hand', s.totalCash, DollarSign, true, '#10b981');
        if ('salesTotal' in s) add('Total Sales', s.salesTotal, TrendingUp, true, '#10b981');
        if ('expenseTotal' in s) add('Total Expense', s.expenseTotal, TrendingDown, true, '#ef4444');
        if ('incomeTotal' in s) add('Other Income', s.incomeTotal, DollarSign, true);
        if ('profit' in s) {
            const isP = s.profit >= 0;
            add(isP ? 'Net Profit' : 'Net Loss', Math.abs(s.profit), isP ? TrendingUp : TrendingDown, true, isP ? '#10b981' : '#ef4444');
        }
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))',
                gap: 12,
                marginBottom: 20
            }}>
                {cards.map((c, i) => <StatCard key={i} {...c}/>)}
            </div>
        );
    };

    // ── Charts ────────────────────────────────────────────────────────────────
    const tipStyle = {borderRadius: 8, fontSize: 13, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)'};
    const renderChart = () => {
        if (loading) return <Spinner/>;
        if (!chartData?.length) return <Empty msg="No chart data for current filters"/>;

        // Time-series area chart
        if (chartData[0]?.date) {
            const key = chartData[0]?.amount !== undefined ? 'amount' : 'due';
            return (
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={chartData} margin={{top: 10, right: 20, left: 10, bottom: 5}}>
                        <defs>
                            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={meta.color} stopOpacity={0.15}/>
                                <stop offset="95%" stopColor={meta.color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                        <XAxis dataKey="date" tick={{fontSize: 11, fill: '#94a3b8'}}/>
                        <YAxis tick={{fontSize: 11, fill: '#94a3b8'}}/>
                        <Tooltip contentStyle={tipStyle} formatter={v => [fmt(v), 'Amount']}/>
                        <Area type="monotone" dataKey={key} stroke={meta.color} strokeWidth={2} fill="url(#g1)"/>
                    </AreaChart>
                </ResponsiveContainer>
            );
        }

        // Horizontal bar (grouped by name+value)
        if (['By Customer', 'By Product', 'By Category', 'By Subcategory', 'By Brand', 'By Supplier'].includes(activeReport)) {
            return (
                <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 44)}>
                    <BarChart data={chartData} layout="vertical" margin={{left: 20, right: 20, top: 5, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
                        <XAxis type="number" tick={{fontSize: 11, fill: '#94a3b8'}}/>
                        <YAxis type="category" dataKey="name" width={140} tick={{fontSize: 12, fill: '#475569'}}/>
                        <Tooltip contentStyle={tipStyle} formatter={v => [fmt(v), 'Value']}/>
                        <Bar dataKey="value" fill={meta.color} radius={[0, 4, 4, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        // Pie (payment method)
        if (activeReport === 'By Payment Method') {
            const dataKey = chartData[0]?.total !== undefined ? 'total' : 'amount';
            return (
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie data={chartData} dataKey={dataKey} nameKey="name" cx="50%" cy="50%" outerRadius={110}
                             label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                        </Pie>
                        <Tooltip formatter={v => [fmt(v), 'Amount']}/>
                    </PieChart>
                </ResponsiveContainer>
            );
        }

        // Inventory grouped
        if (['By Category', 'By Subcategory', 'By Brand'].includes(activeReport) && activeTab === 'inventory') {
            return (
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData} margin={{top: 5, right: 20, left: 10, bottom: 30}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                        <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8', angle: -20, textAnchor: 'end'}}/>
                        <YAxis tick={{fontSize: 11, fill: '#94a3b8'}}/>
                        <Tooltip contentStyle={tipStyle}/>
                        <Legend/>
                        <Bar dataKey="totalStock" fill={meta.color} name="Stock" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        // Stock bar
        if (['Current Stock', 'Stock Value'].includes(activeReport)) {
            return (
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData} margin={{top: 5, right: 20, left: 10, bottom: 30}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                        <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8', angle: -20, textAnchor: 'end'}}/>
                        <YAxis tick={{fontSize: 11, fill: '#94a3b8'}}/>
                        <Tooltip contentStyle={tipStyle}/>
                        <Legend/>
                        <Bar dataKey="stock" fill="#8b5cf6" name="Qty" radius={[4, 4, 0, 0]}/>
                        <Bar dataKey="value" fill={meta.color} name="Value" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        // Low stock
        if (activeReport === 'Low Stock') {
            return (
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                        <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8'}}/>
                        <YAxis tick={{fontSize: 11, fill: '#94a3b8'}}/>
                        <Tooltip contentStyle={tipStyle}/>
                        <Bar dataKey="stock" fill="#ef4444" name="Stock" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        // P&L monthly
        if (activeReport === 'Profit & Loss') {
            return (
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData} margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                        <XAxis dataKey="month" tick={{fontSize: 11, fill: '#94a3b8'}}/>
                        <YAxis tick={{fontSize: 11, fill: '#94a3b8'}}/>
                        <Tooltip contentStyle={tipStyle} formatter={v => [fmt(v)]}/>
                        <Legend/>
                        <Bar dataKey="sales" fill="#10b981" name="Sales" radius={[4, 4, 0, 0]}/>
                        <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        // Income / Expense pie
        if (['Income', 'Expense'].includes(activeReport)) {
            return (
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie data={chartData} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={110}
                             label={({name, percent}) => `${name.slice(0, 12)} ${(percent * 100).toFixed(0)}%`}>
                            {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                        </Pie>
                        <Tooltip formatter={v => [fmt(v), 'Amount']}/>
                    </PieChart>
                </ResponsiveContainer>
            );
        }
        return <Empty msg="No chart for this view"/>;
    };

    // ── Table ─────────────────────────────────────────────────────────────────
    const renderTable = () => {
        if (loading) return <Spinner/>;
        if (!displayData?.length) return <Empty/>;

        if (activeTab === 'sales') {
            if (activeReport === 'All Sales') return <DataTable
                headers={['Date', 'Invoice', 'Customer', 'Method', 'Total', 'Paid', 'Due', 'Status']}
                rows={displayData.map(r => [toDate(r.created_at), r.invoice_no, r.customer_name || 'Walk-in', r.payment_method, fmt(r.total_amount), fmt(r.paid_amount), fmt(r.due_amount),
                    <Badge status={r.payment_status}/>])}/>;
            if (activeReport === 'By Customer') return <DataTable
                headers={['Customer', 'Orders', 'Total Sales', 'Total Due']}
                rows={displayData.map(r => [r.name, fmtN(r.orders), fmt(r.value), fmt(r.due)])}/>;
            if (['By Product', 'By Category', 'By Subcategory', 'By Brand'].includes(activeReport)) return <DataTable
                headers={[activeReport.replace('By ', ''), 'Qty Sold', 'Revenue']}
                rows={displayData.map(r => [r.name, fmtN(r.qty), fmt(r.value)])}/>;
            if (activeReport === 'By Payment Method') return <DataTable headers={['Method', 'Orders', 'Total']}
                                                                        rows={displayData.map(r => [r.name, fmtN(r.orders), fmt(r.total)])}/>;
            if (activeReport === 'By Due') return <DataTable
                headers={['Date', 'Invoice', 'Customer', 'Total', 'Due', 'Status']}
                rows={displayData.map(r => [toDate(r.created_at), r.invoice_no, r.customer_name || 'Walk-in', fmt(r.total_amount), fmt(r.due_amount),
                    <Badge status={r.payment_status}/>])}/>;
            if (activeReport === 'Sales Return') return <DataTable
                headers={['Date', 'Invoice', 'Customer', 'Return Amt', 'Status']}
                rows={displayData.map(r => [toDate(r.created_at), r.sale_invoice_no, r.customer_name, fmt(r.total_return_amount),
                    <Badge status={r.payment_status}/>])}/>;
        }
        if (activeTab === 'purchase') {
            if (activeReport === 'All Purchases') return <DataTable
                headers={['Date', 'Invoice', 'Supplier', 'Method', 'Total', 'Paid', 'Due', 'Status']}
                rows={displayData.map(r => [toDate(r.created_at), r.invoice_no, r.supplier_name, r.payment_method, fmt(r.total_amount), fmt(r.paid_amount), fmt(r.due_amount),
                    <Badge status={r.payment_status}/>])}/>;
            if (activeReport === 'By Supplier') return <DataTable headers={['Supplier', 'Orders', 'Total', 'Due']}
                                                                  rows={displayData.map(r => [r.name, fmtN(r.orders), fmt(r.value), fmt(r.due)])}/>;
            if (['By Product', 'By Category', 'By Brand'].includes(activeReport)) return <DataTable
                headers={[activeReport.replace('By ', ''), 'Qty', 'Value']}
                rows={displayData.map(r => [r.name, fmtN(r.qty), fmt(r.value)])}/>;
            if (activeReport === 'By Payment Method') return <DataTable headers={['Method', 'Orders', 'Total']}
                                                                        rows={displayData.map(r => [r.name, fmtN(r.orders), fmt(r.total)])}/>;
            if (activeReport === 'By Due') return <DataTable
                headers={['Date', 'Invoice', 'Supplier', 'Total', 'Due', 'Status']}
                rows={displayData.map(r => [toDate(r.created_at), r.invoice_no, r.supplier_name, fmt(r.total_amount), fmt(r.due_amount),
                    <Badge status={r.payment_status}/>])}/>;
            if (activeReport === 'Purchase Return') return <DataTable headers={['Date', 'Invoice', 'Total']}
                                                                      rows={displayData.map(r => [toDate(r.created_at), r.invoice_no || r.id, fmt(r.total_amount)])}/>;
            if (activeReport === 'Pending Payment') return <DataTable
                headers={['Date', 'Invoice', 'Supplier', 'Total', 'Due', 'Status']}
                rows={displayData.map(r => [toDate(r.created_at), r.invoice_no, r.supplier_name, fmt(r.total_amount), fmt(r.due_amount),
                    <Badge status={r.payment_status}/>])}/>;
        }
        if (activeTab === 'inventory') {
            if (['Current Stock', 'Stock Value'].includes(activeReport)) return <DataTable
                headers={['Product', 'Code', 'Category', 'Brand', 'Buy Price', 'Sell Price', 'Stock', 'Value']}
                rows={displayData.map(p => [p.name, p.product_code, p.category_name, p.brand_name, fmt(p.purchase_price), fmt(p.selling_price), fmtN(p.stock), fmt(parseFloat(p.purchase_price || 0) * (p.stock || 0))])}/>;
            if (activeReport === 'Low Stock') return <DataTable headers={['Product', 'Category', 'Stock', 'Alert At']}
                                                                rows={displayData.map(p => [p.name, p.category_name,
                                                                    <span style={{
                                                                        color: '#ef4444',
                                                                        fontWeight: 700
                                                                    }}>{p.stock}</span>, p.alarm_when_stock_is_lessthanOrEqualto || 0])}/>;
            if (['By Category', 'By Subcategory', 'By Brand'].includes(activeReport)) return <DataTable
                headers={[activeReport.replace('By ', ''), 'Products', 'Total Stock', 'Stock Value']}
                rows={displayData.map(r => [r.name, fmtN(r.products), fmtN(r.totalStock), fmt(r.totalValue)])}/>;
            if (activeReport === 'Damage Stock') return <DataTable headers={['Date', 'Product', 'Qty', 'Type', 'Note']}
                                                                   rows={displayData.map(d => [toDate(d.created_at), d.product_name || d.product, fmtN(d.quantity), d.damage_type || '—', d.note || '—'])}/>;
        }
        if (activeTab === 'financial') {
            if (['Income', 'Expense'].includes(activeReport)) return <DataTable headers={['Date', 'Title', 'Amount']}
                                                                                rows={displayData.map(r => [toDate(r.created_at), r.title, fmt(r.amount)])}/>;
            if (activeReport === 'Cash in Hand') return <DataTable headers={['Date', 'Title', 'Amount']}
                                                                   rows={displayData.map(r => [toDate(r.created_at), r.title || '—', fmt(r.amount)])}/>;
            if (activeReport === 'Profit & Loss') return <div
                style={{padding: 24, textAlign: 'center', color: '#64748b', fontSize: 14}}>Summary shown in cards &
                chart above.</div>;
        }
        return <Empty/>;
    };

    // ── Filter panel ──────────────────────────────────────────────────────────

    // ── CSV ───────────────────────────────────────────────────────────────────
    const handleCSV = () => {
        if (!displayData?.length || !Array.isArray(displayData)) return;
        const keys = Object.keys(displayData[0]).filter(k => typeof displayData[0][k] !== 'object');
        const csv = [keys.join(','), ...displayData.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))].join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], {type: 'text/csv'}));
        a.download = `${activeTab}_${activeReport.replace(/ /g, '_')}_${today}.csv`;
        a.click();
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={{minHeight: '100vh', background: '#f8fafc'}}>
            <style>{`
        @media print{.no-print{display:none!important}}
        ::-webkit-scrollbar{height:4px;width:4px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
      `}</style>

            {/* ── STICKY NAVBAR ── */}
            <div className="no-print" style={{
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
            }}>
                {/* Row 1: category tabs + actions */}
                <div style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'stretch'
                }}>
                    <button onClick={() => navigate('/reports')} style={{
                        padding: '0 16px',
                        border: 'none',
                        borderRight: '1px solid #f1f5f9',
                        background: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#64748b',
                        fontSize: 13,
                        flexShrink: 0
                    }}>
                        <ArrowLeft size={16}/><span>Back</span>
                    </button>
                    <div style={{display: 'flex', overflowX: 'auto', flex: 1, scrollbarWidth: 'none'}}>
                        {Object.entries(CAT_META).map(([key, val]) => {
                            const Icon = val.icon, active = activeTab === key;
                            return (
                                <button key={key} onClick={() => handleTabChange(key)} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '14px 20px',
                                    border: 'none',
                                    borderBottom: `3px solid ${active ? val.color : 'transparent'}`,
                                    background: 'none',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    color: active ? val.color : '#64748b',
                                    fontWeight: active ? 600 : 400,
                                    fontSize: 14,
                                    transition: 'all .15s',
                                    flexShrink: 0
                                }}>
                                    <Icon size={16}/>{val.label}
                                </button>
                            );
                        })}
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                        padding: '0 0 0 12px',
                        borderLeft: '1px solid #f1f5f9',
                        flexShrink: 0
                    }}>
                        <button onClick={handleCSV} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 12px',
                            fontSize: 12,
                            fontWeight: 500,
                            border: '1px solid #e2e8f0',
                            borderRadius: 7,
                            background: 'white',
                            cursor: 'pointer',
                            color: '#475569',
                            whiteSpace: 'nowrap'
                        }}>
                            <Download size={14}/> CSV
                        </button>
                        <button onClick={() => window.print()} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 12px',
                            fontSize: 12,
                            fontWeight: 500,
                            border: '1px solid #e2e8f0',
                            borderRadius: 7,
                            background: 'white',
                            cursor: 'pointer',
                            color: '#475569',
                            whiteSpace: 'nowrap'
                        }}>
                            <Printer size={14}/> Print
                        </button>
                    </div>
                </div>

                {/* Row 2: report type dropdown + all filters in one row */}
                <div style={{borderTop: '1px solid #f1f5f9', background: '#fafafa'}}>
                    <div style={{
                        maxWidth: 1280,
                        margin: '0 auto',
                        padding: '8px 20px',
                        display: 'flex',
                        gap: 10,
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        alignItems: 'center'
                    }}>
                        {/* Report Type — always visible */}
                        {/* <div style={{flexShrink:0}}>
              <select
                value={activeReport}
                onChange={e=>setActiveReport(e.target.value)}
                style={{border:`1.5px solid ${meta.color}`,borderRadius:8,padding:'6px 10px',fontSize:13,fontWeight:600,color:meta.color,background:'white',cursor:'pointer',outline:'none',minWidth:160}}
              >
                {REPORT_TYPES[activeTab].map(rt=><option key={rt} value={rt}>{rt}</option>)}
              </select>
            </div> */}

                        {/* Divider */}
                        <div style={{width: 1, height: 24, background: '#e2e8f0', flexShrink: 0}}/>

                        {/* Date filters */}
                        {!(['Current Stock', 'Stock Value', 'By Category', 'By Subcategory', 'By Brand', 'Low Stock'].includes(activeReport) && activeTab === 'inventory') && <>
                            <div style={{flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6}}>
                                <label style={{
                                    fontSize: 11,
                                    color: '#94a3b8',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap'
                                }}>FROM</label>
                                <input type='date' value={filters.startDate}
                                       onChange={e => sf('startDate', e.target.value)}
                                       style={{
                                           border: '1px solid #e2e8f0',
                                           borderRadius: 7,
                                           padding: '5px 8px',
                                           fontSize: 12,
                                           color: '#1e293b',
                                           background: 'white',
                                           outline: 'none'
                                       }}/>
                            </div>
                            <div style={{flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6}}>
                                <label style={{
                                    fontSize: 11,
                                    color: '#94a3b8',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap'
                                }}>TO</label>
                                <input type='date' value={filters.endDate} onChange={e => sf('endDate', e.target.value)}
                                       style={{
                                           border: '1px solid #e2e8f0',
                                           borderRadius: 7,
                                           padding: '5px 8px',
                                           fontSize: 12,
                                           color: '#1e293b',
                                           background: 'white',
                                           outline: 'none'
                                       }}/>
                            </div>
                            <div style={{width: 1, height: 24, background: '#e2e8f0', flexShrink: 0}}/>
                        </>}

                        {/* Customer */}
                        {activeTab === 'sales' && !['Sales Return', 'By Payment Method'].includes(activeReport) &&
                            <select value={filters.customerId} onChange={e => sf('customerId', e.target.value)}
                                    style={fStyle}>
                                <option value=''>All Customers</option>
                                {D.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        }

                        {/* Supplier */}
                        {activeTab === 'purchase' && !['Purchase Return', 'By Payment Method'].includes(activeReport) &&
                            <select value={filters.supplierId} onChange={e => sf('supplierId', e.target.value)}
                                    style={fStyle}>
                                <option value=''>All Suppliers</option>
                                {D.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        }

                        {/* Category */}
                        {!['Sales Return', 'Purchase Return', 'Profit & Loss', 'Cash in Hand', 'Income', 'Expense'].includes(activeReport) &&
                            <select value={filters.categoryId} onChange={e => sf('categoryId', e.target.value)}
                                    style={fStyle}>
                                <option value=''>All Categories</option>
                                {D.categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        }

                        {/* Subcategory */}
                        {!['Sales Return', 'Purchase Return', 'Profit & Loss', 'Cash in Hand', 'Income', 'Expense'].includes(activeReport) &&
                            <select value={filters.subcategoryId} onChange={e => sf('subcategoryId', e.target.value)}
                                    style={fStyle}>
                                <option value=''>All Subcategories</option>
                                {D.subcategories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        }

                        {/* Brand */}
                        {!['Sales Return', 'Purchase Return', 'Profit & Loss', 'Cash in Hand', 'Income', 'Expense'].includes(activeReport) &&
                            <select value={filters.brandId} onChange={e => sf('brandId', e.target.value)}
                                    style={fStyle}>
                                <option value=''>All Brands</option>
                                {D.brands.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                            </select>
                        }

                        {/* Payment Method */}
                        {['All Sales', 'By Payment Method', 'All Purchases'].includes(activeReport) &&
                            <select value={filters.paymentMethod} onChange={e => sf('paymentMethod', e.target.value)}
                                    style={fStyle}>
                                <option value=''>All Methods</option>
                                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        }

                        {/* Status */}
                        {['All Sales', 'By Due', 'All Purchases', 'Pending Payment'].includes(activeReport) &&
                            <select value={filters.paymentStatus} onChange={e => sf('paymentStatus', e.target.value)}
                                    style={fStyle}>
                                <option value=''>All Status</option>
                                <option value='paid'>Paid</option>
                                <option value='partial'>Partial</option>
                                <option value='unpaid'>Unpaid</option>
                            </select>
                        }

                        {/* Due Only toggle */}
                        {['All Sales', 'All Purchases', 'By Due'].includes(activeReport) &&
                            <button onClick={() => sf('dueOnly', !filters.dueOnly)} style={{
                                flexShrink: 0,
                                padding: '5px 12px',
                                borderRadius: 7,
                                border: `1px solid ${filters.dueOnly ? meta.color : '#e2e8f0'}`,
                                background: filters.dueOnly ? meta.color + '15' : 'white',
                                color: filters.dueOnly ? meta.color : '#64748b',
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all .15s'
                            }}>
                                {filters.dueOnly ? '✓ Due Only' : 'Due Only'}
                            </button>
                        }

                        {/* Clear */}
                        <button onClick={clearFilters} style={{
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '5px 10px',
                            borderRadius: 7,
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            fontSize: 12,
                            marginLeft: 'auto'
                        }}>
                            <X size={12}/> Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* ── CONTENT ── */}
            <div style={{maxWidth: 1280, margin: '0 auto', padding: '20px'}}>
                {/* Loading banner */}
                {loading && (
                    <div style={{
                        background: 'white',
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 20,
                        border: '1px solid #e2e8f0',
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: 14
                    }}>
                        Loading all data… this may take a moment
                    </div>
                )}

                {/* Summary */}
                {renderSummary()}

                {/* Chart */}
                <div style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: '20px 24px',
                    marginBottom: 20,
                    border: '1px solid #e2e8f0'
                }}>
                    <h2 style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#0f172a',
                        margin: '0 0 16px'
                    }}>{activeReport}</h2>
                    {renderChart()}
                </div>

                {/* Table */}
                <div style={{background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden'}}>
                    <div style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0}}>Data Table</h2>
                        {Array.isArray(displayData) && displayData.length > 0 &&
                            <span style={{fontSize: 12, color: '#94a3b8'}}>{displayData.length} records</span>}
                    </div>
                    {renderTable()}
                </div>
            </div>
        </div>
    );
};

export default ReportDetail;

