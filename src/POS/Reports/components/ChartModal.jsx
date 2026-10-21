// src/POS/Reports/components/ChartModal.jsx
import React, { useState, useMemo } from 'react';
import { X, LineChart, BarChart2, TrendingUp } from 'lucide-react';
import {
    LineChart as ReLineChart, Line,
    BarChart as ReBarChart, Bar,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from 'recharts';
import { fmtCurrency } from '../config/sections';

/**
 * Chart Modal — chart_data থেকে dynamic chart।
 *
 * chart_data structure:
 *   { labels: ['2026-09-01', ...], datasets: { gross_profit: [...], ... } }
 */

// প্রতিটা metric-এর জন্য nice label
const METRIC_LABELS = {
    gross_profit: 'Gross Profit',
    accrual_total_net_profit: 'Net Profit',
    total_revenue: 'Revenue',
    received_net_sale_value: 'Cash Received',
    total_operational_expense: 'Operational Expense',

     // 🆕
    average_net_sale_value_per_invoice: 'Avg Sale / Invoice',
    average_gross_profit_per_invoice: 'Avg Gross Profit / Invoice',
};

const METRIC_COLORS = {
    gross_profit: '#10b981',
    accrual_total_net_profit: '#0ea5e9',
    total_revenue: '#3b82f6',
    received_net_sale_value: '#8b5cf6',
    total_operational_expense: '#ef4444',

    // 🆕
    average_net_sale_value_per_invoice: '#f59e0b',
    average_gross_profit_per_invoice: '#ec4899',
};

const ChartModal = ({ isOpen, onClose, chartData, sectionLabel }) => {
    const [chartType, setChartType] = useState('line');   // line | bar | area

    // chart_data → recharts format
    const rechartData = useMemo(() => {
        if (!chartData?.labels || !chartData?.datasets) return [];
        return chartData.labels.map((label, idx) => {
            const row = { label };
            Object.entries(chartData.datasets).forEach(([metric, values]) => {
                row[metric] = values[idx] ?? 0;
            });
            return row;
        });
    }, [chartData]);

    // কোন metric গুলো available
    const availableMetrics = useMemo(() => {
        return Object.keys(chartData?.datasets || {});
    }, [chartData]);

    // Default: সব metric দেখাবো
    const [visibleMetrics, setVisibleMetrics] = useState(null);
    const activeMetrics = visibleMetrics || availableMetrics;

    if (!isOpen) return null;

    const tipStyle = {
        borderRadius: 8, fontSize: 12, border: 'none',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: 16,
                    width: '100%',
                    maxWidth: 1100,
                    maxHeight: '92vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', gap: 12,
                }}>
                    <TrendingUp size={18} color="#0ea5e9" />
                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                        {sectionLabel || 'Trends'}
                    </h2>

                    {/* Chart type selector */}
                    <div style={{
                        display: 'flex', gap: 2,
                        background: '#f1f5f9', borderRadius: 8, padding: 3,
                        marginLeft: 'auto',
                    }}>
                        {[
                            { key: 'line', Icon: LineChart, label: 'Line' },
                            { key: 'bar', Icon: BarChart2, label: 'Bar' },
                            { key: 'area', Icon: TrendingUp, label: 'Area' },
                        ].map(({ key, Icon, label }) => (
                            <button
                                key={key}
                                onClick={() => setChartType(key)}
                                style={{
                                    padding: '5px 10px',
                                    border: 'none',
                                    borderRadius: 6,
                                    background: chartType === key ? 'white' : 'transparent',
                                    color: chartType === key ? '#0ea5e9' : '#64748b',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    fontSize: 11.5, fontWeight: 600,
                                    boxShadow: chartType === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                }}
                            >
                                <Icon size={13} /> {label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer', color: '#64748b',
                            padding: 6, borderRadius: 6,
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Metric toggles */}
                <div style={{
                    padding: '10px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex', flexWrap: 'wrap', gap: 8,
                }}>
                    {availableMetrics.map((m) => {
                        const isVisible = activeMetrics.includes(m);
                        return (
                            <button
                                key={m}
                                onClick={() => {
                                    const next = isVisible
                                        ? activeMetrics.filter((x) => x !== m)
                                        : [...activeMetrics, m];
                                    setVisibleMetrics(next.length ? next : [m]);
                                }}
                                style={{
                                    padding: '4px 10px',
                                    borderRadius: 99,
                                    border: `1px solid ${isVisible ? METRIC_COLORS[m] || '#0ea5e9' : '#e2e8f0'}`,
                                    background: isVisible ? `${METRIC_COLORS[m]}15` : 'white',
                                    color: isVisible ? METRIC_COLORS[m] || '#0ea5e9' : '#94a3b8',
                                    fontSize: 11, fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                {METRIC_LABELS[m] || m}
                            </button>
                        );
                    })}
                </div>

                {/* Chart */}
                <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
                    {rechartData.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: 60,
                            color: '#94a3b8', fontSize: 13,
                        }}>
                            কোনো chart data নেই এই range-এ
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={420}>
                            {chartType === 'line' ? (
                                <ReLineChart data={rechartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip contentStyle={tipStyle} formatter={(v) => fmtCurrency(v)} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    {activeMetrics.map((m) => (
                                        <Line
                                            key={m}
                                            type="monotone"
                                            dataKey={m}
                                            name={METRIC_LABELS[m] || m}
                                            stroke={METRIC_COLORS[m] || '#0ea5e9'}
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                    ))}
                                </ReLineChart>
                            ) : chartType === 'bar' ? (
                                <ReBarChart data={rechartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip contentStyle={tipStyle} formatter={(v) => fmtCurrency(v)} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    {activeMetrics.map((m) => (
                                        <Bar
                                            key={m}
                                            dataKey={m}
                                            name={METRIC_LABELS[m] || m}
                                            fill={METRIC_COLORS[m] || '#0ea5e9'}
                                            radius={[3, 3, 0, 0]}
                                        />
                                    ))}
                                </ReBarChart>
                            ) : (
                                <AreaChart data={rechartData}>
                                    <defs>
                                        {activeMetrics.map((m) => (
                                            <linearGradient key={m} id={`grad-${m}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={METRIC_COLORS[m] || '#0ea5e9'} stopOpacity={0.35} />
                                                <stop offset="95%" stopColor={METRIC_COLORS[m] || '#0ea5e9'} stopOpacity={0} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip contentStyle={tipStyle} formatter={(v) => fmtCurrency(v)} />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    {activeMetrics.map((m) => (
                                        <Area
                                            key={m}
                                            type="monotone"
                                            dataKey={m}
                                            name={METRIC_LABELS[m] || m}
                                            stroke={METRIC_COLORS[m] || '#0ea5e9'}
                                            fill={`url(#grad-${m})`}
                                            strokeWidth={2}
                                        />
                                    ))}
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChartModal;