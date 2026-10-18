// src/POS/Dashboard/components/AlertsBanner.jsx
import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Card } from './Shared';

const AlertsBanner = ({ items = [], onNavigate }) => {
    if (!items.length) return null;

    return (
        <Card style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '1px solid #fbbf24',
            padding: '14px 16px',
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
            }}>
                <AlertTriangle size={16} color="#92400e" />
                <span style={{
                    fontWeight: 800, color: '#92400e', fontSize: 13,
                }}>
                    {items.length}টি বিষয় আপনার দৃষ্টি প্রয়োজন
                </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {items.map((a, i) => (
                    <button
                        key={i}
                        onClick={() => onNavigate?.(a.action)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 12px',
                            background: 'rgba(255,255,255,0.85)',
                            border: '1px solid rgba(146, 64, 14, 0.2)',
                            borderRadius: 8,
                            fontSize: 12, fontWeight: 600,
                            color: '#78350f',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'white'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
                    >
                        <span>{a.icon}</span>
                        <span>{a.text}</span>
                        <ChevronRight size={12} />
                    </button>
                ))}
            </div>
        </Card>
    );
};

export default AlertsBanner;