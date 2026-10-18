// src/POS/Reports/components/FloatingChartButton.jsx
import React from 'react';
import { BarChart3 } from 'lucide-react';

const FloatingChartButton = ({ onClick }) => (
    <button
        onClick={onClick}
        title="View Charts"
        style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4), 0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 26px rgba(14, 165, 233, 0.5), 0 2px 8px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4), 0 2px 6px rgba(0,0,0,0.1)';
        }}
    >
        <BarChart3 size={24} />
    </button>
);

export default FloatingChartButton;