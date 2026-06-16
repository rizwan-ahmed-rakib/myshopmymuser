import React, {useState, useMemo, useEffect} from "react";
import AsyncSelect from "react-select/async";
import api from '../../../context_or_provider/pos/posApi';

import {posPurchaseProductAPI} from "../../../context_or_provider/pos/Purchase/purchaseProduct/productPurchaseAPI";
import {posPurchaseReturnAPI} from "../../../context_or_provider/pos/Purchase/purchaseReturnProduct/purchaseReturnAPI";
import BaseModal from "../../components/BaseModal";
import { Undo2, Search, FileText, Package, Banknote, CreditCard, Wallet, Info, AlertTriangle } from 'lucide-react';

/**
 * AddPurchaseReturnModal - Refactored to use BaseModal and standardized backbone layout.
 */
const AddPurchaseReturnModal = ({isOpen, onClose, onSuccess}) => {
    const [purchase, setPurchase] = useState(null);
    const [returnItems, setReturnItems] = useState({});
    const [itemPenalties, setItemPenalties] = useState({});
    const [globalPenalty, setGlobalPenalty] = useState(0);

    const [paidCash, setPaidCash] = useState(0);
    const [paidMobile, setPaidMobile] = useState(0);
    const [paidBank, setPaidBank] = useState(0);
    const [mobileOperator, setMobileOperator] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [bankAccountNo, setBankAccountNo] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("hand cash");
    const [loading, setLoading] = useState(false);
    const [returnedQuantitiesMap, setReturnedQuantitiesMap] = useState({});
    const [existingReturnId, setExistingReturnId] = useState(null);
    const [note, setNote] = useState("");
    const [returnReason, setReturnReason] = useState("");

    const [activeSerialTab, setActiveSerialTab] = useState(null);
    const [instances, setInstances] = useState({});
    const [returnedSerials, setReturnedSerials] = useState({});

    useEffect(() => {
        const counts = [paidCash > 0, paidMobile > 0, paidBank > 0].filter(Boolean).length;
        if (counts > 1) setPaymentMethod("hybrid");
        else if (paidMobile > 0) setPaymentMethod("mobile_banking");
        else if (paidBank > 0) setPaymentMethod("bank");
        else setPaymentMethod("hand cash");
    }, [paidCash, paidMobile, paidBank]);

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

    const totalReturnAmount = useMemo(() => {
        if (!purchase) return 0;
        return purchase.items.reduce((sum, item) => {
            const qty = Number(returnItems[item.id] || 0);
            return sum + qty * Number(item.unit_price);
        }, 0);
    }, [returnItems, purchase]);

    const totalItemPenalty = useMemo(() => {
        return Object.values(itemPenalties).reduce((sum, p) => sum + Number(p || 0), 0);
    }, [itemPenalties]);

    const netReturnAmount = totalReturnAmount - totalItemPenalty - Number(globalPenalty || 0);
    const totalPaid = Number(paidCash) + Number(paidMobile) + Number(paidBank);
    const dueAmount = netReturnAmount - totalPaid;

    const loadPurchaseOptions = async (input) => {
        const res = await posPurchaseProductAPI.search(input || "");
        return res.data.map(p => ({ value: p.id, label: `Invoice #${p.invoice_no}` }));
    };

    const handlePurchaseSelect = async (option) => {
        if (!option) { setPurchase(null); return; }
        const purchaseRes = await posPurchaseProductAPI.getById(option.value);
        const purchaseData = purchaseRes.data;
        const returnRes = await posPurchaseReturnAPI.getAll();
        const relatedReturns = returnRes.data.filter(r => r.purchase === option.value);

        if (relatedReturns.length > 0) {
            const latestReturn = relatedReturns[0];
            setExistingReturnId(latestReturn.id);
            setNote(latestReturn.note || "");
            setReturnReason(latestReturn.return_reason || "");
            setPaidCash(parseFloat(latestReturn.paid_cash) || 0);
            setPaidMobile(parseFloat(latestReturn.paid_mobile) || 0);
            setPaidBank(parseFloat(latestReturn.paid_bank) || 0);
            setGlobalPenalty(parseFloat(latestReturn.global_penalty) || 0);
        } else {
            setExistingReturnId(null);
            setNote(""); setReturnReason(""); setPaidCash(0); setPaidMobile(0); setPaidBank(0); setGlobalPenalty(0);
        }

        const newReturnedMap = {};
        relatedReturns.forEach(r => {
            r.items.forEach(i => { newReturnedMap[i.purchase_item] = (newReturnedMap[i.purchase_item] || 0) + i.purchase_return_quantity; });
        });
        setReturnedQuantitiesMap(newReturnedMap);
        setPurchase(purchaseData);
        setReturnItems({}); setItemPenalties({}); setReturnedSerials({});
        fetchInstances(purchaseData.invoice_no);
    };

    const handleQtyChange = (item, quantity) => {
        const qty = Number(quantity);
        const availableQuantity = item.quantity - (returnedQuantitiesMap[item.id] || 0);
        if (qty > availableQuantity) { alert("Exceeds available quantity"); return; }
        setReturnItems({ ...returnItems, [item.id]: qty });
        if (qty === 0) {
            const newPenalties = {...itemPenalties}; delete newPenalties[item.id]; setItemPenalties(newPenalties);
        }
    };

    const handleSubmit = async () => {
        if (!purchase) { alert("Please select a purchase invoice"); return; }
        const items = purchase.items.filter(i => Number(returnItems[i.id]) > 0).map(i => ({
            purchase_item: i.id, purchase_return_quantity: Number(returnItems[i.id]), unit_price: i.unit_price,
            penalty_amount: Number(itemPenalties[i.id] || 0), reason: returnReason || "Returned", returned_serials: returnedSerials[i.id] || [],
        }));
        if (!items.length) { alert("Select at least one item to return"); return; }

        const payload = {
            purchase: purchase.id, supplier: purchase.supplier, total_return_amount: totalReturnAmount, total_item_penalty: totalItemPenalty,
            global_penalty: Number(globalPenalty), net_return_amount: netReturnAmount, paid_cash: paidCash, paid_mobile: paidMobile, paid_bank: paidBank,
            mobile_operator: paidMobile > 0 ? mobileOperator : "", transaction_id: paidMobile > 0 ? transactionId : "", bank_account_no: paidBank > 0 ? bankAccountNo : "",
            payment_method: paymentMethod, note: note, return_reason: returnReason, items,
        };

        try {
            setLoading(true);
            let response;
            if (existingReturnId) response = await posPurchaseReturnAPI.update(existingReturnId, payload);
            else response = await posPurchaseReturnAPI.create(payload);
            onSuccess?.(response.data);
            resetForm();
        } catch (err) {
            console.error(err);
            alert(`Failed: ${err.response?.data?.message || err.message}`);
        } finally { setLoading(false); }
    };

    const resetForm = () => {
        setPurchase(null); setReturnItems({}); setItemPenalties({}); setGlobalPenalty(0); setPaidCash(0); setPaidMobile(0); setPaidBank(0);
        setReturnedQuantitiesMap({}); setExistingReturnId(null); setNote(""); setReturnReason(""); onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Record Purchase Return"
            size="xl"
            icon={<Undo2 className="text-white" />}
            showFooter={true}
            onSubmit={handleSubmit}
            submitText={existingReturnId ? "Update Return Record" : "Confirm Purchase Return"}
            isLoading={loading}
        >
            <div className="space-y-6">
                {/* Search Header */}
                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Search size={12} className="text-brand-primary" /> Find Original Invoice
                        </label>
                        <AsyncSelect
                            loadOptions={loadPurchaseOptions} onChange={handlePurchaseSelect} placeholder="Search by invoice number..." isClearable
                            styles={{ control: (base) => ({ ...base, borderRadius: '12px', padding: '2px' }) }}
                        />
                    </div>

                    {purchase && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Return Reason</label>
                                <textarea className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none" rows="1" value={returnReason} onChange={e => setReturnReason(e.target.value)} placeholder="e.g. Defective items" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Note</label>
                                <textarea className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" rows="1" value={note} onChange={e => setNote(e.target.value)} placeholder="Any internal remarks..." />
                            </div>
                        </div>
                    )}
                </div>

                {purchase ? (
                    <div className="space-y-6">
                        {/* Items Table */}
                        <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Avail.</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center w-24">Return</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-rose-500 uppercase tracking-widest text-right">Penalty</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right w-28">Total</th>
                                        <th className="px-5 py-3 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {purchase.items.map(item => {
                                        const alreadyReturned = returnedQuantitiesMap[item.id] || 0;
                                        const avail = item.quantity - alreadyReturned;
                                        const qty = Number(returnItems[item.id] || 0);
                                        const penalty = Number(itemPenalties[item.id] || 0);
                                        const total = (qty * Number(item.unit_price)) - penalty;

                                        return (
                                            <React.Fragment key={item.id}>
                                                <tr className="hover:bg-rose-50/20 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <p className="font-bold text-gray-900 text-sm">{item.product_name}</p>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">Bought: {item.quantity} units</p>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">{avail}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <input type="number" min="0" max={avail} className="w-full border border-gray-200 p-2 rounded-lg text-center font-black text-sm focus:border-rose-400 outline-none" value={returnItems[item.id] || ""} onChange={e => handleQtyChange(item, e.target.value)} />
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <input type="number" min="0" className="w-full border border-rose-100 p-2 rounded-lg text-right font-black text-sm text-rose-600 focus:border-rose-400 outline-none bg-rose-50/30" value={itemPenalties[item.id] || ""} onChange={e => setItemPenalties({ ...itemPenalties, [item.id]: Number(e.target.value) })} disabled={qty === 0} />
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className="font-black text-blue-700 text-sm">৳{total.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <button onClick={() => setActiveSerialTab(activeSerialTab === item.id ? null : item.id)} className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transition-all ${activeSerialTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>Serials</button>
                                                    </td>
                                                </tr>
                                                {activeSerialTab === item.id && (
                                                    <tr className="bg-blue-50/20">
                                                        <td colSpan="6" className="px-8 py-5">
                                                            <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-inner space-y-4">
                                                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">
                                                                    <span className="flex items-center gap-2"><Info size={12} className="text-blue-500" /> Return Serial Selection</span>
                                                                    <span className={`px-2 py-1 rounded-full ${returnedSerials[item.id]?.length === qty ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>Selected: {returnedSerials[item.id]?.length || 0} / {qty}</span>
                                                                </h4>
                                                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                                                    {(instances[item.product] || []).map(inst => {
                                                                        const isReturning = (returnedSerials[item.id] || []).includes(inst.unique_serial);
                                                                        const isSold = inst.status !== 'in_stock';
                                                                        return (
                                                                            <div key={inst.id} onClick={() => !isSold && setReturnedSerials(prev => {
                                                                                const curr = prev[item.id] || [];
                                                                                if (isReturning) return { ...prev, [item.id]: curr.filter(s => s !== inst.unique_serial) };
                                                                                if (curr.length >= qty) return prev;
                                                                                return { ...prev, [item.id]: [...curr, inst.unique_serial] };
                                                                            })} className={`p-2 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1 ${isReturning ? 'bg-rose-50 border-rose-200 text-rose-600' : isSold ? 'opacity-40 grayscale border-gray-100 cursor-not-allowed' : 'bg-white border-gray-100 hover:border-blue-300 shadow-sm'}`}>
                                                                                <span className="text-[9px] font-bold truncate w-full text-center">{inst.unique_serial.split('-').pop()}</span>
                                                                                <span className={`text-[7px] font-black px-1.5 rounded-full uppercase tracking-widest ${isReturning ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>{isReturning ? 'Returning' : 'Keep'}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                            {/* Collection Side */}
                            <div className="space-y-6">
                                <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Wallet size={14} className="text-brand-primary" /> Refund Collection
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cash</label>
                                            <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-emerald-600 text-sm focus:border-emerald-300 outline-none shadow-inner bg-white" value={paidCash} onChange={(e) => setPaidCash(Number(e.target.value))} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                                            <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-purple-600 text-sm focus:border-purple-300 outline-none shadow-inner bg-white" value={paidMobile} onChange={(e) => setPaidMobile(Number(e.target.value))} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank</label>
                                            <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl font-black text-blue-600 text-sm focus:border-blue-300 outline-none shadow-inner bg-white" value={paidBank} onChange={(e) => setPaidBank(Number(e.target.value))} />
                                        </div>
                                    </div>

                                    {(paidMobile > 0 || paidBank > 0) && (
                                        <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-3 animate-in slide-in-from-top-2">
                                            {paidMobile > 0 && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <select className="border border-gray-100 p-2 rounded-lg text-xs font-bold outline-none bg-gray-50" value={mobileOperator} onChange={(e) => setMobileOperator(e.target.value)}>
                                                        <option value="">Operator</option><option value="bkash">bKash</option><option value="nagad">Nagad</option>
                                                    </select>
                                                    <input className="border border-gray-100 p-2 rounded-lg text-xs font-bold outline-none bg-gray-50" placeholder="TxID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                                                </div>
                                            )}
                                            {paidBank > 0 && (
                                                <input className="w-full border border-gray-100 p-2 rounded-lg text-xs font-bold outline-none bg-gray-50" placeholder="Bank Reference / A/C" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Totals Side */}
                            <div className="bg-gray-900 text-white p-8 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-4">
                                        <span>Gross Return</span> <span className="font-mono text-base">৳{totalReturnAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                        <span className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Penalties</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-rose-500">Global:</span>
                                            <input type="number" className="w-20 bg-gray-800 border-none rounded-lg text-right p-1.5 font-black text-xs text-rose-400 outline-none focus:ring-1 focus:ring-rose-500" value={globalPenalty} onChange={e => setGlobalPenalty(Number(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-gray-400 font-black uppercase tracking-[0.3em]">Net Refund</span>
                                        <span className="font-mono font-black text-4xl text-green-400">৳{netReturnAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest">
                                        <span>Received Back</span> <span className="font-mono text-2xl text-white">৳{totalPaid.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em]">Pending Refund</p>
                                            <p className="text-xl font-black text-rose-500 font-mono">৳{dueAmount.toLocaleString()}</p>
                                        </div>
                                        {dueAmount > 0 && <AlertTriangle size={24} className="text-rose-500 opacity-50 animate-pulse" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto flex items-center justify-center text-gray-300"><Undo2 size={32} /></div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Please select an invoice to start return</p>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default AddPurchaseReturnModal;