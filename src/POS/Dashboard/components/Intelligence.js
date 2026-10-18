// src/POS/Dashboard/components/Intelligence.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, SectionTitle, Skeleton, EmptyState } from './Shared';
import { fmtCurrency, fmtRelativeTime } from '../utils/dashboardUtils';

const ViewAll = ({ onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: 'none', border: 'none',
            color: '#0ea5e9', fontSize: 11,
            fontWeight: 700, cursor: 'pointer',
        }}
    >
        View all →
    </button>
);

export const StockAlerts = ({ loading, data, onNavigate }) => {
    const items = [...(data.outOfStock || []), ...(data.lowStock || [])].slice(0, 4);
    const total = (data.outOfStock?.length || 0) + (data.lowStock?.length || 0);

    return (
        <Card>
            <SectionTitle icon="⚠️" action={total > 0 ? <ViewAll onClick={() => onNavigate('/inventory')} /> : null}>
                Stock Alerts
            </SectionTitle>
            {loading ? <Skeleton h={140} /> : total === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '20px 0',
                    color: '#10b981', fontSize: 12,
                }}>
                    <CheckCircle size={20} style={{ marginBottom: 4 }} />
                    <div>সব পণ্য ঠিক আছে</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {items.map((p, i) => {
                        const isOut = (p.stock || 0) <= 0;
                        return (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '6px 10px', borderRadius: 8,
                                background: isOut ? '#fef2f2' : '#fffbeb',
                                border: `1px solid ${isOut ? '#fecaca' : '#fde68a'}`,
                            }}>
                                <div style={{
                                    fontSize: 14, fontWeight: 800,
                                    color: isOut ? '#dc2626' : '#d97706',
                                    minWidth: 26,
                                }}>
                                    {p.stock || 0}
                                </div>
                                <div style={{
                                    flex: 1, minWidth: 0, fontSize: 12,
                                    fontWeight: 600, color: '#374151',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {p.name}
                                </div>
                            </div>
                        );
                    })}
                    {total > 4 && (
                        <div style={{
                            fontSize: 11, color: '#94a3b8',
                            textAlign: 'center', marginTop: 2,
                        }}>
                            +{total - 4} আরও
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export const CustomerDues = ({ loading, customers, onNavigate }) => {
    const items = (customers || []).slice(0, 4);

    return (
        <Card>
            <SectionTitle
                icon="💰"
                action={items.length > 0 ? <ViewAll onClick={() => onNavigate('/sales')} /> : null}
            >
                Top Customer Dues
            </SectionTitle>
            {loading ? <Skeleton h={140} /> : items.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '20px 0',
                    color: '#10b981', fontSize: 12,
                }}>
                    <CheckCircle size={20} style={{ marginBottom: 4 }} />
                    <div>কোনো বাকি নেই 🎉</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {items.map((c, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px', borderRadius: 8,
                            background: '#f8fafc',
                        }}>
                            <div style={{
                                fontSize: 12, fontWeight: 600,
                                color: '#374151',
                                overflow: 'hidden', textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap', maxWidth: 140,
                            }}>
                                {c.name || c.customer_name || `Customer #${c.id}`}
                            </div>
                            <div style={{
                                fontSize: 12, fontWeight: 800,
                                color: '#dc2626',
                            }}>
                                {fmtCurrency(c.due_amount)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export const SuppliersCard = ({ loading, suppliers }) => {
    const totalDue = (suppliers || []).reduce(
        (s, x) => s + parseFloat(x.due_amount || 0), 0
    );

    return (
        <Card>
            <SectionTitle icon="🚚">Suppliers Overview</SectionTitle>
            {loading ? <Skeleton h={140} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', padding: '8px 12px',
                        background: '#f0f9ff', borderRadius: 8,
                        border: '1px solid #bae6fd',
                    }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0369a1' }}>
                            মোট সাপ্লায়ার
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#0284c7' }}>
                            {(suppliers || []).length}
                        </span>
                    </div>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', padding: '8px 12px',
                        background: '#fef3c7', borderRadius: 8,
                        border: '1px solid #fcd34d',
                    }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>
                            মোট বাকি
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#d97706' }}>
                            {fmtCurrency(totalDue)}
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );
};

export const RecentNotes = ({ loading, notes, onNavigate }) => {
    return (
        <Card>
            <SectionTitle
                icon="📝"
                action={notes?.length > 0 ? <ViewAll onClick={() => onNavigate('/reports')} /> : null}
            >
                Recent Notes
            </SectionTitle>
            {loading ? <Skeleton h={140} /> : (!notes || notes.length === 0) ? (
                <EmptyState
                    icon="📭"
                    title="কোনো note নেই"
                    description="Reports থেকে business notes যোগ করুন"
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {notes.map((n, i) => (
                        <div key={i} style={{
                            padding: '8px 10px',
                            background: '#f8fafc', borderRadius: 8,
                            borderLeft: '3px solid #0ea5e9',
                        }}>
                            <div style={{
                                fontSize: 12, color: '#0f172a',
                                marginBottom: 4,
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}>
                                {n.note}
                            </div>
                            <div style={{
                                fontSize: 10.5, color: '#94a3b8',
                                display: 'flex', gap: 6,
                            }}>
                                <span>{n.by_name || 'Unknown'}</span>
                                <span>·</span>
                                <span>{n.period_key}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};