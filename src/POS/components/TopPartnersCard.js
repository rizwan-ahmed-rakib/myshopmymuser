// src/pages/dashboard/TopPartnersCard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FaUser, FaTruck } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

// Config-driven: একই component দুই পক্ষের জন্য
const CONFIGS = {
    customer: {
        endpoint: (params) => `/api/sale/customer-transactions/top-customers/?${params}`,
        responseKey: 'customers',
        idKey: 'customer_id',
        icon: FaUser,
        accent: 'blue',
        tabs: [
            { key: 'revenue',   label: 'Revenue'   },
            { key: 'profit',    label: 'Profit'    },
            { key: 'frequency', label: 'Frequency' },
            { key: 'star',      label: 'Star'      },
            { key: 'due',       label: 'Due Watch' },
        ],
        primaryValue: (p, tab) => {
            if (tab === 'revenue')   return `৳${Number(p.total_revenue).toLocaleString()}`;
            if (tab === 'profit')    return `৳${Number(p.total_profit).toLocaleString()}`;
            if (tab === 'frequency') return `${p.invoice_count}×`;
            if (tab === 'star')      return `score ${p.star_score}`;
            if (tab === 'due')       return `৳${Number(p.due_amount).toLocaleString()}`;
        },
        secondary: (p) => `${p.invoice_count}× · ${p.total_quantity} pcs`,
    },
    supplier: {
        endpoint: (params) => `/api/purchase/supplier-transactions/top-suppliers/?${params}`,
        responseKey: 'suppliers',
        idKey: 'supplier_id',
        icon: FaTruck,
        accent: 'amber',
        tabs: [
            { key: 'value',       label: 'Value'       },
            { key: 'reliability', label: 'Reliability' },
            { key: 'frequency',   label: 'Frequency'   },
            { key: 'star',        label: 'Star'        },
            { key: 'due',         label: 'Due Owed'    },
        ],
        primaryValue: (p, tab) => {
            if (tab === 'value')       return `৳${Number(p.total_value).toLocaleString()}`;
            if (tab === 'reliability') return `${p.reliability_pct}%`;
            if (tab === 'frequency')   return `${p.invoice_count}×`;
            if (tab === 'star')        return `score ${p.star_score}`;
            if (tab === 'due')         return `৳${Number(p.due_amount).toLocaleString()}`;
        },
        secondary: (p) => p.returned_qty > 0
            ? `${p.invoice_count}× · ↩ ${p.returned_qty} returned`
            : `${p.invoice_count}× · ${p.total_quantity} pcs`,
    },
};

const TopPartnersCard = ({ type = 'customer', startDate, endDate, limit = 5 }) => {
    const config = CONFIGS[type];
    const [activeTab, setActiveTab] = useState(config.tabs[0].key);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const Icon = config.icon;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ sort_by: activeTab, limit });
            if (startDate) params.append('start_date', startDate);
            if (endDate)   params.append('end_date', endDate);

            const api = (await import('../../context_or_provider/pos/posApi')).default;
            const res = await api.get(config.endpoint(params.toString()));
            setRows(res.data[config.responseKey] || []);
        } catch (e) {
            console.error(`Top ${type} fetch error:`, e);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [type, activeTab, limit, startDate, endDate, config]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                    <Icon className={`text-${config.accent}-600`} size={16} />
                    Top {type === 'customer' ? 'Customers' : 'Suppliers'}
                </h3>
            </div>

            {/* Tabs — horizontally scrollable */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
                {config.tabs.map(tab => {
                    const active = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-all shrink-0
                                ${active
                                    ? `bg-${config.accent}-600 text-white shadow-sm`
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Rows */}
            <div className="flex-1">
                {loading ? (
                    <div className="flex justify-center py-8"><LoadingSpinner size="sm" /></div>
                ) : rows.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-8">No data found.</p>
                ) : (
                    <div className="space-y-1.5">
                        {rows.map((p, idx) => (
                            <div key={p[config.idKey]}
                                 className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 shrink-0">
                                    {idx + 1}
                                </span>
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                    {p.image ? (
                                        <img src={p.image} alt={p.name}
                                             className="w-full h-full object-cover"
                                             onError={(e) => { e.target.style.display = 'none'; }} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Icon size={12} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-900 truncate">
                                        {p.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 truncate">
                                        {config.secondary(p)}
                                    </p>
                                </div>
                                <span className={`text-xs font-bold text-${config.accent}-600 shrink-0`}>
                                    {config.primaryValue(p, activeTab)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopPartnersCard;