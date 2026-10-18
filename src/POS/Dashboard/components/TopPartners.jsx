// src/POS/Dashboard/components/TopPartners.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, SectionTitle, Skeleton, EmptyState } from './Shared';
import { fmtCurrency, fmtNumber } from '../utils/dashboardUtils';
import { posReportsAPI } from '../../../context_or_provider/pos/reports/reportsAPI';

// ═══════════════════════════════════════════════════════════════
// PARTNER CONFIGS — Customer ও Supplier-এর metric definitions
// ═══════════════════════════════════════════════════════════════
const PARTNER_CONFIGS = {
    customer: {
        label: 'Top Customers',
        icon: '👥',
        color: '#6366f1',
        sourceKey: 'customers',
        api: 'getTopCustomers',
        metrics: [
            { key: 'revenue',   label: 'Revenue',   icon: '💰', color: '#10b981', valueKey: 'total_revenue',  type: 'currency' },
            { key: 'profit',    label: 'Profit',    icon: '💵', color: '#0ea5e9', valueKey: 'total_profit',   type: 'currency' },
            { key: 'frequency', label: 'Frequency', icon: '🔁', color: '#8b5cf6', valueKey: 'invoice_count',  type: 'int' },
            { key: 'due',       label: 'Due',       icon: '⏰', color: '#ef4444', valueKey: 'due_amount',     type: 'currency' },
            { key: 'star',      label: 'Star',      icon: '🌟', color: '#f59e0b', valueKey: 'star_score',     type: 'number' },
        ],
    },
    supplier: {
        label: 'Top Suppliers',
        icon: '🚚',
        color: '#f59e0b',
        sourceKey: 'suppliers',
        api: 'getTopSuppliers',
        metrics: [
            { key: 'value',       label: 'Purchase Value', icon: '💸', color: '#dc2626', valueKey: 'total_value',       type: 'currency' },
            { key: 'reliability', label: 'Reliability',    icon: '✅', color: '#10b981', valueKey: 'reliability_pct',   type: 'percent' },
            { key: 'frequency',   label: 'Frequency',      icon: '🔁', color: '#8b5cf6', valueKey: 'invoice_count',     type: 'int' },
            { key: 'due',         label: 'Due',            icon: '⏰', color: '#ef4444', valueKey: 'due_amount',        type: 'currency' },
            { key: 'star',        label: 'Star',           icon: '🌟', color: '#f59e0b', valueKey: 'star_score',        type: 'number' },
        ],
    },
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const TopPartners = ({ onNavigate, period = 'month' }) => {
    // ─── Main tab: customer / supplier ───
    const [activePartner, setActivePartner] = useState('customer');

    // ─── Per-partner active metrics (persist across tab switch) ───
    const [activeMetrics, setActiveMetrics] = useState({
        customer: ['revenue', 'profit', 'star'],
        supplier: ['value', 'reliability', 'star'],
    });

    // ─── Data cache per (partner + metric) ───
    // Key: `${partner}::${metric}` → { loading, data, error }
    const [dataMap, setDataMap] = useState({});

    const config = PARTNER_CONFIGS[activePartner];
    const currentMetrics = activeMetrics[activePartner];
    const activeMetricDefs = useMemo(
        () => config.metrics.filter((m) => currentMetrics.includes(m.key)),
        [config.metrics, currentMetrics]
    );

    // ═══════════════════════════════════════════════════════════
    // FETCH — quando active metric পরিবর্তন হয়
    // ═══════════════════════════════════════════════════════════
    const fetchMetric = useCallback(async (partner, metricKey) => {
        const cacheKey = `${partner}::${metricKey}`;

        // Already loaded (or loading) → skip
        if (dataMap[cacheKey]?.data || dataMap[cacheKey]?.loading) return;

        setDataMap((prev) => ({
            ...prev,
            [cacheKey]: { loading: true, data: null, error: null },
        }));

        try {
            const apiMethod = posReportsAPI[config.api];
            const res = await apiMethod({
                sort_by: metricKey,
                limit: 5,
            });
            const items = res?.data?.[config.sourceKey] || [];

            setDataMap((prev) => ({
                ...prev,
                [cacheKey]: { loading: false, data: items, error: null },
            }));
        } catch (err) {
            console.error(`TopPartners fetch error (${partner}/${metricKey}):`, err);
            setDataMap((prev) => ({
                ...prev,
                [cacheKey]: { loading: false, data: [], error: err?.message || 'Failed' },
            }));
        }
    }, [config.api, config.sourceKey, dataMap]);

    // Effect — active metrics fetch করি
    useEffect(() => {
        currentMetrics.forEach((metricKey) => {
            fetchMetric(activePartner, metricKey);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePartner, currentMetrics.join(',')]);

    // ═══════════════════════════════════════════════════════════
    // TOGGLE metric chip
    // ═══════════════════════════════════════════════════════════
    const toggleMetric = (key) => {
        setActiveMetrics((prev) => {
            const currentList = prev[activePartner];
            const isActive = currentList.includes(key);
            const nextList = isActive
                ? currentList.filter((k) => k !== key)
                : [...currentList, key];
            return { ...prev, [activePartner]: nextList };
        });
    };

    const gridCols = 'repeat(auto-fit, minmax(260px, 1fr))';

    return (
        <Card>
            <SectionTitle
                icon="🏆"
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
                Top Partners
            </SectionTitle>

            {/* ═══ Main tab switcher: Customer / Supplier ═══ */}
            <div style={{
                display: 'inline-flex',
                gap: 4,
                padding: 3,
                background: '#f8fafc',
                borderRadius: 8,
                marginBottom: 12,
            }}>
                {Object.entries(PARTNER_CONFIGS).map(([key, cfg]) => {
                    const isActive = activePartner === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActivePartner(key)}
                            style={{
                                padding: '7px 16px',
                                borderRadius: 6, border: 'none',
                                background: isActive ? 'white' : 'transparent',
                                color: isActive ? cfg.color : '#64748b',
                                fontSize: 12, fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                boxShadow: isActive
                                    ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.15s',
                            }}
                        >
                            <span style={{ fontSize: 13 }}>{cfg.icon}</span>
                            {cfg.label}
                        </button>
                    );
                })}
            </div>

            {/* ═══ Metric chips — multi-select toggle ═══ */}
            <div style={{
                fontSize: 10.5,
                color: '#64748b',
                fontWeight: 600,
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
            }}>
                <span>📊 Metric চান করুন</span>
                <span style={{
                    fontSize: 9, color: '#94a3b8',
                    background: '#f1f5f9',
                    padding: '1px 6px',
                    borderRadius: 99,
                }}>
                    {currentMetrics.length} active
                </span>
            </div>

            <div style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                marginBottom: 14,
            }}>
                {config.metrics.map((metric) => {
                    const isActive = currentMetrics.includes(metric.key);
                    return (
                        <button
                            key={metric.key}
                            onClick={() => toggleMetric(metric.key)}
                            title={isActive ? 'Click to hide' : 'Click to show'}
                            style={{
                                padding: '6px 12px',
                                borderRadius: 99,
                                border: isActive
                                    ? `1.5px solid ${metric.color}`
                                    : '1px solid #e2e8f0',
                                background: isActive
                                    ? `${metric.color}12`
                                    : 'white',
                                color: isActive ? metric.color : '#94a3b8',
                                fontSize: 11.5, fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 5,
                                transition: 'all 0.15s',
                            }}
                        >
                            <span>{metric.icon}</span>
                            {metric.label}
                            {isActive && (
                                <span style={{
                                    fontSize: 9,
                                    background: metric.color,
                                    color: 'white',
                                    padding: '0px 5px',
                                    borderRadius: 99,
                                    fontWeight: 800,
                                    marginLeft: 2,
                                }}>
                                    ✓
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ═══ Active metric cards ═══ */}
            {currentMetrics.length === 0 ? (
                <div style={{
                    padding: '28px 16px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: 10,
                    border: '2px dashed #e2e8f0',
                    color: '#94a3b8',
                    fontSize: 12.5,
                }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>📊</div>
                    <div style={{ fontWeight: 700 }}>
                        কোনো metric select করা নেই
                    </div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>
                        উপরে যেকোনো metric chip-এ click করুন
                    </div>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: gridCols,
                    gap: 12,
                }}>
                    {activeMetricDefs.map((metric) => {
                        const cacheKey = `${activePartner}::${metric.key}`;
                        const state = dataMap[cacheKey] || {};
                        return (
                            <MetricCard
                                key={metric.key}
                                metric={metric}
                                items={state.data}
                                loading={!!state.loading}
                                partnerType={activePartner}
                                onNavigate={onNavigate}
                            />
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

// ═══════════════════════════════════════════════════════════════
// SINGLE METRIC CARD
// ═══════════════════════════════════════════════════════════════
const MEDALS = ['🥇', '🥈', '🥉'];

const MetricCard = ({ metric, items, loading, partnerType, onNavigate }) => {
    const formatValue = (v) => {
        if (v === null || v === undefined) return '—';
        if (metric.type === 'currency') return fmtCurrency(v);
        if (metric.type === 'percent')  return `${parseFloat(v).toFixed(1)}%`;
        if (metric.type === 'number')   return parseFloat(v).toFixed(2);
        return fmtNumber(v);
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: 10,
            border: '1px solid #eef2f7',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center',
                gap: 6, marginBottom: 10,
                paddingBottom: 8,
                borderBottom: `1px dashed ${metric.color}30`,
            }}>
                <span style={{
                    fontSize: 13, color: metric.color,
                }}>
                    {metric.icon}
                </span>
                <span style={{
                    fontSize: 11, fontWeight: 800,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    flex: 1,
                }}>
                    {metric.label}
                </span>
                {items?.length > 0 && (
                    <span style={{
                        fontSize: 9, fontWeight: 700,
                        color: metric.color,
                        background: `${metric.color}15`,
                        padding: '2px 6px',
                        borderRadius: 99,
                    }}>
                        Top {items.length}
                    </span>
                )}
            </div>

            {/* Content */}
            {loading ? (
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    gap: 8,
                }}>
                    {[...Array(5)].map((_, i) => <Skeleton key={i} h={28} />)}
                </div>
            ) : !items || items.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '20px 0',
                    fontSize: 11, color: '#94a3b8', fontStyle: 'italic',
                }}>
                    — কোনো data নেই —
                </div>
            ) : (
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                    {items.map((item, idx) => {
                        const name = item.name || item.customer_name || item.supplier_name || 'Unknown';
                        const value = item[metric.valueKey];
                        const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
                        const medal = MEDALS[idx] || `#${idx + 1}`;

                        return (
                            <div key={item.customer_id || item.supplier_id || idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '5px 8px',
                                borderRadius: 6,
                                background: 'transparent',
                                transition: 'all 0.15s',
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                {/* Rank */}
                                <span style={{
                                    fontSize: 11,
                                    width: 18,
                                    textAlign: 'center',
                                    flexShrink: 0,
                                    fontWeight: 800,
                                    color: '#94a3b8',
                                }}>
                                    {medal}
                                </span>

                                {/* Avatar / Initial */}
                                <div style={{
                                    width: 26, height: 26,
                                    borderRadius: '50%',
                                    background: `${metric.color}18`,
                                    color: metric.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 10,
                                    fontWeight: 800,
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                }}>
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt=""
                                            style={{
                                                width: '100%', height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        initials || '?'
                                    )}
                                </div>

                                {/* Name + value */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: 11.5,
                                        fontWeight: 700,
                                        color: '#0f172a',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {name}
                                    </div>
                                </div>

                                {/* Value */}
                                <div style={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    color: metric.color,
                                    flexShrink: 0,
                                    fontFamily: "'DM Mono', monospace",
                                }}>
                                    {formatValue(value)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TopPartners;