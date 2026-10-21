

// src/POS/Reports/ReportDetail.jsx
import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    ArrowLeft, RefreshCw, FileText, AlertTriangle,
    ChevronDown, ChevronRight, Settings2, Rows3, Columns3, Maximize2, Minimize2,
} from 'lucide-react';

import {ReportsProvider, usePosReports} from '../../context_or_provider/pos/reports/ReportsProvider';
import {
    TOP_SECTIONS, PERIOD_TABS, PERIOD_TABS_BY_SECTION,
    DEFAULT_PERIOD_BY_SECTION, formatValue,
} from './config/sections';
import {
    getColumnsForReportType, getDefaultColumns, buildColumnMap,
    getColumnsBySection,
} from './config/columns';

import SectionTabs from './components/SectionTabs';
import BusinessNotePanel from './components/BusinessNotePanel';
import SummaryCards from './components/SummaryCards';
import FloatingChartButton from './components/FloatingChartButton';
import ChartModal from './components/ChartModal';
import ColumnPicker from './components/ColumnPicker';
import PdfDownloadButton from './components/PdfDownloadButton';

import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import TransposedTable from './components/TransposedTable';

// ═══════════════════════════════════════════════════════════════════
// 🆕 Helper — section-wise default ordering (for select fallback)
// ═══════════════════════════════════════════════════════════════════
const DEFAULT_ORDERING_BY_SECTION = {
    supplier: '-total_purchase_value',
    brand: '-total_net_profit',
    customer: '-total_net_profit',
    product: '-total_net_profit',
    profit: '-period_key',
    inventory: '-period_key',
    growth: '-period_key',
};

const ReportDetailInner = () => {
    const navigate = useNavigate();
    const {
        activeSection, setActiveSection,
        periodType, setPeriodType,
        sectionTab, setSectionTab,
        filters, updateFilters, resetFilters,
        profitSummary, productProfits, inventoryValuation, businessGrowth,
        supplierProfits, brandProfits, customerProfits,
        loadProfitSummary, loadProductProfits,
        loadInventoryValuation, loadBusinessGrowth,
        loadSupplierProfits, loadBrandProfits, loadCustomerProfits,
        loadSupportData,
        addBusinessNote,
        downloadPdf,
        recalculate,
        loading, error,
        columnPrefs, setColumnPrefs,
    } = usePosReports();

    const [expandedRows, setExpandedRows] = useState({});
    const [isChartOpen, setIsChartOpen] = useState(false);
    const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
    const [viewMode, setViewMode] = useState('column');
    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const [selectedFieldKey, setSelectedFieldKey] = useState(null);
    const [isExpandedView, setIsExpandedView] = useState(false);

    // ─── On Mount ───
    useEffect(() => {
        loadSupportData();
    }, [loadSupportData]);

    const availablePeriods = PERIOD_TABS_BY_SECTION[activeSection] || [];

    // ─── Section change → default period ───
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const defaultPeriod = DEFAULT_PERIOD_BY_SECTION[activeSection];
        if (defaultPeriod && !availablePeriods.includes(periodType)) {
            setPeriodType(defaultPeriod);
        }
    }, [activeSection]);

    // ─── Load data ───
    useEffect(() => {
        if (activeSection === 'profit') loadProfitSummary(periodType);
        else if (activeSection === 'product') loadProductProfits();
        else if (activeSection === 'inventory') loadInventoryValuation(periodType === 'yearly' ? 'yearly' : 'monthly');
        else if (activeSection === 'growth') loadBusinessGrowth(periodType);
        else if (activeSection === 'supplier') loadSupplierProfits();
        else if (activeSection === 'brand') loadBrandProfits();
        else if (activeSection === 'customer') loadCustomerProfits();
    }, [activeSection, periodType, loadProfitSummary, loadProductProfits, loadInventoryValuation, loadBusinessGrowth, loadSupplierProfits, loadBrandProfits, loadCustomerProfits]);

    // ═══════════════════════════════════════════════════════════════
    // 📊 ACTIVE DATA
    // ═══════════════════════════════════════════════════════════════
    const activeData = useMemo(() => {
        if (activeSection === 'profit') return profitSummary[periodType];
        if (activeSection === 'product') return productProfits;
        if (activeSection === 'inventory') return inventoryValuation[periodType === 'yearly' ? 'yearly' : 'monthly'];
        if (activeSection === 'growth') return businessGrowth[periodType];
        if (activeSection === 'supplier') return supplierProfits;
        if (activeSection === 'brand') return brandProfits;
        if (activeSection === 'customer') return customerProfits;
        return null;
    }, [activeSection, periodType, profitSummary, productProfits, inventoryValuation, businessGrowth, supplierProfits, brandProfits, customerProfits]);

    const rows = activeData?.results || [];
    const aggregated = activeData?.aggregated || null;
    const chartData = activeData?.chart_data || null;

    // ═══════════════════════════════════════════════════════════════
    // 📋 COLUMNS
    // ═══════════════════════════════════════════════════════════════
    const getReportType = () => {
        if (activeSection === 'profit') return 'profit-summary';
        if (activeSection === 'product') return 'product-profit';
        if (activeSection === 'inventory') return 'inventory';
        if (activeSection === 'growth') return 'growth';
        if (activeSection === 'supplier') return 'supplier-profit';
        if (activeSection === 'brand') return 'brand-profit';
        if (activeSection === 'customer') return 'customer-profit';
        return 'profit-summary';
    };

    const allColumns = getColumnsForReportType(getReportType());
    const columnMap = buildColumnMap(allColumns);

    const activeColumns = useMemo(() => {
        if (activeSection === 'product') {
            const saved = columnPrefs[`product-profit`];
            const keys = saved?.length ? saved : getDefaultColumns(allColumns);
            return keys.map((k) => columnMap[k]).filter(Boolean);
        }

        if (sectionTab === 'all') {
            const saved = columnPrefs[`${activeSection}-all`];
            const keys = saved?.length ? saved : getDefaultColumns(allColumns);
            return keys.map((k) => columnMap[k]).filter(Boolean);
        }

        if (sectionTab === 'notes') {
            const pk = columnMap['period_key'];
            return pk ? [pk] : [];
        }

        const saved = columnPrefs[`${activeSection}-${sectionTab}`];
        if (saved?.length) {
            return saved.map((k) => columnMap[k]).filter(Boolean);
        }
        return getColumnsBySection(allColumns, sectionTab);
    }, [activeSection, sectionTab, allColumns, columnMap, columnPrefs]);

    const sectionCounts = useMemo(() => {
        const counts = {};
        ['profit', 'sale', 'purchase', 'cash_due', 'investment', 'notes'].forEach((key) => {
            counts[key] = getColumnsBySection(allColumns, key).length;
        });
        return counts;
    }, [allColumns]);

    const columnPrefKey = activeSection === 'product'
        ? 'product-profit'
        : `${activeSection}-${sectionTab}`;

    const handleColumnChange = (nextKeys) => {
        setColumnPrefs((prev) => ({...prev, [columnPrefKey]: nextKeys}));
    };

    // ═══════════════════════════════════════════════════════════════
    // 🎨 CELL RENDERER
    // ═══════════════════════════════════════════════════════════════
    const renderCell = (row, col) => {
        const value = row[col.key];

        if (col.type === 'notes') {
            const notes = value || [];
            if (notes.length === 0) return <span style={{color: '#94a3b8'}}>—</span>;
            return (
                <span style={{fontSize: 12, color: '#475569'}}>
                    📝 {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </span>
            );
        }

        const formatted = formatValue(value, col.type);
        if (col.type === 'currency' && parseFloat(value) < 0) {
            return <span style={{color: '#dc2626', fontWeight: 600}}>{formatted}</span>;
        }
        return formatted;
    };

    // ═══════════════════════════════════════════════════════════════
    // 📝 NOTE HANDLER
    // ═══════════════════════════════════════════════════════════════
    const handleAddNote = async (row, noteText) => {
        const rowKey = row.period_key;
        if (!rowKey) return;
        const pt = activeSection === 'profit' ? periodType
            : activeSection === 'inventory' ? 'monthly'
                : activeSection === 'growth' ? periodType
                    : null;
        if (!pt) throw new Error('Cannot add note to this section');
        await addBusinessNote(pt, rowKey, noteText);
    };

    const toggleRow = (rowKey) => {
        setExpandedRows((prev) => ({...prev, [rowKey]: !prev[rowKey]}));
    };

    // ═══════════════════════════════════════════════════════════════
    // 🆕 FIX — Section change handler (resets filters)
    // ═══════════════════════════════════════════════════════════════
    const handleSectionClick = (secKey) => {
        if (secKey === activeSection) return;  // no-op if same
        resetFilters();
        setActiveSection(secKey);
    };

    const showSectionTabs = ['profit', 'inventory', 'growth'].includes(activeSection);

    // ═══════════════════════════════════════════════════════════════
    // 🎬 RENDER
    // ═══════════════════════════════════════════════════════════════
    return (
        <div style={{minHeight: '100vh', background: '#f8fafc', paddingBottom: 40}}>

            {/* HEADER */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                position: 'sticky', top: 0, zIndex: 50,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
                <div style={{
                    maxWidth: 1400, margin: '0 auto',
                    padding: '12px 20px',
                    display: 'flex', alignItems: 'center', gap: 12,
                }}>
                    <button onClick={() => navigate('/reports')} style={{
                        padding: '6px 12px', border: '1px solid #e2e8f0',
                        borderRadius: 8, background: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 13, color: '#475569', fontWeight: 500,
                    }}>
                        <ArrowLeft size={14}/> Back
                    </button>
                    <h1 style={{margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a'}}>
                        📊 Business Reports
                    </h1>
                    <div style={{marginLeft: 'auto', display: 'flex', gap: 8}}>
                        <PdfDownloadButton
                            label={selectedRowKey ? `PDF (${selectedRowKey})` : 'PDF'}
                            onDownload={() => {
                                if (selectedRowKey) {
                                    const pt = activeSection === 'profit' ? periodType
                                        : activeSection === 'inventory' ? (periodType === 'yearly' ? 'yearly' : 'monthly')
                                            : activeSection === 'growth' ? periodType
                                                : 'daily';
                                    const params = {};
                                    if (pt === 'daily') {
                                        params.start_date = selectedRowKey;
                                        params.end_date = selectedRowKey;
                                    } else if (pt === 'monthly') {
                                        params.start_month = selectedRowKey;
                                        params.end_month = selectedRowKey;
                                    } else if (pt === 'yearly') {
                                        params.start_year = selectedRowKey;
                                        params.end_year = selectedRowKey;
                                    }
                                    return downloadPdf(pt, params);
                                }
                                return downloadPdf(periodType, filters);
                            }}
                        />
                        <button onClick={() => recalculate()} style={{
                            padding: '6px 12px',
                            border: '1px solid #bae6fd',
                            borderRadius: 8, background: '#f0f9ff',
                            cursor: 'pointer', color: '#0284c7',
                            fontSize: 12, fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                            <RefreshCw size={13}/> Sync
                        </button>
                    </div>
                </div>
            </div>

            {/* TOP SECTIONS — ✅ FIX #4: resetFilters on click */}
            <div style={{maxWidth: 1400, margin: '0 auto', padding: '20px 20px 0'}}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: 12,
                }}>
                    {TOP_SECTIONS.map((sec) => {
                        const isActive = activeSection === sec.key;
                        return (
                            <button
                                key={sec.key}
                                onClick={() => handleSectionClick(sec.key)}
                                style={{
                                    padding: '14px 16px', borderRadius: 12,
                                    border: `2px solid ${isActive ? sec.color : '#e2e8f0'}`,
                                    background: isActive ? `${sec.color}10` : 'white',
                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                                }}
                            >
                                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                                    <span style={{fontSize: 22}}>{sec.icon}</span>
                                    <div>
                                        <div style={{
                                            fontSize: 14, fontWeight: 700,
                                            color: isActive ? sec.color : '#0f172a',
                                        }}>{sec.label}</div>
                                        <div style={{fontSize: 11, color: '#64748b', marginTop: 2}}>
                                            {sec.description}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* PERIOD TABS */}
            {availablePeriods.length > 0 && (
                <div style={{maxWidth: 1400, margin: '20px auto 0', padding: '0 20px'}}>
                    <div style={{
                        background: 'white', borderRadius: 12, padding: 4,
                        display: 'inline-flex', border: '1px solid #e2e8f0', gap: 2,
                    }}>
                        {PERIOD_TABS.filter((pt) => availablePeriods.includes(pt.key)).map((pt) => {
                            const isActive = periodType === pt.key;
                            return (
                                <button key={pt.key} onClick={() => setPeriodType(pt.key)} style={{
                                    padding: '8px 16px', borderRadius: 8, border: 'none',
                                    background: isActive ? '#0ea5e9' : 'transparent',
                                    color: isActive ? 'white' : '#64748b',
                                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    transition: 'all 0.15s',
                                }}>
                                    <span>{pt.icon}</span> {pt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* SECTION TABS */}
            {showSectionTabs && (
                <div style={{maxWidth: 1400, margin: '16px auto 0', padding: '0 20px'}}>
                    <SectionTabs activeTab={sectionTab} onTabChange={setSectionTab} counts={sectionCounts}/>
                </div>
            )}

            {/* FILTER BAR */}
            <div style={{maxWidth: 1400, margin: '16px auto 0', padding: '0 20px'}}>
                <div style={{
                    background: 'white', borderRadius: 12, padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
                }}>
                    {periodType === 'daily' && (
                        <>
                            <FilterInput label="Start Date" type="date" value={filters.start_date}
                                         onChange={(v) => updateFilters({start_date: v})}/>
                            <FilterInput label="End Date" type="date" value={filters.end_date}
                                         onChange={(v) => updateFilters({end_date: v})}/>
                        </>
                    )}
                    {periodType === 'monthly' && activeSection !== 'product' && (
                        <>
                            <FilterInput label="Start Month" type="month" value={filters.start_month}
                                         onChange={(v) => updateFilters({start_month: v})}/>
                            <FilterInput label="End Month" type="month" value={filters.end_month}
                                         onChange={(v) => updateFilters({end_month: v})}/>
                        </>
                    )}
                    {periodType === 'yearly' && activeSection !== 'product' && (
                        <>
                            <FilterInput label="Start Year" type="number" value={filters.start_year}
                                         onChange={(v) => updateFilters({start_year: v})} placeholder="2022"/>
                            <FilterInput label="End Year" type="number" value={filters.end_year}
                                         onChange={(v) => updateFilters({end_year: v})} placeholder="2026"/>
                        </>
                    )}
                    {periodType === 'all_time' && (
                        <span style={{
                            fontSize: 12, color: '#64748b',
                            padding: '6px 12px', background: '#f1f5f9', borderRadius: 8,
                        }}>
                            ♾️ All-Time data
                        </span>
                    )}

                    {/* ═══ Product Search ═══ */}
                    {activeSection === 'product' && (
                        <>
                            <FilterInput label="Search Product" type="text" value={filters.search}
                                         onChange={(v) => updateFilters({search: v})} placeholder="Product name..."/>
                            <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <label style={{
                                    fontSize: 10, fontWeight: 700, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '0.03em',
                                }}>Order By</label>
                                <select
                                    value={
                                        ['-total_net_profit', 'total_net_profit',
                                            '-total_revenue', '-total_units_sold']
                                            .includes(filters.ordering)
                                            ? filters.ordering
                                            : '-total_net_profit'
                                    }
                                    onChange={(e) => updateFilters({ordering: e.target.value})}
                                    style={{
                                        padding: '6px 10px', border: '1px solid #cbd5e1',
                                        borderRadius: 7, fontSize: 12, background: 'white',
                                        outline: 'none', minWidth: 160,
                                    }}
                                >
                                    <option value="-total_net_profit">Net Profit (High)</option>
                                    <option value="total_net_profit">Net Profit (Low)</option>
                                    <option value="-total_revenue">Revenue (High)</option>
                                    <option value="-total_units_sold">Units Sold (High)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* ═══ Supplier Search ═══ */}
                    {activeSection === 'supplier' && (
                        <>
                            <FilterInput
                                label="Search Supplier"
                                type="text"
                                value={filters.search}
                                onChange={(v) => updateFilters({search: v})}
                                placeholder="Name or phone..."
                            />
                            <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <label style={{
                                    fontSize: 10, fontWeight: 700, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '0.03em',
                                }}>Order By</label>
                                <select
                                    value={
                                        ['-total_purchase_value', 'total_purchase_value',
                                            '-total_purchase_remaining_due', '-total_purchase_count']
                                            .includes(filters.ordering)
                                            ? filters.ordering
                                            : '-total_purchase_value'
                                    }
                                    onChange={(e) => updateFilters({ordering: e.target.value})}
                                    style={{
                                        padding: '6px 10px', border: '1px solid #cbd5e1',
                                        borderRadius: 7, fontSize: 12, background: 'white',
                                        outline: 'none', minWidth: 160,
                                    }}
                                >
                                    <option value="-total_purchase_value">Purchase Value (High)</option>
                                    <option value="total_purchase_value">Purchase Value (Low)</option>
                                    <option value="-total_purchase_remaining_due">Due (High)</option>
                                    <option value="-total_purchase_count">Invoices (High)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* ═══ Brand Search ═══ */}
                    {activeSection === 'brand' && (
                        <>
                            <FilterInput
                                label="Search Brand"
                                type="text"
                                value={filters.search}
                                onChange={(v) => updateFilters({search: v})}
                                placeholder="Brand title..."
                            />
                            <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <label style={{
                                    fontSize: 10, fontWeight: 700, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '0.03em',
                                }}>Order By</label>
                                <select
                                    value={
                                        ['-total_net_profit', '-total_revenue',
                                            '-total_present_inventory_purchase_value',
                                            '-estimated_profit_from_present_inventory']
                                            .includes(filters.ordering)
                                            ? filters.ordering
                                            : '-total_net_profit'
                                    }
                                    onChange={(e) => updateFilters({ordering: e.target.value})}
                                    style={{
                                        padding: '6px 10px', border: '1px solid #cbd5e1',
                                        borderRadius: 7, fontSize: 12, background: 'white',
                                        outline: 'none', minWidth: 160,
                                    }}
                                >
                                    <option value="-total_net_profit">Net Profit (High)</option>
                                    <option value="-total_revenue">Revenue (High)</option>
                                    <option value="-total_present_inventory_purchase_value">Stock Value (High)</option>
                                    <option value="-estimated_profit_from_present_inventory">Potential Profit (High)
                                    </option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* ═══ Customer Search + Walk-in Toggle ═══ */}
                    {activeSection === 'customer' && (
                        <>
                            <FilterInput
                                label="Search Customer"
                                type="text"
                                value={filters.search}
                                onChange={(v) => updateFilters({search: v})}
                                placeholder="Name or phone..."
                            />
                            <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <label style={{
                                    fontSize: 10, fontWeight: 700, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '0.03em',
                                }}>Customer Type</label>
                                <select
                                    value={filters.is_walk_in || ''}
                                    onChange={(e) => updateFilters({is_walk_in: e.target.value})}
                                    style={{
                                        padding: '6px 10px', border: '1px solid #cbd5e1',
                                        borderRadius: 7, fontSize: 12, background: 'white',
                                        outline: 'none', minWidth: 140,
                                    }}
                                >
                                    <option value="">All Customers</option>
                                    <option value="false">Registered Only</option>
                                    <option value="true">Walk-in Only</option>
                                </select>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
                                <label style={{
                                    fontSize: 10, fontWeight: 700, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '0.03em',
                                }}>Order By</label>
                                <select
                                    value={
                                        ['-total_net_profit', '-total_revenue',
                                            '-total_after_sale_remaining_due', '-total_sales_count']
                                            .includes(filters.ordering)
                                            ? filters.ordering
                                            : '-total_net_profit'
                                    }
                                    onChange={(e) => updateFilters({ordering: e.target.value})}
                                    style={{
                                        padding: '6px 10px', border: '1px solid #cbd5e1',
                                        borderRadius: 7, fontSize: 12, background: 'white',
                                        outline: 'none', minWidth: 160,
                                    }}
                                >
                                    <option value="-total_net_profit">Net Profit (High)</option>
                                    <option value="-total_revenue">Revenue (High)</option>
                                    <option value="-total_after_sale_remaining_due">Due (High)</option>
                                    <option value="-total_sales_count">Orders (High)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {['profit', 'growth'].includes(activeSection) &&
                        periodType !== 'all_time' && availablePeriods.length > 1 && (
                            <label style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                fontSize: 12, color: '#475569', cursor: 'pointer',
                                padding: '6px 10px',
                                background: filters.compare ? '#eff6ff' : '#f8fafc',
                                borderRadius: 8,
                                border: `1px solid ${filters.compare ? '#bfdbfe' : '#e2e8f0'}`,
                            }}>
                                <input type="checkbox" checked={!!filters.compare}
                                       onChange={(e) => updateFilters({compare: e.target.checked})}/>
                                Compare previous
                            </label>
                        )}

                    {/* View mode toggle */}
                    <div style={{display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 8, padding: 3}}>
                        <button
                            onClick={() => setViewMode('column')}
                            title="Column view"
                            style={{
                                padding: '5px 10px', border: 'none', borderRadius: 6,
                                background: viewMode === 'column' ? 'white' : 'transparent',
                                color: viewMode === 'column' ? '#0ea5e9' : '#64748b',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                                fontSize: 11.5, fontWeight: 600,
                                boxShadow: viewMode === 'column' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >
                            <Columns3 size={13}/> Column
                        </button>
                        <button
                            onClick={() => setViewMode('row')}
                            title="Row view (transposed)"
                            style={{
                                padding: '5px 10px', border: 'none', borderRadius: 6,
                                background: viewMode === 'row' ? 'white' : 'transparent',
                                color: viewMode === 'row' ? '#0ea5e9' : '#64748b',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                                fontSize: 11.5, fontWeight: 600,
                                boxShadow: viewMode === 'row' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >
                            <Rows3 size={13}/> Row
                        </button>
                    </div>

                    <button
                        onClick={() => setIsExpandedView((v) => !v)}
                        title={isExpandedView ? 'Compact view' : 'Expand view'}
                        style={{
                            padding: '6px 12px', border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            background: isExpandedView ? '#eff6ff' : 'white',
                            color: isExpandedView ? '#0284c7' : '#475569',
                            cursor: 'pointer', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5,
                        }}
                    >
                        {isExpandedView ? <Minimize2 size={13}/> : <Maximize2 size={13}/>}
                        {isExpandedView ? 'Compact' : 'Expand'}
                    </button>

                    <button
                        onClick={() => setIsColumnPickerOpen(true)}
                        style={{
                            padding: '6px 12px', border: '1px solid #e2e8f0',
                            borderRadius: 8, background: 'white',
                            fontSize: 12, color: '#475569',
                            cursor: 'pointer', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: 5,
                        }}
                    >
                        <Settings2 size={13}/> Columns
                    </button>

                    <button onClick={resetFilters} style={{
                        marginLeft: 'auto',
                        padding: '6px 12px', border: '1px solid #e2e8f0',
                        borderRadius: 8, background: 'white',
                        fontSize: 12, color: '#64748b', cursor: 'pointer',
                    }}>
                        Clear Filters
                    </button>

                    {(selectedRowKey || selectedFieldKey) && (
                        <button
                            onClick={() => {
                                setSelectedRowKey(null);
                                setSelectedFieldKey(null);
                            }}
                            style={{
                                padding: '6px 10px',
                                border: '1px solid #bfdbfe',
                                borderRadius: 8,
                                background: '#eff6ff',
                                fontSize: 11.5,
                                color: '#0284c7',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            ✕ Clear Selection
                            {selectedRowKey && ` · period: ${selectedRowKey}`}
                            {selectedFieldKey && ` · field: ${selectedFieldKey}`}
                        </button>
                    )}
                </div>
            </div>

            {/* DATA AREA */}
            <div style={{maxWidth: 1400, margin: '20px auto 0', padding: '0 20px'}}>
                {loading && (
                    <div style={{
                        background: 'white', borderRadius: 12, padding: 40,
                        border: '1px solid #e2e8f0',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <LoadingSpinner size="lg"/>
                        <p style={{marginTop: 12, color: '#64748b', fontSize: 13}}>
                            Loading report data...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div style={{
                        background: '#fef2f2', borderRadius: 12, padding: 24,
                        border: '1px solid #fecaca',
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                        <AlertTriangle color="#dc2626" size={24}/>
                        <div>
                            <div style={{fontWeight: 600, color: '#991b1b', fontSize: 14}}>
                                Failed to load data
                            </div>
                            <div style={{color: '#b91c1c', fontSize: 12, marginTop: 2}}>
                                {String(error?.message || error)}
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !error && rows.length === 0 && (
                    <div style={{
                        background: 'white', borderRadius: 12, padding: 20,
                        border: '1px solid #e2e8f0',
                    }}>
                        <EmptyState
                            icon={<FileText size={32}/>}
                            title="No data available"
                            description="এই filter-এ কোনো record পাওয়া যায়নি। Different range try করুন।"
                        />
                    </div>
                )}

                {!loading && !error && rows.length > 0 && (
                    <>
                        {aggregated && (
                            <SummaryCards section={activeSection} aggregated={aggregated}/>
                        )}

                        <div style={{
                            background: 'white',
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                        }}>
                            {/* Header info bar */}
                            <div style={{
                                padding: '12px 20px',
                                borderBottom: '1px solid #f1f5f9',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div style={{fontSize: 13, color: '#475569', fontWeight: 600}}>
                                    {rows.length} rows · {activeColumns.length} columns
                                    {viewMode === 'row' && ' · transposed'}
                                </div>

                                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                    {['supplier', 'brand', 'customer'].includes(activeSection) && (
                                        <span style={{
                                            fontSize: 10, fontWeight: 800,
                                            padding: '3px 8px', borderRadius: 6,
                                            background: filters.start_date ? '#fef3c7' : '#dcfce7',
                                            color: filters.start_date ? '#92400e' : '#166534',
                                            textTransform: 'uppercase', letterSpacing: '0.05em',
                                            border: `1px solid ${filters.start_date ? '#fde68a' : '#bbf7d0'}`,
                                        }}>
                                            {filters.start_date && filters.end_date
                                                ? `📅 ${filters.start_date} → ${filters.end_date}`
                                                : '♾️ All-Time'}
                                        </span>
                                    )}
                                    <span style={{fontSize: 12, color: '#94a3b8'}}>
                                        {activeData?.range
                                            ? `Range: ${activeData.range.start} → ${activeData.range.end}`
                                            : activeSection === 'product' ? 'Cumulative' : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Column View */}
                            {viewMode === 'column' && (
                                <div style={{
                                    overflowX: 'auto',
                                    overflowY: 'auto',
                                    maxHeight: isExpandedView ? 'none' : '65vh',
                                    minHeight: 200,
                                }}>
                                    <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
                                        <thead>
                                        <tr style={{background: '#f8fafc', position: 'sticky', top: 0, zIndex: 5}}>
                                            {activeSection !== 'product' && (
                                                <th style={{
                                                    width: 30, padding: '10px 8px',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    background: '#f8fafc',
                                                    position: 'sticky', left: 0, top: 0,
                                                    zIndex: 8, borderRight: '1px solid #e2e8f0',
                                                }}></th>
                                            )}
                                            {activeColumns.map((col, ci) => {
                                                const isFieldSelected = selectedFieldKey === col.key;
                                                const isPeriodCol = col.key === 'period_key';
                                                const isFirstCol = ci === 0;
                                                const stickyLeft = activeSection === 'product' ? 0 : 30;
                                                return (
                                                    <th
                                                        key={col.key}
                                                        onClick={() => setSelectedFieldKey(isFieldSelected ? null : col.key)}
                                                        style={{
                                                            padding: '10px 14px',
                                                            textAlign: col.type === 'text' ? 'left' : 'right',
                                                            fontWeight: 700,
                                                            color: isFieldSelected ? '#0284c7' : '#475569',
                                                            fontSize: 11,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.03em',
                                                            borderBottom: isFieldSelected ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                                                            whiteSpace: 'nowrap',
                                                            background: isFieldSelected ? '#eff6ff' : '#f8fafc',
                                                            cursor: 'pointer',
                                                            position: 'sticky', top: 0,
                                                            ...(isPeriodCol && isFirstCol && {
                                                                left: stickyLeft,
                                                                zIndex: 7,
                                                                borderRight: '1px solid #e2e8f0',
                                                                boxShadow: '2px 0 4px -2px rgba(0,0,0,0.06)',
                                                            }),
                                                        }}
                                                        title="Click to highlight this column"
                                                    >
                                                        {col.label}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {rows.map((row, ri) => {
                                            const rowKey = row.period_key || row.id || ri;
                                            const isExpanded = !!expandedRows[rowKey];
                                            const isSelected = selectedRowKey === rowKey;
                                            const notesCount = (row.business_notes || []).length;
                                            const isZebraDark = ri % 2 === 1;
                                            const rowBg = isSelected
                                                ? '#eff6ff'
                                                : isZebraDark ? '#fafbfc' : 'white';

                                            return (
                                                <React.Fragment key={rowKey}>
                                                    <tr
                                                        style={{
                                                            borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9',
                                                            background: rowBg,
                                                            cursor: activeSection !== 'product' ? 'pointer' : 'default',
                                                        }}
                                                        onClick={() => {
                                                            if (activeSection !== 'product') {
                                                                setSelectedRowKey(isSelected ? null : rowKey);
                                                            }
                                                        }}
                                                    >
                                                        {activeSection !== 'product' && (
                                                            <td style={{
                                                                padding: '10px 8px',
                                                                textAlign: 'center',
                                                                width: 30,
                                                                background: rowBg,
                                                                position: 'sticky', left: 0, zIndex: 4,
                                                                borderRight: '1px solid #e2e8f0',
                                                            }}>
                                                                <div
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleRow(rowKey);
                                                                    }}
                                                                    style={{cursor: 'pointer'}}
                                                                >
                                                                    {isExpanded
                                                                        ? <ChevronDown size={14} color="#0ea5e9"/>
                                                                        : <ChevronRight size={14}
                                                                                        color={notesCount > 0 ? '#0ea5e9' : '#94a3b8'}/>}
                                                                    {!isExpanded && notesCount > 0 && (
                                                                        <div style={{
                                                                            fontSize: 9, color: '#0ea5e9',
                                                                            fontWeight: 700, marginTop: 2,
                                                                        }}>
                                                                            {notesCount}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )}
                                                        {activeColumns.map((col, ci) => {
                                                            const isFieldSelected = selectedFieldKey === col.key;
                                                            const isRowSelected = selectedRowKey === rowKey;
                                                            const isIntersection = isFieldSelected && isRowSelected;
                                                            const isPeriodCol = col.key === 'period_key';
                                                            const isFirstCol = ci === 0;
                                                            const stickyLeft = activeSection === 'product' ? 0 : 30;
                                                            const cellBg = isIntersection
                                                                ? '#bae6fd'
                                                                : isRowSelected ? '#f0f9ff'
                                                                    : isFieldSelected ? '#f0f9ff'
                                                                        : rowBg;
                                                            return (
                                                                <td key={col.key} style={{
                                                                    padding: '10px 14px',
                                                                    textAlign: col.type === 'text' ? 'left' : 'right',
                                                                    color: '#1e293b',
                                                                    whiteSpace: 'nowrap',
                                                                    background: cellBg,
                                                                    ...(isPeriodCol && isFirstCol && {
                                                                        position: 'sticky',
                                                                        left: stickyLeft,
                                                                        zIndex: 3,
                                                                        borderRight: '1px solid #e2e8f0',
                                                                        boxShadow: '2px 0 4px -2px rgba(0,0,0,0.06)',
                                                                        fontWeight: 600,
                                                                        color: isFieldSelected ? '#0284c7' : '#0f172a',
                                                                    }),
                                                                }}>
                                                                    {renderCell(row, col)}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>

                                                    {isExpanded && activeSection !== 'product' && (
                                                        <tr>
                                                            <td colSpan={activeColumns.length + 1} style={{padding: 0}}>
                                                                <BusinessNotePanel
                                                                    notes={row.business_notes || []}
                                                                    onAddNote={(text) => handleAddNote(row, text)}
                                                                    canEdit={true}
                                                                />
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}

                                        {/* TOTAL ROW */}
                                        {aggregated && (
                                            <tr style={{
                                                background: '#fef3c7',
                                                position: 'sticky', bottom: 0, zIndex: 4,
                                                boxShadow: '0 -2px 6px rgba(0,0,0,0.06)',
                                            }}>
                                                {activeSection !== 'product' && (
                                                    <td style={{
                                                        padding: '12px 8px',
                                                        background: '#fef3c7',
                                                        position: 'sticky', left: 0, zIndex: 6,
                                                        borderRight: '1px solid #e2e8f0',
                                                    }}></td>
                                                )}
                                                {activeColumns.map((col, ci) => {
                                                    const isSummable = ['currency', 'int', 'number'].includes(col.type);
                                                    const showTotal = isSummable && aggregated[col.key] !== undefined;
                                                    const isFieldSelected = selectedFieldKey === col.key;
                                                    return (
                                                        <td key={col.key} style={{
                                                            padding: '12px 14px',
                                                            textAlign: col.type === 'text' ? 'left' : 'right',
                                                            color: '#0f172a',
                                                            fontWeight: 800,
                                                            fontSize: 13,
                                                            whiteSpace: 'nowrap',
                                                            background: isFieldSelected ? '#bae6fd' : '#fef3c7',
                                                            borderTop: '2px solid #0f172a',
                                                            transition: 'background 0.15s, color 0.15s',
                                                            ...(col.key === 'period_key' && ci === 0 && {
                                                                position: 'sticky',
                                                                left: activeSection === 'product' ? 0 : 30,
                                                                zIndex: 5,
                                                                borderRight: '1px solid #e2e8f0',
                                                                boxShadow: '2px 0 4px -2px rgba(0,0,0,0.06)',
                                                            }),
                                                        }}>
                                                            {ci === 0 && col.type === 'text' && col.key === 'period_key' ? (
                                                                <span style={{
                                                                    color: '#92400e',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.04em',
                                                                }}>
                                                                    ⊕ TOTAL
                                                                </span>
                                                            ) : showTotal ? (
                                                                formatValue(aggregated[col.key], col.type)
                                                            ) : (
                                                                <span
                                                                    style={{color: '#94a3b8', fontWeight: 400}}>—</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Row View */}
                            {viewMode === 'row' && (
                                <TransposedTable
                                    rows={rows}
                                    columns={activeColumns}
                                    renderCell={renderCell}
                                    aggregated={aggregated}
                                    onAddNote={handleAddNote}
                                    selectedRowKey={selectedRowKey}
                                    onRowSelect={setSelectedRowKey}
                                    selectedFieldKey={selectedFieldKey}
                                    onFieldSelect={setSelectedFieldKey}
                                    rowLabelKey="period_key"
                                />
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Floating Chart Button */}
            {!loading && !error && rows.length > 0 && (
                <FloatingChartButton onClick={() => setIsChartOpen(true)}/>
            )}

            <ChartModal
                isOpen={isChartOpen}
                onClose={() => setIsChartOpen(false)}
                chartData={chartData}
                sectionLabel={
                    TOP_SECTIONS.find((s) => s.key === activeSection)?.label + ` — ${periodType}`
                }
            />

            <ColumnPicker
                isOpen={isColumnPickerOpen}
                onClose={() => setIsColumnPickerOpen(false)}
                allColumns={allColumns}
                selectedKeys={activeColumns.map((c) => c.key)}
                onChange={handleColumnChange}
            />
        </div>
    );
};

// Helper
const FilterInput = ({label, type, value, onChange, placeholder}) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
        <label style={{
            fontSize: 10, fontWeight: 700, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.03em',
        }}>
            {label}
        </label>
        <input
            type={type} value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                padding: '6px 10px', border: '1px solid #cbd5e1',
                borderRadius: 7, fontSize: 12, color: '#1e293b',
                background: 'white', outline: 'none', minWidth: 130,
            }}
        />
    </div>
);

const ReportDetail = () => (
    <ReportsProvider>
        <ReportDetailInner/>
    </ReportsProvider>
);

export default ReportDetail;