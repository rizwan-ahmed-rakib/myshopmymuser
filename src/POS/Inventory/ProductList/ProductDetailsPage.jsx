// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//     Package, Tag, Layers, GitCommit,
//     Scale, Maximize, ShieldCheck, Calendar, Info,
//     DollarSign, Target, Activity, Settings, Trash2,
//     ShoppingCart, Warehouse, AlertTriangle, ShieldAlert
// } from 'lucide-react';
// import api from '../../../context_or_provider/pos/posApi';
//
// import UpdateProductModal from "./UpdateProductModal";
// import GenericModuleDetails from "../../components/GenericModuleDetails";
// import DetailsInfoCard from "../../components/DetailsInfoCard";
// import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
// import SuccessModal from "../../components/SuccessModal";
//
// /**
//  * ProductDetailsPage - Refactored to use GenericModuleDetails and Backbone branding.
//  */
// const ProductDetailsPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [editOpen, setEditOpen] = useState(false);
//     const [successData, setSuccessData] = useState(null);
//
//     const fetchProductDetails = useCallback(async () => {
//         try {
//             const response = await api.get(`/api/products/product/${id}/`);
//             setProduct(response.data);
//         } catch (error) {
//             console.error("Error fetching product details:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [id]);
//
//     useEffect(() => {
//         fetchProductDetails();
//     }, [fetchProductDetails]);
//
//     const handleUpdateSuccess = (updatedData) => {
//         setProduct(prev => ({ ...prev, ...updatedData }));
//         setEditOpen(false);
//         setSuccessData(updatedData);
//     };
//
//     const handleDelete = async () => {
//         if (!window.confirm(`Are you sure you want to delete "${product?.name}"?`)) return;
//         try {
//             await posProductAPI.delete(id);
//             navigate("/inventory");
//         } catch (error) {
//             console.error("Delete error:", error);
//             alert("Failed to delete product.");
//         }
//     };
//
//     const formatCurrency = (val) => `৳${parseFloat(val || 0).toLocaleString()}`;
//
//     return (
//         <GenericModuleDetails
//             title="Product Details"
//             subtitle={product?.product_code || "No SKU"}
//             image={product?.image}
//             imageAlt={product?.name}
//             recordId={product?.id}
//             isLoading={loading}
//             onEdit={() => setEditOpen(true)}
//             accentColor="blue"
//             heroIcon={<Package />}
//             statusBadge={
//                 <div className="flex gap-2">
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
//                         Number(product?.stock) > Number(product?.alarm_when_stock_is_lessthanOrEqualto)
//                             ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
//                             : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
//                     }`}>
//                         {Number(product?.stock) > 0 ? `${product?.stock} In Stock` : 'Out of Stock'}
//                     </span>
//                     {product?.has_expiry && (
//                         <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-orange-500/20 text-orange-400 border-orange-500/30 flex items-center gap-1.5">
//                             <Calendar size={10}/> Expiry Tracked
//                         </span>
//                     )}
//                 </div>
//             }
//             infoItems={[
//                 { icon: <Layers size={14} />, label: "Category", value: product?.category_name || 'Uncategorized' },
//                 { icon: <Tag size={14} />, label: "Brand", value: product?.brand_name || 'No Brand' },
//                 { icon: <Scale size={14} />, label: "Unit", value: product?.unit_name || 'pcs' }
//             ]}
//             actions={[
//                 {
//                     icon: <Trash2 size={16} />,
//                     label: "Delete Product",
//                     onClick: handleDelete,
//                     hoverColor: "hover:bg-rose-600 hover:text-white"
//                 }
//             ]}
//         >
//             <div className="grid lg:grid-cols-3 gap-8">
//                 {/* Left: Financials & Classification */}
//                 <div className="lg:col-span-2 space-y-8">
//                     {/* Financial Pulse */}
//                     <div className="grid sm:grid-cols-2 gap-6">
//                         <DetailsInfoCard
//                             variant="simple"
//                             title="Retail Selling Price"
//                             value={formatCurrency(product?.selling_price)}
//                             subValue="Standard checkout price"
//                             icon={<Target />}
//                             color="blue"
//                         />
//                         <DetailsInfoCard
//                             variant="simple"
//                             title="Purchase Cost"
//                             value={formatCurrency(product?.purchase_price)}
//                             subValue="Last acquired price"
//                             icon={<DollarSign />}
//                             color="emerald"
//                         />
//                     </div>
//
//                     {/* Stock & Movement */}
//                     <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
//                         <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10 text-gray-800">
//                             <div className="w-2 h-10 bg-blue-500 rounded-full shadow-lg shadow-blue-500/20"></div>
//                             Inventory Analysis
//                         </h2>
//
//                         <div className="grid gap-4">
//                             <DetailsInfoCard
//                                 icon={<Warehouse />}
//                                 title="Available Stock"
//                                 value={`${product?.stock} ${product?.unit_name || 'units'}`}
//                                 subValue={`Threshold Alert: ${product?.alarm_when_stock_is_lessthanOrEqualto || 0}`}
//                                 color="indigo"
//                             />
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <DetailsInfoCard
//                                     icon={<ShieldCheck />}
//                                     title="Warranty Status"
//                                     value={product?.warranty_status ? (product.warranty_period_name || "Active Plan") : "Not Applicable"}
//                                     color={product?.warranty_status ? "emerald" : "gray"}
//                                 />
//                                 <DetailsInfoCard
//                                     icon={<AlertTriangle />}
//                                     title="Expiry Policy"
//                                     value={product?.has_expiry ? "Batch Controlled" : "No Expiry Tracked"}
//                                     color={product?.has_expiry ? "orange" : "gray"}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Right: Metadata & Identifiers */}
//                 <div className="space-y-8">
//                     <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
//                         <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
//                             <Info className="text-blue-400 text-lg"/> Logistics Meta
//                         </h2>
//                         <div className="space-y-6">
//                             <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
//                                 <div className="flex items-center gap-3">
//                                     <Maximize size={16} className="text-gray-400" />
//                                     <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Dimension/Size</span>
//                                 </div>
//                                 <span className="text-xs font-bold text-gray-700">{product?.size_name || 'Standard'}</span>
//                             </div>
//                             <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
//                                 <div className="flex items-center gap-3">
//                                     <GitCommit size={16} className="text-gray-400" />
//                                     <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sub-Category</span>
//                                 </div>
//                                 <span className="text-xs font-bold text-gray-700">{product?.sub_category_name || 'N/A'}</span>
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
//                         <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">System ID</h2>
//                         <div className="space-y-8">
//                             <div className="flex gap-5">
//                                 <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
//                                 <div>
//                                     <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Global SKU</p>
//                                     <p className="text-2xl font-black">{product?.product_code || 'PENDING'}</p>
//                                 </div>
//                             </div>
//                             <div className="flex gap-5">
//                                 <div className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
//                                 <div>
//                                     <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Inventory UID</p>
//                                     <p className="text-base font-black">#PRD-{product?.id}</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="mt-10 flex items-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] border-2 border-blue-400/20 bg-blue-400/5 p-5 rounded-2xl justify-center">
//                             <ShoppingCart size={14} /> Synchronized Entry
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {editOpen && (
//                 <UpdateProductModal
//                     isOpen={editOpen}
//                     onClose={() => setEditOpen(false)}
//                     onSuccess={handleUpdateSuccess}
//                     productData={product}
//                 />
//             )}
//
//             <SuccessModal
//                 isOpen={!!successData}
//                 onClose={() => setSuccessData(null)}
//                 title="Product Updated"
//                 subtitle="Database records synchronized"
//                 details={[
//                     { label: "Product Name", value: successData?.name },
//                     { label: "SKU / Code", value: successData?.product_code },
//                     { label: "Update Time", value: new Date().toLocaleTimeString() }
//                 ]}
//             />
//         </GenericModuleDetails>
//     );
// };
//
// export default ProductDetailsPage;


import React, {useState, useEffect, useCallback, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
    Package, Tag, Layers, ShieldCheck, Calendar, Info, DollarSign,
    Target, ShoppingCart, Warehouse, AlertTriangle, Trash2,
    Zap, Clock, Users, Truck, Phone, Search, RefreshCw, X,
    TrendingUp, TrendingDown, Flame, Activity, BarChart3, Maximize,
    ChevronRight, CalendarRange
} from 'lucide-react';
import AsyncSelect from "react-select/async";
import api from '../../../context_or_provider/pos/posApi';

import UpdateProductModal from "./UpdateProductModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import {posProductAPI} from "../../../context_or_provider/pos/products/productAPI";
import {posCustomerAPI} from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";
import {posSupplierAPI} from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import {posReportsAPI} from "../../../context_or_provider/pos/reports/reportsAPI";
import SuccessModal from "../../components/SuccessModal";

// ═══════════════════════════════════════════════════════════
// 🎨 Helper — Currency format
// ═══════════════════════════════════════════════════════════
const fmt = (v) => `৳${parseFloat(v || 0).toLocaleString(undefined, {maximumFractionDigits: 2})}`;
const fmtNum = (v) => parseFloat(v || 0).toLocaleString();

// ═══════════════════════════════════════════════════════════
// 🎨 KPI Card
// ═══════════════════════════════════════════════════════════
const KPICard = ({label, value, subvalue, icon: Icon, color = 'blue', large = false}) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        gray: 'bg-gray-50 text-gray-600 border-gray-100',
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${colors[color]}`}>
                    <Icon size={large ? 20 : 16}/>
                </div>
            </div>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{label}</p>
            <p className={`${large ? 'text-3xl' : 'text-xl'} font-black text-gray-900 font-mono`}>{value}</p>
            {subvalue && <p className="text-[10px] text-gray-400 mt-1">{subvalue}</p>}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// 🎨 Phone Link — Click to call
// ═══════════════════════════════════════════════════════════
const PhoneLink = ({phone}) => {
    if (!phone) return <span className="text-gray-400 text-xs">No phone</span>;
    return (
        <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-xs hover:underline"
        >
            <Phone size={11}/> {phone}
        </a>
    );
};

// ═══════════════════════════════════════════════════════════
// 🎨 Loading spinner
// ═══════════════════════════════════════════════════════════
const Loader = ({label = "Loading..."}) => (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"/>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</p>
    </div>
);

// ═══════════════════════════════════════════════════════════
// 🎨 Empty state
// ═══════════════════════════════════════════════════════════
const EmptyState = ({icon: Icon = Package, title, subtitle}) => (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <Icon size={28} className="text-gray-300"/>
        </div>
        <h3 className="font-bold text-gray-700">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 max-w-md">{subtitle}</p>}
    </div>
);

// ═══════════════════════════════════════════════════════════
// 🎨 VELOCITY PANEL — Prediction
// ═══════════════════════════════════════════════════════════
const VelocityPanel = ({productId}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [targetQty, setTargetQty] = useState(100);
    const [sliderVal, setSliderVal] = useState(100);

    const load = useCallback(async (qty = 100) => {
        setLoading(true);
        setError(null);
        try {
            const res = await posReportsAPI.getProductVelocity(productId, {target_qty: qty});
            setData(res.data);
        } catch (err) {
            setError(err.message || 'Failed to load velocity');
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        load(100);
    }, [load]);

    const handleApply = () => {
        setTargetQty(sliderVal);
        load(sliderVal);
    };

    if (loading && !data) return <Loader label="Calculating velocity..."/>;
    if (error) return <EmptyState icon={AlertTriangle} title="Error" subtitle={error}/>;
    if (!data) return <EmptyState title="No data"/>;

    if (!data.since_purchase?.daily_sale_rate) {
        return (
            <EmptyState
                icon={Activity}
                title="No sales data yet"
                subtitle="This product hasn't been sold yet. Velocity can be calculated after first sale."
            />
        );
    }

    const sp = data.since_purchase;

    return (
        <div className="space-y-6">
            {/* Slider */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black text-blue-900 uppercase tracking-widest">
                        Target Quantity
                    </label>
                    <span className="text-2xl font-black text-blue-600 font-mono">{sliderVal}</span>
                </div>
                <input
                    type="range" min="10" max="5000" step="10"
                    value={sliderVal}
                    onChange={(e) => setSliderVal(Number(e.target.value))}
                    onMouseUp={handleApply}
                    onTouchEnd={handleApply}
                    className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-blue-400 font-bold mt-1">
                    <span>10</span><span>1000</span><span>5000</span>
                </div>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 text-center shadow-md">
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-2">
                        Estimated Days to Sell {targetQty} units
                    </p>
                    <p className="text-5xl font-black text-blue-700 font-mono">
                        {sp.days_to_sell_target ?? '—'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-semibold">days</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">
                        Current Daily Rate
                    </p>
                    <p className="text-4xl font-black text-gray-800 font-mono">
                        {sp.daily_sale_rate}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 font-semibold">units / day</p>
                    <p className="text-[10px] text-gray-400 mt-3">
                        Since first purchase · {sp.days_active} days ago
                    </p>
                </div>
            </div>

            {/* Insight */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-2 items-start">
                    <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5"/>
                    <p className="text-xs text-amber-800 leading-relaxed">
                        <strong>Method:</strong> Based on <strong>{sp.days_active} days</strong> of
                        running business since first purchase ({data.first_purchase?.split('T')[0]}).
                        Sold <strong>{data.total_units_sold}</strong> units total.
                    </p>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// 🎨 TIMELINE PANEL — Performance classification
// ═══════════════════════════════════════════════════════════
const TimelinePanel = ({productId}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState('monthly');
    const [lastN, setLastN] = useState(12);

    const load = useCallback(async (p, n) => {
        setLoading(true);
        try {
            const res = await posReportsAPI.getProductTimeline(productId, {period: p, last: n});
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        load(period, lastN);
    }, [load, period, lastN]);

    if (loading && !data) return <Loader label="Analyzing timeline..."/>;
    if (!data || !data.timeline?.length) {
        return <EmptyState icon={BarChart3} title="No timeline data"/>;
    }

    const maxRate = Math.max(...data.timeline.map(t => t.daily_rate), 0.01);
    const badgeColors = {
        best: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
        above: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        average: 'bg-amber-100 text-amber-700 border-amber-300',
        below: 'bg-orange-100 text-orange-700 border-orange-300',
        low: 'bg-rose-100 text-rose-700 border-rose-300',
        dead: 'bg-gray-200 text-gray-500 border-gray-300',
    };

    return (
        <div className="space-y-5">
            {/* Period selector */}
            <div className="flex flex-wrap gap-2">
                {['daily', 'weekly', 'monthly', 'yearly'].map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                            period === p
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {p}
                    </button>
                ))}
                <select
                    value={lastN}
                    onChange={(e) => setLastN(Number(e.target.value))}
                    className="ml-auto px-3 py-1.5 rounded-lg text-[10px] font-bold border border-gray-200 outline-none"
                >
                    <option value={6}>Last 6</option>
                    <option value={12}>Last 12</option>
                    <option value={24}>Last 24</option>
                </select>
            </div>

            {/* Summary badges */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                    <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">🔥 Best</p>
                    <p className="text-2xl font-black text-emerald-700">{data.summary.best_periods?.length || 0}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                    <p className="text-[9px] font-black text-amber-600 uppercase mb-1">🟢 Above Avg</p>
                    <p className="text-2xl font-black text-amber-700">{data.summary.above_avg_count || 0}</p>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-1">⚫ Dead</p>
                    <p className="text-2xl font-black text-gray-600">{data.summary.dead_count || 0}</p>
                </div>
            </div>

            {/* Timeline rows */}
            <div className="space-y-1.5">
                {data.timeline.map((row, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <span className="w-20 text-[10px] font-bold text-gray-500 font-mono flex-shrink-0">
                            {row.period_start}
                        </span>
                        <div className="flex-1 h-5 bg-gray-100 rounded-md overflow-hidden relative">
                            <div
                                className={`h-full rounded-md transition-all ${
                                    row.classification === 'dead' ? 'bg-gray-300' :
                                        row.classification === 'best' ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                                            row.classification === 'above' ? 'bg-emerald-400' :
                                                row.classification === 'average' ? 'bg-amber-400' :
                                                    row.classification === 'below' ? 'bg-orange-400' :
                                                        'bg-rose-400'
                                }`}
                                style={{width: `${Math.max((row.daily_rate / maxRate) * 100, 3)}%`}}
                            />
                        </div>
                        <span className="w-14 text-right text-[10px] font-black font-mono text-gray-700">
                            {row.units} u
                        </span>
                        <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border whitespace-nowrap ${
                                badgeColors[row.classification] || badgeColors.average
                            }`}
                        >
                            {row.badge} {row.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// 🎨 DAILY SALES PANEL — Bar chart
// ═══════════════════════════════════════════════════════════
const DailySalesPanel = ({productId}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState(30);

    const load = useCallback(async (d) => {
        setLoading(true);
        try {
            const res = await posReportsAPI.getProductDailySales(productId, {days: d});
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        load(days);
    }, [load, days]);

    if (loading && !data) return <Loader label="Loading daily sales..."/>;
    if (!data?.daily_data?.length) return <EmptyState icon={BarChart3} title="No sales data"/>;

    const maxUnits = Math.max(...data.daily_data.map(d => d.units_sold), 1);
    const summary = data.summary;

    return (
        <div className="space-y-5">
            {/* Period selector */}
            <div className="flex gap-2">
                {[7, 30, 90, 180].map(d => (
                    <button
                        key={d}
                        onClick={() => setDays(d)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            days === d ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {d}d
                    </button>
                ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-2">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Total</p>
                    <p className="text-lg font-black text-gray-900 font-mono">{summary.total_units}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Active</p>
                    <p className="text-lg font-black text-emerald-700 font-mono">{summary.days_with_sales}</p>
                </div>
                <div className="bg-rose-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] font-black text-rose-600 uppercase mb-1">Zero</p>
                    <p className="text-lg font-black text-rose-700 font-mono">{summary.days_without_sales}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-[9px] font-black text-blue-600 uppercase mb-1">Avg/Day</p>
                    <p className="text-lg font-black text-blue-700 font-mono">{summary.avg_units_per_day}</p>
                </div>
            </div>

            {/* Bar chart */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-end gap-0.5 h-40 overflow-x-auto pb-2" style={{minWidth: '100%'}}>
                    {data.daily_data.map((row, i) => {
                        const heightPct = (row.units_sold / maxUnits) * 100;
                        return (
                            <div
                                key={i}
                                className="flex flex-col items-center flex-1 min-w-[6px] group relative"
                                title={`${row.date}: ${row.units_sold} units · ${fmt(row.revenue)}`}
                            >
                                <div
                                    className={`w-full rounded-t transition-all ${
                                        row.units_sold > 0
                                            ? 'bg-gradient-to-t from-blue-500 to-blue-400 group-hover:from-blue-600'
                                            : 'bg-gray-100'
                                    }`}
                                    style={{
                                        height: `${Math.max(heightPct, 3)}%`,
                                        minHeight: row.units_sold > 0 ? '4px' : '2px'
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-2 px-1">
                    <span>{data.start_date}</span>
                    <span>{data.end_date}</span>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// 🎨 TOP PARTNERS PANEL — Customers / Suppliers
// ═══════════════════════════════════════════════════════════
const TopPartnersPanel = ({productId}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [entity, setEntity] = useState('customer');
    const [limit, setLimit] = useState(10);

    const load = useCallback(async (e, l) => {
        setLoading(true);
        try {
            const res = await posReportsAPI.getProductTopBuyers(productId, {entity: e, limit: l});
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        load(entity, limit);
    }, [load, entity, limit]);

    if (loading && !data) return <Loader label="Loading partners..."/>;
    if (!data?.results?.length) {
        return <EmptyState icon={Users} title="No partners yet" subtitle="No customers or suppliers on record."/>;
    }

    return (
        <div className="space-y-5">
            {/* Toggle + limit */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setEntity('customer')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider ${
                        entity === 'customer'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <Users size={12}/> Customers
                </button>
                <button
                    onClick={() => setEntity('supplier')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider ${
                        entity === 'supplier'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <Truck size={12}/> Suppliers
                </button>
                <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="ml-auto px-3 py-2 rounded-lg text-xs font-bold border border-gray-200"
                >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                </select>
            </div>

            {/* List */}
            <div className="space-y-2">
                {data.results.map((r, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"
                    >
                        {/* Rank badge */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                            i === 0 ? 'bg-amber-400 text-white' :
                                i === 1 ? 'bg-gray-300 text-white' :
                                    i === 2 ? 'bg-amber-600 text-white' :
                                        'bg-gray-100 text-gray-500'
                        }`}>
                            {i + 1}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-gray-800 truncate">
                                    {r.name}
                                    {r.is_walk_in && (
                                        <span
                                            className="ml-1 text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-black uppercase">
                                            Walk-in
                                        </span>
                                    )}
                                </p>
                            </div>
                            <PhoneLink phone={r.phone}/>
                        </div>

                        {/* Metrics */}
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-black text-gray-800 font-mono">
                                {fmtNum(r.total_units)} units
                            </p>
                            <p className="text-[10px] text-emerald-600 font-bold">
                                {entity === 'customer'
                                    ? fmt(r.total_revenue)
                                    : fmt(r.total_value)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// 🎨 SEARCH ENTITY PANEL — Search by name/phone + detail
// ═══════════════════════════════════════════════════════════
const SearchEntityPanel = ({productId}) => {
    const [entityType, setEntityType] = useState('customer');
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadCustomerOptions = async (input) => {
        if (!input || input.length < 2) return [];
        try {
            const res = await posCustomerAPI.search(input);
            const arr = res.data?.results || res.data || [];
            return arr.slice(0, 20).map(c => ({
                value: c.id,
                label: `${c.name}${c.phone ? ` · ${c.phone}` : ''}`,
                phone: c.phone,
                name: c.name,
            }));
        } catch {
            return [];
        }
    };

    const loadSupplierOptions = async (input) => {
        if (!input || input.length < 2) return [];
        try {
            const res = await posSupplierAPI.search(input);
            const arr = res.data?.results || res.data || [];
            return arr.slice(0, 20).map(s => ({
                value: s.id,
                label: `${s.name}${s.phone ? ` · ${s.phone}` : ''}`,
                phone: s.phone,
                name: s.name,
            }));
        } catch {
            return [];
        }
    };

    const handleSelect = async (opt) => {
        setSelected(opt);
        if (!opt) {
            setDetail(null);
            return;
        }
        setLoading(true);
        try {
            const res = await posReportsAPI.getProductByEntity(productId, {
                entity: entityType,
                entity_id: opt.value,
            });
            setDetail(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const switchEntity = (type) => {
        setEntityType(type);
        setSelected(null);
        setDetail(null);
    };

    return (
        <div className="space-y-5">
            {/* Toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => switchEntity('customer')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        entityType === 'customer'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    <Users size={12}/> Customer
                </button>
                <button
                    onClick={() => switchEntity('supplier')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        entityType === 'supplier'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    <Truck size={12}/> Supplier
                </button>
            </div>

            {/* Search */}
            <AsyncSelect
                key={entityType}
                cacheOptions
                defaultOptions={false}
                loadOptions={entityType === 'customer' ? loadCustomerOptions : loadSupplierOptions}
                onChange={handleSelect}
                value={selected}
                placeholder={`Search ${entityType} by name or phone...`}
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: base => ({...base, zIndex: 9999}),
                    control: (base) => ({...base, borderRadius: '12px', padding: '2px', borderColor: '#e5e7eb'}),
                }}
            />

            {loading && <Loader label="Loading details..."/>}

            {detail && !loading && (
                <div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 space-y-4">
                    <div>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">
                            {entityType === 'customer' ? 'Customer' : 'Supplier'} Detail
                        </p>
                        <h3 className="text-lg font-black text-gray-900">{selected?.name}</h3>
                        <PhoneLink phone={selected?.phone}/>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200">
                        <div>
                            <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">
                                {entityType === 'customer' ? 'Units Bought' : 'Units Supplied'}
                            </p>
                            <p className="text-2xl font-black text-blue-700 font-mono">
                                {fmtNum(detail.stats?.total_units || 0)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">
                                {entityType === 'customer' ? 'Total Revenue' : 'Total Value'}
                            </p>
                            <p className="text-2xl font-black text-blue-700 font-mono">
                                {fmt(detail.stats?.total_revenue || detail.stats?.total_value || 0)}
                            </p>
                        </div>
                        {entityType === 'customer' && (
                            <div>
                                <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Profit</p>
                                <p className="text-lg font-black text-emerald-600 font-mono">
                                    {fmt(detail.stats?.total_profit || 0)}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">
                                {entityType === 'customer' ? 'Orders' : 'Invoices'}
                            </p>
                            <p className="text-lg font-black text-gray-700 font-mono">
                                {detail.stats?.order_count || detail.stats?.invoice_count || 0}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!detail && !loading && (
                <EmptyState
                    icon={Search}
                    title="Search to begin"
                    subtitle={`Type a ${entityType} name or phone number to see their activity with this product`}
                />
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
// 🎨 MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
const ProductDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [profit, setProfit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [activeTab, setActiveTab] = useState('velocity');

    // Fetch product + profit (DEFAULT LOAD — 2 API calls)
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [prodRes, profitRes] = await Promise.all([
                posProductAPI.getById(id),
                posReportsAPI.getProductProfitDetail(id).catch(() => ({data: null})),
            ]);
            setProduct(prodRes.data);
            setProfit(profitRes.data);
        } catch (err) {
            console.error('Load failed:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleUpdateSuccess = (updatedData) => {
        setProduct(prev => ({...prev, ...updatedData}));
        setEditOpen(false);
        setSuccessData(updatedData);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${product?.name}"?`)) return;
        try {
            await posProductAPI.delete(id);
            navigate("/inventory");
        } catch {
            alert("Delete failed");
        }
    };

    // Analysis tabs definition
    const TABS = [
        {key: 'velocity', label: '⚡ Velocity', icon: Zap},
        {key: 'timeline', label: '📅 Timeline', icon: CalendarRange},
        {key: 'daily', label: '📊 Daily Sales', icon: BarChart3},
        {key: 'partners', label: '🏆 Top Partners', icon: Users},
        {key: 'search', label: '🔍 Search', icon: Search},
    ];

    return (
        <GenericModuleDetails
            title="Product Details"
            subtitle={product?.product_code || "No SKU"}
            image={product?.image}
            imageAlt={product?.name}
            recordId={product?.id}
            isLoading={loading}
            onEdit={() => setEditOpen(true)}
            accentColor="blue"
            heroIcon={<Package/>}
            statusBadge={
                <div className="flex gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        Number(product?.stock) > Number(product?.alarm_when_stock_is_lessthanOrEqualto)
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                        {product?.stock || 0} In Stock
                    </span>
                    {product?.has_expiry && (
                        <span
                            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-orange-500/20 text-orange-400 border-orange-500/30 flex items-center gap-1.5">
                            <Calendar size={10}/> Expiry
                        </span>
                    )}
                </div>
            }
            infoItems={[
                {icon: <Layers size={14}/>, label: "Category", value: product?.category_name || 'Uncategorized'},
                {icon: <Tag size={14}/>, label: "Brand", value: product?.brand_name || 'No Brand'},
                {icon: <ShieldCheck size={14}/>, label: "Unit", value: product?.unit_name || 'pcs'},
            ]}
            actions={[
                {
                    icon: <Trash2 size={16}/>,
                    label: "Delete",
                    onClick: handleDelete,
                    hoverColor: "hover:bg-rose-600 hover:text-white"
                },
            ]}
        >
            <div className="space-y-8">

                {/* ═══ KPI Cards — DEFAULT LOAD (only ProductProfit) ═══ */}
                <div>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"/>
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                            Financial Snapshot · All-Time
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard
                            label="Net Profit"
                            value={fmt(profit?.total_net_profit)}
                            subvalue={profit?.average_profit_percentage_on_total_net_sale_value
                                ? `${profit.average_profit_percentage_on_total_net_sale_value}% margin`
                                : '—'}
                            icon={TrendingUp}
                            color="emerald"
                            large
                        />
                        <KPICard
                            label="Total Revenue"
                            value={fmt(profit?.total_revenue)}
                            subvalue={`${fmtNum(profit?.total_units_sold)} units sold`}
                            icon={DollarSign}
                            color="blue"
                            large
                        />
                        <KPICard
                            label="Total Cost"
                            value={fmt(profit?.total_cost)}
                            subvalue={`${profit?.total_sales_count || 0} orders`}
                            icon={ShoppingCart}
                            color="amber"
                            large
                        />
                        <KPICard
                            label="Outstanding Due"
                            value={fmt(profit?.total_after_sale_remaining_due)}
                            subvalue={`Paid: ${fmt(profit?.total_paid)}`}
                            icon={Target}
                            color="rose"
                            large
                        />
                    </div>
                </div>

                {/* ═══ ANALYSIS TABS — On-Demand ═══ */}
                <div>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full"/>
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                            Deep Analysis · On-Demand
                        </h2>
                    </div>

                    {/* Tab nav */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {TABS.map(t => {
                            const Icon = t.icon;
                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                        activeTab === t.key
                                            ? 'bg-gray-900 text-white shadow-lg'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                >
                                    <Icon size={14}/> {t.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab content — lazy load per tab */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
                        {activeTab === 'velocity' && <VelocityPanel productId={id}/>}
                        {activeTab === 'timeline' && <TimelinePanel productId={id}/>}
                        {activeTab === 'daily' && <DailySalesPanel productId={id}/>}
                        {activeTab === 'partners' && <TopPartnersPanel productId={id}/>}
                        {activeTab === 'search' && <SearchEntityPanel productId={id}/>}
                    </div>
                </div>

                {/* ═══ Basic Info Grid ═══ */}
                <div className="grid md:grid-cols-2 gap-4">
                    <DetailsInfoCard
                        icon={<Warehouse/>}
                        title="Current Stock"
                        value={`${product?.stock || 0} ${product?.unit_name || 'units'}`}
                        subValue={`Alert at ${product?.alarm_when_stock_is_lessthanOrEqualto || 0}`}
                        color="indigo"
                    />
                    <DetailsInfoCard
                        icon={<ShieldCheck/>}
                        title="Warranty"
                        value={product?.warranty_status ? (product.warranty_period_name || "Active") : "Not Applicable"}
                        color={product?.warranty_status ? "emerald" : "gray"}
                    />
                </div>
            </div>

            {editOpen && (
                <UpdateProductModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSuccess={handleUpdateSuccess}
                    productData={product}
                />
            )}

            <SuccessModal
                isOpen={!!successData}
                onClose={() => setSuccessData(null)}
                title="Product Updated"
                subtitle="Database synchronized"
                details={[
                    {label: "Name", value: successData?.name},
                    {label: "Code", value: successData?.product_code},
                    {label: "Time", value: new Date().toLocaleTimeString()},
                ]}
            />
        </GenericModuleDetails>
    );
};

export default ProductDetailsPage;
