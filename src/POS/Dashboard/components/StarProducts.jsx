// src/POS/Dashboard/components/StarProducts.jsx
import React from 'react';
import { Card, SectionTitle, Skeleton, EmptyState } from './Shared';
import { fmtCurrency, fmtNumber } from '../utils/dashboardUtils';

const MEDALS = ['🥇', '🥈', '🥉'];

const StarProducts = ({ loading, products, onNavigate }) => {
    const items = (products || []).slice(0, 5);

    // Max score → normalize করি 0-100% এ
    const maxScore = items.length > 0
        ? Math.max(...items.map((p) => parseFloat(p.performance_score || 0)))
        : 1;

    return (
        <Card>
            <SectionTitle
                icon="🌟"
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
                Star Products
            </SectionTitle>

            <div style={{
                fontSize: 10.5, color: '#94a3b8',
                marginBottom: 10, lineHeight: 1.5,
                padding: '6px 10px',
                background: '#f8fafc',
                borderRadius: 6,
                borderLeft: '3px solid #fbbf24',
            }}>
                <b>Balanced Score:</b> Low cost · High profit · High volume · High frequency
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[...Array(3)].map((_, i) => <Skeleton key={i} h={68} />)}
                </div>
            ) : items.length === 0 ? (
                <EmptyState
                    icon="🌟"
                    title="কোনো star product নেই"
                    description="যখন product বিক্রি হবে, এখানে দেখা যাবে"
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {items.map((p, idx) => {
                        const score = parseFloat(p.performance_score || 0);
                        const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
                        const medal = MEDALS[idx] || `#${idx + 1}`;

                        return (
                            <div key={p.id || idx} style={{
                                padding: '10px 12px',
                                background: '#f8fafc',
                                borderRadius: 10,
                                border: idx < 3
                                    ? '1px solid #fde68a'
                                    : '1px solid #e2e8f0',
                            }}>
                                {/* Row 1: Medal + Name + Score */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 6,
                                }}>
                                    <span style={{
                                        fontSize: 16,
                                        flexShrink: 0,
                                        width: 22,
                                        textAlign: 'center',
                                    }}>
                                        {medal}
                                    </span>
                                    <div style={{
                                        flex: 1, minWidth: 0,
                                    }}>
                                        <div style={{
                                            fontSize: 12.5, fontWeight: 700,
                                            color: '#0f172a',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {p.product_name || 'Unknown'}
                                        </div>
                                        <div style={{
                                            fontSize: 10,
                                            color: '#94a3b8',
                                            fontWeight: 500,
                                        }}>
                                            {p.product_code || '—'}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: 11, fontWeight: 800,
                                        color: '#d97706',
                                        flexShrink: 0,
                                    }}>
                                        {score.toFixed(2)}
                                    </div>
                                </div>

                                {/* Row 2: Score bar */}
                                <div style={{
                                    height: 4,
                                    background: '#f1f5f9',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    marginBottom: 8,
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${pct}%`,
                                        background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                                        borderRadius: 2,
                                        transition: 'width .6s ease',
                                    }} />
                                </div>

                                {/* Row 3: Metrics grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 6,
                                    fontSize: 10.5,
                                }}>
                                    <MetricChip
                                        icon="📦"
                                        label="Units"
                                        value={fmtNumber(p.total_units_sold)}
                                        color="#6366f1"
                                    />
                                    <MetricChip
                                        icon="🧾"
                                        label="Invoices"
                                        value={fmtNumber(p.total_sales_count)}
                                        color="#0ea5e9"
                                    />
                                    <MetricChip
                                        icon="💰"
                                        label="Profit"
                                        value={fmtCurrency(p.total_net_profit)}
                                        color="#10b981"
                                    />
                                    <MetricChip
                                        icon="💸"
                                        label="Cost"
                                        value={fmtCurrency(p.total_cost)}
                                        color="#ef4444"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

// ─── Metric chip ────────────────────────────────────────────
const MetricChip = ({ icon, label, value, color }) => (
    <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        padding: '4px 2px',
        background: 'white',
        borderRadius: 6,
        border: '1px solid #f1f5f9',
    }}>
        <div style={{
            fontSize: 9, color: '#94a3b8',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 2,
        }}>
            {icon} {label}
        </div>
        <div style={{
            fontSize: 11, fontWeight: 800,
            color,
        }}>
            {value}
        </div>
    </div>
);

export default StarProducts;