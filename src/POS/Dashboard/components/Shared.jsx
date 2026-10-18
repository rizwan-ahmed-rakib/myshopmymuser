// src/POS/Dashboard/components/Shared.jsx
import React from 'react';

export const Skeleton = ({ h = 20, w = '100%', r = 8 }) => (
    <div style={{
        height: h, width: w, borderRadius: r,
        background: 'linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
    }} />
);

export const Card = ({ children, style = {}, className = '' }) => (
    <div
        className={className}
        style={{
            background: 'white',
            borderRadius: 14,
            padding: '16px 18px',
            border: '1px solid #eef2f7',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            ...style,
        }}
    >
        {children}
    </div>
);

export const SectionTitle = ({ icon, children, action }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 12,
    }}>
        {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
        <h3 style={{
            margin: 0, fontSize: 13.5, fontWeight: 800,
            color: '#0f172a', letterSpacing: '-0.01em',
        }}>{children}</h3>
        {action && <div style={{ marginLeft: 'auto' }}>{action}</div>}
    </div>
);

export const EmptyState = ({ icon = '📭', title, description }) => (
    <div style={{
        padding: '24px 0', textAlign: 'center',
        color: '#94a3b8', fontSize: 12.5,
    }}>
        <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
        <div style={{ fontWeight: 600, color: '#64748b' }}>{title}</div>
        {description && (
            <div style={{ marginTop: 2, fontSize: 11.5 }}>{description}</div>
        )}
    </div>
);