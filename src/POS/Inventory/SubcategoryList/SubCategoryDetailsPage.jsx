import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layers, Calendar, Info, Trash2, GitCommit, Image as ImageIcon, Box } from 'lucide-react';
import api from '../../../context_or_provider/pos/posApi';

import UpdateSubcategoryModal from "./UpdateSubcategoryModal";
import GenericModuleDetails from "../../components/GenericModuleDetails";
import DetailsInfoCard from "../../components/DetailsInfoCard";
import { posSubCategoryAPI } from "../../../context_or_provider/pos/subcategories/subCategoryApi";
import SuccessModal from "../../components/SuccessModal";

/**
 * SubCategoryDetailsPage - Refactored to use GenericModuleDetails and Backbone branding.
 */
const SubCategoryDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subcategory, setSubcategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const fetchSubCategoryDetails = useCallback(async () => {
        try {
            const response = await api.get(`/api/products/subcategory/${id}/`);
            setSubcategory(response.data);
        } catch (error) {
            console.error("Error fetching subcategory details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSubCategoryDetails();
    }, [fetchSubCategoryDetails]);

    const handleUpdateSuccess = (updatedData) => {
        setSubcategory(prev => ({ ...prev, ...updatedData }));
        setEditOpen(false);
        setSuccessData(updatedData);
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the subcategory "${subcategory?.title}"?`)) return;
        try {
            await posSubCategoryAPI.delete(id);
            navigate("/inventory");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete subcategory.");
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
            title="Subcategory Details"
            subtitle={subcategory?.title}
            image={subcategory?.image}
            imageAlt={subcategory?.title}
            recordId={subcategory?.id}
            isLoading={loading}
            onEdit={() => setEditOpen(true)}
            accentColor="orange"
            heroIcon={<GitCommit />}
            infoItems={[
                { icon: <Calendar size={14} />, label: "Created", value: formatDate(subcategory?.created) },
                { icon: <Box size={14} />, label: "Parent Category", value: `ID: ${subcategory?.category}` }
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
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-4 mb-10 text-gray-800">
                            <div className="w-2 h-10 bg-orange-500 rounded-full shadow-lg shadow-orange-500/20"></div>
                            Subcategory Hierarchy
                        </h2>

                        <div className="grid gap-4">
                            <DetailsInfoCard 
                                icon={<GitCommit />} 
                                title="Subcategory Label" 
                                value={subcategory?.title} 
                                subValue={`Linked to Parent Category #${subcategory?.category}`}
                                color="orange" 
                            />
                            <DetailsInfoCard 
                                icon={<Layers />} 
                                title="Classification Level" 
                                value="Secondary Grouping" 
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
                                <div className="w-1.5 h-14 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-orange-400 tracking-widest mb-1">Subcategory ID</p>
                                    <p className="text-2xl font-black">#SUB-{subcategory?.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editOpen && (
                <UpdateSubcategoryModal
                    isOpen={editOpen}
                    onClose={() => setEditOpen(false)}
                    onSuccess={handleUpdateSuccess}
                    productData={subcategory}
                />
            )}

            <SuccessModal 
                isOpen={!!successData} 
                onClose={() => setSuccessData(null)} 
                title="Subcategory Updated"
                subtitle="Hierarchy synchronized"
                details={[
                    { label: "Subcategory", value: successData?.title },
                    { label: "Parent ID", value: successData?.category },
                    { label: "Update Time", value: new Date().toLocaleTimeString() }
                ]}
            />
        </GenericModuleDetails>
    );
};

export default SubCategoryDetailsPage;
