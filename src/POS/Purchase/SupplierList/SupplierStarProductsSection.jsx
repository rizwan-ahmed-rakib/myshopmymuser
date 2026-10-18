// src/pages/purchase/supplier/SupplierStarProductsSection.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { posSupplierAPI } from '../../../context_or_provider/pos/Purchase/suppliers/supplierAPI';
import LoadingSpinner from '../../components/LoadingSpinner';

const fmtMoney = (v) => `৳${Number(v || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

const RankIcon = ({ rank }) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500" size={16} />;
    if (rank === 2) return <FaMedal className="text-gray-400" size={16} />;
    if (rank === 3) return <FaMedal className="text-amber-700" size={16} />;
    return <span className="text-[10px] font-bold text-gray-400">#{rank}</span>;
};

const rankBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-white border-yellow-200';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-white border-gray-200';
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-white border-amber-200';
    return 'bg-white border-gray-100';
};

const SupplierStarProductsSection = ({ supplierId, startDate, endDate }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(5);

    const fetchData = useCallback(async () => {
        if (!supplierId) return;
        setLoading(true);
        try {
            const params = { limit };
            if (startDate) params.start_date = startDate;
            if (endDate)   params.end_date = endDate;
            const res = await posSupplierAPI.getStarProducts(supplierId, params);
            setProducts(res.data.products || []);
        } catch (e) {
            console.error('Star products fetch failed:', e);
            setProducts([]);
        } finally { setLoading(false); }
    }, [supplierId, startDate, endDate, limit]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                    ⭐ Star Products
                    <span className="text-[10px] font-normal text-gray-400 normal-case">
                        (volume × frequency / returns)
                    </span>
                </h3>
                <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}
                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value={3}>Top 3</option>
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-8"><LoadingSpinner size="md" /></div>
            ) : products.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-6">No star products found.</p>
            ) : (
                <div className="space-y-2">
                    {products.map((p, idx) => {
                        const rank = idx + 1;
                        return (
                            <div key={p.product_id}
                                 className={`flex items-center gap-3 p-3 rounded-xl border ${rankBg(rank)} hover:shadow-sm transition`}>
                                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                    <RankIcon rank={rank} />
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    {p.product_image ? (
                                        <img src={p.product_image} alt={p.product_name}
                                             className="w-full h-full object-cover"
                                             onError={(e) => { e.target.style.display = 'none'; }} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">N/A</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{p.product_name}</p>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-gray-500 mt-0.5">
                                        <span>{p.invoice_count}× invoices</span>
                                        <span>{p.total_quantity} pcs</span>
                                        {p.returned_qty > 0 && (
                                            <span className="text-red-500">↩ {p.returned_qty} returned ({p.return_ratio_pct}%)</span>
                                        )}
                                        <span className="font-mono text-emerald-600">score {p.performance_score}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-emerald-600">
                                        {fmtMoney(p.total_value)}
                                    </p>
                                    <p className="text-[9px] text-gray-400 uppercase font-bold">value</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SupplierStarProductsSection;