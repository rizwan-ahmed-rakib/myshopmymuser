// src/pages/purchase/supplier/SupplierRiskProductsSection.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FaExclamationTriangle, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import { posSupplierAPI } from '../../../context_or_provider/pos/Purchase/suppliers/supplierAPI';
import LoadingSpinner from '../../components/LoadingSpinner';

const fmtMoney = (v) => `৳${Number(v || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

const SEVERITY = {
    high:   { label: 'High Risk', bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     icon: FaExclamationTriangle },
    medium: { label: 'Monitor',   bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   icon: FaInfoCircle },
    low:    { label: 'Low Risk',  bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: FaShieldAlt },
};

const SupplierRiskProductsSection = ({ supplierId, startDate, endDate }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);

    const fetchData = useCallback(async () => {
        if (!supplierId) return;
        setLoading(true);
        try {
            const params = { limit };
            if (startDate) params.start_date = startDate;
            if (endDate)   params.end_date = endDate;
            const res = await posSupplierAPI.getRiskProducts(supplierId, params);
            setProducts(res.data.products || []);
        } catch (e) {
            console.error('Risk products fetch failed:', e);
            setProducts([]);
        } finally { setLoading(false); }
    }, [supplierId, startDate, endDate, limit]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                    ⚠️ Risk Products
                    <span className="text-[10px] font-normal text-gray-400 normal-case">
                        (returns + dues + discount + staleness)
                    </span>
                </h3>
                <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}
                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-8"><LoadingSpinner size="md" /></div>
            ) : products.length === 0 ? (
                <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-xl">
                    <FaShieldAlt className="text-emerald-600" />
                    <span className="text-sm text-emerald-700 font-medium">
                        No risky products detected for this supplier. 🎉
                    </span>
                </div>
            ) : (
                <div className="space-y-2">
                    {products.map((p) => {
                        const sev = SEVERITY[p.severity] || SEVERITY.low;
                        const SevIcon = sev.icon;
                        return (
                            <div key={p.product_id}
                                 className={`flex items-center gap-3 p-3 rounded-xl border ${sev.bg} ${sev.border}`}>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-100">
                                    {p.product_image ? (
                                        <img src={p.product_image} alt={p.product_name}
                                             className="w-full h-full object-cover"
                                             onError={(e) => { e.target.style.display = 'none'; }} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">N/A</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{p.product_name}</p>
                                        <span className={`flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${sev.bg} ${sev.text} border ${sev.border}`}>
                                            <SevIcon size={8} /> {sev.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-gray-600 mt-0.5">
                                        {p.return_ratio_pct > 0 && <span className="text-red-600">↩ {p.return_ratio_pct}% returned</span>}
                                        {p.due_ratio_pct > 0   && <span className="text-amber-600">⏳ {p.due_ratio_pct}% due</span>}
                                        {p.discount_ratio_pct > 0 && <span className="text-pink-600">🏷 {p.discount_ratio_pct}% disc</span>}
                                        <span className="text-gray-400">{p.days_since_last_purchase}d since last purchase</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className={`text-sm font-bold ${sev.text}`}>{p.risk_score}</p>
                                    <p className="text-[9px] text-gray-400 uppercase font-bold">risk</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SupplierRiskProductsSection;