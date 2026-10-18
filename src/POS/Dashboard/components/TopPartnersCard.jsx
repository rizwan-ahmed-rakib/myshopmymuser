import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FaUser, FaTruck } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner'; // path adjust করুন
import api from '../../../context_or_provider/pos/posApi';

const CONFIGS = {
    customer: {
        endpoint: (params) => `/api/sale/customer-transactions/top-customers/?${params}`,
        responseKey: 'customers',
        idKey: 'customer_id',
        icon: FaUser,
        accent: {
            text:   'text-blue-600',
            bg:     'bg-blue-600',
            bgSoft: 'bg-blue-50',
            ring:   'ring-blue-400',
            border: 'border-blue-200',
        },
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
        accent: {
            text:   'text-amber-600',
            bg:     'bg-amber-600',
            bgSoft: 'bg-amber-50',
            ring:   'ring-amber-400',
            border: 'border-amber-200',
        },
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

const storageKey = (type) => `dashboard_top_${type}_tabs`;

const TopPartnersCard = ({ type = 'customer', startDate, endDate, limit = 5 }) => {
    const config = CONFIGS[type];
    const Icon = config.icon;

    // ✅ localStorage থেকে multi-select set load করো
    const [selected, setSelected] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey(type)) || 'null');
            if (Array.isArray(saved) && saved.length > 0) {
                const valid = saved.filter(k => config.tabs.some(t => t.key === k));
                if (valid.length > 0) return valid;
            }
        } catch { /* ignore */ }
        return [config.tabs[0].key];
    });

    const [dataByMetric, setDataByMetric] = useState({});      // { metric: rows[] }
    const [loadingByMetric, setLoadingByMetric] = useState({}); // { metric: bool }
    const fetchedKeysRef = useRef(new Set());                   // এই filter-এ কোনগুলো fetch হয়েছে
    const requestIdRef = useRef(0);                             // stale response guard

    // ✅ Selection persist
    useEffect(() => {
        try { localStorage.setItem(storageKey(type), JSON.stringify(selected)); } catch {}
    }, [selected, type]);

    // ✅ একটি metric fetch
    const fetchMetric = useCallback(async (metric) => {
        setLoadingByMetric(prev => ({ ...prev, [metric]: true }));
        const myReqId = requestIdRef.current;

        try {
            const params = new URLSearchParams({ sort_by: metric, limit });
            if (startDate) params.append('start_date', startDate);
            if (endDate)   params.append('end_date', endDate);

            const res = await api.get(config.endpoint(params.toString()));

            // filter/limit বদলে গেলে stale response বাদ দাও
            if (myReqId !== requestIdRef.current) return;

            setDataByMetric(prev => ({
                ...prev,
                [metric]: res.data[config.responseKey] || [],
            }));
            fetchedKeysRef.current.add(metric);
        } catch (e) {
            if (myReqId !== requestIdRef.current) return;
            console.error(`Top ${type} fetch error for ${metric}:`, e);
            setDataByMetric(prev => ({ ...prev, [metric]: [] }));
        } finally {
            if (myReqId === requestIdRef.current) {
                setLoadingByMetric(prev => ({ ...prev, [metric]: false }));
            }
        }
    }, [type, limit, startDate, endDate, config]);

    // ✅ Filter/limit বদলালে cache clear করে সব selected আবার fetch
    useEffect(() => {
        requestIdRef.current += 1;
        fetchedKeysRef.current = new Set();
        setDataByMetric({});
        setLoadingByMetric({});
        selected.forEach(m => fetchMetric(m));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, limit, type]);

    // ✅ Tab toggle (multi-select)
    const toggleMetric = (key) => {
        setSelected(prev => {
            if (prev.includes(key)) {
                // শেষ একটা থাকতে হবে
                return prev.length > 1 ? prev.filter(k => k !== key) : prev;
            }
            // নতুন যোগ — cache না থাকলে fetch
            if (!fetchedKeysRef.current.has(key)) {
                fetchMetric(key);
            }
            return [...prev, key];
        });
    };

    // ✅ Column grid config
    const cols = useMemo(() => {
        const n = selected.length;
        if (n === 1) return 'grid-cols-1';
        if (n === 2) return 'grid-cols-1 sm:grid-cols-2';
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }, [selected]);

    // ✅ সব columns-এর max row count — balanced minimum height
    const minRows = useMemo(() => {
        return Math.min(limit, 5); // ৫ row ন্যূনতম রাখো
    }, [limit]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
                    <Icon className={config.accent.text} size={16} />
                    Top {type === 'customer' ? 'Customers' : 'Suppliers'}
                    <span className="text-[10px] font-normal text-gray-400 normal-case">
                        ({selected.length} selected)
                    </span>
                </h3>
            </div>

            {/* Multi-select tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
                {config.tabs.map(tab => {
                    const active = selected.includes(tab.key);
                    const isLoading = loadingByMetric[tab.key];
                    return (
                        <button
                            key={tab.key}
                            onClick={() => toggleMetric(tab.key)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-all shrink-0
                                ${active
                                    ? `${config.accent.bgSoft} ${config.accent.text} ring-2 ${config.accent.ring} border-transparent shadow-sm`
                                    : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            {tab.label}
                            {isLoading && active && (
                                <span className="w-2 h-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            )}
                            {active && !isLoading && <span className="text-[8px]">✓</span>}
                        </button>
                    );
                })}
            </div>

            {/* ✅ Fixed min-height + grid — কোনো jump হবে না */}
            <div
                className={`grid gap-3 ${cols} items-start`}
                style={{ minHeight: `${minRows * 44 + 40}px` }}
            >
                {selected.map(metricKey => {
                    const tab = config.tabs.find(t => t.key === metricKey);
                    const rows = dataByMetric[metricKey];
                    const isLoading = loadingByMetric[metricKey] && !rows;
                    const isRefetching = loadingByMetric[metricKey] && !!rows;

                    return (
                        <div
                            key={metricKey}
                            className={`rounded-xl border ${config.accent.border} overflow-hidden bg-white`}
                        >
                            {/* Column header */}
                            <div className={`px-3 py-1.5 ${config.accent.bgSoft} ${config.accent.text} flex items-center justify-between`}>
                                <span className="text-[10px] font-bold uppercase tracking-wide">
                                    {tab?.label}
                                </span>
                                {isRefetching && (
                                    <span className="w-2 h-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>

                            {/* Rows */}
                            {isLoading ? (
                                <div className="flex justify-center py-6">
                                    <LoadingSpinner size="sm" />
                                </div>
                            ) : !rows || rows.length === 0 ? (
                                <p className="text-center text-xs text-gray-400 py-6">
                                    No data
                                </p>
                            ) : (
                                <div className={`divide-y divide-gray-50 transition-opacity duration-200 ${
                                    isRefetching ? 'opacity-50' : 'opacity-100'
                                }`}>
                                    {rows.map((p, idx) => (
                                        <div
                                            key={p[config.idKey]}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                                        >
                                            <span className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-[9px] font-bold text-gray-500 shrink-0">
                                                {idx + 1}
                                            </span>
                                            <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                                {p.image ? (
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Icon size={10} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-semibold text-gray-900 truncate">
                                                    {p.name}
                                                </p>
                                                <p className="text-[9px] text-gray-400 truncate">
                                                    {config.secondary(p)}
                                                </p>
                                            </div>
                                            <span className={`text-[11px] font-bold ${config.accent.text} shrink-0`}>
                                                {config.primaryValue(p, metricKey)}
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

export default TopPartnersCard;



// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { FaUser, FaTruck } from 'react-icons/fa';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import api from '../../../context_or_provider/pos/posApi';
//
// const CONFIGS = {
//     customer: {
//         endpoint: (params) => `/api/sale/customer-transactions/top-customers/?${params}`,
//         responseKey: 'customers',
//         idKey: 'customer_id',
//         icon: FaUser,
//         accent: {
//             text:   'text-blue-600',
//             bgSoft: 'bg-blue-50',
//             border: 'border-blue-200',
//             ring:   'ring-blue-400',
//         },
//         tabs: [
//             { key: 'revenue',   label: 'Revenue'   },
//             { key: 'profit',    label: 'Profit'    },
//             { key: 'frequency', label: 'Frequency' },
//             { key: 'star',      label: 'Star'      },
//             { key: 'due',       label: 'Due Watch' },
//         ],
//         primaryValue: (p, tab) => {
//             if (tab === 'revenue')   return `৳${Number(p.total_revenue).toLocaleString()}`;
//             if (tab === 'profit')    return `৳${Number(p.total_profit).toLocaleString()}`;
//             if (tab === 'frequency') return `${p.invoice_count}×`;
//             if (tab === 'star')      return `score ${p.star_score}`;
//             if (tab === 'due')       return `৳${Number(p.due_amount).toLocaleString()}`;
//         },
//         secondary: (p) => `${p.invoice_count}× · ${p.total_quantity} pcs`,
//     },
//     supplier: {
//         endpoint: (params) => `/api/purchase/supplier-transactions/top-suppliers/?${params}`,
//         responseKey: 'suppliers',
//         idKey: 'supplier_id',
//         icon: FaTruck,
//         accent: {
//             text:   'text-amber-600',
//             bgSoft: 'bg-amber-50',
//             border: 'border-amber-200',
//             ring:   'ring-amber-400',
//         },
//         tabs: [
//             { key: 'value',       label: 'Value'       },
//             { key: 'reliability', label: 'Reliability' },
//             { key: 'frequency',   label: 'Frequency'   },
//             { key: 'star',        label: 'Star'        },
//             { key: 'due',         label: 'Due Owed'    },
//         ],
//         primaryValue: (p, tab) => {
//             if (tab === 'value')       return `৳${Number(p.total_value).toLocaleString()}`;
//             if (tab === 'reliability') return `${p.reliability_pct}%`;
//             if (tab === 'frequency')   return `${p.invoice_count}×`;
//             if (tab === 'star')        return `score ${p.star_score}`;
//             if (tab === 'due')         return `৳${Number(p.due_amount).toLocaleString()}`;
//         },
//         secondary: (p) => p.returned_qty > 0
//             ? `${p.invoice_count}× · ↩ ${p.returned_qty} returned`
//             : `${p.invoice_count}× · ${p.total_quantity} pcs`,
//     },
// };
//
// const storageKey = (type) => `dashboard_top_${type}_tabs`;
//
// // Fixed heights — layout সবসময় একই থাকবে
// const CARD_MIN_HEIGHT   = 440;
// const CONTENT_MIN_HEIGHT = 300;
//
// const TopPartnersCard = ({ type = 'customer', startDate, endDate, limit = 5 }) => {
//     const config = CONFIGS[type];
//     const Icon = config.icon;
//
//     // localStorage থেকে load করো
//     const [selected, setSelected] = useState(() => {
//         try {
//             const saved = JSON.parse(localStorage.getItem(storageKey(type)) || 'null');
//             if (Array.isArray(saved) && saved.length > 0) {
//                 const valid = saved.filter(k => config.tabs.some(t => t.key === k));
//                 if (valid.length > 0) return valid;
//             }
//         } catch { /* ignore */ }
//         return [config.tabs[0].key];
//     });
//
//     const [dataByMetric, setDataByMetric] = useState({});
//     const [loadingByMetric, setLoadingByMetric] = useState({});
//     const requestIdRef = useRef(0);
//
//     // Selection persist
//     useEffect(() => {
//         try { localStorage.setItem(storageKey(type), JSON.stringify(selected)); } catch {}
//     }, [selected, type]);
//
//     // ─── Fetch একটি metric ────────────────────────────────
//     const fetchMetric = useCallback(async (metric, myReqId) => {
//         setLoadingByMetric(prev => ({ ...prev, [metric]: true }));
//         try {
//             const params = new URLSearchParams({ sort_by: metric, limit });
//             if (startDate) params.append('start_date', startDate);
//             if (endDate)   params.append('end_date', endDate);
//
//             const res = await api.get(config.endpoint(params.toString()));
//             if (myReqId !== requestIdRef.current) return; // stale
//
//             setDataByMetric(prev => ({
//                 ...prev,
//                 [metric]: res.data[config.responseKey] || [],
//             }));
//         } catch (e) {
//             if (myReqId !== requestIdRef.current) return;
//             console.error(`Top ${type} [${metric}] error:`, e);
//             setDataByMetric(prev => ({ ...prev, [metric]: [] }));
//         } finally {
//             if (myReqId === requestIdRef.current) {
//                 setLoadingByMetric(prev => ({ ...prev, [metric]: false }));
//             }
//         }
//     }, [type, limit, startDate, endDate, config]);
//
//     // ─── Filter/limit change → clear + refetch all selected ──
//     useEffect(() => {
//         requestIdRef.current += 1;
//         const myReqId = requestIdRef.current;
//
//         setDataByMetric({});
//         setLoadingByMetric({});
//
//         // সব selected একসাথে parallel fetch
//         selected.forEach(m => fetchMetric(m, myReqId));
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [startDate, endDate, limit, type]);
//
//     // ─── Tab toggle (side-effect setSelected এর বাইরে) ────
//     const toggleMetric = (key) => {
//         const isSelected = selected.includes(key);
//
//         if (isSelected) {
//             // শেষ একটা থাকতে হবে
//             if (selected.length === 1) return;
//             setSelected(prev => prev.filter(k => k !== key));
//         } else {
//             setSelected(prev => [...prev, key]);
//
//             // cache miss হলে fetch (setSelected এর বাইরে!)
//             if (dataByMetric[key] === undefined) {
//                 fetchMetric(key, requestIdRef.current);
//             }
//         }
//     };
//
//     // ─── Column class (1/2/3 column responsive) ──────────
//     const colsClass =
//         selected.length === 1 ? 'grid-cols-1' :
//         selected.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
//         'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
//
//     return (
//         <div
//             className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 h-full flex flex-col"
//             style={{ minHeight: CARD_MIN_HEIGHT }}   // ✅ height locked
//         >
//             {/* Header */}
//             <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
//                 <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
//                     <Icon className={config.accent.text} size={16} />
//                     Top {type === 'customer' ? 'Customers' : 'Suppliers'}
//                     <span className="text-[10px] font-normal text-gray-400 normal-case">
//                         ({selected.length} selected)
//                     </span>
//                 </h3>
//             </div>
//
//             {/* Multi-select tabs */}
//             <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1 shrink-0">
//                 {config.tabs.map(tab => {
//                     const active = selected.includes(tab.key);
//                     return (
//                         <button
//                             key={tab.key}
//                             onClick={() => toggleMetric(tab.key)}
//                             className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-all shrink-0 flex items-center gap-1
//                                 ${active
//                                     ? `${config.accent.bgSoft} ${config.accent.text} ring-2 ${config.accent.ring} border-transparent shadow-sm`
//                                     : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
//                                 }`}
//                         >
//                             {tab.label}
//                             {active && <span className="text-[8px]">✓</span>}
//                         </button>
//                     );
//                 })}
//             </div>
//
//             {/* ✅ Content — fixed min-height, grid সবসময় mounted */}
//             <div
//                 className="flex-1"
//                 style={{ minHeight: CONTENT_MIN_HEIGHT }}
//             >
//                 <div className={`grid gap-3 ${colsClass} h-full`}>
//                     {selected.map(metricKey => {
//                         const tab = config.tabs.find(t => t.key === metricKey);
//                         const rows = dataByMetric[metricKey];
//                         const isLoading = loadingByMetric[metricKey] && rows === undefined;
//
//                         return (
//                             <div
//                                 key={metricKey}
//                                 className={`rounded-xl border ${config.accent.border} overflow-hidden bg-white flex flex-col`}
//                                 style={{ minHeight: 200 }}
//                             >
//                                 {/* Column header */}
//                                 <div className={`px-3 py-1.5 ${config.accent.bgSoft} ${config.accent.text} flex items-center justify-between shrink-0`}>
//                                     <span className="text-[10px] font-bold uppercase tracking-wide">
//                                         {tab?.label}
//                                     </span>
//                                     {loadingByMetric[metricKey] && rows !== undefined && (
//                                         <span className="w-2 h-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                                     )}
//                                 </div>
//
//                                 {/* Rows */}
//                                 <div className="flex-1 overflow-hidden">
//                                     {isLoading ? (
//                                         <div className="flex justify-center items-center py-8">
//                                             <LoadingSpinner size="sm" />
//                                         </div>
//                                     ) : !rows || rows.length === 0 ? (
//                                         <p className="text-center text-xs text-gray-400 py-6">
//                                             No data
//                                         </p>
//                                     ) : (
//                                         <div className={`divide-y divide-gray-50 transition-opacity duration-150 ${
//                                             loadingByMetric[metricKey] ? 'opacity-50' : 'opacity-100'
//                                         }`}>
//                                             {rows.map((p, idx) => (
//                                                 <div
//                                                     key={p[config.idKey]}
//                                                     className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
//                                                 >
//                                                     <span className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-[9px] font-bold text-gray-500 shrink-0">
//                                                         {idx + 1}
//                                                     </span>
//                                                     <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0">
//                                                         {p.image ? (
//                                                             <img
//                                                                 src={p.image}
//                                                                 alt={p.name}
//                                                                 className="w-full h-full object-cover"
//                                                                 onError={(e) => { e.target.style.display = 'none'; }}
//                                                             />
//                                                         ) : (
//                                                             <div className="w-full h-full flex items-center justify-center text-gray-300">
//                                                                 <Icon size={10} />
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                     <div className="flex-1 min-w-0">
//                                                         <p className="text-[11px] font-semibold text-gray-900 truncate">
//                                                             {p.name}
//                                                         </p>
//                                                         <p className="text-[9px] text-gray-400 truncate">
//                                                             {config.secondary(p)}
//                                                         </p>
//                                                     </div>
//                                                     <span className={`text-[11px] font-bold ${config.accent.text} shrink-0`}>
//                                                         {config.primaryValue(p, metricKey)}
//                                                     </span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default TopPartnersCard;