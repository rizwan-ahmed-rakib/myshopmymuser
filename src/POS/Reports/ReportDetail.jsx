import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Printer, X, TrendingUp, TrendingDown, Package,
  Users, Truck, Box, AlertTriangle, DollarSign, RefreshCw, ShoppingCart,
  Wallet, CheckCircle, Save, Sparkles, HelpCircle, ShieldAlert,
  ArrowUpRight, ArrowDownRight, Layers, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { posReportsAPI } from "../../context_or_provider/pos/reports/reportsAPI";

// ─── API ENDPOINTS ────────────────────────────────────────────────────────────
const EP = {
  sales: () => posReportsAPI.getSales(),
  customers: () => posReportsAPI.getCustomers(),
  salesReturn: () => posReportsAPI.getSalesReturn(),
  purchases: () => posReportsAPI.getPurchases(),
  suppliers: () => posReportsAPI.getSuppliers(),
  purchaseReturn: () => posReportsAPI.getPurchaseReturn(),
  products: () => posReportsAPI.getProducts(),
  categories: () => posReportsAPI.getCategories(),
  subcategories: () => posReportsAPI.getSubcategories(),
  brands: () => posReportsAPI.getBrands(),
  specifications: () => posReportsAPI.getSpecifications(),
  dosageForms: () => posReportsAPI.getDosageForms(),
  damageStock: () => posReportsAPI.getDamageStock(),
  expenses: () => posReportsAPI.getExpenses(),
  incomes: () => posReportsAPI.getIncomes(),
  cashbox: () => posReportsAPI.getCashbox(),
  profitSummary: () => posReportsAPI.getProfitSummary(),
  productProfits: () => posReportsAPI.getProductProfits(),
};

const fetchAll = async (apiCall) => {
  try {
    const response = await apiCall();
    if (!response || !response.data) return [];
    return Array.isArray(response.data) ? response.data : response.data.results || response.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// ─── FORMATTING & UTILS ───────────────────────────────────────────────────────
const toDate = (s) => (s ? String(s).split('T')[0] : '');
const fmt = (n) =>
  `৳ ${parseFloat(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtN = (n) => parseFloat(n || 0).toLocaleString('en-BD');
const inRange = (dateStr, s, e) => {
  const d = toDate(dateStr);
  if (!d) return true;
  if (s && d < s) return false;
  if (e && d > e) return false;
  return true;
};

// ─── CATEGORY & REPORT METADATA ───────────────────────────────────────────────
const CAT_META = {
  accounting: { label: 'Accounting & Profit', color: '#0ea5e9', icon: TrendingUp },
  sales: { label: 'Sales Reports', color: '#3b82f6', icon: ShoppingCart },
  purchase: { label: 'Purchase Reports', color: '#f59e0b', icon: Truck },
  inventory: { label: 'Inventory & Intelligence', color: '#8b5cf6', icon: Package },
  financial: { label: 'Financial & Cash', color: '#10b981', icon: Wallet },
};

const REPORT_TYPES = {
  accounting: [
    'Period Profit Summary',
    'Business Growth & Health',
    'Inventory Valuation',
    'Product Profitability',
    'Top Profitable Products'
  ],
  sales: [
    'All Sales',
    'By Customer',
    'By Product',
    'By Category',
    'By Subcategory',
    'By Brand',
    'By Specification',
    'By Dosage Form',
    'By Payment Method',
    'By Due',
    'Sales Return'
  ],
  purchase: [
    'All Purchases',
    'By Supplier',
    'By Product',
    'By Category',
    'By Brand',
    'By Specification',
    'By Dosage Form',
    'By Payment Method',
    'By Due',
    'Purchase Return',
    'Pending Payment'
  ],
  inventory: [
    'Current Stock & Valuation',
    'Low Stock & Reorder Alert',
    'Slow-Moving / Dead Stock',
    'By Category',
    'By Subcategory',
    'By Brand',
    'By Specification',
    'By Dosage Form',
    'Damaged Stock Analysis'
  ],
  financial: [
    'Profit & Loss',
    'Income Statement',
    'Expense Breakdown',
    'Cash in Hand'
  ],
};

const PAYMENT_METHODS = ['cash', 'hand cash', 'bcash', 'bkash', 'nagad', 'card', 'bank transfer'];
const PIE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

// ─── SEARCHABLE SELECT (COMBOBOX) ─────────────────────────────────────────────
const SearchableSelect = ({ label, value, onChange, options = [], placeholder = 'All', minWidth = 145 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const selectedOption = options.find((o) => String(o.value) === String(value));
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter((o) => String(o.label || '').toLowerCase().includes(term));
  }, [options, searchTerm]);

  return (
    <div ref={containerRef} style={{ position: 'relative', minWidth, flexShrink: 0 }}>
      {label && (
        <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block', marginBottom: 2 }}>
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          border: isOpen ? '1.5px solid #3b82f6' : '1px solid #cbd5e1',
          borderRadius: 7,
          padding: '4px 9px',
          fontSize: 12,
          color: selectedOption ? '#0f172a' : '#64748b',
          background: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          boxShadow: isOpen ? '0 0 0 3px rgba(59, 130, 246, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)',
          transition: 'all 0.15s ease',
          height: 32,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: selectedOption ? 600 : 400 }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {selectedOption && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setSearchTerm('');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: '#f1f5f9',
                color: '#64748b',
                cursor: 'pointer',
              }}
              title="Clear selection"
            >
              <X size={10} />
            </span>
          )}
          <span style={{ fontSize: 8, color: '#94a3b8' }}>▼</span>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: Math.max(200, containerRef.current?.offsetWidth || 200),
            maxHeight: 270,
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            boxShadow: '0 14px 30px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.05)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: 6, borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder={`Search ${label || placeholder}...`}
              style={{
                width: '100%',
                padding: '5px 8px',
                fontSize: 12,
                border: '1px solid #cbd5e1',
                borderRadius: 5,
                outline: 'none',
                background: 'white',
              }}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1, maxHeight: 200, padding: '3px 0' }}>
            <div
              onClick={() => {
                onChange('');
                setIsOpen(false);
                setSearchTerm('');
              }}
              style={{
                padding: '6px 10px',
                fontSize: 12,
                cursor: 'pointer',
                background: !value ? '#eff6ff' : 'transparent',
                color: !value ? '#2563eb' : '#64748b',
                fontWeight: !value ? 600 : 400,
              }}
            >
              {placeholder}
            </div>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '10px', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                No options found
              </div>
            ) : (
              filteredOptions.map((o) => {
                const isSelected = String(o.value) === String(value);
                return (
                  <div
                    key={o.value}
                    onClick={() => {
                      onChange(o.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    style={{
                      padding: '6px 10px',
                      fontSize: 12,
                      cursor: 'pointer',
                      background: isSelected ? '#eff6ff' : 'transparent',
                      color: isSelected ? '#2563eb' : '#1e293b',
                      fontWeight: isSelected ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>{o.label}</span>
                    {isSelected && <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 11 }}>✓</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220 }}>
    <div style={{
      width: 34,
      height: 34,
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #0ea5e9',
      borderRadius: '50%',
      animation: 'spin .7s linear infinite'
    }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const Empty = ({ msg = 'No data available for current filters' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
    color: '#94a3b8',
    gap: 8
  }}>
    <Box size={32} color="#cbd5e1" />
    <span style={{ fontSize: 13, fontWeight: 500 }}>{msg}</span>
  </div>
);

const Badge = ({ status }) => {
  const m = {
    paid: { bg: '#dcfce7', c: '#15803d' },
    partial: { bg: '#fef9c3', c: '#854d0e' },
    unpaid: { bg: '#fee2e2', c: '#b91c1c' },
    out_of_stock: { bg: '#fee2e2', c: '#b91c1c' },
    low_stock: { bg: '#fef9c3', c: '#854d0e' },
    in_stock: { bg: '#dcfce7', c: '#15803d' },
  };
  const s = m[status] || { bg: '#f1f5f9', c: '#475569' };
  return (
    <span style={{
      padding: '2px 9px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      background: s.bg,
      color: s.c,
      display: 'inline-block',
      textTransform: 'capitalize'
    }}>
      {status ? String(status).replace('_', ' ') : '—'}
    </span>
  );
};

const StatCard = ({ label, value, isMoney = false, color = '#0ea5e9', icon: Icon, subtext }) => (
  <div style={{
    background: 'white',
    borderRadius: 12,
    padding: '14px 18px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
      <p style={{
        margin: 0,
        fontSize: 11,
        color: '#64748b',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
      }}>{label}</p>
      {Icon && (
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: color + '15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={14} color={color} />
        </div>
      )}
    </div>
    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
      {isMoney ? fmt(value) : fmtN(value)}
    </p>
    {subtext && <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{subtext}</span>}
  </div>
);

const DataTable = ({ headers, rows }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: '11px 14px',
              textAlign: i >= 3 ? 'right' : 'left',
              fontWeight: 600,
              color: '#475569',
              fontSize: 11,
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
          <tr key={ri} style={{ borderBottom: '1px solid #f1f5f9' }}
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
            <td colSpan={headers.length} style={{ textAlign: 'center', padding: 36, color: '#94a3b8' }}>
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ReportDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reportCategory = 'accounting' } = location.state || {};

  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState(reportCategory || 'accounting');
  const [activeReport, setActiveReport] = useState(REPORT_TYPES[reportCategory || 'accounting'][0]);
  const [loading, setLoading] = useState(true);

  // Accounting Timeframe switcher
  const [accountingPeriod, setAccountingPeriod] = useState('monthly'); // 'daily' | 'monthly' | 'yearly' | 'all_time'
  const [businessNote, setBusinessNote] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSavedMsg, setNoteSavedMsg] = useState('');
  const [recalculating, setRecalculating] = useState(false);

  // Raw API Datasets
  const [D, setD] = useState({
    sales: [], purchases: [], products: [], salesReturn: [], purchaseReturn: [],
    damage: [], expenses: [], incomes: [], cashbox: [],
    customers: [], suppliers: [], categories: [], subcategories: [], brands: [],
    specifications: [], dosageForms: [], profitSummary: null, productProfits: [],
  });

  // Filters State
  const [filters, setFilters] = useState({
    startDate: firstOfMonth, endDate: today,
    customerId: '', supplierId: '', categoryId: '', subcategoryId: '', brandId: '',
    specificationId: '', dosageFormId: '',
    paymentMethod: '', paymentStatus: '', dueOnly: false,
  });

  const sf = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const clearFilters = () => setFilters({
    startDate: firstOfMonth,
    endDate: today,
    customerId: '',
    supplierId: '',
    categoryId: '',
    subcategoryId: '',
    brandId: '',
    specificationId: '',
    dosageFormId: '',
    paymentMethod: '',
    paymentStatus: '',
    dueOnly: false
  });

  // Quick Date Shortcut helper
  const setQuickPeriod = (type) => {
    const now = new Date();
    let s = '', e = today;
    if (type === 'today') {
      s = today;
    } else if (type === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      s = d.toISOString().split('T')[0];
    } else if (type === 'month') {
      s = firstOfMonth;
    } else if (type === 'year') {
      s = `${now.getFullYear()}-01-01`;
    } else if (type === 'all') {
      s = '';
      e = '';
    }
    setFilters(f => ({ ...f, startDate: s, endDate: e }));
  };

  // ── Load All Datasets ───────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        sales, purchases, products, salesReturn, purchaseReturn, damage,
        expenses, incomes, cashbox, customers, suppliers, categories,
        subcategories, brands, specifications, dosageForms,
        profitSummaryRes, productProfitsRes
      ] = await Promise.all([
        fetchAll(EP.sales), fetchAll(EP.purchases), fetchAll(EP.products),
        fetchAll(EP.salesReturn), fetchAll(EP.purchaseReturn), fetchAll(EP.damageStock),
        fetchAll(EP.expenses), fetchAll(EP.incomes), fetchAll(EP.cashbox),
        fetchAll(EP.customers), fetchAll(EP.suppliers), fetchAll(EP.categories),
        fetchAll(EP.subcategories), fetchAll(EP.brands),
        fetchAll(EP.specifications), fetchAll(EP.dosageForms),
        EP.profitSummary().then(r => r.data).catch(() => null),
        fetchAll(EP.productProfits),
      ]);

      setD({
        sales, purchases, products, salesReturn, purchaseReturn,
        damage, expenses, incomes, cashbox, customers, suppliers,
        categories, subcategories, brands, specifications, dosageForms,
        profitSummary: profitSummaryRes,
        productProfits: productProfitsRes,
      });

      // Sync business note for active accounting period
      if (profitSummaryRes && profitSummaryRes[accountingPeriod]) {
        setBusinessNote(profitSummaryRes[accountingPeriod].business_note || '');
      }
    } catch (err) {
      console.error("Failed to load reports data", err);
    } finally {
      setLoading(false);
    }
  }, [accountingPeriod]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync note when accounting period changes
  useEffect(() => {
    if (D.profitSummary && D.profitSummary[accountingPeriod]) {
      setBusinessNote(D.profitSummary[accountingPeriod].business_note || '');
    }
  }, [accountingPeriod, D.profitSummary]);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveReport(REPORT_TYPES[tab][0]);
    clearFilters();
  };

  // Product Lookup mapping
  const productMap = useMemo(() => {
    const m = {};
    D.products.forEach(p => {
      m[p.id] = {
        cat: p.category,
        sub: p.sub_category,
        brand: p.brand,
        spec: p.specification,
        dosage: p.dosage_form,
        spec_name: p.specification_name,
        dosage_name: p.dosage_form_name,
      };
    });
    return m;
  }, [D.products]);

  // Product Filter Matching
  const itemMatchesProductFilters = useCallback((item) => {
    const pm = productMap[item.product] || {};
    if (filters.categoryId && pm.cat !== Number(filters.categoryId)) return false;
    if (filters.subcategoryId && pm.sub !== Number(filters.subcategoryId)) return false;
    if (filters.brandId && pm.brand !== Number(filters.brandId)) return false;
    if (filters.specificationId && pm.spec !== Number(filters.specificationId)) return false;
    if (filters.dosageFormId && pm.dosage !== Number(filters.dosageFormId)) return false;
    return true;
  }, [productMap, filters.categoryId, filters.subcategoryId, filters.brandId, filters.specificationId, filters.dosageFormId]);

  const hasProductFilter = filters.categoryId || filters.subcategoryId || filters.brandId || filters.specificationId || filters.dosageFormId;

  // Filtered Datasets
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
    if (filters.specificationId) d = d.filter(p => p.specification === Number(filters.specificationId));
    if (filters.dosageFormId) d = d.filter(p => p.dosage_form === Number(filters.dosageFormId));
    return d;
  }, [D.products, filters.categoryId, filters.subcategoryId, filters.brandId, filters.specificationId, filters.dosageFormId]);

  const filteredExpenses = useMemo(() => D.expenses.filter(e => inRange(e.created_at, filters.startDate, filters.endDate)), [D.expenses, filters.startDate, filters.endDate]);
  const filteredIncomes = useMemo(() => D.incomes.filter(i => inRange(i.created_at, filters.startDate, filters.endDate)), [D.incomes, filters.startDate, filters.endDate]);
  const filteredSalesRet = useMemo(() => D.salesReturn.filter(r => inRange(r.created_at, filters.startDate, filters.endDate)), [D.salesReturn, filters.startDate, filters.endDate]);
  const filteredPurchRet = useMemo(() => D.purchaseReturn.filter(r => inRange(r.created_at, filters.startDate, filters.endDate)), [D.purchaseReturn, filters.startDate, filters.endDate]);

  // ── Save Business Note Handler ──────────────────────────────────────────────
  const handleSaveBusinessNote = async () => {
    setNoteSaving(true);
    setNoteSavedMsg('');
    try {
      const activePeriodObj = D.profitSummary ? D.profitSummary[accountingPeriod] : null;
      const periodKey = activePeriodObj?.period_key || (accountingPeriod === 'all_time' ? 'all' : today);
      await posReportsAPI.updateBusinessNote({
        target_type: 'profit',
        period_type: accountingPeriod,
        period_key: periodKey,
        business_note: businessNote,
      });
      setNoteSavedMsg('Note saved successfully!');
      setTimeout(() => setNoteSavedMsg(''), 3500);
      loadData();
    } catch (err) {
      console.error('Error saving business note:', err);
    } finally {
      setNoteSaving(false);
    }
  };

  // ── Recalculate Profit Summary Handler ──────────────────────────────────────
  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await posReportsAPI.recalculateProfit();
      await loadData();
    } catch (err) {
      console.error('Recalculation error:', err);
    } finally {
      setRecalculating(false);
    }
  };

  // ── Compute Display Data & Aggregates ───────────────────────────────────────
  const { displayData, summary, chartData } = useMemo(() => {
    if (loading) return { displayData: [], summary: {}, chartData: [] };

    // ── 1. ACCOUNTING & PROFIT TAB ────────────────────────────────────────────
    if (activeTab === 'accounting') {
      const pData = D.profitSummary ? D.profitSummary[accountingPeriod] : null;
      const invVal = D.profitSummary?.inventory_valuation ? (D.profitSummary.inventory_valuation.monthly || D.profitSummary.inventory_valuation.yearly) : null;
      const growth = D.profitSummary?.business_growth ? (D.profitSummary.business_growth[accountingPeriod] || D.profitSummary.business_growth.all_time) : null;

      if (activeReport === 'Product Profitability' || activeReport === 'Top Profitable Products') {
        let proList = [...D.productProfits];
        if (hasProductFilter) {
          proList = proList.filter(p => {
            const pm = productMap[p.product] || {};
            if (filters.categoryId && pm.cat !== Number(filters.categoryId)) return false;
            if (filters.brandId && pm.brand !== Number(filters.brandId)) return false;
            if (filters.specificationId && pm.spec !== Number(filters.specificationId)) return false;
            if (filters.dosageFormId && pm.dosage !== Number(filters.dosageFormId)) return false;
            return true;
          });
        }
        proList.sort((a, b) => parseFloat(b.total_net_profit || 0) - parseFloat(a.total_net_profit || 0));
        const chartList = proList.slice(0, 10).map(p => ({
          name: p.product_name,
          profit: parseFloat(p.total_net_profit || 0),
          revenue: parseFloat(p.total_revenue || 0)
        }));
        return {
          displayData: proList,
          summary: {
            totalProducts: proList.length,
            totalGrossProfit: proList.reduce((s, x) => s + parseFloat(x.total_gross_profit || 0), 0),
            totalNetProfit: proList.reduce((s, x) => s + parseFloat(x.total_net_profit || 0), 0),
            totalUnitsSold: proList.reduce((s, x) => s + (x.total_units_sold || 0), 0),
          },
          chartData: chartList
        };
      }

      // Default Period Profit Summary
      return {
        displayData: pData ? [pData] : [],
        summary: {
          period: accountingPeriod,
          revenue: parseFloat(pData?.total_revenue || 0),
          cogs: parseFloat(pData?.total_cost || 0),
          grossProfit: parseFloat(pData?.gross_profit || 0),
          netProfit: parseFloat(pData?.accrual_total_net_profit_with_damage_loss || pData?.accrual_net_profit || 0),
          cashProfit: parseFloat(pData?.total_cash_realized_net_profit || pData?.cash_realized_net_profit || 0),
          unrealizedProfit: parseFloat(pData?.unrealized_net_profit || 0),
          expense: parseFloat(pData?.total_operational_expense || 0),
          damageLoss: parseFloat(pData?.total_non_returnable_damage_loss || 0),
          totalAssets: parseFloat(growth?.total_asset || 0),
          growthPct: parseFloat(growth?.growth_percentage || 0),
          roa: parseFloat(growth?.roa || 0),
          inventoryVal: parseFloat(invVal?.total_present_inventory_purchase_value || 0),
          marginPct: parseFloat(pData?.average_profit_percentage_on_accrual_net_sale_value || 0),
        },
        chartData: [
          { name: 'Revenue', amount: parseFloat(pData?.total_revenue || 0) },
          { name: 'Cost of Goods', amount: parseFloat(pData?.total_cost || 0) },
          { name: 'Gross Profit', amount: parseFloat(pData?.gross_profit || 0) },
          { name: 'Operating Expense', amount: parseFloat(pData?.total_operational_expense || 0) },
          { name: 'Net Profit', amount: parseFloat(pData?.accrual_total_net_profit_with_damage_loss || 0) },
          { name: 'Cash Realized Profit', amount: parseFloat(pData?.total_cash_realized_net_profit || 0) },
        ]
      };
    }

    // ── 2. SALES TAB ──────────────────────────────────────────────────────────
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
          if (!map[k]) map[k] = { name: k, orders: 0, value: 0, due: 0 };
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
          chartData: agg.slice(0, 10)
        };
      }
      if (['By Product', 'By Category', 'By Subcategory', 'By Brand', 'By Specification', 'By Dosage Form'].includes(activeReport)) {
        const map = {};
        filteredSales.forEach(sale => {
          (sale.items || []).filter(itemMatchesProductFilters).forEach(item => {
            const pm = productMap[item.product] || {};
            let k;
            if (activeReport === 'By Product') k = item.product_name || `P${item.product}`;
            else if (activeReport === 'By Category') k = D.categories.find(c => c.id === pm.cat)?.title || D.categories.find(c => c.id === pm.cat)?.name || 'Unknown';
            else if (activeReport === 'By Subcategory') k = D.subcategories.find(c => c.id === pm.sub)?.title || 'Unknown';
            else if (activeReport === 'By Brand') k = D.brands.find(b => b.id === pm.brand)?.title || 'Unknown';
            else if (activeReport === 'By Specification') k = D.specifications.find(s => s.id === pm.spec)?.title || pm.spec_name || 'Unknown';
            else k = D.dosageForms.find(df => df.id === pm.dosage)?.title || pm.dosage_name || 'Unknown';
            if (!map[k]) map[k] = { name: k, qty: 0, value: 0 };
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
          chartData: agg.slice(0, 10)
        };
      }
      if (activeReport === 'By Payment Method') {
        const map = {};
        filteredSales.forEach(s => {
          const k = s.payment_method || 'unknown';
          if (!map[k]) map[k] = { name: k, orders: 0, total: 0 };
          map[k].orders++;
          map[k].total += parseFloat(s.total_amount || 0);
        });
        const agg = Object.values(map).sort((a, b) => b.total - a.total);
        return {
          displayData: agg,
          summary: { methods: agg.length, totalSales: agg.reduce((s, x) => s + x.total, 0) },
          chartData: agg
        };
      }
      if (activeReport === 'By Due') {
        const d = filteredSales.filter(s => parseFloat(s.due_amount || 0) > 0);
        return {
          displayData: d,
          summary: {
            totalOrders: d.length,
            totalDue: d.reduce((s, x) => s + parseFloat(s.due_amount || 0), 0),
            totalSales: d.reduce((s, x) => s + parseFloat(s.total_amount || 0), 0)
          },
          chartData: d.map(s => ({ date: toDate(s.created_at), due: parseFloat(s.due_amount || 0) }))
        };
      }
      // All Sales Default
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
          totalDue: d.reduce((s, x) => s + parseFloat(s.due_amount || 0), 0)
        },
        chartData: cd
      };
    }

    // ── 3. PURCHASE TAB ───────────────────────────────────────────────────────
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
          if (!map[k]) map[k] = { name: k, orders: 0, value: 0, due: 0 };
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
          chartData: agg.slice(0, 10)
        };
      }
      if (['By Product', 'By Category', 'By Brand', 'By Specification', 'By Dosage Form'].includes(activeReport)) {
        const map = {};
        filteredPurchases.forEach(pur => {
          (pur.items || []).filter(itemMatchesProductFilters).forEach(item => {
            const pm = productMap[item.product] || {};
            let k;
            if (activeReport === 'By Product') k = item.product_name || `P${item.product}`;
            else if (activeReport === 'By Category') k = D.categories.find(c => c.id === pm.cat)?.title || D.categories.find(c => c.id === pm.cat)?.name || 'Unknown';
            else if (activeReport === 'By Brand') k = D.brands.find(b => b.id === pm.brand)?.title || 'Unknown';
            else if (activeReport === 'By Specification') k = D.specifications.find(s => s.id === pm.spec)?.title || pm.spec_name || 'Unknown';
            else k = D.dosageForms.find(df => df.id === pm.dosage)?.title || pm.dosage_name || 'Unknown';
            if (!map[k]) map[k] = { name: k, qty: 0, value: 0 };
            map[k].qty += item.quantity || 0;
            map[k].value += parseFloat(item.total_price || 0);
          });
        });
        const agg = Object.values(map).sort((a, b) => b.value - a.value);
        return {
          displayData: agg,
          summary: { groups: agg.length, totalValue: agg.reduce((s, x) => s + x.value, 0) },
          chartData: agg.slice(0, 10)
        };
      }
      if (activeReport === 'By Payment Method') {
        const map = {};
        filteredPurchases.forEach(p => {
          const k = p.payment_method || 'unknown';
          if (!map[k]) map[k] = { name: k, orders: 0, total: 0 };
          map[k].orders++;
          map[k].total += parseFloat(p.total_amount || 0);
        });
        const agg = Object.values(map).sort((a, b) => b.total - a.total);
        return {
          displayData: agg,
          summary: { methods: agg.length, totalPurchase: agg.reduce((s, x) => s + x.total, 0) },
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
          chartData: d.map(p => ({ date: toDate(p.created_at), due: parseFloat(p.due_amount || 0) }))
        };
      }
      // All Purchases Default
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

    // ── 4. INVENTORY TAB ──────────────────────────────────────────────────────
    if (activeTab === 'inventory') {
      if (activeReport === 'Damaged Stock Analysis') {
        const d = D.damage;
        const retLoss = d.filter(x => x.damage_type === 'returnable').reduce((s, x) => s + parseFloat(x.total_loss || 0), 0);
        const nonRetLoss = d.filter(x => x.damage_type === 'non_returnable').reduce((s, x) => s + parseFloat(x.total_loss || 0), 0);
        return {
          displayData: d,
          summary: {
            damagedItems: d.length,
            totalLoss: retLoss + nonRetLoss,
            nonReturnableLoss: nonRetLoss,
            returnableLoss: retLoss
          },
          chartData: [
            { name: 'Non-Returnable Loss', value: nonRetLoss },
            { name: 'Returnable / Recoverable', value: retLoss },
          ]
        };
      }

      if (activeReport === 'Low Stock & Reorder Alert') {
        const d = filteredProducts.filter(p => (p.stock || 0) <= (p.alarm_when_stock_is_lessthanOrEqualto || 10));
        return {
          displayData: d,
          summary: {
            lowStockCount: d.length,
            outOfStockCount: d.filter(p => (p.stock || 0) <= 0).length,
          },
          chartData: d.slice(0, 10).map(p => ({ name: p.name, stock: p.stock || 0 }))
        };
      }

      if (activeReport === 'Slow-Moving / Dead Stock') {
        // Find products with stock > 0 but low or zero sale volume in filtered sales
        const soldProductIds = new Set();
        filteredSales.forEach(s => (s.items || []).forEach(it => soldProductIds.add(it.product)));
        const dead = filteredProducts.filter(p => (p.stock || 0) > 3 && !soldProductIds.has(p.id));
        const deadCapital = dead.reduce((s, p) => s + parseFloat(p.purchase_price || 0) * (p.stock || 0), 0);
        return {
          displayData: dead,
          summary: {
            deadCount: dead.length,
            trappedCapital: deadCapital,
          },
          chartData: dead.slice(0, 10).map(p => ({
            name: p.name,
            trappedCapital: parseFloat(p.purchase_price || 0) * (p.stock || 0)
          }))
        };
      }

      if (['By Category', 'By Subcategory', 'By Brand', 'By Specification', 'By Dosage Form'].includes(activeReport)) {
        const map = {};
        filteredProducts.forEach(p => {
          const k = activeReport === 'By Category' ? p.category_name
            : activeReport === 'By Subcategory' ? p.sub_category_name
            : activeReport === 'By Brand' ? p.brand_name
            : activeReport === 'By Specification' ? (p.specification_name || 'No Spec')
            : (p.dosage_form_name || 'No Dosage');
          const key = k || 'Unknown';
          if (!map[key]) map[key] = { name: key, products: 0, totalStock: 0, totalValue: 0 };
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

      // Default: Current Stock & Valuation
      const totalCostValue = filteredProducts.reduce((s, p) => s + parseFloat(p.purchase_price || 0) * (p.stock || 0), 0);
      const totalRetailValue = filteredProducts.reduce((s, p) => s + parseFloat(p.selling_price || 0) * (p.stock || 0), 0);
      const potentialMargin = totalRetailValue - totalCostValue;
      return {
        displayData: filteredProducts,
        summary: {
          totalProducts: filteredProducts.length,
          totalStockUnits: filteredProducts.reduce((s, p) => s + (p.stock || 0), 0),
          totalStockCostValue: totalCostValue,
          totalStockRetailValue: totalRetailValue,
          potentialMargin: potentialMargin
        },
        chartData: filteredProducts.slice(0, 10).map(p => ({
          name: p.name,
          costVal: parseFloat(p.purchase_price || 0) * (p.stock || 0),
          retailVal: parseFloat(p.selling_price || 0) * (p.stock || 0)
        }))
      };
    }

    // ── 5. FINANCIAL TAB ──────────────────────────────────────────────────────
    if (activeTab === 'financial') {
      if (activeReport === 'Income Statement') {
        const d = filteredIncomes;
        return {
          displayData: d,
          summary: { incomeCount: d.length, totalIncome: d.reduce((s, x) => s + parseFloat(x.amount || 0), 0) },
          chartData: d.slice(0, 10).map(x => ({
            name: (x.title || '').slice(0, 18),
            amount: parseFloat(x.amount || 0)
          }))
        };
      }
      if (activeReport === 'Expense Breakdown') {
        const d = filteredExpenses;
        return {
          displayData: d,
          summary: {
            expenseCount: d.length,
            totalExpense: d.reduce((s, x) => s + parseFloat(x.amount || 0), 0)
          },
          chartData: d.slice(0, 10).map(x => ({
            name: (x.title || '').slice(0, 18),
            amount: parseFloat(x.amount || 0)
          }))
        };
      }
      if (activeReport === 'Cash in Hand') {
        const d = D.cashbox;
        return {
          displayData: d,
          summary: { totalCash: d.reduce((s, x) => s + parseFloat(x.amount || 0), 0) },
          chartData: []
        };
      }
      // P&L overview
      const salesTotal = filteredSales.reduce((s, x) => s + parseFloat(x.total_amount || 0), 0);
      const expenseTotal = filteredExpenses.reduce((s, x) => s + parseFloat(x.amount || 0), 0);
      const incomeTotal = filteredIncomes.reduce((s, x) => s + parseFloat(x.amount || 0), 0);
      const profit = salesTotal + incomeTotal - expenseTotal;
      const mmap = {};
      filteredSales.forEach(s => {
        const m = toDate(s.created_at).slice(0, 7);
        if (!mmap[m]) mmap[m] = { month: m, sales: 0, expense: 0 };
        mmap[m].sales += parseFloat(s.total_amount || 0);
      });
      filteredExpenses.forEach(e => {
        const m = toDate(e.created_at).slice(0, 7);
        if (!mmap[m]) mmap[m] = { month: m, sales: 0, expense: 0 };
        mmap[m].expense += parseFloat(e.amount || 0);
      });
      const cd = Object.values(mmap).sort((a, b) => a.month.localeCompare(b.month));
      return { displayData: [], summary: { salesTotal, expenseTotal, incomeTotal, profit }, chartData: cd };
    }

    return { displayData: [], summary: {}, chartData: [] };
  }, [loading, activeTab, activeReport, accountingPeriod, filteredSales, filteredPurchases, filteredProducts, filteredExpenses, filteredIncomes, filteredSalesRet, filteredPurchRet, D, productMap, itemMatchesProductFilters, hasProductFilter]);

  // ── Stat Summary Cards Renderer ─────────────────────────────────────────────
  const meta = CAT_META[activeTab] || CAT_META.accounting;

  const renderSummaryCards = () => {
    const s = summary, cards = [];
    const add = (label, value, icon, isMoney = false, color, subtext) => cards.push({
      label, value, icon, isMoney, color: color || meta.color, subtext
    });

    if (activeTab === 'accounting') {
      if ('revenue' in s) add('Total Revenue (বিক্রয়)', s.revenue, DollarSign, true, '#0ea5e9');
      if ('cogs' in s) add('Cost of Goods (ক্রয়খরচ)', s.cogs, Truck, true, '#64748b');
      if ('grossProfit' in s) add('Gross Profit (মোট লাভ)', s.grossProfit, TrendingUp, true, '#10b981', `Margin: ${s.marginPct}%`);
      if ('expense' in s) add('Operating Expense (খরচ)', s.expense, TrendingDown, true, '#ef4444');
      if ('netProfit' in s) add('Accrual Net Profit (প্রকৃত লাভ)', s.netProfit, Sparkles, true, s.netProfit >= 0 ? '#10b981' : '#ef4444');
      if ('cashProfit' in s) add('Cash Realized Profit (হাতে আসা লাভ)', s.cashProfit, Wallet, true, '#059669', 'পকেটের আসল নগদ লাভ');
      if ('unrealizedProfit' in s) add('Unrealized Due Profit (বাকির লাভ)', s.unrealizedProfit, AlertTriangle, true, '#f59e0b', 'বাকি আদায় হলে হাতে আসবে');
      if ('totalAssets' in s && s.totalAssets > 0) add('Total Business Assets (মোট সম্পদ)', s.totalAssets, Layers, true, '#6366f1', `ROA: ${s.roa}%`);
    } else {
      if ('totalOrders' in s) add('Total Invoices', s.totalOrders, ShoppingCart);
      if ('totalSales' in s) add('Total Sales', s.totalSales, TrendingUp, true);
      if ('totalPurchase' in s) add('Total Purchase', s.totalPurchase, Truck, true);
      if ('totalDue' in s) add('Total Due (বকেয়া)', s.totalDue, AlertTriangle, true, '#ef4444');
      if ('returnCount' in s) add('Returns Count', s.returnCount, RefreshCw);
      if ('totalReturn' in s) add('Return Amount', s.totalReturn, RefreshCw, true, '#ef4444');
      if ('customers' in s) add('Total Customers', s.customers, Users);
      if ('suppliers' in s) add('Total Suppliers', s.suppliers, Truck);
      if ('groups' in s) add('Filtered Groups', s.groups, Box);
      if ('totalQty' in s) add('Total Qty Sold', s.totalQty, Package);
      if ('totalValue' in s) add('Total Value', s.totalValue, DollarSign, true);
      if ('methods' in s) add('Payment Methods', s.methods, Wallet);
      if ('pendingCount' in s) add('Pending Invoices', s.pendingCount, AlertTriangle, false, '#f59e0b');
      if ('totalPending' in s) add('Pending Due', s.totalPending, AlertTriangle, true, '#f59e0b');
      if ('totalProducts' in s) add('Total Products', s.totalProducts, Package);
      if ('totalStockUnits' in s) add('Total Units in Stock', s.totalStockUnits, Package);
      if ('totalStockCostValue' in s) add('Stock Cost Value (ক্রয়মূল্য)', s.totalStockCostValue, DollarSign, true, '#8b5cf6');
      if ('totalStockRetailValue' in s) add('Stock Retail Value (বিক্রয়মূল্য)', s.totalStockRetailValue, TrendingUp, true, '#0ea5e9');
      if ('potentialMargin' in s) add('Potential Gross Profit', s.potentialMargin, Sparkles, true, '#10b981');
      if ('lowStockCount' in s) add('Low Stock Items', s.lowStockCount, AlertTriangle, false, '#f59e0b');
      if ('outOfStockCount' in s) add('Out of Stock', s.outOfStockCount, ShieldAlert, false, '#ef4444');
      if ('deadCount' in s) add('Slow / Dead Items', s.deadCount, AlertTriangle, false, '#ef4444');
      if ('trappedCapital' in s) add('Trapped Capital (আটকে থাকা টাকা)', s.trappedCapital, DollarSign, true, '#ef4444');
      if ('damagedItems' in s) add('Damaged Records', s.damagedItems, AlertTriangle, false, '#ef4444');
      if ('totalLoss' in s) add('Total Damage Loss', s.totalLoss, TrendingDown, true, '#ef4444');
      if ('incomeCount' in s) add('Income Entries', s.incomeCount, TrendingUp);
      if ('totalIncome' in s) add('Total Income', s.totalIncome, TrendingUp, true, '#10b981');
      if ('expenseCount' in s) add('Expense Entries', s.expenseCount, TrendingDown);
      if ('totalExpense' in s) add('Total Expense', s.totalExpense, TrendingDown, true, '#ef4444');
      if ('totalCash' in s) add('Cash in Hand', s.totalCash, DollarSign, true, '#10b981');
      if ('salesTotal' in s) add('Total Sales', s.salesTotal, TrendingUp, true, '#10b981');
      if ('expenseTotal' in s) add('Total Expense', s.expenseTotal, TrendingDown, true, '#ef4444');
      if ('profit' in s) {
        const isP = s.profit >= 0;
        add(isP ? 'Net Profit' : 'Net Loss', Math.abs(s.profit), isP ? TrendingUp : TrendingDown, true, isP ? '#10b981' : '#ef4444');
      }
    }

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 20
      }}>
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>
    );
  };

  // ── Inventory Decision Intelligence Guidance Banner ────────────────────────
  const renderDecisionInsights = () => {
    if (activeTab !== 'inventory') return null;

    const deadCount = D.products.filter(p => (p.stock || 0) > 3).length;
    const lowCount = D.products.filter(p => (p.stock || 0) <= (p.alarm_when_stock_is_lessthanOrEqualto || 10)).length;
    const totalCost = D.products.reduce((s, p) => s + parseFloat(p.purchase_price || 0) * (p.stock || 0), 0);

    return (
      <div style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
        border: '1px solid #ddd6fe',
        borderRadius: 12,
        padding: '14px 18px',
        marginBottom: 20,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#4c1d95' }}>
              Inventory Decision Intelligence (সিদ্ধান্ত সহায়ক অ্যানালিটিক্স)
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: '#6d28d9', marginTop: 2 }}>
              গুদামে মোট {fmt(totalCost)} টাকার পণ্য সংরক্ষিত আছে। {lowCount > 0 && <span style={{ fontWeight: 700 }}>{lowCount}টি পণ্য দ্রুত রিস্টক করা জরুরি।</span>}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveReport('Low Stock & Reorder Alert')}
            style={{
              padding: '6px 12px',
              borderRadius: 7,
              background: '#ef4444',
              color: 'white',
              fontSize: 11,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🚨 Reorder List ({lowCount})
          </button>
          <button
            onClick={() => setActiveReport('Slow-Moving / Dead Stock')}
            style={{
              padding: '6px 12px',
              borderRadius: 7,
              background: '#8b5cf6',
              color: 'white',
              fontSize: 11,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📦 Dead Stock Review
          </button>
        </div>
      </div>
    );
  };

  // ── Charts Renderer ─────────────────────────────────────────────────────────
  const tipStyle = { borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' };

  const renderChart = () => {
    if (loading) return <Spinner />;
    if (!chartData?.length) return <Empty msg="No chart trends for this selection" />;

    // Area Chart (Time Series)
    if (chartData[0]?.date) {
      const key = chartData[0]?.amount !== undefined ? 'amount' : 'due';
      return (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={meta.color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={meta.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={tipStyle} formatter={v => [fmt(v), 'Amount']} />
            <Area type="monotone" dataKey={key} stroke={meta.color} strokeWidth={2} fill="url(#g1)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // Horizontal Bar Chart
    if (['By Customer', 'By Product', 'By Category', 'By Subcategory', 'By Brand', 'By Specification', 'By Dosage Form', 'By Supplier', 'Product Profitability', 'Top Profitable Products'].includes(activeReport)) {
      const dataKey = chartData[0]?.profit !== undefined ? 'profit' : 'value';
      return (
        <ResponsiveContainer width="100%" height={Math.max(220, chartData.length * 36)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11, fill: '#475569' }} />
            <Tooltip contentStyle={tipStyle} formatter={v => [fmt(v), 'Amount']} />
            <Bar dataKey={dataKey} fill={meta.color} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Pie Chart
    if (activeReport === 'By Payment Method' || activeReport === 'Damaged Stock Analysis') {
      const dataKey = chartData[0]?.total !== undefined ? 'total' : chartData[0]?.value !== undefined ? 'value' : 'amount';
      return (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={chartData} dataKey={dataKey} nameKey="name" cx="50%" cy="50%" outerRadius={105}
                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={v => [fmt(v), 'Amount']} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // Inventory grouped Bar
    if (['By Category', 'By Subcategory', 'By Brand', 'By Specification', 'By Dosage Form'].includes(activeReport) && activeTab === 'inventory') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', angle: -15, textAnchor: 'end' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={tipStyle} />
            <Legend />
            <Bar dataKey="totalStock" fill={meta.color} name="Stock Qty" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Stock vs Retail Valuation Bar
    if (['Current Stock & Valuation', 'Period Profit Summary'].includes(activeReport)) {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={tipStyle} formatter={v => [fmt(v)]} />
            <Legend />
            <Bar dataKey="amount" fill={meta.color} name="Amount (৳)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return <Empty msg="Chart ready for this view" />;
  };

  // ── Table View Renderer ─────────────────────────────────────────────────────
  const renderTable = () => {
    if (loading) return <Spinner />;
    if (!displayData?.length) return <Empty />;

    // ── Accounting Tab Table
    if (activeTab === 'accounting') {
      if (['Product Profitability', 'Top Profitable Products'].includes(activeReport)) {
        return (
          <DataTable
            headers={['Product', 'Code', 'Category', 'Brand', 'Units Sold', 'Revenue', 'Cost', 'Gross Profit', 'Net Profit', 'Profit Margin']}
            rows={displayData.map(p => [
              p.product_name,
              p.product_code || '—',
              p.category_name || '—',
              p.brand_name || '—',
              fmtN(p.total_units_sold),
              fmt(p.total_revenue),
              fmt(p.total_cost),
              fmt(p.total_gross_profit),
              <span style={{ fontWeight: 700, color: parseFloat(p.total_net_profit || 0) >= 0 ? '#16a34a' : '#dc2626' }}>
                {fmt(p.total_net_profit)}
              </span>,
              `${p.average_profit_percentage_on_total_net_sale_value || 0}%`
            ])}
          />
        );
      }
      // Period Profit Summary
      const p = displayData[0] || {};
      return (
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#334155' }}>🛒 Sales & Revenue Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Units Sold:</span> <b>{fmtN(p.total_units_sold)} pcs</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Gross Revenue:</span> <b>{fmt(p.total_revenue)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Discounts (Item + Global):</span> <b style={{ color: '#ef4444' }}>- {fmt(p.total_discount)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: 6 }}><span>Accrual Net Sales Value:</span> <b>{fmt(p.accrual_net_sale_value)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cost of Goods Sold (COGS):</span> <b>{fmt(p.total_cost)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #94a3b8', paddingTop: 6 }}>
                  <span>Gross Profit:</span> <b style={{ color: '#10b981', fontSize: 13 }}>{fmt(p.gross_profit)}</b>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#334155' }}>💰 Cash Realization & Net Profit</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cash Collected (Received):</span> <b>{fmt(p.received_net_sale_value)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Outstanding Dues (Customer):</span> <b style={{ color: '#f59e0b' }}>{fmt(p.net_sale_value_dues)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Operational Expenses:</span> <b style={{ color: '#ef4444' }}>- {fmt(p.total_operational_expense)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Other Extra Income:</span> <b style={{ color: '#10b981' }}>+ {fmt(p.extra_income)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Non-Returnable Damage Loss:</span> <b style={{ color: '#ef4444' }}>- {fmt(p.total_non_returnable_damage_loss)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #94a3b8', paddingTop: 6 }}>
                  <span>Actual Net Profit:</span> <b style={{ color: '#0ea5e9', fontSize: 14 }}>{fmt(p.accrual_total_net_profit_with_damage_loss || p.accrual_net_profit)}</b>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#334155' }}>🚚 Purchase & Supplier Liability</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Units Purchased:</span> <b>{fmtN(p.total_units_purchased)} pcs</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Net Purchase Value:</span> <b>{fmt(p.total_purchase_value)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Paid at Purchase:</span> <b>{fmt(p.total_purchase_time_paid)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Due Paid Later:</span> <b>{fmt(p.total_purchase_due_paid)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: 6 }}><span>Total Paid to Suppliers:</span> <b>{fmt(p.total_purchase_value_paid)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #94a3b8', paddingTop: 6 }}>
                  <span>Remaining Supplier Due:</span> <b style={{ color: '#ef4444', fontSize: 13 }}>{fmt(p.total_purchase_remaining_due)}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ── Sales Tab Table
    if (activeTab === 'sales') {
      if (activeReport === 'All Sales') {
        return (
          <DataTable
            headers={['Date', 'Invoice', 'Customer', 'Method', 'Total', 'Paid', 'Due', 'Status']}
            rows={displayData.map(r => [
              toDate(r.created_at), r.invoice_no, r.customer_name || 'Walk-in',
              r.payment_method, fmt(r.total_amount), fmt(r.paid_amount),
              fmt(r.due_amount), <Badge status={r.payment_status} />
            ])}
          />
        );
      }
      if (activeReport === 'By Customer') {
        return (
          <DataTable
            headers={['Customer', 'Orders', 'Total Sales', 'Total Due']}
            rows={displayData.map(r => [r.name, fmtN(r.orders), fmt(r.value), fmt(r.due)])}
          />
        );
      }
      if (['By Product', 'By Category', 'By Subcategory', 'By Brand', 'By Specification', 'By Dosage Form'].includes(activeReport)) {
        return (
          <DataTable
            headers={[activeReport.replace('By ', ''), 'Qty Sold', 'Revenue']}
            rows={displayData.map(r => [r.name, fmtN(r.qty), fmt(r.value)])}
          />
        );
      }
      if (activeReport === 'By Payment Method') {
        return (
          <DataTable
            headers={['Method', 'Orders', 'Total']}
            rows={displayData.map(r => [r.name, fmtN(r.orders), fmt(r.total)])}
          />
        );
      }
      if (activeReport === 'By Due') {
        return (
          <DataTable
            headers={['Date', 'Invoice', 'Customer', 'Total', 'Due', 'Status']}
            rows={displayData.map(r => [
              toDate(r.created_at), r.invoice_no, r.customer_name || 'Walk-in',
              fmt(r.total_amount), fmt(r.due_amount), <Badge status={r.payment_status} />
            ])}
          />
        );
      }
      if (activeReport === 'Sales Return') {
        return (
          <DataTable
            headers={['Date', 'Invoice', 'Customer', 'Return Amt', 'Status']}
            rows={displayData.map(r => [
              toDate(r.created_at), r.sale_invoice_no, r.customer_name,
              fmt(r.total_return_amount), <Badge status={r.payment_status} />
            ])}
          />
        );
      }
    }

    // ── Purchase Tab Table
    if (activeTab === 'purchase') {
      if (activeReport === 'All Purchases') {
        return (
          <DataTable
            headers={['Date', 'Invoice', 'Supplier', 'Method', 'Total', 'Paid', 'Due', 'Status']}
            rows={displayData.map(r => [
              toDate(r.created_at), r.invoice_no, r.supplier_name, r.payment_method,
              fmt(r.total_amount), fmt(r.paid_amount), fmt(r.due_amount),
              <Badge status={r.payment_status} />
            ])}
          />
        );
      }
      if (activeReport === 'By Supplier') {
        return (
          <DataTable
            headers={['Supplier', 'Orders', 'Total Purchase', 'Total Due']}
            rows={displayData.map(r => [r.name, fmtN(r.orders), fmt(r.value), fmt(r.due)])}
          />
        );
      }
      if (['By Product', 'By Category', 'By Brand', 'By Specification', 'By Dosage Form'].includes(activeReport)) {
        return (
          <DataTable
            headers={[activeReport.replace('By ', ''), 'Qty Purchased', 'Value']}
            rows={displayData.map(r => [r.name, fmtN(r.qty), fmt(r.value)])}
          />
        );
      }
      if (activeReport === 'By Payment Method') {
        return (
          <DataTable
            headers={['Method', 'Orders', 'Total']}
            rows={displayData.map(r => [r.name, fmtN(r.orders), fmt(r.total)])}
          />
        );
      }
      if (activeReport === 'By Due') {
        return (
          <DataTable
            headers={['Date', 'Invoice', 'Supplier', 'Total', 'Due', 'Status']}
            rows={displayData.map(r => [
              toDate(r.created_at), r.invoice_no, r.supplier_name,
              fmt(r.total_amount), fmt(r.due_amount), <Badge status={r.payment_status} />
            ])}
          />
        );
      }
      if (activeReport === 'Purchase Return') {
        return (
          <DataTable
            headers={['Date', 'Invoice', 'Total']}
            rows={displayData.map(r => [toDate(r.created_at), r.invoice_no || r.id, fmt(r.total_amount)])}
          />
        );
      }
      if (activeReport === 'Pending Payment') {
        return (
          <DataTable
            headers={['Date', 'Invoice', 'Supplier', 'Total', 'Due', 'Status']}
            rows={displayData.map(r => [
              toDate(r.created_at), r.invoice_no, r.supplier_name,
              fmt(r.total_amount), fmt(r.due_amount), <Badge status={r.payment_status} />
            ])}
          />
        );
      }
    }

    // ── Inventory Tab Table
    if (activeTab === 'inventory') {
      if (['Current Stock & Valuation', 'Low Stock & Reorder Alert', 'Slow-Moving / Dead Stock'].includes(activeReport)) {
        return (
          <DataTable
            headers={['Product', 'Code', 'Category', 'Brand', 'Specification', 'Dosage Form', 'Cost', 'Sell Price', 'Stock', 'Status', 'Total Value']}
            rows={displayData.map(p => {
              const st = p.stock <= 0 ? 'out_of_stock' : p.stock <= (p.alarm_when_stock_is_lessthanOrEqualto || 10) ? 'low_stock' : 'in_stock';
              return [
                p.name,
                p.product_code,
                p.category_name || '—',
                p.brand_name || '—',
                p.specification_name || '—',
                p.dosage_form_name || '—',
                fmt(p.purchase_price),
                fmt(p.selling_price),
                <span style={{ fontWeight: 700, color: p.stock <= 0 ? '#ef4444' : p.stock <= 10 ? '#f59e0b' : '#0f172a' }}>
                  {fmtN(p.stock)}
                </span>,
                <Badge status={st} />,
                fmt(parseFloat(p.purchase_price || 0) * (p.stock || 0))
              ];
            })}
          />
        );
      }
      if (['By Category', 'By Subcategory', 'By Brand', 'By Specification', 'By Dosage Form'].includes(activeReport)) {
        return (
          <DataTable
            headers={[activeReport.replace('By ', ''), 'Products Count', 'Total Stock Units', 'Stock Value (Cost)']}
            rows={displayData.map(r => [r.name, fmtN(r.products), fmtN(r.totalStock), fmt(r.totalValue)])}
          />
        );
      }
      if (activeReport === 'Damaged Stock Analysis') {
        return (
          <DataTable
            headers={['Date', 'Product', 'Qty', 'Damage Type', 'Unit Cost', 'Total Loss', 'Note']}
            rows={displayData.map(d => [
              toDate(d.created_at),
              d.product_name || d.product,
              fmtN(d.quantity),
              <Badge status={d.damage_type === 'non_returnable' ? 'unpaid' : 'partial'} />,
              fmt(d.unit_cost),
              <span style={{ color: '#ef4444', fontWeight: 700 }}>{fmt(d.total_loss)}</span>,
              d.note || d.reason || '—'
            ])}
          />
        );
      }
    }

    // ── Financial Tab Table
    if (activeTab === 'financial') {
      if (['Income Statement', 'Expense Breakdown'].includes(activeReport)) {
        return (
          <DataTable
            headers={['Date', 'Title', 'Amount']}
            rows={displayData.map(r => [toDate(r.created_at), r.title, fmt(r.amount)])}
          />
        );
      }
      if (activeReport === 'Cash in Hand') {
        return (
          <DataTable
            headers={['Date', 'Title', 'Amount']}
            rows={displayData.map(r => [toDate(r.created_at), r.title || '—', fmt(r.amount)])}
          />
        );
      }
      if (activeReport === 'Profit & Loss') {
        return (
          <div style={{ padding: 24, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            P&L Overview is visualized in cards & charts above.
          </div>
        );
      }
    }

    return <Empty />;
  };

  // ── CSV Export ──────────────────────────────────────────────────────────────
  const handleCSV = () => {
    if (!displayData?.length || !Array.isArray(displayData)) return;
    const keys = Object.keys(displayData[0]).filter(k => typeof displayData[0][k] !== 'object');
    const csv = [keys.join(','), ...displayData.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${activeTab}_${activeReport.replace(/ /g, '_')}_${today}.csv`;
    a.click();
  };

  // ── Render Component ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <style>{`
        @media print{.no-print{display:none!important}}
        ::-webkit-scrollbar{height:5px;width:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
      `}</style>

      {/* ── HEADER NAVBAR ── */}
      <div className="no-print" style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
      }}>
        {/* Row 1: Categories & Actions */}
        <div style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, overflowX: 'auto' }}>
            <button onClick={() => navigate('/reports')} style={{
              padding: '0 14px',
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
              <ArrowLeft size={16} /><span>Back</span>
            </button>
            <div style={{ display: 'flex', overflowX: 'auto', flex: 1, scrollbarWidth: 'none' }}>
              {Object.entries(CAT_META).map(([key, val]) => {
                const Icon = val.icon, active = activeTab === key;
                return (
                  <button key={key} onClick={() => handleTabChange(key)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '13px 18px',
                    border: 'none',
                    borderBottom: `3px solid ${active ? val.color : 'transparent'}`,
                    background: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    color: active ? val.color : '#64748b',
                    fontWeight: active ? 700 : 500,
                    fontSize: 13.5,
                    transition: 'all .15s',
                    flexShrink: 0
                  }}>
                    <Icon size={16} />{val.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            padding: '0 0 0 12px',
            borderLeft: '1px solid #f1f5f9',
            flexShrink: 0
          }}>
            {activeTab === 'accounting' && (
              <button
                onClick={handleRecalculate}
                disabled={recalculating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1px solid #bae6fd',
                  borderRadius: 7,
                  background: '#f0f9ff',
                  cursor: 'pointer',
                  color: '#0284c7',
                  whiteSpace: 'nowrap'
                }}
                title="Recalculate and synchronize all profit and business growth snapshots"
              >
                <RefreshCw size={13} className={recalculating ? 'animate-spin' : ''} />
                {recalculating ? 'Syncing…' : 'Sync All'}
              </button>
            )}
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
              <Download size={13} /> CSV
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
              <Printer size={13} /> Print
            </button>
          </div>
        </div>

        {/* Row 2: Comprehensive Searchable Filter Bar */}
        <div style={{ borderTop: '1px solid #f1f5f9', background: '#fafafa', padding: '8px 16px' }}>
          <div style={{
            maxWidth: 1320,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center'
          }}>
            {/* Report Sub-Type Selector */}
            <SearchableSelect
              value={activeReport}
              onChange={v => v && setActiveReport(v)}
              options={REPORT_TYPES[activeTab].map(rt => ({ value: rt, label: rt }))}
              placeholder="Report Type"
              minWidth={170}
            />

            {/* Accounting Timeframe Selector */}
            {activeTab === 'accounting' && (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 4 }}>
                {[
                  { id: 'daily', label: 'Daily (দৈনিক)' },
                  { id: 'monthly', label: 'Monthly (মাসিক)' },
                  { id: 'yearly', label: 'Yearly (বার্ষিক)' },
                  { id: 'all_time', label: 'All-Time (সর্বমোট)' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setAccountingPeriod(p.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 7,
                      fontSize: 11.5,
                      fontWeight: accountingPeriod === p.id ? 700 : 500,
                      border: `1px solid ${accountingPeriod === p.id ? '#0ea5e9' : '#cbd5e1'}`,
                      background: accountingPeriod === p.id ? '#0ea5e9' : 'white',
                      color: accountingPeriod === p.id ? 'white' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Date Filters & Shortcuts (for Non-Accounting tabs) */}
            {activeTab !== 'accounting' && (
              <>
                <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />

                {/* Quick Date Buttons */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[
                    { id: 'today', label: 'Today' },
                    { id: 'week', label: '7 Days' },
                    { id: 'month', label: 'Month' },
                    { id: 'year', label: 'Year' },
                    { id: 'all', label: 'All' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setQuickPeriod(p.id)}
                      style={{
                        padding: '4px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        color: '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Date Inputs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={e => sf('startDate', e.target.value)}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11.5,
                      color: '#1e293b',
                      background: 'white',
                      outline: 'none',
                      height: 32
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>-</span>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={e => sf('endDate', e.target.value)}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11.5,
                      color: '#1e293b',
                      background: 'white',
                      outline: 'none',
                      height: 32
                    }}
                  />
                </div>
              </>
            )}

            {/* Customer Filter */}
            {activeTab === 'sales' && !['Sales Return', 'By Payment Method'].includes(activeReport) && (
              <SearchableSelect
                value={filters.customerId}
                onChange={v => sf('customerId', v)}
                options={D.customers.map(c => ({ value: c.id, label: c.name }))}
                placeholder="All Customers"
                minWidth={135}
              />
            )}

            {/* Supplier Filter */}
            {activeTab === 'purchase' && !['Purchase Return', 'By Payment Method'].includes(activeReport) && (
              <SearchableSelect
                value={filters.supplierId}
                onChange={v => sf('supplierId', v)}
                options={D.suppliers.map(s => ({ value: s.id, label: s.name }))}
                placeholder="All Suppliers"
                minWidth={135}
              />
            )}

            {/* Category Filter */}
            {!['Sales Return', 'Purchase Return', 'Profit & Loss', 'Cash in Hand', 'Income Statement', 'Expense Breakdown'].includes(activeReport) && (
              <SearchableSelect
                value={filters.categoryId}
                onChange={v => sf('categoryId', v)}
                options={D.categories.map(c => ({ value: c.id, label: c.title || c.name }))}
                placeholder="All Categories"
                minWidth={135}
              />
            )}

            {/* Subcategory Filter */}
            {!['Sales Return', 'Purchase Return', 'Profit & Loss', 'Cash in Hand', 'Income Statement', 'Expense Breakdown'].includes(activeReport) && (
              <SearchableSelect
                value={filters.subcategoryId}
                onChange={v => sf('subcategoryId', v)}
                options={D.subcategories.map(c => ({ value: c.id, label: c.title }))}
                placeholder="All Subcategories"
                minWidth={140}
              />
            )}

            {/* Brand Filter */}
            {!['Sales Return', 'Purchase Return', 'Profit & Loss', 'Cash in Hand', 'Income Statement', 'Expense Breakdown'].includes(activeReport) && (
              <SearchableSelect
                value={filters.brandId}
                onChange={v => sf('brandId', v)}
                options={D.brands.map(b => ({ value: b.id, label: b.title }))}
                placeholder="All Brands"
                minWidth={130}
              />
            )}

            {/* Specification (Generic Name / Tech Spec) Filter */}
            {!['Sales Return', 'Purchase Return', 'Profit & Loss', 'Cash in Hand', 'Income Statement', 'Expense Breakdown'].includes(activeReport) && (
              <SearchableSelect
                value={filters.specificationId}
                onChange={v => sf('specificationId', v)}
                options={D.specifications.map(s => ({ value: s.id, label: s.title }))}
                placeholder="All Generic / Specs"
                minWidth={150}
              />
            )}

            {/* Dosage Form Filter */}
            {!['Sales Return', 'Purchase Return', 'Profit & Loss', 'Cash in Hand', 'Income Statement', 'Expense Breakdown'].includes(activeReport) && (
              <SearchableSelect
                value={filters.dosageFormId}
                onChange={v => sf('dosageFormId', v)}
                options={D.dosageForms.map(d => ({ value: d.id, label: d.title }))}
                placeholder="All Dosage Forms"
                minWidth={140}
              />
            )}

            {/* Payment Method Filter */}
            {['All Sales', 'By Payment Method', 'All Purchases'].includes(activeReport) && (
              <SearchableSelect
                value={filters.paymentMethod}
                onChange={v => sf('paymentMethod', v)}
                options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))}
                placeholder="All Methods"
                minWidth={125}
              />
            )}

            {/* Status Filter */}
            {['All Sales', 'By Due', 'All Purchases', 'Pending Payment'].includes(activeReport) && (
              <SearchableSelect
                value={filters.paymentStatus}
                onChange={v => sf('paymentStatus', v)}
                options={[
                  { value: 'paid', label: 'Paid' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'unpaid', label: 'Unpaid' },
                ]}
                placeholder="All Status"
                minWidth={115}
              />
            )}

            {/* Due Only Toggle */}
            {['All Sales', 'All Purchases', 'By Due'].includes(activeReport) && (
              <button
                onClick={() => sf('dueOnly', !filters.dueOnly)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 7,
                  border: `1px solid ${filters.dueOnly ? meta.color : '#cbd5e1'}`,
                  background: filters.dueOnly ? meta.color + '15' : 'white',
                  color: filters.dueOnly ? meta.color : '#64748b',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  height: 32
                }}
              >
                {filters.dueOnly ? '✓ Due Only' : 'Due Only'}
              </button>
            )}

            {/* Clear All Filters Button */}
            <button
              onClick={clearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 7,
                border: '1px solid #e2e8f0',
                background: 'white',
                cursor: 'pointer',
                color: '#94a3b8',
                fontSize: 11.5,
                marginLeft: 'auto',
                height: 32
              }}
            >
              <X size={12} /> Clear
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '20px 16px' }}>
        {/* Loading banner */}
        {loading && (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            color: '#64748b',
            fontSize: 13
          }}>
            Synchronizing reports data… please wait
          </div>
        )}

        {/* Inventory Decision Making Insights Banner */}
        {renderDecisionInsights()}

        {/* Key Aggregate Summary Cards */}
        {renderSummaryCards()}

        {/* Business Note Management Card (for Accounting Tab) */}
        {activeTab === 'accounting' && (
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 20,
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} color="#0ea5e9" />
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  Business Context Note (ব্যবসায়িক প্রেক্ষাপট নোট — {accountingPeriod.toUpperCase()})
                </h3>
              </div>
              {noteSavedMsg && (
                <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={14} /> {noteSavedMsg}
                </span>
              )}
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#64748b' }}>
              এই নির্দিষ্ট সময়ের জন্য কোনো বিশেষ পরিস্থিতি (যেমন: উৎসব, দোকান বন্ধ, বৃষ্টি, বিশেষ ক্যাম্পেইন) থাকলে লিখে রাখুন।
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <textarea
                value={businessNote}
                onChange={(e) => setBusinessNote(e.target.value)}
                placeholder="যেমন: ঈদুল ফিতরের কারণে বিক্রি বেশি ছিল / বন্যার কারণে ৪ দিন ডেলিভারি বন্ধ ছিল..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 12.5,
                  color: '#1e293b',
                  minHeight: 48,
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              <button
                onClick={handleSaveBusinessNote}
                disabled={noteSaving}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: '#0ea5e9',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 48
                }}
              >
                <Save size={14} />
                {noteSaving ? 'Saving…' : 'Save Note'}
              </button>
            </div>
          </div>
        )}

        {/* Visual Charts Container */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 20,
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 16px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {activeReport} Overview Trend
            </h3>
          </div>
          {renderChart()}
        </div>

        {/* Detailed Data Table */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Detailed Record Breakdown
            </h3>
            {Array.isArray(displayData) && displayData.length > 0 && (
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                {displayData.length} total records
              </span>
            )}
          </div>
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
