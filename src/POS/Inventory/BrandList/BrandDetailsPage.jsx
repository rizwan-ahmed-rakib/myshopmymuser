import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag, Calendar, Info, Trash2, Settings, Image as ImageIcon } from 'lucide-react';
import api from '../../../context_or_provider/pos/posApi';

import UpdateBrandModal from "./UpdateBrandModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import { posBrandAPI } from "../../../context_or_provider/pos/brands/brandAPI";
import SuccessModal from "../../components/SuccessModal";

/**
 * BrandDetailsPage - Refactored to use GenericModuleDetails and Backbone branding.
 */
const BrandDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const fetchBrandDetails = useCallback(async () => {
        try {
            const response = await api.get(`/api/products/brand/${id}/`);
            setBrand(response.data);
        } catch (error) {
            console.error("Error fetching brand details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBrandDetails();
    }, [fetchBrandDetails]);

    const handleUpdateSuccess = (updatedData) => {
        setBrand(prev => ({ ...prev, ...updatedData }));
        setEditOpen(false);
        setSuccessData(updatedData);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the brand "${brand?.title}"?`)) return;
        try {
            await posBrandAPI.delete(id);
            navigate("/inventory");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete brand.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <GenericModuleDetails
            title="Brand Details"
            subtitle={brand?.title}
            image={brand?.image}
            imageAlt={brand?.title}
            recordId={brand?.id}
            isLoading={loading}
            onEdit={() => setEditOpen(true)}
            accentColor="purple"
            heroIcon={<Tag />}
            infoItems={[
                { icon: <Calendar size={14} />, label: "Created", value: formatDate(brand?.created) },
                { icon: <Info size={14} />, label: "Status", value: "Active" }
            ]}
            actions={[
                {
                    icon: <Trash2 size={16} />,
                    label: "Delete",
                    onClick: handleDelete,
                    hoverColor: "hover:bg-rose-600 hover:text-white"
                }
            ]}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10 text-gray-800">
                            <div className="w-2 h-10 bg-purple-500 rounded-full shadow-lg shadow-purple-500/20"></div>
                            Brand Information
                        </h2>

                        <div className="grid gap-4">
                            <DetailsInfoCard 
                                icon={<Tag />} 
                                title="Brand Title" 
                                value={brand?.title} 
                                subValue={`Unique identifier for products`}
                                color="purple" 
                            />
                            <DetailsInfoCard 
                                icon={<ImageIcon />} 
                                title="Logo Status" 
                                value={brand?.image ? "Custom Logo Uploaded" : "System Placeholder"} 
                                color="blue" 
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">Identification</h2>
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-1.5 h-14 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">Brand ID</p>
                                    <p className="text-2xl font-black">#BRD-{brand?.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editOpen && (
                <UpdateBrandModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSuccess={handleUpdateSuccess}
                    productData={brand}
                />
            )}

            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title="Brand Updated"
                subtitle="Record synchronization complete"
                details={[
                    { label: "Brand Title", value: successData?.title },
                    { label: "Update Time", value: new Date().toLocaleTimeString() }
                ]}
            />
        </GenericModuleDetails>
    );
};

export default BrandDetailsPage;
