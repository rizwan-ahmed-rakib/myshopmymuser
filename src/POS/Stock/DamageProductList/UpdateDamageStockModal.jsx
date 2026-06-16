import React, { useState, useEffect } from "react";
import api from '../../../context_or_provider/pos/posApi';
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { posProductAPI } from "../../../context_or_provider/pos/products/productAPI";
import { posSupplierAPI } from "../../../context_or_provider/pos/Purchase/suppliers/supplierAPI";
import { posCustomerAPI } from "../../../context_or_provider/pos/Sale/customer/PosCustomerAPI";

import BaseModal from "../../components/BaseModal";
import { AlertTriangle, Package, User, Building, Hash, ClipboardList, Wallet, FileText, CheckCircle, Edit3 } from 'lucide-react';

/**
 * UpdateDamageStockModal - Refactored to use BaseModal and standardized backbone layout.
 */
const UpdateDamageStockModal = ({ isOpen, onClose, onSuccess, recordData }) => {
    const [form, setForm] = useState({
        product: null,
        quantity: "",
        damage_type: "non_returnable",
        reason: "",
        notes: "",
        reference_no: "",
        unit_cost: "",
        total_loss: 0,
        supplier: null,
        customer: null,
        is_compensated: false,
        compensated_amount: 0,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (recordData && isOpen) {
            setForm({
                product: { value: recordData.product, label: recordData.product_name, cost: recordData.unit_cost },
                quantity: recordData.quantity || "",
                damage_type: recordData.damage_type || "non_returnable",
                reason: recordData.reason || "",
                notes: recordData.notes || "",
                reference_no: recordData.reference_no || "",
                unit_cost: recordData.unit_cost || "",
                total_loss: recordData.total_loss || 0,
                supplier: recordData.supplier ? { value: recordData.supplier, label: recordData.supplier_name } : null,
                customer: recordData.customer ? { value: recordData.customer, label: recordData.customer_name } : null,
                is_compensated: recordData.is_compensated || false,
                compensated_amount: recordData.compensated_amount || 0,
            });
        }
    }, [recordData, isOpen]);

    // Auto-calculate total loss
    useEffect(() => {
        const qty = parseFloat(form.quantity) || 0;
        const cost = parseFloat(form.unit_cost) || 0;
        setForm(prev => ({ ...prev, total_loss: (qty * cost).toFixed(2) }));
    }, [form.quantity, form.unit_cost]);

    const loadProductOptions = async (inputValue) => {
        if (!inputValue) return [];
        const res = await posProductAPI.search(inputValue);
        return res.data.map(p => ({
            value: p.id,
            label: `${p.name} (${p.product_code})`,
            cost: p.purchase_price
        }));
    };

    const loadSupplierOptions = async (input) => {
        const res = await posSupplierAPI.search(input || "");
        return res.data.map(s => ({ value: s.id, label: s.name }));
    };

    const loadCustomerOptions = async (input) => {
        const res = await posCustomerAPI.search(input || "");
        return res.data.map(c => ({ value: c.id, label: c.name }));
    };

    const handleSubmit = async (e) => {
        if(e) e.preventDefault();
        setLoading(true);
        setErrors({});

        const payload = {
            ...form,
            product: form.product.value,
            supplier: form.supplier?.value || null,
            customer: form.customer?.value || null,
        };

        try {
            const res = await api.patch(`/api/products/damage-stock/${recordData.id}/`, payload);
            onSuccess?.(res.data);
            onClose();
        } catch (err) {
            setErrors(err.response?.data || { message: "Failed to update record" });
        } finally {
            setLoading(false);
        }
    };

    const customSelectStyles = {
        control: (base) => ({ ...base, borderRadius: '0.75rem', padding: '2px', border: '1px solid #e5e7eb' }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit Damage Record #${recordData?.id}`}
            size="lg"
            icon={<Edit3 className="text-white" />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Update Changes"
            isLoading={loading}
        >
            <div className="space-y-6">
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 grid md:grid-cols-2 gap-5 items-end">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest ml-1 flex items-center gap-1.5">
                            <Package size={12} /> Product *
                        </label>
                        <AsyncSelect
                            cacheOptions defaultOptions loadOptions={loadProductOptions} value={form.product}
                            onChange={(opt) => setForm(prev => ({ ...prev, product: opt, unit_cost: opt?.cost || prev.unit_cost }))}
                            placeholder="Search..." styles={customSelectStyles} menuPortalTarget={document.body}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-1.5">
                            <Hash size={12} /> Reference No
                        </label>
                        <input value={form.reference_no} onChange={e => setForm({...form, reference_no: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Quantity *</label>
                        <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-center text-rose-600 outline-none shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Unit Cost (৳)</label>
                        <input type="number" value={form.unit_cost} onChange={e => setForm({...form, unit_cost: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-right text-gray-700 outline-none shadow-inner" />
                    </div>
                    <div className="bg-gray-900 p-3 rounded-xl flex flex-col justify-center items-end">
                        <label className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Calculated Loss</label>
                        <p className="text-lg font-black text-white font-mono">৳{parseFloat(form.total_loss).toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Damage Type</label>
                        <select value={form.damage_type} onChange={e => setForm({...form, damage_type: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-xl font-bold text-gray-700 outline-none bg-white">
                            <option value="non_returnable">Non-Returnable</option>
                            <option value="returnable">Returnable</option>
                        </select>
                    </div>
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="edit-compensated" checked={form.is_compensated} onChange={e => setForm({...form, is_compensated: e.target.checked})} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
                            <label htmlFor="edit-compensated" className="text-[10px] font-black uppercase text-emerald-700 tracking-widest cursor-pointer">Compensated</label>
                        </div>
                        {form.is_compensated && (
                            <input type="number" value={form.compensated_amount} onChange={e => setForm({...form, compensated_amount: e.target.value})} placeholder="Amount ৳" className="w-24 border border-emerald-200 p-1.5 rounded-lg text-right font-black text-xs text-emerald-700 outline-none shadow-inner" />
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-1.5"><ClipboardList size={12} /> Reason & Notes</label>
                    <textarea value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} rows="3" className="w-full border border-gray-200 p-3 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-50/50 shadow-inner" />
                </div>
            </div>
        </BaseModal>
    );
};

export default UpdateDamageStockModal;