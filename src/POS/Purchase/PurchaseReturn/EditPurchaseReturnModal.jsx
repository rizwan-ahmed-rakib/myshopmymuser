import React, {useState, useMemo, useEffect} from "react";
import api from '../../../context_or_provider/pos/posApi';

import {posPurchaseReturnAPI} from "../../../context_or_provider/pos/Purchase/purchaseReturnProduct/purchaseReturnAPI";
import BaseModal from "../../components/BaseModal";
import { Undo2, Package, Banknote, CreditCard, Wallet, Info, AlertTriangle, Trash2 } from 'lucide-react';

/**
 * EditPurchaseReturnModal - Refactored to use BaseModal and standardized backbone layout.
 */
const EditPurchaseReturnModal = ({open, onClose, purchase, onUpdated}) => {
    const [editableReturn, setEditablePurchase] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeSerialTab, setActiveSerialTab] = useState(null);
    const [instances, setInstances] = useState({});
    const [returnedSerials, setReturnedSerials] = useState({});

    useEffect(() => {
        if (purchase) {
            setEditablePurchase(JSON.parse(JSON.stringify(purchase)));
            fetchInstances(purchase.purchase_invoice_no);
            const serials = {};
            purchase.items.forEach(item => {
                serials[item.id] = item.returned_serials || [];
            });
            setReturnedSerials(serials);
        }
    }, [purchase]);

    const fetchInstances = async (invoiceNo) => {
        try {
            const response = await api.get(`/api/bar-qr/instances/?purchase_invoice_no=${invoiceNo}`);
            const grouped = response.data.reduce((acc, curr) => {
                const pid = curr.product;
                if (!acc[pid]) acc[pid] = [];
                acc[pid].push(curr);
                return acc;
            }, {});
            setInstances(grouped);
        } catch (err) { console.error(err); }
    };

    const calculateTotals = (data) => {
        const totalReturnAmount = data.items.reduce((sum, item) => sum + (Number(item.purchase_return_quantity || 0) * Number(item.unit_price)), 0);
        const totalItemPenalty = data.items.reduce((sum, item) => sum + Number(item.penalty_amount || 0), 0);
        const netReturnAmount = totalReturnAmount - totalItemPenalty - Number(data.global_penalty || 0);
        const totalPaid = Number(data.paid_cash || 0) + Number(data.paid_mobile || 0) + Number(data.paid_bank || 0);
        const dueAmount = netReturnAmount - totalPaid;

        return { ...data, total_return_amount: totalReturnAmount, total_item_penalty: totalItemPenalty, net_return_amount: netReturnAmount, paid_amount: totalPaid, due_amount: dueAmount };
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...editableReturn.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setEditablePurchase(calculateTotals({ ...editableReturn, items: updatedItems }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = { ...editableReturn, items: editableReturn.items.map(item => ({ ...item, returned_serials: returnedSerials[item.id] || [] })) };
            const response = await posPurchaseReturnAPI.update(purchase.id, payload);
            onUpdated(response.data);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Update failed.");
        } finally { setLoading(false); }
    };

    if (!open || !editableReturn) return null;

    return (
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={`Edit Purchase Return #${editableReturn.id}`}
            size="xl"
            icon={<Undo2 className="text-white" />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText="Update Return Record"
            isLoading={loading}
        >
            <div className="space-y-6">
                <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-rose-400 tracking-[0.2em]">Original Invoice</p>
                        <p className="text-xl font-black text-gray-800">#{editableReturn.purchase_invoice_no}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">Supplier</p>
                        <p className="font-bold text-gray-700">{editableReturn.supplier_name}</p>
                    </div>
                </div>

                <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product</th>
                                <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center w-24">Qty</th>
                                <th className="px-5 py-3 text-[10px] font-black text-rose-500 uppercase tracking-widest text-right">Penalty</th>
                                <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-32">Total</th>
                                <th className="px-5 py-3 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {editableReturn.items.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-4 font-bold text-gray-900 text-sm">{item.product_name}</td>
                                        <td className="px-5 py-4">
                                            <input type="number" className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm outline-none" value={item.purchase_return_quantity} onChange={(e) => handleItemChange(index, "purchase_return_quantity", e.target.value)} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <input type="number" className="w-full border border-rose-100 p-2 rounded-lg text-right font-black text-sm text-rose-600 outline-none bg-rose-50/30" value={item.penalty_amount} onChange={(e) => handleItemChange(index, "penalty_amount", e.target.value)} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <span className="font-black text-blue-700 text-sm">৳{parseFloat(item.total_price).toLocaleString()}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <button onClick={() => setActiveSerialTab(activeSerialTab === item.id ? null : item.id)} className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transition-all ${activeSerialTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>Serials</button>
                                        </td>
                                    </tr>
                                    {activeSerialTab === item.id && (
                                        <tr className="bg-blue-50/20">
                                            <td colSpan="5" className="px-8 py-5">
                                                <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-inner space-y-4">
                                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                                        <span className="flex items-center gap-2"><Info size={12} className="text-blue-500" /> Manage Return Serials</span>
                                                        <span className={`px-2 py-1 rounded-full ${returnedSerials[item.id]?.length === Number(item.purchase_return_quantity) ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>Selected: {returnedSerials[item.id]?.length || 0} / {item.purchase_return_quantity}</span>
                                                    </h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                                        {(instances[item.product] || []).map(inst => {
                                                            const isReturning = (returnedSerials[item.id] || []).includes(inst.unique_serial);
                                                            const isSold = inst.status !== 'in_stock';
                                                            return (
                                                                <div key={inst.id} onClick={() => !isSold && setReturnedSerials(prev => {
                                                                    const curr = prev[item.id] || [];
                                                                    if (isReturning) return { ...prev, [item.id]: curr.filter(s => s !== inst.unique_serial) };
                                                                    if (curr.length >= Number(item.purchase_return_quantity)) return prev;
                                                                    return { ...prev, [item.id]: [...curr, inst.unique_serial] };
                                                                })} className={`p-2 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1 ${isReturning ? 'bg-rose-50 border-rose-200 text-rose-600' : isSold ? 'opacity-40 grayscale border-gray-100' : 'bg-white border-gray-100 hover:border-blue-300'}`}>
                                                                    <span className="text-[9px] font-bold truncate w-full text-center">{inst.unique_serial.split('-').pop()}</span>
                                                                    <span className={`text-[7px] font-black px-1.5 rounded-full uppercase tracking-widest ${isReturning ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>{isReturning ? 'Returning' : 'Keep'}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-6">
                        <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Wallet size={14} className="text-brand-primary" /> Refund Reconciliation
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash</label>
                                    <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm outline-none" value={editableReturn.paid_cash} onChange={(e) => handleTopLevelChange("paid_cash", e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                                    <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm outline-none" value={editableReturn.paid_mobile} onChange={(e) => handleTopLevelChange("paid_mobile", e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank</label>
                                    <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm outline-none" value={editableReturn.paid_bank} onChange={(e) => handleTopLevelChange("paid_bank", e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border border-amber-100 bg-amber-50/30 rounded-2xl space-y-2">
                            <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest ml-1">Update Return Reason</label>
                            <textarea className="w-full border-none bg-transparent text-xs font-bold text-gray-700 outline-none p-0" rows="2" value={editableReturn.return_reason} onChange={(e) => setEditablePurchase({ ...editableReturn, return_reason: e.target.value })} />
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-8 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-4">
                                <span>Gross Return</span> <span className="font-mono text-base">৳{parseFloat(editableReturn.total_return_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                <span className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em]">Global Penalty</span>
                                <input type="number" className="w-20 bg-gray-800 border-none rounded-lg text-right p-1.5 font-black text-xs text-rose-400 outline-none" value={editableReturn.global_penalty} onChange={(e) => handleTopLevelChange("global_penalty", e.target.value)} />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-400 font-black uppercase tracking-[0.3em]">Net Refund</span>
                                <span className="font-mono font-black text-4xl text-green-400">৳{parseFloat(editableReturn.net_return_amount).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">
                                <span>Total Received</span> <span className="font-mono text-2xl text-white">৳{editableReturn.paid_amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em]">Pending Refund</p>
                                    <p className="text-xl font-black text-rose-500 font-mono">৳{editableReturn.due_amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );

    function handleTopLevelChange(field, value) {
        setEditablePurchase(calculateTotals({ ...editableReturn, [field]: value }));
    }
};

export default EditPurchaseReturnModal;