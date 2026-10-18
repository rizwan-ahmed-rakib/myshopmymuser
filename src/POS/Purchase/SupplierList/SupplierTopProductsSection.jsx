// src/pages/purchase/supplier/SupplierTopProductsSection.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    FaFileInvoiceDollar, FaBoxOpen, FaMoneyBillWave, FaHandHoldingUsd,
    FaHourglassHalf, FaTag, FaShoppingCart, FaCheckCircle,
} from 'react-icons/fa';

import LoadingSpinner from '../../components/LoadingSpinner';
import {posSupplierAPI} from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
const METRICS = [
    { key: 'quantity',      label: 'Quantity Bought',  icon: FaBoxOpen,          accent: 'green'   },
    { key: 'invoice_count', label: 'Invoice Count',    icon: FaFileInvoiceDollar,accent: 'blue'    },
    { key: 'net_total',     label: 'Net Total',        icon: FaShoppingCart,     accent: 'indigo'  },
    { key: 'purchase_price',label: 'Purchase Value',   icon: FaMoneyBillWave,    accent: 'amber'   },
    { key: 'paid',          label: 'Paid',             icon: FaCheckCircle,      accent: 'teal'    },
    { key: 'due',           label: 'Due Owed',         icon: FaHandHoldingUsd,   accent: 'red'     },
    { key: 'after_due',     label: 'After Purchase Due', icon: FaHourglassHalf,  accent: 'rose'    },
    { key: 'discount',      label: 'Discount Given',   icon: FaTag,              accent: 'pink'    },
];

const ACCENT = {
    blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    ring: 'ring-blue-400'    },
    green:   { bg: 'bg-green-50',   text: 'text-green-600',   ring: 'ring-green-400'   },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-400' },
    indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  ring: 'ring-indigo-400'  },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   ring: 'ring-amber-400'   },
    teal:    { bg: 'bg-teal-50',    text: 'text-teal-600',    ring: 'ring-teal-400'    },
    red:     { bg: 'bg-red-50',     text: 'text-red-600',     ring: 'ring-red-400'     },
    rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    ring: 'ring-rose-400'    },
    pink:    { bg: 'bg-pink-50',    text: 'text-pink-600',    ring: 'ring-pink-400'    },
};

const fmt = (v) => Number(v || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
const fmtMoney = (v) => `৳${fmt(v)}`;

const getValue = (p, key) => {
    switch (key) {
        case 'quantity':       return `${fmt(p.total_quantity)} pcs`;
        case 'invoice_count':  return `${p.invoice_count}×`;
        case 'net_total':      return fmtMoney(p.total_net_total);
        case 'purchase_price': return fmtMoney(p.total_purchase_price);
        case 'paid':           return fmtMoney(p.total_paid);
        case 'due':            return fmtMoney(p.total_due);
        case 'after_due':      return fmtMoney(p.total_after_due);
        case 'discount':       return fmtMoney(p.total_discount);
        default:               return '—';
    }
};

const SupplierTopProductsSection = ({ supplierId, startDate, endDate }) => {
    const [selected, setSelected] = useState(['quantity']);
    const [limit, setLimit] = useState(5);
    const [dataByMetric, setDataByMetric] = useState({});
    const [loadingByMetric, setLoadingByMetric] = useState({});

    const toggleMetric = (key) => {
        setSelected(prev =>
            prev.includes(key)
                ? prev.length > 1 ? prev.filter(k => k !== key) : prev
                : [...prev, key]
        );
    };

    const fetchMetric = useCallback(async (metric) => {
        if (!supplierId) return;
        setLoadingByMetric(prev => ({ ...prev, [metric]: true }));
        try {
            const params = { sort_by: metric, order: 'desc', limit };
            if (startDate) params.start_date = startDate;
            if (endDate)   params.end_date = endDate;
            const res = await posSupplierAPI.getTopProducts(supplierId, params);
            setDataByMetric(prev => ({ ...prev, [metric]: res.data.products || [] }));
        } catch (e) {
            console.error('Top products fetch failed:', e);
            setDataByMetric(prev => ({ ...prev, [metric]: [] }));
        } finally {
            setLoadingByMetric(prev => ({ ...prev, [metric]: false }));
        }
    }, [supplierId, startDate, endDate, limit]);

    useEffect(() => { selected.forEach(m => fetchMetric(m)); }, [selected, fetchMetric]);
    useEffect(() => { setDataByMetric({}); }, [supplierId, startDate, endDate, limit]);

    const cols = useMemo(() => Math.min(selected.length, 3), [selected]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h3 className="text-base sm:text-lg font-bold text-gray-800">
                    📊 Top Purchased Products
                </h3>
                <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}
                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                </select>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
                {METRICS.map(({ key, label, icon: Icon, accent }) => {
                    const active = selected.includes(key);
                    const a = ACCENT[accent];
                    return (
                        <button key={key} onClick={() => toggleMetric(key)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-semibold whitespace-nowrap transition-all shrink-0
                                ${active ? `${a.bg} ${a.text} border-transparent ring-2 ${a.ring} shadow-sm`
                                         : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                            <Icon size={12} /> {label}
                            {active && <span className="text-[9px] opacity-70">✓</span>}
                        </button>
                    );
                })}
            </div>

            <div className={`grid gap-3 grid-cols-1 ${cols === 2 ? 'md:grid-cols-2' : ''} ${cols >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
                {selected.map(metricKey => {
                    const metric = METRICS.find(m => m.key === metricKey);
                    const rows = dataByMetric[metricKey] || [];
                    const isLoading = loadingByMetric[metricKey];
                    const a = ACCENT[metric.accent];
                    return (
                        <div key={metricKey} className="rounded-xl border border-gray-100 overflow-hidden">
                            <div className={`px-3 py-2 border-b ${a.bg} ${a.text} flex items-center gap-2`}>
                                <metric.icon size={12} />
                                <span className="text-[11px] font-bold uppercase tracking-wide">{metric.label}</span>
                            </div>
                            {isLoading ? (
                                <div className="flex justify-center py-6"><LoadingSpinner size="sm" /></div>
                            ) : rows.length === 0 ? (
                                <p className="text-center text-xs text-gray-400 py-6">No data</p>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {rows.map((p, idx) => (
                                        <div key={p.product_id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 shrink-0">
                                                {idx + 1}
                                            </span>
                                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                {p.product_image ? (
                                                    <img src={p.product_image} alt={p.product_name}
                                                         className="w-full h-full object-cover"
                                                         onError={(e) => { e.target.style.display = 'none'; }} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">N/A</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-gray-900 truncate">{p.product_name}</p>
                                                <p className="text-[9px] text-gray-400 truncate">{p.product_code || '—'}</p>
                                            </div>
                                            <span className={`text-xs font-bold ${a.text} shrink-0`}>
                                                {getValue(p, metricKey)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SupplierTopProductsSection;