

// src/POS/Dashboard/components/ProductIntelligence.jsx
import React, { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Card, SectionTitle, Skeleton, EmptyState } from './Shared';
import { fmtCurrency, fmtNumber, fmtCompact } from '../utils/dashboardUtils';

// ═══════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════
const TABS = [
    {
        key: 'purchase',
        label: 'Purchase',
        icon: '📊',
        color: '#f59e0b',
        sourceKey: 'mostPurchasedProducts',
        subtitle: 'সবচেয়ে বেশি কেনা পণ্য',
        hasMotherChart: true,
        charts: [
            { key: 'total_purchase_count',  label: 'Purchase Count',  icon: '🧾', type: 'int',      color: '#f59e0b' },
            { key: 'total_units_purchased', label: 'Units Purchased', icon: '📦', type: 'int',      color: '#6366f1' },
            { key: 'total_purchase_value',  label: 'Purchase Value',  icon: '💸', type: 'currency', color: '#dc2626' },
        ],
    },
    {
        key: 'sale',
        label: 'Sale',
        icon: '💰',
        color: '#6366f1',
        sourceKey: 'mostSoldProducts',
        subtitle: 'সবচেয়ে বেশি বিক্রি হওয়া পণ্য',
        hasMotherChart: true,
        charts: [
            { key: 'total_sales_count',     label: 'Sales Count',     icon: '🧾', type: 'int',      color: '#0ea5e9' },
            { key: 'total_units_sold',      label: 'Units Sold',      icon: '📦', type: 'int',      color: '#6366f1' },
            { key: 'total_net_sale_value',  label: 'Net Sale Value',  icon: '🛒', type: 'currency', color: '#8b5cf6' },
            { key: 'total_cost',            label: 'Cost',            icon: '💸', type: 'currency', color: '#ef4444' },
            { key: 'total_net_profit',      label: 'Net Profit',      icon: '💰', type: 'currency', color: '#10b981' },
        ],
    },
    {
        key: 'star',
        label: 'Star',
        icon: '🌟',
        color: '#10b981',
        sourceKey: 'starProducts',
        subtitle: 'Balanced: Profit × Volume × Frequency ÷ Cost',
        hasMotherChart: true,
        charts: [
            { key: 'performance_score',     label: 'Star Score',      icon: '🌟', type: 'number',   color: '#f59e0b' },
            { key: 'total_net_profit',      label: 'Profit',          icon: '💰', type: 'currency', color: '#10b981' },
            { key: 'total_units_sold',      label: 'Units Sold',      icon: '📦', type: 'int',      color: '#6366f1' },
            { key: 'total_sales_count',     label: 'Invoices',        icon: '🧾', type: 'int',      color: '#0ea5e9' },
            // ✅ নতুন — Cost
            { key: 'total_cost',            label: 'Cost',            icon: '💸', type: 'currency', color: '#ef4444' },
        ],
    },
    {
        key: 'slow',
        label: 'Slow / Dead',
        icon: '⚠️',
        color: '#dc2626',
        sourceKey: 'slowProducts',
        subtitle: '⚠️ টাকা আটকে আছে · মাল জমে আছে',
        hasMotherChart: true,
        charts: [
            { key: 'performance_score',     label: 'Slow Score',      icon: '⚠️', type: 'number',   color: '#dc2626' },
            { key: 'stuck_capital',         label: 'Stuck Capital',   icon: '🔒', type: 'currency', color: '#f59e0b' },
            { key: 'unsold_units',          label: 'Unsold Units',    icon: '⏸️', type: 'int',      color: '#6366f1' },
        ],
    },
];

const TIP_STYLE = {
    borderRadius: 10, fontSize: 12,
    border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
};

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
const ProductIntelligence = ({ loading, data, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('star');

    const tabConfig = TABS.find((t) => t.key === activeTab) || TABS[0];
    const products = useMemo(
        () => (data?.[tabConfig.sourceKey] || []).slice(0, 6),
        [data, tabConfig.sourceKey]
    );

    const chartCount = tabConfig.charts.length;
    const gridCols =
        chartCount <= 3
            ? 'repeat(auto-fit, minmax(300px, 1fr))'
            : chartCount === 4
                ? 'repeat(auto-fit, minmax(260px, 1fr))'
                : 'repeat(auto-fit, minmax(230px, 1fr))';

    return (
        <Card>
            <SectionTitle
                icon="📦"
                action={
                    <button
                        onClick={() => onNavigate?.('/reports')}
                        style={{
                            background: 'none', border: 'none',
                            color: '#0ea5e9', fontSize: 11,
                            fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        View all →
                    </button>
                }
            >
                Product Intelligence
            </SectionTitle>

            {/* ═══ Tab switcher ═══ */}
            <div style={{
                display: 'flex', gap: 4, marginBottom: 12,
                padding: 3, background: '#f8fafc',
                borderRadius: 8, overflowX: 'auto',
                scrollbarWidth: 'thin',
            }}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '7px 14px',
                                borderRadius: 6, border: 'none',
                                background: isActive ? 'white' : 'transparent',
                                color: isActive ? tab.color : '#64748b',
                                fontSize: 12, fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center',
                                gap: 5, whiteSpace: 'nowrap',
                                flexShrink: 0,
                                boxShadow: isActive
                                    ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.15s',
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                            <span style={{
                                fontSize: 9,
                                background: isActive ? tab.color : '#e2e8f0',
                                color: isActive ? 'white' : '#64748b',
                                padding: '1px 5px',
                                borderRadius: 99,
                                fontWeight: 800,
                                marginLeft: 2,
                            }}>
                                {tab.charts.length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ═══ Subtitle ═══ */}
            <div style={{
                fontSize: 10.5, color: '#64748b',
                marginBottom: 12, padding: '4px 8px',
                background: `${tabConfig.color}08`,
                borderRadius: 6,
                borderLeft: `3px solid ${tabConfig.color}`,
                fontWeight: 600,
            }}>
                {tabConfig.subtitle} · {tabConfig.charts.length} metric
            </div>

            {loading ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: gridCols,
                    gap: 12,
                }}>
                    {tabConfig.charts.map((c) => (
                        <Skeleton key={c.key} h={260} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <EmptyState
                    icon={tabConfig.icon}
                    title="কোনো data নেই"
                    description={
                        activeTab === 'slow'
                            ? '🎉 কোনো slow/dead stock নেই!'
                            : 'এই ক্যাটাগরিতে পণ্য নেই'
                    }
                />
            ) : (
                <>
                    {/* ═══ MOTHER CHART ═══ */}

                    {/*{tabConfig.hasMotherChart && (*/}
                    {/*    <div style={{ marginBottom: 16 }}>*/}
                    {/*        <MotherChart*/}
                    {/*            products={products}*/}
                    {/*            metrics={tabConfig.charts}*/}
                    {/*            accentColor={tabConfig.color}*/}
                    {/*            label="Combined Overview · হোভার করলে সব details"*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/* ═══ Individual metric charts ═══ */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: gridCols,
                        gap: 12,
                    }}>
                        {tabConfig.charts.map((chartConfig) => (
                            <MetricBarChart
                                key={chartConfig.key}
                                config={chartConfig}
                                products={products}
                            />
                        ))}
                    </div>
                </>
            )}
        </Card>
    );
};

// ═══════════════════════════════════════════════════════════════
// MOTHER CHART — সব metric একসাথে, hover details সহ
// ═══════════════════════════════════════════════════════════════
const MotherChart = ({ products, metrics, accentColor, label }) => {
    // Normalization — max value per metric
    const maxValues = useMemo(() => {
        const m = {};
        metrics.forEach((metric) => {
            m[metric.key] = Math.max(
                ...products.map((p) => Math.abs(parseFloat(p[metric.key] || 0))),
                1
            );
        });
        return m;
    }, [products, metrics]);

    const fmt = (val, type) => {
        if (val === null || val === undefined) return '—';
        if (type === 'currency') return fmtCompact(val);
        if (type === 'number') return parseFloat(val).toFixed(2);
        return fmtNumber(val);
    };

    return (
        <div style={{
            padding: '12px 14px',
            background: `${accentColor}05`,
            borderRadius: 10,
            border: `1px solid ${accentColor}30`,
        }}>
            {/* ─── Title ─── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: 10,
                paddingBottom: 6,
                borderBottom: `1px dashed ${accentColor}40`,
            }}>
                <span style={{ fontSize: 12 }}>🎯</span>
                <span style={{
                    fontSize: 11, fontWeight: 800,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    flex: 1,
                }}>
                    {label || 'Combined Overview'}
                </span>
            </div>

            {/* ─── Header row ─── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `140px repeat(${metrics.length}, 1fr)`,
                gap: 10,
                marginBottom: 8,
                paddingBottom: 6,
            }}>
                <div style={{
                    fontSize: 9.5, fontWeight: 800,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}>
                    Product
                </div>
                {metrics.map((m) => (
                    <div
                        key={m.key}
                        style={{
                            fontSize: 9, fontWeight: 800,
                            color: m.color,
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                            lineHeight: 1.3,
                        }}
                    >
                        <div>{m.icon}</div>
                        <div>{m.label}</div>
                    </div>
                ))}
            </div>

            {/* ─── Product rows ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {products.map((p, idx) => {
                    // Tooltip text — সব metric details
                    const tooltipText = metrics
                        .map((m) => `${m.icon} ${m.label}: ${fmt(p[m.key], m.type)}`)
                        .join('\n');

                    return (
                        <div
                            key={p.id || idx}
                            title={tooltipText}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `140px repeat(${metrics.length}, 1fr)`,
                                gap: 10,
                                alignItems: 'center',
                                padding: '6px 8px',
                                borderRadius: 6,
                                background: 'transparent',
                                transition: 'all 0.15s',
                                cursor: 'help',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Product name */}
                            <div style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                color: '#0f172a',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {p.product_name || 'Unknown'}
                            </div>

                            {/* Metric cells with mini-bars */}
                            {metrics.map((m) => {
                                const raw = parseFloat(p[m.key] || 0);
                                const pct = (Math.abs(raw) / maxValues[m.key]) * 100;

                                return (
                                    <div key={m.key}>
                                        {/* Mini bar */}
                                        <div style={{
                                            height: 5,
                                            background: '#e2e8f0',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${pct}%`,
                                                background: `linear-gradient(90deg, ${m.color}bb, ${m.color})`,
                                                borderRadius: 3,
                                                transition: 'width .6s ease',
                                            }} />
                                        </div>
                                        {/* Value */}
                                        <div style={{
                                            fontSize: 10,
                                            fontWeight: 800,
                                            color: m.color,
                                            marginTop: 2,
                                            textAlign: 'right',
                                            fontFamily: "'DM Mono', monospace",
                                        }}>
                                            {fmt(raw, m.type)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// METRIC BAR CHART — Recharts horizontal bar
// ═══════════════════════════════════════════════════════════════
const MetricBarChart = ({ config, products }) => {
    const chartData = useMemo(() => {
        return products
            .map((p) => ({
                id: p.id,
                name: p.product_name || 'Unknown',
                value: parseFloat(p[config.key] || 0),
            }))
            .filter((r) => r.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [products, config.key]);

    const tooltipFormatter = (v) => {
        if (config.type === 'currency') return fmtCurrency(v);
        if (config.type === 'number')   return parseFloat(v).toFixed(2);
        return fmtNumber(v);
    };

    const chartHeight = Math.max(140, chartData.length * 40);

    return (
        <div style={{
            background: 'white',
            borderRadius: 10,
            border: '1px solid #eef2f7',
            padding: '12px 14px',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center',
                gap: 6, marginBottom: 10,
                paddingBottom: 8,
                borderBottom: `1px dashed ${config.color}30`,
            }}>
                <span style={{ fontSize: 13 }}>{config.icon}</span>
                <span style={{
                    fontSize: 11, fontWeight: 800,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    flex: 1,
                }}>
                    {config.label}
                </span>
                <span style={{
                    fontSize: 9, fontWeight: 700,
                    color: config.color,
                    background: `${config.color}15`,
                    padding: '2px 6px',
                    borderRadius: 99,
                }}>
                    {chartData.length}
                </span>
            </div>

            {/* Chart */}
            {chartData.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '24px 0',
                    fontSize: 11, color: '#94a3b8', fontStyle: 'italic',
                }}>
                    — কোনো data নেই —
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 4, right: 40, left: 0, bottom: 4 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickFormatter={(v) =>
                                config.type === 'currency'
                                    ? fmtCompact(v)
                                    : v >= 1000 ? `${Math.round(v / 1000)}k` : v
                            }
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={105}
                            tick={{ fontSize: 11, fill: '#475569' }}
                            interval={0}
                        />
                        <Tooltip
                            contentStyle={TIP_STYLE}
                            cursor={{ fill: `${config.color}08` }}
                            formatter={(v) => [tooltipFormatter(v), config.label]}
                        />
                        <Bar
                            dataKey="value"
                            fill={config.color}
                            radius={[0, 4, 4, 0]}
                            maxBarSize={22}
                            minPointSize={2}          //{/* ← zero হলেও 2px bar দেখাবে */}
                        >
                            {chartData.map((entry, idx) => (
                                <Cell
                                    key={`cell-${idx}`}
                                    fill={config.color}
                                    fillOpacity={1 - idx * 0.1}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default ProductIntelligence;