// src/POS/Dashboard/components/InsightsPanel.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, SectionTitle, EmptyState, Skeleton } from './Shared';

const TYPE_STYLES = {
    success: { bg: '#f0fdf4', border: '#86efac', text: '#065f46' },
    warning: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e' },
    danger:  { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
};

const InsightsPanel = ({ loading, insights, onNavigate }) => {
    return (
        <Card>
            <SectionTitle icon="💡">Smart Insights</SectionTitle>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...Array(3)].map((_, i) => <Skeleton key={i} h={40} />)}
                </div>
            ) : insights.length === 0 ? (
                <EmptyState
                    icon="✨"
                    title="সব ঠিক আছে"
                    description="এই মুহূর্তে কোনো বিশেষ insight নেই"
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {insights.map((ins, i) => {
                        const style = TYPE_STYLES[ins.type] || TYPE_STYLES.info;
                        return (
                            <button
                                key={i}
                                onClick={() => ins.action && onNavigate?.(ins.action)}
                                disabled={!ins.action}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '10px 12px',
                                    background: style.bg,
                                    border: `1px solid ${style.border}`,
                                    borderRadius: 10,
                                    textAlign: 'left',
                                    cursor: ins.action ? 'pointer' : 'default',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    if (ins.action) e.currentTarget.style.transform = 'translateX(2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <span style={{ fontSize: 16, flexShrink: 0 }}>{ins.icon}</span>
                                <span style={{
                                    flex: 1, fontSize: 12.5,
                                    color: style.text, fontWeight: 600,
                                    lineHeight: 1.4,
                                }}>
                                    {ins.text}
                                </span>
                                {ins.action && (
                                    <ChevronRight size={14} color={style.text} style={{ flexShrink: 0 }} />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default InsightsPanel;