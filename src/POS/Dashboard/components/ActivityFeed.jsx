// src/POS/Dashboard/components/ActivityFeed.jsx
import React from 'react';
import {
    ShoppingCart, Truck, ArrowUpRight, ArrowDownLeft,
} from 'lucide-react';
import { Card, SectionTitle, Skeleton, EmptyState } from './Shared';
import { fmtCurrency, fmtRelativeTime } from '../utils/dashboardUtils';

const STATUS_STYLES = {
    paid:    { bg: '#d1fae5', color: '#065f46', label: 'Paid' },
    partial: { bg: '#fef3c7', color: '#92400e', label: 'Partial' },
    unpaid:  { bg: '#fee2e2', color: '#991b1b', label: 'Unpaid' },
    due:     { bg: '#fee2e2', color: '#991b1b', label: 'Due' },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_STYLES[status] || { bg: '#f1f5f9', color: '#475569', label: status || '—' };
    return (
        <span style={{
            padding: '2px 7px', borderRadius: 99,
            fontSize: 10, fontWeight: 700,
            background: s.bg, color: s.color,
            textTransform: 'capitalize',
        }}>
            {s.label}
        </span>
    );
};

const ActivityFeed = ({ loading, activity, onNavigate }) => {
    return (
        <Card>
            <SectionTitle
                icon="📋"
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
                Recent Activity
            </SectionTitle>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...Array(5)].map((_, i) => <Skeleton key={i} h={44} />)}
                </div>
            ) : !activity || activity.length === 0 ? (
                <EmptyState
                    icon="🕐"
                    title="No recent activity"
                    description="Sale বা purchase হলে এখানে দেখা যাবে"
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {activity.map((item, i) => {
                        const isSale = item.type === 'sale';
                        const Icon = isSale ? ShoppingCart : Truck;
                        const color = isSale ? '#10b981' : '#f59e0b';

                        return (
                            <button
                                key={i}
                                onClick={() => onNavigate?.(isSale ? '/sales' : '/purchase')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '8px 10px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: `${color}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Icon size={14} color={color} />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        marginBottom: 2,
                                    }}>
                                        <span style={{
                                            fontSize: 12, fontWeight: 700,
                                            color: '#0f172a',
                                        }}>
                                            {item.invoice || `#${item.id}`}
                                        </span>
                                        <span style={{
                                            fontSize: 10, color: '#94a3b8',
                                            fontWeight: 500,
                                        }}>
                                            {isSale ? 'Sale' : 'Purchase'}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: 11, color: '#64748b',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {item.party} · {fmtRelativeTime(item.date)}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center',
                                        gap: 3, justifyContent: 'flex-end',
                                        marginBottom: 2,
                                    }}>
                                        {isSale
                                            ? <ArrowUpRight size={11} color="#10b981" />
                                            : <ArrowDownLeft size={11} color="#f59e0b" />}
                                        <span style={{
                                            fontSize: 12, fontWeight: 800,
                                            color: isSale ? '#10b981' : '#f59e0b',
                                        }}>
                                            {fmtCurrency(item.amount)}
                                        </span>
                                    </div>
                                    <StatusBadge status={item.status} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default ActivityFeed;