import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Package, Tag, Layers, GitCommit, 
    Scale, Maximize, ShieldCheck, Calendar, Info, 
    DollarSign, Target, Activity, Settings, Trash2,
    ShoppingCart, Warehouse, AlertTriangle, ShieldAlert
} from 'lucide-react';
import api from '../../../context_or_provider/pos/posApi';

import UpdateProductModal from "./UpdateProductModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import SuccessModal from "../../components/SuccessModal";

/**
 * ProductDetailsPage - Refactored to use GenericModuleDetails and Backbone branding.
 */
const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const fetchProductDetails = useCallback(async () => {
        try {
            const response = await api.get(`/api/products/product/${id}/`);
            setProduct(response.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    const handleUpdateSuccess = (updatedData) => {
        setProduct(prev => ({ ...prev, ...updatedData }));
        setEditOpen(false);
        setSuccessData(updatedData);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${product?.name}"?`)) return;
        try {
            await posProductAPI.delete(id);
            navigate("/inventory");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete product.");
        }
    };

    const formatCurrency = (val) => `৳${parseFloat(val || 0).toLocaleString()}`;

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
            heroIcon={<Package />}
            statusBadge={
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        Number(product?.stock) > Number(product?.alarm_when_stock_is_lessthanOrEqualto)
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                        {Number(product?.stock) > 0 ? `${product?.stock} In Stock` : 'Out of Stock'}
                    </span>
                    {product?.has_expiry && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-orange-500/20 text-orange-400 border-orange-500/30 flex items-center gap-1.5">
                            <Calendar size={10}/> Expiry Tracked
                        </span>
                    )}
                </div>
            }
            infoItems={[
                { icon: <Layers size={14} />, label: "Category", value: product?.category_name || 'Uncategorized' },
                { icon: <Tag size={14} />, label: "Brand", value: product?.brand_name || 'No Brand' },
                { icon: <Scale size={14} />, label: "Unit", value: product?.unit_name || 'pcs' }
            ]}
            actions={[
                {
                    icon: <Trash2 size={16} />,
                    label: "Delete Product",
                    onClick: handleDelete,
                    hoverColor: "hover:bg-rose-600 hover:text-white"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Financials & Classification */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Pulse */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <DetailsInfoCard 
                            variant="simple" 
                            title="Retail Selling Price" 
                            value={formatCurrency(product?.selling_price)} 
                            subValue="Standard checkout price"
                            icon={<Target />} 
                            color="blue" 
                        />
                        <DetailsInfoCard 
                            variant="simple" 
                            title="Purchase Cost" 
                            value={formatCurrency(product?.purchase_price)} 
                            subValue="Last acquired price"
                            icon={<DollarSign />} 
                            color="emerald" 
                        />
                    </div>

                    {/* Stock & Movement */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10 text-gray-800">
                            <div className="w-2 h-10 bg-blue-500 rounded-full shadow-lg shadow-blue-500/20"></div>
                            Inventory Analysis
                        </h2>

                        <div className="grid gap-4">
                            <DetailsInfoCard 
                                icon={<Warehouse />} 
                                title="Available Stock" 
                                value={`${product?.stock} ${product?.unit_name || 'units'}`} 
                                subValue={`Threshold Alert: ${product?.alarm_when_stock_is_lessthanOrEqualto || 0}`}
                                color="indigo" 
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailsInfoCard 
                                    icon={<ShieldCheck />} 
                                    title="Warranty Status" 
                                    value={product?.warranty_status ? (product.warranty_period_name || "Active Plan") : "Not Applicable"} 
                                    color={product?.warranty_status ? "emerald" : "gray"} 
                                />
                                <DetailsInfoCard 
                                    icon={<AlertTriangle />} 
                                    title="Expiry Policy" 
                                    value={product?.has_expiry ? "Batch Controlled" : "No Expiry Tracked"} 
                                    color={product?.has_expiry ? "orange" : "gray"} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Metadata & Identifiers */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <h2 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                            <Info className="text-blue-400 text-lg"/> Logistics Meta
                        </h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Maximize size={16} className="text-gray-400" />
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Dimension/Size</span>
                                </div>
                                <span className="text-xs font-bold text-gray-700">{product?.size_name || 'Standard'}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <GitCommit size={16} className="text-gray-400" />
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sub-Category</span>
                                </div>
                                <span className="text-xs font-bold text-gray-700">{product?.sub_category_name || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">System ID</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Global SKU</p>
                                    <p className="text-2xl font-black">{product?.product_code || 'PENDING'}</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Inventory UID</p>
                                    <p className="text-base font-black">#PRD-{product?.id}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] border-2 border-blue-400/20 bg-blue-400/5 p-5 rounded-2xl justify-center">
                            <ShoppingCart size={14} /> Synchronized Entry
                        </div>
                    </div>
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
                subtitle="Database records synchronized"
                details={[
                    { label: "Product Name", value: successData?.name },
                    { label: "SKU / Code", value: successData?.product_code },
                    { label: "Update Time", value: new Date().toLocaleTimeString() }
                ]}
            />
        </GenericModuleDetails>
    );
};

export default ProductDetailsPage;
