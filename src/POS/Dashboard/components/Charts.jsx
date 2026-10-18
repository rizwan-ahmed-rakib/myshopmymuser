// src/POS/Dashboard/components/Charts.jsx
import React, { useMemo } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, SectionTitle, Skeleton, EmptyState } from './Shared';
import { fmtCurrency } from '../utils/dashboardUtils';

const TIP_STYLE = {
    borderRadius: 10, fontSize: 12,
    border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
};

export const TrendChart = ({ loading, profit }) => {
    const chartData = useMemo(() => {
        const cd = profit?.chart_data;
        if (!cd?.labels?.length) return [];
        return cd.labels.map((label, i) => ({
            label,
            revenue: cd.datasets?.total_revenue?.[i] || 0,
            profit: cd.datasets?.accrual_total_net_profit?.[i] || 0,
        }));
    }, [profit]);

    return (
        <Card>
            <SectionTitle icon="📈">Sales & Profit Trend</SectionTitle>
            {loading ? <Skeleton h={220} /> : chartData.length === 0 ? (
                <EmptyState
                    icon="📊"
                    title="এই period-এ কোনো data নেই"
                    description="Different period select করুন"
                />
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="dRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="dProf" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            width={50}
                            tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : v}
                        />
                        <Tooltip
                            contentStyle={TIP_STYLE}
                            formatter={(v, n) => [
                                fmtCurrency(v),
                                n === 'revenue' ? 'Revenue' : 'Profit',
                            ]}
                        />
                        <Area
                            type="monotone" dataKey="revenue"
                            stroke="#6366f1" strokeWidth={2}
                            fill="url(#dRev)" name="revenue"
                        />
                        <Area
                            type="monotone" dataKey="profit"
                            stroke="#10b981" strokeWidth={2}
                            fill="url(#dProf)" name="profit"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
};

export const TopProductsChart = ({ loading, topProducts }) => {
    const chartData = useMemo(() => {
        return (topProducts || []).map((p) => ({
            name: p.product_name || 'Unknown',
            profit: parseFloat(p.total_net_profit || 0),
        }));
    }, [topProducts]);

    return (
        <Card>
            <SectionTitle icon="🏆">Top Products by Profit</SectionTitle>
            {loading ? <Skeleton h={220} /> : chartData.length === 0 ? (
                <EmptyState icon="📦" title="কোনো data নেই" />
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis
                            type="category" dataKey="name" width={110}
                            tick={{ fontSize: 11, fill: '#475569' }}
                        />
                        <Tooltip contentStyle={TIP_STYLE} formatter={(v) => fmtCurrency(v)} />
                        <Bar dataKey="profit" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
};