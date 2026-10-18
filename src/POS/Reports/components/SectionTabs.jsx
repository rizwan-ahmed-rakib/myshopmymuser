// src/POS/Reports/components/SectionTabs.jsx
import React from 'react';
import { SECTION_TABS } from '../config/sections';

/**
 * Profit Summary-এর ভেতরে column section selector।
 * User এখান থেকে কোন section-এর column দেখবে সেটা select করবে।
 *
 * Special:
 * - "all" → সব default columns
 * - অন্যগুলো → ওই section-এর column only
 * - "notes" → শুধু business notes display (special render)
 */
const SectionTabs = ({ activeTab, onTabChange, counts = {} }) => {
    return (
        <div style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 2,
            scrollbarWidth: 'thin',
        }}>
            {SECTION_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const count = counts[tab.key];
                return (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        style={{
                            padding: '7px 14px',
                            borderRadius: 8,
                            border: isActive ? '1.5px solid #0ea5e9' : '1px solid #e2e8f0',
                            background: isActive ? '#eff6ff' : 'white',
                            color: isActive ? '#0284c7' : '#475569',
                            fontSize: 12.5,
                            fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s',
                            flexShrink: 0,
                        }}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {count !== undefined && count > 0 && (
                            <span style={{
                                background: isActive ? '#0ea5e9' : '#e2e8f0',
                                color: isActive ? 'white' : '#64748b',
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: 99,
                                minWidth: 18,
                                textAlign: 'center',
                            }}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default SectionTabs;