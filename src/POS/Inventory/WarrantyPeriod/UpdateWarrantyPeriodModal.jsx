import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ShieldCheck, Calendar, Clock, CheckCircle, Settings } from 'lucide-react';
import { posWarrantyPeriodAPI } from '../../../context_or_provider/pos/warrantyPeriod/WarrantyPeriodAPI';
import BaseModal from "../../components/BaseModal";
import { useForm } from "../../../hooks/profile";

/**
 * UpdateWarrantyPeriodModal - Refactored to use BaseModal and match Backbone pattern.
 */
const UpdateWarrantyPeriodModal = ({ isOpen, onClose, onSuccess, warrantyData }) => {
    const [loading, setLoading] = useState(false);

    const {
        form,
        errors,
        handleChange,
        setFormData,
        validateForm,
        setFormField
    } = useForm(
        {
            name: '',
            duration: '',
            period_type: 'month',
            is_active: true,
        },
        {
            name: (v) => !v ? "Warranty name is required" : null,
            duration: (v) => !v ? "Duration is required" : isNaN(v) ? "Must be a number" : null,
        }
    );

    useEffect(() => {
        if (warrantyData && isOpen) {
            setFormData({
                name: warrantyData.name || '',
                duration: warrantyData.duration || '',
                period_type: warrantyData.period_type || 'month',
                is_active: warrantyData.is_active !== undefined ? warrantyData.is_active : true,
            });
        }
    }, [warrantyData, isOpen, setFormData]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await posWarrantyPeriodAPI.update(warrantyData.id, form);
            onSuccess?.(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Update failed: " + (err.response?.data ? JSON.stringify(err.response.data) : "Network error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Warranty Plan"
            subtitle={`Ref: #WRP-${warrantyData?.id}`}
            size="md"
            icon={<Settings />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Save Changes"
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Plan Name *</label>
                    <div className="relative">
                        <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            name="name" 
                            value={form.name} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                        />
                    </div>
                    {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Duration Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Clock size={12}/> Duration *</label>
                        <input 
                            type="number" 
                            name="duration" 
                            value={form.duration} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-black text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                        />
                        {errors.duration && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.duration}</p>}
                    </div>

                    {/* Period Type */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={12}/> Period Type</label>
                        <select 
                            name="period_type" 
                            value={form.period_type} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 outline-none appearance-none transition-all"
                        >
                            <option value="day">Days</option>
                            <option value="month">Months</option>
                            <option value="year">Years</option>
                        </select>
                    </div>
                </div>

                {/* Status Toggle */}
                <div 
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${form.is_active ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}
                    onClick={() => setFormField("is_active", !form.is_active)}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${form.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            <CheckCircle size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Active Plan</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{form.is_active ? 'ENABLED' : 'DISABLED'}</p>
                        </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${form.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.is_active ? 'left-6' : 'left-1'}`}></div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

UpdateWarrantyPeriodModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    warrantyData: PropTypes.object.isRequired,
};

export default UpdateWarrantyPeriodModal;
